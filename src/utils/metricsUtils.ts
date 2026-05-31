import {
  GOAL_TDEE_ACTIVITY_MULTIPLIER,
  KCAL_PER_KG_BODY_MASS,
} from "@/constants/metricsConstants";
import type {
  ActivityLevel,
  BodyMetricEntry,
  MetricsState,
} from "@/types/metricsTypes";

const ACTIVITY_LEVELS = new Set<ActivityLevel>([
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
]);

const empty: MetricsState = {
  entries: [],
  targetWeightKg: null,
  targetBodyFatPercent: null,
  activityLevel: "sedentary",
  targetWeeklyPaceKg: null,
};

export function mergePartialMetricsState(parsed: unknown): MetricsState {
  if (!parsed || typeof parsed !== "object") {
    return empty;
  }
  const p = parsed as Partial<MetricsState>;
  const activityLevel: ActivityLevel =
    typeof p.activityLevel === "string" &&
    ACTIVITY_LEVELS.has(p.activityLevel as ActivityLevel)
      ? (p.activityLevel as ActivityLevel)
      : "sedentary";
  const targetWeeklyPaceKg =
    typeof p.targetWeeklyPaceKg === "number" &&
    Number.isFinite(p.targetWeeklyPaceKg) &&
    p.targetWeeklyPaceKg > 0
      ? p.targetWeeklyPaceKg
      : null;
  const rawEntries = Array.isArray(p.entries) ? p.entries : [];
  const entries = rawEntries.filter(
    (e): e is BodyMetricEntry =>
      typeof e === "object" &&
      e !== null &&
      typeof (e as BodyMetricEntry).weightKg === "number" &&
      Number.isFinite((e as BodyMetricEntry).weightKg) &&
      typeof (e as BodyMetricEntry).date === "string" &&
      (e as BodyMetricEntry).date.length > 0,
  );
  return {
    entries,
    targetWeightKg:
      typeof p.targetWeightKg === "number" && Number.isFinite(p.targetWeightKg)
        ? p.targetWeightKg
        : null,
    targetBodyFatPercent:
      typeof p.targetBodyFatPercent === "number" &&
      Number.isFinite(p.targetBodyFatPercent)
        ? p.targetBodyFatPercent
        : null,
    activityLevel,
    targetWeeklyPaceKg,
  };
}

/** Katch–McArdle: BMR from lean body mass (kcal/day) */
export function bmrKatchMcArdle(
  weightKg: number,
  bodyFatPercent: number,
): number | null {
  if (
    !Number.isFinite(weightKg) ||
    weightKg <= 0 ||
    !Number.isFinite(bodyFatPercent) ||
    bodyFatPercent < 0 ||
    bodyFatPercent > 100
  ) {
    return null;
  }
  const leanKg = weightKg * (1 - bodyFatPercent / 100);
  if (leanKg <= 0) return null;
  return 370 + 21.6 * leanKg;
}

export function latestMetricEntry(
  entries: BodyMetricEntry[],
): BodyMetricEntry | null {
  if (entries.length === 0) return null;
  return [...entries].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

/** kcal/day deficit (cut) or surplus (bulk) implied by a weekly scale-weight pace. */
export function dailyEnergyDeltaForWeeklyPaceKg(weeklyPaceKg: number): number {
  return (weeklyPaceKg * KCAL_PER_KG_BODY_MASS) / 7;
}

/** Maintenance-adjusted intake that matches the given weekly loss/gain pace (heuristic). */
export function targetIntakeFromWeeklyPace(args: {
  tdee: number;
  weeklyPaceKg: number;
  direction: "lose" | "gain";
}): number {
  const delta = dailyEnergyDeltaForWeeklyPaceKg(args.weeklyPaceKg);
  return args.direction === "lose" ? args.tdee - delta : args.tdee + delta;
}

export type WeightGoalEta = {
  kind: "cut" | "bulk" | "maintain" | "none";
  daysTotal: number | null;
  dailyEnergyBalance: number;
  tdeeEstimate: number;
  bmr: number;
  message: string;
};

export function estimateWeightGoalEta(args: {
  currentWeightKg: number;
  targetWeightKg: number;
  bodyFatPercent: number;
  avgCaloriesPerDay: number;
  activityTdeeMultiplier?: number;
  targetWeeklyPaceKg?: number | null;
}): WeightGoalEta {
  const {
    currentWeightKg,
    targetWeightKg,
    bodyFatPercent,
    avgCaloriesPerDay,
    activityTdeeMultiplier = GOAL_TDEE_ACTIVITY_MULTIPLIER,
    targetWeeklyPaceKg = null,
  } = args;
  const bmr = bmrKatchMcArdle(currentWeightKg, bodyFatPercent);
  if (bmr == null) {
    return {
      kind: "none",
      daysTotal: null,
      dailyEnergyBalance: 0,
      tdeeEstimate: 0,
      bmr: 0,
      message: "Add weight and body fat to estimate energy needs.",
    };
  }

  const tdeeEstimate = bmr * activityTdeeMultiplier;
  const balance = avgCaloriesPerDay - tdeeEstimate;
  const kgDelta = targetWeightKg - currentWeightKg;
  const paceKg =
    targetWeeklyPaceKg != null &&
    targetWeeklyPaceKg > 0 &&
    Number.isFinite(targetWeeklyPaceKg)
      ? targetWeeklyPaceKg
      : null;
  const usePace = paceKg != null;

  if (Math.abs(kgDelta) < 0.25) {
    return {
      kind: "maintain",
      daysTotal: null,
      dailyEnergyBalance: balance,
      tdeeEstimate,
      bmr,
      message: "You are already at your target weight (within 0.25 kg).",
    };
  }

  if (kgDelta < 0) {
    const daysFromPace = usePace ? (Math.abs(kgDelta) / paceKg) * 7 : null;

    if (balance >= 0) {
      if (usePace && daysFromPace != null) {
        return {
          kind: "cut",
          daysTotal: daysFromPace,
          dailyEnergyBalance: balance,
          tdeeEstimate,
          bmr,
          message:
            "Average intake is at or above estimated maintenance — the ETA follows your target weekly pace, not current intake.",
        };
      }
      return {
        kind: "cut",
        daysTotal: null,
        dailyEnergyBalance: balance,
        tdeeEstimate,
        bmr,
        message:
          "Average intake is at or above estimated maintenance — you would not expect to lose weight toward this goal without a calorie deficit.",
      };
    }
    const deficit = -balance;
    if (usePace && daysFromPace != null) {
      return {
        kind: "cut",
        daysTotal: daysFromPace,
        dailyEnergyBalance: balance,
        tdeeEstimate,
        bmr,
        message:
          deficit <= 50
            ? "At this intake, estimated deficit is small — progress may be slower than your target weekly pace."
            : "",
      };
    }
    if (deficit <= 50) {
      return {
        kind: "cut",
        daysTotal: null,
        dailyEnergyBalance: balance,
        tdeeEstimate,
        bmr,
        message:
          "At this intake, estimated deficit is small — weight loss toward this goal would be very slow or stall.",
      };
    }
    const daysTotal = (Math.abs(kgDelta) * KCAL_PER_KG_BODY_MASS) / deficit;
    return {
      kind: "cut",
      daysTotal,
      dailyEnergyBalance: balance,
      tdeeEstimate,
      bmr,
      message: "",
    };
  }

  const daysFromPaceBulk = usePace ? (kgDelta / paceKg) * 7 : null;

  if (balance <= 0) {
    if (usePace && daysFromPaceBulk != null) {
      return {
        kind: "bulk",
        daysTotal: daysFromPaceBulk,
        dailyEnergyBalance: balance,
        tdeeEstimate,
        bmr,
        message:
          "Average intake is at or below estimated maintenance — the ETA follows your target weekly pace, not current intake.",
      };
    }
    return {
      kind: "bulk",
      daysTotal: null,
      dailyEnergyBalance: balance,
      tdeeEstimate,
      bmr,
      message:
        "Average intake is at or below estimated maintenance — you would not expect to gain weight toward this goal without a calorie surplus.",
    };
  }

  const surplus = balance;
  if (usePace && daysFromPaceBulk != null) {
    return {
      kind: "bulk",
      daysTotal: daysFromPaceBulk,
      dailyEnergyBalance: balance,
      tdeeEstimate,
      bmr,
      message:
        surplus <= 50
          ? "At this intake, estimated surplus is small — progress may be slower than your target weekly pace."
          : "",
    };
  }
  if (surplus <= 50) {
    return {
      kind: "bulk",
      daysTotal: null,
      dailyEnergyBalance: balance,
      tdeeEstimate,
      bmr,
      message:
        "At this intake, estimated surplus is small — gaining weight toward this goal would be very slow or stall.",
    };
  }
  const daysTotal = (kgDelta * KCAL_PER_KG_BODY_MASS) / surplus;
  return {
    kind: "bulk",
    daysTotal,
    dailyEnergyBalance: balance,
    tdeeEstimate,
    bmr,
    message: "",
  };
}

export function formatEtaDuration(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return "";
  if (days < 14) return `about ${Math.round(days)} days`;
  const weeks = days / 7;
  if (weeks < 8) return `about ${Math.round(weeks)} weeks`;
  const months = weeks / 4.345;
  return `about ${months.toFixed(1)} months`;
}
