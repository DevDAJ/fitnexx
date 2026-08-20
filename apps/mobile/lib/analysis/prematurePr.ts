import type { Workout } from "../types";
import { calculate1RM } from "./oneRepMax";

export interface PrematurePr {
  exerciseName: string;
  date: string;
  spikeWeight: number;
  spike1RM: number;
  subsequent1RM: number;
  dropPercent: number;
}

export function detectPrematurePrs(workouts: Workout[]): PrematurePr[] {
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const exerciseHistory = new Map<string, { date: string; best1RM: number }[]>();

  for (const workout of sorted) {
    for (const ex of workout.exercises) {
      const working = ex.sets.filter((s) => s.setType !== "warmup" && s.weight > 0);
      if (working.length === 0) continue;

      const best1RM = Math.max(...working.map((s) => calculate1RM(s.weight, s.reps)));

      if (!exerciseHistory.has(ex.exerciseName)) {
        exerciseHistory.set(ex.exerciseName, []);
      }
      exerciseHistory.get(ex.exerciseName)!.push({ date: workout.date, best1RM });
    }
  }

  const premature: PrematurePr[] = [];

  for (const [name, history] of exerciseHistory) {
    for (let i = 1; i < history.length - 1; i++) {
      const prev = history[i - 1];
      const current = history[i];
      const next = history[i + 1];

      const spikeUp = (current.best1RM - prev.best1RM) / (prev.best1RM || 1);
      const dropAfter = (current.best1RM - next.best1RM) / (current.best1RM || 1);

      if (spikeUp > 0.1 && dropAfter > 0.08) {
        premature.push({
          exerciseName: name,
          date: current.date,
          spikeWeight: current.best1RM,
          spike1RM: current.best1RM,
          subsequent1RM: next.best1RM,
          dropPercent: Math.round(dropAfter * 100),
        });
      }
    }
  }

  return premature;
}
