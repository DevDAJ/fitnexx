import type { Workout, PlateauInfo } from "../types";
import { analyzeExerciseTrend } from "./exerciseTrend";

export function detectPlateaus(workouts: Workout[]): PlateauInfo[] {
  const exerciseNames = new Set<string>();
  for (const w of workouts) {
    for (const e of w.exercises) {
      exerciseNames.add(e.exerciseName);
    }
  }

  const plateaus: PlateauInfo[] = [];

  for (const name of exerciseNames) {
    const trend = analyzeExerciseTrend(name, workouts);
    if (trend.status !== "stagnant") continue;

    const sessions = getExerciseSessions(name, workouts);
    if (sessions.length < 3) continue;
    if (trend.sessionsSinceProgress < 3) continue;

    const lastSession = sessions[sessions.length - 1];
    const isStatic = checkStaticPlateau(sessions);

    plateaus.push({
      exerciseName: name,
      sessionsSinceProgress: trend.sessionsSinceProgress,
      currentWeight: lastSession.maxWeight,
      status: isStatic ? "static" : "general",
    });
  }

  return plateaus.sort((a, b) => b.sessionsSinceProgress - a.sessionsSinceProgress);
}

function checkStaticPlateau(
  sessions: { maxWeight: number; maxReps: number }[]
): boolean {
  const recent = sessions.slice(-4);
  if (recent.length < 3) return false;

  const weights = recent.map((s) => s.maxWeight);
  const reps = recent.map((s) => s.maxReps);

  const isWeightStatic = weights.every(
    (w) => Math.abs(w - weights[0]) < 0.5
  );
  const isRepStatic = Math.max(...reps) - Math.min(...reps) <= 1;

  return isWeightStatic && isRepStatic;
}

function getExerciseSessions(
  name: string,
  workouts: Workout[]
): { maxWeight: number; maxReps: number }[] {
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sorted
    .map((w) => {
      const ex = w.exercises.find((e) => e.exerciseName === name);
      if (!ex) return null;
      const working = ex.sets.filter((s) => s.setType !== "warmup");
      if (working.length === 0) return null;
      return {
        maxWeight: Math.max(...working.map((s) => s.weight)),
        maxReps: Math.max(...working.map((s) => s.reps)),
      };
    })
    .filter(Boolean) as { maxWeight: number; maxReps: number }[];
}
