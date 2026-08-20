type TrainingLevel = "beginner" | "intermediate" | "advanced";

const THRESHOLDS: Record<TrainingLevel, { mv: number; mev: number; mrv: number; maxV: number }> = {
  beginner: { mv: 4, mev: 8, mrv: 16, maxV: 20 },
  intermediate: { mv: 6, mev: 12, mrv: 22, maxV: 28 },
  advanced: { mv: 8, mev: 15, mrv: 26, maxV: 32 },
};

export function calculateHypertrophyScore(
  weeklySets: number,
  level: TrainingLevel = "intermediate"
): number {
  const t = THRESHOLDS[level];

  if (weeklySets <= 0) return 0;
  if (weeklySets < t.mv) return Math.round((weeklySets / t.mv) * 25);
  if (weeklySets < t.mev) return Math.round(25 + ((weeklySets - t.mv) / (t.mev - t.mv)) * 25);
  if (weeklySets < t.mrv) return Math.round(50 + ((weeklySets - t.mev) / (t.mrv - t.mev)) * 30);
  if (weeklySets < t.maxV) return Math.round(80 + ((weeklySets - t.mrv) / (t.maxV - t.mrv)) * 20);
  return 100;
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Optimal";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Low";
  return "Minimal";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#84cc16";
  if (score >= 40) return "#f59e0b";
  if (score >= 20) return "#f97316";
  return "#ef4444";
}
