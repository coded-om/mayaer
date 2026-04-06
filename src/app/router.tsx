import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardPage } from "@/pages/DashboardPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { GoalsPage } from "@/pages/GoalsPage";
import { ZakatPage } from "@/pages/ZakatPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { LandingPage } from "@/pages/LandingPage";
import { MonthlyReportPage } from "@/pages/MonthlyReportPage";
import { ChallengesPage } from "@/pages/ChallengesPage";
import { CharityPage } from "@/pages/CharityPage";
import { CategoryBudgetPage } from "@/pages/CategoryBudgetPage";
import { EducationPage } from "@/pages/EducationPage";
import { RewardsPage } from "@/pages/RewardsPage";
import { StocksPage } from "@/pages/StocksPage";
import { FinancialMonthPage } from "@/pages/FinancialMonthPage";
import { MarketsPage } from "@/pages/MarketsPage";
import { AdvisorPage } from "@/pages/AdvisorPage";
import { OnboardingPage } from "@/pages/OnboardingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "onboarding", element: <OnboardingPage /> },
      {
        element: <Layout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "transactions", element: <TransactionsPage /> },
          { path: "goals", element: <GoalsPage /> },
          { path: "zakat", element: <ZakatPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "report", element: <MonthlyReportPage /> },
          { path: "challenges", element: <ChallengesPage /> },
          { path: "charity", element: <CharityPage /> },
          { path: "budgets", element: <CategoryBudgetPage /> },
          { path: "education", element: <EducationPage /> },
          { path: "rewards", element: <RewardsPage /> },
          { path: "stocks", element: <StocksPage /> },
          { path: "financial-month", element: <FinancialMonthPage /> },
          { path: "markets", element: <MarketsPage /> },
          { path: "advisor", element: <AdvisorPage /> },
        ],
      },
    ],
  },
]);
