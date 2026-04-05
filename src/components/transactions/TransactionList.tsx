import { AnimatePresence } from "framer-motion";
import { TransactionItem } from "./TransactionItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { TbReceipt } from "react-icons/tb";
import type { Transaction } from "@/types";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "ar" ? ar : enUS;
  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    for (const t of transactions) {
      const dateKey = format(parseISO(t.date), "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={TbReceipt}
        title={t("transactions.noTransactions")}
        description={t("transactions.noTransactionsDesc")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {grouped.map(([dateKey, items]) => (
        <div key={dateKey}>
          <p className="font-arabic text-xs text-neutral-muted mb-2 px-1">
            {format(parseISO(dateKey), "EEEE، d MMMM", { locale: dateLocale })}
          </p>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {items.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
