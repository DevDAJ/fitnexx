"use client";

import { format, parse } from "date-fns";
import {
  ArrowRightLeftIcon,
  CirclePlusIcon,
  FlaskConical,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { type ComboboxOption, ComboPicker } from "@/components/app/ComboPicker";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePerformanceState } from "@/hooks/usePerfomanceState";
import { useGymStore } from "@/stores/gymStore";
import { useProgrammingStore } from "@/stores/programmingStore";
import type { WeightUnit, WorkoutSet } from "@/types/performanceTypes";
import cn from "@/utils/cn";
import { sortSetsForHistory } from "@/utils/performanceUtils";
import {
  checkExerciseAvailable,
  findAlternatives,
} from "@/utils/suggestionUtils";
import { ExerciseCreateDialog } from "./ExerciseCreateDialog";
import { SetHistoryRow } from "./SetHistoryRow";

function SessionBanner({
  sessionName,
  onEndSession,
}: {
  sessionName: string;
  onEndSession: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <FlaskConical className="size-4 shrink-0 text-primary" />
        <p className="truncate text-sm font-medium">
          Session: <span className="text-primary">{sessionName}</span>
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 shrink-0 text-xs"
        onClick={onEndSession}
      >
        End session
      </Button>
    </div>
  );
}

export function PerformanceDashboard() {
  const { state, setState, ready } = usePerformanceState();
  const router = useRouter();

  const [logDate, setLogDate] = React.useState<Date>(() => new Date());
  const [logExerciseId, setLogExerciseId] = React.useState("");
  const [logUnit, setLogUnit] = React.useState<WeightUnit>("kg");
  const [logRows, setLogRows] = React.useState<
    { id: string; weight: string; reps: string }[]
  >([
    {
      id: crypto.randomUUID(),
      weight: "",
      reps: "",
    },
  ]);

  // session state
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(
    null,
  );

  // load session from URL param on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session");
    if (sid) {
      setActiveSessionId(sid);
    }
  }, []);

  // stores
  const sessions = useProgrammingStore((s) => s.sessions);
  const templates = useProgrammingStore((s) => s.templates);
  const updateSession = useProgrammingStore((s) => s.updateSession);

  const gymExerciseEquipment = useGymStore((s) => s.exerciseEquipment);
  const myEquipmentIds = useGymStore((s) => s.myEquipmentIds);
  const equipmentCatalog = useGymStore((s) => s.equipmentCatalog);

  const activeSession = React.useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );

  // get template exercises for the active session
  const sessionPrescribedExercises = React.useMemo(() => {
    if (!activeSession?.templateId) return [];
    const template = templates.find((t) => t.id === activeSession.templateId);
    if (!template) return [];
    return template.exercises.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [activeSession, templates]);

  // autofill exercise from session's first exercise if none selected
  React.useEffect(() => {
    if (!logExerciseId && state.exercises.length > 0) {
      if (sessionPrescribedExercises.length > 0) {
        setLogExerciseId(sessionPrescribedExercises[0].exerciseId);
      } else {
        setLogExerciseId(state.exercises[0].id);
      }
    }
  }, [logExerciseId, state.exercises, sessionPrescribedExercises]);

  const exerciseOptions = React.useMemo<ComboboxOption[]>(
    () => state.exercises.map((e) => ({ id: e.id, label: e.name })),
    [state.exercises],
  );

  const setsForSelectedDay = React.useMemo(() => {
    const forDay = state.sets.filter(
      (s) => s.date === format(logDate, "yyyy-MM-dd"),
    );
    return sortSetsForHistory(forDay, state.exercises);
  }, [logDate, state.exercises, state.sets]);

  const calendarDatesWithSets = React.useMemo(() => {
    const keys = new Set(state.sets.map((s) => s.date));
    return [...keys].map((d) => parse(d, "yyyy-MM-dd", new Date()));
  }, [state.sets]);

  // suggestions
  const [suggestions, setSuggestions] = React.useState<ReturnType<
    typeof findAlternatives
  > | null>(null);

  const selectedExercise = React.useMemo(
    () => state.exercises.find((e) => e.id === logExerciseId) ?? null,
    [logExerciseId, state.exercises],
  );

  // check equipment availability when exercise changes
  React.useEffect(() => {
    if (!selectedExercise) {
      setSuggestions(null);
      return;
    }
    const availability = checkExerciseAvailable(
      selectedExercise,
      myEquipmentIds,
      gymExerciseEquipment,
    );
    if (availability.available) {
      setSuggestions(null);
      return;
    }
    const equipmentNames: Record<string, string> = {};
    for (const eq of equipmentCatalog) {
      equipmentNames[eq.id] = eq.name;
    }
    const recentIds = state.sets
      .filter((s) => s.exerciseId !== selectedExercise.id)
      .map((s) => s.exerciseId);
    const alt = findAlternatives(
      selectedExercise,
      myEquipmentIds,
      state.exercises,
      gymExerciseEquipment,
      [...new Set(recentIds)],
      equipmentNames,
    );
    setSuggestions(alt);
  }, [
    selectedExercise,
    myEquipmentIds,
    gymExerciseEquipment,
    equipmentCatalog,
    state.exercises,
    state.sets,
  ]);

  const handleEndSession = React.useCallback(() => {
    if (activeSessionId) {
      updateSession(activeSessionId, (s) => ({
        ...s,
        completedAt: new Date().toISOString(),
      }));
    }
    setActiveSessionId(null);
    router.replace("/app/performance");
  }, [activeSessionId, updateSession, router]);

  const addLogSets = React.useCallback(() => {
    if (!logExerciseId) return;

    const newSets = logRows.flatMap((row) => {
      const reps = Number.parseInt(row.reps, 10);
      const weight = Number.parseFloat(row.weight.replace(",", "."));
      if (!Number.isFinite(reps) || reps <= 0 || !Number.isFinite(weight)) {
        return [];
      }

      const set: WorkoutSet = {
        id: crypto.randomUUID(),
        exerciseId: logExerciseId,
        date: format(logDate, "yyyy-MM-dd"),
        weight,
        reps,
        unit: logUnit,
        sessionId: activeSessionId ?? undefined,
      };
      return [set];
    });

    if (newSets.length === 0) {
      return;
    }

    setState((prev) => ({
      ...prev,
      sets: [...prev.sets, ...newSets],
    }));

    setLogRows([{ id: crypto.randomUUID(), weight: "", reps: "" }]);
  }, [logDate, logExerciseId, logRows, logUnit, setState, activeSessionId]);

  return (
    <div className="flex flex-col gap-6">
      {activeSession && (
        <SessionBanner
          sessionName={activeSession.name}
          onEndSession={handleEndSession}
        />
      )}

      {activeSession && sessionPrescribedExercises.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Today&apos;s program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sessionPrescribedExercises.map((te) => {
                const ex = state.exercises.find((e) => e.id === te.exerciseId);
                const isCurrent = te.exerciseId === logExerciseId;
                const doneSets = state.sets.filter(
                  (s) =>
                    s.exerciseId === te.exerciseId &&
                    s.sessionId === activeSessionId,
                ).length;
                const target = [
                  te.targetSets ? `${doneSets}/${te.targetSets}` : "",
                  te.targetReps ? `${te.targetReps} reps` : "",
                  te.targetWeight ? `${te.targetWeight} kg` : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <button
                    key={te.id}
                    type="button"
                    onClick={() => setLogExerciseId(te.exerciseId)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                      isCurrent
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <span>{ex?.name ?? "Unknown"}</span>
                    {target && <span className="opacity-70">({target})</span>}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {suggestions && suggestions.length > 0 && (
        <Card className="border-yellow-400/40 bg-yellow-50/50 dark:border-yellow-600/40 dark:bg-yellow-950/20">
          <CardContent className="flex flex-col gap-2 py-3">
            <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
              Equipment suggestion
            </p>
            {suggestions.map((alt) => (
              <div
                key={alt.exercise.id}
                className="flex items-center justify-between gap-2"
              >
                <p className="text-xs text-muted-foreground">{alt.reason}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 shrink-0 text-xs"
                  onClick={() => setLogExerciseId(alt.exercise.id)}
                >
                  Try {alt.exercise.name}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card size="sm">
        <CardHeader>
          <CardTitle>Sets for selected day</CardTitle>
          <CardDescription>
            Pick a calendar day to see that day&apos;s lifts, tweak them, or add
            new lines. Data stays only in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!ready ? (
            <p className="text-sm text-muted-foreground">Loading saved data…</p>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                <DatePickerButton
                  date={logDate}
                  onChange={setLogDate}
                  datesWithData={calendarDatesWithSets}
                />
                <p className="pb-2 text-muted-foreground text-sm">
                  <span className="font-medium text-foreground">
                    {setsForSelectedDay.length}
                  </span>{" "}
                  {setsForSelectedDay.length === 1 ? "set" : "sets"} on{" "}
                  <span className="font-medium text-foreground">
                    {format(logDate, "MMM d, yyyy")}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Saved sets</h3>
                {setsForSelectedDay.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No sets for this day — add some below.
                  </p>
                ) : (
                  <div className="max-h-[min(28rem,50vh)] overflow-y-auto rounded-lg border border-border/60 px-2">
                    {setsForSelectedDay.map((row) => (
                      <SetHistoryRow
                        key={row.id}
                        row={row}
                        exerciseOptions={exerciseOptions}
                        onUpdate={(next) => {
                          setState((prev) => ({
                            ...prev,
                            sets: prev.sets.map((s) =>
                              s.id === next.id ? next : s,
                            ),
                          }));
                        }}
                        onDelete={(id) => {
                          setState((prev) => ({
                            ...prev,
                            sets: prev.sets.filter((s) => s.id !== id),
                          }));
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="border-border/60 border-t pt-2">
                <h3 className="mb-3 text-sm font-medium">Add sets</h3>
                <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:max-w-xl">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">
                      Exercise
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ComboPicker
                          ariaLabel="Select exercise"
                          placeholder="Exercise…"
                          options={exerciseOptions}
                          valueId={
                            logExerciseId || state.exercises[0]?.id || "__none"
                          }
                          onSelect={setLogExerciseId}
                        />
                      </div>
                      {selectedExercise && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "inline-flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
                                checkExerciseAvailable(
                                  selectedExercise,
                                  myEquipmentIds,
                                  gymExerciseEquipment,
                                ).available
                                  ? "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/30 dark:text-green-400"
                                  : "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-400",
                              )}
                            >
                              {checkExerciseAvailable(
                                selectedExercise,
                                myEquipmentIds,
                                gymExerciseEquipment,
                              ).available
                                ? "\u2713"
                                : "!"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-xs">
                            {checkExerciseAvailable(
                              selectedExercise,
                              myEquipmentIds,
                              gymExerciseEquipment,
                            ).available
                              ? "All required equipment available"
                              : "Missing some required equipment"}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <ExerciseCreateDialog
                      muscleGroups={state.muscleGroups}
                      onCreated={(exercise) => {
                        setState((prev) => ({
                          ...prev,
                          exercises: [...prev.exercises, exercise],
                        }));
                        setLogExerciseId(exercise.id);
                      }}
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="-ms-2 h-auto justify-start px-2 py-1 text-muted-foreground text-xs"
                        >
                          <CirclePlusIcon
                            className="me-1 size-3.5 shrink-0"
                            aria-hidden
                          />
                          Can&apos;t find it? Add your own exercise
                        </Button>
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">
                      Unit
                    </Label>
                    <Select
                      value={logUnit}
                      onValueChange={(v) => setLogUnit(v as WeightUnit)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start">
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg border border-dashed bg-muted/20 p-3">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <ArrowRightLeftIcon className="size-3.5" aria-hidden />
                      New rows use the day above. Volume in charts uses kg (lbs
                      converted).
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid gap-2 [grid-template-columns:1fr_minmax(0,7rem)_minmax(0,5rem)_auto] sm:gap-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Set
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        Weight
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        Reps
                      </span>
                      <span className="text-xs sr-only font-medium text-muted-foreground">
                        Actions
                      </span>
                    </div>
                    {logRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="grid items-center gap-2 [grid-template-columns:1fr_minmax(0,7rem)_minmax(0,5rem)_auto] sm:gap-3"
                      >
                        <span className="text-muted-foreground text-xs">
                          #{index + 1}
                        </span>
                        <Input
                          inputMode="decimal"
                          className="h-9 bg-background text-sm tabular-nums"
                          placeholder="0"
                          value={row.weight}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLogRows((rows) =>
                              rows.map((r) =>
                                r.id === row.id ? { ...r, weight: v } : r,
                              ),
                            );
                          }}
                        />
                        <Input
                          inputMode="numeric"
                          className="h-9 bg-background text-sm tabular-nums"
                          placeholder="0"
                          value={row.reps}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLogRows((rows) =>
                              rows.map((r) =>
                                r.id === row.id ? { ...r, reps: v } : r,
                              ),
                            );
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="justify-self-end"
                          disabled={logRows.length < 2}
                          onClick={() =>
                            setLogRows((rows) =>
                              rows.filter((r) => r.id !== row.id),
                            )
                          }
                          aria-label="Remove set row"
                        >
                          <XIcon className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setLogRows((rows) => [
                          ...rows,
                          { id: crypto.randomUUID(), weight: "", reps: "" },
                        ])
                      }
                    >
                      <CirclePlusIcon aria-hidden /> Add set row
                    </Button>
                    <Button type="button" size="sm" onClick={addLogSets}>
                      Save entries
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
