import type { BodyMetrics } from "./types";

export const ACTIVITY_LEVELS: {
  key: BodyMetrics["activityLevel"];
  label: string;
  factor: number;
}[] = [
  { key: "sedentary", label: "Sedentary", factor: 1.2 },
  { key: "light", label: "Light", factor: 1.375 },
  { key: "moderate", label: "Moderate", factor: 1.55 },
  { key: "active", label: "Active", factor: 1.725 },
  { key: "very_active", label: "Very Active", factor: 1.9 },
];

export const ACTIVITY_FACTOR: Record<BodyMetrics["activityLevel"], number> =
  Object.fromEntries(ACTIVITY_LEVELS.map((l) => [l.key, l.factor])) as Record<
    BodyMetrics["activityLevel"],
    number
  >;

export function calcBMR(m: BodyMetrics): number {
  if (m.sex === "male") return 10 * m.weight + 6.25 * m.height - 5 * m.age + 5;
  return 10 * m.weight + 6.25 * m.height - 5 * m.age - 161;
}

export function calcTDEE(m: BodyMetrics): number {
  return calcBMR(m) * ACTIVITY_FACTOR[m.activityLevel];
}

export function fmtWeight(kg: number, lbs: boolean): string {
  const v = lbs ? kg * 2.20462 : kg;
  return `${v.toFixed(1)}${lbs ? "lb" : "kg"}`;
}
