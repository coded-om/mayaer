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
import {
  TbTarget,
  TbMoonStars,
  TbBook,
  TbAward,
  TbCalendarDollar,
  TbChartBar,
  TbBuildingBank,
  TbRobot,
} from "react-icons/tb";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";
import logoNoBg from "@/assets/logo.jpeg";

interface NavTab {
  path: string;
  icon: IconType;
  activeIcon: IconType;
  label: string;
  section?: string;
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
    path: "/education",
    icon: TbBook,
    activeIcon: TbBook,
    label: "nav.education",
    section: "new",
  },
  {
    path: "/rewards",
    icon: TbAward,
    activeIcon: TbAward,
    label: "nav.rewards",
    section: "new",
  },
  {
    path: "/financial-month",
    icon: TbCalendarDollar,
    activeIcon: TbCalendarDollar,
    label: "nav.financialMonth",
    section: "new",
  },
  {
    path: "/markets",
    icon: TbBuildingBank,
    activeIcon: TbBuildingBank,
    label: "nav.markets",
    section: "new",
  },
  {
    path: "/advisor",
    icon: TbRobot,
    activeIcon: TbRobot,
    label: "nav.advisor",
    section: "new",
  },
  {
    path: "/report",
    icon: TbChartBar,
    activeIcon: TbChartBar,
    label: "nav.report",
    section: "more",
  },
  {
    path: "/profile",
    icon: RiUserLine,
    activeIcon: RiUserFill,
    label: "nav.profile",
  },
];

export function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <aside
      dir={isRtl ? "rtl" : "ltr"}
      className="hidden md:flex flex-col fixed right-0 top-0 h-screen w-60 z-40
                 backdrop-blur-xl bg-white/70 dark:bg-white/[0.04]
                 border-l border-white/70 dark:border-white/[0.08]
                 shadow-xl shadow-black/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/50 dark:border-white/[0.06] ">
        <img
          src={logoNoBg}
          alt="معيار"
          className="w-10 h-10 object-contain rounded-lg"
        />
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = isActive ? tab.activeIcon : tab.icon;

          return (
            <motion.button
              key={tab.path}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl font-arabic text-sm font-medium transition-colors text-right",
                isActive
                  ? "bg-primary-50 dark:bg-primary-950 text-primary"
                  : "text-neutral-muted dark:text-gray-400 hover:bg-neutral-bg dark:hover:bg-white/5 hover:text-neutral-text dark:hover:text-white",
              )}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{t(tab.label)}</span>
              {isActive && (
                <motion.div
                  layoutId="sideActiveTab"
                  className="mr-auto w-1.5 h-5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Language toggle */}
      <div className="px-5 py-2">
        <button
          onClick={() =>
            i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
          }
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-neutral-bg dark:bg-white/5 hover:bg-neutral-border dark:hover:bg-white/10 transition-colors">
          <span className="font-arabic text-sm font-medium text-neutral-text dark:text-white">
            {i18n.language === "ar" ? "English" : "العربية"}
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/50 dark:border-white/[0.06]">
        <p className="font-arabic text-xs text-neutral-muted text-center">
          {t("nav.version")}
        </p>
      </div>
    </aside>
  );
}
