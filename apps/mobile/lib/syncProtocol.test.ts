import { describe, expect, test } from "bun:test";
import { KEYS } from "./backupSchema";
import {
  buildPairingCode,
  createEmptySyncTombstones,
  mergeSyncData,
  parsePairingCode,
  parseSyncData,
  type SyncData,
  stripDeviceLocalData,
} from "./syncProtocol";

const emptyData = (): SyncData => ({
  [KEYS.WORKOUTS]: [],
  [KEYS.TEMPLATES]: [],
  [KEYS.WEIGHT_UNIT]: "kg",
  [KEYS.SCHEDULE]: null,
  [KEYS.MEALS]: [],
  [KEYS.MEAL_TEMPLATES]: [],
  [KEYS.BODY_METRICS]: [],
  [KEYS.GYMS]: [],
  [KEYS.DAILY_CALORIE_GOAL]: null,
  [KEYS.WATER]: {},
  [KEYS.SYNC_TOMBSTONES]: createEmptySyncTombstones(),
});

describe("sync protocol", () => {
  test("round-trips a pairing QR", () => {
    const pairing = {
      token: "7ad36a11-8b9b-4e67-9a36-60f15441b1d2",
      host: "192.168.1.14",
      port: 47612,
    };
    expect(parsePairingCode(buildPairingCode(pairing))).toEqual(pairing);
  });

  test("rejects malformed pairing codes", () => {
    expect(() => parsePairingCode("https://example.com")).toThrow();
    expect(() =>
      parsePairingCode("fitnexx://sync?token=bad&host=192.168.1.14&port=47612"),
    ).toThrow();
  });

  test("rejects malformed sync data", () => {
    expect(() =>
      parseSyncData({ ...emptyData(), [KEYS.WORKOUTS]: "not an array" }),
    ).toThrow(KEYS.WORKOUTS);
    expect(() =>
      parseSyncData({ ...emptyData(), [KEYS.SYNC_TOMBSTONES]: [] }),
    ).toThrow(KEYS.SYNC_TOMBSTONES);
  });

  test("unions records and lets incoming conflicts win", () => {
    const local = emptyData();
    local[KEYS.WORKOUTS] = [
      { id: "shared", date: "2026-09-01", title: "Local" },
      { id: "local", date: "2026-08-01", title: "Keep" },
    ];
    const incoming = emptyData();
    incoming[KEYS.WORKOUTS] = [
      { id: "shared", date: "2026-09-02", title: "Incoming" },
      { id: "remote", date: "2026-09-03", title: "Add" },
    ];

    expect(mergeSyncData(local, incoming)[KEYS.WORKOUTS]).toEqual([
      { id: "remote", date: "2026-09-03", title: "Add" },
      { id: "shared", date: "2026-09-02", title: "Incoming" },
      { id: "local", date: "2026-08-01", title: "Keep" },
    ]);
  });

  test("keeps meal photos local", () => {
    const local = emptyData();
    local[KEYS.MEALS] = [
      { id: "meal", date: "2026-09-01", name: "Local", imageUri: "file://a" },
    ];
    const incoming = emptyData();
    incoming[KEYS.MEALS] = [
      { id: "meal", date: "2026-09-01", name: "Incoming" },
    ];

    const merged = mergeSyncData(local, incoming);
    expect(merged[KEYS.MEALS]).toEqual([
      {
        id: "meal",
        date: "2026-09-01",
        name: "Incoming",
        imageUri: "file://a",
      },
    ]);
    expect(stripDeviceLocalData(merged)[KEYS.MEALS]).toEqual([
      { id: "meal", date: "2026-09-01", name: "Incoming" },
    ]);
  });

  test("propagates deletions with tombstones", () => {
    const local = emptyData();
    local[KEYS.WORKOUTS] = [
      { id: "deleted", date: "2026-09-01", title: "Old" },
    ];
    local[KEYS.SCHEDULE] = { id: "old-schedule", name: "Old" };
    const incoming = emptyData();
    incoming[KEYS.SYNC_TOMBSTONES] = {
      ...createEmptySyncTombstones(),
      [KEYS.WORKOUTS]: ["deleted"],
      [KEYS.SCHEDULE]: ["old-schedule"],
    };

    const merged = mergeSyncData(local, incoming);
    expect(merged[KEYS.WORKOUTS]).toEqual([]);
    expect(merged[KEYS.SCHEDULE]).toBeNull();
    expect(merged[KEYS.SYNC_TOMBSTONES]).toEqual(
      incoming[KEYS.SYNC_TOMBSTONES],
    );
  });

  test("keeps a schedule unless it was explicitly deleted", () => {
    const local = emptyData();
    local[KEYS.SCHEDULE] = { id: "schedule", name: "Local" };

    expect(mergeSyncData(local, emptyData())[KEYS.SCHEDULE]).toEqual(
      local[KEYS.SCHEDULE],
    );
  });
});
