import { clamp } from "../model";

export function RadarChart({
  labels,
  values,
  max = 10,
}: {
  labels: string[];
  values: number[];
  max?: number;
}) {
  const n = labels.length;
  const size = n > 8 ? 340 : 300;
  const cx = size / 2;
  const cy = size / 2;
  const radius = n > 8 ? 100 : 96;

  const point = (i: number, v: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = (clamp(v, 0, max) / max) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const polygon = values
    .map((v, i) => {
      const p = point(i, v);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg className="chart radar-wrap" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Beceri radarı">
      {[0.25, 0.5, 0.75, 1].map((lvl) => (
        <polygon
          key={lvl}
          points={labels
            .map((_, i) => {
              const p = point(i, max * lvl);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(20,33,43,0.12)"
          strokeWidth={1}
        />
      ))}
      {labels.map((_, i) => {
        const outer = point(i, max);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(20,33,43,0.1)" strokeWidth={1} />;
      })}
      <polygon
        points={polygon}
        fill="rgba(26,107,92,0.18)"
        stroke="#1a6b5c"
        strokeWidth={2}
        style={{ transition: "all 0.5s ease" }}
      />
      {values.map((v, i) => {
        const p = point(i, v);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#1a6b5c" />;
      })}
      {labels.map((label, i) => {
        const p = point(i, max * 1.24);
        return (
          <text
            key={label}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#3d4f5c"
            fontSize={n > 8 ? 9 : 10}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
