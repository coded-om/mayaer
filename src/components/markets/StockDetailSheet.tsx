import { useTranslation } from "react-i18next";
import { TbArrowUpRight, TbArrowDownRight, TbX } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { LocalStock } from "@/types/markets";
import { HalalBadge } from "./HalalBadge";
import { cn } from "@/lib/utils";

interface StockDetailSheetProps {
  stock: LocalStock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockDetailSheet({
  stock,
  open,
  onOpenChange,
}: StockDetailSheetProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  if (!stock) return null;

  const isPositive = stock.change >= 0;
  const decimals = stock.currency === "OMR" ? 3 : 2;

  const rows = [
    { label: t("markets.detail.high"), value: stock.high.toFixed(decimals) },
    { label: t("markets.detail.low"), value: stock.low.toFixed(decimals) },
    {
      label: t("markets.detail.volume"),
      value: stock.volume.toLocaleString(),
    },
    {
      label: t("markets.detail.marketCap"),
      value: formatCap(stock.marketCap, stock.currency),
    },
    {
      label: t("markets.detail.sector"),
      value: isAr ? stock.sectorAr : stock.sector,
    },
    { label: t("markets.detail.currency"), value: stock.currency },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="rounded-t-3xl border-t border-white/70 dark:border-white/[0.08] backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95 max-h-[80vh] overflow-y-auto">
        <SheetHeader className="flex-row items-start justify-between">
          <div className="flex-1">
            <SheetTitle className="font-arabic text-lg font-bold text-neutral-text dark:text-white">
              {isAr ? stock.nameAr : stock.nameEn}
            </SheetTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-arabic text-xs text-neutral-muted">
                {stock.symbol}
              </span>
              <HalalBadge status={stock.halalStatus} size="md" />
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-lg hover:bg-neutral-bg dark:hover:bg-white/5">
            <TbX className="w-5 h-5 text-neutral-muted" />
          </button>
        </SheetHeader>

        {/* Price Section */}
        <div className="mt-4 mb-6">
          <p className="font-arabic text-3xl font-bold text-neutral-text dark:text-white">
            {stock.price.toFixed(decimals)}{" "}
            <span className="text-sm text-neutral-muted">{stock.currency}</span>
          </p>
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <TbArrowUpRight className="w-5 h-5 text-emerald-500" />
            ) : (
              <TbArrowDownRight className="w-5 h-5 text-red-500" />
            )}
            <span
              className={cn(
                "font-arabic text-sm font-medium",
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}>
              {isPositive ? "+" : ""}
              {stock.change.toFixed(decimals)} ({isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Halal Reason */}
        {stock.halalReason && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30">
            <p className="font-arabic text-xs text-amber-700 dark:text-amber-400">
              {t(stock.halalReason)}
            </p>
          </div>
        )}

        {/* Details Grid */}
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-b border-white/50 dark:border-white/[0.06] last:border-0">
              <span className="font-arabic text-sm text-neutral-muted dark:text-gray-400">
                {row.label}
              </span>
              <span className="font-arabic text-sm font-medium text-neutral-text dark:text-white">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function formatCap(cap: number, currency: string): string {
  if (cap >= 1e12) return `${(cap / 1e12).toFixed(1)}T ${currency}`;
  if (cap >= 1e9) return `${(cap / 1e9).toFixed(1)}B ${currency}`;
  if (cap >= 1e6) return `${(cap / 1e6).toFixed(0)}M ${currency}`;
  return `${cap.toLocaleString()} ${currency}`;
}
