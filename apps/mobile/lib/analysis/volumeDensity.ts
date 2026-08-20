import type { Workout } from "../types";

export interface VolumeDensityPoint {
  label: string;
  volume: number;
  density: number; // sets per session
  date: Date;
}

export function computeVolumeDensity(workouts: Workout[], windowDays: number): VolumeDensityPoint[] {
  const now = Date.now();
  const stepDays = windowDays <= 30 ? 1 : 7;
  const points: VolumeDensityPoint[] = [];

  for (let i = windowDays; i >= 0; i -= stepDays) {
    const start = now - (i + stepDays) * 86400000;
    const end = now - i * 86400000;
    const inWindow = workouts.filter((w) => {
      const t = new Date(w.date).getTime();
      return t >= start && t < end;
    });

    const volume = inWindow.reduce((a, w) => a + w.totalVolume, 0);
    const totalSets = inWindow.reduce(
      (a, w) => a + w.exercises.reduce((b, e) => b + e.sets.length, 0),
      0
    );
    const density = inWindow.length > 0 ? totalSets / inWindow.length : 0;

    const d = new Date(end);
    points.push({
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      volume,
      density,
      date: d,
    });
  }
  return points;
}
