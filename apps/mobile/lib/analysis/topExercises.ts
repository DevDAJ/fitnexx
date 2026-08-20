import type { Workout } from "../types";

export interface TopExercise {
  name: string;
  sessions: number;
  totalVolume: number;
}

export function computeTopExercises(workouts: Workout[], windowDays: number, limit = 10): TopExercise[] {
  const cutoff = Date.now() - windowDays * 86400000;
  const map = new Map<string, { sessions: number; totalVolume: number }>();

  for (const w of workouts) {
    if (new Date(w.date).getTime() < cutoff) continue;
    for (const ex of w.exercises) {
      const existing = map.get(ex.exerciseName) || { sessions: 0, totalVolume: 0 };
      existing.sessions++;
      existing.totalVolume += ex.sets.reduce((a, s) => a + s.weight * s.reps, 0);
      map.set(ex.exerciseName, existing);
    }
  }

  return Array.from(map.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.totalVolume - a.totalVolume)
    .slice(0, limit);
}
