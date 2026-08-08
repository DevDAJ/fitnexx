import { auth } from "@clerk/nextjs/server";
import type { AiProviderConfig, ScanResult } from "@fitnexx/shared";
import {
  computeScanQuota,
  DEFAULT_SYSTEM_PROMPT,
  scanFoodWithProvider,
} from "@fitnexx/shared";
import { getPrisma } from "@/utils/prisma";

const MAX_IMAGE_BYTES = 20_000_000;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getOrCreateUser(
  prisma: ReturnType<typeof getPrisma>,
  clerkId: string,
) {
  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });
}

export async function POST(request: Request) {
  if (!process.env.CLERK_SECRET_KEY) {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const imageBase64 = body?.imageBase64;
  const mimeType =
    typeof body?.mimeType === "string" ? body.mimeType : "image/jpeg";
  const context = typeof body?.context === "string" ? body.context : "";

  if (typeof imageBase64 !== "string" || imageBase64.length < 10) {
    return Response.json({ error: "image_required" }, { status: 400 });
  }
  if (imageBase64.length > MAX_IMAGE_BYTES) {
    return Response.json({ error: "image_too_large" }, { status: 413 });
  }

  const prisma = getPrisma();
  const user = await getOrCreateUser(prisma, userId);
  const today = todayKey();
  const usage = await prisma.scanUsage.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: {},
    create: { userId: user.id, date: today },
  });

  const quota = computeScanQuota(usage.scansUsed, usage.adsWatched);
  if (quota.remaining <= 0) {
    return Response.json({ error: "quota_exhausted", quota }, { status: 429 });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    return Response.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const config: AiProviderConfig = {
    provider: "openai-compatible",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "meta-llama/llama-3.2-11b-vision-instruct",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  };

  let result: ScanResult;
  try {
    result = await scanFoodWithProvider(config, {
      imageBase64,
      mimeType,
      context,
      apiKey: openRouterKey,
    });
  } catch {
    return Response.json({ error: "provider_error" }, { status: 502 });
  }

  await prisma.scanUsage.update({
    where: { userId_date: { userId: user.id, date: today } },
    data: { scansUsed: { increment: 1 } },
  });

  return Response.json({
    result,
    quota: computeScanQuota(usage.scansUsed + 1, usage.adsWatched),
  });
}
