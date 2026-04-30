import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbWallet } from "react-icons/tb";
import { useFinancialMonth } from "@/hooks/useFinancialMonth";
import { OmaniRial } from "@/components/ui/OmaniRial";

export function DailyBudget() {
  const { t } = useTranslation();
  const { dailyBudget, daysUntilSalary, remainingBudget, fixedTotal } =
    useFinancialMonth();

  const totalNeeded = fixedTotal + dailyBudget * daysUntilSalary;
  const progress =
    totalNeeded > 0 ? Math.min((remainingBudget / totalNeeded) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-gradient-to-br from-blue-500/5 to-white/60 dark:from-blue-500/5 dark:to-white/[0.04] p-4">
      <div className="flex items-center gap-2 mb-3">
        <TbWallet className="w-5 h-5 text-blue-500" />
        <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
          {t("financialMonth.dailyBudgetTitle")}
        </span>
      </div>

      <div className="text-center mb-4">
        <p className="font-arabic text-xs text-neutral-muted mb-1">
          {t("financialMonth.recommendedDaily")}
        </p>
        <p className="font-arabic text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
          <OmaniRial className="w-5 h-5" />
          {dailyBudget.toFixed(3)}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="font-arabic text-[10px] text-neutral-muted">
            {t("financialMonth.budgetHealth")}
          </span>
          <span className="font-arabic text-[10px] text-neutral-muted">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-neutral-bg dark:bg-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`h-full rounded-full ${
              progress >= 60
                ? "bg-emerald-500"
                : progress >= 30
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
        </div>
      </div>

      <p className="font-arabic text-[10px] text-center text-neutral-muted">
        {t("financialMonth.dailyBudgetHint", { days: daysUntilSalary })}
      </p>
    </motion.div>
  );
}
