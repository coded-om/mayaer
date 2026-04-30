import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BADGES } from "@/constants";
import { usePointsStore } from "@/store/pointsStore";

export function BadgeGrid() {
  const { t } = useTranslation();
  const totalPoints = usePointsStore((s) => s.totalPoints);

  const tierColors: Record<string, string> = {
    bronze: "from-amber-700/20 to-amber-600/10 border-amber-700/30",
    silver: "from-gray-400/20 to-gray-300/10 border-gray-400/30",
    gold: "from-yellow-400/20 to-yellow-300/10 border-yellow-400/30",
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {BADGES.map((badge) => {
        const earned = totalPoints >= badge.requiredPoints;
        return (
          <motion.div
            key={badge.id}
            whileTap={{ scale: 0.95 }}
            className={`rounded-2xl border p-3 flex flex-col items-center gap-2 transition-all ${
              earned
                ? `bg-gradient-to-br ${tierColors[badge.tier]} shadow-sm`
                : "border-white/50 dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.02] opacity-50"
            }`}>
            <span className="text-2xl">{badge.icon}</span>
            <span className="font-arabic text-[10px] font-semibold text-neutral-text dark:text-white text-center leading-tight">
              {t(badge.nameKey)}
            </span>
            <span className="font-arabic text-[9px] text-neutral-muted">
              {badge.requiredPoints} {t("challenges.points")}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
