import { useTranslation } from "react-i18next";
import {
  TbArrowUpRight,
  TbArrowDownRight,
  TbStar,
  TbStarFilled,
} from "react-icons/tb";
import type { LocalStock } from "@/types/markets";
import { HalalBadge } from "./HalalBadge";
import { cn } from "@/lib/utils";

interface StockListItemProps {
  stock: LocalStock;
  inWatchlist: boolean;
  onToggleWatchlist: () => void;
  onPress: () => void;
}

export function StockListItem({
  stock,
  inWatchlist,
  onToggleWatchlist,
  onPress,
}: StockListItemProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const isPositive = stock.change >= 0;

  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/40 dark:hover:bg-white/[0.03] transition-colors text-start">
      {/* Symbol */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
        <span className="text-xs font-bold text-primary">
          {stock.symbol.slice(0, 3)}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white truncate">
            {isAr ? stock.nameAr : stock.nameEn}
          </p>
          <HalalBadge status={stock.halalStatus} />
        </div>
        <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400 mt-0.5">
          {stock.symbol} · {isAr ? stock.sectorAr : stock.sector}
        </p>
      </div>

      {/* Price + change */}
      <div className="flex-shrink-0 text-end">
        <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white">
          {stock.price.toFixed(stock.currency === "OMR" ? 3 : 2)}{" "}
          <span className="text-[10px] text-neutral-muted">
            {stock.currency}
          </span>
        </p>
        <div className="flex items-center justify-end gap-0.5 mt-0.5">
          {isPositive ? (
            <TbArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TbArrowDownRight className="w-3.5 h-3.5 text-red-500" />
          )}
          <span
            className={cn(
              "font-arabic text-[11px] font-medium",
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400",
            )}>
            {isPositive ? "+" : ""}
            {stock.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Watchlist */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWatchlist();
        }}
        className="flex-shrink-0 p-1.5 -me-1">
        {inWatchlist ? (
          <TbStarFilled className="w-5 h-5 text-amber-400" />
        ) : (
          <TbStar className="w-5 h-5 text-neutral-muted dark:text-gray-500" />
        )}
      </button>
    </button>
  );
}
