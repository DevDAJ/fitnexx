"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMetricsState } from "@/hooks/useMetricsState";
import { DASHBOARD_ASSUMED_AVG_CALORIES } from "@/constants/metricsConstants";
import {
  estimateWeightGoalEta,
  formatEtaDuration,
  latestMetricEntry,
} from "@/utils/metricsUtils";

export function GoalEtaCard() {
  const { state, ready } = useMetricsState();

  const latest = latestMetricEntry(state.entries);

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

    const para: React.ReactNode[] = [
      <p key="assumption" className="text-muted-foreground text-sm">
        Average intake is assumed{" "}
        <span className="text-foreground font-medium tabular-nums">
          {DASHBOARD_ASSUMED_AVG_CALORIES.toLocaleString()} kcal/day
        </span>{" "}
        until macros tracking feeds this dashboard.
      </p>,
      <div key="current" className="text-sm">
        <span className="text-muted-foreground">Latest log: </span>
        <span className="font-medium tabular-nums">
          {latest.weightKg.toFixed(1)} kg · {latest.bodyFatPercent.toFixed(1)}
          %
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
      avgCaloriesPerDay: DASHBOARD_ASSUMED_AVG_CALORIES,
    });

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
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Est. TDEE ·×1.2</dt>
          <dd className="tabular-nums font-medium">
            {tdeeRounded > 0 ? `${tdeeRounded.toLocaleString()} kcal/day` : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Est. intake − TDEE</dt>
          <dd className="tabular-nums font-medium">{balRounded} kcal/day</dd>
        </div>
      </dl>,
    );

    if (
      eta.daysTotal != null &&
      Number.isFinite(eta.daysTotal) &&
      eta.message === ""
    ) {
      para.push(
        <p key="eta" className="mt-3 text-sm leading-relaxed">
          <span className="text-muted-foreground">Rough ETA to{" "}</span>
          <span className="font-medium tabular-nums">
            {targetKg.toFixed(1)} kg
          </span>
          <span className="text-muted-foreground"> at this deficit/surplus: </span>
          <span className="font-semibold">
            {formatEtaDuration(eta.daysTotal)}
          </span>
          <span className="text-muted-foreground text-xs">
            {" "}(~7700 kcal per kg heuristic; not individualized).
          </span>
        </p>,
      );
    } else if (eta.message) {
      para.push(
        <p key="msg" className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {eta.message}
        </p>,
      );
    }

    return <div className="flex flex-col gap-2">{para}</div>;
  }, [latest, ready, state.targetWeightKg]);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Goal timing</CardTitle>
        <CardDescription>
          Ballpark time to goal weight using BMR-derived TDEE vs assumed average
          calories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content}
        {ready &&
          latest &&
          state.targetBodyFatPercent != null && (
            <p className="text-muted-foreground mt-4 border-border border-t pt-3 text-xs leading-relaxed">
              Body fat goal:{" "}
              <span className="text-foreground font-medium tabular-nums">
                {state.targetBodyFatPercent}% body fat
              </span>
              . ETA above is inferred from scale weight trend only — recomposition paths
              are not modeled.
            </p>
          )}
      </CardContent>
    </Card>
  );
}
