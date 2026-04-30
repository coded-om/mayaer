import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbTrash, TbTrendingUp, TbTrendingDown } from "react-icons/tb";
import type { StockHolding, StockQuote } from "@/types";

interface StockCardProps {
  holding: StockHolding;
  quote?: StockQuote;
  profitLoss: { amount: number; percent: number };
  onDelete: () => void;
}

export function StockCard({
  holding,
  quote,
  profitLoss,
  onDelete,
}: StockCardProps) {
  const { t } = useTranslation();
  const isProfit = profitLoss.amount >= 0;
  const currentPrice = quote?.currentPrice ?? holding.purchasePrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-arabic text-base font-bold text-neutral-text dark:text-white">
            {holding.symbol}
          </h3>
          <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400 truncate max-w-[180px]">
            {holding.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              isProfit
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}>
            {isProfit ? (
              <TbTrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TbTrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{profitLoss.percent.toFixed(2)}%</span>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-muted hover:text-red-500 transition-colors">
            <TbTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("stocks.purchasePrice")}
          </p>
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
            ${holding.purchasePrice.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("stocks.currentPrice")}
          </p>
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
            ${currentPrice.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("stocks.profitLoss")}
          </p>
          <p
            className={`font-arabic text-sm font-semibold ${
              isProfit
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}>
            {isProfit ? "+" : ""}${profitLoss.amount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-white/30 dark:border-white/[0.06] flex items-center justify-between">
        <span className="font-arabic text-[10px] text-neutral-muted">
          {holding.quantity} × ${holding.purchasePrice.toFixed(2)}
        </span>
        {quote && (
          <span className="font-arabic text-[10px] text-neutral-muted">
            {t("stocks.lastUpdated")}:{" "}
            {new Date(quote.lastUpdated).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
