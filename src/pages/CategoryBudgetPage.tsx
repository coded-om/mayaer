import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBudgetStore } from "@/store/budgetStore";
import { CATEGORIES } from "@/constants";
import type { CategoryId } from "@/types";
import { TbAlertTriangle, TbCheck, TbTrash } from "react-icons/tb";
import { cn } from "@/lib/utils";

export function CategoryBudgetPage() {
  const { t } = useTranslation();
  const {
    categoryBudgets,
    setCategoryBudget,
    removeCategoryBudget,
    getCategorySpent,
  } = useBudgetStore();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    null,
  );
  const [limitInput, setLimitInput] = useState("");

  const handleSetBudget = () => {
    if (!selectedCategory) return;
    const num = parseFloat(limitInput);
    if (!num || num <= 0) return;
    setCategoryBudget(selectedCategory, num);
    setSelectedCategory(null);
    setLimitInput("");
  };

  // Categories that don't have a budget set yet
  const unbudgetedCategories = CATEGORIES.filter(
    (c) => !categoryBudgets.find((b) => b.category === c.id),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-arabic text-xl font-bold text-neutral-text dark:text-white">
          {t("categoryBudget.title")}
        </h1>
        <p className="font-arabic text-sm text-neutral-muted dark:text-gray-400">
          {t("categoryBudget.subtitle")}
        </p>
      </div>

      {/* Active budgets */}
      {categoryBudgets.length > 0 && (
        <div className="space-y-3">
          {categoryBudgets.map((budget, i) => {
            const cat = CATEGORIES.find((c) => c.id === budget.category);
            if (!cat) return null;
            const spent = getCategorySpent(budget.category);
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const isOver = spent > budget.limit;
            const isWarning = percentage >= 80 && !isOver;

            return (
              <motion.div
                key={budget.category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "rounded-2xl border p-4 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]",
                  isOver
                    ? "border-red-300/60 bg-red-50/70 dark:bg-red-950/15 dark:border-red-800/40"
                    : isWarning
                      ? "border-yellow-300/60 bg-yellow-50/70 dark:bg-yellow-950/15 dark:border-yellow-800/40"
                      : "border-white/70 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04]",
                )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
                      {t(`categories.${cat.id}`)}
                    </span>
                    {isOver && (
                      <TbAlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    {isWarning && (
                      <TbAlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <button
                    onClick={() => removeCategoryBudget(budget.category)}
                    className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-muted hover:text-red-500 transition-colors">
                    <TbTrash className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress */}
                <div className="h-2 rounded-full bg-neutral-bg dark:bg-gray-800 overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6 }}
                    className={cn(
                      "h-full rounded-full",
                      isOver
                        ? "bg-red-500"
                        : isWarning
                          ? "bg-yellow-500"
                          : "bg-success",
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-muted">
                    {spent.toFixed(2)} / {budget.limit.toFixed(2)}
                  </span>
                  <span
                    className={cn(
                      "font-arabic text-xs font-semibold",
                      isOver
                        ? "text-red-500"
                        : isWarning
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-success",
                    )}>
                    {isOver
                      ? t("categoryBudget.exceeded")
                      : isWarning
                        ? t("categoryBudget.warning")
                        : t("categoryBudget.onTrack")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add budget section */}
      {unbudgetedCategories.length > 0 && (
        <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4 space-y-3">
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
            {t("categoryBudget.setLimit")}
          </p>

          {/* Category picker */}
          <div className="flex flex-wrap gap-2">
            {unbudgetedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-arabic text-xs transition-colors",
                  selectedCategory === cat.id
                    ? "text-white"
                    : "bg-neutral-bg dark:bg-gray-800 text-neutral-muted",
                )}
                style={
                  selectedCategory === cat.id
                    ? { backgroundColor: cat.color }
                    : undefined
                }>
                {t(`categories.${cat.id}`)}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-2">
              <input
                type="number"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                placeholder={t("categoryBudget.limitPlaceholder")}
                className="flex-1 rounded-lg border border-neutral-border dark:border-gray-700 bg-neutral-bg dark:bg-gray-800 px-4 py-2.5 font-mono text-sm text-neutral-text dark:text-white placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                dir="ltr"
              />
              <button
                onClick={handleSetBudget}
                className="px-4 py-2.5 rounded-lg bg-primary text-white font-arabic text-xs font-semibold hover:bg-primary-700 transition-colors">
                <TbCheck className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      )}

      {categoryBudgets.length === 0 && (
        <p className="font-arabic text-center text-sm text-neutral-muted py-4">
          {t("categoryBudget.noLimits")}
        </p>
      )}
    </motion.div>
  );
}
