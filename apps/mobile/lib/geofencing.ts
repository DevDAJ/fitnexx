import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import type { Gym } from "./types";

export const GEOFENCE_TASK = "fitnexx-gym-geofence";
const DETECTED_GYM_KEY = "fitnexx_detected_gym_id";

TaskManager.defineTask(GEOFENCE_TASK, async ({ data }) => {
  try {
    const { eventType, region } = data as {
      eventType: number;
      region: { identifier: string };
    };
    if (eventType === Location.GeofencingEventType.Enter) {
      await AsyncStorage.setItem(DETECTED_GYM_KEY, region.identifier);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      await AsyncStorage.removeItem(DETECTED_GYM_KEY);
    }
  } catch {
    // persist quietly; foreground check is the source of truth
  }
});

export async function getDetectedGymId(): Promise<string | null> {
  return AsyncStorage.getItem(DETECTED_GYM_KEY);
}

export async function startGymGeofencing(gyms: Gym[]): Promise<void> {
  try {
    await stopGymGeofencing();
    if (gyms.length === 0) return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    // "Always" lets geofence events fire while the app is backgrounded/killed.
    await Location.requestBackgroundPermissionsAsync().catch(() => {});
    await Location.startGeofencingAsync(
      GEOFENCE_TASK,
      gyms.map((g) => ({
        identifier: g.id,
        latitude: g.latitude,
        longitude: g.longitude,
        radius: g.radius,
      })),
    );
  } catch {
    // geofencing unsupported (e.g. Expo Go / simulator); foreground check still works
  }
}

export async function stopGymGeofencing(): Promise<void> {
  try {
    await Location.stopGeofencingAsync(GEOFENCE_TASK);
  } catch {
    // not running; ignore
  }
}
