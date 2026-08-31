/** Crisp reusable concept SVGs — shown when topic tags match; not per-topic art. */

export function OsiStack({ title = "OSI" }: { title?: string }) {
  const layers = ["Uyg", "Sun", "Otur", "Taşı", "Ağ", "Bağ", "Fiz"];
  const h = 10;
  const gap = 2;
  return (
    <div className="concept-model" title={title}>
      <svg viewBox="0 0 120 90" role="img" aria-label="OSI 7 katman">
        {layers.map((lab, i) => {
          const y = 8 + i * (h + gap);
          const t = 1 - i / 6;
          return (
            <g key={lab}>
              <rect
                x={18}
                y={y}
                width={84}
                height={h}
                rx={1.5}
                fill={`rgba(26,107,92,${0.25 + t * 0.45})`}
              />
              <text x={60} y={y + 7.5} textAnchor="middle" fill="#f4faf8" fontSize={7} fontWeight={600}>
                {7 - i} {lab}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function KillChainChevrons({ title = "Kill Chain" }: { title?: string }) {
  const steps = ["R", "W", "D", "E", "I", "C", "A"];
  return (
    <div className="concept-model" title={title}>
      <svg viewBox="0 0 120 90" role="img" aria-label="Kill Chain">
        {steps.map((s, i) => {
          const x = 6 + i * 15.5;
          const y = 32;
          return (
            <g key={s}>
              <polygon
                points={`${x},${y} ${x + 11},${y} ${x + 15},${y + 12} ${x + 11},${y + 24} ${x},${y + 24} ${x + 4},${y + 12}`}
                fill={i < 3 ? "var(--ok)" : i < 5 ? "var(--accent)" : "var(--warn)"}
                opacity={0.85}
              />
              <text x={x + 7.5} y={y + 15} textAnchor="middle" fill="#f4faf8" fontSize={7} fontWeight={700}>
                {s}
              </text>
            </g>
          );
        })}
        <text x={60} y={78} textAnchor="middle" fill="var(--ink-mute)" fontSize={8} fontWeight={600}>
          Kill Chain
        </text>
      </svg>
    </div>
  );
}

export function CiaTriangle({ title = "CIA" }: { title?: string }) {
  return (
    <div className="concept-model" title={title}>
      <svg viewBox="0 0 120 90" role="img" aria-label="CIA üçgeni">
        <polygon
          points="60,12 102,78 18,78"
          fill="rgba(26,107,92,0.15)"
          stroke="var(--accent)"
          strokeWidth={2}
        />
        <text x={60} y={38} textAnchor="middle" fill="var(--ink)" fontSize={9} fontWeight={700}>
          C
        </text>
        <text x={36} y={72} textAnchor="middle" fill="var(--ink)" fontSize={9} fontWeight={700}>
          I
        </text>
        <text x={84} y={72} textAnchor="middle" fill="var(--ink)" fontSize={9} fontWeight={700}>
          A
        </text>
        <text x={60} y={88} textAnchor="middle" fill="var(--ink-mute)" fontSize={7}>
          Gizlilik · Bütünlük · Erişilebilirlik
        </text>
      </svg>
    </div>
  );
}

export function ModelsForTags({ tags }: { tags: string[] }) {
  const lower = tags.map((t) => t.toLowerCase());
  const showOsi = lower.some((t) => /osi|tcp|udp|network|katman|layer/.test(t));
  const showKill = lower.some((t) => /kill|apt|mitre|chain|ransomware|malware/.test(t));
  const showCia = lower.some((t) => /cia|confidential|integrity|gizlilik|bütünlük|security fund/.test(t));
  if (!showOsi && !showKill && !showCia) return null;
  return (
    <div className="models-strip" aria-label="Kavram modelleri">
      {showOsi && <OsiStack />}
      {showKill && <KillChainChevrons />}
      {showCia && <CiaTriangle />}
    </div>
  );
}
