"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PROGRAMMING_STORAGE_KEY } from "@/constants/programmingConstants";
import { createIndexedDbStorage } from "@/stores/indexedDbStorage";
import type {
  ProgrammingState,
  TemplateExercise,
  WorkoutSession,
  WorkoutTemplate,
} from "@/types/programmingTypes";

type ProgrammingStore = ProgrammingState & {
  addTemplate: (template: WorkoutTemplate) => void;
  updateTemplate: (id: string, updater: (t: WorkoutTemplate) => WorkoutTemplate) => void;
  removeTemplate: (id: string) => void;
  addSession: (session: WorkoutSession) => void;
  updateSession: (id: string, updater: (s: WorkoutSession) => WorkoutSession) => void;
  completeSession: (id: string) => void;
  getActiveSessions: () => WorkoutSession[];
  getSessionsForDate: (date: string) => WorkoutSession[];
  generateSessionId: () => string;
  generateTemplateId: () => string;
  makeTemplateExercise: (exerciseId: string, sortOrder?: number) => TemplateExercise;
};

export const useProgrammingStore = create<ProgrammingStore>()(
  persist(
    (set, get) => ({
      templates: [],
      sessions: [],

      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),

      updateTemplate: (id, updater) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? updater(t) : t,
          ),
        })),

      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      addSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),

      updateSession: (id, updater) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? updater(s) : s,
          ),
        })),

      completeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? { ...s, completedAt: new Date().toISOString() }
              : s,
          ),
        })),

      getActiveSessions: () => {
        return get().sessions.filter((s) => !s.completedAt);
      },

      getSessionsForDate: (date) => {
        return get().sessions.filter((s) => s.date === date);
      },

      generateSessionId: () => `session-${crypto.randomUUID()}`,
      generateTemplateId: () => `template-${crypto.randomUUID()}`,

      makeTemplateExercise: (exerciseId, sortOrder = 0) => ({
        id: `te-${crypto.randomUUID()}`,
        exerciseId,
        sortOrder,
      }),
    }),
    {
      name: PROGRAMMING_STORAGE_KEY,
      storage: createJSONStorage(createIndexedDbStorage),
      partialize: (state) => ({
        templates: state.templates,
        sessions: state.sessions,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<ProgrammingState>),
      }),
    },
  ),
);
