import { useStreakStore } from "@/store/streakStore";

export function useStreak() {
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const longestStreak = useStreakStore((s) => s.longestStreak);
  const lastCheckIn = useStreakStore((s) => s.lastCheckIn);
  const freezesLeft = useStreakStore((s) => s.freezesLeft);
  const checkInToday = useStreakStore((s) => s.checkInToday);
  const useFreeze = useStreakStore((s) => s.useFreeze);

  const isHighStreak = currentStreak >= 7;

  return {
    currentStreak,
    longestStreak,
    lastCheckIn,
    freezesLeft,
    isHighStreak,
    checkInToday,
    useFreeze,
  };
}
