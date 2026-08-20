export const MUSCLES = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Abs",
  "Obliques",
  "Traps",
  "Rear Delts",
] as const;

export type Muscle = (typeof MUSCLES)[number];

export const MUSCLE_COLORS: Record<string, string> = {
  Chest: "#ef4444",
  Back: "#3b82f6",
  Shoulders: "#f59e0b",
  Biceps: "#10b981",
  Triceps: "#8b5cf6",
  Forearms: "#6b7280",
  Quads: "#ec4899",
  Hamstrings: "#f97316",
  Glutes: "#14b8a6",
  Calves: "#a855f7",
  Abs: "#06b6d4",
  Obliques: "#84cc16",
  Traps: "#e11d48",
  "Rear Delts": "#0ea5e9",
};
