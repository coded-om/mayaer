import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";
import {
  TbTrash,
  TbPlus,
  TbCheck,
  TbTarget,
  TbCalendar,
  TbChevronDown,
  TbChevronUp,
} from "react-icons/tb";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useGoalsStore } from "@/store/goalsStore";
import { formatOMR } from "@/lib/currency";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GOAL_ICON_MAP } from "@/constants/goalIcons";
import type { SavingsGoal } from "@/types";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";

interface GoalCardProps {
  goal: SavingsGoal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const { updateGoal, deleteGoal } = useGoalsStore();
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "ar" ? ar : enUS;
  const [expanded, setExpanded] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const pct = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100);
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const isComplete = pct >= 100;

  const handleDeposit = () => {
    const value = parseFloat(depositAmount);
    if (!value || value <= 0) {
      sileo.error({
        title: t("goals.error"),
        description: t("goals.enterValidAmount"),
      });
      return;
    }
    updateGoal(goal.id, value);
    sileo.success({
      title: t("goals.deposited"),
      description: t("goals.depositedDesc", { amount: formatOMR(value) }),
    });
    setDepositAmount("");
    setExpanded(false);
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
    sileo.warning({
      title: t("goals.deleted"),
      description: t("goals.deletedDesc"),
    });
  };

  // Progress bar color
  const barColor =
    pct >= 100
      ? "bg-success"
      : pct >= 70
        ? "bg-primary"
        : pct >= 40
          ? "bg-gold"
          : "bg-danger";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg",
              isComplete
                ? "bg-success/10 text-success"
                : "bg-primary-50 dark:bg-primary-950 text-primary",
            )}>
            {(() => {
              const IconComp = GOAL_ICON_MAP[goal.icon ?? "target"];
              return IconComp ? (
                <IconComp className="w-5 h-5" />
              ) : (
                <span className="text-lg">{goal.icon}</span>
              );
            })()}
          </div>
          <div className="min-w-0">
            <p className="font-arabic font-semibold text-sm text-neutral-text dark:text-white truncate">
              {goal.name}
            </p>
            {goal.targetDate && (
              <p className="flex items-center gap-1 font-arabic text-xs text-neutral-muted mt-0.5">
                <TbCalendar className="w-3 h-3" />
                {format(new Date(goal.targetDate), "d MMM yyyy", {
                  locale: dateLocale,
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {isComplete && (
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-arabic font-semibold text-success">
              <TbCheck className="w-3 h-3" /> {t("goals.complete")}
            </span>
          )}
          <button
            onClick={() => setExpanded((p) => !p)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-muted hover:bg-neutral-bg dark:hover:bg-white/5 transition-colors">
            {expanded ? (
              <TbChevronUp className="w-4 h-4" />
            ) : (
              <TbChevronDown className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-danger/60 hover:bg-danger/10 hover:text-danger transition-colors">
            <TbTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amounts */}
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-mono text-xs text-neutral-muted">
          {formatOMR(goal.savedAmount)} <OmaniRial className="w-2.5 h-auto" />
        </span>
        <span className="font-mono text-xs font-semibold text-neutral-text dark:text-white">
          {formatOMR(goal.targetAmount)} <OmaniRial className="w-2.5 h-auto" />
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-neutral-border dark:bg-gray-700 overflow-hidden mb-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("h-full rounded-full", barColor)}
        />
      </div>

      <div className="flex justify-between items-baseline">
        <span
          className={cn(
            "font-arabic text-[11px] font-semibold",
            isComplete ? "text-success" : "text-primary",
          )}>
          {pct.toFixed(1)}%
        </span>
        {!isComplete && (
          <span className="font-arabic text-[11px] text-neutral-muted">
            {t("goals.remaining")} {formatOMR(remaining)}{" "}
            <OmaniRial className="w-2.5 h-auto" />
          </span>
        )}
      </div>

      {/* Deposit panel */}
      <AnimatePresence>
        {expanded && !isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-neutral-border dark:border-gray-700 flex gap-2">
              <Input
                type="number"
                step="0.001"
                placeholder={t("goals.addAmountPlaceholder")}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="font-mono flex-1 h-9 text-sm"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDeposit}
                className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-white text-xs font-arabic font-semibold hover:bg-primary/90 transition-colors flex-shrink-0">
                <TbPlus className="w-3.5 h-3.5" />
                {t("goals.deposit")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Summary stats strip used at top of page
export function GoalsSummary() {
  const goals = useGoalsStore((s) => s.goals);
  const { t } = useTranslation();
  const total = goals.length;
  const completed = goals.filter((g) => g.savedAmount >= g.targetAmount).length;
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  if (total === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        {
          label: t("goals.totalGoals"),
          value: `${total}`,
          icon: TbTarget,
          color: "text-primary",
        },
        {
          label: t("goals.completed"),
          value: `${completed}`,
          icon: TbCheck,
          color: "text-success",
        },
        {
          label: t("goals.totalSaved"),
          value: `${formatOMR(totalSaved, true)}`,
          icon: TbTarget,
          color: "text-gold",
          hasCurrency: true,
        },
      ].map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="rounded-xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-2 text-center shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]">
            <Icon className={cn("w-3.5 h-3.5 mx-auto mb-0.5", s.color)} />
            <p className="font-mono text-xs font-bold text-neutral-text dark:text-white">
              {s.value}{" "}
              {"hasCurrency" in s && s.hasCurrency && (
                <OmaniRial className="w-2.5 h-auto" />
              )}
            </p>
            <p className="font-arabic text-[9px] text-neutral-muted mt-0.5">
              {s.label}
            </p>
          </div>
        );
      })}
      {totalTarget > 0 && (
        <div className="col-span-3 rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-3 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between text-xs font-arabic text-neutral-muted mb-1.5">
            <span>{t("goals.overallProgress")}</span>
            <span className="font-semibold text-primary">
              {((totalSaved / totalTarget) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral-border dark:bg-gray-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (totalSaved / totalTarget) * 100)}%`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
