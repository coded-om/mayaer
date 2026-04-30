import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FinancialMonthConfig, FixedExpense } from "@/types";

interface FinancialMonthStore {
  config: FinancialMonthConfig | null;
  isConfigured: boolean;
  setConfig: (config: FinancialMonthConfig) => void;
  addFixedExpense: (expense: Omit<FixedExpense, "id">) => void;
  removeFixedExpense: (id: string) => void;
  updateFixedExpense: (id: string, data: Partial<FixedExpense>) => void;
  getFixedExpensesTotal: () => number;
  resetConfig: () => void;
}

export const useFinancialMonthStore = create<FinancialMonthStore>()(
  persist(
    (set, get) => ({
      config: null,
      isConfigured: false,

      setConfig: (config) => {
        set({ config, isConfigured: true });
      },

      addFixedExpense: (expense) => {
        const { config } = get();
        if (!config) return;
        const newExpense: FixedExpense = {
          ...expense,
          id: crypto.randomUUID(),
        };
        set({
          config: {
            ...config,
            fixedExpenses: [...config.fixedExpenses, newExpense],
          },
        });
      },

      removeFixedExpense: (id) => {
        const { config } = get();
        if (!config) return;
        set({
          config: {
            ...config,
            fixedExpenses: config.fixedExpenses.filter((e) => e.id !== id),
          },
        });
      },

      updateFixedExpense: (id, data) => {
        const { config } = get();
        if (!config) return;
        set({
          config: {
            ...config,
            fixedExpenses: config.fixedExpenses.map((e) =>
              e.id === id ? { ...e, ...data } : e,
            ),
          },
        });
      },

      getFixedExpensesTotal: () => {
        const { config } = get();
        if (!config) return 0;
        return config.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
      },

      resetConfig: () => {
        set({ config: null, isConfigured: false });
      },
    }),
    { name: "budget-buddy-financial-month" },
  ),
);
