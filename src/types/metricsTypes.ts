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

export type MetricsState = {
  entries: BodyMetricEntry[];
  targetWeightKg: number | null;
  targetBodyFatPercent: number | null;
  activityLevel: ActivityLevel;
  targetWeeklyPaceKg: number | null;
};
