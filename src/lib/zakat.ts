import type { ZakatResult } from "@/types";
import {
  NISAB_VALUE,
  ZAKAT_RATE,
  GOLD_PRICE_OMR,
  SILVER_PRICE_OMR,
} from "@/constants";

export function calculateZakat(
  savings: number,
  monthsHeld: number,
): ZakatResult {
  const hasCycle = monthsHeld >= 12;
  const aboveNisab = savings >= NISAB_VALUE;

  if (!aboveNisab) {
    return {
      due: false,
      amount: 0,
      reason: `المبلغ أقل من النصاب (${NISAB_VALUE.toLocaleString("ar-OM")}). النصاب يعادل ٨٥ جرام ذهب.`,
    };
  }

  if (!hasCycle) {
    return {
      due: false,
      amount: 0,
      reason: `لم يحل الحول بعد. مر ${monthsHeld} شهر من أصل ١٢ شهراً مطلوبة.`,
    };
  }

  return {
    due: true,
    amount: savings * ZAKAT_RATE,
    nisab: NISAB_VALUE,
    savings,
    percentage: 2.5,
  };
}

export function calculateZakatGold(grams: number): ZakatResult {
  const NISAB_GOLD_G = 85;
  if (grams < NISAB_GOLD_G) {
    return {
      due: false,
      amount: 0,
      reason: `الوزن ${grams}g أقل من نصاب الذهب (${NISAB_GOLD_G} جرام).`,
    };
  }
  const value = grams * GOLD_PRICE_OMR;
  return {
    due: true,
    amount: value * ZAKAT_RATE,
    nisab: NISAB_GOLD_G * GOLD_PRICE_OMR,
    savings: value,
    percentage: 2.5,
  };
}

export function calculateZakatSilver(grams: number): ZakatResult {
  const NISAB_SILVER_G = 595;
  if (grams < NISAB_SILVER_G) {
    return {
      due: false,
      amount: 0,
      reason: `الوزن ${grams}g أقل من نصاب الفضة (${NISAB_SILVER_G} جرام).`,
    };
  }
  const value = grams * SILVER_PRICE_OMR;
  return {
    due: true,
    amount: value * ZAKAT_RATE,
    nisab: NISAB_SILVER_G * SILVER_PRICE_OMR,
    savings: value,
    percentage: 2.5,
  };
}

export function calculateZakatTrade(
  assets: number,
  debts: number,
  monthsHeld: number,
): ZakatResult {
  const net = assets - debts;
  if (net <= 0) {
    return {
      due: false,
      amount: 0,
      reason: "الديون تساوي أو تتجاوز قيمة الأصول.",
    };
  }
  if (net < NISAB_VALUE) {
    return {
      due: false,
      amount: 0,
      reason: `صافي الأصول (${net.toFixed(3)}) أقل من النصاب (${NISAB_VALUE.toFixed(3)} ر.ع).`,
    };
  }
  if (monthsHeld < 12) {
    return {
      due: false,
      amount: 0,
      reason: `لم يحل الحول بعد. مر ${monthsHeld} شهر من أصل ١٢.`,
    };
  }
  return {
    due: true,
    amount: net * ZAKAT_RATE,
    nisab: NISAB_VALUE,
    savings: net,
    percentage: 2.5,
  };
}

export function calculateZakatLivestock(
  animalType: "camels" | "cows" | "sheep",
  count: number,
): ZakatResult {
  let description = "";
  if (animalType === "camels") {
    if (count < 5)
      return { due: false, amount: 0, reason: "النصاب للإبل: ٥ إبل فأكثر." };
    if (count < 10) description = "شاة واحدة";
    else if (count < 15) description = "شاتان";
    else if (count < 20) description = "٣ شياه";
    else if (count < 25) description = "٤ شياه";
    else description = "بنت مخاض (أنثى في السنة الثانية)";
  } else if (animalType === "cows") {
    if (count < 30)
      return { due: false, amount: 0, reason: "النصاب للبقر: ٣٠ بقرة فأكثر." };
    if (count < 40) description = "تبيع (عجل في السنة الثانية)";
    else description = "مسنّة (بقرة في السنة الثالثة)";
  } else {
    if (count < 40)
      return { due: false, amount: 0, reason: "النصاب للغنم: ٤٠ شاة فأكثر." };
    if (count < 121) description = "شاة واحدة";
    else if (count < 201) description = "شاتان";
    else if (count < 400) description = "٣ شياه";
    else description = `${Math.floor(count / 100)} شياه`;
  }
  return {
    due: true,
    amount: 0,
    isLivestock: true,
    reason: description,
    percentage: 0,
  };
}
