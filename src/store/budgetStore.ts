import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction, CategoryId } from "@/types";
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

interface CategoryBudget {
  category: CategoryId;
  limit: number;
}

interface BudgetStore {
  transactions: Transaction[];
  monthlyIncome: number;
  categoryBudgets: CategoryBudget[];
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => void;
  deleteTransaction: (id: string) => void;
  setMonthlyIncome: (amount: number) => void;
  getTotalByType: (type: "income" | "expense", month?: Date) => number;
  getByCategory: (category: CategoryId) => Transaction[];
  getThisMonth: () => Transaction[];
  setCategoryBudget: (category: CategoryId, limit: number) => void;
  removeCategoryBudget: (category: CategoryId) => void;
  getCategorySpent: (category: CategoryId, month?: Date) => number;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      monthlyIncome: 0,
      categoryBudgets: [],

      addTransaction: (t) => {
        const newTransaction: Transaction = {
          ...t,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      setMonthlyIncome: (amount) => {
        set({ monthlyIncome: amount });
      },

      getTotalByType: (type, month) => {
        const { transactions } = get();
        const target = month ?? new Date();
        const start = startOfMonth(target);
        const end = endOfMonth(target);

        return transactions
          .filter(
            (t) =>
              t.type === type &&
              isWithinInterval(parseISO(t.date), { start, end }),
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getByCategory: (category) => {
        return get().transactions.filter((t) => t.category === category);
      },

      getThisMonth: () => {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        return get().transactions.filter((t) =>
          isWithinInterval(parseISO(t.date), { start, end }),
        );
      },

      setCategoryBudget: (category, limit) => {
        set((state) => {
          const existing = state.categoryBudgets.filter(
            (b) => b.category !== category,
          );
          return {
            categoryBudgets: [...existing, { category, limit }],
          };
        });
      },

      removeCategoryBudget: (category) => {
        set((state) => ({
          categoryBudgets: state.categoryBudgets.filter(
            (b) => b.category !== category,
          ),
        }));
      },

      getCategorySpent: (category, month) => {
        const { transactions } = get();
        const target = month ?? new Date();
        const start = startOfMonth(target);
        const end = endOfMonth(target);
        return transactions
          .filter(
            (t) =>
              t.type === "expense" &&
              t.category === category &&
              isWithinInterval(parseISO(t.date), { start, end }),
          )
          .reduce((sum, t) => sum + t.amount, 0);
      },
    }),
    {
      name: "budget-buddy-budget",
    },
  ),
);
