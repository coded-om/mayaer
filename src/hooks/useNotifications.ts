import { useEffect } from "react";
import { useProfileStore } from "@/store/profileStore";

const STORAGE_KEY = "meyaar_last_notified_date";
const NOTIFY_HOUR = 21; // 9 PM

export function useNotifications() {
  const notificationsEnabled = useProfileStore((s) => s.notificationsEnabled);

  useEffect(() => {
    if (!notificationsEnabled) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const lastNotified = localStorage.getItem(STORAGE_KEY);

    if (lastNotified === todayKey) return; // already notified today
    if (now.getHours() < NOTIFY_HOUR) return; // not yet 9 PM

    // Show notification
    new Notification("معيار 🔔", {
      body: "سجّل يومك قبل أن تنكسر سلسلتك! 🔥",
      icon: "/logo-with-out-bg.png",
      tag: "daily-reminder",
    });

    localStorage.setItem(STORAGE_KEY, todayKey);
  }, [notificationsEnabled]);
}

/** Request browser notification permission and enable in store */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}
