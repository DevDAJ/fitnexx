import { useEffect, useState } from "react";
import { buildAssetIndex, loadExercises } from "./exerciseDatabase";
import type { ExerciseAsset } from "./types";

export function useExerciseEquipment(): {
  equipment: Record<string, string>;
  byName: Record<string, ExerciseAsset>;
  loading: boolean;
} {
  const [equipment, setEquipment] = useState<Record<string, string>>({});
  const [byName, setByName] = useState<Record<string, ExerciseAsset>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadExercises()
      .then((all: ExerciseAsset[]) => {
        if (!active) return;
        const { equipment, byName } = buildAssetIndex(all);
        setEquipment(equipment);
        setByName(byName);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { equipment, byName, loading };
}
