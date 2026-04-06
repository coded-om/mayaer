import { motion } from "framer-motion";
import {
  TbArrowUpRight,
  TbArrowDownLeft,
  TbAlertTriangle,
  TbPigMoney,
  TbWifi,
} from "react-icons/tb";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { formatOMR } from "@/lib/currency";
import Counter from "@/components/reactbits/Counter";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";
import { cn } from "@/lib/utils";

export function BalanceCard() {
  const { income, expense, savings } = useBudgetSummary();
  const { t } = useTranslation();

  const ratio = income > 0 ? savings / income : savings >= 0 ? 1 : -1;
  const isNegative = savings < 0;
  const isLow = !isNegative && ratio < 0.2;

  const gradientClass = isNegative
    ? "bg-gradient-to-br from-red-600 via-red-500 to-rose-700"
    : isLow
      ? "bg-gradient-to-br from-amber-600 via-amber-500 to-orange-600"
      : "bg-gradient-to-br from-[#1f7a63] via-[#22967a] to-[#17614f]";

  const shadowClass = isNegative
    ? "shadow-[0_8px_32px_rgba(239,68,68,0.35)]"
    : isLow
      ? "shadow-[0_8px_32px_rgba(245,158,11,0.35)]"
      : "shadow-[0_8px_32px_rgba(31,122,99,0.4)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-3xl text-white w-full",
        gradientClass,
        shadowClass,
      )}
      style={{ aspectRatio: "2.2 / 1" }}>
      {/* ── Deep gloss base ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.18) 0%, transparent 55%)",
        }}
      />

      {/* ── Diagonal light sweep (main effect) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 30%, transparent 55%)",
        }}
      />

      {/* ── Bottom-right dark vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 110% 110%, rgba(0,0,0,0.35) 0%, transparent 60%)",
        }}
      />

      {/* ── Subtle edge highlight ── */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
      />

      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/[0.04]" />
      <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-black/[0.08]" />

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-5 py-4">
        {/* Top row: label + contactless */}
        <div className="flex items-center justify-between">
          <p className="font-arabic text-[11px] text-white/60">
            {t("dashboard.remainingBalance")}
          </p>
          <div className="flex items-center gap-2">
            {(isNegative || isLow) && (
              <div className="flex items-center gap-1">
                <TbAlertTriangle className="w-3 h-3 text-white/80" />
                <p className="font-arabic text-[10px] text-white/80">
                  {isNegative
                    ? t("dashboard.balanceNegative")
                    : t("dashboard.balanceLow")}
                </p>
              </div>
            )}
            <TbWifi className="w-5 h-5 text-white/40 rotate-90" />
          </div>
        </div>

        {/* Balance amount — center */}
        <div className="flex items-baseline gap-1.5" dir="ltr">
          <Counter
            value={Number(savings.toFixed(3))}
            fontSize={34}
            padding={0}
            gap={1}
            borderRadius={4}
            horizontalPadding={0}
            textColor="white"
            fontWeight="bold"
            gradientHeight={0}
            gradientFrom="transparent"
            gradientTo="transparent"
          />
          <span className="text-sm text-white/60">
            <OmaniRial />
          </span>
        </div>

        {/* Bottom row: chip + 3 stats */}
        <div className="flex items-center justify-between">
          {/* SIM chip */}
          <div
            className="w-8 h-6 rounded shrink-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.10) 100%)",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3)",
            }}
          />

          {/* Stats */}
          <div className="flex gap-1.5">
            {[
              {
                icon: <TbArrowUpRight className="w-3 h-3 text-green-300" />,
                label: t("dashboard.income"),
                value: formatOMR(income, true),
                bg: "bg-white/15",
              },
              {
                icon: <TbArrowDownLeft className="w-3 h-3 text-red-300" />,
                label: t("dashboard.expense"),
                value: formatOMR(expense, true),
                bg: "bg-white/15",
              },
              {
                icon: <TbPigMoney className="w-3 h-3 text-emerald-300" />,
                label: t("dashboard.savingsRate"),
                value: `${income > 0 ? Math.max(0, Math.round((savings / income) * 100)) : 0}%`,
                bg: "bg-emerald-400/20",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 rounded-lg backdrop-blur-md ${item.bg} border border-white/20 px-2 py-1`}>
                {item.icon}
                <div>
                  <p className="text-[8px] text-white/55 leading-none">
                    {item.label}
                  </p>
                  <p className="font-mono text-[10px] font-semibold leading-tight">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
