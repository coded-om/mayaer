import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCharityStore } from "@/store/charityStore";
import type { CharityEntry } from "@/store/charityStore";
import { usePointsStore, POINT_VALUES } from "@/store/pointsStore";
import {
  TbHeart,
  TbPlus,
  TbTrash,
  TbCoin,
  TbHandFinger,
  TbDots,
} from "react-icons/tb";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

const CHARITY_TYPES: CharityEntry["type"][] = ["sadaqah", "zakat", "other"];

export function CharityPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const locale = isAr ? ar : enUS;
  const { entries, addEntry, deleteEntry, getTotal, getThisMonth } =
    useCharityStore();
  const addPoints = usePointsStore((s) => s.addPoints);

  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<CharityEntry["type"]>("sadaqah");

  const thisMonthEntries = getThisMonth();
  const thisMonthTotal = thisMonthEntries.reduce((s, e) => s + e.amount, 0);

  const handleAdd = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;
    addEntry({
      amount: numAmount,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
      type,
    });
    addPoints(POINT_VALUES.CHARITY_DONATION, "charity_donation");
    setAmount("");
    setNote("");
    setType("sadaqah");
    setShowForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-arabic text-xl font-bold text-neutral-text dark:text-white">
          {t("charity.title")}
        </h1>
        <p className="font-arabic text-sm text-neutral-muted dark:text-gray-400">
          {t("charity.subtitle")}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-green-50/70 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/40 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
          <TbHeart className="w-5 h-5 text-success mb-2" />
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("charity.thisMonth")}
          </p>
          <p className="font-mono text-lg font-bold text-success">
            {thisMonthTotal.toFixed(2)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
          <TbCoin className="w-5 h-5 text-purple-500 mb-2" />
          <p className="font-arabic text-[10px] text-neutral-muted">
            {t("charity.total")}
          </p>
          <p className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400">
            {getTotal().toFixed(2)}
          </p>
        </motion.div>
      </div>

      {/* Add button / Form */}
      {!showForm ? (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary font-arabic text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
          <TbPlus className="w-5 h-5" />
          {t("charity.addCharity")}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4 space-y-3">
          {/* Type selector */}
          <div className="flex gap-2">
            {CHARITY_TYPES.map((ct) => (
              <button
                key={ct}
                onClick={() => setType(ct)}
                className={cn(
                  "flex-1 py-2 rounded-lg font-arabic text-xs font-semibold transition-colors",
                  type === ct
                    ? "bg-primary text-white"
                    : "bg-neutral-bg dark:bg-gray-800 text-neutral-muted",
                )}>
                {t(`charity.${ct}`)}
              </button>
            ))}
          </div>

          {/* Amount */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("charity.amount")}
            className="w-full rounded-lg border border-neutral-border dark:border-gray-700 bg-neutral-bg dark:bg-gray-800 px-4 py-3 font-mono text-sm text-neutral-text dark:text-white placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            dir="ltr"
          />

          {/* Note */}
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("charity.note")}
            className="w-full rounded-lg border border-neutral-border dark:border-gray-700 bg-neutral-bg dark:bg-gray-800 px-4 py-3 font-arabic text-sm text-neutral-text dark:text-white placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 rounded-lg bg-neutral-bg dark:bg-gray-800 font-arabic text-xs font-semibold text-neutral-muted">
              {t("common.cancel")}
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded-lg bg-primary text-white font-arabic text-xs font-semibold hover:bg-primary-700 transition-colors">
              {t("common.save")}
            </button>
          </div>
        </motion.div>
      )}

      {/* Entries list */}
      <div className="space-y-2">
        {entries.length === 0 && (
          <p className="font-arabic text-center text-sm text-neutral-muted py-8">
            {t("charity.noEntries")}
          </p>
        )}
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                entry.type === "sadaqah"
                  ? "bg-green-100 dark:bg-green-900/40"
                  : entry.type === "zakat"
                    ? "bg-purple-100 dark:bg-purple-900/40"
                    : "bg-blue-100 dark:bg-blue-900/40",
              )}>
              {entry.type === "sadaqah" ? (
                <TbHeart className="w-5 h-5 text-success" />
              ) : entry.type === "zakat" ? (
                <TbHandFinger className="w-5 h-5 text-purple-500" />
              ) : (
                <TbDots className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
                {t(`charity.${entry.type}`)}
              </p>
              {entry.note && (
                <p className="font-arabic text-xs text-neutral-muted truncate">
                  {entry.note}
                </p>
              )}
              <p className="font-mono text-[10px] text-neutral-muted">
                {format(new Date(entry.date), "d MMM yyyy", { locale })}
              </p>
            </div>
            <p className="font-mono text-sm font-bold text-success shrink-0">
              {entry.amount.toFixed(2)}
            </p>
            <button
              onClick={() => deleteEntry(entry.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-muted hover:text-red-500 transition-colors shrink-0">
              <TbTrash className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
