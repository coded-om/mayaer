import { useTranslation } from "react-i18next";
import type { Sukuk } from "@/types/markets";
import { HalalBadge } from "./HalalBadge";

interface SukukCardProps {
  sukuk: Sukuk;
}

export function SukukCard({ sukuk }: SukukCardProps) {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
            {isAr ? sukuk.nameAr : sukuk.nameEn}
          </p>
          <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400 mt-0.5">
            {isAr ? sukuk.issuerAr : sukuk.issuer}
          </p>
        </div>
        <HalalBadge status={sukuk.halalStatus} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted dark:text-gray-400">
            {t("markets.sukuk.yield")}
          </p>
          <p className="font-arabic text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {sukuk.yieldPercent}%
          </p>
        </div>
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted dark:text-gray-400">
            {t("markets.sukuk.rating")}
          </p>
          <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white">
            {sukuk.rating}
          </p>
        </div>
        <div>
          <p className="font-arabic text-[10px] text-neutral-muted dark:text-gray-400">
            {t("markets.sukuk.maturity")}
          </p>
          <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white">
            {new Date(sukuk.maturityDate).getFullYear()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/50 dark:border-white/[0.06]">
        <span className="font-arabic text-xs text-neutral-muted">
          {t("markets.sukuk.price")}
        </span>
        <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
          {sukuk.currentPrice.toFixed(2)} {sukuk.currency}
        </span>
      </div>
    </div>
  );
}
