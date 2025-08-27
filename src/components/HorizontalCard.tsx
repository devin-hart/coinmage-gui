import type { CardItem } from "../types";
import { fmtUSD, fmtCompactUSD, fmtCompact } from "../utils/format";
import SparkLine from "./SparkLine";

const HorizontalCard: React.FC<{ item: CardItem }> = ({ item }) => {
  const pct24Match = item.notes?.match(/24h (-?\d+(\.\d+)?%)/)?.[1] ?? "";
  const pct24Val = parseFloat(pct24Match);
  const pctColor =
    !isNaN(pct24Val) && pct24Val !== 0 ? (pct24Val > 0 ? "text-green-600" : "text-red-600") : "text-gray-600";

  return (
    <article className="w-full bg-white rounded-lg shadow p-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left: identity + stats */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3">
            {item.image && <img src={item.image} alt={`${item.company} logo`} className="w-8 h-8 rounded-sm object-contain" />}
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

          {/* Stats grid */}
          <div className="grid sm:grid-cols-3 lg:grid-cols-[repeat(3,120px)] gap-2 text-xs text-gray-600 mt-2">
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

          {(item.ath !== undefined || item.atl !== undefined) && (
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
        <div className="flex flex-col items-end gap-3 lg:w-72">
          <div className="text-right w-full">
            <p className="text-xl font-bold">{fmtUSD(item.price)}</p>
            <p className="text-xs text-gray-500">24h High: {fmtUSD(item.high24h)}</p>
            <p className="text-xs text-gray-500">24h Low: {fmtUSD(item.low24h)}</p>
          </div>

          <SparkLine
            data={item.sparkline7d || []}
            className="w-full h-20"
            showAxis
            xTicks={4}
            yTicks={3}
          />
        </div>
      </div>
    </article>
  );
};

export default HorizontalCard;
