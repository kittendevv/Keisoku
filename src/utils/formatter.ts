interface FormatOptions {
    format?: "raw" | "compact" | "locale";
    decimals?: number;
    locale?: string;
  }
  
  export function formatValue(value: number, options: FormatOptions = {}): string | number {
    const { format = "raw", decimals = 1, locale = "en-US" } = options;
  
    if (format === "raw") return value;
  
    if (format === "compact") {
      return Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: decimals,
      }).format(value);
    }
  
    if (format === "locale") {
      return Intl.NumberFormat(locale, {
        maximumFractionDigits: decimals,
      }).format(value);
    }
  
    return value;
  }
  