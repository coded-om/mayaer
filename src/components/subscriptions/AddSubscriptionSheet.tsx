import { useState } from "react";
import { motion } from "framer-motion";
import { sileo } from "sileo";
import { TbPlus } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscriptionsStore } from "@/store/subscriptionsStore";
import { useTranslation } from "react-i18next";
import type { BillingCycle, CategoryId } from "@/types";
import { cn } from "@/lib/utils";
import { getSubLogo } from "./subLogos";

// ── Preset subscriptions ────────────────────────────────────────────────────

interface Preset {
  name: string;
  emoji: string;
  color: string;
  amount: number;
  billingCycle: BillingCycle;
  category: CategoryId;
}

const PRESETS: Preset[] = [
  {
    name: "Netflix",
    emoji: "🎬",
    color: "#E50914",
    amount: 4.5,
    billingCycle: "monthly",
    category: "entertainment",
  },
  {
    name: "Spotify",
    emoji: "🎵",
    color: "#1DB954",
    amount: 2.0,
    billingCycle: "monthly",
    category: "entertainment",
  },
  {
    name: "YouTube",
    emoji: "▶️",
    color: "#FF0000",
    amount: 3.5,
    billingCycle: "monthly",
    category: "entertainment",
  },
  {
    name: "iCloud",
    emoji: "☁️",
    color: "#0071E3",
    amount: 1.0,
    billingCycle: "monthly",
    category: "other",
  },
  {
    name: "Microsoft 365",
    emoji: "💼",
    color: "#0078D4",
    amount: 4.5,
    billingCycle: "monthly",
    category: "education",
  },
  {
    name: "Anghami",
    emoji: "🎶",
    color: "#7B22D4",
    amount: 1.5,
    billingCycle: "monthly",
    category: "entertainment",
  },
  {
    name: "Apple TV+",
    emoji: "🍎",
    color: "#555555",
    amount: 3.0,
    billingCycle: "monthly",
    category: "entertainment",
  },
  {
    name: "نادي رياضي",
    emoji: "💪",
    color: "#F97316",
    amount: 15.0,
    billingCycle: "monthly",
    category: "health",
  },
  {
    name: "إنترنت منزل",
    emoji: "🌐",
    color: "#3B82F6",
    amount: 15.0,
    billingCycle: "monthly",
    category: "bills",
  },
  {
    name: "Amazon Prime",
    emoji: "📦",
    color: "#FF9900",
    amount: 4.0,
    billingCycle: "monthly",
    category: "shopping",
  },
];

const PALETTE = [
  "#E50914",
  "#1DB954",
  "#0071E3",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
  "#1F7A63",
  "#F59E0B",
];

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "entertainment", label: "ترفيه" },
  { id: "health", label: "صحة" },
  { id: "education", label: "تعليم" },
  { id: "bills", label: "فواتير" },
  { id: "shopping", label: "تسوق" },
  { id: "other", label: "أخرى" },
];

const CYCLES: { id: BillingCycle; labelKey: string }[] = [
  { id: "monthly", labelKey: "subscriptions.monthly" },
  { id: "quarterly", labelKey: "subscriptions.quarterly" },
  { id: "yearly", labelKey: "subscriptions.yearly" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function AddSubscriptionSheet() {
  const { t } = useTranslation();
  const addSubscription = useSubscriptionsStore((s) => s.addSubscription);
  const [open, setOpen] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("⭐");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [category, setCategory] = useState<CategoryId>("entertainment");
  const [color, setColor] = useState(PALETTE[0]);
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  function applyPreset(p: Preset) {
    setName(p.name);
    setEmoji(p.emoji);
    setAmount(p.amount.toFixed(3));
    setCycle(p.billingCycle);
    setCategory(p.category);
    setColor(p.color);
  }

  function reset() {
    setName("");
    setEmoji("⭐");
    setAmount("");
    setCycle("monthly");
    setCategory("entertainment");
    setColor(PALETTE[0]);
    setStartDate(new Date().toISOString().split("T")[0]);
  }

  function handleSave() {
    const parsedAmount = parseFloat(amount);
    if (!name.trim()) {
      sileo.error({ title: t("subscriptions.errorName") });
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      sileo.error({ title: t("subscriptions.errorAmount") });
      return;
    }

    addSubscription({
      name: name.trim(),
      emoji,
      amount: parsedAmount,
      billingCycle: cycle,
      category,
      color,
      startDate,
      isActive: true,
    });

    sileo.success({ title: t("subscriptions.added") });
    reset();
    setOpen(false);
  }

  return (
    <>
      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center
                   md:bottom-8 md:left-auto md:right-8 md:translate-x-0">
        <TbPlus className="w-7 h-7" />
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("subscriptions.addTitle")}</SheetTitle>
            <SheetDescription>{t("subscriptions.addDesc")}</SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-5 pb-6">
            {/* Quick presets */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-2">
                {t("subscriptions.quickAdd")}
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                    const logo = getSubLogo(p.name);
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-arabic border transition-all",
                          name === p.name
                            ? "text-white border-transparent shadow-sm"
                            : "bg-white/50 dark:bg-white/5 border-white/70 dark:border-white/10 text-neutral-text dark:text-gray-300",
                        )}
                        style={
                          name === p.name
                            ? { backgroundColor: p.color, borderColor: p.color }
                            : {}
                        }>
                        {logo ? (
                          <img src={logo} alt={p.name} className="w-4 h-4 object-contain rounded" />
                        ) : (
                          <span>{p.emoji}</span>
                        )}
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Emoji + Name row */}
            <div className="flex gap-3 items-end">
              <div className="w-20 flex-shrink-0">
                <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                  {t("subscriptions.emoji")}
                </label>
                <Input
                  value={emoji}
                  onChange={(e) => {
                    const chars = [...e.target.value];
                    setEmoji(chars[chars.length - 1] ?? "⭐");
                  }}
                  className="text-center text-2xl h-12"
                  maxLength={4}
                />
              </div>
              <div className="flex-1">
                <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                  {t("subscriptions.name")}
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("subscriptions.namePlaceholder")}
                />
              </div>
            </div>

            {/* Amount + Billing Cycle */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                  {t("subscriptions.amount")} (ر.ع)
                </label>
                <Input
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-mono text-lg h-12"
                />
              </div>
              <div className="flex-1">
                <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                  {t("subscriptions.billingCycle")}
                </label>
                <div className="flex flex-col gap-1">
                  {CYCLES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCycle(c.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-arabic text-center transition-all border",
                        cycle === c.id
                          ? "bg-primary/10 border-primary text-primary font-medium"
                          : "bg-white/50 dark:bg-white/5 border-white/70 dark:border-white/10 text-neutral-muted",
                      )}>
                      {t(c.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-2">
                {t("subscriptions.category")}
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-arabic border transition-all",
                      category === cat.id
                        ? "bg-primary/10 border-primary text-primary font-medium"
                        : "bg-white/50 dark:bg-white/5 border-white/70 dark:border-white/10 text-neutral-muted",
                    )}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-2">
                {t("subscriptions.color")}
              </label>
              <div className="flex gap-2 flex-wrap">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110 border-2"
                    style={{
                      backgroundColor: c,
                      borderColor: color === c ? "#000" : "transparent",
                      outline: color === c ? `3px solid ${c}55` : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Start date */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("subscriptions.startDate")}
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* Preview */}
            {name && (() => {
              const previewLogo = getSubLogo(name);
              return (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: color + "18" }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl overflow-hidden"
                    style={{ backgroundColor: previewLogo ? "#fff" : color + "30", border: `1.5px solid ${color}33` }}>
                    {previewLogo ? (
                      <img src={previewLogo} alt={name} className="w-7 h-7 object-contain" />
                    ) : (
                      emoji
                    )}
                  </div>
                  <div>
                    <p
                      className="font-arabic text-sm font-semibold"
                      style={{ color }}>
                      {name}
                    </p>
                    <p className="font-arabic text-xs text-neutral-muted">
                      {amount || "0.000"} ر.ع ·{" "}
                      {t(CYCLES.find((c) => c.id === cycle)?.labelKey ?? "")}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Save button */}
            <Button
              onClick={handleSave}
              className="w-full h-12 text-base"
              style={{ backgroundColor: color }}>
              {t("subscriptions.save")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
