import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";
import { TbPlus, TbCoin, TbCreditCardPay } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBudgetStore } from "@/store/budgetStore";
import { useStreakStore } from "@/store/streakStore";
import { usePointsStore, POINT_VALUES } from "@/store/pointsStore";
import { useAchievementsStore } from "@/store/achievementsStore";
import { CATEGORIES } from "@/constants";
import { getCategoryIcon } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";

export function AddExpenseSheet() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("food");
  const addTransaction = useBudgetStore((s) => s.addTransaction);
  const checkInToday = useStreakStore((s) => s.checkInToday);
  const addPoints = usePointsStore((s) => s.addPoints);
  const checkAchievements = useAchievementsStore((s) => s.checkAchievements);

  const transactionSchema = useMemo(
    () =>
      z.object({
        amount: z
          .number({ error: t("transactions.enterValidAmount") })
          .positive(t("transactions.amountPositive")),
        note: z.string().optional(),
      }),
    [t],
  );

  type FormData = z.infer<typeof transactionSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(transactionSchema),
  });

  const onSubmit = (data: FormData) => {
    addTransaction({
      type,
      amount: data.amount,
      category: selectedCategory,
      note: data.note,
      date: new Date().toISOString(),
    });

    checkInToday();
    addPoints(POINT_VALUES.ADD_TRANSACTION, "add_transaction");
    checkAchievements();

    sileo.success({
      title:
        type === "income"
          ? t("transactions.incomeAdded")
          : t("transactions.expenseSaved"),
    });
    reset();
    setOpen(false);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 end-5 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center
                   md:bottom-8 md:end-8">
        <TbPlus className="w-7 h-7" />
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("transactions.addTransaction")}</SheetTitle>
            <SheetDescription>
              {t("transactions.addTransactionDesc")}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
            {/* Type toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("income")}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-arabic font-semibold transition-all",
                  type === "income"
                    ? "bg-success text-white"
                    : "bg-neutral-bg text-neutral-muted dark:bg-gray-800",
                )}>
                <TbCoin className="w-4 h-4 inline-block ml-1" />{" "}
                {t("transactions.incomeBtn")}
              </button>
              <button
                type="button"
                onClick={() => setType("expense")}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-arabic font-semibold transition-all",
                  type === "expense"
                    ? "bg-danger text-white"
                    : "bg-neutral-bg text-neutral-muted dark:bg-gray-800",
                )}>
                <TbCreditCardPay className="w-4 h-4 inline-block ml-1" />{" "}
                {t("transactions.expenseBtn")}
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("transactions.amount")}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  className="text-2xl font-mono font-bold h-14 text-center"
                  {...register("amount", { valueAsNumber: true })}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-muted">
                  <OmaniRial />
                </span>
              </div>
              {errors.amount && (
                <p className="text-danger text-xs font-arabic mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-2">
                {t("transactions.category")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <AnimatePresence>
                  {CATEGORIES.map((cat) => {
                    const Icon = getCategoryIcon(cat.icon);
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all",
                          isSelected
                            ? "border-primary bg-primary-50 dark:bg-primary-950"
                            : "border-white/70 bg-white/60 dark:bg-white/[0.04] dark:border-white/[0.08]",
                        )}>
                        <Icon
                          className="w-5 h-5"
                          style={{ color: cat.color }}
                        />
                        <span className="font-arabic text-[10px] text-neutral-text dark:text-white">
                          {t(`categories.${cat.id}`)}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("transactions.note")}
              </label>
              <Input
                placeholder={t("transactions.notePlaceholder")}
                {...register("note")}
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              {t("transactions.saveTransaction")}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
