export type TemplateExercise = {
  id: string;
  exerciseId: string;
  sortOrder: number;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  notes?: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  dayOfWeek?: number; // 0=Sun .. 6=Sat
  exercises: TemplateExercise[];
  createdAt: string;
};

export type WorkoutSession = {
  id: string;
  templateId?: string;
  name: string;
  date: string; // YYYY-MM-DD
  startedAt: string; // ISO datetime
  completedAt?: string; // ISO datetime
  notes?: string;
};

export type ProgrammingState = {
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
};
