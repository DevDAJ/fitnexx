import { create } from "zustand";
import { getDetectedGymId, startGymGeofencing } from "./geofencing";
import { detectCurrentGym } from "./location";
import { MOCK_SCHEDULE, MOCK_TEMPLATES, MOCK_WORKOUTS } from "./mockData";
import {
  cancelMetricsReminder,
  rescheduleMetricsReminderIfGranted,
  scheduleMetricsReminder,
} from "./notifications";
import { storage } from "./storage";
import type {
  BodyMetrics,
  Gym,
  Meal,
  MealTemplate,
  MetricsReminder,
  MuscleWeeklyData,
  Schedule,
  WeightUnit,
  Workout,
  WorkoutTemplate,
} from "./types";

interface AppState {
  workouts: Workout[];
  templates: WorkoutTemplate[];
  weightUnit: WeightUnit;
  weeklySetsData: MuscleWeeklyData[];
  schedule: Schedule | null;
  meals: Meal[];
  mealTemplates: MealTemplate[];
  bodyMetrics: BodyMetrics[];
  gyms: Gym[];
  currentGym: Gym | null;
  metricsReminder: MetricsReminder | null;
  dailyCalorieGoal: number | null;
  loaded: boolean;

  loadAll: () => Promise<void>;
  addWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  setWeightUnit: (unit: WeightUnit) => Promise<void>;
  addTemplate: (template: WorkoutTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  setWeeklySetsData: (data: MuscleWeeklyData[]) => void;
  setSchedule: (schedule: Schedule) => Promise<void>;
  deleteSchedule: () => Promise<void>;
  addMeal: (meal: Meal) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  updateMeal: (id: string, updates: Partial<Meal>) => Promise<void>;
  addMealTemplate: (template: MealTemplate) => Promise<void>;
  deleteMealTemplate: (id: string) => Promise<void>;
  addBodyMetrics: (metrics: BodyMetrics) => Promise<void>;
  setMetricsReminder: (reminder: MetricsReminder) => Promise<void>;
  setDailyCalorieGoal: (goal: number | null) => Promise<void>;
  addGym: (gym: Gym) => Promise<void>;
  deleteGym: (id: string) => Promise<void>;
  refreshCurrentGym: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  workouts: [],
  templates: [],
  weightUnit: "kg",
  weeklySetsData: [],
  schedule: null,
  meals: [],
  mealTemplates: [],
  bodyMetrics: [],
  gyms: [],
  currentGym: null,
  metricsReminder: null,
  dailyCalorieGoal: null,
  loaded: false,

  loadAll: async () => {
    let [
      workouts,
      templates,
      weightUnit,
      schedule,
      meals,
      mealTemplates,
      bodyMetrics,
      gyms,
      metricsReminder,
      dailyCalorieGoal,
    ] = await Promise.all([
      storage.getWorkouts(),
      storage.getTemplates(),
      storage.getWeightUnit(),
      storage.getSchedule(),
      storage.getMeals(),
      storage.getMealTemplates(),
      storage.getBodyMetrics(),
      storage.getGyms(),
      storage.getMetricsReminder(),
      storage.getDailyCalorieGoal(),
    ]);

    if (workouts.length === 0) {
      workouts = MOCK_WORKOUTS;
      templates = MOCK_TEMPLATES;
      schedule = MOCK_SCHEDULE;
      await Promise.all([
        ...workouts.map((w) => storage.saveWorkout(w)),
        ...templates.map((t) => storage.saveTemplate(t)),
        storage.saveSchedule(MOCK_SCHEDULE),
      ]);
    }

    const detectedId = await getDetectedGymId();
    set({
      workouts,
      templates,
      weightUnit,
      schedule,
      meals,
      mealTemplates,
      bodyMetrics,
      gyms,
      currentGym: detectedId
        ? (gyms.find((g) => g.id === detectedId) ?? null)
        : null,
      metricsReminder,
      dailyCalorieGoal,
      loaded: true,
    });
    startGymGeofencing(gyms);
    if (metricsReminder?.enabled) {
      void rescheduleMetricsReminderIfGranted(metricsReminder);
    }
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

  setSchedule: async (schedule) => {
    await storage.saveSchedule(schedule);
    set({ schedule });
  },

  deleteSchedule: async () => {
    await storage.deleteSchedule();
    set({ schedule: null });
  },

  addMeal: async (meal) => {
    await storage.saveMeal(meal);
    const meals = await storage.getMeals();
    set({ meals });
  },

  deleteMeal: async (id) => {
    await storage.deleteMeal(id);
    const meals = await storage.getMeals();
    set({ meals });
  },

  updateMeal: async (id, updates) => {
    await storage.updateMeal(id, updates);
    const meals = await storage.getMeals();
    set({ meals });
  },

  addMealTemplate: async (template) => {
    await storage.saveMealTemplate(template);
    const mealTemplates = await storage.getMealTemplates();
    set({ mealTemplates });
  },

  deleteMealTemplate: async (id) => {
    await storage.deleteMealTemplate(id);
    const mealTemplates = await storage.getMealTemplates();
    set({ mealTemplates });
  },

  addBodyMetrics: async (metrics) => {
    await storage.saveBodyMetrics(metrics);
    const bodyMetrics = await storage.getBodyMetrics();
    set({ bodyMetrics });
  },

  setMetricsReminder: async (reminder) => {
    if (reminder.enabled) await scheduleMetricsReminder(reminder);
    else await cancelMetricsReminder();
    await storage.setMetricsReminder(reminder);
    set({ metricsReminder: reminder });
  },

  setDailyCalorieGoal: async (goal) => {
    await storage.setDailyCalorieGoal(goal);
    set({ dailyCalorieGoal: goal });
  },

  addGym: async (gym) => {
    await storage.saveGym(gym);
    const gyms = await storage.getGyms();
    set({
      gyms,
      currentGym: get().currentGym?.id === gym.id ? gym : get().currentGym,
    });
    startGymGeofencing(gyms);
    get().refreshCurrentGym();
  },

  deleteGym: async (id) => {
    await storage.deleteGym(id);
    const gyms = await storage.getGyms();
    set({
      gyms,
      currentGym: get().currentGym?.id === id ? null : get().currentGym,
    });
    startGymGeofencing(gyms);
  },

  refreshCurrentGym: async () => {
    const currentGym = await detectCurrentGym(get().gyms);
    set({ currentGym });
  },
}));
