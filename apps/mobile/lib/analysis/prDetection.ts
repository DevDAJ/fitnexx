import type { Workout, WorkoutSet, PrType, ExerciseHistoryEntry } from "../types";
import { calculate1RM, calculateVolume } from "./oneRepMax";

interface PrResult {
  exerciseName: string;
  prType: PrType;
  value: number;
  date: string;
}

export function detectPrs(workouts: Workout[]): PrResult[] {
  const exerciseHistory = buildExerciseHistory(workouts);
  const prs: PrResult[] = [];

  for (const [name, history] of exerciseHistory) {
    const sorted = [...history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let bestWeight = 0;
    let best1RM = 0;
    let bestVolume = 0;
    let bestReps = 0;
    let bestWeightedReps = 0;

    for (const entry of sorted) {
      const prTypes: PrType[] = [];

      if (entry.weight > bestWeight) {
        bestWeight = entry.weight;
        prTypes.push("weight");
      }
      if (entry.oneRepMax > best1RM) {
        best1RM = entry.oneRepMax;
        prTypes.push("oneRm");
      }
      if (entry.volume > bestVolume) {
        bestVolume = entry.volume;
        prTypes.push("volume");
      }
      if (entry.reps > bestReps) {
        bestReps = entry.reps;
        prTypes.push("reps");
      }
      const weightedReps = entry.weight * entry.reps;
      if (weightedReps > bestWeightedReps) {
        bestWeightedReps = weightedReps;
        prTypes.push("weightedReps");
      }

      if (prTypes.length > 0) {
        prs.push({
          exerciseName: name,
          prType: prTypes[0],
          value: entry.weight > 0 ? entry.oneRepMax : entry.reps,
          date: entry.date,
        });
      }
    }
  }

  return prs;
}

export function getPrCount(workouts: Workout[], days?: number): number {
  const cutoff = days
    ? new Date(Date.now() - days * 86400000).toISOString()
    : undefined;

  let count = 0;
  for (const w of workouts) {
    if (cutoff && w.date < cutoff) continue;
    for (const ex of w.exercises) {
      for (const set of ex.sets) {
        if (set.isPr) count++;
      }
    }
  }
  return count;
}

function buildExerciseHistory(
  workouts: Workout[]
): Map<string, ExerciseHistoryEntry[]> {
  const map = new Map<string, ExerciseHistoryEntry[]>();
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const workout of sorted) {
    for (const exercise of workout.exercises) {
      if (!map.has(exercise.exerciseName)) {
        map.set(exercise.exerciseName, []);
      }
      const entries = map.get(exercise.exerciseName)!;

      for (const set of exercise.sets) {
        if (set.setType === "warmup") continue;
        if (set.weight <= 0 && set.reps <= 0) continue;

        entries.push({
          date: workout.date,
          weight: set.weight,
          reps: set.reps,
          oneRepMax: calculate1RM(set.weight, set.reps),
          volume: calculateVolume(set.weight, set.reps),
          isPr: false,
          prTypes: [],
          setType: set.setType,
        });
      }
    }
  }

  return map;
}
