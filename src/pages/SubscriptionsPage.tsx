import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbRepeat, TbAlertCircle } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { SubscriptionsSummary } from "@/components/subscriptions/SubscriptionsSummary";
import { AddSubscriptionSheet } from "@/components/subscriptions/AddSubscriptionSheet";
import { useSubscriptionsStore } from "@/store/subscriptionsStore";
import type { BillingCycle } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | BillingCycle;

const FILTERS: { id: Filter; labelKey: string }[] = [
  { id: "all",       labelKey: "subscriptions.filterAll" },
  { id: "monthly",   labelKey: "subscriptions.monthly" },
  { id: "quarterly", labelKey: "subscriptions.quarterly" },
  { id: "yearly",    labelKey: "subscriptions.yearly" },
];

export function SubscriptionsPage() {
  const { t } = useTranslation();
  const { subscriptions, getUpcomingRenewals } = useSubscriptionsStore();
  const [filter, setFilter] = useState<Filter>("all");

  const upcoming = getUpcomingRenewals(7);

  const filtered = subscriptions.filter((s) =>
    filter === "all" ? true : s.billingCycle === filter,
  );

  // Sort: active first, then by next renewal date
  const sorted = [...filtered].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">

      <PageHeader
        title={t("subscriptions.title")}
        subtitle={t("subscriptions.subtitle")}
      />

      {/* Summary strip */}
      <SubscriptionsSummary />

      {/* Upcoming renewals banner */}
      <AnimatePresence>
        {upcoming.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-4">
            <TbAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-arabic font-semibold text-sm text-amber-700 dark:text-amber-400">
                {t("subscriptions.renewingSoonBanner")}
              </p>
              <p className="font-arabic text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                {upcoming.map((s) => s.name).join("، ")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      {subscriptions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-xs font-arabic font-medium transition-all border",
                filter === f.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white/50 dark:bg-white/5 border-white/70 dark:border-white/10 text-neutral-muted hover:text-neutral-text",
              )}>
              {t(f.labelKey)}
              {f.id !== "all" && (
                <span className="ms-1.5 opacity-60">
                  ({subscriptions.filter((s) => s.billingCycle === f.id).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {subscriptions.length === 0 ? (
        <EmptyState
          icon={TbRepeat}
          title={t("subscriptions.empty")}
          description={t("subscriptions.emptyDesc")}
        />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={TbRepeat}
          title={t("subscriptions.noMatchFilter")}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          {sorted.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </AnimatePresence>
      )}

      <AddSubscriptionSheet />
    </motion.div>
  );
}
