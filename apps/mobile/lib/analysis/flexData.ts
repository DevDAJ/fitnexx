import type { Workout } from "../types";
import { MUSCLE_COLORS } from "../../constants/muscles";
import { getRemoteExerciseByName } from "../exerciseDatabase";
import { SET_TYPE_FACTORS } from "../types";

export interface FlexData {
  totalVolume: number;
  volumeComparison: { label: string; emoji: string; count: number }[];
  bestMonth: { month: string; volume: number; workouts: number };
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  streak: { current: number; longest: number };
  yearHeatmap: { date: string; intensity: number }[];
  topMuscles: { muscle: string; sets: number; color: string }[];
  topExercises: { name: string; sessions: number }[];
  totalPrs: number;
  avgWorkoutsPerWeek: number;
}

const COMPARISONS = [
  { label: "a car", emoji: "🚗", weightKg: 1500 },
  { label: "a grand piano", emoji: "🎹", weightKg: 400 },
  { label: "a cow", emoji: "🐄", weightKg: 700 },
  { label: "a horse", emoji: "🐴", weightKg: 500 },
  { label: "a lion", emoji: "🦁", weightKg: 190 },
  { label: "a whale shark", emoji: "🦈", weightKg: 2000 },
  { label: "a giraffe", emoji: "🦒", weightKg: 800 },
  { label: "an elephant", emoji: "🐘", weightKg: 5000 },
];

export async function computeFlexData(workouts: Workout[]): Promise<FlexData> {
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalVolume = workouts.reduce((a, w) => a + w.totalVolume, 0);
  const totalWorkouts = workouts.length;
  const totalSets = workouts.reduce(
    (a, w) => a + w.exercises.reduce((b, e) => b + e.sets.filter((s) => s.setType !== "warmup").length, 0),
    0
  );
  const exerciseNames = new Set<string>();
  for (const w of workouts) for (const e of w.exercises) exerciseNames.add(e.exerciseName);
  const totalExercises = exerciseNames.size;

  // Volume comparisons
  const volumeComparisons = COMPARISONS.map((c) => ({
    label: c.label,
    emoji: c.emoji,
    count: Math.round(totalVolume / (c.weightKg * 9.81)),
  })).sort((a, b) => b.count - a.count);

  // Best month
  const monthMap = new Map<string, { volume: number; workouts: number }>();
  for (const w of workouts) {
    const key = w.date.substring(0, 7);
    const existing = monthMap.get(key) || { volume: 0, workouts: 0 };
    existing.volume += w.totalVolume;
    existing.workouts++;
    monthMap.set(key, existing);
  }
  let bestMonth = { month: "N/A", volume: 0, workouts: 0 };
  for (const [month, data] of monthMap) {
    if (data.volume > bestMonth.volume) {
      bestMonth = { month, ...data };
    }
  }

  // Streaks
  const daySet = new Set<string>();
  for (const w of workouts) daySet.add(w.date.split("T")[0]);
  const days = Array.from(daySet).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]).getTime();
    const curr = new Date(days[i]).getTime();
    if (curr - prev <= 86400000) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  // Current streak from today backwards
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  currentStreak = 0;
  let checkDate = new Date(today);
  while (daySet.has(checkDate.toISOString().split("T")[0])) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Year heatmap (last 365 days)
  const yearHeatmap: { date: string; intensity: number }[] = [];
  const maxDayVolume = Math.max(
    ...Array.from(daySet).map((d) =>
      workouts.filter((w) => w.date.startsWith(d)).reduce((a, w) => a + w.totalVolume, 0)
    ),
    1
  );
  for (let i = 364; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const vol = workouts.filter((w) => w.date.startsWith(dateStr)).reduce((a, w) => a + w.totalVolume, 0);
    yearHeatmap.push({ date: dateStr, intensity: vol / maxDayVolume });
  }

  // Top muscles
  const muscleCounts = new Map<string, number>();
  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const asset = await getRemoteExerciseByName(exercise.exerciseName);
      if (!asset) continue;
      for (const set of exercise.sets) {
        const factor = SET_TYPE_FACTORS[set.setType] ?? 1.0;
        if (factor === 0) continue;
        const primary = asset.primaryMuscle;
        muscleCounts.set(primary, (muscleCounts.get(primary) || 0) + factor);
      }
    }
  }
  const topMuscles = Array.from(muscleCounts.entries())
    .map(([muscle, sets]) => ({ muscle, sets: Math.round(sets), color: MUSCLE_COLORS[muscle] || "#666" }))
    .sort((a, b) => b.sets - a.sets)
    .slice(0, 5);

  // Top exercises
  const exerciseCounts = new Map<string, number>();
  for (const w of workouts) {
    for (const e of w.exercises) {
      exerciseCounts.set(e.exerciseName, (exerciseCounts.get(e.exerciseName) || 0) + 1);
    }
  }
  const topExercises = Array.from(exerciseCounts.entries())
    .map(([name, sessions]) => ({ name, sessions }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);

  // PRs
  let totalPrs = 0;
  for (const w of workouts) {
    for (const e of w.exercises) {
      totalPrs += e.sets.filter((s) => s.isPr).length;
    }
  }

  // Avg workouts per week
  let weeksSpan = 1;
  if (sorted.length >= 2) {
    const first = new Date(sorted[0].date).getTime();
    const last = new Date(sorted[sorted.length - 1].date).getTime();
    weeksSpan = Math.max((last - first) / (7 * 86400000), 1);
  }
  const avgWorkoutsPerWeek = totalWorkouts / weeksSpan;

  return {
    totalVolume,
    volumeComparison: volumeComparisons,
    bestMonth,
    totalWorkouts,
    totalExercises,
    totalSets,
    streak: { current: currentStreak, longest: longestStreak },
    yearHeatmap,
    topMuscles,
    topExercises,
    totalPrs,
    avgWorkoutsPerWeek,
  };
}
