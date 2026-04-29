-- CreateTable
CREATE TABLE "interest_list_entry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "interest_list_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interest_list_entry_createdAt_idx" ON "interest_list_entry"("createdAt");
