import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { KEYS, parseImport } from "./backupSchema";
import { clearCache } from "./computationCache";
import { useAppStore } from "./store";
import { createEmptySyncTombstones } from "./syncProtocol";

interface FitnexxBackup {
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

const BACKUP_FILE = "fitnexx-backup.json";

function buildBackupData(): Record<string, unknown> {
  const s = useAppStore.getState();
  return {
    [KEYS.WORKOUTS]: s.workouts,
    [KEYS.TEMPLATES]: s.templates,
    [KEYS.WEIGHT_UNIT]: s.weightUnit,
    [KEYS.SCHEDULE]: s.schedule,
    [KEYS.MEALS]: s.meals,
    [KEYS.MEAL_TEMPLATES]: s.mealTemplates,
    [KEYS.BODY_METRICS]: s.bodyMetrics,
    [KEYS.GYMS]: s.gyms,
    [KEYS.METRICS_REMINDER]: s.metricsReminder,
    [KEYS.DAILY_CALORIE_GOAL]: s.dailyCalorieGoal,
    [KEYS.WATER]: s.waterLog,
  };
}

export async function exportData(): Promise<void> {
  const payload: FitnexxBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: buildBackupData(),
  };
  const uri = `${FileSystem.cacheDirectory}${BACKUP_FILE}`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));
  await Sharing.shareAsync(uri, { mimeType: "application/json" });
}

export async function importData(): Promise<void> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
  });
  if (result.canceled) return;
  const [asset] = result.assets;
  const raw = await FileSystem.readAsStringAsync(asset.uri);
  const data = parseImport(raw);
  const entries: [string, string][] = Object.entries(data).map(([k, v]) => [
    k,
    JSON.stringify(v),
  ]);
  entries.push([
    KEYS.SYNC_TOMBSTONES,
    JSON.stringify(createEmptySyncTombstones()),
  ]);
  await AsyncStorage.multiSet(entries);
  clearCache();
  await useAppStore.getState().loadAll();
}
