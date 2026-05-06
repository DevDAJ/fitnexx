import type { ActivityLevel } from "@/types/metricsTypes";

/** localStorage namespace for persisted body metrics */
export const METRICS_STORAGE_KEY = "fitnexx-metrics-v1";

/** Shown on dashboard goal card untilMacros tracking exists */
export const DASHBOARD_ASSUMED_AVG_CALORIES = 2000;

/** Multiply BMR by this to approximate TDEE (sedentary) for ETA heuristic */
export const GOAL_TDEE_ACTIVITY_MULTIPLIER = 1.2;

/** BMR → TDEE multiplier by activity tier */
export const ACTIVITY_TDEE_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** kcal per kg body mass change (rough rule of thumb) */
export const KCAL_PER_KG_BODY_MASS = 7700;
