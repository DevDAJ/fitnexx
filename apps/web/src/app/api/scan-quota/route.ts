import { auth } from "@clerk/nextjs/server";
import { computeScanQuota } from "@fitnexx/shared";
import { getPrisma } from "@/utils/prisma";

export async function GET() {
  if (!process.env.CLERK_SECRET_KEY) {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: { clerkId: userId },
  });

  const today = new Date().toISOString().slice(0, 10);
  const usage = await prisma.scanUsage.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: {},
    create: { userId: user.id, date: today },
  });

  return Response.json({
    date: today,
    ...computeScanQuota(usage.scansUsed, usage.adsWatched),
  });
}
