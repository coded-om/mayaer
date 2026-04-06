import { motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { TransactionList } from "@/components/transactions/TransactionList";
import { AddExpenseSheet } from "@/components/transactions/AddExpenseSheet";
import { useBudgetStore } from "@/store/budgetStore";
import { useProfileStore } from "@/store/profileStore";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationsStore } from "@/store/notificationsStore";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { useGoalsStore } from "@/store/goalsStore";
import { useMarketsStore } from "@/store/marketsStore";
import { MSM_STOCKS, TADAWUL_STOCKS, DFM_STOCKS } from "@/constants/markets";
import type { LocalStock } from "@/types/markets";
import {
  TbTargetArrow,
  TbStarFilled,
  TbBell,
  TbUserCircle,
  TbSearch,
} from "react-icons/tb";

export function DashboardPage() {
  const name = useProfileStore((s) => s.name);
  const transactions = useBudgetStore((s) => s.transactions);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = useNotificationsStore((s) => s.unreadCount());

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12
      ? t("dashboard.goodMorning")
      : hour < 18
        ? t("dashboard.goodEvening")
        : t("dashboard.goodNight");

  const recentTransactions = transactions.slice(0, 5);
  const goals = useGoalsStore((s) => s.goals);
  const achievedGoals = goals.filter(
    (g) => g.savedAmount >= g.targetAmount,
  ).length;
  const watchlist = useMarketsStore((s) => s.watchlist);
  const watchlistStocks = [...MSM_STOCKS, ...TADAWUL_STOCKS, ...DFM_STOCKS]
    .filter((s: LocalStock) => watchlist.includes(s.symbol))
    .slice(0, 3);

  useNotifications();

  return (
    <>
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      {/* Wave background — dashboard only, mobile only — rendered in body to avoid overflow-x-hidden clipping fixed position */}
      {createPortal(
        <div
          className="fixed top-0 left-0 right-0 h-56 pointer-events-none z-0 md:hidden"
          style={{
            backgroundImage: "url('/wave-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        />,
        document.body
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 space-y-5 pb-6">
        {/* ── Top Header Bar ── */}
        <div className="flex items-center justify-between  bg-white p-2 rounded-xl">
          {/* Avatar + Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-[0_4px_12px_rgba(31,122,99,0.3)]">
              <TbUserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-arabic text-xs text-neutral-muted dark:text-white/50 leading-none mb-0.5">
                {greeting}
              </p>
              <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white leading-none">
                {name}
              </p>
            </div>
          </div>
          {/* Action icons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/transactions")}
              className="w-9 h-9 rounded-full backdrop-blur-xl bg-white/60 dark:bg-white/[0.06] border border-white/70 dark:border-white/[0.10] flex items-center justify-center shadow-sm">
              <TbSearch className="w-4.5 h-4.5 text-neutral-text dark:text-white/70" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 rounded-full backdrop-blur-xl bg-white/60 dark:bg-white/[0.06] border border-white/70 dark:border-white/[0.10] flex items-center justify-center shadow-sm">
              <TbBell className="w-4.5 h-4.5 text-neutral-text dark:text-white/70" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* ── Wallet Section ── */}
        <div>
          <p className="font-arabic text-xs font-semibold text-neutral-muted dark:text-white/40 uppercase tracking-widest mb-2 px-0.5">
            {t("dashboard.wallet")}
          </p>
          <div className="md:max-w-sm">
            <BalanceCard />
          </div>
        </div>

        {/* ── Stats Strip: Streak | Goals | Watchlist ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Streak */}
          <StreakCounter />

          {/* Goals Achieved */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/goals")}
            className="rounded-2xl p-3 flex flex-col items-center justify-center gap-1 backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 dark:bg-emerald-400/10 flex items-center justify-center">
              <TbTargetArrow className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <span className="font-arabic text-xl font-bold text-emerald-500 dark:text-emerald-400 leading-none">
              {achievedGoals}
            </span>
            <span className="font-arabic text-[10px] text-neutral-muted dark:text-white/40 font-medium leading-tight text-center">
              {t("profile.goalsAchieved")}
            </span>
          </motion.button>

          {/* Watchlist */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/markets")}
            className="rounded-2xl p-3 flex flex-col items-center justify-center gap-1 backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] overflow-hidden w-full">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-400/10 flex items-center justify-center shrink-0">
              <TbStarFilled className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
            </div>
            {watchlistStocks.length > 0 ? (
              <div className="flex flex-col gap-0.5 w-full mt-0.5">
                {watchlistStocks.map((s) => (
                  <div
                    key={s.symbol}
                    className="flex items-center justify-between w-full">
                    <span className="font-arabic text-[9px] text-neutral-text dark:text-white font-semibold truncate">
                      {s.symbol}
                    </span>
                    <span
                      className={`font-arabic text-[9px] font-bold ${s.changePercent >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                      {s.changePercent >= 0 ? "+" : ""}
                      {s.changePercent}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="font-arabic text-[10px] text-neutral-muted dark:text-white/40 font-medium leading-tight text-center">
                {t("nav.markets")}
              </span>
            )}
          </motion.button>
        </div>

        {/* ── Chart ── */}
        <SpendingChart />

        {/* ── Recent Activity ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white">
              {t("dashboard.activity")}
            </p>
            <button
              onClick={() => navigate("/transactions")}
              className="font-arabic text-xs text-primary dark:text-emerald-400 font-semibold">
              {t("dashboard.viewAll")}
            </button>
          </div>
          <div className="rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.15)] overflow-hidden">
            <TransactionList transactions={recentTransactions} />
          </div>
        </div>

        {/* ── FAB ── */}
        <AddExpenseSheet />
      </motion.div>
    </>
  );
}
