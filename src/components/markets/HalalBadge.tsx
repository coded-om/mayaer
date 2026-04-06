import { useTranslation } from "react-i18next";
import type { HalalStatus } from "@/types/markets";
import { cn } from "@/lib/utils";

interface HalalBadgeProps {
  status: HalalStatus;
  size?: "sm" | "md";
}

const STYLES: Record<HalalStatus, string> = {
  halal:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  suspicious:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  non_compliant: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export function HalalBadge({ status, size = "sm" }: HalalBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-arabic font-medium",
        STYLES[status],
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
      )}>
      {t(`markets.halal.${status}`)}
    </span>
  );
}
