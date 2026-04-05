import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  RiHomeLine,
  RiHome2Fill,
  RiUserLine,
  RiUserFill,
} from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";
import { TbTarget, TbMoonStars } from "react-icons/tb";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";

interface NavTab {
  path: string;
  icon: IconType;
  activeIcon: IconType;
  label: string;
}

const tabs: NavTab[] = [
  {
    path: "/dashboard",
    icon: RiHomeLine,
    activeIcon: RiHome2Fill,
    label: "nav.home",
  },
  {
    path: "/transactions",
    icon: BiTransfer,
    activeIcon: BiTransfer,
    label: "nav.transactions",
  },
  { path: "/goals", icon: TbTarget, activeIcon: TbTarget, label: "nav.goals" },
  {
    path: "/zakat",
    icon: TbMoonStars,
    activeIcon: TbMoonStars,
    label: "nav.zakat",
  },
  {
    path: "/profile",
    icon: RiUserLine,
    activeIcon: RiUserFill,
    label: "nav.profile",
  },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 dark:border-white/[0.08] backdrop-blur-2xl bg-white/70 dark:bg-black/40 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = isActive ? tab.activeIcon : tab.icon;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1">
              <motion.div
                whileTap={{ scale: 1.15 }}
                className={cn(
                  "flex items-center justify-center w-10 h-8 rounded-lg transition-colors",
                  isActive && "bg-primary-50 dark:bg-primary-950",
                )}>
                <Icon
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-neutral-muted dark:text-gray-500",
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  "text-[10px] font-arabic transition-colors",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-neutral-muted dark:text-gray-500",
                )}>
                {t(tab.label)}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="h-0.5 w-4 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
