import * as Location from "expo-location";
import { findCurrentGym } from "./gyms";
import type { Gym } from "./types";

export async function detectCurrentGym(gyms: Gym[]): Promise<Gym | null> {
  if (gyms.length === 0) return null;
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return findCurrentGym(
    { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
    gyms,
  );
}
