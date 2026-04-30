import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  format,
  differenceInCalendarDays,
  startOfWeek,
  isAfter,
} from "date-fns";
import { usePointsStore, POINT_VALUES } from "@/store/pointsStore";

interface StreakStore {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  freezesLeft: number;
  lastFreezeReset: string | null;
  checkInToday: () => void;
  useFreeze: () => void;
  resetStreak: () => void;
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: null,
      freezesLeft: 1,
      lastFreezeReset: null,

      checkInToday: () => {
        const today = format(new Date(), "yyyy-MM-dd");
        const { lastCheckIn, currentStreak, longestStreak } = get();

        if (lastCheckIn === today) return; // already checked in

        const daysDiff = lastCheckIn
          ? differenceInCalendarDays(new Date(today), new Date(lastCheckIn))
          : 0;

        let newStreak: number;
        if (!lastCheckIn || daysDiff > 2) {
          // First time or streak broken (more than 1 day gap, no freeze)
          newStreak = 1;
        } else if (daysDiff === 1) {
          // Consecutive day
          newStreak = currentStreak + 1;
        } else if (daysDiff === 2) {
          // One day gap — check if freeze was used
          // If streak is still active, the freeze was implicitly used
          newStreak = currentStreak + 1;
        } else {
          newStreak = currentStreak;
        }

        // Reset freeze weekly
        const weekStart = format(
          startOfWeek(new Date(), { weekStartsOn: 6 }),
          "yyyy-MM-dd",
        );
        const { lastFreezeReset } = get();
        const shouldResetFreeze =
          !lastFreezeReset ||
          isAfter(new Date(weekStart), new Date(lastFreezeReset));

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastCheckIn: today,
          ...(shouldResetFreeze
            ? { freezesLeft: 1, lastFreezeReset: weekStart }
            : {}),
        });

        usePointsStore
          .getState()
          .addPoints(POINT_VALUES.DAILY_LOGIN, "daily_login");
      },

      useFreeze: () => {
        const { freezesLeft } = get();
        if (freezesLeft <= 0) return;
        set({ freezesLeft: freezesLeft - 1 });
      },

      resetStreak: () => {
        set({ currentStreak: 0, lastCheckIn: null });
      },
    }),
    {
      name: "budget-buddy-streak",
    },
  ),
);
