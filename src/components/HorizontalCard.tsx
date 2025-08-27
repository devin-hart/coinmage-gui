import type { CardItem } from "../types";

// number formatters
const fmtUSD = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n)
    : "—";

const fmtCompactUSD = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n)
    : "—";

const fmtCompact = (n?: number | null) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n)
    : n === null
      ? "—"
      : "—";

// Responsive inline sparkline: SVG scales to container width
function Sparkline({ data }: { data: number[] }) {
  if (!data?.length) return null;
  const W = 140; // logical width (viewBox)
  const H = 44;  // logical height (viewBox)
  const max = Math.max(...data);
  const min = Math.min(...data);
  const sx = (i: number) => (i / (data.length - 1)) * W;
  const sy = (v: number) => H - ((v - min) / (max - min || 1)) * H;
  const points = data.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="text-blue-500">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
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
    <article className="flex items-center justify-between p-4 mb-3 bg-white rounded-lg shadow w-full">
      {/* Left: logo + identity + quick stats */}
      <div className="flex items-start gap-3 min-w-0">
        {item.image && (
          <img src={item.image} alt={item.company} className="w-8 h-8 rounded-sm object-contain mt-1 flex-shrink-0" />
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

          {/* cap / vol / supply */}
          <div className="mt-2 grid grid-cols-3 gap-4 text-xs text-gray-600">
            <div>
              <div className="text-gray-500">Market Cap</div>
              <div className="font-medium">{fmtCompactUSD(item.marketCap)}</div>
            </div>
            <div>
              <div className="text-gray-500">Volume 24h</div>
              <div className="font-medium">{fmtCompactUSD(item.vol24h)}</div>
            </div>
            <div className="min-w-0">
              <div className="text-gray-500">Supply</div>
              <div className="font-medium truncate">
                {fmtCompact(item.supplyCirc)}
                <span className="text-gray-400"> / </span>
                {fmtCompact(item.supplyTotal)}
                {item.supplyMax ? (
                  <>
                    <span className="text-gray-400"> / </span>
                    {fmtCompact(item.supplyMax)}
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* ATH/ATL */}
          {(item.ath || item.atl) && (
            <div className="mt-1 grid grid-cols-2 gap-4 text-xs text-gray-600">
              {item.ath !== undefined && (
                <div className="truncate">
                  <span className="text-gray-500">ATH: </span>
                  <span className="font-medium">{fmtUSD(item.ath)}</span>
                </div>
              )}
              {item.atl !== undefined && (
                <div className="truncate">
                  <span className="text-gray-500">ATL: </span>
                  <span className="font-medium">{fmtUSD(item.atl)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: price + high/low + responsive sparkline */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-right">
          <p className="text-xl font-bold">{fmtUSD(item.price)}</p>
          <p className="text-xs text-gray-500">24h High: {fmtUSD(item.high24h)}</p>
          <p className="text-xs text-gray-500">24h Low: {fmtUSD(item.low24h)}</p>
        </div>
        {/* container widths scale by breakpoint; SVG fills 100% */}
        <div className="w-40 sm:w-56 md:w-72 lg:w-[480px]">
          <Sparkline data={item.sparkline7d || []} />
        </div>
      </div>
    </article>
  );
}
