"use client";

import { addDays, format } from "date-fns";
import * as React from "react";
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/app/dashboard/ChartCard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ACTIVITY_TDEE_MULTIPLIERS,
  KCAL_PER_KG_BODY_MASS,
} from "@/constants/metricsConstants";
import { useMetricsState } from "@/hooks/useMetricsState";
import { useMacrosCaptureStore } from "@/stores/macrosCaptureStore";
import {
  bmrKatchMcArdle,
  latestMetricEntry,
} from "@/utils/metricsUtils";

const chartConfig = {
  targetCalories: {
    label: "Target calories",
    color: "var(--chart-1)",
  },
  actualCalories: {
    label: "Today's intake",
    color: "var(--chart-3)",
  },
  band: {
    label: "± Range",
    color: "var(--chart-1)",
  },
};

export function CalorieTargetChart() {
  const { state, ready } = useMetricsState();
  const latest = latestMetricEntry(state.entries);

  const todayDate = React.useMemo(
    () =>
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,
    [],
  );
  const macroRows = useMacrosCaptureStore((s) => s.rows);
  const todayCalories = React.useMemo(() => {
    const todayRows = macroRows.filter((r) => r.date === todayDate);
    return todayRows.reduce((acc, r) => {
      const v = Number.parseFloat(r.calories);
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [macroRows, todayDate]);

  const chartData = React.useMemo(() => {
    if (!ready || !latest || state.targetWeightKg == null) return null;

    const activityMultiplier =
      ACTIVITY_TDEE_MULTIPLIERS[state.activityLevel];
    const kgDelta = state.targetWeightKg - latest.weightKg;
    const isCut = kgDelta < 0;
    const paceKg = state.targetWeeklyPaceKg ?? 0;
    const dailyDelta = paceKg > 0 ? (paceKg * KCAL_PER_KG_BODY_MASS) / 7 : 0;

    const days = Array.from({ length: 5 }, (_, i) => {
      const projectedWeight = latest.weightKg + (paceKg / 7) * i;
      const bmr = bmrKatchMcArdle(projectedWeight, latest.bodyFatPercent);
      const tdee = bmr != null ? bmr * activityMultiplier : 0;
      const target = isCut ? tdee - dailyDelta : tdee + dailyDelta;
      const upper = tdee > 0 ? Math.max(tdee, target) : 0;
      const lower = tdee > 0 ? Math.min(tdee, target) : 0;

      return {
        day: format(addDays(new Date(), i), "EEE"),
        date: addDays(new Date(), i),
        targetCalories: target > 0 ? Math.round(target) : null,
        upperBand: upper > 0 ? Math.round(upper) : null,
        lowerBand: lower > 0 ? Math.round(lower) : null,
        maintenance: tdee > 0 ? Math.round(tdee) : null,
        isToday: i === 0,
      };
    });

    return days;
  }, [latest, ready, state.targetWeightKg, state.activityLevel, state.targetWeeklyPaceKg]);

  return (
    <ChartCard
      title="Calorie target"
      description="Projected target intake based on current weight, body fat, and goal pace."
    >
      {!ready ? (
        <div className="text-muted-foreground flex min-h-[200px] flex-1 items-center justify-center text-sm">
          Loading…
        </div>
      ) : !chartData ? (
        <div className="text-muted-foreground flex min-h-[200px] flex-1 items-center justify-center text-center text-sm">
          Set a{" "}
          <span className="text-foreground font-medium mx-1">
            target weight
          </span>
          on the Metrics page to see your daily calorie target.
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="h-full min-h-[220px] w-full shrink-0"
        >
          <ComposedChart
            data={chartData}
            accessibilityLayer
            margin={{ left: 4, right: 16 }}
          >
            <XAxis
              dataKey="day"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={10}
            />
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              fontSize={10}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `${v}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Area
              type="monotone"
              dataKey="upperBand"
              stroke="none"
              fill="var(--color-band)"
              fillOpacity={0.08}
            />
            <Area
              type="monotone"
              dataKey="lowerBand"
              stroke="none"
              fill="var(--color-band)"
              fillOpacity={0.08}
            />
            <Line
              type="monotone"
              dataKey="targetCalories"
              stroke="var(--color-targetCalories)"
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
            <ReferenceLine
              y={todayCalories > 0 ? todayCalories : undefined}
              stroke="var(--color-actualCalories)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={
                todayCalories > 0
                  ? {
                      value: `${Math.round(todayCalories).toLocaleString()} kcal`,
                      position: "insideTopRight",
                      fontSize: 10,
                      fill: "var(--color-actualCalories)",
                    }
                  : undefined
              }
            />
          </ComposedChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
}
