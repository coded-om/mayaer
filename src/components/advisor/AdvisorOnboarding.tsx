import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { TbChevronRight, TbChevronLeft } from "react-icons/tb";
import type {
  AdvisorAnswers,
  AgeRange,
  InvestmentGoal,
  RiskTolerance,
} from "@/types/markets";
import { cn } from "@/lib/utils";

interface AdvisorOnboardingProps {
  onComplete: (answers: AdvisorAnswers) => void;
}

const AGE_RANGES: AgeRange[] = ["18-25", "26-35", "36-45", "46-55", "56+"];

const GOALS: InvestmentGoal[] = [
  "car",
  "marriage",
  "house",
  "education",
  "retirement",
  "emergency",
  "wealth",
];

const RISK_LEVELS: RiskTolerance[] = ["low", "medium", "high"];

export function AdvisorOnboarding({ onComplete }: AdvisorOnboardingProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [step, setStep] = useState(0);

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange>("26-35");
  const [goals, setGoals] = useState<InvestmentGoal[]>([]);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>("medium");
  const [hasExperience, setHasExperience] = useState(false);

  const toggleGoal = (g: InvestmentGoal) =>
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  const canNext =
    step === 0
      ? +monthlyIncome > 0 && +monthlyExpenses > 0
      : step === 1
        ? true
        : step === 2
          ? goals.length > 0
          : true;

  const handleSubmit = () => {
    onComplete({
      monthlyIncome: +monthlyIncome,
      monthlyExpenses: +monthlyExpenses,
      ageRange,
      goals,
      riskTolerance,
      hasExperience,
    });
  };

  const totalSteps = 4;

  const steps = [
    // Step 0: Income & Expenses
    <div key="income" className="space-y-4">
      <h3 className="font-arabic text-base font-semibold text-neutral-text dark:text-white">
        {t("advisor.onboarding.incomeTitle")}
      </h3>
      <div>
        <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
          {t("advisor.onboarding.monthlyIncome")}
        </label>
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-white/70 dark:border-white/[0.08] bg-white/50 dark:bg-white/5 font-arabic text-sm text-neutral-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="0.000 OMR"
          min={0}
          inputMode="decimal"
        />
      </div>
      <div>
        <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
          {t("advisor.onboarding.monthlyExpenses")}
        </label>
        <input
          type="number"
          value={monthlyExpenses}
          onChange={(e) => setMonthlyExpenses(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-white/70 dark:border-white/[0.08] bg-white/50 dark:bg-white/5 font-arabic text-sm text-neutral-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="0.000 OMR"
          min={0}
          inputMode="decimal"
        />
      </div>
    </div>,

    // Step 1: Age & Experience
    <div key="age" className="space-y-4">
      <h3 className="font-arabic text-base font-semibold text-neutral-text dark:text-white">
        {t("advisor.onboarding.ageTitle")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {AGE_RANGES.map((a) => (
          <button
            key={a}
            onClick={() => setAgeRange(a)}
            className={cn(
              "px-4 py-2.5 rounded-xl font-arabic text-sm border transition-colors",
              ageRange === a
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-white/50 dark:bg-white/5 text-neutral-muted border-white/70 dark:border-white/[0.08]",
            )}>
            {a}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="font-arabic text-sm text-neutral-muted block mb-2">
          {t("advisor.onboarding.experience")}
        </label>
        <div className="flex gap-2">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              onClick={() => setHasExperience(v)}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl font-arabic text-sm border transition-colors",
                hasExperience === v
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-white/50 dark:bg-white/5 text-neutral-muted border-white/70 dark:border-white/[0.08]",
              )}>
              {v ? t("common.yes") : t("common.no")}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 2: Goals
    <div key="goals" className="space-y-4">
      <h3 className="font-arabic text-base font-semibold text-neutral-text dark:text-white">
        {t("advisor.onboarding.goalsTitle")}
      </h3>
      <p className="font-arabic text-xs text-neutral-muted">
        {t("advisor.onboarding.goalsSubtitle")}
      </p>
      <div className="flex flex-wrap gap-2">
        {GOALS.map((g) => (
          <button
            key={g}
            onClick={() => toggleGoal(g)}
            className={cn(
              "px-4 py-2.5 rounded-xl font-arabic text-sm border transition-colors",
              goals.includes(g)
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-white/50 dark:bg-white/5 text-neutral-muted border-white/70 dark:border-white/[0.08]",
            )}>
            {t(`advisor.goals.${g}`)}
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Risk Tolerance
    <div key="risk" className="space-y-4">
      <h3 className="font-arabic text-base font-semibold text-neutral-text dark:text-white">
        {t("advisor.onboarding.riskTitle")}
      </h3>
      <div className="space-y-2">
        {RISK_LEVELS.map((r) => (
          <button
            key={r}
            onClick={() => setRiskTolerance(r)}
            className={cn(
              "w-full p-4 rounded-xl border text-start transition-colors",
              riskTolerance === r
                ? "bg-primary/10 border-primary/30"
                : "bg-white/50 dark:bg-white/5 border-white/70 dark:border-white/[0.08]",
            )}>
            <p
              className={cn(
                "font-arabic text-sm font-semibold",
                riskTolerance === r
                  ? "text-primary"
                  : "text-neutral-text dark:text-white",
              )}>
              {t(`advisor.risk.${r}`)}
            </p>
            <p className="font-arabic text-xs text-neutral-muted mt-0.5">
              {t(`advisor.risk.${r}Desc`)}
            </p>
          </button>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-primary" : "bg-neutral-bg dark:bg-white/10",
            )}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
          transition={{ duration: 0.2 }}>
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-white/70 dark:border-white/[0.08] font-arabic text-sm text-neutral-muted hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
            {isRtl ? (
              <TbChevronRight className="w-4 h-4" />
            ) : (
              <TbChevronLeft className="w-4 h-4" />
            )}
            {t("common.back")}
          </button>
        )}
        <button
          onClick={
            step === totalSteps - 1 ? handleSubmit : () => setStep(step + 1)
          }
          disabled={!canNext}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl font-arabic text-sm font-semibold transition-colors",
            canNext
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-neutral-bg dark:bg-white/10 text-neutral-muted cursor-not-allowed",
          )}>
          {step === totalSteps - 1
            ? t("advisor.onboarding.generate")
            : t("common.next")}
          {step < totalSteps - 1 &&
            (isRtl ? (
              <TbChevronLeft className="w-4 h-4" />
            ) : (
              <TbChevronRight className="w-4 h-4" />
            ))}
        </button>
      </div>
    </div>
  );
}
