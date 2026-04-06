import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType =
  | "investment"
  | "market"
  | "budget"
  | "goal"
  | "salary"
  | "tip";

export interface AppNotification {
  id: string;
  type: NotificationType;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  createdAt: string;
  read: boolean;
}

interface NotificationsStore {
  notifications: AppNotification[];
  addNotification: (
    n: Omit<AppNotification, "id" | "createdAt" | "read">,
  ) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: () => number;
}

// ── Test / seed notifications ──
const SEED: Omit<AppNotification, "id" | "createdAt" | "read">[] = [
  {
    type: "investment",
    titleAr: "فرصة استثمارية 📈",
    titleEn: "Investment Opportunity 📈",
    bodyAr: "سهم BKMB ارتفع 4.2% اليوم — قد يكون وقت مناسب للمراجعة",
    bodyEn: "BKMB stock rose 4.2% today — might be a good time to review",
  },
  {
    type: "market",
    titleAr: "تنبيه: هبوط في السوق ⚠️",
    titleEn: "Market Drop Alert ⚠️",
    bodyAr: "مؤشر MSM انخفض 1.8% — راجع محفظتك",
    bodyEn: "MSM index dropped 1.8% — review your portfolio",
  },
  {
    type: "budget",
    titleAr: "تجاوز ميزانية الطعام 🍽️",
    titleEn: "Food Budget Exceeded 🍽️",
    bodyAr: "أنفقت 85% من ميزانية الطعام لهذا الشهر",
    bodyEn: "You've spent 85% of your food budget this month",
  },
  {
    type: "goal",
    titleAr: "اقتربت من هدفك! 🎯",
    titleEn: "Goal Almost Reached! 🎯",
    bodyAr: "تبقى 15% فقط للوصول لهدف الادخار",
    bodyEn: "Only 15% left to reach your savings goal",
  },
  {
    type: "tip",
    titleAr: "نصيحة مالية 💡",
    titleEn: "Financial Tip 💡",
    bodyAr: "قاعدة 50/30/20: خصص 20% من دخلك للادخار كل شهر",
    bodyEn: "50/30/20 rule: allocate 20% of your income to savings every month",
  },
];

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      notifications: SEED.map((n, i) => ({
        ...n,
        id: `seed-${i}`,
        createdAt: new Date(Date.now() - i * 3_600_000).toISOString(),
        read: false,
      })),

      addNotification: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 50),
        })),

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      clearAll: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: "meyaar-notifications" },
  ),
);
