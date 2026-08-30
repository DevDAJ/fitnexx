import type { Workout, MuscleWeeklyData, ExerciseSuggestion } from "../types";
import { computeWeeklySets } from "./weeklySets";
import { EXERCISES } from "../../constants/exercises";

export async function suggestExercises(
  workouts: Workout[]
): Promise<ExerciseSuggestion[]> {
  if (workouts.length < 3) return [];

  const weeklyData = await computeWeeklySets(workouts, 28, "kg");

  const weak = weeklyData
    .filter((m) => m.hypertrophyScore < 60)
    .sort((a, b) => a.hypertrophyScore - b.hypertrophyScore)
    .slice(0, 3);

  return weak.map((m) => {
    const reason =
      m.hypertrophyScore < 25
        ? "Below maintenance volume"
        : m.hypertrophyScore < 50
          ? "Below minimum effective volume"
          : "Below optimal range";

    const exercises = EXERCISES.filter((e) => e.primaryMuscle === m.muscle)
      .slice(0, 3)
      .map((e) => ({ name: e.name, primaryMuscle: e.primaryMuscle }));

    return { muscle: m.muscle, reason, exercises };
  });
}
