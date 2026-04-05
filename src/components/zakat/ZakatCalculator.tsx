import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useZakat } from "@/hooks/useZakat";
import { ZakatResult } from "./ZakatResult";
import { useTranslation } from "react-i18next";
import { OmaniRial } from "@/components/ui/OmaniRial";

export function ZakatCalculator() {
  const { t } = useTranslation();
  const { result, calculate, reset: resetResult } = useZakat();

  const zakatSchema = useMemo(
    () =>
      z.object({
        savings: z
          .number({ error: t("zakatPage.enterValidAmount") })
          .positive(t("zakatPage.amountPositive")),
        monthsHeld: z
          .number({ error: t("zakatPage.enterMonths") })
          .min(0)
          .max(120),
      }),
    [t],
  );

  type FormData = z.infer<typeof zakatSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(zakatSchema),
    defaultValues: { savings: undefined, monthsHeld: 12 },
  });

  const onSubmit = (data: FormData) => {
    calculate(data.savings, data.monthsHeld);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
            {t("zakatPage.totalSavings")} <OmaniRial className="w-3 h-auto" />
          </label>
          <Input
            type="number"
            step="0.001"
            placeholder="0.000"
            className="font-mono text-lg h-12"
            {...register("savings", { valueAsNumber: true })}
          />
          {errors.savings && (
            <p className="text-danger text-xs font-arabic mt-1">
              {errors.savings.message}
            </p>
          )}
        </div>

        <div>
          <label className="font-arabic text-sm text-neutral-muted block mb-1.5">
            {t("zakatPage.monthsLabel")}
          </label>
          <Input
            type="number"
            placeholder="12"
            className="font-mono text-lg h-12"
            {...register("monthsHeld", { valueAsNumber: true })}
          />
          {errors.monthsHeld && (
            <p className="text-danger text-xs font-arabic mt-1">
              {errors.monthsHeld.message}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="gold" className="flex-1">
            {t("zakatPage.calculate")}
          </Button>
          {result && (
            <Button type="button" variant="outline" onClick={resetResult}>
              {t("zakatPage.reset")}
            </Button>
          )}
        </div>
      </form>

      {result && <ZakatResult result={result} />}
    </div>
  );
}
