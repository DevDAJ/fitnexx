import { EXERCISES } from "../../constants/exercises";
import type {
  ExerciseSuggestion,
  MuscleWeeklyData,
  WeightUnit,
  Workout,
} from "../types";
import { computeWeeklySets } from "./weeklySets";

export async function suggestExercises(
  workouts: Workout[],
  weightUnit: WeightUnit,
): Promise<ExerciseSuggestion[]> {
  if (workouts.length < 3) return [];

  const weeklyData = await computeWeeklySets(workouts, 28, weightUnit);

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
