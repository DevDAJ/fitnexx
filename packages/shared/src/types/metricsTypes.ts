export type BodyMetricEntry = {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
};

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type MetricsState = {
  entries: BodyMetricEntry[];
  targetWeightKg: number | null;
  targetBodyFatPercent: number | null;
  activityLevel: ActivityLevel;
  targetWeeklyPaceKg: number | null;
};
