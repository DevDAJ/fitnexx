import { create } from "zustand";
import type { Workout, WorkoutTemplate, WeightUnit, MuscleWeeklyData } from "./types";
import { storage } from "./storage";

interface AppState {
  workouts: Workout[];
  templates: WorkoutTemplate[];
  weightUnit: WeightUnit;
  weeklySetsData: MuscleWeeklyData[];
  loaded: boolean;

  loadAll: () => Promise<void>;
  addWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  setWeightUnit: (unit: WeightUnit) => Promise<void>;
  addTemplate: (template: WorkoutTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  setWeeklySetsData: (data: MuscleWeeklyData[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  workouts: [],
  templates: [],
  weightUnit: "kg",
  weeklySetsData: [],
  loaded: false,

  loadAll: async () => {
    const [workouts, templates, weightUnit] = await Promise.all([
      storage.getWorkouts(),
      storage.getTemplates(),
      storage.getWeightUnit(),
    ]);
    set({ workouts, templates, weightUnit, loaded: true });
  },

  addWorkout: async (workout) => {
    await storage.saveWorkout(workout);
    const workouts = await storage.getWorkouts();
    set({ workouts });
  },

  deleteWorkout: async (id) => {
    await storage.deleteWorkout(id);
    const workouts = await storage.getWorkouts();
    set({ workouts });
  },

  setWeightUnit: async (unit) => {
    await storage.setWeightUnit(unit);
    set({ weightUnit: unit });
  },

  addTemplate: async (template) => {
    await storage.saveTemplate(template);
    const templates = await storage.getTemplates();
    set({ templates });
  },

  deleteTemplate: async (id) => {
    await storage.deleteTemplate(id);
    const templates = await storage.getTemplates();
    set({ templates });
  },

  setWeeklySetsData: (data) => set({ weeklySetsData: data }),
}));
