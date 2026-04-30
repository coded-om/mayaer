import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACHIEVEMENTS } from "@/constants";
import { usePointsStore, POINT_VALUES } from "@/store/pointsStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useGoalsStore } from "@/store/goalsStore";
import { useStreakStore } from "@/store/streakStore";
import { useCharityStore } from "@/store/charityStore";
import { useEducationStore } from "@/store/educationStore";

interface AchievementsStore {
  unlockedIds: string[];
  checkAchievements: () => string[];
  isUnlocked: (id: string) => boolean;
  getUnlockDate: (id: string) => string | undefined;
  unlockDates: Record<string, string>;
}

export const useAchievementsStore = create<AchievementsStore>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      unlockDates: {},

      checkAchievements: () => {
        const { unlockedIds } = get();
        const newlyUnlocked: string[] = [];

        const points = usePointsStore.getState().totalPoints;
        const streak = useStreakStore.getState().currentStreak;
        const transactions = useBudgetStore.getState().transactions;
        const goals = useGoalsStore.getState().goals;
        const charity = useCharityStore.getState().entries;
        const education = useEducationStore.getState();

        const conditions: Record<string, boolean> = {
          first_transaction: transactions.length >= 1,
          first_goal: goals.length >= 1,
          streak_7: streak >= 7,
          streak_30: streak >= 30,
          points_100: points >= 100,
          points_500: points >= 500,
          complete_course: education.getCompletedCount() >= 1,
          budget_master: false, // checked elsewhere
          charity_giver: charity.length >= 1,
          zakat_paid: false, // checked elsewhere
          all_categories:
            new Set(transactions.map((t) => t.category)).size >= 9,
          investment_profit: false, // checked in stocks
        };

        for (const achievement of ACHIEVEMENTS) {
          if (
            !unlockedIds.includes(achievement.id) &&
            conditions[achievement.condition]
          ) {
            newlyUnlocked.push(achievement.id);
          }
        }

        if (newlyUnlocked.length > 0) {
          const now = new Date().toISOString();
          set((state) => {
            const newDates = { ...state.unlockDates };
            newlyUnlocked.forEach((id) => {
              newDates[id] = now;
            });
            return {
              unlockedIds: [...state.unlockedIds, ...newlyUnlocked],
              unlockDates: newDates,
            };
          });

          newlyUnlocked.forEach(() => {
            usePointsStore
              .getState()
              .addPoints(POINT_VALUES.UNLOCK_ACHIEVEMENT, "unlock_achievement");
          });
        }

        return newlyUnlocked;
      },

      isUnlocked: (id) => get().unlockedIds.includes(id),

      getUnlockDate: (id) => get().unlockDates[id],
    }),
    { name: "budget-buddy-achievements" },
  ),
);
