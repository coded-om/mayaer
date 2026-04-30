import { motion } from "framer-motion";
import { TbTrash, TbToggleLeft, TbToggleRight } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import type { Subscription } from "@/types";
import { useSubscriptionsStore, toMonthlyAmount } from "@/store/subscriptionsStore";
import { getSubLogo } from "./subLogos";

interface Props {
  subscription: Subscription;
}

function formatDaysUntil(isoDate: string, t: (k: string) => string): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const renewal = new Date(isoDate);
  renewal.setHours(0, 0, 0, 0);
  const diff = Math.round((renewal.getTime() - now.getTime()) / 86_400_000);
  if (diff === 0) return t("subscriptions.renewsToday");
  if (diff === 1) return t("subscriptions.renewsTomorrow");
  return t("subscriptions.renewsInDays").replace("{{days}}", String(diff));
}

const CYCLE_LABELS: Record<string, string> = {
  monthly: "subscriptions.monthly",
  quarterly: "subscriptions.quarterly",
  yearly: "subscriptions.yearly",
};

export function SubscriptionCard({ subscription: s }: Props) {
  const { t } = useTranslation();
  const { toggleActive, deleteSubscription } = useSubscriptionsStore();
  const monthly = toMonthlyAmount(s.amount, s.billingCycle);
  const logo = getSubLogo(s.name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: s.isActive ? 1 : 0.55, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="relative flex items-center gap-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-white/70 dark:border-white/[0.08] shadow-sm p-4">

      {/* Logo or colored emoji circle */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden"
        style={{ backgroundColor: logo ? "#fff" : s.color + "22", border: `2px solid ${s.color}33` }}>
        {logo ? (
          <img
            src={logo}
            alt={s.name}
            className="w-8 h-8 object-contain"
            style={{ filter: s.isActive ? "none" : "grayscale(1)" }}
          />
        ) : (
          <span className="text-xl" style={{ filter: s.isActive ? "none" : "grayscale(1)" }}>
            {s.emoji}
          </span>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-arabic font-semibold text-sm text-neutral-text dark:text-white truncate">
            {s.name}
          </span>
          <span
            className="text-[10px] font-arabic px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: s.color + "22", color: s.color }}>
            {t(CYCLE_LABELS[s.billingCycle])}
          </span>
          {!s.isActive && (
            <span className="text-[10px] font-arabic px-2 py-0.5 rounded-full bg-neutral-bg dark:bg-gray-800 text-neutral-muted">
              {t("subscriptions.paused")}
            </span>
          )}
        </div>

        <p className="font-arabic text-xs text-neutral-muted mt-0.5">
          {formatDaysUntil(s.nextRenewalDate, t)}
        </p>
      </div>

      {/* Amount */}
      <div className="text-end flex-shrink-0 ms-2">
        <p className="font-arabic font-bold text-sm text-neutral-text dark:text-white">
          {s.amount.toFixed(3)}
          <span className="text-[10px] font-normal text-neutral-muted ms-1">ر.ع</span>
        </p>
        {s.billingCycle !== "monthly" && (
          <p className="font-arabic text-[10px] text-neutral-muted">
            ≈ {monthly.toFixed(3)} / {t("subscriptions.mo")}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          onClick={() => toggleActive(s.id)}
          className="text-neutral-muted hover:text-primary transition-colors">
          {s.isActive
            ? <TbToggleRight className="w-5 h-5 text-primary" />
            : <TbToggleLeft className="w-5 h-5" />}
        </button>
        <button
          onClick={() => deleteSubscription(s.id)}
          className="text-neutral-muted hover:text-danger transition-colors">
          <TbTrash className="w-4 h-4" />
        </button>
      </div>

      {/* Active color strip on the side */}
      {s.isActive && (
        <div
          className="absolute end-0 top-3 bottom-3 w-1 rounded-full"
          style={{ backgroundColor: s.color }}
        />
      )}
    </motion.div>
  );
}
