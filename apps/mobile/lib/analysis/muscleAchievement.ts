import type { Workout } from "../types";
import { MUSCLES, type Muscle } from "../../constants/muscles";
import { getRemoteExerciseByName } from "../exerciseDatabase";
import { SET_TYPE_FACTORS } from "../types";

export interface MuscleAchievement {
  muscle: Muscle;
  lifetimeSets: number;
  tierIndex: number;
  tierName: string;
  tierIcon: string;
  progressToNext: number;
  hypertrophyScore: number;
}

const TIERS = [
  { name: "Seedling", minSets: 0, icon: "🌱" },
  { name: "Sprout", minSets: 10, icon: "🌿" },
  { name: "Sapling", minSets: 30, icon: "🌳" },
  { name: "Foundation", minSets: 60, icon: "🏗️" },
  { name: "Builder", minSets: 120, icon: "🔨" },
  { name: "Sculptor", minSets: 250, icon: "🗿" },
  { name: "Elite", minSets: 500, icon: "⭐" },
  { name: "Master", minSets: 1000, icon: "👑" },
  { name: "Legend", minSets: 2000, icon: "🏆" },
];

export async function computeMuscleAchievements(
  workouts: Workout[]
): Promise<MuscleAchievement[]> {
  const muscleSetCounts = new Map<Muscle, number>();
  for (const m of MUSCLES) muscleSetCounts.set(m, 0);

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const asset = await getRemoteExerciseByName(exercise.exerciseName);
      if (!asset) continue;

      for (const set of exercise.sets) {
        const factor = SET_TYPE_FACTORS[set.setType] ?? 1.0;
        if (factor === 0) continue;

        const primary = asset.primaryMuscle as Muscle;
        if (MUSCLES.includes(primary)) {
          muscleSetCounts.set(primary, (muscleSetCounts.get(primary) || 0) + factor);
        }
        for (const secondary of asset.secondaryMuscles) {
          if (MUSCLES.includes(secondary as Muscle)) {
            muscleSetCounts.set(secondary as Muscle, (muscleSetCounts.get(secondary as Muscle) || 0) + factor * 0.5);
          }
        }
      }
    }
  }

  const { calculateHypertrophyScore } = await import("./hypertrophyScore");

  return MUSCLES.map((muscle) => {
    const lifetimeSets = muscleSetCounts.get(muscle) || 0;

    let tierIndex = 0;
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (lifetimeSets >= TIERS[i].minSets) {
        tierIndex = i;
        break;
      }
    }

    const tier = TIERS[tierIndex];
    const nextTier = tierIndex < TIERS.length - 1 ? TIERS[tierIndex + 1] : null;
    const progressToNext = nextTier
      ? Math.min(((lifetimeSets - tier.minSets) / (nextTier.minSets - tier.minSets)) * 100, 100)
      : 100;

    return {
      muscle,
      lifetimeSets: Math.round(lifetimeSets),
      tierIndex,
      tierName: tier.name,
      tierIcon: tier.icon,
      progressToNext: Math.round(progressToNext),
      hypertrophyScore: calculateHypertrophyScore(lifetimeSets / Math.max(workouts.length / 4, 1), "intermediate"),
    };
  });
}
