import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbChartPie, TbTrendingUp, TbTrendingDown } from "react-icons/tb";
import { useStocksStore } from "@/store/stocksStore";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EF4444",
  "#F97316",
  "#22C55E",
  "#06B6D4",
  "#EC4899",
  "#6B7280",
];

export function PortfolioSummary() {
  const { t } = useTranslation();
  const holdings = useStocksStore((s) => s.holdings);
  const portfolioValue = useStocksStore((s) => s.getPortfolioValue());
  const totalPL = useStocksStore((s) => s.getTotalProfitLoss());
  const quotes = useStocksStore((s) => s.quotes);
  const isProfit = totalPL >= 0;

  const chartData = holdings.map((h, i) => {
    const quote = quotes[h.symbol];
    const value = (quote?.currentPrice ?? h.purchasePrice) * h.quantity;
    return { name: h.symbol, value, color: COLORS[i % COLORS.length] };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-white/60 to-purple-500/10 dark:from-blue-500/5 dark:via-white/[0.04] dark:to-purple-500/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <TbChartPie className="w-5 h-5 text-primary" />
        <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
          {t("stocks.portfolio")}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Chart */}
        {chartData.length > 0 && (
          <div className="w-24 h-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={42}
                  paddingAngle={2}
                  strokeWidth={0}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="font-arabic text-xs text-neutral-muted">
              {t("stocks.totalValue")}
            </p>
            <p className="font-arabic text-xl font-bold text-neutral-text dark:text-white">
              ${portfolioValue.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                isProfit
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}>
              {isProfit ? (
                <TbTrendingUp className="w-4 h-4" />
              ) : (
                <TbTrendingDown className="w-4 h-4" />
              )}
              <span className="font-arabic text-sm font-semibold">
                {isProfit ? "+" : ""}${totalPL.toFixed(2)}
              </span>
            </div>
            <span className="font-arabic text-[10px] text-neutral-muted">
              {t("stocks.totalProfitLoss")}
            </span>
          </div>
        </div>
      </div>

      {/* Holdings legend */}
      {chartData.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/30 dark:border-white/[0.06] flex flex-wrap gap-3">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-arabic text-[10px] text-neutral-muted">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
