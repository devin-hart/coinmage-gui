export const usdSmart = (n: number) => {
  const abs = Math.abs(n);
  // Pick decimals by magnitude (tweak thresholds if you want)
  const maxFrac =
    abs >= 1 ? 2 :
    abs >= 0.01 ? 4 :
    abs >= 0.0001 ? 6 :
    abs >= 0.000001 ? 8 : 10;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,   // don’t force trailing zeros
    maximumFractionDigits: maxFrac,
  }).format(n);
};
