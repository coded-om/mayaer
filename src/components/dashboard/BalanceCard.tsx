import { motion } from "framer-motion";
import { TbArrowDownLeft, TbArrowUpRight, TbMoneybag } from "react-icons/tb";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useBudgetStore } from "@/store/budgetStore";
import { formatOMR } from "@/lib/currency";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";
import { cn } from "@/lib/utils";

function RingChart({
  percent,
  overspent,
}: {
  percent: number;
  overspent: boolean;
}) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = (Math.min(Math.max(percent, 0), 100) / 100) * circ;
  const ringColor = overspent ? "#f87171" : "white";
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="8"
      />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={ringColor}
        strokeWidth="8"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text
        x="44"
        y="50"
        textAnchor="middle"
        fill={ringColor}
        fontSize="16"
        fontWeight="bold"
        fontFamily="system-ui, sans-serif">
        {percent}%
      </text>
    </svg>
  );
}

export function BalanceCard() {
  const { income, expense, savings } = useBudgetSummary();
  const getCategorySpent = useBudgetStore((s) => s.getCategorySpent);
  const { t } = useTranslation();

  const spendPercent =
    income > 0 ? Math.min(100, Math.round((expense / income) * 100)) : 0;
  const savedAmount = getCategorySpent("savings");
  const isOverspent = expense > income;

  const isNegative = savings < 0;
  const isLow = !isNegative && income > 0 && savings / income < 0.2;

  const gradientClass = isNegative
    ? "bg-gradient-to-br from-red-700 via-red-500 to-rose-700"
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
      )}>
      {/* Gloss overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-3xl"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)" }}
      />
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/[0.04]" />

      <div className="relative z-10 px-5 py-4 space-y-3">
        {/* Top: label + amount (right) | ring chart (left) */}
        <div className="flex items-center gap-4" dir="rtl">
          {/* Right in RTL — label + big number */}
          <div className="flex-1 min-w-0">
            <p className="font-arabic text-[11px] text-white/60 mb-1">
              {t("dashboard.monthlyBudget")}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] font-bold leading-none tracking-tight">
                {formatOMR(income, true)}
              </span>
              <span className="text-base text-white/70">
                <OmaniRial />
              </span>
            </div>
          </div>
          {/* Left in RTL — ring chart */}
          <RingChart percent={spendPercent} overspent={isOverspent} />
        </div>

        {/* Bottom: 3 stats */}
        <div
          className="grid grid-cols-3 pt-3 border-t border-white/20"
          dir="rtl">
          {[
            {
              icon: <TbArrowDownLeft className="w-3.5 h-3.5" />,
              label: t("dashboard.expenseLabel"),
              value: formatOMR(expense, true),
              negative: false,
            },
            {
              icon: <TbArrowUpRight className="w-3.5 h-3.5" />,
              label: t("dashboard.remaining"),
              value: formatOMR(savings, true),
              negative: savings < 0,
            },
            {
              icon: <TbMoneybag className="w-3.5 h-3.5" />,
              label: t("dashboard.savedAmount"),
              value: formatOMR(savedAmount, true),
              negative: false,
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-white/60">
                {item.icon}
                <span className="font-arabic text-[10px]">{item.label}</span>
              </div>
              <span
                className={`font-arabic text-[13px] font-bold ${
                  item.negative ? "text-red-300" : ""
                }`}
                dir="ltr">
                {item.value} <OmaniRial />
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
