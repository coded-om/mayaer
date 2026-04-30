import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";

interface ProfileStore extends UserProfile {
  notificationsEnabled: boolean;
  salaryDay: number;
  savingsGoalPercent: number;
  currencyDisplay: "full" | "short" | "symbol";
  onboardingCompleted: boolean;
  setName: (name: string) => void;
  setMonthlyIncome: (income: number) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: "ar" | "en") => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setSalaryDay: (day: number) => void;
  setSavingsGoalPercent: (percent: number) => void;
  setCurrencyDisplay: (display: "full" | "short" | "symbol") => void;
  setOnboardingCompleted: (v: boolean) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      name: "محمد",
      monthlyIncome: 0,
      darkMode: false,
      language: "ar" as const,
      notificationsEnabled: false,
      salaryDay: 25,
      savingsGoalPercent: 20,
      currencyDisplay: "symbol" as const,
      onboardingCompleted: false,

      setName: (name) => set({ name }),
      setMonthlyIncome: (monthlyIncome) => set({ monthlyIncome }),
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
      setSalaryDay: (salaryDay) => set({ salaryDay }),
      setSavingsGoalPercent: (savingsGoalPercent) =>
        set({ savingsGoalPercent }),
      setCurrencyDisplay: (currencyDisplay) => set({ currencyDisplay }),
      setOnboardingCompleted: (onboardingCompleted) =>
        set({ onboardingCompleted }),
      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.darkMode;
          if (newMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { darkMode: newMode };
        }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "budget-buddy-profile",
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add("dark");
        }
      },
    },
  ),
);
