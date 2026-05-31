import { getPrisma } from "@/utils/prisma";

function slugify(name: string): string {
  return "mg-" + name.toLowerCase().replace(/\s+/g, "-");
}

function buildRefData(
  equipment: { id: string; name: string; category: string }[],
  exercises: { id: string; name: string; muscleGroupName: string; requiredEquipmentIds: string[] }[],
) {
  const seen = new Set<string>();
  const muscleGroups: { id: string; name: string }[] = [];
  const mappedExercises: { id: string; name: string; muscleGroupId: string; requiredEquipmentIds: string[] }[] = [];
  const exerciseEquipment: Record<string, string[]> = {};

  for (const ex of exercises) {
    if (!seen.has(ex.muscleGroupName)) {
      seen.add(ex.muscleGroupName);
      muscleGroups.push({ id: slugify(ex.muscleGroupName), name: ex.muscleGroupName });
    }

    mappedExercises.push({
      id: ex.id,
      name: ex.name,
      muscleGroupId: slugify(ex.muscleGroupName),
      requiredEquipmentIds: ex.requiredEquipmentIds,
    });

    if (ex.requiredEquipmentIds.length > 0) {
      exerciseEquipment[ex.id] = ex.requiredEquipmentIds;
    }
  }

  return { muscleGroups, exercises: mappedExercises, equipment, exerciseEquipment };
}

export type RefDataPayload = ReturnType<typeof buildRefData>;

export async function ReferenceDataProvider() {
  const prisma = getPrisma();

  const [equipment, exercises] = await Promise.all([
    prisma.equipment.findMany({ orderBy: { name: "asc" } }),
    prisma.exercise.findMany({ orderBy: { name: "asc" } }),
  ]);

  const payload = buildRefData(equipment, exercises);

  return (
    <script
      id="ref-data"
      type="application/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
