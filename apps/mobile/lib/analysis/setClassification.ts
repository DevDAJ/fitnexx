import type { WorkoutSet } from "../types";
import { calculate1RM } from "./oneRepMax";

export type ScenarioCategory =
  | "same_weight"
  | "weight_increase"
  | "weight_decrease"
  | "support_decrease"
  | "support_increase";

export type Scenario =
  | "same_reps_up"
  | "same_reps_flat"
  | "same_reps_down_mild"
  | "same_reps_down_mod"
  | "same_reps_down_severe"
  | "inc_met"
  | "inc_exceeded"
  | "inc_below_sig"
  | "inc_below_slight"
  | "dec_met"
  | "dec_below_slight"
  | "dec_below_sig"
  | "sup_dec_met"
  | "sup_dec_below_slight"
  | "sup_dec_below_sig"
  | "sup_inc_met"
  | "sup_inc_below_slight"
  | "sup_inc_below_sig"
  | "unknown";

export interface SetClassification {
  scenario: Scenario;
  category: ScenarioCategory;
  message: string;
  tooltip: string;
  improve: string;
  color: string;
}

const REPS_TOLERANCE = 1;

export function classifySet(
  current: WorkoutSet,
  previous: WorkoutSet | null
): SetClassification {
  if (!previous) {
    return { scenario: "unknown", category: "same_weight", message: "First set", tooltip: "", improve: "", color: "#666" };
  }

  const wDelta = current.weight - previous.weight;
  const rDelta = current.reps - previous.reps;
  const isSameWeight = Math.abs(wDelta) < 0.5;
  const isWeightUp = wDelta > 0.5;
  const isWeightDown = wDelta < -0.5;

  if (isSameWeight) {
    if (rDelta >= REPS_TOLERANCE) return { scenario: "same_reps_up", category: "same_weight", message: "Reps increased", tooltip: "Same weight, more reps = progression", improve: "Try adding 2.5kg next session", color: "#22c55e" };
    if (rDelta <= -REPS_TOLERANCE * 3) return { scenario: "same_reps_down_severe", category: "same_weight", message: "Significant rep drop", tooltip: "Major regression at same weight", improve: "Check recovery, consider deload", color: "#ef4444" };
    if (rDelta <= -REPS_TOLERANCE * 2) return { scenario: "same_reps_down_mod", category: "same_weight", message: "Rep drop", tooltip: "Moderate drop in performance", improve: "Reduce weight by 5-10% next session", color: "#f97316" };
    if (rDelta <= -REPS_TOLERANCE) return { scenario: "same_reps_down_mild", category: "same_weight", message: "Slight rep drop", tooltip: "Minor fluctuation, monitor next session", improve: "Normal variance, keep same weight", color: "#f59e0b" };
    return { scenario: "same_reps_flat", category: "same_weight", message: "Maintaining", tooltip: "Same weight, same reps", improve: "Add 1-2 reps or increase weight next session", color: "#3b82f6" };
  }

  if (isWeightUp) {
    const prevBestReps = previous.reps;
    if (current.reps >= prevBestReps) return { scenario: "inc_exceeded", category: "weight_increase", message: "Weight up, reps matched", tooltip: "Excellent progression", improve: "Great work, maintain or push further", color: "#22c55e" };
    if (current.reps >= prevBestReps * 0.8) return { scenario: "inc_met", category: "weight_increase", message: "Weight up, reps close", tooltip: "Good progression, reps slightly down as expected", improve: "Build reps back to previous level", color: "#3b82f6" };
    if (current.reps >= prevBestReps * 0.5) return { scenario: "inc_below_slight", category: "weight_increase", message: "Weight up, reps low", tooltip: "Jump may have been too big", improve: "Try smaller weight increase", color: "#f59e0b" };
    return { scenario: "inc_below_sig", category: "weight_increase", message: "Weight up, reps way down", tooltip: "Weight jumped too high", improve: "Reduce weight, build back up", color: "#ef4444" };
  }

  if (isWeightDown) {
    const prevBestReps = previous.reps;
    if (current.reps >= prevBestReps) return { scenario: "dec_met", category: "weight_decrease", message: "Weight down, reps up", tooltip: "Deload or volume match", improve: "Good recovery strategy", color: "#3b82f6" };
    if (current.reps >= prevBestReps * 0.7) return { scenario: "dec_below_slight", category: "weight_decrease", message: "Weight and reps down", tooltip: "Both metrics dropped", improve: "Check fatigue, may need rest day", color: "#f59e0b" };
    return { scenario: "dec_below_sig", category: "weight_decrease", message: "Significant drop", tooltip: "Major performance decrease", improve: "Consider deload week", color: "#ef4444" };
  }

  return { scenario: "unknown", category: "same_weight", message: "", tooltip: "", improve: "", color: "#666" };
}

export function classifySetsInSession(sets: WorkoutSet[]): SetClassification[] {
  const workingSets = sets.filter((s) => s.setType !== "warmup");
  return workingSets.map((set, i) => {
    const prev = i > 0 ? workingSets[i - 1] : null;
    return classifySet(set, prev);
  });
}
