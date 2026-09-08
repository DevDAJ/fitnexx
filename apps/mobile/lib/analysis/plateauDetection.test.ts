import { describe, expect, test } from "bun:test";
import type { ExerciseAsset, PlateauInfo } from "../types";
import { findMusclePlateau } from "./plateauDetection";

const exercise = (
  name: string,
  primaryMuscle: string,
  secondaryMuscles: string[] = [],
): ExerciseAsset => ({
  name,
  primaryMuscle,
  secondaryMuscles,
  category: "compound",
});

const plateau = (
  exerciseName: string,
  sessionsSinceProgress: number,
): PlateauInfo => ({
  exerciseName,
  sessionsSinceProgress,
  currentWeight: 100,
  status: "general",
});

describe("findMusclePlateau", () => {
  test("prefers a primary-muscle plateau over a secondary-muscle plateau", () => {
    const plateaus = [plateau("Bench Press", 5), plateau("Tricep Pushdown", 3)];
    const exercises = {
      "bench press": exercise("Bench Press", "Chest", ["Triceps"]),
      "tricep pushdown": exercise("Tricep Pushdown", "Triceps"),
    };

    expect(
      findMusclePlateau("Triceps", plateaus, exercises)?.exerciseName,
    ).toBe("Tricep Pushdown");
  });
});
