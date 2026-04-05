import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useBudgetStore } from "@/store/budgetStore";
import { usePointsStore } from "@/store/pointsStore";
import { useStreakStore } from "@/store/streakStore";
import { CATEGORIES } from "@/constants";
import { formatOMR } from "@/lib/currency";
import { OmaniRial } from "@/components/ui/OmaniRial";
import {
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  subMonths,
  format,
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  TbArrowUpRight,
  TbArrowDownLeft,
  TbFlame,
  TbStar,
  TbChartPie,
  TbTrendingUp,
  TbFileText,
} from "react-icons/tb";

export function MonthlyReportPage() {
  const transactions = useBudgetStore((s) => s.transactions);
  const totalPoints = usePointsStore((s) => s.totalPoints);
  const longestStreak = useStreakStore((s) => s.longestStreak);
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "ar" ? ar : enUS;

  const report = useMemo(() => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const start = startOfMonth(lastMonth);
    const end = endOfMonth(lastMonth);
    const monthLabel = format(lastMonth, "MMMM yyyy", { locale: dateLocale });

    const monthTx = transactions.filter((tx) =>
      isWithinInterval(parseISO(tx.date), { start, end }),
    );

    const income = monthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = monthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const savings = income - expense;
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

    // Category breakdown
    const catTotals: Record<string, number> = {};
    monthTx
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = t.category || "other";
        catTotals[cat] = (catTotals[cat] ?? 0) + t.amount;
      });

    const categoryData = Object.entries(catTotals)
      .map(([id, amount]) => ({
        id,
        amount,
        label: t(`categories.${id}`),
        color: CATEGORIES.find((c) => c.id === id)?.color ?? "#9CA3AF",
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categoryData[0] ?? null;
    const txCount = monthTx.length;

    // Daily spend comparison (last 7 days of previous month)
    const dailyData: { day: string; amount: number }[] = [];
    for (let d = 1; d <= 7; d++) {
      const date = new Date(start);
      date.setDate(d);
      const dayTx = monthTx.filter(
        (tx) => tx.type === "expense" && parseISO(tx.date).getDate() === d,
      );
      dailyData.push({
        day: String(d),
        amount: dayTx.reduce((s, t) => s + t.amount, 0),
      });
    }

    return {
      monthLabel,
      income,
      expense,
      savings,
      savingsRate,
      categoryData,
      topCategory,
      txCount,
      dailyData,
    };
  }, [transactions, t, dateLocale]);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 pb-8">
      {/* Header */}
      <div className="text-center">
        <motion.p
          {...fadeUp}
          className="font-arabic text-xs text-neutral-muted dark:text-gray-400">
          {t("report.title")}
        </motion.p>
        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="font-arabic text-2xl font-bold text-neutral-text dark:text-white mt-1">
          {report.monthLabel}
        </motion.h1>
      </div>

      {/* Big number cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Income */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-950/50 dark:to-green-900/50 backdrop-blur-xl border border-green-200/40 dark:border-green-800/30 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4 text-center">
          <TbArrowUpRight className="w-6 h-6 text-success mx-auto mb-1" />
          <p className="font-arabic text-[10px] text-neutral-muted dark:text-gray-400">
            {t("report.totalIncome")}
          </p>
          <p className="font-mono text-lg font-bold text-success flex items-center justify-center gap-1">
            {formatOMR(report.income)}
            <OmaniRial className="w-3 h-auto" />
          </p>
        </motion.div>

        {/* Expense */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-red-50/80 to-red-100/80 dark:from-red-950/50 dark:to-red-900/50 backdrop-blur-xl border border-red-200/40 dark:border-red-800/30 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4 text-center">
          <TbArrowDownLeft className="w-6 h-6 text-danger mx-auto mb-1" />
          <p className="font-arabic text-[10px] text-neutral-muted dark:text-gray-400">
            {t("report.totalExpense")}
          </p>
          <p className="font-mono text-lg font-bold text-danger flex items-center justify-center gap-1">
            {formatOMR(report.expense)}
            <OmaniRial className="w-3 h-auto" />
          </p>
        </motion.div>
      </div>

      {/* Savings + Rate */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-gradient-to-br from-primary-50/80 to-primary-200/80 dark:from-primary-950/50 dark:to-primary-900/50 backdrop-blur-xl border border-primary/20 dark:border-primary/10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-5 text-center">
        <TbTrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400">
          {t("report.savedThisMonth")}
        </p>
        <p className="font-mono text-3xl font-bold text-primary flex items-center justify-center gap-2 mt-1">
          {formatOMR(report.savings)}
          <OmaniRial className="w-4 h-auto" />
        </p>
        <div className="mt-2 inline-block bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-full">
          <span className="font-mono text-sm font-semibold text-primary">
            {report.savingsRate}%
          </span>
          <span className="font-arabic text-xs text-neutral-muted ms-1">
            {t("report.savingsRate")}
          </span>
        </div>
      </motion.div>

      {/* Category Pie */}
      {report.categoryData.length > 0 && (
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <TbChartPie className="w-5 h-5 text-primary" />
            <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
              {t("report.spendingBreakdown")}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={report.categoryData}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                strokeWidth={0}>
                {report.categoryData.map((e) => (
                  <Cell key={e.id} fill={e.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${Number(v).toFixed(3)}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {report.categoryData.slice(0, 5).map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-arabic text-xs text-neutral-muted dark:text-gray-400 flex-1 truncate">
                  {cat.label}
                </span>
                <span className="font-mono text-xs font-semibold text-neutral-text dark:text-white flex items-center gap-0.5">
                  {formatOMR(cat.amount)}
                  <OmaniRial className="w-2.5 h-auto" />
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats row */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-3 text-center">
          <TbFlame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="font-mono text-lg font-bold text-neutral-text dark:text-white">
            {longestStreak}
          </p>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("report.streak")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-3 text-center">
          <TbStar className="w-5 h-5 text-gold mx-auto mb-1" />
          <p className="font-mono text-lg font-bold text-neutral-text dark:text-white">
            {totalPoints}
          </p>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("report.points")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-3 text-center">
          <TbFileText className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="font-mono text-lg font-bold text-neutral-text dark:text-white">
            {report.txCount}
          </p>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("report.transactions")}
          </p>
        </div>
      </motion.div>

      {/* Top category */}
      {report.topCategory && (
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4 text-center">
          <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400">
            {t("report.topCategory")}
          </p>
          <p className="font-arabic text-lg font-bold text-neutral-text dark:text-white mt-1">
            {report.topCategory.label}
          </p>
          <p className="font-mono text-sm text-danger flex items-center justify-center gap-1 mt-0.5">
            {formatOMR(report.topCategory.amount)}
            <OmaniRial className="w-2.5 h-auto" />
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
