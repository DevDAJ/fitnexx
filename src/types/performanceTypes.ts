export type MetricMode = "volume" | "reps";
export type WeightUnit = "kg" | "lbs";

export type MuscleGroup = {
  id: string;
  name: string;
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroupId: string;
};

export type WorkoutSet = {
  id: string;
  exerciseId: string;
  date: string; // YYYY-MM-DD
  weight: number;
  reps: number;
  unit: WeightUnit;
};

export type PerformanceState = {
  muscleGroups: MuscleGroup[];
  exercises: Exercise[];
  sets: WorkoutSet[];
};
