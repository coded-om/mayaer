import { useBudgetStore } from "@/store/budgetStore";
import { useProfileStore } from "@/store/profileStore";

export function useBudgetSummary() {
  const getTotalByType = useBudgetStore((s) => s.getTotalByType);
  const getThisMonth = useBudgetStore((s) => s.getThisMonth);
  const monthlyIncome = useProfileStore((s) => s.monthlyIncome);

  const transactionIncome = getTotalByType("income");
  const income = monthlyIncome + transactionIncome;
  const expense = getTotalByType("expense");
  const savings = income - expense;
  const thisMonth = getThisMonth();

  return { income, expense, savings, thisMonth };
}
