import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { MarketId } from "@/types/markets";
import { cn } from "@/lib/utils";

interface MarketSelectorProps {
  selected: MarketId;
  onChange: (m: MarketId) => void;
}

const MARKETS: { id: MarketId; labelKey: string; flag: string }[] = [
  { id: "msm", labelKey: "markets.msm", flag: "🇴🇲" },
  { id: "tadawul", labelKey: "markets.tadawul", flag: "🇸🇦" },
  { id: "dfm", labelKey: "markets.dfm", flag: "🇦🇪" },
];

export function MarketSelector({ selected, onChange }: MarketSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {MARKETS.map((m) => {
        const active = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2 rounded-xl font-arabic text-sm whitespace-nowrap transition-colors",
              active
                ? "text-white"
                : "text-neutral-muted dark:text-gray-400 bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08]",
            )}>
            {active && (
              <motion.div
                layoutId="marketTab"
                className="absolute inset-0 rounded-xl bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{m.flag}</span>
            <span className="relative z-10">{t(m.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
