import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  TbArrowLeft,
  TbArrowRight,
  TbCheck,
  TbBulb,
  TbQuestionMark,
} from "react-icons/tb";
import type { EducationLesson } from "@/types";
import { useEducationStore } from "@/store/educationStore";
import { QuizStep } from "./QuizStep";

interface LessonViewProps {
  lesson: EducationLesson;
  onClose: () => void;
}

export function LessonView({ lesson, onClose }: LessonViewProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { startLesson, completeStep, completeLesson, getLessonProgress } =
    useEducationStore();
  const progress = getLessonProgress(lesson.id);
  const [currentStepIdx, setCurrentStepIdx] = useState(() => {
    if (!progress) return 0;
    // Find first non-completed step
    const idx = lesson.steps.findIndex(
      (s) => !progress.completedSteps.includes(s.id),
    );
    return idx >= 0 ? idx : 0;
  });
  const [lessonDone, setLessonDone] = useState(progress?.completed ?? false);

  const currentStep = lesson.steps[currentStepIdx];
  const isLastStep = currentStepIdx === lesson.steps.length - 1;
  const isStepCompleted = progress?.completedSteps.includes(currentStep.id);

  const handleStartIfNeeded = () => {
    if (!progress) startLesson(lesson.id);
  };

  const handleNext = () => {
    handleStartIfNeeded();
    completeStep(lesson.id, currentStep.id);
    if (isLastStep) {
      completeLesson(lesson.id);
      setLessonDone(true);
    } else {
      setCurrentStepIdx((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) setCurrentStepIdx((i) => i - 1);
  };

  if (lessonDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
          <TbCheck className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="font-arabic text-lg font-bold text-neutral-text dark:text-white mb-1">
          {t("education.lessonComplete")}
        </h2>
        <p className="font-arabic text-sm text-amber-500 font-semibold mb-6">
          {t("education.earnedPoints", { points: lesson.pointsReward })}
        </p>
        <button
          onClick={onClose}
          className="font-arabic text-sm font-semibold text-primary hover:underline">
          {t("education.backToLessons")}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-neutral-muted hover:text-neutral-text dark:hover:text-white transition-colors">
          {isRtl ? (
            <TbArrowRight className="w-5 h-5" />
          ) : (
            <TbArrowLeft className="w-5 h-5" />
          )}
        </button>
        <span className="font-arabic text-xs text-neutral-muted">
          {t("education.step")} {currentStepIdx + 1} {t("education.of")}{" "}
          {lesson.steps.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center">
        {lesson.steps.map((step, idx) => (
          <div
            key={step.id}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentStepIdx
                ? "w-6 bg-primary"
                : idx < currentStepIdx ||
                    progress?.completedSteps.includes(step.id)
                  ? "w-3 bg-primary/40"
                  : "w-3 bg-neutral-bg dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-5 min-h-[200px]">
          {currentStep.type === "text" && (
            <p className="font-arabic text-sm text-neutral-text dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {t(currentStep.contentKey)}
            </p>
          )}

          {currentStep.type === "tip" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TbBulb className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="font-arabic text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {t("education.tip")}
                </span>
              </div>
              <p className="font-arabic text-sm text-neutral-text dark:text-gray-200 leading-relaxed">
                {t(currentStep.contentKey)}
              </p>
            </div>
          )}

          {currentStep.type === "quiz" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TbQuestionMark className="w-5 h-5 text-primary shrink-0" />
                <span className="font-arabic text-sm font-semibold text-primary">
                  {t("education.quiz")}
                </span>
              </div>
              <p className="font-arabic text-sm font-medium text-neutral-text dark:text-white">
                {t(currentStep.contentKey)}
              </p>
              <QuizStep
                options={currentStep.quizOptions ?? []}
                correctAnswer={currentStep.correctAnswer ?? 0}
                onCorrect={handleNext}
                isCompleted={!!isStepCompleted}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {currentStep.type !== "quiz" && (
        <div className="flex gap-3">
          {currentStepIdx > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 rounded-xl font-arabic text-sm font-semibold bg-neutral-bg dark:bg-white/5 text-neutral-text dark:text-white hover:bg-neutral-border dark:hover:bg-white/10 transition-colors">
              {t("education.previous")}
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-arabic text-sm font-semibold bg-primary text-white hover:bg-primary-700 transition-colors">
            {isLastStep ? t("education.finish") : t("education.next")}
          </button>
        </div>
      )}
    </div>
  );
}
