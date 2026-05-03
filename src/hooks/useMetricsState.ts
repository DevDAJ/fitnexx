import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMetricsStore } from "@/stores/metricsStore";
import type { MetricsState } from "@/types/metricsTypes";

export function useMetricsState(): {
  state: MetricsState;
  setState: (
    updater: MetricsState | ((prev: MetricsState) => MetricsState),
  ) => void;
  ready: boolean;
} {
  const [ready, setReady] = useState(
    () =>
      typeof window !== "undefined" && useMetricsStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useMetricsStore.persist.onFinishHydration(() => {
      setReady(true);
    });
    if (useMetricsStore.persist.hasHydrated()) {
      setReady(true);
    }
    return unsub;
  }, []);

  const state = useMetricsStore(
    useShallow((s) => ({
      entries: s.entries,
      targetWeightKg: s.targetWeightKg,
      targetBodyFatPercent: s.targetBodyFatPercent,
    })),
  );

  const setState = useMetricsStore((s) => s.setMetricsState);

  return { state, setState, ready };
}
