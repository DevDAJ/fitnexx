"use client";

import { format } from "date-fns";
import * as React from "react";
import { DatePickerButton } from "@/components/app/DatePickerButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMetricsState } from "@/hooks/useMetricsState";
import { useMacrosCaptureStore } from "@/stores/macrosCaptureStore";
import type { ActivityLevel, BodyMetricEntry } from "@/types/metricsTypes";
import { bmrKatchMcArdle } from "@/utils/metricsUtils";

function parseOptionalFloat(raw: string): number | null {
  const v = Number.parseFloat(raw.replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary — desk, little exercise" },
  { value: "light", label: "Light — light exercise 1–3 days/wk" },
  { value: "moderate", label: "Moderate — moderate exercise 3–5 days/wk" },
  { value: "active", label: "Active — hard exercise 6–7 days/wk" },
  {
    value: "very_active",
    label: "Very active — very hard daily / physical job",
  },
];

export function MetricsDashboard() {
  const { state, setState, ready } = useMetricsState();

  const [logDate, setLogDate] = React.useState<Date>(() => new Date());
  const [logWeight, setLogWeight] = React.useState("");
  const [logBf, setLogBf] = React.useState("");

  const [targetWeight, setTargetWeight] = React.useState("");
  const [targetBf, setTargetBf] = React.useState("");
  const [activityLevel, setActivityLevel] =
    React.useState<ActivityLevel>("sedentary");
  const [targetWeeklyPace, setTargetWeeklyPace] = React.useState("");

  const todayDate = React.useMemo(
    () =>
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,
    [],
  );
  const macroRows = useMacrosCaptureStore((s) => s.rows);
  const todayMacros = React.useMemo(() => {
    const todayRows = macroRows.filter((r) => r.date === todayDate);
    const sum = (key: keyof typeof todayRows[0]) =>
      todayRows.reduce((acc, r) => {
        const v = Number.parseFloat(String(r[key]));
        return acc + (Number.isFinite(v) ? v : 0);
      }, 0);
    return {
      calories: sum("calories"),
      proteinG: sum("protein"),
      carbsG: sum("carbohydrates"),
      fatG: sum("fat"),
      count: todayRows.length,
    };
  }, [macroRows, todayDate]);

  React.useEffect(() => {
    const key = format(logDate, "yyyy-MM-dd");
    const hit = state.entries.find((e) => e.date === key);
    if (hit) {
      setLogWeight(String(hit.weightKg));
      setLogBf(String(hit.bodyFatPercent));
    } else {
      setLogWeight("");
      setLogBf("");
    }
  }, [logDate, state.entries]);

  React.useEffect(() => {
    if (!ready) return;
    setTargetWeight(
      state.targetWeightKg != null ? String(state.targetWeightKg) : "",
    );
    setTargetBf(
      state.targetBodyFatPercent != null
        ? String(state.targetBodyFatPercent)
        : "",
    );
    setActivityLevel(state.activityLevel);
    setTargetWeeklyPace(
      state.targetWeeklyPaceKg != null ? String(state.targetWeeklyPaceKg) : "",
    );
  }, [
    ready,
    state.targetWeightKg,
    state.targetBodyFatPercent,
    state.activityLevel,
    state.targetWeeklyPaceKg,
  ]);

  const draftWeightKg = parseOptionalFloat(logWeight);
  const draftBf = parseOptionalFloat(logBf);
  const draftBmr = bmrKatchMcArdle(draftWeightKg ?? 0, draftBf ?? 0);

  const saveTargets = React.useCallback(() => {
    const tw = parseOptionalFloat(targetWeight);
    const tb = parseOptionalFloat(targetBf);
    const paceRaw = parseOptionalFloat(targetWeeklyPace);
    const targetWeeklyPaceKg =
      paceRaw != null && paceRaw > 0 && paceRaw <= 3 ? paceRaw : null;
    setState((prev) => ({
      ...prev,
      targetWeightKg: tw,
      targetBodyFatPercent: tb,
      activityLevel,
      targetWeeklyPaceKg,
    }));
  }, [setState, targetBf, targetWeight, activityLevel, targetWeeklyPace]);

  const saveEntry = React.useCallback(() => {
    const weightKg = parseOptionalFloat(logWeight);
    const bodyFatPercent = parseOptionalFloat(logBf);
    if (
      weightKg === null ||
      weightKg <= 0 ||
      bodyFatPercent === null ||
      bodyFatPercent < 0 ||
      bodyFatPercent > 100
    ) {
      return;
    }
    const date = format(logDate, "yyyy-MM-dd");
    const next: BodyMetricEntry = {
      id: crypto.randomUUID(),
      date,
      weightKg,
      bodyFatPercent,
    };
    setState((prev) => ({
      ...prev,
      entries: [...prev.entries.filter((e) => e.date !== date), next],
    }));
  }, [logBf, logDate, logWeight, setState]);

  const sortedRecent = React.useMemo(
    () => [...state.entries].sort((a, b) => b.date.localeCompare(a.date)),
    [state.entries],
  );

  return (
    <div className="flex flex-col gap-6">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Targets</CardTitle>
          <CardDescription>
            Set goal weight (kg), body fat %, activity level, optional weekly
            pace, and optional typical daily macros. The dashboard uses pace to
            derive target calories for loss or gain; saved averages refine the
            energy-balance line.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!ready ? (
            <p className="text-sm text-muted-foreground">Loading saved data…</p>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <div className="grid gap-2 sm:flex-1 sm:min-w-[140px]">
                  <Label htmlFor="target-weight">Target weight (kg)</Label>
                  <Input
                    id="target-weight"
                    inputMode="decimal"
                    placeholder="75"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 sm:flex-1 sm:min-w-[140px]">
                  <Label htmlFor="target-bf">Target body fat (%)</Label>
                  <Input
                    id="target-bf"
                    inputMode="decimal"
                    placeholder="18"
                    value={targetBf}
                    onChange={(e) => setTargetBf(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="activity-level">Activity level</Label>
                <Select
                  value={activityLevel}
                  onValueChange={(v) => setActivityLevel(v as ActivityLevel)}
                >
                  <SelectTrigger
                    id="activity-level"
                    className="h-9 w-full sm:max-w-md"
                  >
                    <SelectValue placeholder="Activity" />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {ACTIVITY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:max-w-xs">
                <Label htmlFor="weekly-pace">Goal pace (kg/week)</Label>
                <Input
                  id="weekly-pace"
                  inputMode="decimal"
                  placeholder="0.5"
                  value={targetWeeklyPace}
                  onChange={(e) => setTargetWeeklyPace(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">
                  Weekly change toward goal weight — loss rate when cutting,
                  gain when bulking. When set, target intake on the dashboard is
                  TDEE adjusted by this pace (7700 kcal/kg heuristic). Leave
                  blank to estimate ETA only from average intake vs TDEE.
                  Values above 3 kg/week are not saved.
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  Today's live intake
                </p>
                {todayMacros.count > 0 ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <span className="text-muted-foreground">Calories: </span>
                      <span className="font-medium tabular-nums">
                        {Math.round(todayMacros.calories).toLocaleString()} kcal
                      </span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Protein: </span>
                      <span className="font-medium tabular-nums">
                        {todayMacros.proteinG.toFixed(1)} g
                      </span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Carbs: </span>
                      <span className="font-medium tabular-nums">
                        {todayMacros.carbsG.toFixed(1)} g
                      </span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Fat: </span>
                      <span className="font-medium tabular-nums">
                        {todayMacros.fatG.toFixed(1)} g
                      </span>
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({todayMacros.count} item{todayMacros.count !== 1 ? "s" : ""})
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    No macros captured today. Use the{" "}
                    <span className="text-foreground font-medium">Macros</span>{" "}
                    page to log your meals.
                  </p>
                )}
              </div>
              <Button type="button" variant="secondary" onClick={saveTargets}>
                Save targets
              </Button>
              {(state.targetWeightKg != null ||
                state.targetBodyFatPercent != null ||
                state.targetWeeklyPaceKg != null ||
                state.activityLevel !== "sedentary") && (
                <p className="text-muted-foreground text-sm">
                  Saved:{" "}
                  {[
                    state.targetWeightKg != null &&
                      `${state.targetWeightKg} kg`,
                    state.targetBodyFatPercent != null &&
                      `${state.targetBodyFatPercent}% body fat`,
                    state.activityLevel !== "sedentary" &&
                      ACTIVITY_OPTIONS.find(
                        (o) => o.value === state.activityLevel,
                      )?.label,
                    state.targetWeeklyPaceKg != null &&
                      `${state.targetWeeklyPaceKg} kg/week pace`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Body composition log</CardTitle>
          <CardDescription>
            Log weight (kg) and body fat %. BMR uses the Katch–McArdle equation
            from lean mass estimate.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!ready ? (
            <p className="text-sm text-muted-foreground">Loading saved data…</p>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                <DatePickerButton date={logDate} onChange={setLogDate} />
                <div className="grid gap-2 sm:flex-1 sm:min-w-[120px]">
                  <Label htmlFor="metric-weight">Weight (kg)</Label>
                  <Input
                    id="metric-weight"
                    inputMode="decimal"
                    placeholder="78.5"
                    value={logWeight}
                    onChange={(e) => setLogWeight(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 sm:flex-1 sm:min-w-[120px]">
                  <Label htmlFor="metric-bf">Body fat (%)</Label>
                  <Input
                    id="metric-bf"
                    inputMode="decimal"
                    placeholder="20"
                    value={logBf}
                    onChange={(e) => setLogBf(e.target.value)}
                  />
                </div>
                <Button type="button" onClick={saveEntry}>
                  Save entry
                </Button>
              </div>
              <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Estimated BMR: </span>
                <span className="font-medium tabular-nums">
                  {draftBmr != null
                    ? `${Math.round(draftBmr).toLocaleString()} kcal/day`
                    : "—"}
                </span>
                <p className="text-muted-foreground mt-2 text-xs">
                  Not medical advice — rough metabolic estimate only.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Recent entries</p>
                {sortedRecent.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No entries yet — add weight and body fat above.
                  </p>
                ) : (
                  <ul className="divide-border max-h-60 divide-y overflow-y-auto rounded-md border">
                    {sortedRecent.slice(0, 24).map((e) => {
                      const bmrEst = bmrKatchMcArdle(
                        e.weightKg,
                        e.bodyFatPercent,
                      );
                      const bm = bmrEst != null ? Math.round(bmrEst) : null;
                      return (
                        <li
                          key={e.id}
                          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
                        >
                          <span className="text-muted-foreground font-medium tabular-nums">
                            {format(
                              new Date(`${e.date}T12:00:00`),
                              "MMM d, yyyy",
                            )}
                          </span>
                          <span>
                            {e.weightKg.toFixed(1)} kg ·{" "}
                            {e.bodyFatPercent.toFixed(1)}% BF
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {bm != null
                              ? `BMR ~${bm.toLocaleString()} kcal`
                              : ""}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 shrink-0"
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                entries: prev.entries.filter(
                                  (x) => x.id !== e.id,
                                ),
                              }))
                            }
                          >
                            Remove
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
