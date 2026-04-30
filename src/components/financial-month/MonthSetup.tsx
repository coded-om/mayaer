import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbPlus,
  TbTrash,
  TbCalendar,
  TbReceipt,
  TbChartBar,
  TbChevronDown,
} from "react-icons/tb";
import { useFinancialMonthStore } from "@/store/financialMonthStore";
import { CATEGORIES } from "@/constants";
import type { CategoryId } from "@/types";

interface MonthSetupProps {
  onSave: () => void;
}

export function MonthSetup({ onSave }: MonthSetupProps) {
  const { t } = useTranslation();
  const config = useFinancialMonthStore((s) => s.config);
  const setConfig = useFinancialMonthStore((s) => s.setConfig);

  const [showExplainer, setShowExplainer] = useState(true);
  const [salaryDay, setSalaryDay] = useState(config?.salaryDay ?? 25);
  const [reminderDays, setReminderDays] = useState(
    config?.reminderDaysBefore ?? 3,
  );
  const [expenses, setExpenses] = useState(config?.fixedExpenses ?? []);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<CategoryId>("bills");

  const addExpense = () => {
    const amount = parseFloat(newAmount);
    if (!newName.trim() || isNaN(amount) || amount <= 0) return;
    setExpenses([
      ...expenses,
      {
        id: crypto.randomUUID(),
        name: newName.trim(),
        amount,
        category: newCategory,
        isRecurring: true,
      },
    ]);
    setNewName("");
    setNewAmount("");
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleSave = () => {
    setConfig({
      salaryDay,
      reminderDaysBefore: reminderDays,
      fixedExpenses: expenses,
    });
    onSave();
  };

  return (
    <div className="space-y-5">
      {/* Explainer banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 overflow-hidden">
        <button
          onClick={() => setShowExplainer((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3">
          <p className="font-arabic text-sm font-bold text-primary">
            {t("financialMonth.howItWorks")}
          </p>
          <TbChevronDown
            className={`w-4 h-4 text-primary transition-transform duration-200 ${
              showExplainer ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence initial={false}>
          {showExplainer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden">
              <div className="grid grid-cols-3 gap-3 px-4 pb-4">
                {[
                  {
                    icon: TbCalendar,
                    title: t("financialMonth.explainerStep1"),
                    desc: t("financialMonth.explainerStep1Desc"),
                  },
                  {
                    icon: TbReceipt,
                    title: t("financialMonth.explainerStep2"),
                    desc: t("financialMonth.explainerStep2Desc"),
                  },
                  {
                    icon: TbChartBar,
                    title: t("financialMonth.explainerStep3"),
                    desc: t("financialMonth.explainerStep3Desc"),
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="text-center space-y-1.5">
                    <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-arabic text-xs font-semibold text-neutral-text dark:text-white leading-tight">
                      {title}
                    </p>
                    <p className="font-arabic text-[10px] text-neutral-muted leading-tight">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4 space-y-4">
        {/* Salary Day */}
        <div>
          <label className="font-arabic text-sm font-medium text-neutral-text dark:text-white block mb-1.5">
            {t("financialMonth.salaryDay")}
          </label>
          <p className="font-arabic text-xs text-neutral-muted mb-2">
            {t("financialMonth.salaryDayDesc")}
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 5, 10, 15, 20, 25, 28].map((day) => (
              <button
                key={day}
                onClick={() => setSalaryDay(day)}
                className={`w-10 h-10 rounded-xl font-arabic text-sm font-semibold transition-colors ${
                  salaryDay === day
                    ? "bg-primary text-white"
                    : "bg-white/50 dark:bg-white/5 text-neutral-text dark:text-gray-300 hover:bg-primary/10"
                }`}>
                {day}
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="31"
              value={salaryDay}
              onChange={(e) =>
                setSalaryDay(
                  Math.min(31, Math.max(1, parseInt(e.target.value) || 1)),
                )
              }
              className="w-16 h-10 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] text-center font-arabic text-sm text-neutral-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Reminder Days */}
        <div>
          <label className="font-arabic text-sm font-medium text-neutral-text dark:text-white block mb-1.5">
            {t("financialMonth.reminderDays")}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={reminderDays}
              onChange={(e) => setReminderDays(parseInt(e.target.value) || 1)}
              className="w-16 h-10 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] text-center font-arabic text-sm text-neutral-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="font-arabic text-sm text-neutral-muted">
              {t("financialMonth.days")}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Expenses */}
      <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-4 space-y-3">
        <h3 className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
          {t("financialMonth.fixedExpenses")}
        </h3>
        <p className="font-arabic text-xs text-neutral-muted">
          {t("financialMonth.fixedExpensesDesc")}
        </p>

        {/* Existing list */}
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-white/50 dark:border-white/[0.06]">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor:
                  CATEGORIES.find((c) => c.id === exp.category)?.color ??
                  "#9CA3AF",
              }}
            />
            <span className="font-arabic text-sm text-neutral-text dark:text-white flex-1 truncate">
              {exp.name}
            </span>
            <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white shrink-0">
              {exp.amount.toFixed(3)}
            </span>
            <button
              onClick={() => removeExpense(exp.id)}
              className="p-1 rounded-lg hover:bg-red-500/10 text-neutral-muted hover:text-red-500 transition-colors">
              <TbTrash className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Add new */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("financialMonth.expenseName")}
              className="flex-1 px-3 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] font-arabic text-sm text-neutral-text dark:text-white placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="number"
              step="0.001"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder={t("financialMonth.expenseAmount")}
              className="w-28 px-3 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] font-arabic text-sm text-neutral-text dark:text-white placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as CategoryId)}
              className="flex-1 px-3 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/[0.08] font-arabic text-sm text-neutral-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30">
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={addExpense}
              className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-arabic text-sm font-semibold hover:bg-primary/20 transition-colors">
              <TbPlus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3 rounded-xl font-arabic text-sm font-semibold bg-primary text-white hover:bg-primary-700 transition-colors">
        {t("financialMonth.saveConfig")}
      </button>
    </div>
  );
}
