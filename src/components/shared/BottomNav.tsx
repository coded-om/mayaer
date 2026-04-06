import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  RiHomeLine,
  RiHome2Fill,
  RiUserLine,
  RiUserFill,
} from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";
import {
  TbTarget,
  TbMoonStars,
  TbDots,
  TbBook,
  TbAward,
  TbChartLine,
  TbCalendarDollar,
  TbChartBar,
  TbX,
  TbBuildingBank,
  TbRobot,
} from "react-icons/tb";
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
    path: "/education",
    icon: TbBook,
    activeIcon: TbBook,
    label: "nav.education",
  },
  {
    path: "/markets?tab=portfolio",
    icon: TbChartLine,
    activeIcon: TbChartLine,
    label: "nav.stocks",
  },
];

const moreItems: NavTab[] = [
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
    path: "/markets",
    icon: TbBuildingBank,
    activeIcon: TbBuildingBank,
    label: "nav.markets",
  },
  {
    path: "/advisor",
    icon: TbRobot,
    activeIcon: TbRobot,
    label: "nav.advisor",
  },
  {
    path: "/rewards",
    icon: TbAward,
    activeIcon: TbAward,
    label: "nav.rewards",
  },
  {
    path: "/financial-month",
    icon: TbCalendarDollar,
    activeIcon: TbCalendarDollar,
    label: "nav.financialMonth",
  },
  {
    path: "/report",
    icon: TbChartBar,
    activeIcon: TbChartBar,
    label: "nav.report",
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
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = moreItems.some(
    (item) => location.pathname === item.path,
  );

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed inset-x-0 bottom-16 z-50 mx-3 rounded-2xl border border-white/70 dark:border-white/[0.08] backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 shadow-xl overflow-hidden pb-[env(safe-area-inset-bottom)] md:hidden">
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/50 dark:border-white/[0.06]">
                <span className="font-arabic text-sm font-semibold text-neutral-text dark:text-white">
                  {t("nav.more")}
                </span>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-1 rounded-lg hover:bg-neutral-bg dark:hover:bg-white/5">
                  <TbX className="w-5 h-5 text-neutral-muted" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1 p-3">
                {moreItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMoreOpen(false);
                      }}
                      className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl hover:bg-neutral-bg dark:hover:bg-white/5 transition-colors">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          isActive
                            ? "bg-primary-50 dark:bg-primary-950"
                            : "bg-white/50 dark:bg-white/5",
                        )}>
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            isActive
                              ? "text-primary"
                              : "text-neutral-muted dark:text-gray-400",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-arabic text-[10px] text-center leading-tight",
                          isActive
                            ? "text-primary font-semibold"
                            : "text-neutral-muted dark:text-gray-400",
                        )}>
                        {t(item.label)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 dark:border-white/[0.08] backdrop-blur-2xl bg-white/70 dark:bg-black/40 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
          {tabs.map((tab) => {
            const tabPath = tab.path.split("?")[0];
            const isActive =
              location.pathname === tabPath &&
              (!tab.path.includes("?") ||
                location.search === `?${tab.path.split("?")[1]}`);
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

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1">
            <motion.div
              whileTap={{ scale: 1.15 }}
              className={cn(
                "flex items-center justify-center w-10 h-8 rounded-lg transition-colors",
                isMoreActive && "bg-primary-50 dark:bg-primary-950",
              )}>
              <TbDots
                className={cn(
                  "w-6 h-6 transition-colors",
                  isMoreActive
                    ? "text-primary"
                    : "text-neutral-muted dark:text-gray-500",
                )}
              />
            </motion.div>
            <span
              className={cn(
                "text-[10px] font-arabic transition-colors",
                isMoreActive
                  ? "text-primary font-semibold"
                  : "text-neutral-muted dark:text-gray-500",
              )}>
              {t("nav.more")}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
