import type { Workout } from "../types";
import { calculate1RM } from "./oneRepMax";

export interface RatioPair {
  id: string;
  name: string;
  numerator: string[];
  denominator: string[];
  expectedMin: number;
  expectedMax: number;
  hardMin: number;
  hardMax: number;
}

export const RATIO_PAIRS: RatioPair[] = [
  { id: "bench-ohp", name: "Bench : OHP", numerator: ["bench press", "barbell bench"], denominator: ["overhead press", "ohp", "military press"], expectedMin: 1.5, expectedMax: 2.0, hardMin: 1.2, hardMax: 2.5 },
  { id: "squat-bench", name: "Squat : Bench", numerator: ["squat", "barbell squat", "back squat"], denominator: ["bench press", "barbell bench"], expectedMin: 1.2, expectedMax: 1.6, hardMin: 1.0, hardMax: 2.0 },
  { id: "deadlift-squat", name: "Deadlift : Squat", numerator: ["deadlift", "conventional deadlift", "sumo deadlift"], denominator: ["squat", "barbell squat", "back squat"], expectedMin: 1.1, expectedMax: 1.4, hardMin: 0.9, hardMax: 1.7 },
  { id: "row-bench", name: "Row : Bench", numerator: ["barbell row", "bent over row", "pendlay row"], denominator: ["bench press", "barbell bench"], expectedMin: 0.7, expectedMax: 1.0, hardMin: 0.5, hardMax: 1.2 },
  { id: "ohp-row", name: "OHP : Row", numerator: ["overhead press", "ohp", "military press"], denominator: ["barbell row", "bent over row"], expectedMin: 0.6, expectedMax: 0.85, hardMin: 0.45, hardMax: 1.0 },
  { id: "squat-dead", name: "Squat : Deadlift", numerator: ["squat", "barbell squat", "back squat"], denominator: ["deadlift", "conventional deadlift"], expectedMin: 0.75, expectedMax: 1.0, hardMin: 0.6, hardMax: 1.15 },
  { id: "legpress-squat", name: "Leg Press : Squat", numerator: ["leg press"], denominator: ["squat", "barbell squat", "back squat"], expectedMin: 1.5, expectedMax: 2.5, hardMin: 1.0, hardMax: 3.5 },
  { id: "curl-tricep", name: "Curl : Tricep Pushdown", numerator: ["barbell curl", "dumbbell curl", "hammer curl"], denominator: ["tricep pushdown", "tricep extension", "skull crusher"], expectedMin: 0.5, expectedMax: 0.8, hardMin: 0.3, hardMax: 1.0 },
  { id: "lat-pulldown-row", name: "Lat Pulldown : Row", numerator: ["lat pulldown", "pull up", "chin up"], denominator: ["barbell row", "cable row", "seated row"], expectedMin: 0.7, expectedMax: 1.0, hardMin: 0.5, hardMax: 1.2 },
  { id: "lunge-squat", name: "Lunge : Squat", numerator: ["lunge", "bulgarian split squat", "walking lunge"], denominator: ["squat", "barbell squat", "back squat"], expectedMin: 0.5, expectedMax: 0.8, hardMin: 0.3, hardMax: 1.0 },
  { id: "hipthrust-squat", name: "Hip Thrust : Squat", numerator: ["hip thrust", "glute bridge"], denominator: ["squat", "barbell squat", "back squat"], expectedMin: 0.7, expectedMax: 1.1, hardMin: 0.5, hardMax: 1.4 },
  { id: "pullup-dip", name: "Pull-up : Dip", numerator: ["pull up", "chin up"], denominator: ["dip", "bench dip"], expectedMin: 0.7, expectedMax: 1.0, hardMin: 0.5, hardMax: 1.3 },
  { id: "romanian-dead", name: "RDL : Deadlift", numerator: ["romanian deadlift", "rdl"], denominator: ["deadlift", "conventional deadlift"], expectedMin: 0.5, expectedMax: 0.75, hardMin: 0.35, hardMax: 0.9 },
];

export interface BalanceFinding {
  pair: RatioPair;
  ratio: number;
  status: "ok" | "watch" | "flag";
  trend: "closing" | "widening" | "stable";
}

export function computeStrengthBalance(workouts: Workout[]): BalanceFinding[] {
  if (workouts.length < 3) return [];

  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const findings: BalanceFinding[] = [];

  for (const pair of RATIO_PAIRS) {
    const bestBySession = sorted.map((w) => {
      let bestNum = 0;
      let bestDen = 0;
      for (const ex of w.exercises) {
        const name = ex.exerciseName.toLowerCase();
        const working = ex.sets.filter((s) => s.setType !== "warmup" && s.weight > 0);
        if (working.length === 0) continue;
        const bestSet = Math.max(...working.map((s) => calculate1RM(s.weight, s.reps)));

        if (pair.numerator.some((n) => name.includes(n))) {
          bestNum = Math.max(bestNum, bestSet);
        }
        if (pair.denominator.some((d) => name.includes(d))) {
          bestDen = Math.max(bestDen, bestSet);
        }
      }
      return { num: bestNum, den: bestDen };
    });

    // Take last 5 sessions with both exercises
    const valid = bestBySession.filter((s) => s.num > 0 && s.den > 0).slice(-5);
    if (valid.length < 2) continue;

    const avgNum = valid.reduce((a, s) => a + s.num, 0) / valid.length;
    const avgDen = valid.reduce((a, s) => a + s.den, 0) / valid.length;
    const ratio = avgDen > 0 ? avgNum / avgDen : 0;

    let status: BalanceFinding["status"] = "ok";
    if (ratio < pair.hardMin || ratio > pair.hardMax) status = "flag";
    else if (ratio < pair.expectedMin || ratio > pair.expectedMax) status = "watch";

    // Trend: compare first half vs second half of valid sessions
    let trend: BalanceFinding["trend"] = "stable";
    if (valid.length >= 4) {
      const half = Math.floor(valid.length / 2);
      const older = valid.slice(0, half);
      const newer = valid.slice(half);
      const oldAvg = older.reduce((a, s) => a + (s.num / s.den), 0) / older.length;
      const newAvg = newer.reduce((a, s) => a + (s.num / s.den), 0) / newer.length;
      const midpoint = (pair.expectedMin + pair.expectedMax) / 2;
      const oldDist = Math.abs(oldAvg - midpoint);
      const newDist = Math.abs(newAvg - midpoint);
      trend = newDist < oldDist ? "closing" : newDist > oldDist * 1.1 ? "widening" : "stable";
    }

    findings.push({ pair, ratio: Math.round(ratio * 100) / 100, status, trend });
  }

  // Dedup: max 3, flags first, then watches
  const flagged = findings.filter((f) => f.status === "flag");
  const watched = findings.filter((f) => f.status === "watch");
  return [...flagged, ...watched].slice(0, 3);
}
