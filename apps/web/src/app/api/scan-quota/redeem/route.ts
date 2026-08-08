import { auth } from "@clerk/nextjs/server";
import { computeScanQuota } from "@fitnexx/shared";
import { getPrisma } from "@/utils/prisma";

export async function POST() {
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
  await prisma.scanUsage.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: {},
    create: { userId: user.id, date: today },
  });

  const updated = await prisma.scanUsage.update({
    where: { userId_date: { userId: user.id, date: today } },
    data: { adsWatched: { increment: 1 } },
  });

  return Response.json({
    date: today,
    ...computeScanQuota(updated.scansUsed, updated.adsWatched),
  });
}
