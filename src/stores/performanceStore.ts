"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PERFORMANCE_STORAGE_KEY } from "@/constants/performanceConstants";
import { createIndexedDbStorage } from "@/stores/indexedDbStorage";
import type { Exercise, MuscleGroup, PerformanceState } from "@/types/performanceTypes";
import { mergePartialPerformanceState } from "@/utils/performanceUtils";

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
  muscleGroups: [],
  exercises: [],
  sets: [],
};

function createPerformanceStorage() {
  const idb = createIndexedDbStorage();

  if (typeof window === "undefined") {
    return idb;
  }

  return {
    async getItem(name: string) {
      const raw = await idb.getItem(name);
      if (raw !== null) return raw;

      // migration: check localStorage
      const lsRaw = localStorage.getItem(name);
      if (lsRaw === null) return null;

      try {
        const parsed = JSON.parse(lsRaw) as Record<string, unknown>;
        if (
          parsed &&
          typeof parsed === "object" &&
          !("state" in parsed) &&
          ("muscleGroups" in parsed ||
            "exercises" in parsed ||
            "sets" in parsed)
        ) {
          const wrapped = JSON.stringify({ state: parsed, version: 0 });
          // migrate to IndexedDB, remove from localStorage
          await idb.setItem(name, wrapped);
          localStorage.removeItem(name);
          return wrapped;
        }
      } catch {
        /* use raw string */
      }

      // already wrapped format: migrate as-is
      await idb.setItem(name, lsRaw);
      localStorage.removeItem(name);
      return lsRaw;
    },
    async setItem(name: string, value: string) {
      await idb.setItem(name, value);
    },
    async removeItem(name: string) {
      await idb.removeItem(name);
    },
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
                (e) =>
                  !serverIds.has(e.id) &&
                  !serverNames.has(e.name.toLowerCase().trim()),
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
