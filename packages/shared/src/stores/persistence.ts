export interface PersistenceStorage {
  getItem(name: string): Promise<string | null>;
  setItem(name: string, value: string): Promise<void>;
  removeItem(name: string): Promise<void>;
}

let _storage: PersistenceStorage | undefined;

export function setPersistenceStorage(storage: PersistenceStorage) {
  _storage = storage;
}

export function getPersistenceStorage(): PersistenceStorage {
  if (!_storage) {
    throw new Error(
      "Persistence storage not configured. Call setPersistenceStorage() at app startup.",
    );
  }
  return _storage;
}
