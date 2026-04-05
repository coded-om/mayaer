export function formatOMR(amount: number, compact = false): string {
  if (compact && amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}ك`;
  }
  return new Intl.NumberFormat("ar-OM", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}
