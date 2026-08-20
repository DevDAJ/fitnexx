import type { Workout } from "../types";

export interface TrainingTier {
  name: string;
  minSets: number;
  icon: string;
}

export const TIERS: TrainingTier[] = [
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

export interface TrainingTimelineResult {
  tier: TrainingTier;
  tierIndex: number;
  lifetimeSets: number;
  monthsTraining: number;
  nextTier: TrainingTier | null;
  progressToNext: number; // 0-100
  weeksToNext: number | null;
}

export function computeTrainingTimeline(workouts: Workout[]): TrainingTimelineResult {
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const lifetimeSets = workouts.reduce(
    (a, w) => a + w.exercises.reduce((b, e) => b + e.sets.filter((s) => s.setType !== "warmup").length, 0),
    0
  );

  let monthsTraining = 0;
  if (sorted.length >= 2) {
    const first = new Date(sorted[0].date).getTime();
    const last = new Date(sorted[sorted.length - 1].date).getTime();
    monthsTraining = (last - first) / (30 * 86400000);
  }

  let tierIndex = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (lifetimeSets >= TIERS[i].minSets) {
      tierIndex = i;
      break;
    }
  }

  const tier = TIERS[tierIndex];
  const nextTier = tierIndex < TIERS.length - 1 ? TIERS[tierIndex + 1] : null;

  let progressToNext = 100;
  let weeksToNext = null;

  if (nextTier) {
    const range = nextTier.minSets - tier.minSets;
    const current = lifetimeSets - tier.minSets;
    progressToNext = Math.min(Math.round((current / range) * 100), 100);

    // Estimate weeks to next tier based on recent pace
    const recentCutoff = Date.now() - 30 * 86400000;
    const recentSets = workouts
      .filter((w) => new Date(w.date).getTime() >= recentCutoff)
      .reduce(
        (a, w) => a + w.exercises.reduce((b, e) => b + e.sets.filter((s) => s.setType !== "warmup").length, 0),
        0
      );
    const weeklyPace = recentSets / 4;
    const setsNeeded = nextTier.minSets - lifetimeSets;
    weeksToNext = weeklyPace > 0 ? Math.ceil(setsNeeded / weeklyPace) : null;
  }

  return { tier, tierIndex, lifetimeSets, monthsTraining, nextTier, progressToNext, weeksToNext };
}
