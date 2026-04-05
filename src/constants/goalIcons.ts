import {
  TbTarget,
  TbHome,
  TbCar,
  TbPlane,
  TbDeviceMobile,
  TbDiamond,
  TbSchool,
  TbBriefcase,
  TbBeach,
  TbCoin,
} from "react-icons/tb";
import type { IconType } from "react-icons";

export const GOAL_ICON_MAP: Record<string, IconType> = {
  target: TbTarget,
  home: TbHome,
  car: TbCar,
  plane: TbPlane,
  phone: TbDeviceMobile,
  diamond: TbDiamond,
  school: TbSchool,
  briefcase: TbBriefcase,
  beach: TbBeach,
  coin: TbCoin,
};

export const GOAL_ICON_KEYS = Object.keys(GOAL_ICON_MAP);
