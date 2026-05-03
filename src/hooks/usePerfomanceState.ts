import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePerformanceStore } from "@/stores/performanceStore";
import type { PerformanceState } from "@/types/performanceTypes";

export function usePerformanceState(): {
  state: PerformanceState;
  setState: (
    updater: PerformanceState | ((prev: PerformanceState) => PerformanceState),
  ) => void;
  ready: boolean;
} {
  const [ready, setReady] = useState(
    () =>
      typeof window !== "undefined" &&
      usePerformanceStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = usePerformanceStore.persist.onFinishHydration(() => {
      setReady(true);
    });
    if (usePerformanceStore.persist.hasHydrated()) {
      setReady(true);
    }
    return unsub;
  }, []);

  const state = usePerformanceStore(
    useShallow((s) => ({
      muscleGroups: s.muscleGroups,
      exercises: s.exercises,
      sets: s.sets,
    })),
  );

  const setState = usePerformanceStore((s) => s.setPerformanceState);

  return { state, setState, ready };
}
