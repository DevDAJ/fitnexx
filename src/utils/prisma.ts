import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString =
    process.env.FITNEXX_PRISMA_DATABASE_URL ?? process.env.FITNEXX_POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "Missing FITNEXX_PRISMA_DATABASE_URL or FITNEXX_POSTGRES_URL",
    );
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });
  globalForPrisma.prisma = prisma;

  return prisma;
}
