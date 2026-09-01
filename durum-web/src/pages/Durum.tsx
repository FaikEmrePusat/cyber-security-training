import { ALAN_COLOR } from "../data/oakCurriculum";
import { GaugeRing } from "../components/GaugeRing";
import { RadarChart } from "../components/RadarChart";
import { Section } from "../components/Section";
import { ProgressBar } from "../components/ProgressBar";
import { round1 } from "../model";
import { APP_NAME } from "../model/brand";
import { useDerived } from "../useDerived";
import { useDurum } from "../store";

const DIM_COLOR: Record<string, string> = {
  T: "var(--dim-t)",
  P: "var(--dim-p)",
  L: "var(--dim-l)",
  C: "var(--dim-c)",
};

export function DurumPage() {
  const d = useDerived();
  const { state } = useDurum();
  const rRatio = Math.min(1, d.live.R / 100);
  const size = 200;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - rRatio);

  return (
    <div className="page">
      <header className="hero hero--compact">
        <div className="hero__atmosphere" aria-hidden />
        <p className="hero__brand">{APP_NAME}</p>
        <h1 className="hero__headline">Score</h1>
        <p className="hero__sub hero__sub--short">{d.band}</p>
      </header>

      <div className="durum-heroes">
        <div className="r-hero">
          <svg className="r-hero__svg" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`R ${round1(d.live.R)}`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mist)" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
            {/* Entry / target ticks */}
            {[d.rEntry, d.rTarget].map((mark) => {
              const ang = -Math.PI / 2 + (mark / 100) * Math.PI * 2;
              const x1 = size / 2 + (r - 8) * Math.cos(ang);
              const y1 = size / 2 + (r - 8) * Math.sin(ang);
              const x2 = size / 2 + (r + 8) * Math.cos(ang);
              const y2 = size / 2 + (r + 8) * Math.sin(ang);
              return <line key={mark} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth={2} opacity={0.35} />;
            })}
            <text
              x={size / 2}
              y={size / 2 - 6}
              textAnchor="middle"
              fill="var(--ink)"
              fontFamily="var(--font-display)"
              fontSize={42}
              fontWeight={700}
            >
              {round1(d.live.R)}
            </text>
            <text x={size / 2} y={size / 2 + 22} textAnchor="middle" fill="var(--ink-mute)" fontSize={14} fontWeight={600}>
              R
            </text>
          </svg>
          <span className="r-hero__band">{d.band}</span>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <GaugeRing label="Gap" display={String(round1(d.kanitAcigi))} ratio={Math.min(1, d.kanitAcigi / 20)} tone="warn" size={56} />
            <GaugeRing label="Decay" display={String(round1(d.curumeKaybi))} ratio={Math.min(1, d.curumeKaybi / 15)} tone="mute" size={56} />
          </div>
        </div>

        <div className="radar-hero">
          <RadarChart
            labels={state.skills.map((s) => s.kisa)}
            values={state.skills.map((s) => d.live.sEff[s.id] ?? 0)}
          />
        </div>
      </div>

      <Section title="Dimensions" lead="T · P · L · C">
        <div className="dim-bars">
          {d.boyutlar.map((b) => {
            const ratio = Math.min(1, b.v / b.hedef);
            const fill = DIM_COLOR[b.key] ?? "var(--accent)";
            return (
              <div className="dim-bar" key={b.key}>
                <span className="dim-bar__key" style={{ color: fill }}>
                  {b.key}
                </span>
                <div className="dim-bar__track">
                  <div className="dim-bar__fill" style={{ width: `${ratio * 100}%`, background: fill }} />
                </div>
                <span className="dim-bar__val">
                  {round1(b.v)}/{b.hedef}
                </span>
              </div>
            );
          })}
        </div>
        <p className="note" style={{ marginTop: "0.75rem" }}>
          Bottleneck: {d.darbogaz.ad}
        </p>
      </Section>

      <Section title="Language & career">
        <div className="dim-row">
          <div className="dim" style={{ borderBottomColor: "var(--dim-l)" }}>
            <div className="dim__label">DE</div>
            <div className="dim__value">{round1(d.live.deEff)}</div>
            <div className="dim__sub">{d.deCefr}</div>
          </div>
          <div className="dim" style={{ borderBottomColor: ALAN_COLOR.net }}>
            <div className="dim__label">EN</div>
            <div className="dim__value">{round1(d.live.enEff)}</div>
            <div className="dim__sub">{d.enCefr}</div>
          </div>
          <div className="dim" style={{ borderBottomColor: "var(--dim-c)" }}>
            <div className="dim__label">P cap</div>
            <div className="dim__value" style={{ fontSize: "1.4rem" }}>
              {d.live.pTavan}
            </div>
          </div>
        </div>
        {state.career.map((c) => (
          <div key={c.id} style={{ marginBottom: "0.65rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
              <span>{c.label}</span>
              <span>
                {c.claimed}/{c.max}
              </span>
            </div>
            <ProgressBar ratio={c.claimed / c.max} label={`${Math.round((c.claimed / c.max) * 100)}%`} />
          </div>
        ))}
      </Section>
    </div>
  );
}
