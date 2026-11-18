import { ItemStack } from "./ItemStack";
import type { ChartProps } from "./types";

/** Fixed-sign South Indian layout: Pisces at top-left, signs run clockwise. */
const CELL: Record<number, [number, number]> = {
  11: [0, 0], 0: [1, 0], 1: [2, 0], 2: [3, 0],
  3: [3, 1], 4: [3, 2], 5: [3, 3], 6: [2, 3],
  7: [1, 3], 8: [0, 3], 9: [0, 2], 10: [0, 1],
};

export function SouthIndianChart(p: ChartProps) {
  const S = 100;
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full select-none" role="img" aria-label="South Indian chart">
      <rect x={1} y={1} width={398} height={398} className="fill-card stroke-chart-line" strokeWidth={2} />
      {Array.from({ length: 12 }, (_, sign) => {
        const [c, r] = CELL[sign]!;
        const x = c * S;
        const y = r * S;
        const isLagna = sign === p.lagnaSign;
        const selected = p.selectedSign === sign;
        return (
          <g
            key={sign}
            onClick={() => p.onSelectSign?.(sign)}
            className={p.onSelectSign ? "cursor-pointer" : undefined}
          >
            <rect
              x={x}
              y={y}
              width={S}
              height={S}
              className={selected ? "fill-accent stroke-chart-line" : "fill-transparent stroke-chart-line"}
              strokeWidth={1}
            />
            {isLagna && (
              <line x1={x} y1={y + 22} x2={x + 22} y2={y} className="stroke-chart-lagna" strokeWidth={2} />
            )}
            <text
              x={x + S - 5}
              y={y + S - 6}
              textAnchor="end"
              className="fill-muted-foreground"
              style={{ fontSize: 9 }}
            >
              {p.signLabels[sign]}
            </text>
            <ItemStack
              items={p.bySign[sign] ?? []}
              x={x + S / 2}
              y={y + S / 2 - 4}
              retroMark={p.retroMark}
              combustMark={p.combustMark}
              {...(p.showDegrees !== undefined ? { showDegrees: p.showDegrees } : {})}
            />
          </g>
        );
      })}
      <rect x={S} y={S} width={2 * S} height={2 * S} className="fill-parchment stroke-chart-line" strokeWidth={1} />
      {p.centerTitle && (
        <text x={200} y={192} textAnchor="middle" className="fill-foreground" style={{ fontSize: 15, fontWeight: 700 }}>
          {p.centerTitle}
        </text>
      )}
      {p.centerSubtitle && (
        <text x={200} y={214} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10.5 }}>
          {p.centerSubtitle}
        </text>
      )}
    </svg>
  );
}
