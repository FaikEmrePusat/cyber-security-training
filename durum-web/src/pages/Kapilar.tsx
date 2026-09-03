import { useState } from "react";
import { GatePipeline } from "../components/GatePipeline";
import { Section } from "../components/Section";
import { SiemGapCallout } from "../components/SiemGapCallout";
import { stepLabel, PORTFOLIO_PROJECTS } from "../data/studyPlans";
import { useDerived } from "../useDerived";
import { APP_NAME } from "../model/brand";

export function KapilarPage() {
  const d = useDerived();
  const [focusId, setFocusId] = useState<string | null>(d.nextGate?.id ?? d.gates[0]?.id ?? null);
  const focus = d.gates.find((g) => g.id === focusId) ?? d.gates.find((g) => !g.open) ?? d.gates[0];
  const gateCOpen = d.gates.find((g) => g.id === "C")?.open ?? false;

  return (
    <div className="page">
      <header className="hero hero--compact">
        <div className="hero__atmosphere" aria-hidden />
        <p className="hero__brand">{APP_NAME}</p>
        <h1 className="hero__headline">Gates</h1>
        <p className="hero__sub hero__sub--short">Condition pipeline — filled ring = open.</p>
      </header>

      <SiemGapCallout />

      <Section title="Process" lead="0 → A → F · click for detail">
        <div className="kapilar-pipeline">
          <GatePipeline gates={d.gates} currentId={d.nextGate?.id ?? null} onSelect={setFocusId} />
        </div>

        {focus && (
          <div className="kapilar-detail topic-panel" style={{ borderLeftColor: focus.open ? "var(--ok)" : "var(--accent)" }}>
            <div className="kapilar-detail__head" style={{ width: "100%" }}>
              <h3 className="kapilar-detail__name">{focus.name}</h3>
              <span className={`badge ${focus.open ? "badge--ok" : "badge--closed"}`}>
                {focus.open ? "Open" : "Closed"}
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
                Bottleneck: {focus.bottleneck.label}
              </p>
            )}
          </div>
        )}
      </Section>

      {!gateCOpen && (
        <Section
          title="Recommended portfolio projects"
          lead="Gate C needs ≥2 public owned artifacts with a live URL, including one valuable SOC or AD lab (v≥2.5). Record work with a public link (promote on) or use Record → Add to portfolio. Each project teaches technique and detection together."
        >
          <ul className="portfolio-projects">
            {PORTFOLIO_PROJECTS.map((p) => (
              <li key={p.id} className="portfolio-project">
                <header className="portfolio-project__head">
                  <h3 className="portfolio-project__title">{p.title}</h3>
                  <span className="portfolio-project__meta">
                    Gate {p.gate} · v={p.value} · ~{p.hoursEstimate}h
                  </span>
                </header>
                <p className="portfolio-project__summary">{p.summary}</p>
                <details className="study-plan portfolio-project__plan">
                  <summary className="study-plan__summary">
                    Study plan — {p.guide.steps.length} steps
                  </summary>
                  <div className="study-plan__body">
                    <section className="study-plan__section">
                      <h4 className="study-plan__heading">Resources</h4>
                      <ul className="study-plan__resources">
                        {p.guide.resources.map((r) => (
                          <li key={r.url}>
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="study-plan__link">
                              {r.label}
                            </a>
                            <span className="study-plan__rtype">{r.type.toUpperCase()}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section className="study-plan__section">
                      <h4 className="study-plan__heading">Step-by-step</h4>
                      <ol className="study-plan__steps">
                        {p.guide.steps.map((s) => (
                          <li key={s.order} className="study-plan__step">
                            <span className="study-plan__step-action">{stepLabel(s)}</span>
                            {s.logHint && <span className="study-plan__step-hint">{s.logHint}</span>}
                          </li>
                        ))}
                      </ol>
                    </section>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
