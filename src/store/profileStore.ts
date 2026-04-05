import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";

interface ProfileStore extends UserProfile {
  notificationsEnabled: boolean;
  setName: (name: string) => void;
  setMonthlyIncome: (income: number) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: "ar" | "en") => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      name: "محمد",
      monthlyIncome: 0,
      darkMode: false,
      language: "ar" as const,
      notificationsEnabled: false,

      setName: (name) => set({ name }),
      setMonthlyIncome: (monthlyIncome) => set({ monthlyIncome }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
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
