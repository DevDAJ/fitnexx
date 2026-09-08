export type SetType =
  | "normal"
  | "warmup"
  | "dropset"
  | "failure"
  | "amrap"
  | "left"
  | "right"
  | "cluster"
  | "giantset"
  | "superset"
  | "backoff"
  | "topset"
  | "feeder"
  | "negative"
  | "partial"
  | "rest-pause"
  | "myoreps";

export const SET_TYPE_FACTORS: Record<SetType, number> = {
  normal: 1.0,
  failure: 1.0,
  amrap: 1.0,
  cluster: 1.0,
  giantset: 1.0,
  superset: 1.0,
  backoff: 1.0,
  topset: 1.0,
  negative: 0.8,
  partial: 0.6,
  "rest-pause": 1.0,
  myoreps: 1.0,
  feeder: 0.5,
  dropset: 0.5,
  left: 1.0,
  right: 1.0,
  warmup: 0.0,
};

export const SET_TYPE_LABELS: Record<SetType, string> = {
  normal: "Normal",
  warmup: "Warmup",
  dropset: "Drop Set",
  failure: "Failure",
  amrap: "AMRAP",
  left: "Left",
  right: "Right",
  cluster: "Cluster",
  giantset: "Giant Set",
  superset: "Superset",
  backoff: "Backoff",
  topset: "Top Set",
  feeder: "Feeder",
  negative: "Negative",
  partial: "Partial",
  "rest-pause": "Rest-Pause",
  myoreps: "Myo-Reps",
};

export const SET_TYPE_COLORS: Record<SetType, string> = {
  normal: "#3b82f6",
  warmup: "#6b7280",
  dropset: "#f97316",
  failure: "#ef4444",
  amrap: "#ec4899",
  left: "#06b6d4",
  right: "#0ea5e9",
  cluster: "#8b5cf6",
  giantset: "#a855f7",
  superset: "#d946ef",
  backoff: "#f59e0b",
  topset: "#fbbf24",
  feeder: "#78716c",
  negative: "#dc2626",
  partial: "#fb923c",
  "rest-pause": "#14b8a6",
  myoreps: "#10b981",
};

export type PrType =
  | "weight"
  | "oneRm"
  | "volume"
  | "reps"
  | "weightedReps"
  | "sessionVolume"
  | "distance";

export type ExerciseTrendStatus =
  | "overload"
  | "stagnant"
  | "regression"
  | "new";

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

export type ScheduleSplit = "push_pull_legs" | "upper_lower" | "custom";

export interface ScheduleDay {
  dayOfWeek: number;
  templateId: string;
  label: string;
}

export interface Schedule {
  id: string;
  name: string;
  split: ScheduleSplit;
  days: ScheduleDay[];
}

export interface ExerciseSuggestion {
  muscle: string;
  reason: string;
  score: number;
  weeklySets: number;
  scoreLabel: string;
  plateau?: PlateauInfo;
  exercises: {
    name: string;
    primaryMuscle: string;
    equipment?: string;
  }[];
}

export interface Meal {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUri?: string;
}

export interface MealTemplate {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Gym {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  equipment: string[];
}

export interface BodyMetrics {
  date: string;
  weight: number;
  height: number;
  bodyFat?: number;
  age: number;
  sex: "male" | "female";
  targetWeight?: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
}

export interface MetricsReminder {
  enabled: boolean;
  frequency: "daily" | "weekly";
  weekday?: number;
  hour: number;
  minute: number;
}

export interface HabitReminder {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface HabitReminders {
  training: HabitReminder;
  mealLog: HabitReminder;
}
