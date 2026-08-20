import type { Workout, WeightUnit } from "../types";
import { MUSCLES, type Muscle } from "../../constants/muscles";
import { getRemoteExerciseByName } from "../exerciseDatabase";
import { SET_TYPE_FACTORS } from "../types";

export interface MuscleTrendPoint {
  label: string;
  date: Date;
  muscles: Record<string, number>;
}

export async function computeMuscleTrend(
  workouts: Workout[],
  windowDays: number,
  weightUnit: WeightUnit
): Promise<MuscleTrendPoint[]> {
  const now = Date.now();
  const stepDays = 7;
  const points: MuscleTrendPoint[] = [];

  for (let i = windowDays; i >= 0; i -= stepDays) {
    const start = now - (i + stepDays) * 86400000;
    const end = now - i * 86400000;
    const inWindow = workouts.filter((w) => {
      const t = new Date(w.date).getTime();
      return t >= start && t < end;
    });

    const muscleSets: Record<string, number> = {};
    for (const workout of inWindow) {
      for (const exercise of workout.exercises) {
        const asset = await getRemoteExerciseByName(exercise.exerciseName);
        if (!asset) continue;

        for (const set of exercise.sets) {
          const factor = SET_TYPE_FACTORS[set.setType] ?? 1.0;
          if (factor === 0) continue;

          const primary = asset.primaryMuscle as Muscle;
          if (MUSCLES.includes(primary)) {
            muscleSets[primary] = (muscleSets[primary] || 0) + factor;
          }
          for (const secondary of asset.secondaryMuscles) {
            if (MUSCLES.includes(secondary as Muscle)) {
              muscleSets[secondary] = (muscleSets[secondary] || 0) + factor * 0.5;
            }
          }
        }
      }
    }

    const d = new Date(end);
    points.push({
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      date: d,
      muscles: muscleSets,
    });
  }
  return points;
}
