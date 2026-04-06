import { useTranslation } from "react-i18next";
import { usePointsStore } from "@/store/pointsStore";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { TbStar } from "react-icons/tb";

export function PointsHistory() {
  const { t, i18n } = useTranslation();
  const history = usePointsStore((s) => s.history);

  if (history.length === 0) {
    return (
      <p className="font-arabic text-sm text-neutral-muted text-center py-6">
        {t("rewards.noHistory")}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-white/50 dark:border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <TbStar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-arabic text-xs font-medium text-neutral-text dark:text-white truncate">
              {t(`rewards.reasons.${entry.reason}`, {
                defaultValue: entry.reason,
              })}
            </p>
            <p className="font-arabic text-[10px] text-neutral-muted">
              {format(parseISO(entry.date), "d MMM, HH:mm", {
                locale: i18n.language === "ar" ? ar : enUS,
              })}
            </p>
          </div>
          <span className="font-arabic text-sm font-bold text-emerald-500 shrink-0">
            +{entry.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
