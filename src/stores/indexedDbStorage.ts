const DB_NAME = "fitnexx-storage";
const DB_STORE = "zustand";
const DB_VERSION = 1;

function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
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
        const transaction = db.transaction(DB_STORE, "readonly");
        const request = transaction.objectStore(DB_STORE).get(name);
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
        const transaction = db.transaction(DB_STORE, "readwrite");
        const request = transaction.objectStore(DB_STORE).put(value, name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
    async removeItem(name: string) {
      const db = await openIndexedDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(DB_STORE, "readwrite");
        const request = transaction.objectStore(DB_STORE).delete(name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
  };
}

export { createIndexedDbStorage };
