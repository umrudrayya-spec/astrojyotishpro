import { ItemStack } from "./ItemStack";
import type { ChartProps } from "./types";

/** Fixed-house North Indian (diamond) layout. House 1 is the top diamond; houses run counter-clockwise. */
const HOUSE_CENTER: Record<number, [number, number]> = {
  1: [200, 105], 2: [100, 45], 3: [45, 100], 4: [105, 200], 5: [45, 300], 6: [100, 355],
  7: [200, 295], 8: [300, 355], 9: [355, 300], 10: [295, 200], 11: [355, 100], 12: [300, 45],
};
const SIGN_NUM_POS: Record<number, [number, number]> = {
  1: [200, 180], 2: [100, 88], 3: [88, 100], 4: [180, 200], 5: [88, 300], 6: [100, 312],
  7: [200, 220], 8: [300, 312], 9: [312, 300], 10: [220, 200], 11: [312, 100], 12: [300, 88],
};
const HOUSE_POLY: Record<number, string> = {
  1: "200,0 300,100 200,200 100,100",
  2: "0,0 200,0 100,100",
  3: "0,0 100,100 0,200",
  4: "0,200 100,100 200,200 100,300",
  5: "0,200 100,300 0,400",
  6: "0,400 100,300 200,400",
  7: "200,400 100,300 200,200 300,300",
  8: "200,400 300,300 400,400",
  9: "400,400 300,300 400,200",
  10: "400,200 300,300 200,200 300,100",
  11: "400,200 300,100 400,0",
  12: "400,0 300,100 200,0",
};

export function NorthIndianChart(p: ChartProps) {
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full select-none" role="img" aria-label="North Indian chart">
      <rect x={1} y={1} width={398} height={398} className="fill-card stroke-chart-line" strokeWidth={2} />
      {Array.from({ length: 12 }, (_, i) => {
        const house = i + 1;
        const sign = (p.lagnaSign + i) % 12;
        const [cx, cy] = HOUSE_CENTER[house]!;
        const [nx, ny] = SIGN_NUM_POS[house]!;
        const selected = p.selectedSign === sign;
        return (
          <g key={house} onClick={() => p.onSelectSign?.(sign)} className={p.onSelectSign ? "cursor-pointer" : undefined}>
            <polygon
              points={HOUSE_POLY[house]}
              className={selected ? "fill-accent stroke-chart-line" : house === 1 ? "fill-parchment stroke-chart-line" : "fill-transparent stroke-chart-line"}
              strokeWidth={1}
            />
            <text x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
              <title>{p.signLabels[sign]}</title>
              {sign + 1}
            </text>
            <ItemStack
              items={p.bySign[sign] ?? []}
              x={cx}
              y={cy}
              retroMark={p.retroMark}
              combustMark={p.combustMark}
              lineHeight={13}
              {...(p.showDegrees !== undefined ? { showDegrees: p.showDegrees } : {})}
            />
          </g>
        );
      })}
    </svg>
  );
}
