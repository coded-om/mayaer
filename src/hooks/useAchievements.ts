import { useEffect, useRef } from "react";
import { useAchievementsStore } from "@/store/achievementsStore";
import { usePointsStore } from "@/store/pointsStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useGoalsStore } from "@/store/goalsStore";
import { useStreakStore } from "@/store/streakStore";
import { useEducationStore } from "@/store/educationStore";

export function useAchievements() {
  const checkAchievements = useAchievementsStore((s) => s.checkAchievements);
  const unlockedIds = useAchievementsStore((s) => s.unlockedIds);
  const points = usePointsStore((s) => s.totalPoints);
  const transactions = useBudgetStore((s) => s.transactions);
  const goals = useGoalsStore((s) => s.goals);
  const streak = useStreakStore((s) => s.currentStreak);
  const educationProgress = useEducationStore((s) => s.progress);
  const prevCountRef = useRef(unlockedIds.length);

  useEffect(() => {
    const newlyUnlocked = checkAchievements();
    if (newlyUnlocked.length > 0) {
      prevCountRef.current = unlockedIds.length + newlyUnlocked.length;
    }
  }, [
    points,
    transactions.length,
    goals.length,
    streak,
    educationProgress,
    checkAchievements,
    unlockedIds.length,
  ]);

  return { unlockedIds };
}
