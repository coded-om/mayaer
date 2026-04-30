import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EducationProgress } from "@/types";
import { EDUCATION_LESSONS } from "@/constants";
import { usePointsStore, POINT_VALUES } from "@/store/pointsStore";

interface EducationStore {
  progress: EducationProgress[];
  startLesson: (lessonId: string) => void;
  completeStep: (lessonId: string, stepId: string) => void;
  completeLesson: (lessonId: string) => void;
  getLessonProgress: (lessonId: string) => EducationProgress | undefined;
  getCompletedCount: () => number;
  getTotalPointsEarned: () => number;
}

export const useEducationStore = create<EducationStore>()(
  persist(
    (set, get) => ({
      progress: [],

      startLesson: (lessonId) => {
        const existing = get().progress.find((p) => p.lessonId === lessonId);
        if (existing) return;
        set((state) => ({
          progress: [
            ...state.progress,
            {
              lessonId,
              completedSteps: [],
              completed: false,
              startedAt: new Date().toISOString(),
            },
          ],
        }));
      },

      completeStep: (lessonId, stepId) => {
        set((state) => ({
          progress: state.progress.map((p) =>
            p.lessonId === lessonId && !p.completedSteps.includes(stepId)
              ? { ...p, completedSteps: [...p.completedSteps, stepId] }
              : p,
          ),
        }));
      },

      completeLesson: (lessonId) => {
        const existing = get().progress.find((p) => p.lessonId === lessonId);
        if (existing?.completed) return;

        set((state) => ({
          progress: state.progress.map((p) =>
            p.lessonId === lessonId
              ? { ...p, completed: true, completedAt: new Date().toISOString() }
              : p,
          ),
        }));

        const lesson = EDUCATION_LESSONS.find((l) => l.id === lessonId);
        if (lesson) {
          usePointsStore
            .getState()
            .addPoints(POINT_VALUES.COMPLETE_LESSON, "complete_lesson");
        }
      },

      getLessonProgress: (lessonId) => {
        return get().progress.find((p) => p.lessonId === lessonId);
      },

      getCompletedCount: () => {
        return get().progress.filter((p) => p.completed).length;
      },

      getTotalPointsEarned: () => {
        const completed = get().progress.filter((p) => p.completed);
        return completed.reduce((sum, p) => {
          const lesson = EDUCATION_LESSONS.find((l) => l.id === p.lessonId);
          return sum + (lesson?.pointsReward ?? 0);
        }, 0);
      },
    }),
    { name: "budget-buddy-education" },
  ),
);
