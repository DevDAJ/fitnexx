import { describe, expect, test } from "bun:test";
import {
  type Coords,
  distanceMeters,
  findCurrentGym,
  isExerciseAvailable,
} from "./gyms";
import type { ExerciseAsset, Gym } from "./types";

const gym = (over: Partial<Gym>): Gym => ({
  id: "g1",
  name: "Gym",
  latitude: 40.0,
  longitude: -73.0,
  radius: 150,
  equipment: ["Barbell", "Dumbbell"],
  ...over,
});

const exercise = (equipment: string | undefined): ExerciseAsset => ({
  name: "Test",
  primaryMuscle: "Chest",
  secondaryMuscles: [],
  category: "compound",
  equipment,
});

describe("gyms", () => {
  test("findCurrentGym returns nearest gym within radius", () => {
    const coords: Coords = { latitude: 40.001, longitude: -73.0 };
    const gyms = [
      gym({ id: "a", radius: 100 }),
      gym({ id: "b", latitude: 40.005, radius: 1000 }),
    ];
    const result = findCurrentGym(coords, gyms);
    expect(result?.id).toBe("b");
  });

  test("findCurrentGym returns null when no gym within radius", () => {
    const coords: Coords = { latitude: 40.02, longitude: -73.0 };
    expect(findCurrentGym(coords, [gym({ radius: 150 })])).toBeNull();
  });

  test("distanceMeters matches known reference", () => {
    // 0.001 deg lat is ~111m
    const d = distanceMeters(
      { latitude: 40.0, longitude: -73.0 },
      { latitude: 40.001, longitude: -73.0 },
    );
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(120);
  });

  test("isExerciseAvailable by equipment", () => {
    expect(isExerciseAvailable(exercise("Barbell"), gym({}).equipment)).toBe(
      true,
    );
    expect(
      isExerciseAvailable(exercise("Smith Machine"), gym({}).equipment),
    ).toBe(false);
    expect(isExerciseAvailable(exercise("Body Only"), gym({}).equipment)).toBe(
      true,
    );
    expect(
      isExerciseAvailable(exercise("body weight"), gym({}).equipment),
    ).toBe(true);
    expect(isExerciseAvailable(exercise(undefined), gym({}).equipment)).toBe(
      true,
    );
  });
});
