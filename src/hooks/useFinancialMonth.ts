import { useMemo } from "react";
import { useFinancialMonthStore } from "@/store/financialMonthStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useProfileStore } from "@/store/profileStore";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  parseISO,
  isWithinInterval,
  differenceInDays,
  setDate,
  addMonths,
  isBefore,
} from "date-fns";
import type { CategoryId } from "@/types";

export function useFinancialMonth() {
  const config = useFinancialMonthStore((s) => s.config);
  const transactions = useBudgetStore((s) => s.transactions);
  const monthlyIncome = useProfileStore((s) => s.monthlyIncome);

  return useMemo(() => {
    if (!config) {
      return {
        configured: false,
        daysUntilSalary: 0,
        dailyBudget: 0,
        remainingBudget: 0,
        fixedTotal: 0,
        predictions: [] as {
          category: CategoryId;
          predicted: number;
          actual: number;
        }[],
        surplus: 0,
      };
    }

    const now = new Date();
    const { salaryDay, fixedExpenses } = config;

    // Calculate next salary date
    let nextSalary = setDate(now, salaryDay);
    if (isBefore(nextSalary, now) || nextSalary.getDate() === now.getDate()) {
      nextSalary = setDate(addMonths(now, 1), salaryDay);
    }
    const daysUntilSalary = Math.max(0, differenceInDays(nextSalary, now));

    // Fixed expenses total
    const fixedTotal = fixedExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Current month spending
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const thisMonthExpenses = transactions.filter(
      (tx) =>
        tx.type === "expense" &&
        isWithinInterval(parseISO(tx.date), {
          start: monthStart,
          end: monthEnd,
        }),
    );
    const totalSpentThisMonth = thisMonthExpenses.reduce(
      (sum, tx) => sum + tx.amount,
      0,
    );

    // Remaining budget
    const remainingBudget = monthlyIncome - totalSpentThisMonth;

    // Daily budget
    const dailyBudget =
      daysUntilSalary > 0
        ? Math.max(0, (remainingBudget - fixedTotal) / daysUntilSalary)
        : 0;

    // Smart prediction: average of last 3 months per category
    const predictions: {
      category: CategoryId;
      predicted: number;
      actual: number;
    }[] = [];
    const categories: CategoryId[] = [
      "food",
      "transport",
      "entertainment",
      "health",
      "shopping",
      "education",
      "savings",
      "bills",
      "other",
    ];

    for (const cat of categories) {
      let totalLast3 = 0;
      let monthsWithData = 0;

      for (let i = 1; i <= 3; i++) {
        const m = subMonths(now, i);
        const mStart = startOfMonth(m);
        const mEnd = endOfMonth(m);
        const catTotal = transactions
          .filter(
            (tx) =>
              tx.type === "expense" &&
              tx.category === cat &&
              isWithinInterval(parseISO(tx.date), { start: mStart, end: mEnd }),
          )
          .reduce((sum, tx) => sum + tx.amount, 0);
        if (catTotal > 0) {
          totalLast3 += catTotal;
          monthsWithData++;
        }
      }

      const predicted = monthsWithData > 0 ? totalLast3 / monthsWithData : 0;
      const actual = thisMonthExpenses
        .filter((tx) => tx.category === cat)
        .reduce((sum, tx) => sum + tx.amount, 0);

      if (predicted > 0 || actual > 0) {
        predictions.push({ category: cat, predicted, actual });
      }
    }

    // Estimated surplus/deficit
    const totalPredicted = predictions.reduce((sum, p) => sum + p.predicted, 0);
    const surplus = monthlyIncome - fixedTotal - totalPredicted;

    return {
      configured: true,
      daysUntilSalary,
      dailyBudget,
      remainingBudget,
      fixedTotal,
      predictions: predictions.sort((a, b) => b.predicted - a.predicted),
      surplus,
    };
  }, [config, transactions, monthlyIncome]);
}
