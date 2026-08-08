import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  GYM_STORAGE_KEY,
  type Equipment,
  type GymState,
  seededGymState,
} from "../constants/gymConstants";
import { getPersistenceStorage } from "./persistence";

type GymStore = GymState & {
  addMyEquipment: (id: string) => void;
  removeMyEquipment: (id: string) => void;
  setExerciseEquipment: (exerciseId: string, equipmentIds: string[]) => void;
  getEquipmentForExercise: (exerciseId: string) => string[];
  getExercisesForEquipment: (equipmentId: string) => string[];
  getMyEquipment: () => Equipment[];
  addCustomEquipment: (equipment: Equipment) => void;
  hydrateFromServer: (
    equipment: { id: string; name: string; category: string }[],
    exerciseEquipment: Record<string, string[]>,
  ) => void;
};

export const useGymStore = create<GymStore>()(
  persist(
    (set, get) => ({
      ...seededGymState(),

      addMyEquipment: (id) =>
        set((state) => ({
          myEquipmentIds: state.myEquipmentIds.includes(id)
            ? state.myEquipmentIds
            : [...state.myEquipmentIds, id],
        })),

      removeMyEquipment: (id) =>
        set((state) => ({
          myEquipmentIds: state.myEquipmentIds.filter((eid) => eid !== id),
        })),

      setExerciseEquipment: (exerciseId, equipmentIds) =>
        set((state) => ({
          exerciseEquipment: {
            ...state.exerciseEquipment,
            [exerciseId]: equipmentIds,
          },
        })),

      getEquipmentForExercise: (exerciseId) =>
        get().exerciseEquipment[exerciseId] ?? [],

      getExercisesForEquipment: (equipmentId) => {
        const { exerciseEquipment } = get();
        const result: string[] = [];
        for (const [exId, eqIds] of Object.entries(exerciseEquipment)) {
          if (eqIds.includes(equipmentId)) result.push(exId);
        }
        return result;
      },

      getMyEquipment: () => {
        const { equipmentCatalog, myEquipmentIds } = get();
        return equipmentCatalog.filter((eq) => myEquipmentIds.includes(eq.id));
      },

      addCustomEquipment: (equipment) =>
        set((state) => ({
          equipmentCatalog: state.equipmentCatalog.some((e) => e.id === equipment.id)
            ? state.equipmentCatalog
            : [...state.equipmentCatalog, equipment],
        })),

      hydrateFromServer: (equipment, exerciseEquipment) =>
        set((state) => {
          const serverIds = new Set(equipment.map((e) => e.id));
          return {
            equipmentCatalog: [
              ...(equipment as Equipment[]),
              ...state.equipmentCatalog.filter((e) => !serverIds.has(e.id)),
            ],
            exerciseEquipment: { ...exerciseEquipment, ...state.exerciseEquipment },
          };
        }),
    }),
    {
      name: GYM_STORAGE_KEY,
      storage: createJSONStorage(() => getPersistenceStorage()),
      partialize: (state) => ({
        equipmentCatalog: state.equipmentCatalog,
        myEquipmentIds: state.myEquipmentIds,
        exerciseEquipment: state.exerciseEquipment,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<GymState>),
      }),
    },
  ),
);
