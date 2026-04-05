import type { IconType } from "react-icons";
import { TbMoodEmpty } from "react-icons/tb";

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  description?: string;
}

export function EmptyState({
  icon: Icon = TbMoodEmpty,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-bg dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-muted" />
      </div>
      <h3 className="font-arabic font-semibold text-neutral-text dark:text-white mb-1">
        {title}
      </h3>
      {description && (
        <p className="font-arabic text-sm text-neutral-muted max-w-[250px]">
          {description}
        </p>
      )}
    </div>
  );
}
