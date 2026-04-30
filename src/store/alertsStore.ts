import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SmartAlert, AlertRule, AlertType } from "@/types/markets";

interface AlertsStore {
  alerts: SmartAlert[];
  rules: AlertRule[];
  addAlert: (alert: Omit<SmartAlert, "id" | "read" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAlerts: () => void;
  getUnreadCount: () => number;
  toggleRule: (type: AlertType) => void;
  isRuleEnabled: (type: AlertType) => boolean;
}

const DEFAULT_RULES: AlertRule[] = [
  { id: "r1", type: "overspending", enabled: true, threshold: 80 },
  { id: "r2", type: "goal_deadline", enabled: true },
  { id: "r3", type: "salary_reminder", enabled: true },
  { id: "r4", type: "savings_tip", enabled: true },
  { id: "r5", type: "investment_opportunity", enabled: false },
  { id: "r6", type: "price_drop", enabled: false, threshold: 5 },
];

export const useAlertsStore = create<AlertsStore>()(
  persist(
    (set, get) => ({
      alerts: [],
      rules: DEFAULT_RULES,

      addAlert: (alert) => {
        const newAlert: SmartAlert = {
          ...alert,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          alerts: [newAlert, ...state.alerts].slice(0, 50), // keep max 50
        }));
      },

      markRead: (id) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, read: true } : a,
          ),
        }));
      },

      markAllRead: () => {
        set((state) => ({
          alerts: state.alerts.map((a) => ({ ...a, read: true })),
        }));
      },

      clearAlerts: () => set({ alerts: [] }),

      getUnreadCount: () => get().alerts.filter((a) => !a.read).length,

      toggleRule: (type) => {
        set((state) => ({
          rules: state.rules.map((r) =>
            r.type === type ? { ...r, enabled: !r.enabled } : r,
          ),
        }));
      },

      isRuleEnabled: (type) =>
        get().rules.find((r) => r.type === type)?.enabled ?? false,
    }),
    { name: "budget-buddy-alerts" },
  ),
);
