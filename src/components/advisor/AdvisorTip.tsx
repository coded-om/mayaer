import { useTranslation } from "react-i18next";
import { TbBulb } from "react-icons/tb";

interface AdvisorTipProps {
  tipKey: string;
}

export function AdvisorTip({ tipKey }: AdvisorTipProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20">
      <TbBulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <p className="font-arabic text-sm text-primary/80 dark:text-primary/70">
        {t(tipKey)}
      </p>
    </div>
  );
}
