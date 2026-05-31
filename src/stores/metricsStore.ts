"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { METRICS_STORAGE_KEY } from "@/constants/metricsConstants";
import { createIndexedDbStorage } from "@/stores/indexedDbStorage";
import type { MetricsState } from "@/types/metricsTypes";
import { mergePartialMetricsState } from "@/utils/metricsUtils";

type MetricsStore = MetricsState & {
  setMetricsState: (
    updater: MetricsState | ((prev: MetricsState) => MetricsState),
  ) => void;
};

const baseline: MetricsState = {
  entries: [],
  targetWeightKg: null,
  targetBodyFatPercent: null,
  activityLevel: "sedentary",
  targetWeeklyPaceKg: null,
};

function createMetricsPersistStorage() {
  const idb = createIndexedDbStorage();
  if (typeof window === "undefined") return idb;

  return {
    async getItem(name: string) {
      const raw = await idb.getItem(name);
      if (raw !== null) return raw;
      const lsRaw = localStorage.getItem(name);
      if (lsRaw === null) return null;
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

export const useMetricsStore = create<MetricsStore>()(
  persist(
    (set, get) => ({
      ...baseline,
      setMetricsState: (updater) => {
        const prev: MetricsState = {
          entries: get().entries,
          targetWeightKg: get().targetWeightKg,
          targetBodyFatPercent: get().targetBodyFatPercent,
          activityLevel: get().activityLevel,
          targetWeeklyPaceKg: get().targetWeeklyPaceKg,
        };
        const next =
          typeof updater === "function"
            ? (updater as (p: MetricsState) => MetricsState)(prev)
            : updater;
        set({
          entries: next.entries,
          targetWeightKg: next.targetWeightKg,
          targetBodyFatPercent: next.targetBodyFatPercent,
          activityLevel: next.activityLevel,
          targetWeeklyPaceKg: next.targetWeeklyPaceKg,
        });
      },
    }),
    {
      name: METRICS_STORAGE_KEY,
      storage: createJSONStorage(createMetricsPersistStorage),
      partialize: (s) => ({
        entries: s.entries,
        targetWeightKg: s.targetWeightKg,
        targetBodyFatPercent: s.targetBodyFatPercent,
        activityLevel: s.activityLevel,
        targetWeeklyPaceKg: s.targetWeeklyPaceKg,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...mergePartialMetricsState(persisted),
      }),
    },
  ),
);
