type Props = {
  data: number[];
  className?: string;
  showAxis?: boolean;
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
  xTicks?: number;
  yTicks?: number;
  format?: (n: number) => string; // optional custom formatter
  strokeWidth?: number;
  fillArea?: boolean;
};

// Fallback, used only if nothing else is provided
const defaultFmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 6,
  }).format(n);

export default function Sparkline({
  data,
  className = "",
  showAxis = true,
  padding = { top: 6, right: 8, bottom: 14, left: 46 },
  xTicks = 4,
  yTicks = 3,
  format, // allow undefined; we compute a good default below
  strokeWidth = 2,
  fillArea = false,
}: Props) {
  if (!data || data.length < 2) return null;

  // Overall SVG size
  const W = 240;
  const H = 64;

  // Base padding from props
  const basePadTop = padding.top ?? 6;
  const basePadRight = padding.right ?? 8;
  const basePadBottom = padding.bottom ?? 14;
  const basePadLeft = padding.left ?? 46;

  // Series stats
  const min = Math.min(...data);
  const max = Math.max(...data);
  const domain = max - min || 1;

  // Ticks first so we can measure labels
  const safeYTicks = Math.max(2, yTicks);
  const yTickVals = Array.from({ length: safeYTicks }, (_, i) =>
    min + (i * domain) / (safeYTicks - 1)
  );

  // Domain-aware decimals so micro prices show correctly
  const tickStep = domain / (safeYTicks - 1);
  const decimalsByStep = Math.min(
    10,
    Math.max(2, Math.ceil(-Math.log10(Math.max(tickStep, Number.EPSILON))) + 1)
  );

  const autoUsd = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimalsByStep,
      maximumFractionDigits: decimalsByStep,
    }).format(n);

  // Use caller's formatter if provided, otherwise our domain-aware one
  const labelFormat = format ?? autoUsd ?? defaultFmt;

  // Ensure axis labels are padded to at least `decimalsByStep` decimals
  const padToDecimals = (s: string, minDec: number) => {
    if (minDec <= 0) return s;
    const dot = s.lastIndexOf(".");
    if (dot === -1) return `${s}.${"0".repeat(minDec)}`;
    const current = s.length - dot - 1;
    return current >= minDec ? s : s + "0".repeat(minDec - current);
  };
  const axisFormat = (v: number) => padToDecimals(labelFormat(v), decimalsByStep);

  // Estimate label width and expand left padding if needed
  const labelFontPx = 10;
  const approxCharWidth = labelFontPx * 0.62;
  const longestLabelChars = showAxis
    ? Math.max(...yTickVals.map((v) => axisFormat(v).length))
    : 0;

  const neededPadLeft = showAxis
    ? Math.ceil(longestLabelChars * approxCharWidth) + 8
    : 0;

  // Final paddings
  const padTop = basePadTop;
  const padRight = basePadRight;
  const padBottom = basePadBottom;
  const padLeft = Math.max(basePadLeft, neededPadLeft);

  // Inner plot area
  const innerW = W - padLeft - padRight;
  const innerH = H - padTop - padBottom;

  // Scales
  const x = (i: number) => padLeft + (i / (data.length - 1)) * innerW;
  const y = (v: number) => padTop + innerH - ((v - min) / domain) * innerH;

  // Path points
  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaPoints = `${padLeft},${padTop + innerH} ${points} ${
    padLeft + innerW
  },${padTop + innerH}`;

  // x ticks (index positions)
  const xTickIdxs = Array.from({ length: Math.max(2, xTicks) }, (_, i) =>
    Math.round((i * (data.length - 1)) / Math.max(1, xTicks - 1))
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`text-blue-500 ${className}`}
      aria-label="price sparkline"
      role="img"
    >
      {/* grid / axes */}
      {showAxis && (
        <g className="text-gray-400">
          {/* y grid lines + labels */}
          {yTickVals.map((v, i) => (
            <g key={`y-${i}`}>
              <line
                x1={padLeft}
                x2={padLeft + innerW}
                y1={y(v)}
                y2={y(v)}
                stroke="currentColor"
                strokeWidth={0.5}
                opacity={0.35}
              />
              <text
                x={padLeft - 4}
                y={y(v)}
                textAnchor="end"
                dominantBaseline="central"
                fontSize="10"
                fill="currentColor"
                className="select-none"
              >
                {axisFormat(v)}
              </text>
            </g>
          ))}

          {/* x ticks (no labels by default) */}
          {xTickIdxs.map((i) => (
            <line
              key={`x-${i}`}
              x1={x(i)}
              x2={x(i)}
              y1={padTop}
              y2={padTop + innerH}
              stroke="currentColor"
              strokeWidth={0.5}
              opacity={0.15}
            />
          ))}

          {/* axes strokes */}
          <line
            x1={padLeft}
            x2={padLeft}
            y1={padTop}
            y2={padTop + innerH}
            stroke="currentColor"
            strokeWidth={0.75}
            opacity={0.6}
          />
          <line
            x1={padLeft}
            x2={padLeft + innerW}
            y1={padTop + innerH}
            y2={padTop + innerH}
            stroke="currentColor"
            strokeWidth={0.75}
            opacity={0.6}
          />
        </g>
      )}

      {/* area (optional) */}
      {fillArea && <polyline points={areaPoints} fill="currentColor" opacity={0.08} />}

      {/* line */}
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
