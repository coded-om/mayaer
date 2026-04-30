import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TbRobot } from "react-icons/tb";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdvisorOnboarding } from "@/components/advisor/AdvisorOnboarding";
import { InvestmentPlanView } from "@/components/advisor/InvestmentPlanView";
import { useAdvisorStore } from "@/store/advisorStore";
import type { AdvisorAnswers } from "@/types/markets";

export function AdvisorPage() {
  const { t } = useTranslation();
  const { plan, setAnswers, generatePlan, resetPlan } = useAdvisorStore();

  const handleComplete = (answers: AdvisorAnswers) => {
    setAnswers(answers);
    generatePlan();
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <PageHeader
          title={t("advisor.title")}
          subtitle={t("advisor.subtitle")}
        />

        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 w-fit">
          <TbRobot className="w-5 h-5 text-primary" />
          <span className="font-arabic text-xs text-primary font-medium">
            {t("advisor.badge")}
          </span>
        </motion.div>

        {/* Sample plan preview — only when no plan */}
        {!plan && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-5 space-y-3 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2">
              <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white flex-1">
                {t("advisor.samplePlan")}
              </p>
              <span className="px-2 py-0.5 rounded-full font-arabic text-[10px] font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-emerald-400">
                {t("advisor.sample")}
              </span>
            </div>
            <p className="font-arabic text-xs text-neutral-muted">
              {t("advisor.samplePlanDesc")}
            </p>

            {/* Blurred preview */}
            <div className="blur-sm pointer-events-none select-none space-y-3">
              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-primary/5 dark:bg-primary/10 p-3 text-center">
                  <p
                    className="font-mono text-lg font-bold text-primary dark:text-emerald-400"
                    dir="ltr">
                    45.000
                  </p>
                  <p className="font-arabic text-[10px] text-neutral-muted">
                    {t("advisor.plan.monthlyTarget")}
                  </p>
                </div>
                <div className="rounded-xl bg-violet-500/5 dark:bg-violet-500/10 p-3 text-center">
                  <p
                    className="font-mono text-lg font-bold text-violet-500"
                    dir="ltr">
                    5
                  </p>
                  <p className="font-arabic text-[10px] text-neutral-muted">
                    {t("advisor.plan.timelineYears")}
                  </p>
                </div>
              </div>
              {/* Allocation rows */}
              {[
                {
                  label: t("advisor.allocation.stocks"),
                  color: "#6366F1",
                  pct: 40,
                },
                {
                  label: t("advisor.allocation.sukuk"),
                  color: "#10B981",
                  pct: 30,
                },
                {
                  label: t("advisor.allocation.gold"),
                  color: "#F59E0B",
                  pct: 20,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  <span className="font-arabic text-xs text-neutral-text dark:text-white flex-1">
                    {row.label}
                  </span>
                  <span
                    className="font-arabic text-xs font-bold"
                    style={{ color: row.color }}>
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content */}
        <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-5">
          {plan ? (
            <InvestmentPlanView plan={plan} onReset={resetPlan} />
          ) : (
            <AdvisorOnboarding onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
