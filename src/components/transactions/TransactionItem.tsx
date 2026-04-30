import { motion } from "framer-motion";
import { TbArrowUpRight, TbArrowDownLeft, TbTrash } from "react-icons/tb";
import { sileo } from "sileo";
import type { Transaction } from "@/types";
import { getCategoryById, getCategoryIcon } from "@/lib/categories";
import { formatOMR } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useBudgetStore } from "@/store/budgetStore";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const deleteTransaction = useBudgetStore((s) => s.deleteTransaction);
  const { t } = useTranslation();
  const category = getCategoryById(transaction.category);
  const CategoryIcon = category
    ? getCategoryIcon(category.icon)
    : getCategoryIcon("TbDots");
  const isIncome = transaction.type === "income";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className="flex items-center gap-3 p-3 rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${category?.color ?? "#9CA3AF"}15` }}>
        <CategoryIcon className="w-5 h-5" style={{ color: category?.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-arabic text-sm font-medium text-neutral-text dark:text-white truncate">
          {category ? t(`categories.${category.id}`) : t("categories.other")}
        </p>
        {transaction.note && (
          <p className="font-arabic text-xs text-neutral-muted truncate">
            {transaction.note}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="text-left">
          <p
            className={cn(
              "font-mono text-sm font-bold",
              isIncome ? "text-success" : "text-danger",
            )}>
            {isIncome ? "+" : "-"}
            {formatOMR(transaction.amount)}{" "}
            <OmaniRial className="w-2.5 h-auto" />
          </p>
        </div>
        <div
          className={cn("w-5 h-5", isIncome ? "text-success" : "text-danger")}>
          {isIncome ? (
            <TbArrowUpRight className="w-5 h-5" />
          ) : (
            <TbArrowDownLeft className="w-5 h-5" />
          )}
        </div>
      </div>

      <button
        onClick={() => {
          deleteTransaction(transaction.id);
          sileo.warning({
            title: t("transactions.deleted"),
            description: t("transactions.deletedDesc"),
          });
        }}
        className="p-1 text-neutral-muted hover:text-danger transition-colors">
        <TbTrash className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
