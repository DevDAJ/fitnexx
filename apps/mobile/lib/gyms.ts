import type { ExerciseAsset, Gym } from "./types";

export interface Coords {
  latitude: number;
  longitude: number;
}

export function distanceMeters(a: Coords, b: Coords): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const la1 = toRad(a.latitude);
  const la2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function findCurrentGym(coords: Coords, gyms: Gym[]): Gym | null {
  let best: Gym | null = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const gym of gyms) {
    const d = distanceMeters(coords, gym);
    if (d <= gym.radius && d < bestDist) {
      best = gym;
      bestDist = d;
    }
  }
  return best;
}

export function isExerciseAvailable(
  exercise: ExerciseAsset,
  gymEquipment: string[],
): boolean {
  if (!exercise.equipment) return true;
  const eq = exercise.equipment.trim().toLowerCase();
  if (eq === "" || eq === "body only" || eq === "bodyweight") return true;
  return gymEquipment.some((g) => g.trim().toLowerCase() === eq);
}
