-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "scansUsed" INTEGER NOT NULL DEFAULT 0,
    "adsWatched" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "scan_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_clerkId_key" ON "user"("clerkId");

-- CreateIndex
CREATE INDEX "scan_usage_userId_date_idx" ON "scan_usage"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "scan_usage_userId_date_key" ON "scan_usage"("userId", "date");

-- AddForeignKey
ALTER TABLE "scan_usage" ADD CONSTRAINT "scan_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
