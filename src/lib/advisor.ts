import type {
  AdvisorAnswers,
  InvestmentAllocation,
  InvestmentPlan,
  RiskTolerance,
} from "@/types/markets";

/**
 * Rule-based investment advisor engine.
 * No external APIs — uses deterministic allocation formulas based on
 * user profile, risk tolerance, and goals.
 */

const BASE_ALLOCATIONS: Record<RiskTolerance, InvestmentAllocation> = {
  low: { stocks: 10, sukuk: 35, gold: 20, realEstate: 15, cash: 20 },
  medium: { stocks: 30, sukuk: 25, gold: 15, realEstate: 20, cash: 10 },
  high: { stocks: 50, sukuk: 15, gold: 10, realEstate: 20, cash: 5 },
};

function adjustForAge(
  alloc: InvestmentAllocation,
  age: AdvisorAnswers["ageRange"],
): InvestmentAllocation {
  const a = { ...alloc };
  switch (age) {
    case "18-25":
      a.stocks += 5;
      a.cash -= 5;
      break;
    case "26-35":
      a.stocks += 3;
      a.sukuk -= 3;
      break;
    case "46-55":
      a.stocks -= 5;
      a.sukuk += 5;
      break;
    case "56+":
      a.stocks -= 10;
      a.sukuk += 5;
      a.cash += 5;
      break;
  }
  return clamp(a);
}

function adjustForGoals(
  alloc: InvestmentAllocation,
  goals: AdvisorAnswers["goals"],
): InvestmentAllocation {
  const a = { ...alloc };

  if (goals.includes("house") || goals.includes("marriage")) {
    a.realEstate += 5;
    a.stocks -= 3;
    a.gold -= 2;
  }

  if (goals.includes("retirement")) {
    a.sukuk += 5;
    a.cash -= 3;
    a.stocks -= 2;
  }

  if (goals.includes("emergency")) {
    a.cash += 10;
    a.stocks -= 5;
    a.realEstate -= 5;
  }

  if (goals.includes("wealth")) {
    a.stocks += 5;
    a.cash -= 5;
  }

  return clamp(a);
}

function clamp(a: InvestmentAllocation): InvestmentAllocation {
  const keys: (keyof InvestmentAllocation)[] = [
    "stocks",
    "sukuk",
    "gold",
    "realEstate",
    "cash",
  ];
  for (const k of keys) {
    a[k] = Math.max(0, Math.min(100, Math.round(a[k])));
  }
  // Normalize to 100%
  const total = keys.reduce((s, k) => s + a[k], 0);
  if (total !== 100) {
    const diff = 100 - total;
    a.cash = Math.max(0, a.cash + diff);
  }
  return a;
}

function computeTimeline(goals: AdvisorAnswers["goals"]): number {
  if (goals.includes("emergency")) return 1;
  if (goals.includes("car")) return 3;
  if (goals.includes("marriage") || goals.includes("education")) return 5;
  if (goals.includes("house")) return 10;
  if (goals.includes("retirement")) return 20;
  return 7;
}

function generateTipKeys(
  alloc: InvestmentAllocation,
  answers: AdvisorAnswers,
): string[] {
  const tips: string[] = [];

  if (answers.monthlyExpenses / answers.monthlyIncome > 0.7) {
    tips.push("advisor.tips.reduceExpenses");
  }

  if (!answers.hasExperience) {
    tips.push("advisor.tips.startSmall");
  }

  if (alloc.stocks >= 40) {
    tips.push("advisor.tips.diversifyStocks");
  }

  if (alloc.sukuk >= 25) {
    tips.push("advisor.tips.sukukSafe");
  }

  if (answers.riskTolerance === "low") {
    tips.push("advisor.tips.lowRiskOk");
  }

  if (answers.goals.includes("house") || answers.goals.includes("marriage")) {
    tips.push("advisor.tips.bigGoalPlan");
  }

  tips.push("advisor.tips.consistentSaving");

  return tips.slice(0, 5);
}

export function generateInvestmentPlan(
  answers: AdvisorAnswers,
): InvestmentPlan {
  let alloc = { ...BASE_ALLOCATIONS[answers.riskTolerance] };
  alloc = adjustForAge(alloc, answers.ageRange);
  alloc = adjustForGoals(alloc, answers.goals);

  const surplus = Math.max(0, answers.monthlyIncome - answers.monthlyExpenses);
  const monthlyTarget = Math.round(surplus * 0.5); // suggest investing 50% of surplus

  const timeline = computeTimeline(answers.goals);
  const tips = generateTipKeys(alloc, answers);

  return {
    allocation: alloc,
    monthlyTarget,
    tips,
    riskLevel: answers.riskTolerance,
    timelineYears: timeline,
  };
}
