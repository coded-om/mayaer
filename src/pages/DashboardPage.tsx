import { motion } from "framer-motion";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";
import { TransactionList } from "@/components/transactions/TransactionList";
import { AddExpenseSheet } from "@/components/transactions/AddExpenseSheet";
import { useBudgetStore } from "@/store/budgetStore";
import { useProfileStore } from "@/store/profileStore";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { TbTrophy, TbHeart, TbChartBar, TbHandClick } from "react-icons/tb";

export function DashboardPage() {
  const name = useProfileStore((s) => s.name);
  const transactions = useBudgetStore((s) => s.transactions);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12
      ? t("dashboard.goodMorning")
      : hour < 18
        ? t("dashboard.goodEvening")
        : t("dashboard.goodNight");
  const dateStr = format(now, "EEEE d MMMM yyyy", {
    locale: i18n.language === "ar" ? ar : enUS,
  });

  const recentTransactions = transactions.slice(0, 5);

  // Trigger 9 PM daily notification if enabled
  useNotifications();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      {/* Hero Greeting */}
      <div className="relative -mx-4 -mt-4 md:-mx-8 md:-mt-6 overflow-hidden rounded-b-3xl bg-gradient-to-bl from-primary to-primary-700">
        <div className="relative z-10 px-4 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6">
          <h1 className="font-arabic text-xl md:text-2xl font-bold text-white drop-shadow-md flex items-center gap-2">
            {greeting}، {name}{" "}
            <TbHandClick className="w-6 h-6 text-amber-300" />
          </h1>
          <p className="font-arabic text-sm text-white/70 drop-shadow-sm">
            {dateStr}
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 right-8 h-20 w-20 rounded-full bg-white/5" />
        <div className="hidden lg:block absolute left-1/3 -bottom-8 h-36 w-36 rounded-full bg-white/[0.03]" />
      </div>

      {/* Balance + Streak row on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BalanceCard />
        </div>
        <div className="lg:col-span-1">
          <StreakCounter />
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Charts row — side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendingChart />
        <CategoryPieChart />
      </div>

      {/* Monthly Income vs Expense */}
      <MonthlyBarChart />

      {/* Quick Links + Recent Transactions side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Links */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/challenges")}
            className="rounded-2xl p-4 flex flex-col lg:flex-row items-center gap-2 lg:gap-3 backdrop-blur-xl bg-white/40 dark:bg-white/[0.06] border border-white/50 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all hover:bg-white/60 dark:hover:bg-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-400/10 flex items-center justify-center shrink-0">
              <TbTrophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            </div>
            <span className="font-arabic text-[11px] lg:text-sm text-neutral-text dark:text-white font-semibold">
              {t("nav.challenges")}
            </span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/charity")}
            className="rounded-2xl p-4 flex flex-col lg:flex-row items-center gap-2 lg:gap-3 backdrop-blur-xl bg-white/40 dark:bg-white/[0.06] border border-white/50 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all hover:bg-white/60 dark:hover:bg-white/10">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 dark:bg-rose-400/10 flex items-center justify-center shrink-0">
              <TbHeart className="w-5 h-5 text-rose-500 dark:text-rose-400" />
            </div>
            <span className="font-arabic text-[11px] lg:text-sm text-neutral-text dark:text-white font-semibold">
              {t("nav.charity")}
            </span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/report")}
            className="rounded-2xl p-4 flex flex-col lg:flex-row items-center gap-2 lg:gap-3 backdrop-blur-xl bg-white/40 dark:bg-white/[0.06] border border-white/50 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all hover:bg-white/60 dark:hover:bg-white/10">
            <div className="w-10 h-10 rounded-xl bg-primary/15 dark:bg-primary/10 flex items-center justify-center shrink-0">
              <TbChartBar className="w-5 h-5 text-primary dark:text-emerald-400" />
            </div>
            <span className="font-arabic text-[11px] lg:text-sm text-neutral-text dark:text-white font-semibold">
              {t("nav.report")}
            </span>
          </motion.button>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
              {t("dashboard.recentTransactions")}
            </p>
            <button
              onClick={() => navigate("/transactions")}
              className="font-arabic text-xs text-primary font-medium">
              {t("dashboard.viewAll")}
            </button>
          </div>
          <TransactionList transactions={recentTransactions} />
        </div>
      </div>

      {/* FAB */}
      <AddExpenseSheet />
    </motion.div>
  );
}
