import {
  TbToolsKitchen2,
  TbCar,
  TbDeviceGamepad2,
  TbHeartbeat,
  TbShoppingBag,
  TbBook,
  TbMoneybag,
  TbFileInvoice,
  TbDots,
} from "react-icons/tb";
import type { IconType } from "react-icons";
import type { CategoryId } from "@/types";
import { CATEGORIES } from "@/constants";

const iconMap: Record<string, IconType> = {
  TbToolsKitchen2,
  TbCar,
  TbDeviceGamepad2,
  TbHeartbeat,
  TbShoppingBag,
  TbBook,
  TbMoneybag,
  TbFileInvoice,
  TbDots,
};

export function getCategoryIcon(iconName: string): IconType {
  return iconMap[iconName] ?? TbDots;
}

export function getCategoryById(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryLabel(id: CategoryId): string {
  return getCategoryById(id)?.label ?? "أخرى";
}

export function getCategoryColor(id: CategoryId): string {
  return getCategoryById(id)?.color ?? "#9CA3AF";
}
