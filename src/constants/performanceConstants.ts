import type { Exercise, MuscleGroup } from "@/types/performanceTypes";

export const PERFORMANCE_STORAGE_KEY = "fitnexx-performance-v1";

export const DEMO_MUSCLE_GROUPS: MuscleGroup[] = [
  { id: "mg-chest", name: "Chest" },
  { id: "mg-back", name: "Back" },
  { id: "mg-legs", name: "Legs" },
  { id: "mg-shoulders", name: "Shoulders" },
  { id: "mg-arms", name: "Arms" },
  { id: "mg-core", name: "Core" },
];

export const DEMO_EXERCISES: Exercise[] = [
  { id: "ex-bench", name: "Bench press", muscleGroupId: "mg-chest" },
  { id: "ex-fly", name: "Cable fly", muscleGroupId: "mg-chest" },
  { id: "ex-row", name: "Barbell row", muscleGroupId: "mg-back" },
  { id: "ex-pull", name: "Pull-up", muscleGroupId: "mg-back" },
  { id: "ex-squat", name: "Back squat", muscleGroupId: "mg-legs" },
  { id: "ex-rdl", name: "Romanian deadlift", muscleGroupId: "mg-legs" },
  { id: "ex-ohp", name: "Overhead press", muscleGroupId: "mg-shoulders" },
  { id: "ex-curl", name: "Bicep curl", muscleGroupId: "mg-arms" },
];

export const ALL_MUSCLES = "__all__" as const;

export const VOLUME_LABEL = "Volume (kg)";
