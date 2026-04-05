import type { Category } from "@/types";

export const NISAB_GOLD_GRAMS = 85;
export const GOLD_PRICE_OMR = 26.5;
export const NISAB_VALUE = NISAB_GOLD_GRAMS * GOLD_PRICE_OMR; // 2252.5 ر.ع
export const ZAKAT_RATE = 0.025; // 2.5%
export const STREAK_FREEZE_LIMIT = 1; // مرة واحدة في الأسبوع

export const CATEGORIES: Category[] = [
  {
    id: "food",
    label: "أكل ومشروبات",
    icon: "TbToolsKitchen2",
    color: "#EF4444",
  },
  { id: "transport", label: "مواصلات", icon: "TbCar", color: "#F97316" },
  {
    id: "entertainment",
    label: "ترفيه",
    icon: "TbDeviceGamepad2",
    color: "#8B5CF6",
  },
  { id: "health", label: "صحة", icon: "TbHeartbeat", color: "#22C55E" },
  { id: "shopping", label: "تسوق", icon: "TbShoppingBag", color: "#3B82F6" },
  { id: "education", label: "تعليم", icon: "TbBook", color: "#06B6D4" },
  { id: "savings", label: "ادخار", icon: "TbPigMoney", color: "#1F7A63" },
  { id: "bills", label: "فواتير", icon: "TbFileInvoice", color: "#6B7280" },
  { id: "other", label: "أخرى", icon: "TbDots", color: "#9CA3AF" },
];
