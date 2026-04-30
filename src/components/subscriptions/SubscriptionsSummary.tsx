import { useTranslation } from "react-i18next";
import { TbCalendarDue, TbCoins, TbRepeat, TbReceipt } from "react-icons/tb";
import { useSubscriptionsStore } from "@/store/subscriptionsStore";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  iconColor: string;
  iconBg: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <div className="flex-1 min-w-[140px] rounded-2xl bg-white dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.08] shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="font-arabic text-xs text-neutral-muted">{label}</span>
      </div>
      <p className="font-arabic font-bold text-xl text-neutral-text dark:text-white">
        {value}
      </p>
      {sub && (
        <p className="font-arabic text-xs text-neutral-muted mt-0.5">{sub}</p>
      )}
    </div>
  );
}

export function SubscriptionsSummary() {
  const { t } = useTranslation();
  const { subscriptions, getTotalMonthly, getUpcomingRenewals } =
    useSubscriptionsStore();

  const activeCount = subscriptions.filter((s) => s.isActive).length;
  const totalMonthly = getTotalMonthly();
  const totalYearly = totalMonthly * 12;
  const upcomingCount = getUpcomingRenewals(7).length;

  if (subscriptions.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      <StatCard
        icon={TbCoins}
        label={t("subscriptions.totalMonthly")}
        value={totalMonthly.toFixed(3)}
        sub={t("subscriptions.omr")}
        iconColor="text-primary"
        iconBg="bg-primary-50 dark:bg-primary-950"
      />
      <StatCard
        icon={TbReceipt}
        label={t("subscriptions.totalYearly")}
        value={totalYearly.toFixed(3)}
        sub={t("subscriptions.omr")}
        iconColor="text-amber-500"
        iconBg="bg-amber-50 dark:bg-amber-950"
      />
      <StatCard
        icon={TbRepeat}
        label={t("subscriptions.activeCount")}
        value={String(activeCount)}
        sub={t("subscriptions.activeLabel")}
        iconColor="text-blue-500"
        iconBg="bg-blue-50 dark:bg-blue-950"
      />
      <StatCard
        icon={TbCalendarDue}
        label={t("subscriptions.renewingSoon")}
        value={String(upcomingCount)}
        sub={t("subscriptions.within7days")}
        iconColor="text-rose-500"
        iconBg="bg-rose-50 dark:bg-rose-950"
      />
    </div>
  );
}
