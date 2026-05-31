"use client";

import { useEffect, useRef } from "react";
import { useGymStore } from "@/stores/gymStore";
import { usePerformanceStore } from "@/stores/performanceStore";
import type { RefDataPayload } from "@/components/providers/ReferenceDataProvider";

export function useReferenceData() {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;

    const el = document.getElementById("ref-data");
    if (!el || !el.textContent) return;

    try {
      const data: RefDataPayload = JSON.parse(el.textContent);

      useGymStore.getState().hydrateFromServer(
        data.equipment,
        data.exerciseEquipment,
      );

      usePerformanceStore.getState().hydrateFromServer(
        data.muscleGroups,
        data.exercises,
      );

      hydrated.current = true;
    } catch (err) {
      console.error("Failed to hydrate reference data:", err);
    }
  }, []);
}
