import { File, Paths } from "expo-file-system";
import { getExerciseByName, EXERCISES } from "../constants/exercises";
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
    if (lower.includes("bicep") || lower.includes("biceps")) mapped.add("Biceps");
    if (lower.includes("tricep") || lower.includes("triceps")) mapped.add("Triceps");
    if (lower.includes("chest") || lower.includes("pectoral")) mapped.add("Chest");
    if (lower.includes("lat") || lower.includes("back")) mapped.add("Back");
    if (lower.includes("deltoid") || lower.includes("shoulder") || lower.includes("front delt")) mapped.add("Shoulders");
    if (lower.includes("rear delt") || lower.includes("posterior delt")) mapped.add("Rear Delts");
    if (lower.includes("glute")) mapped.add("Glutes");
    if (lower.includes("hamstring")) mapped.add("Hamstrings");
    if (lower.includes("quad")) mapped.add("Quads");
    if (lower.includes("abs") || lower.includes("abdominal")) mapped.add("Abs");
    if (lower.includes("oblique")) mapped.add("Obliques");
    if (lower.includes("forearm")) mapped.add("Forearms");
    if (lower.includes("calf") || lower.includes("calves")) mapped.add("Calves");
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

function toExerciseAsset(remote: RemoteExercise): ExerciseAsset {
  return {
    name: remote.name,
    primaryMuscle: mapCategoryToMuscle(remote.category, remote.target),
    secondaryMuscles: mapSecondaryMuscles(remote.secondary_muscles, remote.category),
    category: mapCategory(remote.category),
    imageUrl: remote.image ? IMAGES_BASE_URL + remote.image : undefined,
    gifUrl: remote.gif_url ? IMAGES_BASE_URL + remote.gif_url : undefined,
    equipment: remote.equipment,
    instructions: remote.instructions?.en,
  };
}

async function ensureCache(): Promise<void> {
  const cacheDir = new File(Paths.document, "fitnexx");
  const cacheFile = new File(cacheDir, "exercises.json");
  const versionFile = new File(cacheDir, "version.txt");

  try {
    if (!cacheDir.exists) cacheDir.create();
  } catch {}

  if (versionFile.exists && cacheFile.exists) {
    const version = await versionFile.text();
    if (version.trim() === String(CACHE_VERSION)) return;
  }

  await File.downloadFileAsync(DATA_URL, cacheFile, { idempotent: true });
  versionFile.write(String(CACHE_VERSION));
}

export async function loadExercises(): Promise<ExerciseAsset[]> {
  if (cachedExercises) return cachedExercises;

  try {
    await ensureCache();
    const cacheFile = new File(new File(Paths.document, "fitnexx"), "exercises.json");
    const raw = await cacheFile.text();
    const remote: RemoteExercise[] = JSON.parse(raw);
    cachedExercises = remote.map(toExerciseAsset);
    return cachedExercises;
  } catch {
    cachedExercises = [...EXERCISES];
    return cachedExercises;
  }
}

export async function searchRemoteExercises(query: string): Promise<ExerciseAsset[]> {
  const all = await loadExercises();
  if (!query) return all;

  const q = query.toLowerCase();
  return all.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.primaryMuscle.toLowerCase().includes(q) ||
      e.secondaryMuscles.some((m: string) => m.toLowerCase().includes(q)) ||
      e.category.toLowerCase().includes(q) ||
      (e.equipment && e.equipment.toLowerCase().includes(q))
  );
}

export async function getRemoteExerciseByName(name: string): Promise<ExerciseAsset | undefined> {
  const all = await loadExercises();
  const found = all.find((e) => e.name === name);
  if (found) return found;
  return getExerciseByName(name);
}

export async function getExerciseCount(): Promise<number> {
  const all = await loadExercises();
  return all.length;
}
