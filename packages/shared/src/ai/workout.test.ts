import { test, expect } from "bun:test";
import {
  WORKOUT_SUGGESTION_PROMPT,
  buildWorkoutContext,
  normalizeWorkoutSuggestion,
} from "./workout";
import type { GymState } from "../constants/gymConstants";
import type { PerformanceState } from "../types/performanceTypes";

const performance: PerformanceState = {
  muscleGroups: [
    { id: "mg-back", name: "Back" },
    { id: "mg-legs", name: "Legs" },
  ],
  exercises: [
    { id: "ex-pull-up", name: "Pull-up", muscleGroupId: "mg-back" },
    { id: "ex-squat", name: "Squat", muscleGroupId: "mg-legs" },
  ],
  sets: [
    { id: "s1", exerciseId: "ex-squat", date: "2026-08-08", weight: 100, reps: 5, unit: "kg" },
    { id: "s2", exerciseId: "ex-squat", date: "2026-08-02", weight: 100, reps: 5, unit: "kg" },
  ],
};

const gym: GymState = {
  equipmentCatalog: [
    { id: "eq-barbell", name: "Barbell", category: "strength" },
    { id: "eq-pullup-bar", name: "Pull-up Bar", category: "bodyweight" },
  ],
  myEquipmentIds: ["eq-barbell", "eq-pullup-bar"],
  exerciseEquipment: {},
};

test("WORKOUT_SUGGESTION_PROMPT demands json only", () => {
  expect(WORKOUT_SUGGESTION_PROMPT).toContain('"exercises"');
  expect(WORKOUT_SUGGESTION_PROMPT).toContain("JSON");
});

test("buildWorkoutContext lists today's sets and 7-day volume by muscle", () => {
  const ctx = buildWorkoutContext({ performance, gym, today: "2026-08-08" });
  expect(ctx).toContain("Today (2026-08-08)");
  expect(ctx).toContain("- Squat: 100kg x 5");
  expect(ctx).toContain("Barbell, Pull-up Bar");
  // 7-day window covers both squat sets -> 1000kg
  expect(ctx).toContain("Legs: 1000kg");
  expect(ctx).toContain("Pull-up");
});

test("buildWorkoutContext excludes sets outside the 7-day window", () => {
  const ctx = buildWorkoutContext({ performance, gym, today: "2026-08-08" });
  expect(ctx).toContain("Legs: 1000kg");
  const nextWeek = buildWorkoutContext({ performance, gym, today: "2026-08-15" });
  expect(nextWeek).toContain("(none)");
});

test("normalizeWorkoutSuggestion parses structured json", () => {
  const raw = JSON.stringify({
    focus: "Back",
    summary: "Back is under-recovered.",
    exercises: [
      { name: "Pull-up", sets: 4, reps: 8 },
      { name: "Barbell Row", sets: 3, reps: 10, notes: "pause at bottom" },
    ],
  });
  const result = normalizeWorkoutSuggestion(raw);
  expect(result.focus).toBe("Back");
  expect(result.summary).toBe("Back is under-recovered.");
  expect(result.exercises).toHaveLength(2);
  expect(result.exercises[0]).toEqual({ name: "Pull-up", sets: 4, reps: 8 });
  expect(result.exercises[1].notes).toBe("pause at bottom");
});

test("normalizeWorkoutSuggestion falls back to defaults on bad input", () => {
  expect(normalizeWorkoutSuggestion("nope")).toEqual({ focus: "", summary: "", exercises: [] });
  const result = normalizeWorkoutSuggestion({
    exercises: [{ exercise: "Squat" }, { sets: -2 }],
  });
  expect(result.exercises).toHaveLength(1);
  expect(result.exercises[0].name).toBe("Squat");
  expect(result.exercises[0].sets).toBe(3);
  expect(result.exercises[0].reps).toBe(10);
});
