import { motion } from "framer-motion";
import { TbArrowUpRight, TbArrowDownLeft, TbCoins } from "react-icons/tb";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatOMR } from "@/lib/currency";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";

const stats = [
  {
    key: "income",
    labelKey: "dashboard.incomeLabel",
    icon: TbArrowUpRight,
    color: "text-success",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    key: "expense",
    labelKey: "dashboard.expenseLabel",
    icon: TbArrowDownLeft,
    color: "text-danger",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
  {
    key: "savings",
    labelKey: "dashboard.savingsLabel",
    icon: TbCoins,
    color: "text-primary",
    bgColor: "bg-primary-50 dark:bg-primary-950",
  },
] as const;

export function QuickStats() {
  const summary = useBudgetSummary();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const value = summary[stat.key];
        return (
          <div
            key={stat.key}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-3">
            <div
              className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-center">
              <p className="font-arabic text-[10px] text-neutral-muted">
                {t(stat.labelKey)}
              </p>
              <p className="font-mono text-sm font-bold text-neutral-text dark:text-white">
                {formatOMR(value, true)} <OmaniRial className="w-3 h-auto" />
              </p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
