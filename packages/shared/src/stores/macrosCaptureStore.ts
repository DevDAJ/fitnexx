import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPersistenceStorage } from "./persistence";

type MacroCaptureRow = {
  id: string;
  date: string;
  imageUrl: string;
  fileName: string;
  foodName: string;
  timeEaten: string;
  mealClass: "breakfast" | "lunch" | "dinner" | "snack" | "other";
  protein: string;
  fibre: string;
  carbohydrates: string;
  fat: string;
  calories: string;
  rawResult: string;
};

type MacrosCaptureStore = {
  busy: boolean;
  scanError: string | null;
  lastResult: unknown;
  selectedFile: File | null;
  selectedPreviewUrl: string | null;
  context: string;
  rows: MacroCaptureRow[];
  setBusy: (busy: boolean) => void;
  setScanError: (scanError: string | null) => void;
  setLastResult: (lastResult: unknown) => void;
  setSelectedFile: (selectedFile: File | null) => void;
  setSelectedPreviewUrl: (selectedPreviewUrl: string | null) => void;
  setContext: (context: string) => void;
  addCaptureRow: (row: MacroCaptureRow) => void;
  updateCaptureRow: (id: string, updater: (row: MacroCaptureRow) => MacroCaptureRow) => void;
  removeCaptureRow: (id: string) => void;
  resetCapture: () => void;
};

const MACROS_CAPTURE_STORAGE_KEY = "fitnexx-macros-capture";

export const useMacrosCaptureStore = create<MacrosCaptureStore>()(
  persist(
    (set) => ({
      busy: false,
      scanError: null,
      lastResult: null,
      selectedFile: null,
      selectedPreviewUrl: null,
      context: "",
      rows: [],
      setBusy: (busy) => set({ busy }),
      setScanError: (scanError) => set({ scanError }),
      setLastResult: (lastResult) => set({ lastResult }),
      setSelectedFile: (selectedFile) => set({ selectedFile }),
      setSelectedPreviewUrl: (selectedPreviewUrl) => set({ selectedPreviewUrl }),
      setContext: (context) => set({ context }),
      addCaptureRow: (row) => set((state) => ({ rows: [...state.rows, row] })),
      updateCaptureRow: (id, updater) =>
        set((state) => ({
          rows: state.rows.map((row) => (row.id === id ? updater(row) : row)),
        })),
      removeCaptureRow: (id) =>
        set((state) => ({ rows: state.rows.filter((row) => row.id !== id) })),
      resetCapture: () =>
        set({ busy: false, scanError: null, lastResult: null, selectedFile: null, selectedPreviewUrl: null, context: "" }),
    }),
    {
      name: MACROS_CAPTURE_STORAGE_KEY,
      storage: createJSONStorage(() => getPersistenceStorage()),
      partialize: (state) => ({ rows: state.rows, context: state.context }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState ?? {}),
      }),
    },
  ),
);

export type { MacroCaptureRow };
