import type { Workout, WorkoutTemplate, Schedule } from "./types";

const DAY = 86400000;

function d(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * DAY).toISOString();
}

function w(
  id: string,
  date: string,
  title: string,
  exercises: Workout["exercises"],
  duration: number
): Workout {
  const totalVolume = exercises.reduce(
    (a, e) => a + e.sets.reduce((b, s) => b + s.weight * s.reps, 0),
    0
  );
  return { id, date, title, exercises, duration, totalVolume };
}

export const MOCK_WORKOUTS: Workout[] = [
  // Week 1 (recent)
  w("w1", d(1), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 80, reps: 8, setType: "warmup" },
        { weight: 100, reps: 6, setType: "topset", isPr: true, prTypes: ["weight"] },
        { weight: 90, reps: 8, setType: "normal" },
        { weight: 85, reps: 10, setType: "normal" },
        { weight: 80, reps: 10, setType: "backoff" },
      ],
    },
    {
      exerciseName: "Incline Dumbbell Press",
      sets: [
        { weight: 34, reps: 10, setType: "normal" },
        { weight: 34, reps: 9, setType: "normal" },
        { weight: 30, reps: 11, setType: "normal" },
      ],
    },
    {
      exerciseName: "Lateral Raise",
      sets: [
        { weight: 10, reps: 15, setType: "normal" },
        { weight: 10, reps: 14, setType: "normal" },
        { weight: 10, reps: 12, setType: "failure" },
      ],
    },
    {
      exerciseName: "Tricep Pushdown",
      sets: [
        { weight: 25, reps: 12, setType: "normal" },
        { weight: 25, reps: 11, setType: "normal" },
        { weight: 20, reps: 14, setType: "dropset" },
      ],
    },
  ], 65),

  w("w2", d(2), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 120, reps: 5, setType: "topset", isPr: true, prTypes: ["weight", "oneRm"] },
        { weight: 110, reps: 5, setType: "normal" },
      ],
    },
    {
      exerciseName: "Barbell Row",
      sets: [
        { weight: 70, reps: 8, setType: "normal" },
        { weight: 70, reps: 7, setType: "normal" },
        { weight: 65, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Lat Pulldown",
      sets: [
        { weight: 55, reps: 10, setType: "normal" },
        { weight: 55, reps: 9, setType: "normal" },
        { weight: 50, reps: 11, setType: "normal" },
      ],
    },
    {
      exerciseName: "Face Pull",
      sets: [
        { weight: 15, reps: 15, setType: "normal" },
        { weight: 15, reps: 14, setType: "normal" },
        { weight: 15, reps: 13, setType: "normal" },
      ],
    },
  ], 70),

  w("w3", d(4), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 100, reps: 6, setType: "topset" },
        { weight: 95, reps: 7, setType: "normal" },
        { weight: 90, reps: 8, setType: "normal" },
        { weight: 85, reps: 10, setType: "backoff" },
      ],
    },
    {
      exerciseName: "Romanian Deadlift",
      sets: [
        { weight: 80, reps: 10, setType: "normal" },
        { weight: 80, reps: 9, setType: "normal" },
        { weight: 75, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Leg Extension",
      sets: [
        { weight: 40, reps: 12, setType: "normal" },
        { weight: 40, reps: 11, setType: "normal" },
        { weight: 35, reps: 14, setType: "dropset" },
      ],
    },
    {
      exerciseName: "Calf Raise",
      sets: [
        { weight: 50, reps: 15, setType: "normal" },
        { weight: 50, reps: 14, setType: "normal" },
        { weight: 50, reps: 13, setType: "failure" },
      ],
    },
  ], 75),

  // Week 2
  w("w4", d(7), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 75, reps: 8, setType: "warmup" },
        { weight: 95, reps: 7, setType: "topset" },
        { weight: 87, reps: 9, setType: "normal" },
        { weight: 82, reps: 10, setType: "normal" },
        { weight: 78, reps: 11, setType: "backoff" },
      ],
    },
    {
      exerciseName: "Dumbbell Shoulder Press",
      sets: [
        { weight: 24, reps: 10, setType: "normal" },
        { weight: 24, reps: 9, setType: "normal" },
        { weight: 22, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Cable Fly",
      sets: [
        { weight: 12, reps: 14, setType: "normal" },
        { weight: 12, reps: 12, setType: "normal" },
        { weight: 10, reps: 15, setType: "normal" },
      ],
    },
  ], 60),

  w("w5", d(8), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 115, reps: 5, setType: "topset" },
        { weight: 105, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Pull Up",
      sets: [
        { weight: 0, reps: 12, setType: "normal", isPr: true, prTypes: ["reps"] },
        { weight: 0, reps: 10, setType: "normal" },
        { weight: 0, reps: 9, setType: "failure" },
      ],
    },
    {
      exerciseName: "Seated Cable Row",
      sets: [
        { weight: 50, reps: 10, setType: "normal" },
        { weight: 50, reps: 9, setType: "normal" },
        { weight: 45, reps: 11, setType: "normal" },
      ],
    },
    {
      exerciseName: "Barbell Curl",
      sets: [
        { weight: 25, reps: 10, setType: "normal" },
        { weight: 25, reps: 9, setType: "normal" },
        { weight: 20, reps: 12, setType: "dropset" },
      ],
    },
  ], 65),

  w("w6", d(10), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 97, reps: 7, setType: "topset" },
        { weight: 92, reps: 8, setType: "normal" },
        { weight: 87, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Bulgarian Split Squat",
      sets: [
        { weight: 20, reps: 10, setType: "normal" },
        { weight: 20, reps: 10, setType: "normal" },
        { weight: 18, reps: 12, setType: "normal" },
      ],
    },
    {
      exerciseName: "Leg Curl",
      sets: [
        { weight: 30, reps: 12, setType: "normal" },
        { weight: 30, reps: 11, setType: "normal" },
        { weight: 28, reps: 12, setType: "normal" },
      ],
    },
  ], 70),

  // Week 3
  w("w7", d(14), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 75, reps: 8, setType: "warmup" },
        { weight: 92, reps: 8, setType: "topset" },
        { weight: 85, reps: 9, setType: "normal" },
        { weight: 80, reps: 10, setType: "normal" },
        { weight: 75, reps: 12, setType: "backoff" },
      ],
    },
    {
      exerciseName: "Incline Barbell Press",
      sets: [
        { weight: 60, reps: 8, setType: "normal" },
        { weight: 60, reps: 7, setType: "normal" },
        { weight: 55, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Lateral Raise",
      sets: [
        { weight: 9, reps: 15, setType: "normal" },
        { weight: 9, reps: 14, setType: "normal" },
        { weight: 9, reps: 13, setType: "normal" },
      ],
    },
    {
      exerciseName: "Skull Crusher",
      sets: [
        { weight: 20, reps: 12, setType: "normal" },
        { weight: 20, reps: 10, setType: "normal" },
        { weight: 18, reps: 11, setType: "normal" },
      ],
    },
  ], 62),

  w("w8", d(15), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 112, reps: 6, setType: "topset" },
        { weight: 102, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Barbell Row",
      sets: [
        { weight: 68, reps: 8, setType: "normal" },
        { weight: 68, reps: 7, setType: "normal" },
        { weight: 63, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Lat Pulldown",
      sets: [
        { weight: 52, reps: 10, setType: "normal" },
        { weight: 52, reps: 9, setType: "normal" },
        { weight: 48, reps: 11, setType: "normal" },
      ],
    },
    {
      exerciseName: "Hammer Curl",
      sets: [
        { weight: 14, reps: 12, setType: "normal" },
        { weight: 14, reps: 10, setType: "normal" },
        { weight: 12, reps: 12, setType: "normal" },
      ],
    },
  ], 68),

  w("w9", d(17), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 95, reps: 7, setType: "topset" },
        { weight: 90, reps: 8, setType: "normal" },
        { weight: 85, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Romanian Deadlift",
      sets: [
        { weight: 78, reps: 10, setType: "normal" },
        { weight: 78, reps: 9, setType: "normal" },
        { weight: 73, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Hip Thrust",
      sets: [
        { weight: 60, reps: 12, setType: "normal" },
        { weight: 60, reps: 11, setType: "normal" },
        { weight: 55, reps: 12, setType: "normal" },
      ],
    },
    {
      exerciseName: "Seated Calf Raise",
      sets: [
        { weight: 30, reps: 15, setType: "normal" },
        { weight: 30, reps: 14, setType: "normal" },
        { weight: 30, reps: 13, setType: "normal" },
      ],
    },
  ], 72),

  // Week 4
  w("w10", d(21), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 70, reps: 8, setType: "warmup" },
        { weight: 90, reps: 8, setType: "topset" },
        { weight: 82, reps: 10, setType: "normal" },
        { weight: 78, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Dumbbell Bench Press",
      sets: [
        { weight: 28, reps: 10, setType: "normal" },
        { weight: 28, reps: 9, setType: "normal" },
        { weight: 26, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Arnold Press",
      sets: [
        { weight: 18, reps: 10, setType: "normal" },
        { weight: 18, reps: 9, setType: "normal" },
        { weight: 16, reps: 11, setType: "normal" },
      ],
    },
    {
      exerciseName: "Overhead Tricep Extension",
      sets: [
        { weight: 18, reps: 12, setType: "normal" },
        { weight: 18, reps: 11, setType: "normal" },
        { weight: 16, reps: 12, setType: "normal" },
      ],
    },
  ], 58),

  w("w11", d(22), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 110, reps: 6, setType: "topset" },
        { weight: 100, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Dumbbell Row",
      sets: [
        { weight: 30, reps: 10, setType: "normal" },
        { weight: 30, reps: 9, setType: "normal" },
        { weight: 28, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Straight Arm Pulldown",
      sets: [
        { weight: 20, reps: 14, setType: "normal" },
        { weight: 20, reps: 12, setType: "normal" },
        { weight: 18, reps: 14, setType: "normal" },
      ],
    },
    {
      exerciseName: "Preacher Curl",
      sets: [
        { weight: 22, reps: 10, setType: "normal" },
        { weight: 22, reps: 9, setType: "normal" },
        { weight: 20, reps: 10, setType: "normal" },
      ],
    },
  ], 62),

  w("w12", d(24), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 92, reps: 8, setType: "topset" },
        { weight: 87, reps: 8, setType: "normal" },
        { weight: 82, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Leg Press",
      sets: [
        { weight: 140, reps: 12, setType: "normal" },
        { weight: 140, reps: 11, setType: "normal" },
        { weight: 130, reps: 12, setType: "normal" },
      ],
    },
    {
      exerciseName: "Leg Extension",
      sets: [
        { weight: 38, reps: 12, setType: "normal" },
        { weight: 38, reps: 11, setType: "normal" },
        { weight: 35, reps: 13, setType: "dropset" },
      ],
    },
    {
      exerciseName: "Calf Raise",
      sets: [
        { weight: 48, reps: 15, setType: "normal" },
        { weight: 48, reps: 14, setType: "normal" },
        { weight: 48, reps: 12, setType: "failure" },
      ],
    },
  ], 68),

  // Weeks 5-8 (older, lighter)
  w("w13", d(28), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 67, reps: 8, setType: "warmup" },
        { weight: 87, reps: 8, setType: "topset" },
        { weight: 80, reps: 10, setType: "normal" },
        { weight: 75, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Lateral Raise",
      sets: [
        { weight: 8, reps: 15, setType: "normal" },
        { weight: 8, reps: 14, setType: "normal" },
        { weight: 8, reps: 12, setType: "normal" },
      ],
    },
  ], 52),

  w("w14", d(29), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 107, reps: 5, setType: "topset" },
        { weight: 97, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Pull Up",
      sets: [
        { weight: 0, reps: 11, setType: "normal" },
        { weight: 0, reps: 9, setType: "normal" },
        { weight: 0, reps: 8, setType: "failure" },
      ],
    },
    {
      exerciseName: "Barbell Curl",
      sets: [
        { weight: 22, reps: 10, setType: "normal" },
        { weight: 22, reps: 9, setType: "normal" },
        { weight: 20, reps: 10, setType: "normal" },
      ],
    },
  ], 58),

  w("w15", d(31), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 90, reps: 8, setType: "topset" },
        { weight: 85, reps: 8, setType: "normal" },
        { weight: 80, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Romanian Deadlift",
      sets: [
        { weight: 75, reps: 10, setType: "normal" },
        { weight: 75, reps: 9, setType: "normal" },
        { weight: 70, reps: 10, setType: "normal" },
      ],
    },
  ], 60),

  w("w16", d(35), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 65, reps: 8, setType: "warmup" },
        { weight: 85, reps: 9, setType: "topset" },
        { weight: 78, reps: 10, setType: "normal" },
        { weight: 73, reps: 11, setType: "normal" },
      ],
    },
    {
      exerciseName: "Incline Dumbbell Press",
      sets: [
        { weight: 30, reps: 10, setType: "normal" },
        { weight: 30, reps: 9, setType: "normal" },
        { weight: 28, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Tricep Pushdown",
      sets: [
        { weight: 22, reps: 12, setType: "normal" },
        { weight: 22, reps: 11, setType: "normal" },
        { weight: 20, reps: 12, setType: "normal" },
      ],
    },
  ], 55),

  w("w17", d(36), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 105, reps: 5, setType: "topset" },
        { weight: 95, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Barbell Row",
      sets: [
        { weight: 65, reps: 8, setType: "normal" },
        { weight: 65, reps: 7, setType: "normal" },
        { weight: 60, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Lat Pulldown",
      sets: [
        { weight: 50, reps: 10, setType: "normal" },
        { weight: 50, reps: 9, setType: "normal" },
        { weight: 45, reps: 11, setType: "normal" },
      ],
    },
  ], 60),

  w("w18", d(38), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 88, reps: 8, setType: "topset" },
        { weight: 83, reps: 9, setType: "normal" },
        { weight: 78, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Leg Curl",
      sets: [
        { weight: 28, reps: 12, setType: "normal" },
        { weight: 28, reps: 11, setType: "normal" },
        { weight: 25, reps: 12, setType: "normal" },
      ],
    },
    {
      exerciseName: "Calf Raise",
      sets: [
        { weight: 45, reps: 15, setType: "normal" },
        { weight: 45, reps: 14, setType: "normal" },
        { weight: 45, reps: 12, setType: "normal" },
      ],
    },
  ], 65),

  // Weeks 9-12
  w("w19", d(42), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 62, reps: 8, setType: "warmup" },
        { weight: 82, reps: 9, setType: "topset" },
        { weight: 75, reps: 10, setType: "normal" },
        { weight: 70, reps: 11, setType: "normal" },
      ],
    },
    {
      exerciseName: "Dumbbell Shoulder Press",
      sets: [
        { weight: 22, reps: 10, setType: "normal" },
        { weight: 22, reps: 9, setType: "normal" },
        { weight: 20, reps: 10, setType: "normal" },
      ],
    },
  ], 50),

  w("w20", d(43), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 102, reps: 5, setType: "topset" },
        { weight: 92, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Seated Cable Row",
      sets: [
        { weight: 48, reps: 10, setType: "normal" },
        { weight: 48, reps: 9, setType: "normal" },
        { weight: 43, reps: 11, setType: "normal" },
      ],
    },
  ], 55),

  w("w21", d(45), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 85, reps: 8, setType: "topset" },
        { weight: 80, reps: 9, setType: "normal" },
        { weight: 75, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Bulgarian Split Squat",
      sets: [
        { weight: 18, reps: 10, setType: "normal" },
        { weight: 18, reps: 10, setType: "normal" },
        { weight: 16, reps: 12, setType: "normal" },
      ],
    },
  ], 58),

  w("w22", d(49), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 60, reps: 8, setType: "warmup" },
        { weight: 80, reps: 10, setType: "topset" },
        { weight: 73, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Cable Fly",
      sets: [
        { weight: 10, reps: 14, setType: "normal" },
        { weight: 10, reps: 12, setType: "normal" },
      ],
    },
  ], 48),

  w("w23", d(50), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 100, reps: 5, setType: "topset" },
        { weight: 90, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Barbell Row",
      sets: [
        { weight: 62, reps: 8, setType: "normal" },
        { weight: 62, reps: 7, setType: "normal" },
        { weight: 57, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Face Pull",
      sets: [
        { weight: 12, reps: 15, setType: "normal" },
        { weight: 12, reps: 14, setType: "normal" },
      ],
    },
  ], 55),

  w("w24", d(52), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 82, reps: 9, setType: "topset" },
        { weight: 77, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Leg Extension",
      sets: [
        { weight: 35, reps: 12, setType: "normal" },
        { weight: 35, reps: 11, setType: "normal" },
      ],
    },
    {
      exerciseName: "Hip Thrust",
      sets: [
        { weight: 55, reps: 12, setType: "normal" },
        { weight: 55, reps: 10, setType: "normal" },
      ],
    },
  ], 55),

  // Weeks 13+ (older baseline)
  w("w25", d(56), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 60, reps: 8, setType: "warmup" },
        { weight: 78, reps: 10, setType: "topset" },
        { weight: 70, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Lateral Raise",
      sets: [
        { weight: 7, reps: 15, setType: "normal" },
        { weight: 7, reps: 14, setType: "normal" },
      ],
    },
  ], 45),

  w("w26", d(57), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 97, reps: 5, setType: "topset" },
        { weight: 87, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Pull Up",
      sets: [
        { weight: 0, reps: 10, setType: "normal" },
        { weight: 0, reps: 8, setType: "normal" },
      ],
    },
    {
      exerciseName: "Hammer Curl",
      sets: [
        { weight: 12, reps: 12, setType: "normal" },
        { weight: 12, reps: 10, setType: "normal" },
      ],
    },
  ], 52),

  w("w27", d(59), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 80, reps: 9, setType: "topset" },
        { weight: 75, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Romanian Deadlift",
      sets: [
        { weight: 70, reps: 10, setType: "normal" },
        { weight: 70, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Calf Raise",
      sets: [
        { weight: 40, reps: 15, setType: "normal" },
        { weight: 40, reps: 14, setType: "normal" },
      ],
    },
  ], 55),

  w("w28", d(63), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 57, reps: 8, setType: "warmup" },
        { weight: 75, reps: 10, setType: "topset" },
        { weight: 68, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Skull Crusher",
      sets: [
        { weight: 16, reps: 12, setType: "normal" },
        { weight: 16, reps: 10, setType: "normal" },
      ],
    },
  ], 42),

  w("w29", d(64), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 95, reps: 5, setType: "topset" },
        { weight: 85, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Dumbbell Row",
      sets: [
        { weight: 26, reps: 10, setType: "normal" },
        { weight: 26, reps: 9, setType: "normal" },
      ],
    },
  ], 50),

  w("w30", d(66), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 78, reps: 10, setType: "topset" },
        { weight: 73, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Leg Press",
      sets: [
        { weight: 120, reps: 12, setType: "normal" },
        { weight: 120, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Leg Curl",
      sets: [
        { weight: 25, reps: 12, setType: "normal" },
        { weight: 25, reps: 10, setType: "normal" },
      ],
    },
  ], 55),

  w("w31", d(70), "Push Day", [
    {
      exerciseName: "Barbell Bench Press",
      sets: [
        { weight: 55, reps: 8, setType: "warmup" },
        { weight: 72, reps: 10, setType: "topset" },
        { weight: 65, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Incline Barbell Press",
      sets: [
        { weight: 52, reps: 8, setType: "normal" },
        { weight: 52, reps: 7, setType: "normal" },
      ],
    },
  ], 45),

  w("w32", d(71), "Pull Day", [
    {
      exerciseName: "Deadlift",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 92, reps: 5, setType: "topset" },
        { weight: 82, reps: 6, setType: "normal" },
      ],
    },
    {
      exerciseName: "Lat Pulldown",
      sets: [
        { weight: 45, reps: 10, setType: "normal" },
        { weight: 45, reps: 9, setType: "normal" },
      ],
    },
    {
      exerciseName: "Barbell Curl",
      sets: [
        { weight: 20, reps: 10, setType: "normal" },
        { weight: 20, reps: 9, setType: "normal" },
      ],
    },
  ], 52),

  w("w33", d(73), "Leg Day", [
    {
      exerciseName: "Barbell Squat",
      sets: [
        { weight: 60, reps: 5, setType: "warmup" },
        { weight: 75, reps: 10, setType: "topset" },
        { weight: 70, reps: 10, setType: "normal" },
      ],
    },
    {
      exerciseName: "Hip Thrust",
      sets: [
        { weight: 50, reps: 12, setType: "normal" },
        { weight: 50, reps: 10, setType: "normal" },
      ],
    },
  ], 50),
];

export const MOCK_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "tpl_push",
    name: "Push Day",
    exercises: [
      { exerciseName: "Barbell Bench Press", targetSets: 4, targetReps: 8 },
      { exerciseName: "Incline Dumbbell Press", targetSets: 3, targetReps: 10 },
      { exerciseName: "Lateral Raise", targetSets: 3, targetReps: 14 },
      { exerciseName: "Tricep Pushdown", targetSets: 3, targetReps: 12 },
    ],
  },
  {
    id: "tpl_pull",
    name: "Pull Day",
    exercises: [
      { exerciseName: "Deadlift", targetSets: 3, targetReps: 5 },
      { exerciseName: "Barbell Row", targetSets: 3, targetReps: 8 },
      { exerciseName: "Lat Pulldown", targetSets: 3, targetReps: 10 },
      { exerciseName: "Face Pull", targetSets: 3, targetReps: 15 },
    ],
  },
  {
    id: "tpl_legs",
    name: "Leg Day",
    exercises: [
      { exerciseName: "Barbell Squat", targetSets: 4, targetReps: 8 },
      { exerciseName: "Romanian Deadlift", targetSets: 3, targetReps: 10 },
      { exerciseName: "Leg Extension", targetSets: 3, targetReps: 12 },
      { exerciseName: "Calf Raise", targetSets: 3, targetReps: 15 },
    ],
  },
  {
    id: "tpl_upper",
    name: "Upper Body",
    exercises: [
      { exerciseName: "Barbell Bench Press", targetSets: 4, targetReps: 8 },
      { exerciseName: "Barbell Row", targetSets: 3, targetReps: 8 },
      { exerciseName: "Overhead Press", targetSets: 3, targetReps: 10 },
      { exerciseName: "Lat Pulldown", targetSets: 3, targetReps: 10 },
      { exerciseName: "Barbell Curl", targetSets: 3, targetReps: 12 },
      { exerciseName: "Tricep Pushdown", targetSets: 3, targetReps: 12 },
    ],
  },
  {
    id: "tpl_lower",
    name: "Lower Body",
    exercises: [
      { exerciseName: "Barbell Squat", targetSets: 4, targetReps: 8 },
      { exerciseName: "Romanian Deadlift", targetSets: 3, targetReps: 10 },
      { exerciseName: "Leg Extension", targetSets: 3, targetReps: 12 },
      { exerciseName: "Leg Curl", targetSets: 3, targetReps: 12 },
      { exerciseName: "Calf Raise", targetSets: 3, targetReps: 15 },
      { exerciseName: "Cable Crunch", targetSets: 3, targetReps: 15 },
    ],
  },
];

export const MOCK_SCHEDULE: Schedule = {
  id: "sched_ppl",
  name: "Push / Pull / Legs",
  split: "push_pull_legs",
  days: [
    { dayOfWeek: 1, templateId: "tpl_push", label: "Push Day" },
    { dayOfWeek: 3, templateId: "tpl_pull", label: "Pull Day" },
    { dayOfWeek: 5, templateId: "tpl_legs", label: "Leg Day" },
  ],
};
