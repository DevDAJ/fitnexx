import {
  differenceInCalendarDays,
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import {
  ALL_MUSCLES,
  DEMO_EXERCISES,
  DEMO_MUSCLE_GROUPS,
  VOLUME_LABEL,
} from "@/constants/performanceConstants";
import type {
  Exercise,
  MetricMode,
  PerformanceState,
  WeightUnit,
  WorkoutSet,
} from "@/types/performanceTypes";

export function seededPerformanceState(): PerformanceState {
  return {
    muscleGroups: DEMO_MUSCLE_GROUPS,
    exercises: DEMO_EXERCISES,
    sets: [],
  };
}

export function mergePartialPerformanceState(
  parsed: unknown,
): PerformanceState {
  if (!parsed || typeof parsed !== "object") {
    return seededPerformanceState();
  }
  const p = parsed as Partial<PerformanceState>;
  const base = seededPerformanceState();
  return {
    muscleGroups:
      p.muscleGroups && p.muscleGroups.length > 0
        ? p.muscleGroups
        : base.muscleGroups,
    exercises:
      p.exercises && p.exercises.length > 0 ? p.exercises : base.exercises,
    sets: Array.isArray(p.sets) ? p.sets : [],
  };
}

export function makeCustomExercise(
  name: string,
  muscleGroupId: string,
): Exercise {
  const trimmed = name.trim();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `ex-custom-${crypto.randomUUID()}`
      : `ex-custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id,
    name: trimmed,
    muscleGroupId,
  };
}

export function toKg(weight: number, unit: WeightUnit): number {
  return unit === "lbs" ? weight * 0.45359237 : weight;
}

export function normalizeVolumeKg(
  weight: number,
  unit: WeightUnit,
  reps: number,
): number {
  return toKg(weight, unit) * reps;
}

export function metricLabelFor(mode: MetricMode) {
  return mode === "volume" ? VOLUME_LABEL : "Reps";
}

export function addMetric(s: WorkoutSet, m: MetricMode): number {
  return m === "volume" ? normalizeVolumeKg(s.weight, s.unit, s.reps) : s.reps;
}

export function filterSetsInRange(
  sets: WorkoutSet[],
  rangeStart: Date,
  rangeEnd: Date,
): WorkoutSet[] {
  const a = format(startOfDay(rangeStart), "yyyy-MM-dd");
  const b = format(endOfDay(rangeEnd), "yyyy-MM-dd");
  return sets.filter((s) => s.date >= a && s.date <= b);
}

export function previousPeriodRange(rangeStart: Date, rangeEnd: Date) {
  const span = Math.max(0, differenceInCalendarDays(rangeEnd, rangeStart));
  const prevEnd = subDays(startOfDay(rangeStart), 1);
  const prevStart = subDays(prevEnd, span);
  return { start: prevStart, end: endOfDay(prevEnd) };
}

export function metricByDateForMuscle(
  sets: WorkoutSet[],
  exercises: Exercise[],
  dayKeys: string[],
  muscleFilter: string | typeof ALL_MUSCLES,
  mode: MetricMode,
): { date: string; value: number }[] {
  const exMuscle = new Map(exercises.map((e) => [e.id, e.muscleGroupId]));
  const byDate = new Map<string, number>(dayKeys.map((d) => [d, 0]));

  for (const s of sets) {
    if (!byDate.has(s.date)) continue;
    if (muscleFilter !== ALL_MUSCLES) {
      const mg = exMuscle.get(s.exerciseId);
      if (mg !== muscleFilter) continue;
    }
    byDate.set(s.date, (byDate.get(s.date) ?? 0) + addMetric(s, mode));
  }

  return dayKeys.map((date) => ({ date, value: byDate.get(date) ?? 0 }));
}

export function lineChartPoints(
  rows: { date: string; value: number }[],
): { date: string; value: number | null }[] {
  return rows.map(({ date, value }) => ({
    date,
    value: value === 0 ? null : value,
  }));
}

export function sparseValuePoints(
  rows: { date: string; value: number | null }[],
): { date: string; value: number }[] {
  return rows.filter(
    (r): r is { date: string; value: number } => r.value != null,
  );
}

export function sparseDeltaPoints(
  rows: { date: string; delta: number | null }[],
): { date: string; delta: number }[] {
  return rows.filter(
    (r): r is { date: string; delta: number } => r.delta != null,
  );
}

export function metricByDateForExercise(
  sets: WorkoutSet[],
  dayKeys: string[],
  exerciseId: string,
  mode: MetricMode,
): { date: string; value: number }[] {
  const byDate = new Map<string, number>(dayKeys.map((d) => [d, 0]));
  for (const s of sets) {
    if (s.exerciseId !== exerciseId) continue;
    if (!byDate.has(s.date)) continue;
    byDate.set(s.date, (byDate.get(s.date) ?? 0) + addMetric(s, mode));
  }
  return dayKeys.map((date) => ({ date, value: byDate.get(date) ?? 0 }));
}

export function totalMetric(sets: WorkoutSet[], metric: MetricMode): number {
  let t = 0;
  for (const s of sets) {
    t +=
      metric === "volume"
        ? normalizeVolumeKg(s.weight, s.unit, s.reps)
        : s.reps;
  }
  return t;
}

export function sortSetsForHistory(
  sets: WorkoutSet[],
  exercises: Exercise[],
): WorkoutSet[] {
  const nameById = Object.fromEntries(
    exercises.map((e) => [e.id, e.name]),
  ) as Record<string, string>;

  return [...sets].sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    const an = nameById[a.exerciseId] ?? "";
    const bn = nameById[b.exerciseId] ?? "";
    if (an !== bn) {
      return an.localeCompare(bn);
    }
    return a.id.localeCompare(b.id);
  });
}
