import { motion } from "framer-motion";
import { useState } from "react";
import { TbMoonStars, TbBulb, TbHeart } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { ZakatCalculator } from "@/components/zakat/ZakatCalculator";
import { NISAB_VALUE, NISAB_GOLD_GRAMS } from "@/constants";
import { formatOMR } from "@/lib/currency";
import GradientText from "@/components/reactbits/GradientText";
import { CharityPage } from "@/pages/CharityPage";
import { cn } from "@/lib/utils";

export function ZakatPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"zakat" | "charity">("zakat");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      <PageHeader
        title={t("zakatPage.title")}
        subtitle={t("zakatPage.subtitle")}
        action={
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <TbMoonStars className="w-5 h-5 text-gold" />
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-neutral-bg dark:bg-white/[0.05]">
        <button
          onClick={() => setActiveTab("zakat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-arabic text-sm font-semibold transition-colors",
            activeTab === "zakat"
              ? "bg-white dark:bg-white/10 text-gold shadow-sm"
              : "text-neutral-muted",
          )}>
          <TbMoonStars className="w-4 h-4" />
          {t("nav.zakat")}
        </button>
        <button
          onClick={() => setActiveTab("charity")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-arabic text-sm font-semibold transition-colors",
            activeTab === "charity"
              ? "bg-white dark:bg-white/10 text-primary shadow-sm"
              : "text-neutral-muted",
          )}>
          <TbHeart className="w-4 h-4" />
          {t("nav.charity")}
        </button>
      </div>

      {activeTab === "zakat" ? (
        <>
          {/* Gradient Text Banner */}
          <div className="flex justify-center">
            <GradientText
              colors={["#D4AF37", "#F5E6A3", "#B8860B", "#FFD700", "#D4AF37"]}
              animationSpeed={5}
              className="font-arabic text-2xl font-bold">
              {t("zakatPage.banner")}
            </GradientText>
          </div>

          {/* Info card */}
          <div className="rounded-2xl border border-gold/20 dark:border-gold/10 backdrop-blur-xl bg-gold/5 dark:bg-gold/[0.03] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
            <p className="font-arabic text-sm text-neutral-text dark:text-white leading-relaxed flex items-start gap-2">
              <TbBulb className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              {t("zakatPage.infoText", {
                grams: NISAB_GOLD_GRAMS,
                value: formatOMR(NISAB_VALUE),
              })}
            </p>
          </div>

          <ZakatCalculator />
        </>
      ) : (
        <CharityPage embedded />
      )}
    </motion.div>
  );
}
