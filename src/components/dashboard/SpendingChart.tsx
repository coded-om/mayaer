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
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";

export function SpendingChart() {
  const transactions = useBudgetStore((s) => s.transactions);
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "ar" ? ar : enUS;

  const weeklyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const amount = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            isWithinInterval(parseISO(t.date), {
              start: dayStart,
              end: dayEnd,
            }),
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        day: format(date, "EEE", { locale: dateLocale }),
        amount,
      };
    });
    return days;
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
      <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white mb-3">
        {t("dashboard.weeklySpending")}
      </p>
      <div className="h-40" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1F7A63" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1F7A63" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
            />
            <YAxis hide />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const val = Number(payload[0].value);
                return (
                  <div className="rounded-lg border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/80 dark:bg-white/[0.06] px-3 py-2 shadow-md">
                    <p className="font-mono text-xs font-semibold text-neutral-text dark:text-white">
                      {val.toFixed(3)} <OmaniRial className="w-3 h-auto" />
                    </p>
                    <p className="text-[10px] text-neutral-muted">
                      {t("dashboard.expenseLabel")}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#1F7A63"
              fill="url(#colorSpend)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
