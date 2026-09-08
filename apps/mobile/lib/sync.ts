import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as Network from "expo-network";
import TcpSocket from "react-native-tcp-socket";
import { KEYS } from "./backupSchema";
import { clearCache } from "./computationCache";
import { storage } from "./storage";
import { useAppStore } from "./store";
import {
  buildPairingCode,
  isValidToken,
  mergeSyncData,
  parsePairingCode,
  parseSyncData,
  SYNC_KEYS,
  SYNC_PORT,
  type SyncData,
  type SyncPeer,
  stripDeviceLocalData,
} from "./syncProtocol";

type WireMessage =
  | { type: "hello"; token: string; host: string; port: number }
  | { type: "state"; data: SyncData }
  | { type: "done" }
  | { type: "error"; message: string };

export interface SyncStatus {
  phase: "stopped" | "listening" | "syncing" | "error";
  message: string;
  lastSyncedAt: string | null;
}

const MAX_MESSAGE_LENGTH = 10 * 1024 * 1024;
const TIMEOUT_MS = 15_000;
type Server = ReturnType<typeof TcpSocket.createServer>;
type Socket = ReturnType<typeof TcpSocket.createConnection>;
let server: Server | null = null;
let startingServer: Promise<void> | null = null;
let appTokenPromise: Promise<string> | null = null;
let syncing = false;
let status: SyncStatus = {
  phase: "stopped",
  message: "Sync is off",
  lastSyncedAt: null,
};
const statusListeners = new Set<() => void>();

export function getSyncStatus(): SyncStatus {
  return status;
}

export function subscribeSyncStatus(listener: () => void): () => void {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

export async function getAppToken(): Promise<string> {
  if (!appTokenPromise) {
    appTokenPromise = (async () => {
      const existing = await AsyncStorage.getItem(KEYS.SYNC_TOKEN);
      if (existing && isValidToken(existing)) return existing;
      const token = Crypto.randomUUID();
      await AsyncStorage.setItem(KEYS.SYNC_TOKEN, token);
      return token;
    })();
  }
  return appTokenPromise;
}

export async function getSyncPeer(): Promise<SyncPeer | null> {
  const raw = await AsyncStorage.getItem(KEYS.SYNC_PEER);
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<SyncPeer>;
    if (
      typeof value.host === "string" &&
      typeof value.port === "number" &&
      value.port > 0 &&
      value.port <= 65535
    ) {
      return { host: value.host, port: value.port };
    }
  } catch {
    // Replace corrupt pairing state on the next scan.
  }
  return null;
}

export async function getPairingCode(): Promise<string> {
  await startSyncServer();
  const [token, host] = await Promise.all([getAppToken(), getLocalIpAddress()]);
  return buildPairingCode({ token, host, port: SYNC_PORT });
}

export async function adoptPairingCode(raw: string): Promise<SyncPeer> {
  const { token, host, port } = parsePairingCode(raw);
  const peer = { host, port };
  await AsyncStorage.multiSet([
    [KEYS.SYNC_TOKEN, token],
    [KEYS.SYNC_PEER, JSON.stringify(peer)],
  ]);
  appTokenPromise = Promise.resolve(token);
  return peer;
}

export async function createNewSyncGroup(): Promise<string> {
  const token = Crypto.randomUUID();
  await AsyncStorage.setItem(KEYS.SYNC_TOKEN, token);
  await AsyncStorage.removeItem(KEYS.SYNC_PEER);
  appTokenPromise = Promise.resolve(token);
  return token;
}

export async function startSyncServer(): Promise<void> {
  if (server?.listening) return;
  if (startingServer) return startingServer;

  startingServer = new Promise<void>((resolve, reject) => {
    let settled = false;
    const nextServer = TcpSocket.createServer((socket) => {
      void handleIncomingSocket(socket);
    });
    server = nextServer;
    nextServer.on("error", (error) => {
      updateStatus("error", error.message);
      if (!settled) {
        settled = true;
        server = null;
        reject(error);
      }
    });
    nextServer.listen(
      { port: SYNC_PORT, host: "0.0.0.0", reuseAddress: true },
      () => {
        settled = true;
        updateStatus("listening", "Ready on this network");
        resolve();
      },
    );
  }).finally(() => {
    startingServer = null;
  });
  return startingServer;
}

export async function autoSyncIfPaired(): Promise<void> {
  if (syncing) return;
  const peer = await getSyncPeer();
  if (!peer) return;
  try {
    await syncWithPeer(peer);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes("already syncing")
    ) {
      throw error;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, 250 + Math.random() * 500),
    );
    if (!syncing) await syncWithPeer(peer);
  }
}

export async function syncWithPeer(
  peer: SyncPeer | null = null,
): Promise<void> {
  if (syncing) throw new Error("A sync is already in progress.");
  const target = peer ?? (await getSyncPeer());
  if (!target) throw new Error("Scan another Fitnexx app first.");

  syncing = true;
  updateStatus("syncing", `Connecting to ${target.host}`);
  try {
    await startSyncServer();
    const [token, host] = await Promise.all([
      getAppToken(),
      getLocalIpAddress(),
    ]);
    await runClientSync(target, token, host);
    await AsyncStorage.setItem(KEYS.SYNC_PEER, JSON.stringify(target));
    updateStatus("listening", "Sync complete", new Date().toISOString());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed.";
    updateStatus("error", message);
    throw error;
  } finally {
    syncing = false;
  }
}

async function runClientSync(
  peer: SyncPeer,
  token: string,
  host: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let finished = false;
    const socket = TcpSocket.createConnection(
      {
        host: peer.host,
        port: peer.port,
        connectTimeout: TIMEOUT_MS,
        interface: "wifi",
      },
      () => {
        send(socket, { type: "hello", token, host, port: SYNC_PORT });
      },
    );

    const finish = (error?: Error) => {
      if (finished) return;
      finished = true;
      socket.destroy();
      error ? reject(error) : resolve();
    };

    socket.setTimeout(TIMEOUT_MS, () => finish(new Error("Sync timed out.")));
    socket.on("error", (error) => finish(error));
    readMessages(
      socket,
      async (message) => {
        if (message.type === "error") {
          finish(new Error(message.message));
          return;
        }
        if (message.type === "state") {
          const incoming = parseSyncData(message.data);
          const merged = mergeSyncData(await getLocalSyncData(), incoming);
          await applySyncData(merged);
          send(socket, { type: "state", data: stripDeviceLocalData(merged) });
          return;
        }
        if (message.type === "done") finish();
      },
      finish,
    );
  });
}

async function handleIncomingSocket(socket: Socket): Promise<void> {
  let authenticated = false;
  let ownsSyncLock = false;
  socket.setTimeout(TIMEOUT_MS, () => socket.destroy());

  const release = () => {
    if (!ownsSyncLock) return;
    syncing = false;
    ownsSyncLock = false;
    if (status.phase === "syncing") {
      updateStatus("listening", "Ready on this network");
    }
  };
  socket.on("close", release);
  socket.on("error", release);

  readMessages(
    socket,
    async (message) => {
      if (!authenticated) {
        if (message.type !== "hello") {
          send(socket, { type: "error", message: "Pairing required." });
          socket.end();
          return;
        }
        if (message.token !== (await getAppToken())) {
          send(socket, { type: "error", message: "App tokens do not match." });
          socket.end();
          return;
        }
        if (syncing) {
          send(socket, {
            type: "error",
            message: "This app is already syncing.",
          });
          socket.end();
          return;
        }

        const peer = parsePairingCode(
          buildPairingCode({
            token: message.token,
            host: message.host,
            port: message.port,
          }),
        );
        await AsyncStorage.setItem(
          KEYS.SYNC_PEER,
          JSON.stringify({ host: peer.host, port: peer.port }),
        );
        authenticated = true;
        syncing = true;
        ownsSyncLock = true;
        updateStatus("syncing", `Syncing with ${peer.host}`);
        send(socket, {
          type: "state",
          data: stripDeviceLocalData(await getLocalSyncData()),
        });
        return;
      }

      if (message.type !== "state") {
        throw new Error("Expected sync state.");
      }
      const merged = mergeSyncData(
        await getLocalSyncData(),
        parseSyncData(message.data),
      );
      await applySyncData(merged);
      send(socket, { type: "done" });
      socket.end();
      updateStatus("listening", "Sync complete", new Date().toISOString());
      release();
    },
    (error) => {
      send(socket, { type: "error", message: error.message });
      socket.destroy();
      release();
    },
  );
}

async function getLocalSyncData(): Promise<SyncData> {
  const state = useAppStore.getState();
  return {
    [KEYS.WORKOUTS]: state.workouts,
    [KEYS.TEMPLATES]: state.templates,
    [KEYS.WEIGHT_UNIT]: state.weightUnit,
    [KEYS.SCHEDULE]: state.schedule,
    [KEYS.MEALS]: state.meals,
    [KEYS.MEAL_TEMPLATES]: state.mealTemplates,
    [KEYS.BODY_METRICS]: state.bodyMetrics,
    [KEYS.GYMS]: state.gyms,
    [KEYS.DAILY_CALORIE_GOAL]: state.dailyCalorieGoal,
    [KEYS.WATER]: state.waterLog,
    [KEYS.SYNC_TOMBSTONES]: await storage.getSyncTombstones(),
  };
}

async function applySyncData(data: SyncData): Promise<void> {
  const entries: [string, string][] = SYNC_KEYS.map((key) => [
    key,
    key === KEYS.WEIGHT_UNIT ? String(data[key]) : JSON.stringify(data[key]),
  ]);
  await AsyncStorage.multiSet(entries);
  clearCache();
  await useAppStore.getState().loadAll();
}

function readMessages(
  socket: Socket,
  onMessage: (message: WireMessage) => Promise<void>,
  onError: (error: Error) => void,
): void {
  let buffer = "";
  let queue = Promise.resolve();
  socket.setEncoding("utf8");
  socket.on("data", (chunk) => {
    buffer += chunk.toString();
    if (buffer.length > MAX_MESSAGE_LENGTH) {
      onError(new Error("Sync payload is too large."));
      return;
    }
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line) continue;
      queue = queue
        .then(() => onMessage(parseWireMessage(line)))
        .catch((error) =>
          onError(
            error instanceof Error ? error : new Error("Invalid sync message."),
          ),
        );
    }
  });
}

function parseWireMessage(raw: string): WireMessage {
  const value = JSON.parse(raw) as unknown;
  if (!isRecord(value) || typeof value.type !== "string") {
    throw new Error("Invalid sync message.");
  }
  if (value.type === "done") return { type: "done" };
  if (value.type === "error" && typeof value.message === "string") {
    return { type: "error", message: value.message };
  }
  if (value.type === "state" && "data" in value) {
    return { type: "state", data: value.data as SyncData };
  }
  if (
    value.type === "hello" &&
    typeof value.token === "string" &&
    typeof value.host === "string" &&
    typeof value.port === "number"
  ) {
    return {
      type: "hello",
      token: value.token,
      host: value.host,
      port: value.port,
    };
  }
  throw new Error("Invalid sync message.");
}

function send(socket: Socket, message: WireMessage): void {
  socket.write(`${JSON.stringify(message)}\n`);
}

function updateStatus(
  phase: SyncStatus["phase"],
  message: string,
  lastSyncedAt = status.lastSyncedAt,
): void {
  status = { phase, message, lastSyncedAt };
  for (const listener of statusListeners) listener();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getLocalIpAddress(): Promise<string> {
  const host = await Network.getIpAddressAsync();
  if (host === "0.0.0.0") {
    throw new Error("Connect this device to Wi-Fi before syncing.");
  }
  return host;
}
