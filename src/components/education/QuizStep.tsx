import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbCheck, TbX } from "react-icons/tb";

interface QuizStepProps {
  options: string[];
  correctAnswer: number;
  onCorrect: () => void;
  isCompleted: boolean;
}

export function QuizStep({
  options,
  correctAnswer,
  onCorrect,
  isCompleted,
}: QuizStepProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selected === correctAnswer;

  const handleSelect = (idx: number) => {
    if (isCompleted || showResult) return;
    setSelected(idx);
    setShowResult(true);

    if (idx === correctAnswer) {
      setTimeout(() => onCorrect(), 1200);
    } else {
      setTimeout(() => {
        setShowResult(false);
        setSelected(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((optionKey, idx) => {
        const isSelected = selected === idx;
        const isCorrectOption = idx === correctAnswer;

        let optionClass =
          "border border-white/70 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.03]";

        if (showResult && isSelected) {
          optionClass = isCorrect
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-red-500 bg-red-500/10";
        } else if (showResult && isCorrectOption && !isCorrect) {
          optionClass = "border-emerald-500/50 bg-emerald-500/5";
        }

        return (
          <motion.button
            key={idx}
            whileTap={!showResult ? { scale: 0.98 } : undefined}
            onClick={() => handleSelect(idx)}
            disabled={isCompleted}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${optionClass} ${isCompleted ? "opacity-60" : ""}`}>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                showResult && isSelected
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-red-500 bg-red-500"
                  : "border-neutral-border dark:border-gray-600"
              }`}>
              {showResult && isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}>
                  {isCorrect ? (
                    <TbCheck className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <TbX className="w-3.5 h-3.5 text-white" />
                  )}
                </motion.div>
              )}
            </div>
            <span className="font-arabic text-sm text-neutral-text dark:text-gray-200 text-start">
              {t(optionKey)}
            </span>
          </motion.button>
        );
      })}

      {showResult && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-arabic text-xs font-semibold text-center pt-1 ${
            isCorrect ? "text-emerald-500" : "text-red-500"
          }`}>
          {isCorrect ? t("education.correct") : t("education.wrong")}
        </motion.p>
      )}
    </div>
  );
}
