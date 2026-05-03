"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PERFORMANCE_STORAGE_KEY } from "@/constants/performanceConstants";
import type { PerformanceState } from "@/types/performanceTypes";
import { mergePartialPerformanceState } from "@/utils/performanceUtils";

type PerformanceStore = PerformanceState & {
  setPerformanceState: (
    updater: PerformanceState | ((prev: PerformanceState) => PerformanceState),
  ) => void;
};

const emptyState: PerformanceState = {
  muscleGroups: [],
  exercises: [],
  sets: [],
};

function createPerformanceStorage() {
  if (typeof window === "undefined") {
    return {
      getItem: (): null => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  const { localStorage } = window;
  return {
    getItem: (name: string) => {
      const raw = localStorage.getItem(name);
      if (raw === null) return null;
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        if (
          parsed &&
          typeof parsed === "object" &&
          !("state" in parsed) &&
          ("muscleGroups" in parsed ||
            "exercises" in parsed ||
            "sets" in parsed)
        ) {
          return JSON.stringify({ state: parsed, version: 0 });
        }
      } catch {
        /* use raw string */
      }
      return raw;
    },
    setItem: (name: string, value: string) => localStorage.setItem(name, value),
    removeItem: (name: string) => localStorage.removeItem(name),
  };
}

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set, get) => ({
      ...emptyState,
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
