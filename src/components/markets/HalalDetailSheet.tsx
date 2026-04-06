import { useTranslation } from "react-i18next";
import { TbX } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { LocalStock } from "@/types/markets";
import { HalalBadge } from "./HalalBadge";

interface HalalDetailSheetProps {
  stock: LocalStock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HalalDetailSheet({
  stock,
  open,
  onOpenChange,
}: HalalDetailSheetProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  if (!stock) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-t border-white/70 dark:border-white/[0.08] backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95 max-h-[60vh]">
        <SheetHeader className="flex-row items-start justify-between">
          <SheetTitle className="font-arabic text-lg font-bold text-neutral-text dark:text-white">
            {t("markets.halal.details")}
          </SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-lg hover:bg-neutral-bg dark:hover:bg-white/5">
            <TbX className="w-5 h-5 text-neutral-muted" />
          </button>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {stock.symbol.slice(0, 3)}
              </span>
            </div>
            <div>
              <p className="font-arabic text-base font-semibold text-neutral-text dark:text-white">
                {isAr ? stock.nameAr : stock.nameEn}
              </p>
              <p className="font-arabic text-xs text-neutral-muted">
                {stock.symbol}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-arabic text-sm text-neutral-muted">
              {t("markets.halal.status")}:
            </span>
            <HalalBadge status={stock.halalStatus} size="md" />
          </div>

          {stock.halalReason && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30">
              <p className="font-arabic text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                {t("markets.halal.reasonTitle")}
              </p>
              <p className="font-arabic text-sm text-amber-700 dark:text-amber-400">
                {t(stock.halalReason)}
              </p>
            </div>
          )}

          {stock.halalStatus === "halal" && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30">
              <p className="font-arabic text-sm text-emerald-700 dark:text-emerald-400">
                {t("markets.halal.compliantDesc")}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
