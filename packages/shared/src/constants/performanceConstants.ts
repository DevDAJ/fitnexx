export const PERFORMANCE_STORAGE_KEY = "fitnexx-performance-v1";
export const ALL_MUSCLES = "__all__" as const;

import type { Exercise, MuscleGroup } from "../types/performanceTypes";

export const SEEDED_MUSCLE_GROUPS: MuscleGroup[] = [
  { id: "mg-chest", name: "Chest" },
  { id: "mg-back", name: "Back" },
  { id: "mg-shoulders", name: "Shoulders" },
  { id: "mg-legs", name: "Legs" },
  { id: "mg-arms", name: "Arms" },
  { id: "mg-core", name: "Core" },
];

export const SEEDED_EXERCISES: Exercise[] = [
  { id: "ex-bench-press", name: "Bench Press", muscleGroupId: "mg-chest" },
  { id: "ex-incline-db-press", name: "Incline Dumbbell Press", muscleGroupId: "mg-chest" },
  { id: "ex-pull-up", name: "Pull-up", muscleGroupId: "mg-back" },
  { id: "ex-barbell-row", name: "Barbell Row", muscleGroupId: "mg-back" },
  { id: "ex-lat-pulldown", name: "Lat Pulldown", muscleGroupId: "mg-back" },
  { id: "ex-ohp", name: "Overhead Press", muscleGroupId: "mg-shoulders" },
  { id: "ex-lateral-raise", name: "Lateral Raise", muscleGroupId: "mg-shoulders" },
  { id: "ex-squat", name: "Squat", muscleGroupId: "mg-legs" },
  { id: "ex-deadlift", name: "Deadlift", muscleGroupId: "mg-legs" },
  { id: "ex-leg-press", name: "Leg Press", muscleGroupId: "mg-legs" },
  { id: "ex-barbell-curl", name: "Barbell Curl", muscleGroupId: "mg-arms" },
  { id: "ex-tricep-pushdown", name: "Tricep Pushdown", muscleGroupId: "mg-arms" },
  { id: "ex-plank", name: "Plank", muscleGroupId: "mg-core" },
  { id: "ex-cable-crunch", name: "Cable Crunch", muscleGroupId: "mg-core" },
];
