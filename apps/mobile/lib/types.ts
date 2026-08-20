export type SetType = "normal" | "warmup" | "dropset" | "failure" | "amrap";

export type PrType =
  | "weight"
  | "oneRm"
  | "volume"
  | "reps"
  | "weightedReps"
  | "sessionVolume"
  | "distance";

export type ExerciseTrendStatus = "overload" | "stagnant" | "regression" | "new";

export interface WorkoutSet {
  weight: number;
  reps: number;
  rpe?: number;
  notes?: string;
  setType: SetType;
  isPr?: boolean;
  prTypes?: PrType[];
}

export interface ExerciseEntry {
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: string;
  title: string;
  exercises: ExerciseEntry[];
  duration: number;
  totalVolume: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: {
    exerciseName: string;
    targetSets: number;
    targetReps: number;
  }[];
}

export interface ExerciseAsset {
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  category: string;
  imageUrl?: string;
  gifUrl?: string;
  equipment?: string;
  instructions?: string;
}

export interface ExerciseHistoryEntry {
  date: string;
  weight: number;
  reps: number;
  oneRepMax: number;
  volume: number;
  isPr: boolean;
  prTypes?: PrType[];
  setType: SetType;
}

export interface ExerciseStats {
  name: string;
  totalSets: number;
  totalVolume: number;
  maxWeight: number;
  prCount: number;
  history: ExerciseHistoryEntry[];
  trendStatus: ExerciseTrendStatus;
  sessionsSinceProgress: number;
}

export interface DailySummary {
  date: string;
  totalVolume: number;
  sets: number;
  workoutTitle: string;
}

export interface MuscleWeeklyData {
  muscle: string;
  weeklySets: number;
  hypertrophyScore: number;
}

export interface PlateauInfo {
  exerciseName: string;
  sessionsSinceProgress: number;
  currentWeight: number;
  status: "static" | "general";
}

export type WeightUnit = "kg" | "lbs";
