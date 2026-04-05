import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useBudgetStore } from "@/store/budgetStore";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { subMonths, format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { OmaniRial } from "@/components/ui/OmaniRial";

export function MonthlyBarChart() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const locale = isAr ? ar : enUS;
  const getTotalByType = useBudgetStore((s) => s.getTotalByType);

  const data = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(new Date(), 5 - i);
      return {
        month: format(month, "MMM", { locale }),
        income: getTotalByType("income", month),
        expense: getTotalByType("expense", month),
      };
    });
  }, [getTotalByType, locale]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
      <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white mb-3">
        {t("dashboard.monthlyComparison")}
      </p>
      <div className="h-48" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              width={40}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/80 dark:bg-white/[0.06] px-3 py-2 shadow-md space-y-1">
                    <p className="font-arabic text-xs font-semibold text-neutral-text dark:text-white">
                      {label}
                    </p>
                    {payload.map((p) => (
                      <p
                        key={p.dataKey as string}
                        className="font-mono text-[11px]"
                        style={{ color: p.color }}>
                        {p.dataKey === "income"
                          ? t("common.income")
                          : t("common.expense")}
                        : {Number(p.value).toFixed(2)}{" "}
                        <OmaniRial className="w-3 h-auto inline" />
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Bar
              dataKey="income"
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              dataKey="expense"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
          <span className="font-arabic text-[10px] text-neutral-muted">
            {t("common.income")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
          <span className="font-arabic text-[10px] text-neutral-muted">
            {t("common.expense")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
