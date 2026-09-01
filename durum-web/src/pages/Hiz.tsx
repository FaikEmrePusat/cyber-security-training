import { MODEL, TEMPO_TABLOSU, predictedVelocity, round1, round2 } from "../model";
import { LineChart } from "../components/LineChart";
import { Section } from "../components/Section";
import { useDerived } from "../useDerived";

export function HizPage() {
  const d = useDerived();
  const snapLabels = d.snapshots.map((s) => s.t.slice(5, 10).replace("-", "."));
  const showSnapTrend = d.snapshots.length >= 2;
  const showDeltaR = d.snapshots.length >= 3;
  const showCtl = d.pmc.series.length >= 2;

  const deltaRSeries = showDeltaR
    ? d.snapshots.slice(1).map((s, i) => {
        const prev = d.snapshots[i];
        const dw = (Date.parse(s.t) - Date.parse(prev.t)) / (7 * 86400000);
        return dw > 0.2 ? round2(((s.hesap?.R ?? 0) - (prev.hesap?.R ?? 0)) / dw) : 0;
      })
    : [];

  const etaText = (() => {
    switch (d.eta.tip) {
      case "ulasildi":
        return "Target reached";
      case "durgun":
        return `∞ · stagnant (v=${round2(d.eta.v)})`;
      case "durgunPlan":
        return `∞ · plan stagnant (v=${round2(d.eta.v)})`;
      case "olculdu":
        return `~${round1(d.eta.mid)} wk (${round1(d.eta.lo)}–${round1(d.eta.hi)}, n=${d.eta.n})`;
      case "olculduDar":
        return `~${round1(d.eta.mid)} wk (n=${d.eta.n})`;
      case "plan":
        return `Plan band ${round1(d.eta.lo)}–${round1(d.eta.hi)} wk (not measured)`;
      default:
        return "—";
    }
  })();

  return (
    <div className="page">
      <Section
        as="h1"
        title="Pace & trend"
        lead="Training load and pace from sessions; measured pace needs ≥2 weekly snapshots."
      >
        <div className="dim-row">
          <div className="dim" title="CTL — long-term load">
            <div className="dim__label">Long load</div>
            <div className="dim__value">{d.pmc.ctl}</div>
            <div className="dim__sub">CTL</div>
          </div>
          <div className="dim" title="ATL — short-term load">
            <div className="dim__label">Short load</div>
            <div className="dim__value">{d.pmc.atl}</div>
            <div className="dim__sub">ATL</div>
          </div>
          <div className="dim" title="TSB — fatigue / form (CTL − ATL)">
            <div className="dim__label">Fatigue</div>
            <div className="dim__value">{d.pmc.tsb}</div>
            <div className="dim__sub">TSB</div>
          </div>
        </div>
        <div className="dim-row">
          <div className="dim">
            <div className="dim__label">v_predict (CTL)</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {round2(d.vTahmin)}
            </div>
            <div className="dim__sub">ΔR/week</div>
          </div>
          <div className="dim">
            <div className="dim__label">v_predict (plan)</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {round2(d.vTahminPlan)}
            </div>
            <div className="dim__sub">quality {round2(d.kaliteKullanilan)}</div>
          </div>
          <div className="dim">
            <div className="dim__label">v_measured</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {d.vOlculen ? round2(d.vOlculen.v) : "not measured"}
            </div>
            <div className="dim__sub">
              κ {d.kappa === null ? "—" : round2(d.kappa)}
            </div>
          </div>
        </div>
        <p className="note">
          ETA → R_target {d.rTarget}: <strong>{etaText}</strong>
          {d.geriDonusModu ? " · return mode" : ""}
        </p>
        <p className="note">
          Last 7d {round1(d.gercekSaat7)} h · streak {d.streak} · formula: v = (0.7×CTL − {MODEL.hiz.h0}) /{" "}
          {MODEL.hiz.H}
        </p>
      </Section>

      <Section title="Projection" lead="Plan curve vs no practice (decay).">
        <LineChart
          series={[d.planSeries, d.nullSeries]}
          labels={d.projWeeks.map((w) => `${w}`)}
          colors={["#1a6b5c", "#8a5a2b"]}
        />
        <p className="note">Green: plan · brown: zero-effort decay. Week axis.</p>
      </Section>

      {showCtl && (
        <Section title="CTL series" lead="TrainingPeaks PMC from session log — at least 2 days of sessions.">
          <LineChart
            series={[d.pmc.series]}
            labels={d.pmc.series.map((_, i) => String(i))}
            colors={["#1a6b5c"]}
            height={160}
          />
          <p className="note">
            v_predict = (0.7×CTL − {MODEL.hiz.h0})/{MODEL.hiz.H} = {round2(d.vTahmin)} · at plan pace{" "}
            {round2(d.vTahminPlan)}
          </p>
        </Section>
      )}

      {showSnapTrend && (
        <Section title="Measured R" lead="From log snapshots.">
          <LineChart
            series={[d.snapshots.map((s) => s.hesap!.R)]}
            labels={snapLabels}
          />
        </Section>
      )}

      {showSnapTrend && (
        <Section title="Dimension trends" lead="T / P / L / C · snapshot date · score 0–10.">
          <LineChart
            series={[
              d.snapshots.map((s) => s.hesap!.T),
              d.snapshots.map((s) => s.hesap!.P),
              d.snapshots.map((s) => s.hesap!.L),
              d.snapshots.map((s) => s.hesap!.C),
            ]}
            labels={snapLabels}
            colors={["#1a6b5c", "#3d6a8a", "#8a5a2b", "#5a4a7a"]}
          />
          <p className="note">Green T · blue P · brown L · purple C</p>
        </Section>
      )}

      {showDeltaR && (
        <Section title="Weekly ΔR" lead="Measured pace · reference line = v_predict.">
          <LineChart
            series={[deltaRSeries, deltaRSeries.map(() => d.vTahmin)]}
            labels={snapLabels.slice(1)}
            colors={["#2d6a4f", "#6a7d8a"]}
            height={190}
          />
          <p className="note">Green: ΔR/week · gray: v_predict = {round2(d.vTahmin)}</p>
        </Section>
      )}

      <Section title="Pace table" lead="Model v vs document targets side by side.">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Pace</th>
                <th>Cyber</th>
                <th>Language</th>
                <th>Target v</th>
                <th>Model v</th>
              </tr>
            </thead>
            <tbody>
              {TEMPO_TABLOSU.map((t) => {
                const v = predictedVelocity(t.siber, t.dil, t.kalite);
                const ok = v >= t.alt && v <= t.ust;
                return (
                  <tr key={t.ad}>
                    <td>{t.ad}</td>
                    <td>{t.siber}</td>
                    <td>{t.dil}</td>
                    <td>
                      {t.alt}–{t.ust}
                    </td>
                    <td style={{ color: ok ? "var(--ok)" : "var(--danger)" }}>{round2(v)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Marginal ROI (top 5)" lead="ROI_eff = ROI × (1 + λ·gate_bottleneck), λ=1.5">
        <ol style={{ paddingLeft: "1.2rem" }}>
          {d.roiList.slice(0, 5).map((a) => (
            <li key={a.id} style={{ marginBottom: "0.6rem" }}>
              <strong>{a.baslik}</strong>
              <div className="note" style={{ margin: 0 }}>
                ΔR {round2(a.deltaR)} / {a.saat} h = {round2(a.roiEff)} R/h
                {a.gate ? " · gate bottleneck" : ""}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
