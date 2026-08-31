/** Circular progress gauge — value shown by arc fill, not text wall. */
export function GaugeRing({
  label,
  display,
  ratio,
  tone = "accent",
  size = 72,
  title,
}: {
  label: string;
  display: string;
  /** 0–1 fill */
  ratio: number;
  tone?: "accent" | "ok" | "warn" | "mute";
  size?: number;
  /** Jargon / formula hint (native tooltip). */
  title?: string;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, ratio));
  const offset = c * (1 - clamped);
  const colors: Record<string, string> = {
    accent: "var(--accent)",
    ok: "var(--ok)",
    warn: "var(--warn)",
    mute: "var(--ink-mute)",
  };
  const strokeColor = colors[tone] ?? colors.accent;

  return (
    <div
      className="gauge-ring"
      role="img"
      aria-label={`${label}: ${display}. ${title ?? ""}`.trim()}
      title={title}
      tabIndex={0}
    >
      <svg className="gauge-ring__svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--mist)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <text
          x={size / 2}
          y={size / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--ink)"
          fontFamily="var(--font-display)"
          fontSize={size * 0.22}
          fontWeight={700}
        >
          {display}
        </text>
      </svg>
      <span className="gauge-ring__label">{label}</span>
    </div>
  );
}
