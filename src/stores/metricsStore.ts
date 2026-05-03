"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { METRICS_STORAGE_KEY } from "@/constants/metricsConstants";
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
};

function createMetricsPersistStorage() {
  if (typeof window === "undefined") {
    return {
      getItem: (): null => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  const { localStorage } = window;
  return localStorage;
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
        };
        const next =
          typeof updater === "function"
            ? (updater as (p: MetricsState) => MetricsState)(prev)
            : updater;
        set({
          entries: next.entries,
          targetWeightKg: next.targetWeightKg,
          targetBodyFatPercent: next.targetBodyFatPercent,
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
      }),
      merge: (persisted, current) => ({
        ...current,
        ...mergePartialMetricsState(persisted),
      }),
    },
  ),
);
