import type { Workout } from "../types";

export interface IntensityPoint {
  label: string;
  date: Date;
  strength: number; // sets in 1-5 rep range (approx >85% 1RM)
  hypertrophy: number; // sets in 6-12 rep range
  endurance: number; // sets in 13+ rep range
}

export function computeIntensityEvolution(workouts: Workout[], windowDays: number): IntensityPoint[] {
  const now = Date.now();
  const stepDays = windowDays <= 30 ? 1 : 7;
  const points: IntensityPoint[] = [];

  for (let i = windowDays; i >= 0; i -= stepDays) {
    const start = now - (i + stepDays) * 86400000;
    const end = now - i * 86400000;
    const inWindow = workouts.filter((w) => {
      const t = new Date(w.date).getTime();
      return t >= start && t < end;
    });

    let strength = 0;
    let hypertrophy = 0;
    let endurance = 0;

    for (const workout of inWindow) {
      for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
          if (set.setType === "warmup") continue;
          if (set.reps <= 0) continue;

          if (set.reps <= 5) strength++;
          else if (set.reps <= 12) hypertrophy++;
          else endurance++;
        }
      }
    }

    const d = new Date(end);
    points.push({
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      date: d,
      strength,
      hypertrophy,
      endurance,
    });
  }
  return points;
}
