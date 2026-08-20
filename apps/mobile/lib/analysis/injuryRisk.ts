import type { Workout } from "../types";

export interface InjuryRiskResult {
  score: number; // 0-100
  factors: {
    acwr: number;
    recovery: number;
    imbalance: number;
  };
  riskLevel: "low" | "moderate" | "high";
}

export function computeInjuryRisk(workouts: Workout[]): InjuryRiskResult {
  if (workouts.length < 7) {
    return { score: 0, factors: { acwr: 0, recovery: 0, imbalance: 0 }, riskLevel: "low" };
  }

  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // ACWR: acute (last 7 days) vs chronic (last 28 days) workload
  const now = Date.now();
  const acuteVolume = sorted
    .filter((w) => now - new Date(w.date).getTime() <= 7 * 86400000)
    .reduce((a, w) => a + w.totalVolume, 0);
  const chronicVolume = sorted
    .filter((w) => now - new Date(w.date).getTime() <= 28 * 86400000)
    .reduce((a, w) => a + w.totalVolume, 0);
  const chronicAvg = chronicVolume / 4; // weekly average
  const acwr = chronicAvg > 0 ? Math.min(Math.abs(acuteVolume / chronicAvg - 1.0) * 50, 100) : 0;

  // Recovery: check rest days in last 14 days
  const recentDays = 14;
  const trainingDays = new Set<string>();
  for (const w of sorted) {
    const d = new Date(w.date);
    if (now - d.getTime() <= recentDays * 86400000) {
      trainingDays.add(d.toISOString().split("T")[0]);
    }
  }
  const restDays = recentDays - trainingDays.size;
  const recovery = restDays < 2 ? 80 : restDays < 4 ? 40 : 10;

  // Imbalance: push vs pull rough estimate
  let pushVolume = 0;
  let pullVolume = 0;
  for (const w of sorted) {
    if (now - new Date(w.date).getTime() <= 14 * 86400000) {
      for (const ex of w.exercises) {
        const name = ex.exerciseName.toLowerCase();
        const vol = ex.sets.reduce((a, s) => a + s.weight * s.reps, 0);
        if (name.includes("press") || name.includes("push") || name.includes("fly") || name.includes("chest")) {
          pushVolume += vol;
        } else if (name.includes("row") || name.includes("pull") || name.includes("curl") || name.includes("dead")) {
          pullVolume += vol;
        }
      }
    }
  }
  const total = pushVolume + pullVolume;
  const imbalance = total > 0
    ? Math.min(Math.abs(pushVolume - pullVolume) / total * 200, 100)
    : 0;

  const score = Math.round(acwr * 0.4 + recovery * 0.3 + imbalance * 0.3);
  const riskLevel: InjuryRiskResult["riskLevel"] = score >= 60 ? "high" : score >= 30 ? "moderate" : "low";

  return { score, factors: { acwr, recovery, imbalance }, riskLevel };
}
