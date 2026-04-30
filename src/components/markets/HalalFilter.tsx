import { useTranslation } from "react-i18next";
import type { HalalStatus } from "@/types/markets";
import { cn } from "@/lib/utils";

interface HalalFilterProps {
  value: HalalStatus | "all";
  onChange: (v: HalalStatus | "all") => void;
}

const OPTIONS: { value: HalalStatus | "all"; labelKey: string }[] = [
  { value: "all", labelKey: "markets.halal.all" },
  { value: "halal", labelKey: "markets.halal.halal" },
  { value: "suspicious", labelKey: "markets.halal.suspicious" },
  { value: "non_compliant", labelKey: "markets.halal.non_compliant" },
];

export function HalalFilter({ value, onChange }: HalalFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-lg font-arabic text-xs whitespace-nowrap transition-colors border",
            value === opt.value
              ? "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:border-primary/40"
              : "bg-white/50 dark:bg-white/5 text-neutral-muted dark:text-gray-400 border-white/70 dark:border-white/[0.08]",
          )}>
          {t(opt.labelKey)}
        </button>
      ))}
    </div>
  );
}
