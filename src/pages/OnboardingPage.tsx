import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/store/profileStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useGoalsStore } from "@/store/goalsStore";
import { TbRobot, TbArrowRight, TbArrowLeft, TbCheck } from "react-icons/tb";

const TOTAL_STEPS = 6;

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
};

export function OnboardingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const existingName = useProfileStore((s) => s.name);
  const setName = useProfileStore((s) => s.setName);
  const setMonthlyIncome = useProfileStore((s) => s.setMonthlyIncome);
  const setSalaryDay = useProfileStore((s) => s.setSalaryDay);
  const setSavingsGoalPercent = useProfileStore((s) => s.setSavingsGoalPercent);
  const setOnboardingCompleted = useProfileStore(
    (s) => s.setOnboardingCompleted,
  );
  const setBudgetIncome = useBudgetStore((s) => s.setMonthlyIncome);
  const addGoal = useGoalsStore((s) => s.addGoal);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Form values
  const [nameVal, setNameVal] = useState(
    existingName && existingName !== "محمد" ? existingName : "",
  );
  const [incomeVal, setIncomeVal] = useState("");
  const [salaryDayVal, setSalaryDayVal] = useState(25);
  const [savingsPercent, setSavingsPercentVal] = useState(20);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  const resolvedName = nameVal.trim() || existingName;

  const canProceed = () => {
    if (step === 1) return nameVal.trim().length > 0;
    if (step === 2) return parseFloat(incomeVal) > 0;
    return true;
  };

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleComplete = () => {
    const income = parseFloat(incomeVal) || 0;
    setName(resolvedName);
    setMonthlyIncome(income);
    setBudgetIncome(income);
    setSalaryDay(salaryDayVal);
    setSavingsGoalPercent(savingsPercent);
    if (goalName.trim() && parseFloat(goalAmount) > 0) {
      addGoal({
        name: goalName.trim(),
        targetAmount: parseFloat(goalAmount),
        savedAmount: 0,
        icon: "🎯",
      });
    }
    setOnboardingCompleted(true);
    navigate("/dashboard", { replace: true });
  };

  const stepMessages: Record<number, string> = {
    1: t("onboarding.step1Msg"),
    2: t("onboarding.step2Msg").replace("{{name}}", resolvedName),
    3: t("onboarding.step3Msg"),
    4: t("onboarding.step4Msg"),
    5: t("onboarding.step5Msg"),
    6: t("onboarding.step6Msg"),
  };

  return (
    <div
      className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-center px-4 py-8"
      dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full max-w-sm">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-muted dark:text-white/40 font-arabic">
              {t("onboarding.step")} {step} {t("onboarding.of")} {TOTAL_STEPS}
            </span>
            <span className="text-xs font-semibold text-primary dark:text-emerald-400">
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Advisor bubble */}
        <div className="flex items-end gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(31,122,99,0.3)]">
            <TbRobot className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`msg-${step}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl rounded-bl-sm bg-white dark:bg-white/[0.06] border border-neutral-100 dark:border-white/[0.08] px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold text-primary dark:text-emerald-400 mb-1 font-arabic">
                {t("onboarding.advisorName")}
              </p>
              <p className="text-sm text-neutral-text dark:text-white font-arabic leading-relaxed whitespace-pre-line">
                {stepMessages[step]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Input area */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`input-${step}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.06 }}
            className="space-y-3">
            {/* Step 1 — Name */}
            {step === 1 && (
              <input
                autoFocus
                type="text"
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                placeholder={t("onboarding.step1Placeholder")}
                onKeyDown={(e) => e.key === "Enter" && canProceed() && goNext()}
                className="w-full rounded-2xl bg-white dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 px-4 py-3.5 text-neutral-text dark:text-white font-arabic text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-emerald-400/20 placeholder:text-neutral-muted dark:placeholder:text-white/30 transition-all"
              />
            )}

            {/* Step 2 — Income */}
            {step === 2 && (
              <div className="relative">
                <input
                  autoFocus
                  type="number"
                  inputMode="decimal"
                  value={incomeVal}
                  onChange={(e) => setIncomeVal(e.target.value)}
                  placeholder={t("onboarding.step2Placeholder")}
                  onKeyDown={(e) =>
                    e.key === "Enter" && canProceed() && goNext()
                  }
                  className="w-full rounded-2xl bg-white dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 px-4 py-3.5 pe-16 text-neutral-text dark:text-white font-arabic text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-emerald-400/20 placeholder:text-neutral-muted dark:placeholder:text-white/30 transition-all"
                />
                <span className="absolute top-1/2 -translate-y-1/2 end-4 text-xs text-neutral-muted dark:text-white/40 font-mono pointer-events-none">
                  ر.ع
                </span>
              </div>
            )}

            {/* Step 3 — Salary day grid */}
            {step === 3 && (
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <motion.button
                    key={day}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSalaryDayVal(day)}
                    className={`aspect-square rounded-xl text-xs font-bold transition-all ${
                      salaryDayVal === day
                        ? "bg-primary text-white shadow-[0_2px_8px_rgba(31,122,99,0.4)] scale-110"
                        : "bg-white dark:bg-white/[0.06] border border-neutral-200 dark:border-white/[0.08] text-neutral-text dark:text-white/70 hover:border-primary/50 hover:text-primary dark:hover:text-emerald-400"
                    }`}>
                    {day}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Step 4 — Savings percent slider */}
            {step === 4 && (
              <div className="space-y-4 py-2">
                <div className="flex items-baseline justify-center gap-2">
                  <motion.span
                    key={savingsPercent}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-bold text-5xl text-primary dark:text-emerald-400">
                    {savingsPercent}
                  </motion.span>
                  <span className="text-2xl font-bold text-primary dark:text-emerald-400">
                    %
                  </span>
                  <span className="font-arabic text-sm text-neutral-muted dark:text-white/40 self-end mb-1">
                    {t("onboarding.step4Suffix")}
                  </span>
                </div>
                {/* Estimated savings */}
                {parseFloat(incomeVal) > 0 && (
                  <p className="text-center text-xs text-neutral-muted dark:text-white/40 font-arabic">
                    ≈{" "}
                    {(
                      (parseFloat(incomeVal) * savingsPercent) /
                      100
                    ).toLocaleString()}{" "}
                    ر.ع / شهر
                  </p>
                )}
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={savingsPercent}
                  onChange={(e) => setSavingsPercentVal(Number(e.target.value))}
                  className="w-full cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-neutral-muted dark:text-white/30 font-mono">
                  <span>5%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            )}

            {/* Step 5 — Goal (skippable) */}
            {step === 5 && (
              <div className="space-y-2">
                <input
                  autoFocus
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder={t("onboarding.step5GoalName")}
                  className="w-full rounded-2xl bg-white dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 px-4 py-3.5 text-neutral-text dark:text-white font-arabic text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-emerald-400/20 placeholder:text-neutral-muted dark:placeholder:text-white/30 transition-all"
                />
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder={t("onboarding.step5GoalAmount")}
                    className="w-full rounded-2xl bg-white dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 px-4 py-3.5 pe-16 text-neutral-text dark:text-white font-arabic text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-emerald-400/20 placeholder:text-neutral-muted dark:placeholder:text-white/30 transition-all"
                  />
                  <span className="absolute top-1/2 -translate-y-1/2 end-4 text-xs text-neutral-muted dark:text-white/40 font-mono pointer-events-none">
                    ر.ع
                  </span>
                </div>
              </div>
            )}

            {/* Step 6 — Summary */}
            {step === 6 && (
              <div className="rounded-2xl bg-white dark:bg-white/[0.06] border border-neutral-100 dark:border-white/[0.08] divide-y divide-neutral-100 dark:divide-white/[0.06] overflow-hidden">
                {[
                  { label: t("onboarding.step6Name"), value: resolvedName },
                  {
                    label: t("onboarding.step6Income"),
                    value: `${parseFloat(incomeVal || "0").toLocaleString()} ${t("onboarding.step6IncomeUnit")}`,
                  },
                  {
                    label: t("onboarding.step6SalaryDay"),
                    value: `${salaryDayVal} ${t("onboarding.step6DayOfMonth")}`,
                  },
                  {
                    label: t("onboarding.step6Savings"),
                    value: `${savingsPercent}%`,
                  },
                  {
                    label: t("onboarding.step6Goal"),
                    value:
                      goalName.trim() && parseFloat(goalAmount) > 0
                        ? `${goalName} — ${parseFloat(goalAmount).toLocaleString()} ر.ع`
                        : t("onboarding.step6NoGoal"),
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-neutral-muted dark:text-white/40 font-arabic">
                      {row.label}
                    </span>
                    <span className="text-sm font-semibold text-neutral-text dark:text-white font-arabic">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {step === 5 && (
                <button
                  onClick={goNext}
                  className="flex-1 py-3.5 rounded-2xl border border-neutral-200 dark:border-white/10 text-sm font-arabic text-neutral-muted dark:text-white/40 hover:border-neutral-300 dark:hover:border-white/20 transition-all">
                  {t("onboarding.skip")}
                </button>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={step === 6 ? handleComplete : goNext}
                disabled={!canProceed()}
                className={`flex-1 py-3.5 rounded-2xl font-arabic font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  canProceed()
                    ? "bg-gradient-to-r from-primary to-emerald-500 text-white shadow-[0_4px_16px_rgba(31,122,99,0.3)] hover:shadow-[0_6px_20px_rgba(31,122,99,0.4)]"
                    : "bg-neutral-100 dark:bg-white/[0.05] text-neutral-muted dark:text-white/25 cursor-not-allowed"
                }`}>
                {step === 6 ? (
                  <>
                    <TbCheck className="w-4 h-4" />
                    {t("onboarding.start")}
                  </>
                ) : (
                  <>
                    {t("onboarding.next")}
                    {isRTL ? (
                      <TbArrowLeft className="w-4 h-4" />
                    ) : (
                      <TbArrowRight className="w-4 h-4" />
                    )}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
