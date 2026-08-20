import type { Workout } from "../types";

export interface PrTrendPoint {
  label: string;
  count: number;
  date: Date;
}

export function computePrTrend(workouts: Workout[], windowDays: number): PrTrendPoint[] {
  const now = Date.now();
  const stepDays = windowDays <= 30 ? 1 : 7;
  const points: PrTrendPoint[] = [];

  for (let i = windowDays; i >= 0; i -= stepDays) {
    const start = now - (i + stepDays) * 86400000;
    const end = now - i * 86400000;
    const count = workouts
      .filter((w) => {
        const t = new Date(w.date).getTime();
        return t >= start && t < end;
      })
      .reduce(
        (a, w) =>
          a + w.exercises.reduce((b, e) => b + e.sets.filter((s) => s.isPr).length, 0),
        0
      );
    const d = new Date(end);
    points.push({
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count,
      date: d,
    });
  }
  return points;
}

export function getPrDelta(workouts: Workout[], days: number): { current: number; previous: number } {
  const current = countPrs(workouts, days);
  const previous = countPrs(workouts, days * 2) - current;
  return { current, previous };
}

function countPrs(workouts: Workout[], days: number): number {
  const cutoff = Date.now() - days * 86400000;
  let count = 0;
  for (const w of workouts) {
    if (new Date(w.date).getTime() < cutoff) continue;
    for (const ex of w.exercises) {
      for (const s of ex.sets) {
        if (s.isPr) count++;
      }
    }
  }
  return count;
}
