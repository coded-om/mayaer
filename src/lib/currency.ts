export function formatOMR(
  amount: number,
  compact = false,
  locale: "ar" | "en" = "en",
): string {
  const numLocale = locale === "en" ? "en-US" : "ar-OM";
  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (abs >= 1_000_000) {
      const num = new Intl.NumberFormat(numLocale, {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(abs / 1_000_000);
      return `${sign}${num}${locale === "en" ? "M" : "م"}`;
    }
    if (abs >= 1_000) {
      const num = new Intl.NumberFormat(numLocale, {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(abs / 1_000);
      return `${sign}${num}${locale === "en" ? "K" : "ك"}`;
    }
  }
  return new Intl.NumberFormat(numLocale, {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}
