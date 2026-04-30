import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbBook } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { LessonCard } from "@/components/education/LessonCard";
import { LessonView } from "@/components/education/LessonView";
import { useEducationStore } from "@/store/educationStore";
import { EDUCATION_LESSONS } from "@/constants";
import type { EducationLesson } from "@/types";

export function EducationPage() {
  const { t } = useTranslation();
  const [activeLesson, setActiveLesson] = useState<EducationLesson | null>(
    null,
  );
  const getCompletedCount = useEducationStore((s) => s.getCompletedCount);
  const completedCount = getCompletedCount();

  if (activeLesson) {
    return (
      <LessonView lesson={activeLesson} onClose={() => setActiveLesson(null)} />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      <PageHeader
        title={t("education.title")}
        subtitle={t("education.subtitle")}
      />

      {/* Progress Overview */}
      <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-white/60 dark:from-indigo-500/5 dark:to-white/[0.04] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
              {t("education.progress")}
            </p>
            <p className="font-arabic text-xs text-neutral-muted">
              {t("education.completedOf", {
                completed: completedCount,
                total: EDUCATION_LESSONS.length,
              })}
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-indigo-500/15 flex items-center justify-center">
            <span className="font-arabic text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round((completedCount / EDUCATION_LESSONS.length) * 100)}%
            </span>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-neutral-bg dark:bg-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(completedCount / EDUCATION_LESSONS.length) * 100}%`,
            }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-indigo-500"
          />
        </div>
      </div>

      {/* Lesson Grid */}
      {EDUCATION_LESSONS.length === 0 ? (
        <EmptyState
          icon={TbBook}
          title={t("education.noLessons")}
          description={t("education.noLessonsDesc")}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EDUCATION_LESSONS.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onStart={() => setActiveLesson(lesson)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
