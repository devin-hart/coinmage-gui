import type { CardItem } from "../types";

// formatters
const fmtUSD = (n?: number) => {
  if (typeof n !== "number") return "—";

  if (n >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } else if (n >= 0.01) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(n);
  } else if (n >= 0.0001) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(n);
  } else {
    // For very tiny numbers, show up to 10 decimals
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 6,
      maximumFractionDigits: 10,
    }).format(n);
  }
};

const fmtCompactUSD = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(n)
    : "—";
    
const fmtCompact = (n?: number | null) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(n)
    : n === null
    ? "—"
    : "—";

// Sparkline
function Sparkline({
  data,
  className = "",
}: {
  data: number[];
  className?: string;
}) {
  if (!data?.length) return null;
  const W = 140,
    H = 44;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const sx = (i: number) => (i / (data.length - 1)) * W;
  const sy = (v: number) => H - ((v - min) / (max - min || 1)) * H;
  const points = data.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`text-blue-500 ${className}`}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}

export default function HorizontalCard({ item }: { item: CardItem }) {
  const pct24Match = item.notes?.match(/24h (-?\d+(\.\d+)?%)/)?.[1] ?? "";
  const pct24Val = parseFloat(pct24Match);
  const pctColor =
    !isNaN(pct24Val) && pct24Val !== 0
      ? pct24Val > 0
        ? "text-green-600"
        : "text-red-600"
      : "text-gray-600";

  return (
<article className="w-full bg-white rounded-lg shadow p-4">
  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
    {/* Left: identity + stats */}
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-3">
        {item.image && (
          <img src={item.image} alt={item.company} className="w-8 h-8 rounded-sm object-contain" />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg truncate">{item.company}</h2>
            <span className="text-sm text-gray-500 flex-shrink-0">{item.symbol}</span>
          </div>
          <div className="text-xs text-gray-500">
            {item.badge && <span className="mr-3">{item.badge}</span>}
            <span className={`${pctColor} font-medium`}>{pct24Match || "—"}</span>
            <span className="text-gray-500"> today</span>
          </div>
        </div>
      </div>

      {/* Stats grid (reflows) */}
      <div className="grid lg:grid-cols-[repeat(3,120px)] sm:grid-cols-3 gap-2 text-xs text-gray-600 mt-2">
        <div>
          <div className="text-gray-500">Market Cap</div>
          <div className="font-medium">{fmtCompactUSD(item.marketCap)}</div>
        </div>
        <div>
          <div className="text-gray-500">Volume 24h</div>
          <div className="font-medium">{fmtCompactUSD(item.vol24h)}</div>
        </div>
        <div>
          <div className="text-gray-500">Supply</div>
          <div className="font-medium truncate">
            {fmtCompact(item.supplyCirc)} / {fmtCompact(item.supplyTotal)}
            {item.supplyMax && <> / {fmtCompact(item.supplyMax)}</>}
          </div>
        </div>
      </div>

      {/* ATH/ATL */}
      {(item.ath || item.atl) && (
        <div className="grid lg:grid-cols-[repeat(2,120px)] gap-2 text-xs text-gray-600">
          {item.ath !== undefined && (
            <div>
              <div className="text-gray-500">ATH</div>
              <div className="font-medium">{fmtUSD(item.ath)}</div>
            </div>
          )}
          {item.atl !== undefined && (
            <div>
              <div className="text-gray-500">ATL</div>
              <div className="font-medium">{fmtUSD(item.atl)}</div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Right: price + sparkline */}
    <div className="flex flex-col items-end gap-3 lg:w-64">
    <div className="text-right w-full">
        <p className="text-xl font-bold">{fmtUSD(item.price)}</p>
        <p className="text-xs text-gray-500">24h High: {fmtUSD(item.high24h)}</p>
        <p className="text-xs text-gray-500">24h Low: {fmtUSD(item.low24h)}</p>
    </div>
    <div className="w-full">
        <Sparkline data={item.sparkline7d || []} className="w-full h-16" />
    </div>
    </div>
  </div>
</article>
  );
}
