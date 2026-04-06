import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  TbAlertTriangle,
  TbTarget,
  TbPigMoney,
  TbTrendingDown,
  TbCalendar,
  TbBulb,
} from "react-icons/tb";
import type { SmartAlert, AlertType } from "@/types/markets";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: SmartAlert;
  onRead: () => void;
}

const ICON_MAP: Record<AlertType, typeof TbAlertTriangle> = {
  overspending: TbAlertTriangle,
  goal_deadline: TbTarget,
  savings_tip: TbPigMoney,
  price_drop: TbTrendingDown,
  salary_reminder: TbCalendar,
  investment_opportunity: TbBulb,
};

const COLOR_MAP: Record<AlertType, string> = {
  overspending: "text-red-500 bg-red-50 dark:bg-red-950/30",
  goal_deadline: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  savings_tip: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  price_drop: "text-red-500 bg-red-50 dark:bg-red-950/30",
  salary_reminder: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
  investment_opportunity: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
};

export function AlertCard({ alert, onRead }: AlertCardProps) {
  const { t } = useTranslation();
  const Icon = ICON_MAP[alert.type];
  const colorClass = COLOR_MAP[alert.type];

  const descParams = alert.data
    ? Object.fromEntries(
        Object.entries(alert.data).map(([k, v]) => [k, String(v)]),
      )
    : {};

  return (
    <motion.button
      onClick={onRead}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl text-start transition-colors",
        alert.read ? "opacity-60" : "bg-white/50 dark:bg-white/[0.03]",
      )}>
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
          colorClass,
        )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white truncate">
            {t(alert.titleKey)}
          </p>
          {!alert.read && (
            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          )}
        </div>
        <p className="font-arabic text-xs text-neutral-muted dark:text-gray-400 mt-0.5 line-clamp-2">
          {t(alert.descriptionKey, descParams)}
        </p>
        <p className="font-arabic text-[10px] text-neutral-muted/60 mt-1">
          {new Date(alert.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.button>
  );
}
