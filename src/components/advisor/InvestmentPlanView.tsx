import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TbRefresh, TbClock, TbCoin } from "react-icons/tb";
import type {
  InvestmentPlan as PlanType,
  InvestmentAllocation,
} from "@/types/markets";
import { AllocationChart } from "./AllocationChart";

interface InvestmentPlanViewProps {
  plan: PlanType;
  onReset: () => void;
}

export function InvestmentPlanView({ plan, onReset }: InvestmentPlanViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-arabic text-lg font-bold text-neutral-text dark:text-white">
          {t("advisor.plan.title")}
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors">
          <TbRefresh className="w-4 h-4" />
          <span className="font-arabic">{t("advisor.plan.redo")}</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4">
          <TbCoin className="w-6 h-6 text-primary mb-2" />
          <p className="font-arabic text-xs text-neutral-muted">
            {t("advisor.plan.monthlyTarget")}
          </p>
          <p className="font-arabic text-lg font-bold text-neutral-text dark:text-white mt-0.5">
            {plan.monthlyTarget.toFixed(3)}{" "}
            <span className="text-xs text-neutral-muted">OMR</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4">
          <TbClock className="w-6 h-6 text-primary mb-2" />
          <p className="font-arabic text-xs text-neutral-muted">
            {t("advisor.plan.timeline")}
          </p>
          <p className="font-arabic text-lg font-bold text-neutral-text dark:text-white mt-0.5">
            {plan.timelineYears}{" "}
            <span className="text-xs text-neutral-muted">
              {t("advisor.plan.years")}
            </span>
          </p>
        </motion.div>
      </div>

      {/* Allocation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4">
        <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white mb-3">
          {t("advisor.plan.allocation")}
        </p>
        <AllocationChart allocation={plan.allocation} />
      </motion.div>

      {/* Risk Badge */}
      <div className="flex items-center gap-2">
        <span className="font-arabic text-sm text-neutral-muted">
          {t("advisor.plan.riskLevel")}:
        </span>
        <span className="px-3 py-1 rounded-full font-arabic text-xs font-semibold bg-primary/10 text-primary">
          {t(`advisor.risk.${plan.riskLevel}`)}
        </span>
      </div>

      {/* Tips */}
      {plan.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4">
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white mb-3">
            {t("advisor.plan.tips")}
          </p>
          <ul className="space-y-2">
            {plan.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 font-arabic text-sm text-neutral-muted dark:text-gray-400">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {t(tip)}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Monthly Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4">
        <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white mb-3">
          {t("advisor.plan.monthlyBreakdown")}
        </p>
        <div className="space-y-2.5">
          {(
            Object.entries(plan.allocation) as [
              keyof InvestmentAllocation,
              number,
            ][]
          )
            .filter(([, pct]) => pct > 0)
            .sort(([, a], [, b]) => b - a)
            .map(([key, pct]) => {
              const monthlyAmount = (plan.monthlyTarget * pct) / 100;
              const colorMap: Record<keyof InvestmentAllocation, string> = {
                stocks: "#6366F1",
                sukuk: "#10B981",
                gold: "#F59E0B",
                realEstate: "#8B5CF6",
                cash: "#6B7280",
              };
              const color = colorMap[key] ?? "#9CA3AF";
              return (
                <div key={key} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-arabic text-xs text-neutral-text dark:text-white flex-1">
                    {t(`advisor.allocation.${key}`)}
                  </span>
                  <span
                    className="font-mono text-xs text-neutral-muted dark:text-white/50"
                    dir="ltr">
                    {monthlyAmount.toFixed(3)} OMR
                  </span>
                  <span
                    className="w-10 text-right font-arabic text-xs font-bold"
                    style={{ color }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          <div className="border-t border-neutral-border dark:border-white/[0.08] pt-2 mt-1 flex items-center justify-between">
            <span className="font-arabic text-xs font-semibold text-neutral-text dark:text-white">
              {t("advisor.plan.totalMonthly")}
            </span>
            <span
              className="font-mono text-sm font-bold text-primary dark:text-emerald-400"
              dir="ltr">
              {plan.monthlyTarget.toFixed(3)} OMR
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
