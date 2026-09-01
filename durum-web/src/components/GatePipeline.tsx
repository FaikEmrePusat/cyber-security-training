import type { GateResult } from "../model";
import { pct } from "../model";

/** Short human name — tooltip and compact label. */
export const GATE_SHORT: Record<string, string> = {
  "0": "Legal",
  A: "Foundation",
  B: "Defense",
  C: "Portfolio",
  D: "Apply",
  E: "Interview",
  F: "Funds",
};

function MiniRing({
  ratio,
  open,
  current,
  size = 44,
}: {
  ratio: number;
  open: boolean;
  current: boolean;
  size?: number;
}) {
  const stroke = 4.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = open ? 1 : Math.max(0, Math.min(1, ratio));
  const offset = c * (1 - clamped);
  const color = open ? "var(--ok)" : current ? "var(--accent)" : "var(--ink-mute)";

  return (
    <svg className="gate-pipeline__ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mist)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={11}
        fontWeight={700}
        fontFamily="var(--font-body)"
      >
        {open ? "✓" : pct(ratio)}
      </text>
    </svg>
  );
}

export function GatePipeline({
  gates,
  currentId,
  onSelect,
  compact,
  showNames,
}: {
  gates: GateResult[];
  currentId?: string | null;
  onSelect?: (id: string) => void;
  compact?: boolean;
  /** Tiny human labels under letter (Today page). */
  showNames?: boolean;
}) {
  const current = currentId ?? gates.find((g) => !g.open)?.id ?? null;

  return (
    <div className={`gate-pipeline${compact ? " gate-pipeline--compact" : ""}`} role="list" aria-label="Gate pipeline">
      {gates.map((g, i) => {
        const isOpen = g.open;
        const isCurrent = g.id === current && !isOpen;
        const locked = !isOpen && !isCurrent && gates.slice(0, i).some((x) => !x.open);
        const short = GATE_SHORT[g.id] ?? g.id;
        const tip = [
          `${g.id} ${short}`,
          isOpen ? "Open" : isCurrent ? `Next blocker · ${pct(g.pi)}` : pct(g.pi),
          "Fill = how close to open",
        ].join(" — ");
        return (
          <div key={g.id} style={{ display: "contents" }}>
            {i > 0 && (
              <div
                className={`gate-pipeline__seg${isOpen || gates[i - 1]?.open ? " is-open" : ""}${
                  isCurrent ? " is-current" : ""
                }`}
                aria-hidden
              />
            )}
            <button
              type="button"
              role="listitem"
              className={`gate-pipeline__node${onSelect ? " is-interactive" : ""}${
                isOpen ? " is-open" : ""
              }${isCurrent ? " is-current" : ""}${locked ? " is-locked" : ""}`}
              onClick={() => onSelect?.(g.id)}
              title={tip}
              aria-label={`${g.id} ${short}: ${isOpen ? "open" : pct(g.pi)}${isCurrent ? ", next blocker" : ""}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <MiniRing ratio={g.pi} open={isOpen} current={!!isCurrent} size={compact ? 36 : 44} />
              <span className="gate-pipeline__id">{g.id}</span>
              {showNames && <span className="gate-pipeline__name">{short}</span>}
            </button>
          </div>
        );
      })}
    </div>
  );
}
