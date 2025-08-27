type Props = {
  data: number[];
  className?: string;
  showAxis?: boolean;
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
  xTicks?: number;
  yTicks?: number;
  format?: (n: number) => string;
  strokeWidth?: number;
  fillArea?: boolean;
};

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
  format = defaultFmt,
  strokeWidth = 2,
  fillArea = false,
}: Props) {
  if (!data || data.length < 2) return null;

  const W = 240;
  const H = 64;
  const padTop = padding.top ?? 6;
  const padRight = padding.right ?? 8;
  const padBottom = padding.bottom ?? 14;
  const padLeft = padding.left ?? 46;

  const innerW = W - padLeft - padRight;
  const innerH = H - padTop - padBottom;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const domain = max - min || 1;

  const x = (i: number) => padLeft + (i / (data.length - 1)) * innerW;
  const y = (v: number) => padTop + innerH - ((v - min) / domain) * innerH;

  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaPoints = `${padLeft},${padTop + innerH} ${points} ${padLeft + innerW},${padTop + innerH}`;

  // ticks
  const yTickVals = Array.from({ length: yTicks }, (_, i) =>
    min + (i * domain) / Math.max(1, yTicks - 1)
  );
  const xTickIdxs = Array.from({ length: xTicks }, (_, i) =>
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
        <g className="text-gray-300">
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
                {format(v)}
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
      {fillArea && (
        <polyline
          points={areaPoints}
          fill="currentColor"
          opacity={0.08}
        />
      )}

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
