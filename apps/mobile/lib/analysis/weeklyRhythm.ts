import type { Workout } from "../types";

export interface WeeklyRhythmPoint {
  day: string;
  sessions: number;
  volume: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function computeWeeklyRhythm(workouts: Workout[]): WeeklyRhythmPoint[] {
  const counts = new Array(7).fill(0);
  const volumes = new Array(7).fill(0);

  for (const w of workouts) {
    const day = new Date(w.date).getDay();
    counts[day]++;
    volumes[day] += w.totalVolume;
  }

  return DAYS.map((day, i) => ({
    day,
    sessions: counts[i],
    volume: volumes[i],
  }));
}

export function getRhythmInsight(data: WeeklyRhythmPoint[]): { topDay: string; restDay: string; consistency: number } {
  const maxSessions = Math.max(...data.map((d) => d.sessions));
  const minSessions = Math.min(...data.map((d) => d.sessions));
  const topDay = data.find((d) => d.sessions === maxSessions)?.day ?? "N/A";
  const restDay = data.find((d) => d.sessions === minSessions)?.day ?? "N/A";

  const total = data.reduce((a, d) => a + d.sessions, 0);
  const avg = total / 7;
  const variance = data.reduce((a, d) => a + Math.abs(d.sessions - avg), 0) / 7;
  const consistency = avg > 0 ? Math.max(0, 100 - variance / avg * 50) : 0;

  return { topDay, restDay, consistency: Math.round(consistency) };
}
