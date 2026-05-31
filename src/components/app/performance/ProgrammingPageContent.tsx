"use client";

import { format } from "date-fns";
import {
  CirclePlusIcon,
  PencilIcon,
  PlayIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { ComboPicker, type ComboboxOption } from "@/components/app/ComboPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { usePerformanceStore } from "@/stores/performanceStore";
import { useProgrammingStore } from "@/stores/programmingStore";
import type { TemplateExercise, WorkoutTemplate } from "@/types/programmingTypes";
import { formatSessionDuration } from "@/utils/programmingUtils";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function TemplateCard({
  template,
  exercises,
  onEdit,
  onDelete,
  onStartSession,
}: {
  template: WorkoutTemplate;
  exercises: ComboboxOption[];
  onEdit: (t: WorkoutTemplate) => void;
  onDelete: (id: string) => void;
  onStartSession: (t: WorkoutTemplate) => void;
}) {
  const dayLabel =
    template.dayOfWeek !== undefined ? DAY_NAMES[template.dayOfWeek] : "Any day";
  const exCount = template.exercises.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base">{template.name}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {dayLabel} &middot; {exCount} {exCount === 1 ? "exercise" : "exercises"}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => onStartSession(template)}
            >
              <PlayIcon className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Start</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(template)}
              aria-label="Edit template"
              className="size-8"
            >
              <PencilIcon className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(template.id)}
              aria-label="Delete template"
              className="size-8"
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {template.exercises.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {template.exercises
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((te) => {
                const ex = exercises.find((e) => e.id === te.exerciseId);
                const label = ex?.label ?? "Unknown";
                const target = [
                  te.targetSets ? `${te.targetSets}x` : "",
                  te.targetReps ? `${te.targetReps} reps` : "",
                  te.targetWeight ? `${te.targetWeight} kg` : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <span
                    key={te.id}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {label}
                    {target && (
                      <span className="text-muted-foreground">({target})</span>
                    )}
                  </span>
                );
              })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No exercises yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function TemplateEditorDialog({
  template,
  exercises,
  onSave,
  onClose,
}: {
  template?: WorkoutTemplate;
  exercises: ComboboxOption[];
  onSave: (t: WorkoutTemplate) => void;
  onClose: () => void;
}) {
  const [name, setName] = React.useState(template?.name ?? "");
  const [dayOfWeek, setDayOfWeek] = React.useState<string>(
    template?.dayOfWeek?.toString() ?? "",
  );
  const [templateExercises, setTemplateExercises] = React.useState<
    (TemplateExercise & { label?: string })[]
  >(template?.exercises.map((te) => {
    const ex = exercises.find((e) => e.id === te.exerciseId);
    return { ...te, label: ex?.label };
  }) ?? []);

  const addExercise = React.useCallback(() => {
    const firstId = exercises[0]?.id;
    if (!firstId) return;
    const te: TemplateExercise & { label?: string } = {
      id: `te-${crypto.randomUUID()}`,
      exerciseId: firstId,
      sortOrder: templateExercises.length,
      label: exercises[0]?.label,
    };
    setTemplateExercises((prev) => [...prev, te]);
  }, [exercises, templateExercises.length]);

  const removeExercise = React.useCallback((id: string) => {
    setTemplateExercises((prev) =>
      prev.filter((te) => te.id !== id).map((te, i) => ({ ...te, sortOrder: i })),
    );
  }, []);

  const updateExercise = React.useCallback(
    (id: string, updater: Partial<TemplateExercise>) => {
      setTemplateExercises((prev) =>
        prev.map((te) =>
          te.id === id
            ? {
                ...te,
                ...updater,
                label: updater.exerciseId
                  ? exercises.find((e) => e.id === updater.exerciseId)?.label
                  : te.label,
              }
            : te,
        ),
      );
    },
    [exercises],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: template?.id ?? `template-${crypto.randomUUID()}`,
      name: name.trim(),
      dayOfWeek: dayOfWeek ? Number(dayOfWeek) : undefined,
      exercises: templateExercises.map((te) => ({
        id: te.id,
        exerciseId: te.exerciseId,
        sortOrder: te.sortOrder,
        targetSets: te.targetSets,
        targetReps: te.targetReps,
        targetWeight: te.targetWeight,
        notes: te.notes,
      })),
      createdAt: template?.createdAt ?? new Date().toISOString(),
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{template ? "Edit" : "Create"} Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Push Day, Upper Body"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Day of week (optional)</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any day" />
              </SelectTrigger>
              <SelectContent align="start">
                {DAY_NAMES.map((d, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Exercises</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercise}
                disabled={exercises.length === 0}
              >
                <CirclePlusIcon className="size-3.5" aria-hidden /> Add
              </Button>
            </div>
            {templateExercises.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No exercises added yet.
              </p>
            )}
            <div className="flex flex-col gap-2">
              {templateExercises.map((te) => (
                <div
                  key={te.id}
                  className="flex flex-wrap items-center gap-2 rounded-md border border-border/60 p-2"
                >
                  <div className="flex-1 min-w-0">
                    <ComboPicker
                      ariaLabel="Select exercise"
                      placeholder="Exercise..."
                      options={exercises}
                      valueId={te.exerciseId}
                      onSelect={(id) => updateExercise(te.id, { exerciseId: id })}
                      className="md:max-w-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Input
                      className="h-8 w-16 text-xs"
                      placeholder="Sets"
                      value={te.targetSets ?? ""}
                      onChange={(e) =>
                        updateExercise(te.id, {
                          targetSets: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                    <Input
                      className="h-8 w-16 text-xs"
                      placeholder="Reps"
                      value={te.targetReps ?? ""}
                      onChange={(e) =>
                        updateExercise(te.id, {
                          targetReps: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                    <Input
                      className="h-8 w-20 text-xs"
                      placeholder="Weight"
                      value={te.targetWeight ?? ""}
                      onChange={(e) =>
                        updateExercise(te.id, {
                          targetWeight: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeExercise(te.id)}
                      aria-label="Remove exercise"
                      className="size-8 shrink-0"
                    >
                      <XIcon className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProgrammingPageContent() {
  const [editorTemplate, setEditorTemplate] = React.useState<
    WorkoutTemplate | undefined
  >(undefined);
  const [showEditor, setShowEditor] = React.useState(false);

  const exercises = usePerformanceStore((s) => s.exercises);
  const {
    templates,
    sessions,
    addTemplate,
    updateTemplate,
    removeTemplate,
    addSession,
  } = useProgrammingStore(
    useShallow((s) => ({
      templates: s.templates,
      sessions: s.sessions,
      addTemplate: s.addTemplate,
      updateTemplate: s.updateTemplate,
      removeTemplate: s.removeTemplate,
      addSession: s.addSession,
    })),
  );

  const exerciseOptions = React.useMemo<ComboboxOption[]>(
    () => exercises.map((e) => ({ id: e.id, label: e.name })),
    [exercises],
  );

  const handleSaveTemplate = React.useCallback(
    (t: WorkoutTemplate) => {
      if (templates.some((existing) => existing.id === t.id)) {
        updateTemplate(t.id, () => t);
      } else {
        addTemplate(t);
      }
      setShowEditor(false);
      setEditorTemplate(undefined);
    },
    [templates, updateTemplate, addTemplate],
  );

  const handleStartSession = React.useCallback(
    (template: WorkoutTemplate) => {
      const session = {
        id: `session-${crypto.randomUUID()}`,
        templateId: template.id,
        name: template.name,
        date: format(new Date(), "yyyy-MM-dd"),
        startedAt: new Date().toISOString(),
      };
      addSession(session);
    },
    [addSession],
  );

  const handleDeleteTemplate = React.useCallback(
    (id: string) => {
      removeTemplate(id);
    },
    [removeTemplate],
  );

  const recentSessions = React.useMemo(
    () =>
      [...sessions]
        .sort(
          (a, b) =>
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
        )
        .slice(0, 10),
    [sessions],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Templates section */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Templates</h2>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditorTemplate(undefined);
            setShowEditor(true);
          }}
        >
          <CirclePlusIcon className="size-3.5" aria-hidden /> New template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No templates yet. Create your first workout template to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              exercises={exerciseOptions}
              onEdit={(template) => {
                setEditorTemplate(template);
                setShowEditor(true);
              }}
              onDelete={handleDeleteTemplate}
              onStartSession={handleStartSession}
            />
          ))}
        </div>
      )}

      {/* Recent sessions section */}
      <h2 className="text-sm font-semibold text-foreground">Recent Sessions</h2>
      {recentSessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No sessions yet. Start a session from a template above.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {recentSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(s.startedAt), "MMM d, yyyy")}
                      {s.completedAt && (
                        <>
                          {" "}
                          &middot;{" "}
                          {formatSessionDuration(s.startedAt, s.completedAt)}
                        </>
                      )}
                      {!s.completedAt && (
                        <>
                          {" "}
                          &middot;{" "}
                          <span className="text-yellow-600 dark:text-yellow-400">
                            In progress
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  {!s.completedAt && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        // switch to Log tab with this session active
                        window.location.href = `/app/performance?session=${s.id}`;
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template editor dialog */}
      {showEditor && (
        <TemplateEditorDialog
          template={editorTemplate}
          exercises={exerciseOptions}
          onSave={handleSaveTemplate}
          onClose={() => {
            setShowEditor(false);
            setEditorTemplate(undefined);
          }}
        />
      )}
    </div>
  );
}
