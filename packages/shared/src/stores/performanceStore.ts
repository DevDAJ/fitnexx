import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PERFORMANCE_STORAGE_KEY, SEEDED_MUSCLE_GROUPS, SEEDED_EXERCISES } from "../constants/performanceConstants";
import { getPersistenceStorage } from "./persistence";
import type { Exercise, MuscleGroup, PerformanceState } from "../types/performanceTypes";
import { mergePartialPerformanceState } from "../utils/performanceUtils";

type PerformanceStore = PerformanceState & {
  setPerformanceState: (
    updater: PerformanceState | ((prev: PerformanceState) => PerformanceState),
  ) => void;
  hydrateFromServer: (
    muscleGroups: MuscleGroup[],
    exercises: Exercise[],
  ) => void;
};

const emptyState: PerformanceState = {
  muscleGroups: SEEDED_MUSCLE_GROUPS,
  exercises: SEEDED_EXERCISES,
  sets: [],
};

function createPerformanceStorage() {
  const base = getPersistenceStorage();
  if (typeof window === "undefined") return base;
  return {
    async getItem(name: string) {
      const raw = await base.getItem(name);
      if (raw !== null) return raw;
      const lsRaw = (typeof localStorage !== "undefined" ? localStorage.getItem(name) : null);
      if (lsRaw === null) return null;
      try {
        const parsed = JSON.parse(lsRaw) as Record<string, unknown>;
        if (
          parsed && typeof parsed === "object" &&
          !("state" in parsed) &&
          ("muscleGroups" in parsed || "exercises" in parsed || "sets" in parsed)
        ) {
          const wrapped = JSON.stringify({ state: parsed, version: 0 });
          await base.setItem(name, wrapped);
          if (typeof localStorage !== "undefined") localStorage.removeItem(name);
          return wrapped;
        }
      } catch { /* use raw string */ }
      await base.setItem(name, lsRaw);
      if (typeof localStorage !== "undefined") localStorage.removeItem(name);
      return lsRaw;
    },
    async setItem(name: string, value: string) { await base.setItem(name, value); },
    async removeItem(name: string) { await base.removeItem(name); },
  };
}

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set, get) => ({
      ...emptyState,
      hydrateFromServer: (muscleGroups, exercises) =>
        set((state) => {
          const serverIds = new Set(exercises.map((e) => e.id));
          const serverNames = new Set(
            exercises.map((e) => e.name.toLowerCase().trim()),
          );
          return {
            muscleGroups,
            exercises: [
              ...exercises,
              ...state.exercises.filter(
                (e) => !serverIds.has(e.id) && !serverNames.has(e.name.toLowerCase().trim()),
              ),
            ],
          };
        }),
      setPerformanceState: (updater) => {
        const prev: PerformanceState = {
          muscleGroups: get().muscleGroups,
          exercises: get().exercises,
          sets: get().sets,
        };
        const next =
          typeof updater === "function"
            ? (updater as (p: PerformanceState) => PerformanceState)(prev)
            : updater;
        set({
          muscleGroups: next.muscleGroups,
          exercises: next.exercises,
          sets: next.sets,
        });
      },
    }),
    {
      name: PERFORMANCE_STORAGE_KEY,
      storage: createJSONStorage(createPerformanceStorage),
      partialize: (s) => ({
        muscleGroups: s.muscleGroups,
        exercises: s.exercises,
        sets: s.sets,
      }),
      merge: (persistedState, current) => ({
        ...current,
        ...mergePartialPerformanceState(persistedState),
      }),
    },
  ),
);
