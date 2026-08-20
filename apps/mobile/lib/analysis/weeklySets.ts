import type { Workout, MuscleWeeklyData, WeightUnit } from "../types";
import { SET_TYPE_FACTORS } from "../types";
import { MUSCLES, type Muscle } from "../../constants/muscles";
import { getRemoteExerciseByName } from "../exerciseDatabase";
import { calculateHypertrophyScore } from "./hypertrophyScore";

export async function computeWeeklySets(
  workouts: Workout[],
  windowDays: number,
  weightUnit: WeightUnit
): Promise<MuscleWeeklyData[]> {
  const cutoff = new Date(Date.now() - windowDays * 86400000);
  const windowWorkouts = workouts.filter(
    (w) => new Date(w.date) >= cutoff
  );

  const weeksInWindow = Math.max(windowDays / 7, 1);

  const muscleSetCounts = new Map<string, number>();
  for (const muscle of MUSCLES) {
    muscleSetCounts.set(muscle, 0);
  }

  for (const workout of windowWorkouts) {
    for (const exercise of workout.exercises) {
      const asset = await getRemoteExerciseByName(exercise.exerciseName);
      if (!asset) continue;

      for (const set of exercise.sets) {
        const factor = SET_TYPE_FACTORS[set.setType] ?? 1.0;
        if (factor === 0) continue;

        const primary = asset.primaryMuscle as Muscle;
        if (MUSCLES.includes(primary)) {
          muscleSetCounts.set(
            primary,
            (muscleSetCounts.get(primary) || 0) + factor
          );
        }

        for (const secondary of asset.secondaryMuscles) {
          if (MUSCLES.includes(secondary as Muscle)) {
            muscleSetCounts.set(
              secondary,
              (muscleSetCounts.get(secondary) || 0) + factor * 0.5
            );
          }
        }
      }
    }
  }

  return MUSCLES.map((muscle) => {
    const totalSets = muscleSetCounts.get(muscle) || 0;
    const weeklySets = totalSets / weeksInWindow;
    return {
      muscle,
      weeklySets: Math.round(weeklySets * 10) / 10,
      hypertrophyScore: calculateHypertrophyScore(weeklySets, "intermediate"),
    };
  }).filter((m) => m.weeklySets > 0);
}

export function getTopMuscles(
  data: MuscleWeeklyData[],
  count: number
): MuscleWeeklyData[] {
  return [...data]
    .sort((a, b) => b.weeklySets - a.weeklySets)
    .slice(0, count);
}
