import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

// Each page is loaded on demand so the initial bundle stays small.
export const router = createBrowserRouter([
  {
    path: "/",
    lazy: () =>
      import("@/pages/LandingPage").then((m) => ({ Component: m.LandingPage })),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "onboarding",
        lazy: () =>
          import("@/pages/OnboardingPage").then((m) => ({
            Component: m.OnboardingPage,
          })),
      },
      {
        element: <Layout />,
        children: [
          {
            path: "dashboard",
            lazy: () =>
              import("@/pages/DashboardPage").then((m) => ({
                Component: m.DashboardPage,
              })),
          },
          {
            path: "transactions",
            lazy: () =>
              import("@/pages/TransactionsPage").then((m) => ({
                Component: m.TransactionsPage,
              })),
          },
          {
            path: "goals",
            lazy: () =>
              import("@/pages/GoalsPage").then((m) => ({
                Component: m.GoalsPage,
              })),
          },
          {
            path: "zakat",
            lazy: () =>
              import("@/pages/ZakatPage").then((m) => ({
                Component: m.ZakatPage,
              })),
          },
          {
            path: "profile",
            lazy: () =>
              import("@/pages/ProfilePage").then((m) => ({
                Component: m.ProfilePage,
              })),
          },
          {
            path: "report",
            lazy: () =>
              import("@/pages/MonthlyReportPage").then((m) => ({
                Component: m.MonthlyReportPage,
              })),
          },
          {
            path: "challenges",
            lazy: () =>
              import("@/pages/ChallengesPage").then((m) => ({
                Component: m.ChallengesPage,
              })),
          },
          {
            path: "charity",
            lazy: () =>
              import("@/pages/CharityPage").then((m) => ({
                Component: m.CharityPage,
              })),
          },
          {
            path: "budgets",
            lazy: () =>
              import("@/pages/CategoryBudgetPage").then((m) => ({
                Component: m.CategoryBudgetPage,
              })),
          },
          {
            path: "education",
            lazy: () =>
              import("@/pages/EducationPage").then((m) => ({
                Component: m.EducationPage,
              })),
          },
          {
            path: "rewards",
            lazy: () =>
              import("@/pages/RewardsPage").then((m) => ({
                Component: m.RewardsPage,
              })),
          },
          {
            path: "stocks",
            lazy: () =>
              import("@/pages/StocksPage").then((m) => ({
                Component: m.StocksPage,
              })),
          },
          {
            path: "financial-month",
            lazy: () =>
              import("@/pages/FinancialMonthPage").then((m) => ({
                Component: m.FinancialMonthPage,
              })),
          },
          {
            path: "markets",
            lazy: () =>
              import("@/pages/MarketsPage").then((m) => ({
                Component: m.MarketsPage,
              })),
          },
          {
            path: "advisor",
            lazy: () =>
              import("@/pages/AdvisorPage").then((m) => ({
                Component: m.AdvisorPage,
              })),
          },
        ],
      },
    ],
  },
]);
