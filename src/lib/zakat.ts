import type { ZakatResult } from "@/types";
import { NISAB_VALUE, ZAKAT_RATE } from "@/constants";

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
