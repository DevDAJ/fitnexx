import type { ExerciseAsset } from "../lib/types";

export const EXERCISES: ExerciseAsset[] = [
  // Chest
  { name: "Barbell Bench Press", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Front Delts"], category: "compound" },
  { name: "Incline Barbell Press", primaryMuscle: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], category: "compound" },
  { name: "Dumbbell Bench Press", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Front Delts"], category: "compound" },
  { name: "Incline Dumbbell Press", primaryMuscle: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], category: "compound" },
  { name: "Dumbbell Fly", primaryMuscle: "Chest", secondaryMuscles: ["Front Delts"], category: "isolation" },
  { name: "Cable Fly", primaryMuscle: "Chest", secondaryMuscles: ["Front Delts"], category: "isolation" },
  { name: "Push Up", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Front Delts", "Abs"], category: "compound" },
  { name: "Chest Dip", primaryMuscle: "Chest", secondaryMuscles: ["Triceps", "Front Delts"], category: "compound" },
  { name: "Pec Deck", primaryMuscle: "Chest", secondaryMuscles: [], category: "isolation" },

  // Back
  { name: "Barbell Row", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear Delts"], category: "compound" },
  { name: "Deadlift", primaryMuscle: "Back", secondaryMuscles: ["Hamstrings", "Glutes", "Traps", "Forearms"], category: "compound" },
  { name: "Pull Up", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear Delts"], category: "compound" },
  { name: "Lat Pulldown", primaryMuscle: "Back", secondaryMuscles: ["Biceps"], category: "compound" },
  { name: "Seated Cable Row", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear Delts"], category: "compound" },
  { name: "Dumbbell Row", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear Delts"], category: "compound" },
  { name: "T Bar Row", primaryMuscle: "Back", secondaryMuscles: ["Biceps", "Rear Delts", "Traps"], category: "compound" },
  { name: "Face Pull", primaryMuscle: "Rear Delts", secondaryMuscles: ["Traps"], category: "isolation" },
  { name: "Straight Arm Pulldown", primaryMuscle: "Back", secondaryMuscles: [], category: "isolation" },
  { name: "Hyperextension", primaryMuscle: "Back", secondaryMuscles: ["Hamstrings", "Glutes"], category: "compound" },

  // Shoulders
  { name: "Overhead Press", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps", "Traps"], category: "compound" },
  { name: "Dumbbell Shoulder Press", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps"], category: "compound" },
  { name: "Lateral Raise", primaryMuscle: "Shoulders", secondaryMuscles: [], category: "isolation" },
  { name: "Front Raise", primaryMuscle: "Shoulders", secondaryMuscles: [], category: "isolation" },
  { name: "Rear Delt Fly", primaryMuscle: "Rear Delts", secondaryMuscles: ["Traps"], category: "isolation" },
  { name: "Arnold Press", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps"], category: "compound" },
  { name: "Upright Row", primaryMuscle: "Shoulders", secondaryMuscles: ["Traps", "Biceps"], category: "compound" },

  // Arms
  { name: "Barbell Curl", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], category: "isolation" },
  { name: "Dumbbell Curl", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], category: "isolation" },
  { name: "Hammer Curl", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], category: "isolation" },
  { name: "Preacher Curl", primaryMuscle: "Biceps", secondaryMuscles: [], category: "isolation" },
  { name: "Incline Dumbbell Curl", primaryMuscle: "Biceps", secondaryMuscles: [], category: "isolation" },
  { name: "Tricep Pushdown", primaryMuscle: "Triceps", secondaryMuscles: [], category: "isolation" },
  { name: "Skull Crusher", primaryMuscle: "Triceps", secondaryMuscles: [], category: "isolation" },
  { name: "Overhead Tricep Extension", primaryMuscle: "Triceps", secondaryMuscles: [], category: "isolation" },
  { name: "Dips", primaryMuscle: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], category: "compound" },
  { name: "Wrist Curl", primaryMuscle: "Forearms", secondaryMuscles: [], category: "isolation" },
  { name: "Reverse Wrist Curl", primaryMuscle: "Forearms", secondaryMuscles: [], category: "isolation" },

  // Legs
  { name: "Barbell Squat", primaryMuscle: "Quads", secondaryMuscles: ["Glutes", "Hamstrings", "Abs"], category: "compound" },
  { name: "Front Squat", primaryMuscle: "Quads", secondaryMuscles: ["Glutes", "Abs"], category: "compound" },
  { name: "Leg Press", primaryMuscle: "Quads", secondaryMuscles: ["Glutes"], category: "compound" },
  { name: "Leg Extension", primaryMuscle: "Quads", secondaryMuscles: [], category: "isolation" },
  { name: "Romanian Deadlift", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes", "Back"], category: "compound" },
  { name: "Leg Curl", primaryMuscle: "Hamstrings", secondaryMuscles: [], category: "isolation" },
  { name: "Bulgarian Split Squat", primaryMuscle: "Quads", secondaryMuscles: ["Glutes"], category: "compound" },
  { name: "Hip Thrust", primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings"], category: "compound" },
  { name: "Glute Bridge", primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings"], category: "isolation" },
  { name: "Calf Raise", primaryMuscle: "Calves", secondaryMuscles: [], category: "isolation" },
  { name: "Seated Calf Raise", primaryMuscle: "Calves", secondaryMuscles: [], category: "isolation" },
  { name: "Lunge", primaryMuscle: "Quads", secondaryMuscles: ["Glutes", "Hamstrings"], category: "compound" },
  { name: "Step Up", primaryMuscle: "Quads", secondaryMuscles: ["Glutes"], category: "compound" },

  // Core
  { name: "Plank", primaryMuscle: "Abs", secondaryMuscles: ["Obliques"], category: "isolation" },
  { name: "Crunch", primaryMuscle: "Abs", secondaryMuscles: [], category: "isolation" },
  { name: "Cable Crunch", primaryMuscle: "Abs", secondaryMuscles: [], category: "isolation" },
  { name: "Hanging Leg Raise", primaryMuscle: "Abs", secondaryMuscles: ["Obliques"], category: "isolation" },
  { name: "Russian Twist", primaryMuscle: "Obliques", secondaryMuscles: ["Abs"], category: "isolation" },
  { name: "Ab Rollout", primaryMuscle: "Abs", secondaryMuscles: ["Obliques"], category: "compound" },
  { name: "Side Plank", primaryMuscle: "Obliques", secondaryMuscles: ["Abs"], category: "isolation" },

  // Traps
  { name: "Barbell Shrug", primaryMuscle: "Traps", secondaryMuscles: ["Forearms"], category: "isolation" },
  { name: "Dumbbell Shrug", primaryMuscle: "Traps", secondaryMuscles: ["Forearms"], category: "isolation" },
  { name: "Power Clean", primaryMuscle: "Traps", secondaryMuscles: ["Shoulders", "Quads", "Hamstrings", "Glutes"], category: "compound" },
];

export function searchExercises(query: string): ExerciseAsset[] {
  const q = query.toLowerCase();
  return EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.primaryMuscle.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.secondaryMuscles.some((m) => m.toLowerCase().includes(q))
  );
}

export function getExerciseByName(name: string): ExerciseAsset | undefined {
  return EXERCISES.find((e) => e.name === name);
}
