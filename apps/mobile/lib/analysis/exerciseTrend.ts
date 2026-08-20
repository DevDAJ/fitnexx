import type { Workout, ExerciseTrendStatus } from "../types";
import { calculate1RM } from "./oneRepMax";

interface TrendResult {
  status: ExerciseTrendStatus;
  confidence: "low" | "medium" | "high";
  diffPercent: number;
  sessionsSinceProgress: number;
}

export function analyzeExerciseTrend(
  exerciseName: string,
  workouts: Workout[]
): TrendResult {
  const sessions = getExerciseSessions(exerciseName, workouts);

  if (sessions.length < 2) {
    return { status: "new", confidence: "low", diffPercent: 0, sessionsSinceProgress: 0 };
  }

  const isBodyweight = sessions.slice(-4).filter((s) => s.avgWeight <= 0).length >= 3;

  const metrics = sessions.map((s) =>
    isBodyweight ? s.maxReps : s.avg1RM
  );

  const windowSize = sessions.length >= 6 ? 6 : 4;
  const recentMetrics = metrics.slice(-windowSize);
  const halfIdx = Math.floor(recentMetrics.length / 2);
  const recentHalf = recentMetrics.slice(halfIdx);
  const olderHalf = recentMetrics.slice(0, halfIdx);

  if (olderHalf.length === 0 || recentHalf.length === 0) {
    return { status: "new", confidence: "low", diffPercent: 0, sessionsSinceProgress: 0 };
  }

  const olderAvg = olderHalf.reduce((a, b) => a + b, 0) / olderHalf.length;
  const recentAvg = recentHalf.reduce((a, b) => a + b, 0) / recentHalf.length;

  const diffPercent = olderAvg > 0
    ? ((recentAvg - olderAvg) / olderAvg) * 100
    : recentAvg > 0 ? 100 : 0;

  let status: ExerciseTrendStatus;
  if (diffPercent > 1.0) status = "overload";
  else if (diffPercent < -3.0) status = "regression";
  else status = "stagnant";

  const sessionsSinceProgress = countSessionsSinceProgress(sessions, isBodyweight);

  let confidence: TrendResult["confidence"] = "low";
  if (sessions.length >= 10 && windowSize >= 6) confidence = "high";
  else if (sessions.length >= 6) confidence = "medium";

  return { status, confidence, diffPercent, sessionsSinceProgress };
}

interface SessionSummary {
  date: string;
  avgWeight: number;
  avg1RM: number;
  maxReps: number;
  maxWeight: number;
}

function getExerciseSessions(
  exerciseName: string,
  workouts: Workout[]
): SessionSummary[] {
  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sessions: SessionSummary[] = [];

  for (const workout of sorted) {
    const exercise = workout.exercises.find(
      (e) => e.exerciseName === exerciseName
    );
    if (!exercise) continue;

    const workingSets = exercise.sets.filter(
      (s) => s.setType !== "warmup" && (s.weight > 0 || s.reps > 0)
    );
    if (workingSets.length === 0) continue;

    const avgWeight =
      workingSets.reduce((a, s) => a + s.weight, 0) / workingSets.length;
    const avg1RM =
      workingSets.reduce((a, s) => a + calculate1RM(s.weight, s.reps), 0) /
      workingSets.length;
    const maxReps = Math.max(...workingSets.map((s) => s.reps));
    const maxWeight = Math.max(...workingSets.map((s) => s.weight));

    sessions.push({
      date: workout.date,
      avgWeight,
      avg1RM,
      maxReps,
      maxWeight,
    });
  }

  return sessions;
}

function countSessionsSinceProgress(
  sessions: SessionSummary[],
  isBodyweight: boolean
): number {
  if (sessions.length < 2) return 0;

  const currentBest = isBodyweight
    ? sessions[sessions.length - 1].maxReps
    : sessions[sessions.length - 1].avg1RM;

  let count = 0;
  for (let i = sessions.length - 2; i >= 0; i--) {
    const metric = isBodyweight ? sessions[i].maxReps : sessions[i].avg1RM;
    const threshold = isBodyweight ? 1 : currentBest * 0.01;
    if (metric > currentBest + threshold) break;
    count++;
  }

  return count;
}
