import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TbRobot } from "react-icons/tb";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdvisorOnboarding } from "@/components/advisor/AdvisorOnboarding";
import { InvestmentPlanView } from "@/components/advisor/InvestmentPlanView";
import { useAdvisorStore } from "@/store/advisorStore";
import type { AdvisorAnswers } from "@/types/markets";

export function AdvisorPage() {
  const { t } = useTranslation();
  const { plan, setAnswers, generatePlan, resetPlan } = useAdvisorStore();

  const handleComplete = (answers: AdvisorAnswers) => {
    setAnswers(answers);
    generatePlan();
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <PageHeader
          title={t("advisor.title")}
          subtitle={t("advisor.subtitle")}
        />

        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 w-fit">
          <TbRobot className="w-5 h-5 text-primary" />
          <span className="font-arabic text-xs text-primary font-medium">
            {t("advisor.badge")}
          </span>
        </motion.div>

        {/* Content */}
        <div className="rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-5">
          {plan ? (
            <InvestmentPlanView plan={plan} onReset={resetPlan} />
          ) : (
            <AdvisorOnboarding onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
