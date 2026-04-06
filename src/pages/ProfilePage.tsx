import { useState } from "react";
import { motion } from "framer-motion";
import {
  TbFlame,
  TbTarget,
  TbCoins,
  TbMoon,
  TbSun,
  TbLogout,
  TbLoader2,
  TbLanguage,
  TbBell,
  TbBellOff,
  TbCalendar,
  TbPigMoney,
  TbCoin,
  TbDownload,
  TbTrash,
  TbAlertTriangle,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/store/profileStore";
import { useStreakStore } from "@/store/streakStore";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useBudgetStore } from "@/store/budgetStore";
import { useGoalsStore } from "@/store/goalsStore";
import { useFinancialMonthStore } from "@/store/financialMonthStore";
import { useAuthStore } from "@/store/authStore";
import { formatOMR } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { OmaniRial } from "@/components/ui/OmaniRial";
import { requestNotificationPermission } from "@/hooks/useNotifications";

export function ProfilePage() {
  const navigate = useNavigate();
  const {
    name,
    setName,
    darkMode,
    toggleDarkMode,
    monthlyIncome,
    setMonthlyIncome,
    notificationsEnabled,
    setNotificationsEnabled,
    salaryDay,
    setSalaryDay,
    savingsGoalPercent,
    setSavingsGoalPercent,
    currencyDisplay,
    setCurrencyDisplay,
  } = useProfileStore();
  const longestStreak = useStreakStore((s) => s.longestStreak);
  const { savings } = useBudgetSummary();
  const goalsCount = useGoalsStore((s) => s.goals.length);
  const { logout, isLoading: isLoggingOut } = useAuthStore();
  const { t, i18n } = useTranslation();
  const financialMonthStore = useFinancialMonthStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const stats = [
    {
      icon: TbCoins,
      label: t("profile.totalSavings"),
      value: formatOMR(savings, true),
      color: "text-primary",
      hasCurrency: true,
    },
    {
      icon: TbFlame,
      label: t("profile.longestStreak"),
      value: `${longestStreak} ${t("dashboard.day")}`,
      color: "text-orange-500",
    },
    {
      icon: TbTarget,
      label: t("profile.goalsAchieved"),
      value: `${goalsCount}`,
      color: "text-info",
    },
  ];

  const salaryDayOptions = [1, 5, 10, 15, 20, 25, 28];

  const handleSalaryDayChange = (day: number) => {
    setSalaryDay(day);
    // Sync with financial month store if configured
    if (financialMonthStore.config) {
      financialMonthStore.setConfig({
        ...financialMonthStore.config,
        salaryDay: day,
      });
    }
  };

  const handleExportData = () => {
    const data = {
      profile: useProfileStore.getState(),
      transactions: useBudgetStore.getState().transactions,
      goals: useGoalsStore.getState().goals,
      streak: useStreakStore.getState(),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meyaar-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      <PageHeader title={t("profile.title")} />

      {/* Profile avatar + name */}
      <Card className="flex items-center gap-4 p-4">
        <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
          <span className="font-display text-xl font-bold text-primary">
            {name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-arabic font-semibold text-base border-0 p-0 h-auto focus-visible:ring-0"
            placeholder={t("profile.yourName")}
          />
          <p className="font-arabic text-xs text-neutral-muted">
            {t("profile.tapToEditName")}
          </p>
        </div>
      </Card>

      {/* Monthly income */}
      <Card className="p-4">
        <label className="font-arabic text-sm text-neutral-muted block mb-2">
          {t("profile.monthlySalary")}
        </label>
        <div className="relative">
          <Input
            type="number"
            step="0.001"
            value={monthlyIncome || ""}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            placeholder={t("profile.enterSalary")}
            className="font-mono text-lg h-12"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-muted">
            <OmaniRial />
          </span>
        </div>
      </Card>

      {/* Salary Day Picker */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <TbCalendar className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
              {t("profile.salaryDay")}
            </h3>
            <p className="font-arabic text-[11px] text-neutral-muted">
              {t("profile.salaryDayDesc")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {salaryDayOptions.map((day) => (
            <button
              key={day}
              onClick={() => handleSalaryDayChange(day)}
              className={cn(
                "w-11 h-11 rounded-xl font-arabic text-sm font-semibold transition-all",
                salaryDay === day
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-white/50 dark:bg-white/5 text-neutral-text dark:text-gray-300 hover:bg-primary/10 border border-white/70 dark:border-white/[0.08]",
              )}>
              {day}
            </button>
          ))}
          <div className="relative">
            <input
              type="number"
              min="1"
              max="31"
              value={salaryDay}
              onChange={(e) =>
                handleSalaryDayChange(
                  Math.min(31, Math.max(1, parseInt(e.target.value) || 1)),
                )
              }
              className={cn(
                "w-16 h-11 rounded-xl text-center font-arabic text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/30",
                !salaryDayOptions.includes(salaryDay)
                  ? "bg-primary text-white"
                  : "bg-white/50 dark:bg-white/5 text-neutral-text dark:text-white border border-white/70 dark:border-white/[0.08]",
              )}
            />
          </div>
        </div>
      </Card>

      {/* Savings Goal */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <TbPigMoney className="w-5 h-5 text-emerald-500" />
          <div className="flex-1">
            <h3 className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
              {t("profile.savingsGoal")}
            </h3>
            <p className="font-arabic text-[11px] text-neutral-muted">
              {t("profile.savingsGoalDesc")}
            </p>
          </div>
          <span className="font-arabic text-sm font-bold text-emerald-500">
            {savingsGoalPercent}%
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="60"
          step="5"
          value={savingsGoalPercent}
          onChange={(e) => setSavingsGoalPercent(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-neutral-bg dark:bg-gray-700"
        />
        <div className="flex justify-between font-arabic text-[10px] text-neutral-muted">
          <span>5%</span>
          <span className="text-emerald-500 font-semibold">
            {t("profile.savingsGoalPercent", { percent: savingsGoalPercent })}
            {monthlyIncome > 0 && (
              <>
                {" "}
                ≈ {((monthlyIncome * savingsGoalPercent) / 100).toFixed(3)} ر.ع
              </>
            )}
          </span>
          <span>60%</span>
        </div>
      </Card>

      {/* Settings */}
      <Card className="p-4 space-y-3">
        <h3 className="font-arabic font-semibold text-neutral-text dark:text-white">
          {t("profile.settings")}
        </h3>

        {/* Language toggle */}
        <button
          onClick={() =>
            i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
          }
          className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-3">
            <TbLanguage className="w-5 h-5 text-primary" />
            <span className="font-arabic text-sm text-neutral-text dark:text-white">
              {i18n.language === "ar" ? "English" : "العربية"}
            </span>
          </div>
          <span className="font-mono text-xs text-neutral-muted">
            {i18n.language === "ar" ? "EN" : "عر"}
          </span>
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <TbMoon className="w-5 h-5 text-info" />
            ) : (
              <TbSun className="w-5 h-5 text-gold" />
            )}
            <span className="font-arabic text-sm text-neutral-text dark:text-white">
              {darkMode ? t("profile.darkMode") : t("profile.lightMode")}
            </span>
          </div>
          <div
            className={cn(
              "w-11 h-6 rounded-full transition-colors relative",
              darkMode ? "bg-primary" : "bg-neutral-border",
            )}>
            <div
              className={cn(
                "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all",
                darkMode ? "right-0.5" : "left-0.5",
              )}
            />
          </div>
        </button>

        {/* Daily notification toggle */}
        <button
          onClick={async () => {
            if (!notificationsEnabled) {
              const granted = await requestNotificationPermission();
              if (granted) setNotificationsEnabled(true);
            } else {
              setNotificationsEnabled(false);
            }
          }}
          className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <TbBell className="w-5 h-5 text-primary" />
            ) : (
              <TbBellOff className="w-5 h-5 text-neutral-muted" />
            )}
            <div>
              <span className="font-arabic text-sm text-neutral-text dark:text-white block">
                {t("profile.dailyReminder")}
              </span>
              <span className="font-arabic text-[11px] text-neutral-muted">
                {t("profile.dailyReminderDesc")}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "w-11 h-6 rounded-full transition-colors relative",
              notificationsEnabled ? "bg-primary" : "bg-neutral-border",
            )}>
            <div
              className={cn(
                "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all",
                notificationsEnabled ? "right-0.5" : "left-0.5",
              )}
            />
          </div>
        </button>

        {/* Currency display */}
        <div className="py-2">
          <div className="flex items-center gap-3 mb-2">
            <TbCoin className="w-5 h-5 text-primary" />
            <span className="font-arabic text-sm text-neutral-text dark:text-white">
              {t("profile.currencyDisplay")}
            </span>
          </div>
          <div className="flex gap-2 mr-8">
            {(["symbol", "short", "full"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setCurrencyDisplay(option)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg font-arabic text-xs font-medium transition-all",
                  currencyDisplay === option
                    ? "bg-primary text-white"
                    : "bg-white/50 dark:bg-white/5 text-neutral-muted border border-white/70 dark:border-white/[0.08] hover:bg-primary/10",
                )}>
                {option === "symbol"
                  ? t("profile.currencySymbol")
                  : option === "short"
                    ? t("profile.currencyShort")
                    : t("profile.currencyFull")}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-4 space-y-3">
        <h3 className="font-arabic font-semibold text-neutral-text dark:text-white">
          {t("profile.dataManagement")}
        </h3>

        {/* Export */}
        <button
          onClick={handleExportData}
          className="flex items-center gap-3 w-full py-2">
          <TbDownload className="w-5 h-5 text-primary" />
          <div className="text-right flex-1">
            <span className="font-arabic text-sm text-neutral-text dark:text-white block">
              {t("profile.exportData")}
            </span>
            <span className="font-arabic text-[11px] text-neutral-muted">
              {t("profile.exportDataDesc")}
            </span>
          </div>
        </button>

        {/* Reset */}
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-3 w-full py-2">
            <TbTrash className="w-5 h-5 text-danger" />
            <div className="text-right flex-1">
              <span className="font-arabic text-sm text-danger block">
                {t("profile.resetData")}
              </span>
              <span className="font-arabic text-[11px] text-neutral-muted">
                {t("profile.resetDataDesc")}
              </span>
            </div>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-xl border border-danger/30 bg-danger/5 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <TbAlertTriangle className="w-5 h-5 text-danger shrink-0" />
              <p className="font-arabic text-xs text-danger">
                {t("profile.resetConfirm")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetData}
                className="flex-1 py-2 rounded-lg bg-danger text-white font-arabic text-xs font-semibold">
                {t("profile.resetData")}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-neutral-bg dark:bg-white/5 font-arabic text-xs font-semibold text-neutral-text dark:text-white">
                {t("common.cancel")}
              </button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="flex flex-col items-center gap-2 p-3 text-center">
              <Icon className={cn("w-6 h-6", stat.color)} />
              <p className="font-mono text-sm font-bold text-neutral-text dark:text-white">
                {stat.value}{" "}
                {"hasCurrency" in stat && stat.hasCurrency && (
                  <OmaniRial className="w-3 h-auto" />
                )}
              </p>
              <p className="font-arabic text-[10px] text-neutral-muted">
                {stat.label}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Version */}
      <p className="font-display text-xs text-neutral-muted text-center py-2">
        {t("profile.versionFooter")}
      </p>

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={async () => {
          await logout();
          navigate("/");
        }}
        disabled={isLoggingOut}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/10 py-3 font-arabic text-sm font-semibold text-danger hover:bg-danger/20 transition-all disabled:opacity-50">
        {isLoggingOut ? (
          <TbLoader2 className="w-4 h-4 animate-spin" />
        ) : (
          <TbLogout className="w-4 h-4" />
        )}
        {t("profile.logout")}
      </motion.button>
    </motion.div>
  );
}
