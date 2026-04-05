import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TransactionList } from "@/components/transactions/TransactionList";
import { AddExpenseSheet } from "@/components/transactions/AddExpenseSheet";
import { PageHeader } from "@/components/shared/PageHeader";
import { useBudgetStore } from "@/store/budgetStore";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types";

type FilterType = "all" | "income" | "expense";

/** Returns sorted unique "YYYY-MM" keys present in transactions, most recent first, plus current month */
function buildMonthOptions(transactions: Transaction[]): string[] {
  const monthSet = new Set<string>();
  monthSet.add(format(new Date(), "yyyy-MM")); // always include current month
  for (const tx of transactions) {
    monthSet.add(tx.date.slice(0, 7));
  }
  return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
}

export function TransactionsPage() {
  const transactions = useBudgetStore((s) => s.transactions);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "ar" ? ar : enUS;

  const monthOptions = useMemo(
    () => buildMonthOptions(transactions),
    [transactions],
  );

  const filtered: Transaction[] = useMemo(() => {
    let result = transactions;

    // Month filter
    if (selectedMonth) {
      const monthDate = parseISO(`${selectedMonth}-01`);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      result = result.filter((tx) =>
        isWithinInterval(parseISO(tx.date), { start, end }),
      );
    }

    // Type filter
    if (filter !== "all") {
      result = result.filter((tx) => tx.type === filter);
    }

    return result;
  }, [transactions, filter, selectedMonth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      <PageHeader
        title={t("transactions.title")}
        subtitle={t("transactions.subtitle")}
      />

      {/* Month selector — horizontal scroll chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        <button
          onClick={() => setSelectedMonth(null)}
          className={cn(
            "flex-shrink-0 rounded-full px-3.5 py-1 font-arabic text-xs font-medium transition-all",
            selectedMonth === null
              ? "bg-primary text-white"
              : "bg-neutral-100 dark:bg-gray-800 text-neutral-muted hover:bg-neutral-200 dark:hover:bg-gray-700",
          )}>
          {t("transactions.all")}
        </button>
        {monthOptions.map((m) => {
          const label = format(parseISO(`${m}-01`), "MMM yyyy", {
            locale: dateLocale,
          });
          return (
            <button
              key={m}
              onClick={() => setSelectedMonth(m === selectedMonth ? null : m)}
              className={cn(
                "flex-shrink-0 rounded-full px-3.5 py-1 font-arabic text-xs font-medium transition-all",
                selectedMonth === m
                  ? "bg-primary text-white"
                  : "bg-neutral-100 dark:bg-gray-800 text-neutral-muted hover:bg-neutral-200 dark:hover:bg-gray-700",
              )}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Type tabs */}
      <Tabs
        defaultValue="all"
        onValueChange={(v) => setFilter(v as FilterType)}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            {t("transactions.all")}
          </TabsTrigger>
          <TabsTrigger value="income" className="flex-1">
            {t("transactions.income")}
          </TabsTrigger>
          <TabsTrigger value="expense" className="flex-1">
            {t("transactions.expense")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TransactionList transactions={filtered} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionList transactions={filtered} />
        </TabsContent>
        <TabsContent value="expense">
          <TransactionList transactions={filtered} />
        </TabsContent>
      </Tabs>

      <AddExpenseSheet />
    </motion.div>
  );
}
