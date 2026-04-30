import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscription, BillingCycle } from "@/types";

// ── helpers ───────────────────────────────────────────────────────────────────

/** Advance a date by one billing cycle, repeatedly, until it is in the future. */
function computeNextRenewal(startDate: string, cycle: BillingCycle): string {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let next = new Date(start);

  while (next <= today) {
    if (cycle === "monthly") {
      next.setMonth(next.getMonth() + 1);
    } else if (cycle === "quarterly") {
      next.setMonth(next.getMonth() + 3);
    } else {
      next.setFullYear(next.getFullYear() + 1);
    }
  }

  return next.toISOString();
}

/** Convert any amount to its monthly equivalent. */
export function toMonthlyAmount(amount: number, cycle: BillingCycle): number {
  if (cycle === "monthly") return amount;
  if (cycle === "quarterly") return amount / 3;
  return amount / 12; // yearly
}

// ── store interface ───────────────────────────────────────────────────────────

interface SubscriptionsStore {
  subscriptions: Subscription[];

  addSubscription: (
    s: Omit<Subscription, "id" | "nextRenewalDate" | "createdAt">,
  ) => void;
  updateSubscription: (
    id: string,
    changes: Partial<Omit<Subscription, "id" | "createdAt">>,
  ) => void;
  deleteSubscription: (id: string) => void;
  toggleActive: (id: string) => void;

  /** Total monthly cost of all active subscriptions */
  getTotalMonthly: () => number;
  /** Active subscriptions renewing within `days` days */
  getUpcomingRenewals: (days: number) => Subscription[];
}

// ── store ─────────────────────────────────────────────────────────────────────

export const useSubscriptionsStore = create<SubscriptionsStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],

      addSubscription: (s) => {
        const newSub: Subscription = {
          ...s,
          id: crypto.randomUUID(),
          nextRenewalDate: computeNextRenewal(s.startDate, s.billingCycle),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          subscriptions: [...state.subscriptions, newSub],
        }));
      },

      updateSubscription: (id, changes) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) => {
            if (s.id !== id) return s;
            const updated = { ...s, ...changes };
            // Recompute renewal if start date or cycle changed
            if (changes.startDate || changes.billingCycle) {
              updated.nextRenewalDate = computeNextRenewal(
                updated.startDate,
                updated.billingCycle,
              );
            }
            return updated;
          }),
        }));
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        }));
      },

      toggleActive: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, isActive: !s.isActive } : s,
          ),
        }));
      },

      getTotalMonthly: () => {
        return get()
          .subscriptions.filter((s) => s.isActive)
          .reduce(
            (sum, s) => sum + toMonthlyAmount(s.amount, s.billingCycle),
            0,
          );
      },

      getUpcomingRenewals: (days) => {
        const now = new Date();
        const limit = new Date();
        limit.setDate(limit.getDate() + days);
        return get()
          .subscriptions.filter((s) => {
            if (!s.isActive) return false;
            const renewal = new Date(s.nextRenewalDate);
            return renewal >= now && renewal <= limit;
          })
          .sort(
            (a, b) =>
              new Date(a.nextRenewalDate).getTime() -
              new Date(b.nextRenewalDate).getTime(),
          );
      },
    }),
    { name: "budget-buddy-subscriptions" },
  ),
);
