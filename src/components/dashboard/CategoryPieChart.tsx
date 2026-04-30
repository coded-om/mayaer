import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useBudgetStore } from "@/store/budgetStore";
import { CATEGORIES } from "@/constants";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { OmaniRial } from "@/components/ui/OmaniRial";

export function CategoryPieChart() {
  const transactions = useBudgetStore((s) => s.transactions);
  const { t } = useTranslation();

  const data = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const totals: Record<string, number> = {};
    transactions
      .filter(
        (tx) =>
          tx.type === "expense" &&
          isWithinInterval(parseISO(tx.date), {
            start: monthStart,
            end: monthEnd,
          }),
      )
      .forEach((tx) => {
        const cat = tx.category || "other";
        totals[cat] = (totals[cat] ?? 0) + tx.amount;
      });

    return Object.entries(totals)
      .filter(([, amount]) => amount > 0)
      .map(([id, amount]) => ({
        id,
        amount,
        label: t(`categories.${id}`),
        color: CATEGORIES.find((c) => c.id === id)?.color ?? "#9CA3AF",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, t]);

  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
      <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white mb-3">
        {t("dashboard.spendingByCategory")}
      </p>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={3}
            strokeWidth={0}>
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              <span className="font-arabic flex items-center gap-1">
                <OmaniRial className="w-3 h-3" />
                {Number(value).toFixed(3)}
              </span>,
              "",
            ]}
            contentStyle={{
              borderRadius: "0.5rem",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontFamily: "inherit",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {data.map((entry) => (
          <div key={entry.id} className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-arabic text-xs text-neutral-muted dark:text-gray-400 truncate">
              {entry.label}
            </span>
            <span className="font-arabic text-xs text-neutral-text dark:text-white ms-auto shrink-0 flex items-center gap-0.5">
              <OmaniRial className="w-2.5 h-2.5" />
              {entry.amount.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
