import { AnimatePresence, motion } from "framer-motion";
import { TbTarget } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { GoalCard, GoalsSummary } from "@/components/goals/GoalCard";
import { AddGoalSheet } from "@/components/goals/AddGoalSheet";
import { useGoalsStore } from "@/store/goalsStore";

export function GoalsPage() {
  const goals = useGoalsStore((s) => s.goals);
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">
      <PageHeader title={t("goals.title")} subtitle={t("goals.subtitle")} />

      {/* Summary strip — only when there are goals */}
      <GoalsSummary />

      {/* Goals list */}
      {goals.length === 0 ? (
        <EmptyState
          icon={TbTarget}
          title={t("goals.noGoals")}
          description={t("goals.noGoalsDesc")}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </AnimatePresence>
      )}

      <AddGoalSheet />
    </motion.div>
  );
}
