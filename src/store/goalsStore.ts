import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavingsGoal } from "@/types";
import { usePointsStore, POINT_VALUES } from "@/store/pointsStore";

interface GoalsStore {
  goals: SavingsGoal[];
  addGoal: (g: Omit<SavingsGoal, "id" | "createdAt">) => void;
  updateGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (g) => {
        const newGoal: SavingsGoal = {
          ...g,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoal: (id, amount) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, savedAmount: g.savedAmount + amount } : g,
          ),
        }));
        const updated = get().goals.find((g) => g.id === id);
        if (updated && updated.savedAmount >= updated.targetAmount) {
          usePointsStore
            .getState()
            .addPoints(POINT_VALUES.REACH_GOAL, "goal_reached");
        }
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },
    }),
    {
      name: "budget-buddy-goals",
    },
  ),
);
