import { motion } from "framer-motion";
import { TbCoffee, TbGift, TbBook2, TbCash } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { usePointsStore } from "@/store/pointsStore";

const OFFERS = [
  {
    id: "coffee",
    icon: TbCoffee,
    color: "#6B4226",
    bg: "#6B422215",
    points: 500,
  },
  {
    id: "giftcard",
    icon: TbGift,
    color: "#EC4899",
    bg: "#EC489915",
    points: 1000,
  },
  { id: "edu", icon: TbBook2, color: "#3B82F6", bg: "#3B82F615", points: 750 },
  {
    id: "cashback",
    icon: TbCash,
    color: "#10B981",
    bg: "#10B98115",
    points: 300,
  },
];

export function DemoOffers() {
  const { t } = useTranslation();
  const totalPoints = usePointsStore((s) => s.totalPoints);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white">
          {t("rewards.store")}
        </p>
        <span className="px-2 py-0.5 rounded-full font-arabic text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          {t("rewards.comingSoon")}
        </span>
      </div>
      <p className="font-arabic text-xs text-neutral-muted">
        {t("rewards.storeDesc")}
      </p>

      {/* Offer cards */}
      <div className="grid grid-cols-2 gap-3">
        {OFFERS.map((offer, i) => {
          const canAfford = totalPoints >= offer.points;
          const Icon = offer.icon;
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] p-3 space-y-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: offer.bg }}>
                <Icon className="w-5 h-5" style={{ color: offer.color }} />
              </div>
              <p className="font-arabic text-xs font-semibold text-neutral-text dark:text-white leading-tight">
                {t(`rewards.offer_${offer.id}`)}
              </p>
              <div className="flex items-center justify-between gap-1">
                <span className="px-2 py-0.5 rounded-full font-arabic text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
                  {offer.points} {t("rewards.points")}
                </span>
                <button
                  disabled
                  title={t("rewards.comingSoon")}
                  className={`px-2 py-1 rounded-lg font-arabic text-[10px] font-semibold cursor-not-allowed transition-colors ${
                    canAfford
                      ? "bg-primary/10 text-primary opacity-50"
                      : "bg-neutral-bg dark:bg-white/5 text-neutral-muted"
                  }`}>
                  {t("rewards.redeem")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
