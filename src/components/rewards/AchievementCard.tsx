import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbLock } from "react-icons/tb";
import type { Achievement } from "@/types";
import { useAchievementsStore } from "@/store/achievementsStore";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { t, i18n } = useTranslation();
  const isUnlocked = useAchievementsStore((s) => s.isUnlocked(achievement.id));
  const unlockDate = useAchievementsStore((s) =>
    s.getUnlockDate(achievement.id),
  );

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className={`rounded-2xl border p-4 transition-all ${
        isUnlocked
          ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-white/60 dark:from-amber-500/5 dark:to-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          : "border-white/50 dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.02] opacity-60"
      }`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
            isUnlocked ? "bg-amber-500/15" : "bg-neutral-bg dark:bg-gray-800"
          }`}>
          {isUnlocked ? (
            <span>🏆</span>
          ) : (
            <TbLock className="w-5 h-5 text-neutral-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-arabic text-sm font-semibold text-neutral-text dark:text-white truncate">
            {t(achievement.titleKey)}
          </h4>
          <p className="font-arabic text-[11px] text-neutral-muted dark:text-gray-400 truncate">
            {t(achievement.descriptionKey)}
          </p>
          {isUnlocked && unlockDate && (
            <p className="font-arabic text-[10px] text-amber-500 mt-0.5">
              {format(parseISO(unlockDate), "d MMM yyyy", {
                locale: i18n.language === "ar" ? ar : enUS,
              })}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
