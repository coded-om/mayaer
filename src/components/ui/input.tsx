import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-neutral-border bg-white px-3 py-2 text-sm font-arabic",
        "placeholder:text-neutral-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
