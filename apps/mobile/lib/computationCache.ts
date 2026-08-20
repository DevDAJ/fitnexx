const cache = new Map<string, { value: unknown; expiry: number }>();
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttl = DEFAULT_TTL): void {
  cache.set(key, { value, expiry: Date.now() + ttl });
}

export function computeCached<T>(key: string, fn: () => T, ttl = DEFAULT_TTL): T {
  const hit = getCached<T>(key);
  if (hit !== undefined) return hit;
  const value = fn();
  setCached(key, value, ttl);
  return value;
}

export function invalidateCache(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

export function clearCache(): void {
  cache.clear();
}
