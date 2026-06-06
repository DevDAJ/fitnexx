import { cache } from "react";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

export const getPrisma = cache(() => {
  const connectionString =
    process.env.FITNEXX_PRISMA_DATABASE_URL ?? process.env.FITNEXX_POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "Missing FITNEXX_PRISMA_DATABASE_URL or FITNEXX_POSTGRES_URL",
    );
  }

  const adapter = new PrismaPg({ connectionString, maxUses: 1 });
  return new PrismaClient({ adapter });
});
