import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbCheck, TbPlayerPlay } from "react-icons/tb";
import type { EducationLesson, EducationProgress } from "@/types";

interface LessonCardProps {
  lesson: EducationLesson;
  progress?: EducationProgress;
  onStart: () => void;
}

export function LessonCard({ lesson, progress, onStart }: LessonCardProps) {
  const { t } = useTranslation();
  const isCompleted = progress?.completed;
  const stepsCompleted = progress?.completedSteps.length ?? 0;
  const totalSteps = lesson.steps.length;
  const progressPercent =
    totalSteps > 0 ? (stepsCompleted / totalSteps) * 100 : 0;

  const categoryColors: Record<string, string> = {
    saving: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    investing: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    budgeting: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    islamic_finance: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onStart}
      className="w-full text-start rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4 transition-all hover:bg-white/80 dark:hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block text-[10px] font-semibold font-arabic px-2 py-0.5 rounded-full mb-2 ${categoryColors[lesson.category] ?? "bg-gray-100 text-gray-600"}`}>
            {t(`education.${lesson.category}`)}
          </span>
          <h3 className="font-arabic text-sm font-semibold text-neutral-text dark:text-white truncate">
            {t(lesson.titleKey)}
          </h3>
          <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400 mt-0.5 line-clamp-2">
            {t(lesson.descriptionKey)}
          </p>
        </div>
        <div className="shrink-0">
          {isCompleted ? (
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TbCheck className="w-5 h-5 text-emerald-500" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <TbPlayerPlay className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-neutral-bg dark:bg-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
          />
        </div>
        <span className="font-arabic text-[10px] text-neutral-muted shrink-0">
          {stepsCompleted}/{totalSteps}
        </span>
        <span className="font-arabic text-[10px] text-amber-500 font-semibold shrink-0">
          +{lesson.pointsReward}
        </span>
      </div>
    </motion.button>
  );
}
