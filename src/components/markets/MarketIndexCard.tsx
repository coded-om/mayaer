import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TbArrowUpRight, TbArrowDownRight } from "react-icons/tb";
import type { MarketIndex } from "@/types/markets";
import { cn } from "@/lib/utils";

interface MarketIndexCardProps {
  index: MarketIndex;
}

export function MarketIndexCard({ index }: MarketIndexCardProps) {
  const { t } = useTranslation();
  const isPositive = index.change >= 0;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-44 rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-3">
      <p className="font-arabic text-[10px] text-neutral-muted dark:text-gray-400 mb-1">
        {t(index.nameKey)}
      </p>
      <p className="font-arabic text-lg font-bold text-neutral-text dark:text-white">
        {index.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>
      <div className="flex items-center gap-1 mt-1">
        {isPositive ? (
          <TbArrowUpRight className="w-4 h-4 text-emerald-500" />
        ) : (
          <TbArrowDownRight className="w-4 h-4 text-red-500" />
        )}
        <span
          className={cn(
            "font-arabic text-xs font-medium",
            isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
          )}>
          {isPositive ? "+" : ""}
          {index.changePercent.toFixed(2)}%
        </span>
      </div>
    </motion.div>
  );
}
