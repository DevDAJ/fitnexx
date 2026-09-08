import { KEYS } from "./backupSchema";

export const SYNC_PORT = 47612;
export const SYNC_KEYS = [
  KEYS.WORKOUTS,
  KEYS.TEMPLATES,
  KEYS.WEIGHT_UNIT,
  KEYS.SCHEDULE,
  KEYS.MEALS,
  KEYS.MEAL_TEMPLATES,
  KEYS.BODY_METRICS,
  KEYS.GYMS,
  KEYS.DAILY_CALORIE_GOAL,
  KEYS.WATER,
  KEYS.SYNC_TOMBSTONES,
] as const;

export const TOMBSTONE_KEYS = [
  KEYS.WORKOUTS,
  KEYS.TEMPLATES,
  KEYS.SCHEDULE,
  KEYS.MEALS,
  KEYS.MEAL_TEMPLATES,
  KEYS.GYMS,
] as const;

export type SyncKey = (typeof SYNC_KEYS)[number];
export type SyncData = Record<SyncKey, unknown>;
export type TombstoneKey = (typeof TOMBSTONE_KEYS)[number];
export type SyncTombstones = Record<TombstoneKey, string[]>;

export interface SyncPeer {
  host: string;
  port: number;
}

export interface PairingCode extends SyncPeer {
  token: string;
}

const TOKEN_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function buildPairingCode({ token, host, port }: PairingCode): string {
  if (!isValidToken(token) || !isValidHost(host) || !isValidPort(port)) {
    throw new Error("Invalid pairing details.");
  }
  return `fitnexx://sync?token=${encodeURIComponent(token)}&host=${encodeURIComponent(host)}&port=${port}`;
}

export function parsePairingCode(raw: string): PairingCode {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("This is not a Fitnexx sync code.");
  }
  const token = url.searchParams.get("token") ?? "";
  const host = url.searchParams.get("host") ?? "";
  const port = Number(url.searchParams.get("port"));
  if (
    url.protocol !== "fitnexx:" ||
    url.hostname !== "sync" ||
    !isValidToken(token) ||
    !isValidHost(host) ||
    !isValidPort(port)
  ) {
    throw new Error("This is not a valid Fitnexx sync code.");
  }
  return { token, host, port };
}

export function isValidToken(token: string): boolean {
  return TOKEN_PATTERN.test(token);
}

export function parseSyncData(value: unknown): SyncData {
  if (!isRecord(value)) throw new Error("Invalid sync data.");
  const checks: Record<SyncKey, (item: unknown) => boolean> = {
    [KEYS.WORKOUTS]: (item) => isKeyedArray(item, "id"),
    [KEYS.TEMPLATES]: (item) => isKeyedArray(item, "id"),
    [KEYS.WEIGHT_UNIT]: (item) => item === "kg" || item === "lbs",
    [KEYS.SCHEDULE]: (item) =>
      item === null || (isRecord(item) && typeof item.id === "string"),
    [KEYS.MEALS]: (item) => isKeyedArray(item, "id"),
    [KEYS.MEAL_TEMPLATES]: (item) => isKeyedArray(item, "id"),
    [KEYS.BODY_METRICS]: (item) => isKeyedArray(item, "date"),
    [KEYS.GYMS]: (item) => isKeyedArray(item, "id"),
    [KEYS.DAILY_CALORIE_GOAL]: (item) =>
      item === null || (typeof item === "number" && Number.isFinite(item)),
    [KEYS.WATER]: (item) =>
      isRecord(item) &&
      Object.values(item).every(
        (amount) => typeof amount === "number" && Number.isFinite(amount),
      ),
    [KEYS.SYNC_TOMBSTONES]: isSyncTombstones,
  };

  for (const key of SYNC_KEYS) {
    if (!checks[key](value[key])) throw new Error(`Invalid sync field: ${key}`);
  }
  return value as SyncData;
}

export function mergeSyncData(local: SyncData, incoming: SyncData): SyncData {
  const tombstones = mergeTombstones(
    local[KEYS.SYNC_TOMBSTONES],
    incoming[KEYS.SYNC_TOMBSTONES],
  );
  const schedule = (incoming[KEYS.SCHEDULE] ?? local[KEYS.SCHEDULE]) as Record<
    string,
    unknown
  > | null;
  return {
    [KEYS.WORKOUTS]: removeDeleted(
      mergeBy(local[KEYS.WORKOUTS], incoming[KEYS.WORKOUTS], "id", true),
      tombstones[KEYS.WORKOUTS],
    ),
    [KEYS.TEMPLATES]: removeDeleted(
      mergeBy(local[KEYS.TEMPLATES], incoming[KEYS.TEMPLATES], "id"),
      tombstones[KEYS.TEMPLATES],
    ),
    [KEYS.WEIGHT_UNIT]: incoming[KEYS.WEIGHT_UNIT],
    [KEYS.SCHEDULE]:
      schedule && tombstones[KEYS.SCHEDULE].includes(schedule.id as string)
        ? null
        : schedule,
    [KEYS.MEALS]: removeDeleted(
      mergeBy(local[KEYS.MEALS], incoming[KEYS.MEALS], "id", true, "imageUri"),
      tombstones[KEYS.MEALS],
    ),
    [KEYS.MEAL_TEMPLATES]: removeDeleted(
      mergeBy(local[KEYS.MEAL_TEMPLATES], incoming[KEYS.MEAL_TEMPLATES], "id"),
      tombstones[KEYS.MEAL_TEMPLATES],
    ),
    [KEYS.BODY_METRICS]: mergeBy(
      local[KEYS.BODY_METRICS],
      incoming[KEYS.BODY_METRICS],
      "date",
      true,
    ),
    [KEYS.GYMS]: removeDeleted(
      mergeBy(local[KEYS.GYMS], incoming[KEYS.GYMS], "id"),
      tombstones[KEYS.GYMS],
    ),
    [KEYS.DAILY_CALORIE_GOAL]: incoming[KEYS.DAILY_CALORIE_GOAL],
    [KEYS.WATER]: {
      ...(local[KEYS.WATER] as Record<string, number>),
      ...(incoming[KEYS.WATER] as Record<string, number>),
    },
    [KEYS.SYNC_TOMBSTONES]: tombstones,
  };
}

export function createEmptySyncTombstones(): SyncTombstones {
  return {
    [KEYS.WORKOUTS]: [],
    [KEYS.TEMPLATES]: [],
    [KEYS.SCHEDULE]: [],
    [KEYS.MEALS]: [],
    [KEYS.MEAL_TEMPLATES]: [],
    [KEYS.GYMS]: [],
  };
}

export function parseSyncTombstones(value: unknown): SyncTombstones {
  if (!isSyncTombstones(value)) throw new Error("Invalid sync tombstones.");
  return value;
}

export function stripDeviceLocalData(data: SyncData): SyncData {
  return {
    ...data,
    [KEYS.MEALS]: (data[KEYS.MEALS] as Record<string, unknown>[]).map(
      ({ imageUri: _imageUri, ...meal }) => meal,
    ),
  };
}

function mergeBy(
  local: unknown,
  incoming: unknown,
  key: "id" | "date",
  sortByDate = false,
  preserveLocalField?: string,
): Record<string, unknown>[] {
  const merged = new Map<string, Record<string, unknown>>();
  for (const item of local as Record<string, unknown>[]) {
    merged.set(item[key] as string, item);
  }
  for (const item of incoming as Record<string, unknown>[]) {
    const existing = merged.get(item[key] as string);
    const next = { ...item };
    if (preserveLocalField) {
      delete next[preserveLocalField];
      if (existing?.[preserveLocalField] != null) {
        next[preserveLocalField] = existing[preserveLocalField];
      }
    }
    merged.set(item[key] as string, next);
  }
  const result = Array.from(merged.values());
  return sortByDate
    ? result.sort(
        (a, b) =>
          new Date(b.date as string).getTime() -
          new Date(a.date as string).getTime(),
      )
    : result;
}

function mergeTombstones(local: unknown, incoming: unknown): SyncTombstones {
  const result = createEmptySyncTombstones();
  for (const key of TOMBSTONE_KEYS) {
    result[key] = [
      ...new Set([
        ...(local as SyncTombstones)[key],
        ...(incoming as SyncTombstones)[key],
      ]),
    ];
  }
  return result;
}

function removeDeleted(
  items: Record<string, unknown>[],
  deletedIds: string[],
): Record<string, unknown>[] {
  const deleted = new Set(deletedIds);
  return items.filter((item) => !deleted.has(item.id as string));
}

function isSyncTombstones(value: unknown): value is SyncTombstones {
  return (
    isRecord(value) &&
    TOMBSTONE_KEYS.every(
      (key) =>
        Array.isArray(value[key]) &&
        value[key].every((id) => typeof id === "string"),
    )
  );
}

function isKeyedArray(value: unknown, key: "id" | "date"): boolean {
  return (
    Array.isArray(value) &&
    value.every((item) => isRecord(item) && typeof item[key] === "string")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidHost(host: string): boolean {
  const parts = host.split(".");
  return (
    parts.length === 4 &&
    parts.every((part) => {
      const value = Number(part);
      return /^\d{1,3}$/.test(part) && value >= 0 && value <= 255;
    }) &&
    host !== "0.0.0.0"
  );
}

function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port > 0 && port <= 65535;
}
