export const KEYS = {
  WORKOUTS: "fitnexx_workouts",
  TEMPLATES: "fitnexx_templates",
  WEIGHT_UNIT: "fitnexx_weight_unit",
  SCHEDULE: "fitnexx_schedule",
  MEALS: "fitnexx_meals",
  MEAL_TEMPLATES: "fitnexx_meal_templates",
  BODY_METRICS: "fitnexx_body_metrics",
  GYMS: "fitnexx_gyms",
  METRICS_REMINDER: "fitnexx_metrics_reminder",
  DAILY_CALORIE_GOAL: "fitnexx_daily_calorie_goal",
  WATER: "fitnexx_water",
  REMINDERS: "fitnexx_habit_reminders",
  PRO: "fitnexx_pro",
  AI_SETTINGS: "fitnexx_ai_settings",
  AI_USAGE: "fitnexx_ai_usage",
  SYNC_TOKEN: "fitnexx_sync_token",
  SYNC_PEER: "fitnexx_sync_peer",
  SYNC_TOMBSTONES: "fitnexx_sync_tombstones",
  INITIALIZED: "fitnexx_initialized",
} as const;

const SCHEMA: Record<string, (v: unknown) => boolean> = {
  [KEYS.WORKOUTS]: Array.isArray,
  [KEYS.TEMPLATES]: Array.isArray,
  [KEYS.WEIGHT_UNIT]: (v) => v === "kg" || v === "lbs",
  [KEYS.SCHEDULE]: (v) => v === null || (typeof v === "object" && v !== null),
  [KEYS.MEALS]: Array.isArray,
  [KEYS.MEAL_TEMPLATES]: Array.isArray,
  [KEYS.BODY_METRICS]: Array.isArray,
  [KEYS.GYMS]: Array.isArray,
  [KEYS.METRICS_REMINDER]: (v) => v === null || typeof v === "object",
  [KEYS.DAILY_CALORIE_GOAL]: (v) => v === null || typeof v === "number",
  [KEYS.WATER]: (v) => typeof v === "object" && v !== null,
  [KEYS.REMINDERS]: (v) => typeof v === "object" && v !== null,
  [KEYS.PRO]: (v) => typeof v === "boolean",
};

export function parseImport(raw: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("The file is not valid JSON.");
  }
  const backup = parsed as { version?: unknown; data?: unknown } | null;
  if (
    !backup ||
    backup.version !== 1 ||
    typeof backup.data !== "object" ||
    backup.data === null
  ) {
    throw new Error("This is not a Fitnexx backup file.");
  }
  const data = backup.data as Record<string, unknown>;
  for (const [key, valid] of Object.entries(SCHEMA)) {
    if (!(key in data) || !valid(data[key])) {
      throw new Error(`Missing or invalid field: ${key}`);
    }
  }
  return data;
}
