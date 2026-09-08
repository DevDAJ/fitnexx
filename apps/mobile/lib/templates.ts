import { storage } from "./storage";
import { useAppStore } from "./store";
import type { Workout, WorkoutTemplate } from "./types";

export async function saveWorkoutAsTemplate(
  workout: Workout,
  name: string,
): Promise<WorkoutTemplate> {
  const template: WorkoutTemplate = {
    id: `tpl_${Date.now()}`,
    name,
    exercises: workout.exercises.map((e) => ({
      exerciseName: e.exerciseName,
      targetSets:
        e.sets.filter((s) => s.setType !== "warmup").length || e.sets.length,
      targetReps: Math.round(
        e.sets.reduce((a, s) => a + s.reps, 0) / Math.max(e.sets.length, 1),
      ),
    })),
  };
  await useAppStore.getState().addTemplate(template);
  return template;
}

export async function getTemplates(): Promise<WorkoutTemplate[]> {
  return storage.getTemplates();
}

export async function deleteTemplate(id: string): Promise<void> {
  return useAppStore.getState().deleteTemplate(id);
}
