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
        "glass-card flex flex-col items-center justify-center gap-1 p-3 h-full text-center",
      )}>
      <motion.div
        animate={currentStreak > 0 ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4, ease: "backOut" }}
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center",
          isHighStreak
            ? "bg-orange-50 dark:bg-orange-950"
            : "bg-neutral-bg dark:bg-gray-800",
        )}
        style={
          isHighStreak ? { boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)" } : {}
        }>
        <TbFlame
          className="w-5 h-5"
          style={{ color: currentStreak > 0 ? "#FF6B35" : "#D1D5DB" }}
        />
      </motion.div>

      <div className="flex flex-col items-center">
        <div className="flex items-baseline gap-1 text-neutral-text dark:text-white">
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
          <span className="text-xs font-normal text-neutral-muted dark:text-white/50 font-arabic">
            {t("dashboard.day")}
          </span>
        </div>
        <p className="font-arabic text-[11px] font-medium leading-tight text-neutral-muted dark:text-white/50">
          {t("dashboard.savingsStreak")}
        </p>
      </div>

      {freezesLeft > 0 && (
        <button
          onClick={useFreeze}
          className="flex items-center gap-1 text-[11px] text-info bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-lg font-arabic">
          <TbSnowflake className="w-3 h-3" />
          {t("dashboard.freeze")}
        </button>
      )}
    </motion.div>
  );
}
