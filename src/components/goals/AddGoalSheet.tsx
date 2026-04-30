import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { sileo } from "sileo";
import { TbPlus } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoalsStore } from "@/store/goalsStore";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";
import { GOAL_ICON_MAP, GOAL_ICON_KEYS } from "@/constants/goalIcons";

export function AddGoalSheet() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("target");
  const addGoal = useGoalsStore((s) => s.addGoal);

  const goalSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("goals.enterGoalName")),
        targetAmount: z
          .number({ error: t("goals.enterValidAmount") })
          .positive(t("goals.amountPositive")),
        savedAmount: z.number().min(0, t("goals.cannotBeNegative")).catch(0),
        targetDate: z.string().optional(),
      }),
    [t],
  );

  type FormData = z.infer<typeof goalSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: { savedAmount: 0 },
  });

  const onSubmit = (data: FormData) => {
    addGoal({
      name: data.name,
      targetAmount: data.targetAmount,
      savedAmount: data.savedAmount ?? 0,
      targetDate: data.targetDate || undefined,
      icon: selectedIcon,
    });
    sileo.success({
      title: t("goals.goalAdded"),
      description: t("goals.goalAddedDesc"),
    });
    reset();
    setSelectedIcon("target");
    setOpen(false);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center
                   md:bottom-8 md:left-auto md:right-8 md:translate-x-0">
        <TbPlus className="w-7 h-7" />
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("goals.newGoal")}</SheetTitle>
            <SheetDescription>{t("goals.newGoalDesc")}</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
            {/* Icon picker */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-2">
                {t("goals.chooseIcon")}
              </label>
              <div className="flex flex-wrap gap-2">
                {GOAL_ICON_KEYS.map((key) => {
                  const IconComp = GOAL_ICON_MAP[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedIcon(key)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                        ${
                          selectedIcon === key
                            ? "bg-primary/20 border-2 border-primary scale-110"
                            : "bg-neutral-bg dark:bg-gray-800 border-2 border-transparent"
                        }`}>
                      <IconComp className="w-5 h-5 text-neutral-text dark:text-white" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goal name */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("goals.goalName")}
              </label>
              <Input
                placeholder={t("goals.goalNamePlaceholder")}
                {...register("name")}
              />
              {errors.name && (
                <p className="font-arabic text-xs text-danger mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Target amount */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("goals.targetAmount")} <OmaniRial className="w-3 h-auto" />
              </label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                className="font-mono text-lg h-12"
                {...register("targetAmount", { valueAsNumber: true })}
              />
              {errors.targetAmount && (
                <p className="font-arabic text-xs text-danger mt-1">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            {/* Already saved */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("goals.alreadySaved")}
              </label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                className="font-mono"
                {...register("savedAmount", { valueAsNumber: true })}
              />
            </div>

            {/* Target date */}
            <div>
              <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
                {t("goals.targetDate")}
              </label>
              <Input type="date" {...register("targetDate")} />
            </div>

            <Button type="submit" className="w-full font-arabic">
              {t("goals.addGoal")}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
