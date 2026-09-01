import { MODEL, round1 } from "../model";
import { Section } from "../components/Section";
import { useDerived } from "../useDerived";

const BLOCKS: { title: string; body: string }[] = [
  {
    title: "Evidence ladder",
    body: `x_eff = min(x_claim, ratio(evidence) × x_max)
ratio: none=${MODEL.kanitOrani.yok} · record=${MODEL.kanitOrani.kayit} · public=${MODEL.kanitOrani.public}
S caps: 5.0 / 8.0 / 10.0`,
  },
  {
    title: "Decay",
    body: `τ = τ₀ · bⁿ = ${MODEL.curume.tau0} · ${MODEL.curume.b}ⁿ
multiplier = floor + (1−floor)·exp(−Δt/τ)
         = ${MODEL.curume.taban} + ${1 - MODEL.curume.taban}·exp(−Δt/τ)
S_eff = S_capped × multiplier`,
  },
  {
    title: "T · P · L · C",
    body: `T = Σ(wᵢ · S_eff,ᵢ) / Σwᵢ    (excl. port · Σw=${10.9})
P = maxₜ min( 10(1 − e^(−Σ_{≥t} q·v / κ)) , ratioₜ·10 )   κ=${MODEL.pKappa}
L = ${MODEL.L.DE}·DE + ${MODEL.L.EN}·EN
    DE/EN = ${MODEL.L.konusma}·speaking + ${MODEL.L.genel}·general
C = Σ min(claimᵢ, ratioᵢ × maxᵢ)`,
  },
  {
    title: "R (geometric ρ=0)",
    body: `R = 100 × T̂^${MODEL.R.T} × P̂^${MODEL.R.P} × L̂^${MODEL.R.L} × Ĉ^${MODEL.R.C}
X̂ ← max(X/10, 0.02)
R_target = R(T*${MODEL.hedef.vektor.T}, P*${MODEL.hedef.vektor.P}, L*${MODEL.hedef.vektor.L}, C*${MODEL.hedef.vektor.C})
R_entry = R(T*${MODEL.hedef.vektorGiris.T}, P*${MODEL.hedef.vektorGiris.P}, L*${MODEL.hedef.vektorGiris.L}, C*${MODEL.hedef.vektorGiris.C})`,
  },
  {
    title: "Pace · CTL/ATL/TSB",
    body: `load_d = (h_s×${MODEL.hiz.aSiber} + h_d×${MODEL.hiz.aDil}) × quality × ${MODEL.ctl.loadOlcek}
CTL_d  = CTL + (load − CTL) / ${MODEL.ctl.ctlGun}
ATL_d  = ATL + (load − ATL) / ${MODEL.ctl.atlGun}
TSB    = CTL − ATL
v_predict = (${MODEL.hiz.ctlCarpan}×CTL − ${MODEL.hiz.h0}) / ${MODEL.hiz.H}
v_measured = (R_now − R_ref) / Δweek
κ = v_measured / v_predict`,
  },
  {
    title: "Gates",
    body: `π_G = avg( min(1, xᵢ / thresholdᵢ) )
A: net≥${MODEL.kapi.A.net} ∧ linux≥${MODEL.kapi.A.linux} ∧ win≥${MODEL.kapi.A.win}
B: A ∧ secfund≥${MODEL.kapi.B.secfund} ∧ siem≥${MODEL.kapi.B.siem}
C: ≥${MODEL.kapi.C.publicProje} public+owned, ≥1 value≥${MODEL.kapi.C.minDeger}
D: R≥R_entry ∧ C ∧ 0 ∧ DE≥${MODEL.kapi.D.de} ∧ EN≥${MODEL.kapi.D.en}
E: D ∧ interviews14 ≥ ${MODEL.kapi.E.mulakat14gun}
F: runway ≥ ${MODEL.kapi.F.runwayAy} months`,
  },
  {
    title: "FSRS review",
    body: `R(t,S) = (1 + ${MODEL.tekrar.factor} · t/S)^(-${MODEL.tekrar.w20})
due ⇔ R < ${MODEL.tekrar.rHedef}
success → S ← min(S_max, S·EF) · EF↑`,
  },
  {
    title: "ROI",
    body: `ROI = ΔR / hour
ROI_eff = ROI × (1 + λ × [gate bottleneck])   λ=${MODEL.roi.lambda}
ΔR: model recomputed from scratch for each candidate`,
  },
];

export function FormullerPage() {
  const d = useDerived();

  return (
    <div className="page">
      <Section
        as="h1"
        title="Formulas"
        lead={`Model ${MODEL.surum} · live R=${round1(d.live.R)} · R_target=${d.rTarget} · R_entry=${d.rEntry}`}
      >
        {BLOCKS.map((b) => (
          <details className="formula-block" key={b.title}>
            <summary>{b.title}</summary>
            <pre>{b.body}</pre>
          </details>
        ))}
      </Section>
    </div>
  );
}
