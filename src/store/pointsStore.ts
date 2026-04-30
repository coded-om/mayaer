import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PointsStore {
  totalPoints: number;
  level: number;
  history: { id: string; reason: string; amount: number; date: string }[];
  addPoints: (amount: number, reason: string) => void;
  getLevel: () => number;
}

const POINTS_PER_LEVEL = 100;

export const usePointsStore = create<PointsStore>()(
  persist(
    (set, get) => ({
      totalPoints: 0,
      level: 1,
      history: [],

      addPoints: (amount, reason) => {
        set((state) => {
          const newTotal = state.totalPoints + amount;
          return {
            totalPoints: newTotal,
            level: Math.floor(newTotal / POINTS_PER_LEVEL) + 1,
            history: [
              {
                id: crypto.randomUUID(),
                reason,
                amount,
                date: new Date().toISOString(),
              },
              ...state.history,
            ].slice(0, 50), // keep last 50
          };
        });
      },

      getLevel: () => {
        const { totalPoints } = get();
        return Math.floor(totalPoints / POINTS_PER_LEVEL) + 1;
      },
    }),
    { name: "budget-buddy-points" },
  ),
);

/** Point values for actions */
export const POINT_VALUES = {
  ADD_TRANSACTION: 5,
  DAILY_LOGIN: 10,
  COMPLETE_CHALLENGE: 25,
  REACH_GOAL: 50,
  CHARITY_DONATION: 15,
  COMPLETE_LESSON: 20,
  UNLOCK_ACHIEVEMENT: 10,
} as const;
