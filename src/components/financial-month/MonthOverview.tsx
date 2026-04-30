import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbCalendar, TbCash, TbReceipt, TbEdit } from "react-icons/tb";
import { useFinancialMonth } from "@/hooks/useFinancialMonth";
import { useFinancialMonthStore } from "@/store/financialMonthStore";
import { OmaniRial } from "@/components/ui/OmaniRial";
import { CATEGORIES } from "@/constants";

interface MonthOverviewProps {
  onEdit: () => void;
}

export function MonthOverview({ onEdit }: MonthOverviewProps) {
  const { t } = useTranslation();
  const config = useFinancialMonthStore((s) => s.config);
  const { daysUntilSalary, dailyBudget, remainingBudget, fixedTotal } =
    useFinancialMonth();

  if (!config) return null;

  return (
    <div className="space-y-4">
      {/* Top row: Countdown + Daily Budget */}
      <div className="grid grid-cols-2 gap-3">
        {/* Days countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-gradient-to-br from-primary/10 to-white/60 dark:from-primary/5 dark:to-white/[0.04] p-4 flex flex-col items-center justify-center">
          <TbCalendar className="w-6 h-6 text-primary mb-2" />
          <p className="font-arabic text-3xl font-bold text-primary">
            {daysUntilSalary}
          </p>
          <p className="font-arabic text-[10px] text-neutral-muted text-center">
            {t("financialMonth.daysUntilSalary")}
          </p>
        </motion.div>

        {/* Daily Budget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-white/60 dark:from-emerald-500/5 dark:to-white/[0.04] p-4 flex flex-col items-center justify-center">
          <TbCash className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="font-arabic text-xl font-bold text-neutral-text dark:text-white flex items-center gap-1">
            <OmaniRial className="w-4 h-4" />
            {dailyBudget.toFixed(3)}
          </p>
          <p className="font-arabic text-[10px] text-neutral-muted text-center">
            {t("financialMonth.dailyBudget")}
          </p>
        </motion.div>
      </div>

      {/* Remaining + Fixed row */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4">
          <p className="font-arabic text-xs text-neutral-muted mb-1">
            {t("financialMonth.remainingBudget")}
          </p>
          <p
            className={`font-arabic text-lg font-bold flex items-center gap-1 ${
              remainingBudget >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}>
            <OmaniRial className="w-3.5 h-3.5" />
            {remainingBudget.toFixed(3)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4">
          <p className="font-arabic text-xs text-neutral-muted mb-1">
            {t("financialMonth.totalFixed")}
          </p>
          <p className="font-arabic text-lg font-bold text-neutral-text dark:text-white flex items-center gap-1">
            <OmaniRial className="w-3.5 h-3.5" />
            {fixedTotal.toFixed(3)}
          </p>
        </motion.div>
      </div>

      {/* Fixed expenses list */}
      {config.fixedExpenses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TbReceipt className="w-4 h-4 text-neutral-muted" />
              <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
                {t("financialMonth.fixedExpenses")}
              </span>
            </div>
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-primary/10 text-neutral-muted hover:text-primary transition-colors">
              <TbEdit className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {config.fixedExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center gap-2 py-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      CATEGORIES.find((c) => c.id === exp.category)?.color ??
                      "#9CA3AF",
                  }}
                />
                <span className="font-arabic text-sm text-neutral-text dark:text-gray-300 flex-1 truncate">
                  {exp.name}
                </span>
                <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white shrink-0 flex items-center gap-0.5">
                  <OmaniRial className="w-2.5 h-2.5" />
                  {exp.amount.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
