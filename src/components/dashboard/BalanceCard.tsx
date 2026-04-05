import { motion } from "framer-motion";
import {
  TbArrowUpRight,
  TbArrowDownLeft,
  TbAlertTriangle,
} from "react-icons/tb";
import { RiMoonLine } from "react-icons/ri";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatOMR } from "@/lib/currency";
import Counter from "@/components/reactbits/Counter";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";
import { cn } from "@/lib/utils";

export function BalanceCard() {
  const { income, expense, savings } = useBudgetSummary();
  const { t } = useTranslation();

  // Determine color level based on savings ratio
  const ratio = income > 0 ? savings / income : savings >= 0 ? 1 : -1;
  const isNegative = savings < 0;
  const isLow = !isNegative && ratio < 0.2;

  const gradientClass = isNegative
    ? "bg-gradient-to-bl from-red-500 to-red-700"
    : isLow
      ? "bg-gradient-to-bl from-amber-500 to-amber-700"
      : "bg-gradient-to-bl from-primary to-primary-700";

  const shadowClass = isNegative
    ? "shadow-[0_4px_24px_rgba(239,68,68,0.25)]"
    : isLow
      ? "shadow-[0_4px_24px_rgba(245,158,11,0.25)]"
      : "shadow-[0_4px_24px_rgba(31,122,99,0.25)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-white h-full",
        gradientClass,
        shadowClass,
      )}>
      <div className="relative z-10">
        <p className="font-arabic text-sm text-white/80 mb-1">
          {t("dashboard.remainingBalance")}
        </p>
        {(isNegative || isLow) && (
          <div className="flex items-center gap-1.5 mb-2">
            <TbAlertTriangle className="w-4 h-4 text-white/90" />
            <p className="font-arabic text-xs text-white/90">
              {isNegative
                ? t("dashboard.balanceNegative")
                : t("dashboard.balanceLow")}
            </p>
          </div>
        )}
        <div
          className="font-display text-4xl font-bold mb-4 flex items-baseline gap-1"
          dir="ltr">
          <Counter
            value={Number(savings.toFixed(3))}
            fontSize={36}
            padding={0}
            gap={2}
            borderRadius={4}
            horizontalPadding={0}
            textColor="white"
            fontWeight="bold"
            gradientHeight={0}
            gradientFrom="transparent"
            gradientTo="transparent"
          />
          <span className="text-lg text-white/70 mr-1">
            <OmaniRial />
          </span>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 rounded-xl backdrop-blur-md bg-white/15 border border-white/20 px-3 py-1.5">
            <TbArrowUpRight className="w-4 h-4 text-green-300" />
            <div>
              <p className="text-[10px] text-white/70">
                {t("dashboard.income")}
              </p>
              <p className="font-mono text-xs font-semibold">
                {formatOMR(income, true)} <OmaniRial className="w-2.5 h-auto" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl backdrop-blur-md bg-white/15 border border-white/20 px-3 py-1.5">
            <TbArrowDownLeft className="w-4 h-4 text-red-300" />
            <div>
              <p className="text-[10px] text-white/70">
                {t("dashboard.expense")}
              </p>
              <p className="font-mono text-xs font-semibold">
                {formatOMR(expense, true)}{" "}
                <OmaniRial className="w-2.5 h-auto" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl backdrop-blur-md bg-gold/20 border border-gold/30 px-3 py-1.5">
            <RiMoonLine className="w-4 h-4 text-gold" />
            <div>
              <p className="text-[10px] text-white/70">
                {t("dashboard.zakat")}
              </p>
              <p className="font-mono text-xs font-semibold">
                {formatOMR(savings * 0.025, true)}{" "}
                <OmaniRial className="w-2.5 h-auto" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/5" />
    </motion.div>
  );
}
