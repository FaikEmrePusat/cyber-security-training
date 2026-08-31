export function LineChart({
  series,
  labels,
  colors = ["#1a6b5c", "#6a7d8a"],
  height = 180,
}: {
  series: number[][];
  labels?: string[];
  colors?: string[];
  height?: number;
}) {
  if (!series.length || !series[0].length) return null;
  const w = 640;
  const h = height;
  const pad = { t: 12, r: 12, b: 28, l: 36 };
  const all = series.flat();
  const min = Math.min(...all, 0);
  const max = Math.max(...all, 1);
  const n = series[0].length;
  const x = (i: number) => pad.l + (i / Math.max(1, n - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min || 1)) * (h - pad.t - pad.b);

  const path = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img">
      <line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke="rgba(20,33,43,0.15)" />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke="rgba(20,33,43,0.15)" />
      <text x={4} y={pad.t + 4} fontSize={10} fill="#6a7d8a">
        {max.toFixed(0)}
      </text>
      <text x={4} y={h - pad.b} fontSize={10} fill="#6a7d8a">
        {min.toFixed(0)}
      </text>
      {series.map((vals, si) => (
        <path key={si} d={path(vals)} fill="none" stroke={colors[si % colors.length]} strokeWidth={2} />
      ))}
      {labels &&
        labels.map((lab, i) =>
          i % Math.ceil(n / 6) === 0 ? (
            <text key={i} x={x(i)} y={h - 8} textAnchor="middle" fontSize={9} fill="#6a7d8a">
              {lab}
            </text>
          ) : null,
        )}
    </svg>
  );
}
