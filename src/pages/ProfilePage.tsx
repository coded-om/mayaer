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
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/store/profileStore";
import { useStreakStore } from "@/store/streakStore";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useGoalsStore } from "@/store/goalsStore";
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
  } = useProfileStore();
  const longestStreak = useStreakStore((s) => s.longestStreak);
  const { savings } = useBudgetSummary();
  const goalsCount = useGoalsStore((s) => s.goals.length);
  const { logout, isLoading: isLoggingOut } = useAuthStore();
  const { t, i18n } = useTranslation();

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
