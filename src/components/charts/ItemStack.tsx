import type { ChartItem } from "./types";

export function ItemStack({
  items,
  x,
  y,
  retroMark,
  combustMark,
  showDegrees,
  lineHeight = 15,
}: {
  items: ChartItem[];
  x: number;
  y: number;
  retroMark: string;
  combustMark: string;
  showDegrees?: boolean;
  lineHeight?: number;
}) {
  const lh = showDegrees ? lineHeight + 2 : lineHeight;
  const startY = y - ((items.length - 1) * lh) / 2;
  return (
    <g>
      {items.map((it, i) => (
        <text
          key={it.key}
          x={x}
          y={startY + i * lh}
          textAnchor="middle"
          dominantBaseline="middle"
          className={
            it.isLagna
              ? "fill-chart-lagna"
              : it.retro && it.key !== "rahu" && it.key !== "ketu"
                ? "fill-chart-retro"
                : "fill-foreground"
          }
          style={{ fontSize: 12.5, fontWeight: it.isLagna ? 700 : 600 }}
        >
          <title>{it.title}</title>
          {it.label}
          {it.retro && !it.isLagna && it.key !== "rahu" && it.key !== "ketu" ? `(${retroMark})` : ""}
          {it.combust ? `(${combustMark})` : ""}
          {showDegrees ? (
            <tspan className="fill-muted-foreground" style={{ fontSize: 9.5, fontWeight: 400 }} dx={3}>
              {it.degree}
            </tspan>
          ) : null}
        </text>
      ))}
    </g>
  );
}
