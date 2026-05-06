export type BodyMetricEntry = {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
};

/** PAL-style tiers for BMR → TDEE (same coefficients as common calorie formulas). */
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

/** Optional typical daily intake averages for dashboard energy balance. */
export type AvgMacrosDaily = {
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
};

export type MetricsState = {
  entries: BodyMetricEntry[];
  targetWeightKg: number | null;
  targetBodyFatPercent: number | null;
  activityLevel: ActivityLevel;
  /** kg per week toward the scale-weight goal (loss when cutting, gain when bulking). */
  targetWeeklyPaceKg: number | null;
  avgMacrosDaily: AvgMacrosDaily | null;
};
