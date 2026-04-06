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

// ── Education ──
export type EducationCategory =
  | "saving"
  | "investing"
  | "budgeting"
  | "islamic_finance";

export interface EducationStep {
  id: string;
  contentKey: string;
  type: "text" | "quiz" | "tip";
  quizOptions?: string[];
  correctAnswer?: number;
}

export interface EducationLesson {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: EducationCategory;
  steps: EducationStep[];
  pointsReward: number;
}

export interface EducationProgress {
  lessonId: string;
  completedSteps: string[];
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

// ── Achievements & Badges ──
export type BadgeTier = "bronze" | "silver" | "gold";

export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  condition: string;
  unlockedAt?: string;
}

export interface Badge {
  id: string;
  nameKey: string;
  icon: string;
  tier: BadgeTier;
  requiredPoints: number;
}

// ── Stocks / Investments ──
export interface StockHolding {
  id: string;
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  purchaseDate: string;
  currency: string;
}

export interface StockQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  lastUpdated: string;
}

// ── Financial Month ──
export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: CategoryId;
  isRecurring: boolean;
}

export interface FinancialMonthConfig {
  salaryDay: number;
  reminderDaysBefore: number;
  fixedExpenses: FixedExpense[];
}
