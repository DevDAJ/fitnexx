import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Exercise, MuscleGroup } from "@/types/performanceTypes";
import { makeCustomExercise } from "@/utils/performanceUtils";

export function ExerciseCreateDialog({
  muscleGroups,
  onCreated,
  trigger,
}: {
  muscleGroups: MuscleGroup[];
  onCreated: (exercise: Exercise) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const baseId = React.useId().replace(/:/g, "");

  const [name, setName] = React.useState("");
  const [muscleGroupId, setMuscleGroupId] = React.useState(
    () => muscleGroups[0]?.id ?? "",
  );

  React.useEffect(() => {
    if (!open || muscleGroups.length === 0) {
      return;
    }
    setName("");
    const firstId = muscleGroups[0]?.id ?? "";
    setMuscleGroupId((curr: string) =>
      muscleGroups.some((g) => g.id === curr) ? curr : firstId,
    );
  }, [open, muscleGroups]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    const muscleOk =
      muscleGroupId && muscleGroups.some((g) => g.id === muscleGroupId);
    if (!trimmed || !muscleOk) {
      return;
    }

    const exercise = makeCustomExercise(trimmed, muscleGroupId);
    onCreated(exercise);
    setOpen(false);
  };

  if (muscleGroups.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add exercise</DialogTitle>
          <DialogDescription>
            Saved only on this device — pick a muscle group so charts classify
            it correctly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`ex-name-${baseId}`}>Name</Label>
            <Input
              id={`ex-name-${baseId}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Incline dumbbell fly"
              autoComplete="off"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`ex-mg-${baseId}`}>Muscle group</Label>
            <Select value={muscleGroupId} onValueChange={setMuscleGroupId}>
              <SelectTrigger id={`ex-mg-${baseId}`} className="h-9 w-full">
                <SelectValue placeholder="Choose group" />
              </SelectTrigger>
              <SelectContent align="start">
                {muscleGroups.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mx-0 border-0 bg-transparent p-0 py-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save exercise</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
