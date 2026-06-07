export function formatValue(value: number, format?: string): number | string {
  switch (format) {
    case "compact":
      return Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
    case "full":
      return Intl.NumberFormat("en").format(value);
    default:
      return value;
  }
}
