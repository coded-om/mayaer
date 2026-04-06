import { useState } from "react";
import { motion } from "framer-motion";
import { TbCalendarDollar } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { MonthSetup } from "@/components/financial-month/MonthSetup";
import { MonthOverview } from "@/components/financial-month/MonthOverview";
import { PredictionCard } from "@/components/financial-month/PredictionCard";
import { DailyBudget } from "@/components/financial-month/DailyBudget";
import { useFinancialMonthStore } from "@/store/financialMonthStore";

export function FinancialMonthPage() {
  const { t } = useTranslation();
  const isConfigured = useFinancialMonthStore((s) => s.isConfigured);
  const [editing, setEditing] = useState(false);

  const showSetup = !isConfigured || editing;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      <PageHeader
        title={t("financialMonth.title")}
        subtitle={t("financialMonth.subtitle")}
      />

      {showSetup ? (
        <MonthSetup onSave={() => setEditing(false)} />
      ) : (
        <>
          <MonthOverview onEdit={() => setEditing(true)} />
          <DailyBudget />
          <PredictionCard />
        </>
      )}
    </motion.div>
  );
}
