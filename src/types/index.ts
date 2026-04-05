export type CategoryId =
  | "food"
  | "transport"
  | "entertainment"
  | "health"
  | "shopping"
  | "education"
  | "savings"
  | "bills"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: CategoryId;
  note?: string;
  date: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
  icon?: string;
  createdAt: string;
}

export interface ZakatResult {
  due: boolean;
  amount: number;
  reason?: string;
  nisab?: number;
  savings?: number;
  percentage?: number;
}

export interface UserProfile {
  name: string;
  monthlyIncome: number;
  darkMode: boolean;
  language: "ar" | "en";
}
