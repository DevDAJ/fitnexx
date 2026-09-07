import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "./backupSchema";
import type {
  BodyMetrics,
  Gym,
  HabitReminders,
  Meal,
  MealTemplate,
  MetricsReminder,
  Schedule,
  WeightUnit,
  Workout,
  WorkoutTemplate,
} from "./types";

export const storage = {
  async getWorkouts(): Promise<Workout[]> {
    const raw = await AsyncStorage.getItem(KEYS.WORKOUTS);
    return raw ? JSON.parse(raw) : [];
  },

  async saveWorkout(workout: Workout): Promise<void> {
    const workouts = await this.getWorkouts();
    workouts.push(workout);
    workouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
  },

  async deleteWorkout(id: string): Promise<void> {
    const workouts = await this.getWorkouts();
    await AsyncStorage.setItem(
      KEYS.WORKOUTS,
      JSON.stringify(workouts.filter((w) => w.id !== id)),
    );
  },

  async getTemplates(): Promise<WorkoutTemplate[]> {
    const raw = await AsyncStorage.getItem(KEYS.TEMPLATES);
    return raw ? JSON.parse(raw) : [];
  },

  async saveTemplate(template: WorkoutTemplate): Promise<void> {
    const templates = await this.getTemplates();
    const idx = templates.findIndex((t) => t.id === template.id);
    if (idx >= 0) {
      templates[idx] = template;
    } else {
      templates.push(template);
    }
    await AsyncStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
  },

  async deleteTemplate(id: string): Promise<void> {
    const templates = await this.getTemplates();
    await AsyncStorage.setItem(
      KEYS.TEMPLATES,
      JSON.stringify(templates.filter((t) => t.id !== id)),
    );
  },

  async getWeightUnit(): Promise<WeightUnit> {
    const raw = await AsyncStorage.getItem(KEYS.WEIGHT_UNIT);
    return (raw as WeightUnit) || "kg";
  },

  async setWeightUnit(unit: WeightUnit): Promise<void> {
    await AsyncStorage.setItem(KEYS.WEIGHT_UNIT, unit);
  },

  async getSchedule(): Promise<Schedule | null> {
    const raw = await AsyncStorage.getItem(KEYS.SCHEDULE);
    return raw ? JSON.parse(raw) : null;
  },

  async saveSchedule(schedule: Schedule): Promise<void> {
    await AsyncStorage.setItem(KEYS.SCHEDULE, JSON.stringify(schedule));
  },

  async deleteSchedule(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.SCHEDULE);
  },

  async getMeals(): Promise<Meal[]> {
    const raw = await AsyncStorage.getItem(KEYS.MEALS);
    return raw ? JSON.parse(raw) : [];
  },

  async saveMeal(meal: Meal): Promise<void> {
    const meals = await this.getMeals();
    meals.push(meal);
    meals.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    await AsyncStorage.setItem(KEYS.MEALS, JSON.stringify(meals));
  },

  async deleteMeal(id: string): Promise<void> {
    const meals = await this.getMeals();
    await AsyncStorage.setItem(
      KEYS.MEALS,
      JSON.stringify(meals.filter((m) => m.id !== id)),
    );
  },

  async updateMeal(id: string, updates: Partial<Meal>): Promise<void> {
    const meals = await this.getMeals();
    const idx = meals.findIndex((m) => m.id === id);
    if (idx === -1) return;
    meals[idx] = { ...meals[idx], ...updates };
    await AsyncStorage.setItem(KEYS.MEALS, JSON.stringify(meals));
  },

  async getMealTemplates(): Promise<MealTemplate[]> {
    const raw = await AsyncStorage.getItem(KEYS.MEAL_TEMPLATES);
    return raw ? JSON.parse(raw) : [];
  },

  async saveMealTemplate(template: MealTemplate): Promise<void> {
    const templates = await this.getMealTemplates();
    const idx = templates.findIndex((t) => t.id === template.id);
    if (idx >= 0) {
      templates[idx] = template;
    } else {
      templates.push(template);
    }
    await AsyncStorage.setItem(KEYS.MEAL_TEMPLATES, JSON.stringify(templates));
  },

  async deleteMealTemplate(id: string): Promise<void> {
    const templates = await this.getMealTemplates();
    await AsyncStorage.setItem(
      KEYS.MEAL_TEMPLATES,
      JSON.stringify(templates.filter((t) => t.id !== id)),
    );
  },

  async getBodyMetrics(): Promise<BodyMetrics[]> {
    const raw = await AsyncStorage.getItem(KEYS.BODY_METRICS);
    return raw ? JSON.parse(raw) : [];
  },

  async saveBodyMetrics(metrics: BodyMetrics): Promise<void> {
    const all = await this.getBodyMetrics();
    all.push(metrics);
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    await AsyncStorage.setItem(KEYS.BODY_METRICS, JSON.stringify(all));
  },

  async getGyms(): Promise<Gym[]> {
    const raw = await AsyncStorage.getItem(KEYS.GYMS);
    return raw ? JSON.parse(raw) : [];
  },

  async saveGym(gym: Gym): Promise<void> {
    const gyms = await this.getGyms();
    const idx = gyms.findIndex((g) => g.id === gym.id);
    if (idx >= 0) {
      gyms[idx] = gym;
    } else {
      gyms.push(gym);
    }
    await AsyncStorage.setItem(KEYS.GYMS, JSON.stringify(gyms));
  },

  async deleteGym(id: string): Promise<void> {
    const gyms = await this.getGyms();
    await AsyncStorage.setItem(
      KEYS.GYMS,
      JSON.stringify(gyms.filter((g) => g.id !== id)),
    );
  },

  async getMetricsReminder(): Promise<MetricsReminder | null> {
    const raw = await AsyncStorage.getItem(KEYS.METRICS_REMINDER);
    return raw ? JSON.parse(raw) : null;
  },

  async setMetricsReminder(reminder: MetricsReminder): Promise<void> {
    await AsyncStorage.setItem(KEYS.METRICS_REMINDER, JSON.stringify(reminder));
  },

  async getDailyCalorieGoal(): Promise<number | null> {
    const raw = await AsyncStorage.getItem(KEYS.DAILY_CALORIE_GOAL);
    return raw != null ? JSON.parse(raw) : null;
  },

  async setDailyCalorieGoal(goal: number | null): Promise<void> {
    if (goal == null) {
      await AsyncStorage.removeItem(KEYS.DAILY_CALORIE_GOAL);
    } else {
      await AsyncStorage.setItem(KEYS.DAILY_CALORIE_GOAL, JSON.stringify(goal));
    }
  },

  async getWaterLog(): Promise<Record<string, number>> {
    const raw = await AsyncStorage.getItem(KEYS.WATER);
    return raw ? JSON.parse(raw) : {};
  },

  async saveWaterLog(log: Record<string, number>): Promise<void> {
    await AsyncStorage.setItem(KEYS.WATER, JSON.stringify(log));
  },

  async getHabitReminders(): Promise<HabitReminders | null> {
    const raw = await AsyncStorage.getItem(KEYS.REMINDERS);
    return raw ? (JSON.parse(raw) as HabitReminders) : null;
  },

  async saveHabitReminders(reminders: HabitReminders): Promise<void> {
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  },

  async getPro(): Promise<boolean> {
    const raw = await AsyncStorage.getItem(KEYS.PRO);
    return raw === "true";
  },

  async setPro(pro: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.PRO, String(pro));
  },
};
