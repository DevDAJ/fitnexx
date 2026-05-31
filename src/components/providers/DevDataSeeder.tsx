"use client";

import { useEffect, useRef } from "react";
import { useMetricsStore } from "@/stores/metricsStore";
import { usePerformanceStore } from "@/stores/performanceStore";
import { useMacrosCaptureStore } from "@/stores/macrosCaptureStore";
import { useProgrammingStore } from "@/stores/programmingStore";
import { useGymStore } from "@/stores/gymStore";

const TODAY = new Date();
function ymd(d: Date) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function daysAgo(n: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d;
}
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min: number, max: number, decimals = 1) {
  return Number.parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function generateMockSets() {
  const sets: {
    id: string;
    exerciseId: string;
    date: string;
    weight: number;
    reps: number;
    unit: "kg";
    sessionId?: string;
  }[] = [];

  const pushExercises = ["ex-bench-press", "ex-overhead-press", "ex-cable-fly"];
  const pullExercises = ["ex-barbell-row", "ex-pull-up", "ex-bicep-curl"];
  const legsExercises = ["ex-back-squat", "ex-romanian-deadlift"];

  const rotations = [
    { exercises: pushExercises, name: "Push" },
    { exercises: pullExercises, name: "Pull" },
    { exercises: legsExercises, name: "Legs" },
    { exercises: pushExercises, name: "Push" },
  ];

  const baseWeights: Record<string, number> = {
    "ex-bench-press": 60, "ex-overhead-press": 35, "ex-cable-fly": 18,
    "ex-barbell-row": 55, "ex-pull-up": 12, "ex-bicep-curl": 12,
    "ex-back-squat": 80, "ex-romanian-deadlift": 50,
  };

  let week = 0;
  for (let dayOffset = 28; dayOffset >= 0; dayOffset--) {
    const date = daysAgo(dayOffset);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 1 && dayOfWeek !== 3 && dayOfWeek !== 5) continue;

    const rotation = rotations[week % rotations.length];
    const dateStr = ymd(date);
    const sessionId = "mock-session-" + dateStr;
    const weekProgression = Math.floor(dayOffset / 7) * 2.5;

    for (const exId of rotation.exercises) {
      const base = baseWeights[exId] ?? 40;
      const weight = Number.parseFloat((base + weekProgression + randomFloat(-2, 2)).toFixed(1));
      const setCount = exId === "ex-pull-up" ? 3 : 4;
      for (let s = 0; s < setCount; s++) {
        const reps = exId === "ex-back-squat"
          ? randomInt(5, 8)
          : randomInt(8, 12);
        sets.push({
          id: "mock-set-" + dateStr + "-" + exId + "-" + String(s),
          exerciseId: exId,
          date: dateStr,
          weight: weight + randomFloat(-1, 1),
          reps,
          unit: "kg",
          sessionId,
        });
      }
    }
    week++;
  }

  return sets;
}

function generateMockMetrics() {
  const entries: { id: string; date: string; weightKg: number; bodyFatPercent: number }[] = [];
  for (let dayOffset = 28; dayOffset >= 0; dayOffset -= randomInt(2, 4)) {
    const date = daysAgo(dayOffset);
    const progress = dayOffset / 28;
    const weightKg = Number.parseFloat((80 - progress * 2 + randomFloat(-0.3, 0.3)).toFixed(1));
    const bodyFatPercent = Number.parseFloat((20 - progress * 2 + randomFloat(-0.5, 0.5)).toFixed(1));
    entries.push({
      id: "mock-metric-" + ymd(date),
      date: ymd(date),
      weightKg,
      bodyFatPercent: Math.max(15, bodyFatPercent),
    });
  }
  return entries;
}

function generateMockMacros() {
  const rows: {
    id: string; date: string; imageUrl: string; fileName: string;
    foodName: string; timeEaten: string;
    mealClass: "breakfast" | "lunch" | "dinner" | "snack" | "other";
    protein: string; fibre: string; carbohydrates: string; fat: string; calories: string;
    rawResult: string;
  }[] = [];

  const meals: { name: string; mealClass: "breakfast" | "lunch" | "dinner" | "snack"; calories: number; protein: number; carbs: number; fat: number; fibre: number }[] = [
    { name: "Oatmeal with whey protein", mealClass: "breakfast", calories: 420, protein: 35, carbs: 50, fat: 8, fibre: 6 },
    { name: "Chicken breast with rice", mealClass: "lunch", calories: 620, protein: 50, carbs: 65, fat: 12, fibre: 3 },
    { name: "Salmon with vegetables", mealClass: "dinner", calories: 580, protein: 45, carbs: 25, fat: 28, fibre: 8 },
    { name: "Greek yoghurt with almonds", mealClass: "snack", calories: 280, protein: 20, carbs: 15, fat: 16, fibre: 2 },
    { name: "Eggs and avocado toast", mealClass: "breakfast", calories: 510, protein: 30, carbs: 35, fat: 26, fibre: 5 },
    { name: "Turkey sandwich", mealClass: "lunch", calories: 480, protein: 35, carbs: 45, fat: 14, fibre: 4 },
    { name: "Beef stir-fry", mealClass: "dinner", calories: 550, protein: 42, carbs: 35, fat: 22, fibre: 6 },
    { name: "Protein shake", mealClass: "snack", calories: 190, protein: 30, carbs: 8, fat: 3, fibre: 1 },
  ];

  const todayStr = ymd(TODAY);
  const yesterdayStr = ymd(daysAgo(1));

  // Today
  const todayMeals = meals.slice(0, 4);
  let hour = 7;
  for (const meal of todayMeals) {
    rows.push({
      id: "mock-macro-today-" + meal.mealClass,
      date: todayStr,
      imageUrl: "", fileName: "mock",
      foodName: meal.name,
      timeEaten: pad2(hour) + ":00",
      mealClass: meal.mealClass,
      protein: String(meal.protein),
      fibre: String(meal.fibre),
      carbohydrates: String(meal.carbs),
      fat: String(meal.fat),
      calories: String(meal.calories),
      rawResult: "",
    });
    hour += randomInt(3, 5);
  }

  // Yesterday
  const yesterdayMeals = [meals[4], meals[5], meals[6], meals[7]];
  hour = 8;
  for (const meal of yesterdayMeals) {
    rows.push({
      id: "mock-macro-yesterday-" + meal.mealClass,
      date: yesterdayStr,
      imageUrl: "", fileName: "mock",
      foodName: meal.name,
      timeEaten: pad2(hour) + ":00",
      mealClass: meal.mealClass,
      protein: String(meal.protein),
      fibre: String(meal.fibre),
      carbohydrates: String(meal.carbs),
      fat: String(meal.fat),
      calories: String(meal.calories),
      rawResult: "",
    });
    hour += randomInt(3, 4);
  }

  return rows;
}

function generateMockTemplates() {
  const now = new Date().toISOString();
  return [
    {
      id: "mock-template-push",
      name: "Push Day",
      dayOfWeek: 1,
      exercises: [
        { id: "tmpl-ex-1", exerciseId: "ex-bench-press", sortOrder: 0, targetSets: 4, targetReps: 10, targetWeight: 65 },
        { id: "tmpl-ex-2", exerciseId: "ex-overhead-press", sortOrder: 1, targetSets: 3, targetReps: 8, targetWeight: 35 },
        { id: "tmpl-ex-3", exerciseId: "ex-cable-fly", sortOrder: 2, targetSets: 3, targetReps: 12, targetWeight: 20 },
      ],
      createdAt: now,
    },
    {
      id: "mock-template-pull",
      name: "Pull Day",
      dayOfWeek: 3,
      exercises: [
        { id: "tmpl-ex-4", exerciseId: "ex-barbell-row", sortOrder: 0, targetSets: 4, targetReps: 10, targetWeight: 60 },
        { id: "tmpl-ex-5", exerciseId: "ex-pull-up", sortOrder: 1, targetSets: 3, targetReps: 10, targetWeight: 12 },
        { id: "tmpl-ex-6", exerciseId: "ex-bicep-curl", sortOrder: 2, targetSets: 3, targetReps: 12, targetWeight: 12 },
      ],
      createdAt: now,
    },
    {
      id: "mock-template-legs",
      name: "Legs Day",
      dayOfWeek: 5,
      exercises: [
        { id: "tmpl-ex-7", exerciseId: "ex-back-squat", sortOrder: 0, targetSets: 4, targetReps: 8, targetWeight: 85 },
        { id: "tmpl-ex-8", exerciseId: "ex-romanian-deadlift", sortOrder: 1, targetSets: 3, targetReps: 10, targetWeight: 55 },
      ],
      createdAt: now,
    },
  ];
}

function generateMockSessions() {
  const sessions: {
    id: string; templateId?: string; name: string; date: string;
    startedAt: string; completedAt?: string; notes?: string;
  }[] = [];

  for (let dayOffset = 21; dayOffset >= 3; dayOffset -= 2) {
    const date = daysAgo(dayOffset);
    if (date.getDay() !== 1 && date.getDay() !== 3 && date.getDay() !== 5) continue;
    const startedAt = new Date(date);
    startedAt.setHours(9, 0, 0);
    const completedAt = new Date(startedAt);
    completedAt.setHours(10, 15, 0);
    const name = date.getDay() === 1 ? "Push" : date.getDay() === 3 ? "Pull" : "Legs";
    sessions.push({
      id: "mock-session-" + ymd(date),
      templateId: "mock-template-" + name.toLowerCase().replace(" ", ""),
      name,
      date: ymd(date),
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
    });
  }

  return sessions;
}

async function waitForHydration(
  stores: { persist: { hasHydrated: () => boolean; onFinishHydration: (cb: () => void) => () => void } }[],
): Promise<void> {
  const allHydrated = stores.every((s) => s.persist.hasHydrated());
  if (allHydrated) return;

  await new Promise<void>((resolve) => {
    let remaining = stores.filter((s) => !s.persist.hasHydrated()).length;
    for (const store of stores) {
      if (store.persist.hasHydrated()) continue;
      store.persist.onFinishHydration(() => {
        remaining--;
        if (remaining <= 0) resolve();
      });
    }
  });
}

export function DevDataSeeder() {
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    if (process.env.NODE_ENV !== "development") return;

    const perfStore = usePerformanceStore;
    const metricsStore = useMetricsStore;
    const macrosStore = useMacrosCaptureStore;
    const progStore = useProgrammingStore;
    const gymStore = useGymStore;

    waitForHydration([perfStore, metricsStore, macrosStore, progStore, gymStore]).then(() => {
      if (seeded.current) return;
      const perfState = perfStore.getState();
      const metricsState = metricsStore.getState();
      const macrosState = macrosStore.getState();
      const progState = progStore.getState();

      const hasData = perfState.sets.length > 0 || metricsState.entries.length > 0 ||
        macrosState.rows.length > 0 || progState.templates.length > 0;
      if (hasData) {
        seeded.current = true;
        return;
      }

      const mockSets = generateMockSets();
      perfStore.getState().setPerformanceState(function (prev) {
        return { ...prev, sets: mockSets };
      });

      const mockEntries = generateMockMetrics();
      metricsStore.getState().setMetricsState(function (prev) {
        return {
          ...prev,
          entries: mockEntries,
          targetWeightKg: 75,
          targetBodyFatPercent: 15,
          activityLevel: "light" as const,
          targetWeeklyPaceKg: 0.5,
        };
      });

      const mockRows = generateMockMacros();
      for (const row of mockRows) {
        macrosStore.getState().addCaptureRow(row);
      }

      const mockTemplates = generateMockTemplates();
      const mockSessions = generateMockSessions();
      for (const tpl of mockTemplates) {
        progStore.getState().addTemplate(tpl as Parameters<ReturnType<typeof progStore.getState>["addTemplate"]>[0]);
      }
      for (const session of mockSessions) {
        progStore.getState().addSession(session as Parameters<ReturnType<typeof progStore.getState>["addSession"]>[0]);
      }

      const myEquipment = ["eq-barbell", "eq-dumbbells", "eq-power-rack", "eq-flat-bench",
        "eq-plates", "eq-cable-machine", "eq-pullup-bar", "eq-yoga-mat", "eq-foam-roller"];
      for (const id of myEquipment) {
        gymStore.getState().addMyEquipment(id);
      }

      seeded.current = true;
    });
  }, []);

  return null;
}
