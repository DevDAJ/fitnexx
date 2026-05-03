import { eachDayOfInterval, format, parseISO, startOfDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { ALL_MUSCLES } from "@/constants/performanceConstants";
import { usePerformanceState } from "@/hooks/usePerfomanceState";
import type { MetricMode } from "@/types/performanceTypes";
import {
  filterSetsInRange,
  lineChartPoints,
  metricByDateForExercise,
  metricByDateForMuscle,
  metricLabelFor,
  sparseDeltaPoints,
  sparseValuePoints,
} from "@/utils/performanceUtils";

export function usePerformanceCharts(rangeStart: Date, rangeEnd: Date) {
  const { state } = usePerformanceState();

  const [metric, setMetric] = useState<MetricMode>("volume");
  const [muscleFilter, setMuscleFilter] = useState<string | typeof ALL_MUSCLES>(
    ALL_MUSCLES,
  );

  const [chartExerciseId, setChartExerciseId] = useState<
    (typeof state.exercises)[number]["id"]
  >(state.exercises[0]?.id ?? "");
  const [comparisonBasis, setComparisonBasis] = useState<"muscle" | "exercise">(
    "muscle",
  );

  const dayRange = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfDay(rangeStart),
        end: startOfDay(rangeEnd),
      }),
    [rangeEnd, rangeStart],
  );

  const dayKeys = useMemo(
    () => dayRange.map((d) => format(d, "yyyy-MM-dd")),
    [dayRange],
  );

  const metricLabel = metricLabelFor(metric);

  const lineChartCfg = useMemo(
    () => ({
      value: {
        label: metricLabel,
        color: "var(--chart-1)",
      },
    }),
    [metricLabel],
  );

  const deltaChartCfg = useMemo(
    () => ({
      delta: {
        label: `${metricLabel} `,
        color: "var(--chart-1)",
      },
    }),
    [metricLabel],
  );

  const filteredExercises = useMemo(
    () =>
      muscleFilter === ALL_MUSCLES
        ? state.exercises
        : state.exercises.filter((e) => e.muscleGroupId === muscleFilter),
    [muscleFilter, state.exercises],
  );

  useEffect(() => {
    if (filteredExercises.length === 0) {
      setChartExerciseId("");
      return;
    }
    if (!filteredExercises.some((e) => e.id === chartExerciseId)) {
      setChartExerciseId(filteredExercises[0].id);
    }
  }, [chartExerciseId, filteredExercises]);

  const currentSets = useMemo(
    () => filterSetsInRange(state.sets, rangeStart, rangeEnd),
    [state.sets, rangeEnd, rangeStart],
  );

  const muscleLineNumeric = useMemo(
    () =>
      metricByDateForMuscle(
        currentSets,
        state.exercises,
        dayKeys,
        muscleFilter,
        metric,
      ),
    [currentSets, dayKeys, muscleFilter, metric, state.exercises],
  );

  const muscleLineData = useMemo(
    () => lineChartPoints(muscleLineNumeric),
    [muscleLineNumeric],
  );

  const exerciseLineNumeric = useMemo(
    () =>
      chartExerciseId
        ? metricByDateForExercise(currentSets, dayKeys, chartExerciseId, metric)
        : dayKeys.map((date) => ({ date, value: 0 })),
    [chartExerciseId, currentSets, dayKeys, metric],
  );

  const exerciseLineData = useMemo(
    () => lineChartPoints(exerciseLineNumeric),
    [exerciseLineNumeric],
  );

  const muscleChartSparse = useMemo(
    () => sparseValuePoints(muscleLineData),
    [muscleLineData],
  );

  const exerciseChartSparse = useMemo(
    () => sparseValuePoints(exerciseLineData),
    [exerciseLineData],
  );

  const comparisonLineData = useMemo(() => {
    const curMuscle = metricByDateForMuscle(
      currentSets,
      state.exercises,
      dayKeys,
      muscleFilter,
      metric,
    );
    const curEx =
      chartExerciseId &&
      metricByDateForExercise(currentSets, dayKeys, chartExerciseId, metric);

    const values =
      comparisonBasis === "muscle"
        ? curMuscle.map((row) => row.value)
        : curEx
          ? curEx.map((row) => row.value)
          : dayKeys.map(() => 0);

    const firstDataIndex = values.findIndex((v) => v > 0);

    return dayKeys.map((date, i) => {
      const c = values[i] ?? 0;

      if (c === 0) return { date, delta: null };
      if (i === firstDataIndex) return { date, delta: 0 };

      const prev = values[i - 1] ?? 0;
      return { date, delta: c - prev };
    });
  }, [
    chartExerciseId,
    comparisonBasis,
    currentSets,
    dayKeys,
    metric,
    muscleFilter,
    state.exercises,
  ]);
  const comparisonChartSparse = useMemo(
    () => sparseDeltaPoints(comparisonLineData),
    [comparisonLineData],
  );

  const comparisonSubtitle =
    comparisonBasis === "muscle"
      ? muscleFilter === ALL_MUSCLES
        ? "All muscle groups"
        : "Selected muscle group"
      : (filteredExercises.find((e) => e.id === chartExerciseId)?.name ??
        "Exercise");

  const xTickFmt = (iso: string) => format(parseISO(iso), "MMM d");

  return {
    metric,
    setMetric,
    muscleFilter,
    setMuscleFilter,
    chartExerciseId,
    setChartExerciseId,
    comparisonBasis,
    setComparisonBasis,
    metricLabel,
    lineChartCfg,
    deltaChartCfg,
    filteredExercises,
    muscleChartSparse,
    exerciseChartSparse,
    comparisonChartSparse,
    comparisonSubtitle,
    xTickFmt,
  };
}
