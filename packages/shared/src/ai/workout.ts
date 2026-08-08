import { parseISO, subDays } from "date-fns";
import { filterSetsInRange, normalizeVolumeKg } from "../utils/performanceUtils";
import type { GymState } from "../constants/gymConstants";
import type { PerformanceState } from "../types/performanceTypes";

export type WorkoutSuggestionExercise = {
  name: string;
  sets: number;
  reps: number;
  notes?: string;
};

export type WorkoutSuggestion = {
  focus: string;
  summary: string;
  exercises: WorkoutSuggestionExercise[];
};

export const WORKOUT_SUGGESTION_PROMPT = `You are a strength coach. Given a trainee's recent training data, propose the next workout.

Respond with ONLY a JSON object (no markdown, no commentary) in this exact shape:
{
  "focus": "One muscle focus, e.g. 'Back' or 'Push'",
  "summary": "One or two sentences explaining the choice",
  "exercises": [
    { "name": "Exercise Name", "sets": 0, "reps": 0, "notes": "Optional coaching note" }
  ]
}

Rules:
- Pick a focus that was NOT trained heavily in the last 24 hours.
- Prefer exercises from the provided catalog that match the available equipment.
- Recommend 4 to 6 exercises.
- Use the provided training volume by muscle to spread the workload.`;

export type WorkoutContextInput = {
  performance: PerformanceState;
  gym: GymState;
  today?: string;
};

export function buildWorkoutContext(input: WorkoutContextInput): string {
  const {
    performance,
    gym,
    today = new Date().toISOString().slice(0, 10),
  } = input;

  const exerciseById = new Map(performance.exercises.map((e) => [e.id, e]));
  const muscleNameById = new Map(
    performance.muscleGroups.map((m) => [m.id, m.name]),
  );

  const myEquipment = gym.equipmentCatalog
    .filter((eq) => gym.myEquipmentIds.includes(eq.id))
    .map((eq) => eq.name);

  const last7 = filterSetsInRange(
    performance.sets,
    subDays(parseISO(today), 6),
    parseISO(today),
  );

  const volumeByMuscle = new Map<string, number>();
  for (const s of last7) {
    const ex = exerciseById.get(s.exerciseId);
    const muscle = ex ? (muscleNameById.get(ex.muscleGroupId) ?? ex.muscleGroupId) : s.exerciseId;
    volumeByMuscle.set(
      muscle,
      (volumeByMuscle.get(muscle) ?? 0) + normalizeVolumeKg(s.weight, s.unit, s.reps),
    );
  }
  const volumeLines = [...volumeByMuscle.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([muscle, v]) => `${muscle}: ${Math.round(v)}kg`)
    .join(", ");

  const todaysLines = performance.sets
    .filter((s) => s.date === today)
    .map((s) => {
      const name = exerciseById.get(s.exerciseId)?.name ?? s.exerciseId;
      return `- ${name}: ${s.weight}${s.unit} x ${s.reps}`;
    });

  return [
    `Today (${today}) the trainee did:`,
    todaysLines.length ? todaysLines.join("\n") : "(nothing yet)",
    `Available equipment: ${myEquipment.length ? myEquipment.join(", ") : "(unknown)"}`,
    `Training volume (kg) last 7 days by muscle: ${volumeLines || "(none)"}`,
    `Exercise catalog: ${performance.exercises.map((e) => e.name).join(", ")}`,
  ].join("\n\n");
}

function asStr(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asPosInt(value: unknown, fallback: number): number {
  const n =
    typeof value === "string"
      ? Number.parseInt(value, 10)
      : typeof value === "number"
        ? value
        : Number.NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function normalizeWorkoutSuggestion(raw: unknown): WorkoutSuggestion {
  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      /* use raw string fallback below */
    }
  }
  if (typeof parsed !== "object" || parsed === null) {
    return { focus: "", summary: "", exercises: [] };
  }

  const obj = parsed as Record<string, unknown>;

  const exercises = Array.isArray(obj.exercises)
    ? obj.exercises
        .map((value): WorkoutSuggestionExercise | null => {
          if (typeof value !== "object" || value === null) return null;
          const ex = value as Record<string, unknown>;
          const name = asStr(ex.name ?? ex.exercise);
          if (!name) return null;
          return {
            name,
            sets: asPosInt(ex.sets, 3),
            reps: asPosInt(ex.reps, 10),
            notes: asStr(ex.notes) || undefined,
          };
        })
        .filter((e): e is WorkoutSuggestionExercise => e !== null)
        .slice(0, 8)
    : [];

  return {
    focus: asStr(obj.focus ?? obj.focusArea ?? obj.muscleGroup),
    summary: asStr(obj.summary ?? obj.reason ?? obj.explanation),
    exercises,
  };
}
