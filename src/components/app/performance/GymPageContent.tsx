"use client";

import { Link2Icon, PlusIcon, SearchIcon } from "lucide-react";
import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import type { Equipment, EquipmentCategory } from "@/constants/gymConstants";
import { useGymStore } from "@/stores/gymStore";
import { usePerformanceStore } from "@/stores/performanceStore";
import cn from "@/utils/cn";

const categoryLabels: Record<EquipmentCategory, string> = {
  strength: "Strength",
  cardio: "Cardio",
  bodyweight: "Bodyweight",
  flexibility: "Flexibility & Recovery",
  other: "Other",
};

const categoryOrder: EquipmentCategory[] = [
  "strength",
  "cardio",
  "bodyweight",
  "flexibility",
  "other",
];

function EquipmentCard({
  name,
  category,
  owned,
  onToggle,
  onShowMappings,
}: {
  name: string;
  category: EquipmentCategory;
  owned: boolean;
  onToggle: () => void;
  onShowMappings: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors",
        owned
          ? "border-primary/40 bg-primary/5"
          : "border-border/60 bg-background",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            {categoryLabels[category]}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onShowMappings}
          aria-label={`Link exercises to ${name}`}
          className="size-7"
        >
          <Link2Icon className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant={owned ? "default" : "outline"}
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={onToggle}
        >
          {owned ? "Owned" : "Add"}
        </Button>
      </div>
    </div>
  );
}

function EquipmentMappingDialog({
  equipmentId,
  equipmentName,
  onClose,
}: {
  equipmentId: string;
  equipmentName: string;
  onClose: () => void;
}) {
  const exercises = usePerformanceStore((s) => s.exercises);
  const setPerformanceState = usePerformanceStore((s) => s.setPerformanceState);
  const exerciseEquipment = useGymStore((s) => s.exerciseEquipment);
  const setExerciseEquipment = useGymStore((s) => s.setExerciseEquipment);

  const toggleExercise = React.useCallback(
    (exerciseId: string) => {
      const current = exerciseEquipment[exerciseId] ?? [];
      const has = current.includes(equipmentId);
      const nextEquipmentIds = has
        ? current.filter((id) => id !== equipmentId)
        : [...current, equipmentId];

      // update gym store (used by suggestion engine)
      setExerciseEquipment(exerciseId, nextEquipmentIds);

      // sync Exercise.requiredEquipmentIds in performance store
      setPerformanceState((prev) => ({
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId
            ? { ...ex, requiredEquipmentIds: nextEquipmentIds }
            : ex,
        ),
      }));
    },
    [exerciseEquipment, equipmentId, setExerciseEquipment, setPerformanceState],
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{equipmentName}</DialogTitle>
          <DialogDescription>
            Check the exercises that require this equipment.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          {exercises.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Create exercises first on the Log tab.
            </p>
          )}
          {exercises.map((ex) => {
            const used = (exerciseEquipment[ex.id] ?? []).includes(
              equipmentId,
            );
            return (
              <label
                key={ex.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors",
                  used ? "border-primary/40 bg-primary/5" : "border-border/60",
                )}
              >
                <input
                  type="checkbox"
                  checked={used}
                  onChange={() => toggleExercise(ex.id)}
                  className="size-4 accent-primary"
                />
                <span>{ex.name}</span>
              </label>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddEquipmentDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<EquipmentCategory>("strength");
  const addCustomEquipment = useGymStore((s) => s.addCustomEquipment);
  const addMyEquipment = useGymStore((s) => s.addMyEquipment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `eq-custom-${crypto.randomUUID()}`;
    addCustomEquipment({ id, name: trimmed, category });
    addMyEquipment(id);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add equipment</DialogTitle>
          <DialogDescription>
            Add a piece of equipment not in the catalog.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hip Thrust Machine"
              className="h-9"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as EquipmentCategory)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                {categoryOrder.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GymPageContent() {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<
    EquipmentCategory | "all"
  >("all");
  const [mappingEquipmentId, setMappingEquipmentId] = React.useState<
    string | null
  >(null);
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  const {
    equipmentCatalog,
    myEquipmentIds,
    addMyEquipment,
    removeMyEquipment,
  } = useGymStore(
    useShallow((s) => ({
      equipmentCatalog: s.equipmentCatalog,
      myEquipmentIds: s.myEquipmentIds,
      addMyEquipment: s.addMyEquipment,
      removeMyEquipment: s.removeMyEquipment,
    })),
  );

  const toggleEquipment = React.useCallback(
    (id: string) => {
      if (myEquipmentIds.includes(id)) {
        removeMyEquipment(id);
      } else {
        addMyEquipment(id);
      }
    },
    [myEquipmentIds, addMyEquipment, removeMyEquipment],
  );

  const filtered = React.useMemo(() => {
    let list = equipmentCatalog;
    if (categoryFilter !== "all") {
      list = list.filter((eq) => eq.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((eq) => eq.name.toLowerCase().includes(q));
    }
    return list;
  }, [equipmentCatalog, categoryFilter, search]);

  const mappingEquipment = React.useMemo(() => {
    if (!mappingEquipmentId) return null;
    return equipmentCatalog.find((eq) => eq.id === mappingEquipmentId) ?? null;
  }, [mappingEquipmentId, equipmentCatalog]);

  const ownedCount = myEquipmentIds.length;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">My Gym</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You have{" "}
            <span className="font-medium text-foreground">{ownedCount}</span>{" "}
            {ownedCount === 1 ? "piece" : "pieces"} of equipment in your home
            gym. Add or mark equipment as owned to get exercise suggestions
            tailored to what you have.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              categoryFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {categoryOrder.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {categoryLabels[cat]}
            </button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs ms-2"
            onClick={() => setShowAddDialog(true)}
          >
            <PlusIcon className="size-3.5 me-1" aria-hidden />
            Add custom
          </Button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((eq) => (
          <EquipmentCard
            key={eq.id}
            name={eq.name}
            category={eq.category}
            owned={myEquipmentIds.includes(eq.id)}
            onToggle={() => toggleEquipment(eq.id)}
            onShowMappings={() => setMappingEquipmentId(eq.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No equipment matches your search.
          </p>
        )}
      </div>

      {mappingEquipment && (
        <EquipmentMappingDialog
          equipmentId={mappingEquipment.id}
          equipmentName={mappingEquipment.name}
          onClose={() => setMappingEquipmentId(null)}
        />
      )}

      {showAddDialog && (
        <AddEquipmentDialog onClose={() => setShowAddDialog(false)} />
      )}
    </div>
  );
}
