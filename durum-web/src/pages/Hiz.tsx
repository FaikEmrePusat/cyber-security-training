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
        return "Hedefe ulaşıldı";
      case "durgun":
        return `∞ · durgun (v=${round2(d.eta.v)})`;
      case "durgunPlan":
        return `∞ · plan durgun (v=${round2(d.eta.v)})`;
      case "olculdu":
        return `~${round1(d.eta.mid)} hf (${round1(d.eta.lo)}–${round1(d.eta.hi)}, n=${d.eta.n})`;
      case "olculduDar":
        return `~${round1(d.eta.mid)} hf (n=${d.eta.n})`;
      case "plan":
        return `Plan bandı ${round1(d.eta.lo)}–${round1(d.eta.hi)} hf (ölçülmedi)`;
      default:
        return "—";
    }
  })();

  return (
    <div className="page">
      <Section
        as="h1"
        title="Hız & trend"
        lead="Antrenman yükü ve hız oturumlardan; ölçülen hız ≥2 haftalık snapshot ister."
      >
        <div className="dim-row">
          <div className="dim" title="CTL — uzun dönem yük">
            <div className="dim__label">Uzun yük</div>
            <div className="dim__value">{d.pmc.ctl}</div>
            <div className="dim__sub">CTL</div>
          </div>
          <div className="dim" title="ATL — kısa dönem yük">
            <div className="dim__label">Kısa yük</div>
            <div className="dim__value">{d.pmc.atl}</div>
            <div className="dim__sub">ATL</div>
          </div>
          <div className="dim" title="TSB — yorgunluk / form (CTL − ATL)">
            <div className="dim__label">Yorgunluk</div>
            <div className="dim__value">{d.pmc.tsb}</div>
            <div className="dim__sub">TSB</div>
          </div>
        </div>
        <div className="dim-row">
          <div className="dim">
            <div className="dim__label">v_tahmin (CTL)</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {round2(d.vTahmin)}
            </div>
            <div className="dim__sub">ΔR/hafta</div>
          </div>
          <div className="dim">
            <div className="dim__label">v_tahmin (plan)</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {round2(d.vTahminPlan)}
            </div>
            <div className="dim__sub">kalite {round2(d.kaliteKullanilan)}</div>
          </div>
          <div className="dim">
            <div className="dim__label">v_ölçülen</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {d.vOlculen ? round2(d.vOlculen.v) : "ölçülmedi"}
            </div>
            <div className="dim__sub">
              κ {d.kappa === null ? "—" : round2(d.kappa)}
            </div>
          </div>
        </div>
        <p className="note">
          ETA → R_hedef {d.rTarget}: <strong>{etaText}</strong>
          {d.geriDonusModu ? " · geri dönüş modu" : ""}
        </p>
        <p className="note">
          Son 7g {round1(d.gercekSaat7)} sa · streak {d.streak} · formül: v = (0.7×CTL − {MODEL.hiz.h0}) /{" "}
          {MODEL.hiz.H}
        </p>
      </Section>

      <Section title="Projeksiyon" lead="Plan eğrisi vs çalışmama (çürüme).">
        <LineChart
          series={[d.planSeries, d.nullSeries]}
          labels={d.projWeeks.map((w) => `${w}`)}
          colors={["#1a6b5c", "#8a5a2b"]}
        />
        <p className="note">Yeşil: plan · kahve: sıfır efor çürüme. Hafta ekseni.</p>
      </Section>

      {showCtl && (
        <Section title="CTL serisi" lead="Session log'dan TrainingPeaks PMC — en az 2 günlük oturum.">
          <LineChart
            series={[d.pmc.series]}
            labels={d.pmc.series.map((_, i) => String(i))}
            colors={["#1a6b5c"]}
            height={160}
          />
          <p className="note">
            v_tahmin = (0.7×CTL − {MODEL.hiz.h0})/{MODEL.hiz.H} = {round2(d.vTahmin)} · plan tempoda{" "}
            {round2(d.vTahminPlan)}
          </p>
        </Section>
      )}

      {showSnapTrend && (
        <Section title="Ölçülen R" lead="Log snapshot'larından.">
          <LineChart
            series={[d.snapshots.map((s) => s.hesap!.R)]}
            labels={snapLabels}
          />
        </Section>
      )}

      {showSnapTrend && (
        <Section title="Boyut bazlı trend" lead="T / P / L / C · snapshot tarihi · skor 0–10.">
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
          <p className="note">Yeşil T · mavi P · kahve L · mor C</p>
        </Section>
      )}

      {showDeltaR && (
        <Section title="Haftalık ΔR" lead="Ölçülen hız · referans çizgisi = v_tahmin.">
          <LineChart
            series={[deltaRSeries, deltaRSeries.map(() => d.vTahmin)]}
            labels={snapLabels.slice(1)}
            colors={["#2d6a4f", "#6a7d8a"]}
            height={190}
          />
          <p className="note">Yeşil: ΔR/hafta · gri: v_tahmin = {round2(d.vTahmin)}</p>
        </Section>
      )}

      <Section title="Tempo tablosu" lead="Kodun ürettiği v ile belge hedefleri yan yana.">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Tempo</th>
                <th>Siber</th>
                <th>Dil</th>
                <th>Hedef v</th>
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

      <Section title="Marjinal ROI (ilk 5)" lead="ROI_etkin = ROI × (1 + λ·kapı_darboğazı), λ=1.5">
        <ol style={{ paddingLeft: "1.2rem" }}>
          {d.roiList.slice(0, 5).map((a) => (
            <li key={a.id} style={{ marginBottom: "0.6rem" }}>
              <strong>{a.baslik}</strong>
              <div className="note" style={{ margin: 0 }}>
                ΔR {round2(a.deltaR)} / {a.saat} sa = {round2(a.roiEff)} R/sa
                {a.gate ? " · kapı darboğazı" : ""}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
