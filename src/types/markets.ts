// ── Market Infrastructure ──

export type MarketId = "msm" | "tadawul" | "dfm" | "global";

export type HalalStatus = "halal" | "suspicious" | "non_compliant";

export type AssetType = "stock" | "sukuk" | "fund";

export interface MarketIndex {
  id: string;
  marketId: MarketId;
  nameKey: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface LocalStock {
  symbol: string;
  nameAr: string;
  nameEn: string;
  marketId: MarketId;
  sector: string;
  sectorAr: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  currency: string;
  halalStatus: HalalStatus;
  halalReason?: string;
  lastUpdated: string;
}

export interface Sukuk {
  id: string;
  nameAr: string;
  nameEn: string;
  issuer: string;
  issuerAr: string;
  marketId: MarketId;
  yieldPercent: number;
  maturityDate: string;
  faceValue: number;
  currentPrice: number;
  currency: string;
  rating: string;
  halalStatus: HalalStatus;
}

export interface InvestmentFund {
  id: string;
  nameAr: string;
  nameEn: string;
  managerAr: string;
  managerEn: string;
  marketId: MarketId;
  nav: number;
  navChange: number;
  navChangePercent: number;
  ytdReturn: number;
  expenseRatio: number;
  currency: string;
  category: string;
  categoryAr: string;
  halalStatus: HalalStatus;
}

// ── Advisor ──

export type RiskTolerance = "low" | "medium" | "high";

export type InvestmentGoal =
  | "car"
  | "marriage"
  | "retirement"
  | "house"
  | "education"
  | "emergency"
  | "wealth";

export type AgeRange = "18-25" | "26-35" | "36-45" | "46-55" | "56+";

export interface AdvisorAnswers {
  monthlyIncome: number;
  monthlyExpenses: number;
  ageRange: AgeRange;
  goals: InvestmentGoal[];
  riskTolerance: RiskTolerance;
  hasExperience: boolean;
}

export interface InvestmentAllocation {
  stocks: number;
  sukuk: number;
  gold: number;
  realEstate: number;
  cash: number;
}

export interface InvestmentPlan {
  allocation: InvestmentAllocation;
  monthlyTarget: number;
  tips: string[];
  riskLevel: RiskTolerance;
  timelineYears: number;
}

// ── Alerts ──

export type AlertType =
  | "price_drop"
  | "overspending"
  | "goal_deadline"
  | "salary_reminder"
  | "investment_opportunity"
  | "savings_tip";

export interface SmartAlert {
  id: string;
  type: AlertType;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  data?: Record<string, string | number>;
  read: boolean;
  createdAt: string;
}

export interface AlertRule {
  id: string;
  type: AlertType;
  enabled: boolean;
  threshold?: number;
}
