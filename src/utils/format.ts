export const fmtUSD = (n?: number): string => {
  if (typeof n !== "number") return "—";
  if (n >= 1) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  } else if (n >= 0.01) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n);
  } else if (n >= 0.0001) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4, maximumFractionDigits: 6 }).format(n);
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 6, maximumFractionDigits: 10 }).format(n);
};

export const fmtCompactUSD = (n?: number): string =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n)
    : "—";

export const fmtCompact = (n?: number | null): string =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n)
    : n === null ? "—" : "—";
