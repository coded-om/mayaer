import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TbBrain } from "react-icons/tb";
import { useFinancialMonth } from "@/hooks/useFinancialMonth";
import { OmaniRial } from "@/components/ui/OmaniRial";

export function PredictionCard() {
  const { t } = useTranslation();
  const { predictions, surplus } = useFinancialMonth();

  if (predictions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <TbBrain className="w-5 h-5 text-purple-500" />
        <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
          {t("financialMonth.prediction")}
        </span>
      </div>
      <p className="font-arabic text-xs text-neutral-muted mb-3">
        {t("financialMonth.predictionDesc")}
      </p>

      {/* Category predictions */}
      <div className="space-y-2.5">
        {predictions.slice(0, 6).map((p) => {
          const maxVal = Math.max(p.predicted, p.actual);
          const predictedWidth = maxVal > 0 ? (p.predicted / maxVal) * 100 : 0;
          const actualWidth = maxVal > 0 ? (p.actual / maxVal) * 100 : 0;
          const isOver = p.actual > p.predicted && p.predicted > 0;

          return (
            <div key={p.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-arabic text-xs text-neutral-text dark:text-gray-300">
                  {t(`categories.${p.category}`)}
                </span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-purple-500 flex items-center gap-0.5">
                    <OmaniRial className="w-2 h-2" />
                    {p.predicted.toFixed(1)}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 ${isOver ? "text-red-500" : "text-emerald-500"}`}>
                    <OmaniRial className="w-2 h-2" />
                    {p.actual.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="h-1 rounded-full bg-neutral-bg dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-400/60"
                    style={{ width: `${predictedWidth}%` }}
                  />
                </div>
                <div className="h-1 rounded-full bg-neutral-bg dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isOver ? "bg-red-400" : "bg-emerald-400"}`}
                    style={{ width: `${actualWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-white/30 dark:border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-1 rounded-full bg-purple-400/60" />
            <span className="font-arabic text-[10px] text-neutral-muted">
              {t("financialMonth.predicted")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-1 rounded-full bg-emerald-400" />
            <span className="font-arabic text-[10px] text-neutral-muted">
              {t("financialMonth.actual")}
            </span>
          </div>
        </div>
        <span
          className={`font-arabic text-xs font-semibold flex items-center gap-0.5 ${
            surplus >= 0 ? "text-emerald-500" : "text-red-500"
          }`}>
          <OmaniRial className="w-2.5 h-2.5" />
          {Math.abs(surplus).toFixed(1)}{" "}
          {surplus >= 0
            ? t("financialMonth.surplus")
            : t("financialMonth.deficit")}
        </span>
      </div>
    </motion.div>
  );
}
