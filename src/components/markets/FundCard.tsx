import { useTranslation } from "react-i18next";
import { TbArrowUpRight, TbArrowDownRight } from "react-icons/tb";
import type { InvestmentFund } from "@/types/markets";
import { HalalBadge } from "./HalalBadge";
import { cn } from "@/lib/utils";

interface FundCardProps {
  fund: InvestmentFund;
}

export function FundCard({ fund }: FundCardProps) {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === "ar";
  const isPositive = fund.navChange >= 0;

  return (
    <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white truncate">
            {isAr ? fund.nameAr : fund.nameEn}
          </p>
          <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400 mt-0.5">
            {isAr ? fund.managerAr : fund.managerEn}
          </p>
        </div>
        <HalalBadge status={fund.halalStatus} />
      </div>

      <div className="flex items-end justify-between mt-3">
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted dark:text-gray-400">
            {t("markets.funds.nav")}
          </p>
          <p className="font-arabic text-lg font-bold text-neutral-text dark:text-white">
            {fund.nav.toFixed(fund.currency === "OMR" ? 3 : 2)}{" "}
            <span className="text-xs text-neutral-muted">{fund.currency}</span>
          </p>
        </div>

        <div className="text-end">
          <div className="flex items-center justify-end gap-0.5">
            {isPositive ? (
              <TbArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TbArrowDownRight className="w-3.5 h-3.5 text-red-500" />
            )}
            <span
              className={cn(
                "font-arabic text-xs font-medium",
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}>
              {isPositive ? "+" : ""}
              {fund.navChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/50 dark:border-white/[0.06]">
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("markets.funds.ytd")}
          </p>
          <p
            className={cn(
              "font-arabic text-xs font-bold",
              fund.ytdReturn >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400",
            )}>
            {fund.ytdReturn >= 0 ? "+" : ""}
            {fund.ytdReturn}%
          </p>
        </div>
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("markets.funds.expense")}
          </p>
          <p className="font-arabic text-xs font-bold text-neutral-text dark:text-white">
            {fund.expenseRatio}%
          </p>
        </div>
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("markets.funds.category")}
          </p>
          <p className="font-arabic text-xs font-bold text-neutral-text dark:text-white truncate">
            {isAr ? fund.categoryAr : fund.category}
          </p>
        </div>
      </div>
    </div>
  );
}
