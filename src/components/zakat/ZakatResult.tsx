import { motion } from "framer-motion";
import { TbCheck, TbInfoCircle } from "react-icons/tb";
import { sileo } from "sileo";
import type { ZakatResult as ZakatResultType } from "@/types";
import { formatOMR } from "@/lib/currency";
import { NISAB_VALUE, NISAB_GOLD_GRAMS } from "@/constants";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";

interface ZakatResultProps {
  result: ZakatResultType;
}

export function ZakatResult({ result }: ZakatResultProps) {
  const { t } = useTranslation();

  const handleReminder = () => {
    sileo.info({
      title: t("zakatPage.registered"),
      description: t("zakatPage.reminderSet"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4">
      {result.due ? (
        <div className="rounded-2xl border-2 border-gold bg-gold/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <TbCheck className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-arabic font-bold text-gold text-lg">
              {t("zakatPage.zakatDue")}
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3">
            <p className="font-arabic text-xs text-neutral-muted mb-1">
              {result.isLivestock
                ? t("zakatPage.livestockDue")
                : t("zakatPage.zakatAmountDue")}
            </p>
            {result.isLivestock ? (
              <p className="font-arabic text-2xl font-bold text-gold leading-snug">
                {result.reason}
              </p>
            ) : (
              <>
                <p className="font-display text-3xl font-bold text-gold">
                  {formatOMR(result.amount)}{" "}
                  <OmaniRial className="w-6 h-auto" />
                </p>
                <p className="font-arabic text-xs text-neutral-muted mt-1">
                  {result.percentage}% {t("zakatPage.from")}{" "}
                  {formatOMR(result.savings ?? 0)}{" "}
                  <OmaniRial className="w-3 h-auto" />
                </p>
              </>
            )}
          </div>

          {!result.isLivestock && (
            <Button variant="gold" className="w-full" onClick={handleReminder}>
              {t("zakatPage.remindMe")}
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
              <TbInfoCircle className="w-5 h-5 text-info" />
            </div>
            <h3 className="font-arabic font-semibold text-neutral-text dark:text-white">
              {t("zakatPage.zakatNotDue")}
            </h3>
          </div>
          <p className="font-arabic text-sm text-neutral-muted leading-relaxed">
            {result.reason}
          </p>
        </div>
      )}

      {/* Shariah reference */}
      <div className="rounded-xl bg-neutral-bg dark:bg-gray-800 p-4">
        <p className="font-arabic text-xs text-neutral-muted leading-relaxed">
          <strong>{t("zakatPage.shariahRef")}:</strong>{" "}
          {t("zakatPage.shariahText", {
            grams: NISAB_GOLD_GRAMS,
            value: formatOMR(NISAB_VALUE),
          })}
        </p>
        <p className="font-arabic text-xs text-neutral-muted mt-2">
          {t("zakatPage.source")}
        </p>
      </div>
    </motion.div>
  );
}
