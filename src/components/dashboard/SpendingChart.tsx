import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useBudgetStore } from "@/store/budgetStore";
import {
  format,
  subDays,
  parseISO,
  startOfDay,
  endOfDay,
  isWithinInterval,
  startOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";

type Period = "day" | "week" | "month";

export function SpendingChart() {
  const transactions = useBudgetStore((s) => s.transactions);
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "ar" ? ar : enUS;
  const [period, setPeriod] = useState<Period>("week");

  const chartData = useMemo(() => {
    const now = new Date();

    if (period === "day") {
      return Array.from({ length: 24 }, (_, h) => {
        const hourStart = new Date(now);
        hourStart.setHours(h, 0, 0, 0);
        const hourEnd = new Date(now);
        hourEnd.setHours(h, 59, 59, 999);

        const income = transactions
          .filter(
            (tx) =>
              tx.type === "income" &&
              isWithinInterval(parseISO(tx.date), {
                start: hourStart,
                end: hourEnd,
              }),
          )
          .reduce((sum, tx) => sum + tx.amount, 0);

        const expense = transactions
          .filter(
            (tx) =>
              tx.type === "expense" &&
              isWithinInterval(parseISO(tx.date), {
                start: hourStart,
                end: hourEnd,
              }),
          )
          .reduce((sum, tx) => sum + tx.amount, 0);

        return { label: `${h}:00`, income, expense };
      });
    }

    if (period === "week") {
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(now, 6 - i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const income = transactions
          .filter(
            (tx) =>
              tx.type === "income" &&
              isWithinInterval(parseISO(tx.date), {
                start: dayStart,
                end: dayEnd,
              }),
          )
          .reduce((sum, tx) => sum + tx.amount, 0);

        const expense = transactions
          .filter(
            (tx) =>
              tx.type === "expense" &&
              isWithinInterval(parseISO(tx.date), {
                start: dayStart,
                end: dayEnd,
              }),
          )
          .reduce((sum, tx) => sum + tx.amount, 0);

        return {
          label: format(date, "EEE", { locale: dateLocale }),
          income,
          expense,
        };
      });
    }

    // month
    const days = eachDayOfInterval({ start: startOfMonth(now), end: now });
    return days.map((date) => {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const income = transactions
        .filter(
          (tx) =>
            tx.type === "income" &&
            isWithinInterval(parseISO(tx.date), {
              start: dayStart,
              end: dayEnd,
            }),
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      const expense = transactions
        .filter(
          (tx) =>
            tx.type === "expense" &&
            isWithinInterval(parseISO(tx.date), {
              start: dayStart,
              end: dayEnd,
            }),
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      return {
        label: format(date, "d", { locale: dateLocale }),
        income,
        expense,
      };
    });
  }, [transactions, period, dateLocale]);

  const periodOptions: { value: Period; label: string }[] = [
    { value: "day", label: t("dashboard.periodDay") },
    { value: "week", label: t("dashboard.periodWeek") },
    { value: "month", label: t("dashboard.periodMonth") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
          {t("dashboard.weeklySpending")}
        </p>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="font-arabic text-xs rounded-lg px-2 py-1 border border-white/70 dark:border-white/[0.12] bg-white/70 dark:bg-white/[0.06] text-neutral-text dark:text-white focus:outline-none cursor-pointer">
          {periodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <span className="flex items-center gap-1 text-[11px] text-neutral-muted dark:text-white/50">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          {t("dashboard.incomeLabel")}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-neutral-muted dark:text-white/50">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          {t("dashboard.expenseLabel")}
        </span>
      </div>

      <div className="h-40 min-w-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
              interval="preserveStartEnd"
            />
            <YAxis hide />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/90 dark:bg-neutral-900/90 px-3 py-2 shadow-md space-y-1">
                    <p className="text-[10px] text-neutral-muted mb-1">
                      {label}
                    </p>
                    {payload.map((entry) => (
                      <p
                        key={entry.dataKey as string}
                        className="font-mono text-xs font-semibold flex items-center gap-1"
                        style={{ color: entry.color }}>
                        {Number(entry.value).toFixed(3)}{" "}
                        <OmaniRial className="w-3 h-auto" />
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              fill="url(#colorIncome)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#F87171"
              fill="url(#colorExpense)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
