import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, startOfWeek } from "date-fns";

export interface Challenge {
  id: string;
  type: "no_spend" | "save_amount" | "log_daily" | "under_budget" | "charity";
  titleKey: string;
  descKey: string;
  target: number;
  progress: number;
  completed: boolean;
  points: number;
  weekStart: string;
}

interface ChallengesStore {
  challenges: Challenge[];
  completedCount: number;
  generateWeeklyChallenges: () => void;
  updateProgress: (id: string, progress: number) => void;
  completeChallenge: (id: string) => void;
}

function getWeekKey() {
  return format(startOfWeek(new Date(), { weekStartsOn: 6 }), "yyyy-MM-dd");
}

const CHALLENGE_TEMPLATES: Omit<
  Challenge,
  "id" | "progress" | "completed" | "weekStart"
>[] = [
  {
    type: "no_spend",
    titleKey: "challenges.noSpendTitle",
    descKey: "challenges.noSpendDesc",
    target: 1,
    points: 25,
  },
  {
    type: "save_amount",
    titleKey: "challenges.saveTitle",
    descKey: "challenges.saveDesc",
    target: 10,
    points: 30,
  },
  {
    type: "log_daily",
    titleKey: "challenges.logDailyTitle",
    descKey: "challenges.logDailyDesc",
    target: 7,
    points: 20,
  },
  {
    type: "under_budget",
    titleKey: "challenges.underBudgetTitle",
    descKey: "challenges.underBudgetDesc",
    target: 1,
    points: 35,
  },
  {
    type: "charity",
    titleKey: "challenges.charityTitle",
    descKey: "challenges.charityDesc",
    target: 1,
    points: 25,
  },
];

export const useChallengesStore = create<ChallengesStore>()(
  persist(
    (set, get) => ({
      challenges: [],
      completedCount: 0,

      generateWeeklyChallenges: () => {
        const weekKey = getWeekKey();
        const existing = get().challenges;
        if (existing.length > 0 && existing[0].weekStart === weekKey) return;

        // Pick 3 random challenges
        const shuffled = [...CHALLENGE_TEMPLATES].sort(
          () => Math.random() - 0.5,
        );
        const picked = shuffled.slice(0, 3);

        set({
          challenges: picked.map((tpl) => ({
            ...tpl,
            id: crypto.randomUUID(),
            progress: 0,
            completed: false,
            weekStart: weekKey,
          })),
        });
      },

      updateProgress: (id, progress) => {
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === id ? { ...c, progress: Math.min(progress, c.target) } : c,
          ),
        }));
      },

      completeChallenge: (id) => {
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === id ? { ...c, completed: true, progress: c.target } : c,
          ),
          completedCount: state.completedCount + 1,
        }));
      },
    }),
    { name: "budget-buddy-challenges" },
  ),
);
