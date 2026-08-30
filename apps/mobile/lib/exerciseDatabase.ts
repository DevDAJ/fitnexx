import * as FileSystem from "expo-file-system/legacy";
import { EXERCISES } from "../constants/exercises";
import type { ExerciseAsset } from "./types";

const DATA_URL =
  "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json";
export const IMAGES_BASE_URL =
  "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";

const CACHE_VERSION = 1;

interface RemoteExercise {
  id: string;
  name: string;
  category: string;
  body_part: string;
  equipment: string;
  target: string;
  muscle_group: string;
  secondary_muscles: string[];
  instructions: { en: string };
  image: string;
  gif_url: string;
}

let cachedExercises: ExerciseAsset[] | null = null;

function mapCategoryToMuscle(category: string, target: string): string {
  const c = category.toLowerCase();
  const t = target.toLowerCase();

  if (c === "chest") return "Chest";
  if (c === "back") return "Back";
  if (c === "shoulders") return "Shoulders";
  if (c === "waist") {
    if (t.includes("oblique")) return "Obliques";
    return "Abs";
  }
  if (c === "lower legs") return "Calves";
  if (c === "lower arms") return "Forearms";
  if (c === "neck") return "Traps";
  if (c === "upper arms") {
    if (t.includes("bicep") || t.includes("biceps")) return "Biceps";
    if (t.includes("tricep") || t.includes("triceps")) return "Triceps";
    return "Biceps";
  }
  if (c === "upper legs") {
    if (t.includes("glute")) return "Glutes";
    if (t.includes("hamstring")) return "Hamstrings";
    if (t.includes("quad")) return "Quads";
    if (t.includes("calf")) return "Calves";
    return "Quads";
  }
  if (t.includes("bicep") || t.includes("biceps")) return "Biceps";
  if (t.includes("tricep") || t.includes("triceps")) return "Triceps";
  if (t.includes("chest") || t.includes("pectoral")) return "Chest";
  if (t.includes("lat")) return "Back";
  if (t.includes("deltoid") || t.includes("shoulder")) return "Shoulders";
  if (t.includes("glute")) return "Glutes";
  if (t.includes("hamstring")) return "Hamstrings";
  if (t.includes("quad")) return "Quads";
  if (t.includes("abs") || t.includes("abdominal")) return "Abs";
  if (t.includes("oblique")) return "Obliques";
  if (t.includes("forearm")) return "Forearms";
  if (t.includes("calf")) return "Calves";
  if (t.includes("trap")) return "Traps";
  return "Chest";
}

function mapSecondaryMuscles(muscles: string[], category: string): string[] {
  const mapped = new Set<string>();
  for (const m of muscles) {
    const lower = m.toLowerCase();
    if (lower.includes("bicep") || lower.includes("biceps"))
      mapped.add("Biceps");
    if (lower.includes("tricep") || lower.includes("triceps"))
      mapped.add("Triceps");
    if (lower.includes("chest") || lower.includes("pectoral"))
      mapped.add("Chest");
    if (lower.includes("lat") || lower.includes("back")) mapped.add("Back");
    if (
      lower.includes("deltoid") ||
      lower.includes("shoulder") ||
      lower.includes("front delt")
    )
      mapped.add("Shoulders");
    if (lower.includes("rear delt") || lower.includes("posterior delt"))
      mapped.add("Rear Delts");
    if (lower.includes("glute")) mapped.add("Glutes");
    if (lower.includes("hamstring")) mapped.add("Hamstrings");
    if (lower.includes("quad")) mapped.add("Quads");
    if (lower.includes("abs") || lower.includes("abdominal")) mapped.add("Abs");
    if (lower.includes("oblique")) mapped.add("Obliques");
    if (lower.includes("forearm")) mapped.add("Forearms");
    if (lower.includes("calf") || lower.includes("calves"))
      mapped.add("Calves");
    if (lower.includes("trap")) mapped.add("Traps");
    if (lower.includes("hip flexor")) mapped.add("Abs");
    if (lower.includes("lower back")) mapped.add("Back");
  }
  const primary = mapCategoryToMuscle(category, "");
  mapped.delete(primary);
  return Array.from(mapped);
}

function mapCategory(category: string): string {
  const c = category.toLowerCase();
  if (c === "cardio") return "cardio";
  return "compound";
}

function capitalizeWords(s: string): string {
  return s
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function toExerciseAsset(remote: RemoteExercise): ExerciseAsset {
  return {
    name: capitalizeWords(remote.name),
    primaryMuscle: mapCategoryToMuscle(remote.category, remote.target),
    secondaryMuscles: mapSecondaryMuscles(
      remote.secondary_muscles,
      remote.category,
    ),
    category: mapCategory(remote.category),
    imageUrl: remote.image ? IMAGES_BASE_URL + remote.image : undefined,
    gifUrl: remote.gif_url ? IMAGES_BASE_URL + remote.gif_url : undefined,
    equipment: remote.equipment,
    instructions: remote.instructions?.en,
  };
}

let cacheDirPath = "";
if (FileSystem.documentDirectory) {
  cacheDirPath = `${FileSystem.documentDirectory}fitnexx/`;
}
const cacheFilePath = () => `${cacheDirPath}exercises.json`;
const versionFilePath = () => `${cacheDirPath}version.txt`;

function isValidCache(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
}

async function isCached(): Promise<boolean> {
  try {
    const [versionInfo, cacheInfo] = await Promise.all([
      FileSystem.getInfoAsync(versionFilePath()),
      FileSystem.getInfoAsync(cacheFilePath()),
    ]);
    if (!versionInfo.exists || !cacheInfo.exists) return false;
    const version = await FileSystem.readAsStringAsync(versionFilePath());
    const raw = await FileSystem.readAsStringAsync(cacheFilePath());
    return version.trim() === String(CACHE_VERSION) && isValidCache(raw);
  } catch {
    return false;
  }
}

async function ensureCache(): Promise<void> {
  // If an earlier broken run left a plain file at the "fitnexx" path, remove it
  // so it can't block creating the directory.
  const dirInfo = await FileSystem.getInfoAsync(cacheDirPath).catch(() => null);
  if (dirInfo?.exists && !dirInfo.isDirectory) {
    await FileSystem.deleteAsync(cacheDirPath, { idempotent: true }).catch(
      () => {},
    );
  }

  // Create the cache directory (and parent dirs) if it does not exist.
  await FileSystem.makeDirectoryAsync(cacheDirPath, {
    intermediates: true,
  }).catch(() => {});

  if (await isCached()) return;

  // Force a fresh download so the device never sits on a stale/broken dataset.
  const maxAttempts = 3;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await FileSystem.downloadAsync(DATA_URL, cacheFilePath());
      if (!result.status || result.status < 200 || result.status >= 300) {
        throw new Error(`Download failed with status ${result.status}`);
      }
      const raw = await FileSystem.readAsStringAsync(cacheFilePath());
      if (!isValidCache(raw))
        throw new Error("Downloaded exercise JSON is invalid");
      await FileSystem.writeAsStringAsync(
        versionFilePath(),
        String(CACHE_VERSION),
      );
      return;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export const NAME_ALIASES: Record<string, string> = {
  "incline barbell press": "barbell incline bench press",
  "incline dumbbell press": "dumbbell incline bench press",
  "cable fly": "cable standing fly",
  "barbell row": "barbell bent over row",
  deadlift: "barbell deadlift",
  "lat pulldown": "cable lat pulldown full range of motion",
  "seated cable row": "cable low seated row",
  "dumbbell row": "dumbbell bent over row",
  "t bar row": "lever reverse t-bar row",
  "straight arm pulldown": "cable straight arm pulldown",
  "overhead press": "barbell seated overhead press",
  "dumbbell shoulder press": "dumbbell seated shoulder press",
  "lateral raise": "dumbbell lateral raise",
  "front raise": "dumbbell front raise",
  "rear delt fly": "barbell rear delt raise",
  "upright row": "barbell upright row",
  "dumbbell curl": "dumbbell alternate biceps curl",
  "hammer curl": "dumbbell hammer curl",
  "preacher curl": "barbell preacher curl",
  "incline dumbbell curl": "dumbbell incline biceps curl",
  "tricep pushdown": "cable triceps pushdown (v-bar)",
  "skull crusher": "barbell lying triceps extension skull crusher",
  "overhead tricep extension": "barbell standing overhead triceps extension",
  dips: "triceps dips floor",
  "wrist curl": "barbell wrist curl",
  "reverse wrist curl": "barbell reverse wrist curl",
  "barbell squat": "barbell full squat",
  "front squat": "barbell front squat",
  "leg press": "smith leg press",
  "leg extension": "lever leg extension",
  "romanian deadlift": "barbell romanian deadlift",
  "leg curl": "lever lying leg curl",
  "bulgarian split squat": "barbell single leg split squat",
  "hip thrust": "resistance band hip thrusts on knees (female)",
  "glute bridge": "barbell glute bridge",
  "calf raise": "barbell standing calf raise",
  "seated calf raise": "barbell seated calf raise",
  lunge: "barbell lunge",
  "step up": "dumbbell step-up",
  "cable crunch": "cable kneeling crunch",
  "arnold press": "dumbbell arnold press",
  "push up": "push-up",
  "pull up": "pull-up",
};

export function buildAssetIndex(all: ExerciseAsset[]): {
  equipment: Record<string, string>;
  byName: Record<string, ExerciseAsset>;
} {
  const equipment: Record<string, string> = {};
  const byName: Record<string, ExerciseAsset> = {};
  for (const e of all) {
    byName[e.name.toLowerCase()] = e;
    if (e.equipment) equipment[e.name.toLowerCase()] = e.equipment;
  }
  for (const local of EXERCISES) {
    const key = local.name.toLowerCase();
    if (byName[key]) continue;
    const remote = NAME_ALIASES[key]
      ? byName[NAME_ALIASES[key].toLowerCase()]
      : undefined;
    if (remote) {
      byName[key] = remote;
      if (remote.equipment) equipment[key] = remote.equipment;
    } else {
      byName[key] = local;
    }
  }
  return { equipment, byName };
}

export async function loadExercises(): Promise<ExerciseAsset[]> {
  if (cachedExercises) return cachedExercises;

  await ensureCache();
  const raw = await FileSystem.readAsStringAsync(cacheFilePath());
  const remote: RemoteExercise[] = JSON.parse(raw);
  cachedExercises = remote.map(toExerciseAsset);
  return cachedExercises;
}

export async function searchRemoteExercises(
  query: string,
): Promise<ExerciseAsset[]> {
  const all = await loadExercises();
  if (!query) return all;

  const q = query.toLowerCase();
  return all.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.primaryMuscle.toLowerCase().includes(q) ||
      e.secondaryMuscles.some((m: string) => m.toLowerCase().includes(q)) ||
      e.category.toLowerCase().includes(q) ||
      e.equipment?.toLowerCase().includes(q),
  );
}

export async function getRemoteExerciseByName(
  name: string,
): Promise<ExerciseAsset | undefined> {
  const all = await loadExercises();
  return buildAssetIndex(all).byName[name.toLowerCase()];
}

export async function getExerciseCount(): Promise<number> {
  const all = await loadExercises();
  return all.length;
}

const FALLBACK_EQUIPMENT = [
  "Barbell",
  "EZ Bar",
  "Dumbbell",
  "Kettlebell",
  "Cable",
  "Machine",
  "Squat Rack",
  "Bench",
  "Pull-Up Bar",
  "Body Only",
  "Bands",
  "Rope",
  "Medicine Ball",
  "Exercise Ball",
  "Box",
  "Suspension",
  "Plate",
];

let cachedEquipmentOptions: string[] | null = null;

export async function getEquipmentOptions(): Promise<string[]> {
  if (cachedEquipmentOptions) return cachedEquipmentOptions;
  const seen = new Set<string>();
  try {
    const all = await loadExercises();
    for (const e of all) {
      if (e.equipment) seen.add(e.equipment);
    }
  } catch {
    // fall through to built-in list when dataset is unavailable
  }
  const fallback = [...FALLBACK_EQUIPMENT, ...seen].filter(
    (e) => e !== "Body Only",
  );
  const sorted = Array.from(seen).sort((a, b) => a.localeCompare(b));
  cachedEquipmentOptions = sorted.length > 0 ? sorted : fallback;
  return cachedEquipmentOptions;
}
