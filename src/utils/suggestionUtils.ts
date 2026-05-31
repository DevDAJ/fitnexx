import type { Exercise } from "@/types/performanceTypes";

export type Alternative = {
  exercise: Exercise;
  matchScore: number;
  reason: string;
  missingEquipment: string[];
};

export function findAlternatives(
  exercise: Exercise,
  ownedEquipmentIds: string[],
  allExercises: Exercise[],
  exerciseEquipment: Record<string, string[]>,
  recentExerciseIds: string[],
  equipmentNames: Record<string, string>,
): Alternative[] {
  const required = exerciseEquipment[exercise.id] ?? [];

  // if exercise has no equipment requirements, no suggestion needed
  if (required.length === 0) return [];

  const missing = required.filter((id) => !ownedEquipmentIds.includes(id));

  // if all equipment is owned, no suggestion needed
  if (missing.length === 0) return [];

  // find same-muscle-group exercises
  const candidates = allExercises.filter(
    (ex) =>
      ex.id !== exercise.id && ex.muscleGroupId === exercise.muscleGroupId,
  );

  const scored = candidates
    .map((ex) => {
      const exRequired = exerciseEquipment[ex.id] ?? [];
      // skip exercises that require something user doesn't have
      const exMissing = exRequired.filter(
        (id) => !ownedEquipmentIds.includes(id),
      );
      if (exMissing.length > 0) return null;

      // score: higher is better
      // - exercises user has done before get +10
      // - exercises with matching equipment count get + equipment count
      let score = exRequired.length > 0 ? exRequired.length : 5;
      if (recentExerciseIds.includes(ex.id)) score += 10;

      const missingNames = missing.map(
        (id) => equipmentNames[id] ?? id,
      );

      return {
        exercise: ex,
        matchScore: score,
        reason: `You don't have ${missingNames.join(", ")}. Try ${ex.name} instead.`,
        missingEquipment: missing,
      };
    })
    .filter((v): v is Alternative => v !== null);

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
}

export function checkExerciseAvailable(
  exercise: Exercise,
  ownedEquipmentIds: string[],
  exerciseEquipment: Record<string, string[]>,
): { available: boolean; missingEquipment: string[] } {
  const required = exerciseEquipment[exercise.id] ?? [];
  if (required.length === 0) return { available: true, missingEquipment: [] };
  const missing = required.filter((id) => !ownedEquipmentIds.includes(id));
  return {
    available: missing.length === 0,
    missingEquipment: missing,
  };
}
