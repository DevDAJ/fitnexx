import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type MacroCaptureRow = {
  id: string;
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
  updateCaptureRow: (
    id: string,
    updater: (row: MacroCaptureRow) => MacroCaptureRow,
  ) => void;
  removeCaptureRow: (id: string) => void;
  resetCapture: () => void;
};

const MACROS_CAPTURE_STORAGE_KEY = "fitnexx-macros-capture";
const MACROS_CAPTURE_DB_NAME = "fitnexx-storage";
const MACROS_CAPTURE_DB_STORE = "zustand";
const MACROS_CAPTURE_DB_VERSION = 1;

function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    const request = window.indexedDB.open(
      MACROS_CAPTURE_DB_NAME,
      MACROS_CAPTURE_DB_VERSION,
    );

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MACROS_CAPTURE_DB_STORE)) {
        db.createObjectStore(MACROS_CAPTURE_DB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function createIndexedDbStorage() {
  if (typeof window === "undefined") {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }

  return {
    async getItem(name: string) {
      const db = await openIndexedDb();
      return new Promise<string | null>((resolve, reject) => {
        const transaction = db.transaction(MACROS_CAPTURE_DB_STORE, "readonly");
        const request = transaction.objectStore(MACROS_CAPTURE_DB_STORE).get(name);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result === undefined ? null : String(result));
        };
        request.onerror = () => reject(request.error);
      });
    },
    async setItem(name: string, value: string) {
      const db = await openIndexedDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(MACROS_CAPTURE_DB_STORE, "readwrite");
        const request = transaction.objectStore(MACROS_CAPTURE_DB_STORE).put(value, name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
    async removeItem(name: string) {
      const db = await openIndexedDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(MACROS_CAPTURE_DB_STORE, "readwrite");
        const request = transaction.objectStore(MACROS_CAPTURE_DB_STORE).delete(name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
  };
}

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
          rows: state.rows.map((row) =>
            row.id === id ? updater(row) : row,
          ),
        })),
      removeCaptureRow: (id) =>
        set((state) => ({ rows: state.rows.filter((row) => row.id !== id) })),
      resetCapture: () =>
        set({
          busy: false,
          scanError: null,
          lastResult: null,
          selectedFile: null,
          selectedPreviewUrl: null,
          context: "",
        }),
    }),
    {
      name: MACROS_CAPTURE_STORAGE_KEY,
      storage: createJSONStorage(createIndexedDbStorage),
      partialize: (state) => ({
        rows: state.rows,
        context: state.context,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState ?? {}),
      }),
    },
  ),
);

export type { MacroCaptureRow };
