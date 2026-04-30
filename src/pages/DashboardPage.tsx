import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
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
import { CATEGORIES } from "@/constants";
import { getCategoryIcon } from "@/lib/categories";
import { formatOMR } from "@/lib/currency";
import { useSubscriptionsStore } from "@/store/subscriptionsStore";
import { OmaniRial } from "@/components/ui/OmaniRial";
import { getSubLogo } from "@/components/subscriptions/subLogos";
import {
  TbTargetArrow,
  TbStarFilled,
  TbBell,
  TbUserCircle,
  TbSearch,
  TbChevronLeft,
  TbRepeat,
} from "react-icons/tb";

export function DashboardPage() {
  const name = useProfileStore((s) => s.name);
  const transactions = useBudgetStore((s) => s.transactions);
  const { categoryBudgets, getCategorySpent } = useBudgetStore();
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

  const { subscriptions, getTotalMonthly } = useSubscriptionsStore();
  const activeSubscriptions = subscriptions.filter((s) => s.isActive);
  const topSubs = activeSubscriptions.slice(0, 3);
  const totalSubsMonthly = getTotalMonthly();

  useNotifications();

  return (
    <>
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
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
            className="rounded-xl p-2 flex flex-col items-center justify-center gap-0.5 backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 dark:bg-emerald-400/10 flex items-center justify-center">
              <TbTargetArrow className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <span className="font-arabic text-base font-bold text-emerald-500 dark:text-emerald-400 leading-none">
              {achievedGoals}
            </span>
            <span className="font-arabic text-[9px] text-neutral-muted dark:text-white/40 font-medium leading-tight text-center">
              {t("profile.goalsAchieved")}
            </span>
          </motion.button>

          {/* Watchlist */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/markets")}
            className="rounded-xl p-2 flex flex-col items-center justify-center gap-0.5 backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] overflow-hidden w-full">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 dark:bg-amber-400/10 flex items-center justify-center shrink-0">
              <TbStarFilled className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            {watchlistStocks.length > 0 ? (
              <div className="flex flex-col gap-0.5 w-full mt-0.5">
                {watchlistStocks.map((s) => (
                  <div
                    key={s.symbol}
                    className="flex items-center justify-between w-full">
                    <span className="font-arabic text-[8px] text-neutral-text dark:text-white font-semibold truncate">
                      {s.symbol}
                    </span>
                    <span
                      className={`font-arabic text-[8px] font-bold ${s.changePercent >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                      {s.changePercent >= 0 ? "+" : ""}
                      {s.changePercent}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="font-arabic text-[9px] text-neutral-muted dark:text-white/40 font-medium leading-tight text-center">
                {t("nav.markets")}
              </span>
            )}
          </motion.button>
        </div>

        {/* ── Budget Overview ── */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white">
              {t("categoryBudget.title")}
            </p>
            <button
              onClick={() => navigate("/budgets")}
              className="flex items-center gap-0.5 font-arabic text-xs text-primary dark:text-emerald-400 font-semibold">
              {t("dashboard.viewAll")}
              <TbChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-4 pb-3 space-y-2.5">
            {categoryBudgets.length === 0 ? (
              <p className="font-arabic text-xs text-neutral-muted dark:text-white/40 text-center py-2">
                {t("categoryBudget.noLimits")}
              </p>
            ) : (
              categoryBudgets.slice(0, 4).map((b) => {
                const cat = CATEGORIES.find((c) => c.id === b.category);
                if (!cat) return null;
                const spent = getCategorySpent(b.category);
                const pct = Math.min(100, (spent / b.limit) * 100);
                const isOver = spent > b.limit;
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: cat.color }}
                        />
                        <span className="font-arabic text-xs text-neutral-text dark:text-white">
                          {t(`categories.${cat.id}`)}
                        </span>
                      </div>
                      <span
                        className="font-mono text-[10px] text-neutral-muted dark:text-white/50"
                        dir="ltr">
                        {formatOMR(spent, true, "en")} /{" "}
                        {formatOMR(b.limit, true, "en")}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-border dark:bg-gray-700 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: isOver ? "#EF4444" : cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Category Breakdown ── */}
        <CategoryPieChart />
        {/* ── Chart ── */}
        <SpendingChart />

        {/* ── Subscriptions mini-card ── */}
        {activeSubscriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <TbRepeat className="w-4 h-4 text-primary dark:text-emerald-400" />
                </div>
                <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
                  {t("subscriptions.title")}
                </p>
              </div>
              <button
                onClick={() => navigate("/subscriptions")}
                className="flex items-center gap-0.5 font-arabic text-xs text-primary dark:text-emerald-400 font-semibold">
                {t("dashboard.viewAll")}
                <TbChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="font-mono text-xl font-bold text-neutral-text dark:text-white flex items-center gap-1">
                <OmaniRial className="w-4 h-4" />
                {totalSubsMonthly.toFixed(3)}
              </span>
              <span className="font-arabic text-xs text-neutral-muted dark:text-gray-400">
                / {t("subscriptions.mo")}
              </span>
            </div>

            {/* Top 3 subscriptions */}
            <div className="space-y-2">
              {topSubs.map((sub) => {
                const logo = getSubLogo(sub.name);
                return (
                  <div key={sub.id} className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 overflow-hidden"
                      style={{
                        backgroundColor: logo ? "#fff" : sub.color + "25",
                        border: `1.5px solid ${sub.color}33`,
                      }}>
                      {logo ? (
                        <img
                          src={logo}
                          alt={sub.name}
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        sub.emoji
                      )}
                    </div>
                    <span className="font-arabic text-xs text-neutral-text dark:text-white flex-1 truncate">
                      {sub.name}
                    </span>
                    <span
                      className="font-arabic text-xs font-semibold shrink-0 flex items-center gap-0.5"
                      style={{ color: sub.color }}>
                      <OmaniRial className="w-2.5 h-2.5" />
                      {sub.amount.toFixed(3)}
                    </span>
                  </div>
                );
              })}
              {activeSubscriptions.length > 3 && (
                <p className="font-arabic text-xs text-neutral-muted dark:text-gray-500 text-center pt-1">
                  +{activeSubscriptions.length - 3}{" "}
                  {t("subscriptions.activeLabel")}
                </p>
              )}
            </div>
          </motion.div>
        )}

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
