import { useMemo } from "react";
import type { ComboboxOption } from "@/components/app/ComboPicker";
import { ComboPicker } from "@/components/app/ComboPicker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePerformanceState } from "@/hooks/usePerfomanceState";
import type { MetricMode } from "@/types/performanceTypes";

const ALL_MUSCLES = "__all__" as const;

export function MeasurementSelector({
  metric,
  setMetric,
  muscleFilter,
  setMuscleFilter,
}: {
  metric: MetricMode;
  setMetric: (metric: MetricMode) => void;
  muscleFilter: string | typeof ALL_MUSCLES;
  setMuscleFilter: (muscleFilter: string | typeof ALL_MUSCLES) => void;
}) {
  const { state } = usePerformanceState();
  const muscleOptions = useMemo<ComboboxOption[]>(
    () => [
      { id: ALL_MUSCLES, label: "All muscle groups" },
      ...state.muscleGroups.map((g) => ({ id: g.id, label: g.name })),
    ],
    [state.muscleGroups],
  );
  return (
    <section className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Metric</Label>
        <Select
          value={metric}
          onValueChange={(v) => setMetric(v as MetricMode)}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Metric" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="reps">Reps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">
          Muscle group (volume-over-time + exercise list)
        </Label>
        <ComboPicker
          ariaLabel="Filter exercises by muscle group"
          placeholder="Muscle…"
          options={muscleOptions}
          valueId={muscleFilter}
          onSelect={(id) => setMuscleFilter(id as typeof ALL_MUSCLES | string)}
        />
      </div>
    </section>
  );
}
