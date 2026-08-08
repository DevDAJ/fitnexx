import {
  GOAL_TDEE_ACTIVITY_MULTIPLIER,
  KCAL_PER_KG_BODY_MASS,
} from "../constants/metricsConstants";
import type {
  ActivityLevel,
  BodyMetricEntry,
  MetricsState,
} from "../types/metricsTypes";

const ACTIVITY_LEVELS = new Set<ActivityLevel>([
  "sedentary", "light", "moderate", "active", "very_active",
]);

const empty: MetricsState = {
  entries: [],
  targetWeightKg: null,
  targetBodyFatPercent: null,
  activityLevel: "sedentary",
  targetWeeklyPaceKg: null,
};

export function mergePartialMetricsState(parsed: unknown): MetricsState {
  if (!parsed || typeof parsed !== "object") return empty;
  const p = parsed as Partial<MetricsState>;
  const activityLevel: ActivityLevel =
    typeof p.activityLevel === "string" &&
    ACTIVITY_LEVELS.has(p.activityLevel as ActivityLevel)
      ? (p.activityLevel as ActivityLevel)
      : "sedentary";
  const targetWeeklyPaceKg =
    typeof p.targetWeeklyPaceKg === "number" &&
    Number.isFinite(p.targetWeeklyPaceKg) && p.targetWeeklyPaceKg > 0
      ? p.targetWeeklyPaceKg
      : null;
  const rawEntries = Array.isArray(p.entries) ? p.entries : [];
  const entries = rawEntries.filter(
    (e): e is BodyMetricEntry =>
      typeof e === "object" && e !== null &&
      typeof (e as BodyMetricEntry).weightKg === "number" &&
      Number.isFinite((e as BodyMetricEntry).weightKg) &&
      typeof (e as BodyMetricEntry).date === "string" &&
      (e as BodyMetricEntry).date.length > 0,
  );
  return {
    entries,
    targetWeightKg:
      typeof p.targetWeightKg === "number" && Number.isFinite(p.targetWeightKg)
        ? p.targetWeightKg : null,
    targetBodyFatPercent:
      typeof p.targetBodyFatPercent === "number" &&
      Number.isFinite(p.targetBodyFatPercent)
        ? p.targetBodyFatPercent : null,
    activityLevel,
    targetWeeklyPaceKg,
  };
}
