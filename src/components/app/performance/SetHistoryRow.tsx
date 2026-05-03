import { format, parseISO } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Exercise,
  MuscleGroup,
  WeightUnit,
  WorkoutSet,
} from "@/types/performanceTypes";
import { type ComboboxOption, ComboPicker } from "../ComboPicker";

export function SetHistoryRow({
  row,
  exerciseOptions,
  onUpdate,
  onDelete,
}: {
  row: WorkoutSet;
  exerciseOptions: ComboboxOption[];
  muscleGroups: MuscleGroup[];
  onUpdate: (next: WorkoutSet) => void;
  onDelete: (id: string) => void;
  onAddExercise: (exercise: Exercise) => void;
}) {
  const [exerciseId, setExerciseId] = useState(row.exerciseId);
  const [unit, setUnit] = useState<WeightUnit>(row.unit);
  const [weightStr, setWeightStr] = useState(String(row.weight));
  const [repsStr, setRepsStr] = useState(String(row.reps));

  useEffect(() => {
    setExerciseId(row.exerciseId);
    setUnit(row.unit);
    setWeightStr(String(row.weight));
    setRepsStr(String(row.reps));
  }, [row.exerciseId, row.weight, row.reps, row.unit]);

  const lockedDate = format(parseISO(row.date), "yyyy-MM-dd");

  const dirty =
    format(parseISO(row.date), "yyyy-MM-dd") !== row.date ||
    exerciseId !== row.exerciseId ||
    unit !== row.unit ||
    weightStr.trim() !== String(row.weight) ||
    repsStr.trim() !== String(row.reps);

  const handleSave = () => {
    const reps = Number.parseInt(repsStr, 10);
    const weight = Number.parseFloat(weightStr.replace(",", "."));
    if (
      !Number.isFinite(reps) ||
      reps <= 0 ||
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      return;
    }
    onUpdate({
      id: row.id,
      date: lockedDate,
      exerciseId,
      weight,
      reps,
      unit,
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-2 border-b border-border/50 py-3 last:border-b-0">
      <div className="flex min-w-[min(100%,12rem)] flex-1 flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Exercise</Label>
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-0 flex-1">
            <ComboPicker
              ariaLabel="Exercise for this set"
              placeholder="Exercise…"
              options={exerciseOptions}
              valueId={exerciseId || exerciseOptions[0]?.id || "__none"}
              onSelect={setExerciseId}
              className="w-full md:max-w-none"
            />
          </div>
        </div>
      </div>
      <div className="flex w-[5.5rem] flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Unit</Label>
        <Select value={unit} onValueChange={(v) => setUnit(v as WeightUnit)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="lbs">lbs</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-[4.5rem] flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Weight</Label>
        <Input
          inputMode="decimal"
          className="h-9 bg-background text-sm tabular-nums"
          value={weightStr}
          onChange={(e) => setWeightStr(e.target.value)}
        />
      </div>
      <div className="flex w-[4rem] flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Reps</Label>
        <Input
          inputMode="numeric"
          className="h-9 bg-background text-sm tabular-nums"
          value={repsStr}
          onChange={(e) => setRepsStr(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2 pt-5">
        <Button
          type="button"
          disabled={!dirty}
          onClick={handleSave}
          className="h-9"
        >
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 px-2"
          onClick={() => onDelete(row.id)}
          aria-label="Delete set"
        >
          <Trash2Icon className="size-4 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
