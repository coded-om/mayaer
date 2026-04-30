import { useTranslation } from "react-i18next";
import { useAlertsStore } from "@/store/alertsStore";
import type { AlertType } from "@/types/markets";
import { cn } from "@/lib/utils";

const ALERT_LABELS: Record<AlertType, string> = {
  overspending: "alerts.rules.overspending",
  goal_deadline: "alerts.rules.goalDeadline",
  salary_reminder: "alerts.rules.salaryReminder",
  savings_tip: "alerts.rules.savingsTip",
  investment_opportunity: "alerts.rules.investmentOpp",
  price_drop: "alerts.rules.priceDrop",
};

export function AlertSettings() {
  const { t } = useTranslation();
  const rules = useAlertsStore((s) => s.rules);
  const toggleRule = useAlertsStore((s) => s.toggleRule);

  return (
    <div className="space-y-2">
      <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white mb-3">
        {t("alerts.settings")}
      </p>
      {rules.map((rule) => (
        <button
          key={rule.id}
          onClick={() => toggleRule(rule.type)}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/40 dark:hover:bg-white/[0.03] transition-colors">
          <span className="font-arabic text-sm text-neutral-text dark:text-white">
            {t(ALERT_LABELS[rule.type])}
          </span>
          <div
            className={cn(
              "w-10 h-6 rounded-full relative transition-colors",
              rule.enabled ? "bg-primary" : "bg-neutral-bg dark:bg-white/10",
            )}>
            <div
              className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                rule.enabled ? "translate-x-[18px]" : "translate-x-0.5",
              )}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
