import type { Workout, WorkoutSet } from "../types";
import { classifySet } from "./setClassification";
import type { SetClassification } from "./setClassification";

export interface SetCommentary {
  setIndex: number;
  exerciseName: string;
  classification: SetClassification;
  weight: number;
  reps: number;
}

export function getSetCommentary(workouts: Workout[], exerciseName: string): SetCommentary[] {
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sessionSets: WorkoutSet[][] = [];

  for (const workout of sorted) {
    const ex = workout.exercises.find((e) => e.exerciseName === exerciseName);
    if (!ex) continue;
    const working = ex.sets.filter((s) => s.setType !== "warmup");
    if (working.length > 0) sessionSets.push(working);
  }

  if (sessionSets.length === 0) return [];

  const latestSession = sessionSets[sessionSets.length - 1];
  const prevSession = sessionSets.length >= 2 ? sessionSets[sessionSets.length - 2] : null;

  const commentaries: SetCommentary[] = [];

  latestSession.forEach((set, i) => {
    const prev = prevSession
      ? i < prevSession.length ? prevSession[i] : prevSession[prevSession.length - 1]
      : null;
    const classification = classifySet(set, prev);

    commentaries.push({
      setIndex: i,
      exerciseName,
      classification,
      weight: set.weight,
      reps: set.reps,
    });
  });

  return commentaries;
}

export function getPlateauAdvice(status: "static" | "general", sessionsSinceProgress: number): string {
  if (status === "static") {
    return "Weight and reps unchanged for multiple sessions. Try adding 1-2 reps before increasing weight, or switch to a different rep scheme.";
  }
  if (sessionsSinceProgress >= 6) {
    return "Long plateau. Consider a deload week (50% volume), then restart with a different rep range or exercise variation.";
  }
  return "Progress has stalled. Try small increments (1.25-2.5kg) or add an extra set to increase volume.";
}
