import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useChallengesStore } from "@/store/challengesStore";
import { usePointsStore } from "@/store/pointsStore";
import { TbTrophy, TbFlame, TbCheck } from "react-icons/tb";
import { cn } from "@/lib/utils";

export function ChallengesPage() {
  const { challenges, generateWeeklyChallenges, completeChallenge } =
    useChallengesStore();
  const addPoints = usePointsStore((s) => s.addPoints);
  const totalPoints = usePointsStore((s) => s.totalPoints);
  const level = usePointsStore((s) => s.level);
  const completedCount = useChallengesStore((s) => s.completedCount);
  const { t } = useTranslation();

  useEffect(() => {
    generateWeeklyChallenges();
  }, [generateWeeklyChallenges]);

  const handleComplete = (id: string, points: number) => {
    completeChallenge(id);
    addPoints(points, "challenge_complete");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-arabic text-xl font-bold text-neutral-text dark:text-white">
          {t("challenges.title")}
        </h1>
        <p className="font-arabic text-sm text-neutral-muted dark:text-gray-400">
          {t("challenges.subtitle")}
        </p>
      </div>

      {/* Points + Level card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 dark:from-gold/10 dark:to-transparent border border-gold/30 dark:border-gold/20 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <TbTrophy className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
                {t("challenges.level")} {level}
              </p>
              <p className="font-mono text-xs text-neutral-muted">
                {totalPoints} {t("challenges.points")}
              </p>
            </div>
          </div>
          <div className="text-left">
            <p className="font-mono text-2xl font-bold text-gold">
              {completedCount}
            </p>
            <p className="font-arabic text-[10px] text-neutral-muted">
              {t("challenges.completed")}
            </p>
          </div>
        </div>
        {/* Progress to next level */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-arabic text-[10px] text-neutral-muted">
              {t("challenges.nextLevel")}
            </span>
            <span className="font-mono text-[10px] text-neutral-muted">
              {totalPoints % 100}/100
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral-bg dark:bg-gray-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalPoints % 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gold"
            />
          </div>
        </div>
      </motion.div>

      {/* Weekly Challenges */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TbFlame className="w-5 h-5 text-orange-500" />
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
            {t("challenges.weeklyChallenges")}
          </p>
        </div>

        <div className="space-y-3">
          {challenges.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "rounded-2xl border p-4 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]",
                challenge.completed
                  ? "border-success/30 bg-green-50/80 dark:bg-green-950/20"
                  : "border-white/70 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04]",
              )}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-arabic text-sm font-semibold",
                      challenge.completed
                        ? "text-success"
                        : "text-neutral-text dark:text-white",
                    )}>
                    {challenge.completed && (
                      <TbCheck className="w-4 h-4 inline-block me-1" />
                    )}
                    {t(challenge.titleKey)}
                  </p>
                  <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400 mt-0.5">
                    {t(challenge.descKey)}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-gold bg-gold/10 px-2 py-1 rounded-lg shrink-0">
                  +{challenge.points}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-arabic text-[10px] text-neutral-muted">
                    {t("challenges.progress")}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-muted">
                    {challenge.progress}/{challenge.target}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-bg dark:bg-gray-800 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      challenge.completed ? "bg-success" : "bg-primary",
                    )}
                    style={{
                      width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Manual complete button (for demo) */}
              {!challenge.completed && (
                <button
                  onClick={() => handleComplete(challenge.id, challenge.points)}
                  className="mt-3 w-full py-2 rounded-lg bg-primary text-white font-arabic text-xs font-semibold hover:bg-primary-700 transition-colors">
                  {t("challenges.markComplete")}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
