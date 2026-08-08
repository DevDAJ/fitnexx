-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroupName" TEXT NOT NULL,
    "requiredEquipmentIds" TEXT[],

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipment_name_key" ON "equipment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_name_key" ON "exercise"("name");
