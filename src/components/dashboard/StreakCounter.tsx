import { motion } from "framer-motion";
import { TbFlame, TbSnowflake } from "react-icons/tb";
import { useStreak } from "@/hooks/useStreak";
import { cn } from "@/lib/utils";
import Counter from "@/components/reactbits/Counter";
import { useTranslation } from "react-i18next";

export function StreakCounter() {
  const { currentStreak, freezesLeft, isHighStreak, useFreeze } = useStreak();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className={cn(
        "flex items-center lg:flex-col lg:justify-center gap-2 p-2 rounded-xl border h-full",
        "border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.2)]",
      )}>
      <motion.div
        animate={currentStreak > 0 ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4, ease: "backOut" }}
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
          isHighStreak
            ? "bg-orange-50 dark:bg-orange-950"
            : "bg-neutral-bg dark:bg-gray-800",
        )}
        style={
          isHighStreak ? { boxShadow: "0 0 12px rgba(255, 107, 53, 0.3)" } : {}
        }>
        <TbFlame
          className="w-4 h-4"
          style={{ color: currentStreak > 0 ? "#FF6B35" : "#D1D5DB" }}
        />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-0.5">
          <Counter
            value={currentStreak}
            fontSize={20}
            padding={0}
            gap={1}
            borderRadius={0}
            horizontalPadding={0}
            textColor={isHighStreak ? "#FF6B35" : "inherit"}
            fontWeight="bold"
            gradientHeight={0}
            gradientFrom="transparent"
            gradientTo="transparent"
          />
          <span className="text-[10px] font-normal text-neutral-muted font-arabic">
            {t("dashboard.day")}
          </span>
        </div>
      </div>

      {freezesLeft > 0 && (
        <button
          onClick={useFreeze}
          className="flex items-center gap-0.5 text-[9px] text-info bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded-md font-arabic shrink-0">
          <TbSnowflake className="w-2.5 h-2.5" />
          {t("dashboard.freeze")}
        </button>
      )}
    </motion.div>
  );
}
