import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AdvisorAnswers,
  InvestmentPlan,
  RiskTolerance,
} from "@/types/markets";
import { generateInvestmentPlan } from "@/lib/advisor";

interface AdvisorStore {
  answers: AdvisorAnswers | null;
  plan: InvestmentPlan | null;
  step: number;
  setAnswers: (a: AdvisorAnswers) => void;
  generatePlan: () => void;
  resetPlan: () => void;
  setStep: (s: number) => void;
}

export const useAdvisorStore = create<AdvisorStore>()(
  persist(
    (set, get) => ({
      answers: null,
      plan: null,
      step: 0,

      setAnswers: (answers) => set({ answers }),

      generatePlan: () => {
        const { answers } = get();
        if (!answers) return;
        const plan = generateInvestmentPlan(answers);
        set({ plan });
      },

      resetPlan: () => set({ answers: null, plan: null, step: 0 }),

      setStep: (step) => set({ step }),
    }),
    { name: "budget-buddy-advisor" },
  ),
);
