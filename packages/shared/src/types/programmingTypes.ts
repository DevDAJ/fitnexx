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
  dayOfWeek?: number;
  exercises: TemplateExercise[];
  createdAt: string;
};

export type WorkoutSession = {
  id: string;
  templateId?: string;
  name: string;
  date: string;
  startedAt: string;
  completedAt?: string;
  notes?: string;
};

export type ProgrammingState = {
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
};
