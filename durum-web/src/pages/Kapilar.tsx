import { useState } from "react";
import { GatePipeline } from "../components/GatePipeline";
import { Section } from "../components/Section";
import { SiemGapCallout } from "../components/SiemGapCallout";
import { useDerived } from "../useDerived";

export function KapilarPage() {
  const d = useDerived();
  const [focusId, setFocusId] = useState<string | null>(d.nextGate?.id ?? d.gates[0]?.id ?? null);
  const focus = d.gates.find((g) => g.id === focusId) ?? d.gates.find((g) => !g.open) ?? d.gates[0];

  return (
    <div className="page">
      <header className="hero hero--compact">
        <div className="hero__atmosphere" aria-hidden />
        <p className="hero__brand">Durum</p>
        <h1 className="hero__headline">Kapılar</h1>
        <p className="hero__sub hero__sub--short">Koşul hattı — dolu halka = açık.</p>
      </header>

      <SiemGapCallout />

      <Section title="Süreç" lead="0 → A → F · tıkla detay">
        <div className="kapilar-pipeline">
          <GatePipeline gates={d.gates} currentId={d.nextGate?.id ?? null} onSelect={setFocusId} />
        </div>

        {focus && (
          <div className="kapilar-detail topic-panel" style={{ borderLeftColor: focus.open ? "var(--ok)" : "var(--accent)" }}>
            <div className="kapilar-detail__head" style={{ width: "100%" }}>
              <h3 className="kapilar-detail__name">{focus.name}</h3>
              <span className={`badge ${focus.open ? "badge--ok" : "badge--closed"}`}>
                {focus.open ? "Açık" : "Kapalı"}
              </span>
            </div>
            <ul className="kapilar-parts">
              {focus.parts.map((p) => (
                <li key={p.key} className={p.ok ? "is-ok" : "is-gap"}>
                  <span className="part-dot" aria-hidden />
                  {p.label}
                </li>
              ))}
            </ul>
            {focus.bottleneck && (
              <p className="note" style={{ margin: 0 }}>
                Darboğaz: {focus.bottleneck.label}
              </p>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
