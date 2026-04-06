import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbStar, TbChevronUp } from "react-icons/tb";
import { usePointsStore } from "@/store/pointsStore";

export function PointsSummary() {
  const { t } = useTranslation();
  const totalPoints = usePointsStore((s) => s.totalPoints);
  const level = usePointsStore((s) => s.level);
  const pointsInLevel = totalPoints % 100;
  const pointsToNext = 100 - pointsInLevel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-gradient-to-br from-amber-500/10 via-white/60 to-primary/10 dark:from-amber-500/5 dark:via-white/[0.04] dark:to-primary/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center">
            <TbStar className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <p className="font-arabic text-2xl font-bold text-neutral-text dark:text-white">
              {totalPoints.toLocaleString()}
            </p>
            <p className="font-arabic text-xs text-neutral-muted">
              {t("rewards.totalPoints")}
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1">
            <TbChevronUp className="w-4 h-4 text-primary" />
            <span className="font-arabic text-lg font-bold text-primary">
              {level}
            </span>
          </div>
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("rewards.level")}
          </p>
        </div>
      </div>

      {/* Progress to next level */}
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-neutral-bg dark:bg-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pointsInLevel}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary"
          />
        </div>
        <p className="font-arabic text-[10px] text-neutral-muted text-center">
          {t("rewards.pointsToNext", { points: pointsToNext })}
        </p>
      </div>
    </motion.div>
  );
}
