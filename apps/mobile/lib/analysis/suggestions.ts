import { EXERCISES } from "../../constants/exercises";
import { buildAssetIndex, loadExercises } from "../exerciseDatabase";
import { isExerciseAvailable } from "../gyms";
import type { ExerciseSuggestion, WeightUnit, Workout } from "../types";
import { getScoreLabel } from "./hypertrophyScore";
import { detectPlateaus, findMusclePlateau } from "./plateauDetection";
import { computeWeeklySets } from "./weeklySets";

export async function suggestExercises(
  workouts: Workout[],
  weightUnit: WeightUnit,
  gymEquipment?: string[],
): Promise<ExerciseSuggestion[]> {
  if (workouts.length < 3) return [];

  const [weeklyData, allExercises] = await Promise.all([
    computeWeeklySets(workouts, 28, weightUnit),
    loadExercises(),
  ]);
  const { byName } = buildAssetIndex(allExercises);
  const plateaus = detectPlateaus(workouts);

  const weak = weeklyData
    .filter((m) => m.hypertrophyScore < 60)
    .sort((a, b) => a.hypertrophyScore - b.hypertrophyScore)
    .slice(0, 3);

  return weak
    .map((m) => {
      const reason =
        m.hypertrophyScore < 25
          ? "Below maintenance volume"
          : m.hypertrophyScore < 50
            ? "Below minimum effective volume"
            : "Below optimal range";

      const candidates = EXERCISES.filter(
        (e) => e.primaryMuscle === m.muscle,
      ).map((e) => byName[e.name.toLowerCase()] ?? e);
      let exercises = gymEquipment
        ? candidates.filter((e) => isExerciseAvailable(e, gymEquipment))
        : candidates;

      if (gymEquipment && exercises.length === 0) {
        exercises = allExercises.filter(
          (e) =>
            e.primaryMuscle === m.muscle &&
            ["body only", "bodyweight", "body weight"].includes(
              e.equipment?.trim().toLowerCase() ?? "",
            ),
        );
      }

      const plateau = findMusclePlateau(m.muscle, plateaus, byName);

      return {
        muscle: m.muscle,
        reason,
        score: m.hypertrophyScore,
        weeklySets: m.weeklySets,
        scoreLabel: getScoreLabel(m.hypertrophyScore),
        plateau,
        exercises: exercises.slice(0, 3).map((e) => ({
          name: e.name,
          primaryMuscle: e.primaryMuscle,
          equipment: e.equipment,
        })),
      };
    })
    .filter((suggestion) => suggestion.exercises.length > 0);
}
