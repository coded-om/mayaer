import { useState } from "react";
import { motion } from "framer-motion";
import { TbAward, TbTrophy } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { PointsSummary } from "@/components/rewards/PointsSummary";
import { AchievementCard } from "@/components/rewards/AchievementCard";
import { BadgeGrid } from "@/components/rewards/BadgeGrid";
import { PointsHistory } from "@/components/rewards/PointsHistory";
import { useAchievements } from "@/hooks/useAchievements";
import { ACHIEVEMENTS } from "@/constants";
import { useAchievementsStore } from "@/store/achievementsStore";
import { ChallengesPage } from "@/pages/ChallengesPage";
import { cn } from "@/lib/utils";

export function RewardsPage() {
  const { t } = useTranslation();
  const unlockedIds = useAchievementsStore((s) => s.unlockedIds);
  const [activeTab, setActiveTab] = useState<"rewards" | "challenges">(
    "rewards",
  );

  // Reactively check achievements
  useAchievements();

  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const aUnlocked = unlockedIds.includes(a.id);
    const bUnlocked = unlockedIds.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      <PageHeader title={t("rewards.title")} subtitle={t("rewards.subtitle")} />

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-neutral-bg dark:bg-white/[0.05]">
        <button
          onClick={() => setActiveTab("rewards")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-arabic text-sm font-semibold transition-colors",
            activeTab === "rewards"
              ? "bg-white dark:bg-white/10 text-amber-500 shadow-sm"
              : "text-neutral-muted",
          )}>
          <TbAward className="w-4 h-4" />
          {t("nav.rewards")}
        </button>
        <button
          onClick={() => setActiveTab("challenges")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-arabic text-sm font-semibold transition-colors",
            activeTab === "challenges"
              ? "bg-white dark:bg-white/10 text-orange-500 shadow-sm"
              : "text-neutral-muted",
          )}>
          <TbTrophy className="w-4 h-4" />
          {t("nav.challenges")}
        </button>
      </div>

      {activeTab === "challenges" ? (
        <ChallengesPage embedded />
      ) : (
        <>
          <PointsSummary />
          <BadgeGrid />

          {/* Achievements */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TbAward className="w-5 h-5 text-amber-500" />
              <h3 className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
                {t("rewards.achievements")} ({unlockedIds.length}/
                {ACHIEVEMENTS.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </div>

          <PointsHistory />
        </>
      )}
    </motion.div>
  );
}
