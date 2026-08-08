import type { ActivityLevel } from "../types/metricsTypes";

export const METRICS_STORAGE_KEY = "fitnexx-metrics-v1";

export const DASHBOARD_ASSUMED_AVG_CALORIES = 2000;

export const GOAL_TDEE_ACTIVITY_MULTIPLIER = 1.2;

export const ACTIVITY_TDEE_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const KCAL_PER_KG_BODY_MASS = 7700;
