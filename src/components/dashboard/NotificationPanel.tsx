import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNotificationsStore } from "@/store/notificationsStore";
import type {
  AppNotification,
  NotificationType,
} from "@/store/notificationsStore";
import {
  TbX,
  TbTrendingUp,
  TbTrendingDown,
  TbPigMoney,
  TbTargetArrow,
  TbCalendarDollar,
  TbBulb,
  TbBellCheck,
  TbTrash,
} from "react-icons/tb";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TYPE_META: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  investment: {
    icon: TbTrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  market: { icon: TbTrendingDown, color: "text-red-500", bg: "bg-red-500/10" },
  budget: { icon: TbPigMoney, color: "text-amber-500", bg: "bg-amber-500/10" },
  goal: { icon: TbTargetArrow, color: "text-blue-500", bg: "bg-blue-500/10" },
  salary: {
    icon: TbCalendarDollar,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  tip: { icon: TbBulb, color: "text-yellow-500", bg: "bg-yellow-500/10" },
};

function timeAgo(iso: string, lang: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return lang === "ar" ? "الآن" : "just now";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return lang === "ar" ? `منذ ${m} د` : `${m}m ago`;
  }
  const h = Math.floor(diff / 3600);
  return lang === "ar" ? `منذ ${h} س` : `${h}h ago`;
}

function NotifRow({ notif, lang }: { notif: AppNotification; lang: string }) {
  const markRead = useNotificationsStore((s) => s.markRead);
  const meta = TYPE_META[notif.type];
  const Icon = meta.icon;
  const title = lang === "ar" ? notif.titleAr : notif.titleEn;
  const body = lang === "ar" ? notif.bodyAr : notif.bodyEn;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={() => markRead(notif.id)}
      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
        notif.read
          ? "opacity-60"
          : "bg-white/50 dark:bg-white/[0.04] border border-white/60 dark:border-white/[0.07]"
      }`}>
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${meta.bg}`}>
        <Icon className={`w-5 h-5 ${meta.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="font-arabic text-sm font-semibold text-neutral-text dark:text-white leading-tight">
            {title}
          </p>
          {!notif.read && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
          )}
        </div>
        <p className="font-arabic text-xs text-neutral-muted dark:text-white/50 mt-0.5 leading-snug">
          {body}
        </p>
        <p className="font-arabic text-[10px] text-neutral-muted/60 dark:text-white/30 mt-1">
          {timeAgo(notif.createdAt, lang)}
        </p>
      </div>
    </motion.div>
  );
}

export function NotificationPanel({ open, onClose }: Props) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const notifications = useNotificationsStore((s) => s.notifications);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const clearAll = useNotificationsStore((s) => s.clearAll);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50
              bg-white/80 dark:bg-[#0e1117]/90 backdrop-blur-2xl
              border border-white/60 dark:border-white/[0.08]
              rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight: "80vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/40 dark:border-white/[0.07]">
              <p className="font-arabic text-sm font-bold text-neutral-text dark:text-white">
                {t("notifications.title", "الإشعارات")}
              </p>
              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={markAllRead}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-muted dark:text-white/50 hover:text-primary transition-colors"
                  title="Mark all read">
                  <TbBellCheck className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={clearAll}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-muted dark:text-white/50 hover:text-red-400 transition-colors"
                  title="Clear all">
                  <TbTrash className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-muted dark:text-white/50 hover:text-neutral-text dark:hover:text-white transition-colors">
                  <TbX className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div
              className="overflow-y-auto px-3 py-3 space-y-2"
              style={{ maxHeight: "calc(80vh - 56px)" }}>
              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-arabic text-sm text-neutral-muted dark:text-white/40 text-center py-8">
                    {t("notifications.empty", "لا توجد إشعارات")}
                  </motion.p>
                ) : (
                  notifications.map((n) => (
                    <NotifRow key={n.id} notif={n} lang={lang} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
