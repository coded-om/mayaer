import { useEffect, useRef } from "react";
import { useAlertsStore } from "@/store/alertsStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useGoalsStore } from "@/store/goalsStore";
import { useProfileStore } from "@/store/profileStore";

/**
 * Runs alert checks reactively whenever relevant store data changes.
 * Call once at app root level.
 */
export function useAlerts() {
  const addAlert = useAlertsStore((s) => s.addAlert);
  const rules = useAlertsStore((s) => s.rules);
  const transactions = useBudgetStore((s) => s.transactions);
  const monthlyIncome = useProfileStore((s) => s.monthlyIncome);
  const goals = useGoalsStore((s) => s.goals);
  const lastCheck = useRef<string>("");

  useEffect(() => {
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    if (lastCheck.current === todayKey) return; // once per day
    lastCheck.current = todayKey;

    // ─ Overspending check ─
    const overspendingRule = rules.find((r) => r.type === "overspending");
    if (overspendingRule?.enabled && monthlyIncome > 0) {
      const month = now.getMonth();
      const year = now.getFullYear();
      const monthExpenses = transactions
        .filter((t) => {
          const d = new Date(t.date);
          return (
            t.type === "expense" &&
            d.getMonth() === month &&
            d.getFullYear() === year
          );
        })
        .reduce((s, t) => s + t.amount, 0);

      const pct = (monthExpenses / monthlyIncome) * 100;
      const threshold = overspendingRule.threshold ?? 80;
      if (pct >= threshold) {
        addAlert({
          type: "overspending",
          titleKey: "alerts.overspending.title",
          descriptionKey: "alerts.overspending.desc",
          icon: "TbAlertTriangle",
          data: { percent: Math.round(pct) },
        });
      }
    }

    // ─ Goal deadline check ─
    const goalRule = rules.find((r) => r.type === "goal_deadline");
    if (goalRule?.enabled) {
      for (const g of goals) {
        if (!g.targetDate) continue;
        const deadline = new Date(g.targetDate);
        const daysLeft = Math.ceil(
          (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysLeft > 0 && daysLeft <= 7 && g.savedAmount < g.targetAmount) {
          addAlert({
            type: "goal_deadline",
            titleKey: "alerts.goalDeadline.title",
            descriptionKey: "alerts.goalDeadline.desc",
            icon: "TbTarget",
            data: { days: daysLeft, goal: g.name },
          });
        }
      }
    }

    // ─ Savings tip ─
    const savingsRule = rules.find((r) => r.type === "savings_tip");
    if (savingsRule?.enabled && monthlyIncome > 0) {
      const month = now.getMonth();
      const year = now.getFullYear();
      const monthExpenses = transactions
        .filter((t) => {
          const d = new Date(t.date);
          return (
            t.type === "expense" &&
            d.getMonth() === month &&
            d.getFullYear() === year
          );
        })
        .reduce((s, t) => s + t.amount, 0);

      const savingsRate =
        ((monthlyIncome - monthExpenses) / monthlyIncome) * 100;
      if (savingsRate < 20 && savingsRate > 0) {
        addAlert({
          type: "savings_tip",
          titleKey: "alerts.savingsTip.title",
          descriptionKey: "alerts.savingsTip.desc",
          icon: "TbPigMoney",
          data: { rate: Math.round(savingsRate) },
        });
      }
    }
  }, [transactions, goals, monthlyIncome, rules, addAlert]);
}
