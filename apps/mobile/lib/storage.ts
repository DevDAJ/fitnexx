import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Workout, WorkoutTemplate, WeightUnit } from "./types";

const KEYS = {
  WORKOUTS: "fitnexx_workouts",
  TEMPLATES: "fitnexx_templates",
  WEIGHT_UNIT: "fitnexx_weight_unit",
};

export const storage = {
  async getWorkouts(): Promise<Workout[]> {
    const raw = await AsyncStorage.getItem(KEYS.WORKOUTS);
    return raw ? JSON.parse(raw) : [];
  },

  async saveWorkout(workout: Workout): Promise<void> {
    const workouts = await this.getWorkouts();
    workouts.push(workout);
    workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
  },

  async deleteWorkout(id: string): Promise<void> {
    const workouts = await this.getWorkouts();
    await AsyncStorage.setItem(
      KEYS.WORKOUTS,
      JSON.stringify(workouts.filter((w) => w.id !== id))
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
      JSON.stringify(templates.filter((t) => t.id !== id))
    );
  },

  async getWeightUnit(): Promise<WeightUnit> {
    const raw = await AsyncStorage.getItem(KEYS.WEIGHT_UNIT);
    return (raw as WeightUnit) || "kg";
  },

  async setWeightUnit(unit: WeightUnit): Promise<void> {
    await AsyncStorage.setItem(KEYS.WEIGHT_UNIT, unit);
  },
};
