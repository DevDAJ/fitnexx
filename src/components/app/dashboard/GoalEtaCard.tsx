"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ACTIVITY_TDEE_MULTIPLIERS,
  DASHBOARD_ASSUMED_AVG_CALORIES,
} from "@/constants/metricsConstants";
import { useMetricsState } from "@/hooks/useMetricsState";
import { useMacrosCaptureStore } from "@/stores/macrosCaptureStore";
import {
  estimateWeightGoalEta,
  formatEtaDuration,
  latestMetricEntry,
  dailyEnergyDeltaForWeeklyPaceKg,
  targetIntakeFromWeeklyPace,
} from "@/utils/metricsUtils";

export function GoalEtaCard() {
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

  const content = React.useMemo(() => {
    if (!ready) return null;
    if (!latest) {
      return (
        <p className="text-muted-foreground text-sm">
          Log your weight and body fat on the{" "}
          <span className="text-foreground font-medium">Metrics</span> page to
          see an estimate based on calorie balance.
        </p>
      );
    }

    const targetKg = state.targetWeightKg;
    const activityMultiplier = ACTIVITY_TDEE_MULTIPLIERS[state.activityLevel];
    const avgCaloriesForBalance =
      todayCalories > 0
        ? todayCalories
        : DASHBOARD_ASSUMED_AVG_CALORIES;

    const assumptionNote = (
      <p key="assumption" className="text-muted-foreground text-sm">
        {todayCalories > 0 ? (
          <>
            Today's captured intake is{" "}
            <span className="text-foreground font-medium tabular-nums">
              {Math.round(todayCalories).toLocaleString()} kcal
            </span>
            .
          </>
        ) : (
          <>
            Average intake falls back to{" "}
            <span className="text-foreground font-medium tabular-nums">
              {DASHBOARD_ASSUMED_AVG_CALORIES.toLocaleString()} kcal/day
            </span>{" "}
            until you capture macros today using the Macros page.
          </>
        )}
      </p>
    );

    const para: React.ReactNode[] = [
      assumptionNote,
      <div key="current" className="text-sm">
        <span className="text-muted-foreground">Latest log: </span>
        <span className="font-medium tabular-nums">
          {latest.weightKg.toFixed(1)} kg · {latest.bodyFatPercent.toFixed(1)}%
        </span>
      </div>,
    ];

    if (targetKg == null) {
      para.push(
        <p key="need-target" className="text-muted-foreground mt-3 text-sm">
          Set a <span className="text-foreground font-medium">goal weight</span>{" "}
          on Metrics to estimate time to goal.
        </p>,
      );
      return <>{para}</>;
    }

    const eta = estimateWeightGoalEta({
      currentWeightKg: latest.weightKg,
      targetWeightKg: targetKg,
      bodyFatPercent: latest.bodyFatPercent,
      avgCaloriesPerDay: avgCaloriesForBalance,
      activityTdeeMultiplier: activityMultiplier,
      targetWeeklyPaceKg: state.targetWeeklyPaceKg,
    });

    const kgDelta = targetKg - latest.weightKg;
    const paceKg = state.targetWeeklyPaceKg;
    const showTargetFromPace =
      paceKg != null &&
      paceKg > 0 &&
      Math.abs(kgDelta) >= 0.25 &&
      (eta.kind === "cut" || eta.kind === "bulk");

    const targetIntakeFromPaceVal =
      showTargetFromPace && eta.tdeeEstimate > 0
        ? targetIntakeFromWeeklyPace({
            tdee: eta.tdeeEstimate,
            weeklyPaceKg: paceKg,
            direction: eta.kind === "cut" ? "lose" : "gain",
          })
        : null;

    const tdeeRounded = Math.round(eta.tdeeEstimate);
    const balRounded =
      eta.dailyEnergyBalance > 0
        ? `+${Math.round(eta.dailyEnergyBalance)}`
        : Math.round(eta.dailyEnergyBalance).toLocaleString();

    para.push(
      <dl
        key="energy"
        className="border-border mt-2 grid gap-1 border-t border-t-border/60 pt-3 text-sm"
      >
        {targetIntakeFromPaceVal != null && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground shrink-0">
              Target intake (from pace)
            </dt>
            <dd className="tabular-nums font-medium">
              {Math.round(targetIntakeFromPaceVal).toLocaleString()} kcal/day
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground shrink-0">
            Est. TDEE (×{activityMultiplier})
          </dt>
          <dd className="tabular-nums font-medium">
            {tdeeRounded > 0 ? `${tdeeRounded.toLocaleString()} kcal/day` : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Intake − TDEE</dt>
          <dd className="tabular-nums font-medium">{balRounded} kcal/day</dd>
        </div>
      </dl>,
    );

    if (
      state.targetWeeklyPaceKg != null &&
      state.targetWeeklyPaceKg > 0 &&
      (eta.kind === "cut" || eta.kind === "bulk") &&
      targetIntakeFromPaceVal == null
    ) {
      const implied = Math.round(
        dailyEnergyDeltaForWeeklyPaceKg(state.targetWeeklyPaceKg),
      );
      para.push(
        <p
          key="pace-balance"
          className="text-muted-foreground text-xs leading-relaxed"
        >
          Target pace implies about{" "}
          <span className="text-foreground font-medium tabular-nums">
            {implied.toLocaleString()} kcal/day
          </span>{" "}
          {eta.kind === "cut" ? "deficit" : "surplus"} vs estimated maintenance
          (7700 kcal/kg heuristic).
        </p>,
      );
    }

    if (
      eta.daysTotal != null &&
      Number.isFinite(eta.daysTotal) &&
      eta.message === ""
    ) {
      para.push(
        <p key="eta" className="mt-3 text-sm leading-relaxed">
          <span className="text-muted-foreground">Rough ETA to </span>
          <span className="font-medium tabular-nums">
            {targetKg.toFixed(1)} kg
          </span>
          <span className="text-muted-foreground">
            {" "}
            {state.targetWeeklyPaceKg != null && state.targetWeeklyPaceKg > 0
              ? "at your saved weekly pace: "
              : "at this deficit/surplus: "}
          </span>
          <span className="font-semibold">
            {formatEtaDuration(eta.daysTotal)}
          </span>
          <span className="text-muted-foreground text-xs">
            {" "}
            (~7700 kcal per kg heuristic; not individualized).
          </span>
        </p>,
      );
    } else if (eta.message) {
      para.push(
        <p
          key="msg"
          className="text-muted-foreground mt-3 text-sm leading-relaxed"
        >
          {eta.message}
        </p>,
      );
    }

    return <div className="flex flex-col gap-2">{para}</div>;
  }, [
    latest,
    ready,
    state.targetWeightKg,
    state.activityLevel,
    state.targetWeeklyPaceKg,
    todayCalories,
  ]);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Goal timing</CardTitle>
        <CardDescription>
          Rough ETA from BMR-based TDEE, optional weekly pace (target
          calories), and your saved or default average intake.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content}
        {ready && latest && state.targetBodyFatPercent != null && (
          <p className="text-muted-foreground mt-4 border-border border-t pt-3 text-xs leading-relaxed">
            Body fat goal:{" "}
            <span className="text-foreground font-medium tabular-nums">
              {state.targetBodyFatPercent}% body fat
            </span>
            . ETA above is inferred from scale weight trend only — recomposition
            paths are not modeled.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
