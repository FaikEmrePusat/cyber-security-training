import { MODEL, round1 } from "../model";
import { Section } from "../components/Section";
import { useDerived } from "../useDerived";

const BLOCKS: { title: string; body: string }[] = [
  {
    title: "Kanıt merdiveni",
    body: `x_etkin = min(x_beyan, oran(kanıt) × x_max)
oran: yok=${MODEL.kanitOrani.yok} · kayıt=${MODEL.kanitOrani.kayit} · public=${MODEL.kanitOrani.public}
S tavanları: 5.0 / 8.0 / 10.0`,
  },
  {
    title: "Çürüme",
    body: `τ = τ₀ · bⁿ = ${MODEL.curume.tau0} · ${MODEL.curume.b}ⁿ
çarpan = taban + (1−taban)·exp(−Δt/τ)
         = ${MODEL.curume.taban} + ${1 - MODEL.curume.taban}·exp(−Δt/τ)
S_etkin = S_tavanlı × çarpan`,
  },
  {
    title: "T · P · L · C",
    body: `T = Σ(wᵢ · S_etkin,ᵢ) / Σwᵢ    (port hariç · Σw=${10.9})
P = maxₜ min( 10(1 − e^(−Σ_{≥t} q·v / κ)) , oranₜ·10 )   κ=${MODEL.pKappa}
L = ${MODEL.L.DE}·DE + ${MODEL.L.EN}·EN
    DE/EN = ${MODEL.L.konusma}·konuşma + ${MODEL.L.genel}·genel
C = Σ min(beyanᵢ, oranᵢ × maxᵢ)`,
  },
  {
    title: "R (geometrik ρ=0)",
    body: `R = 100 × T̂^${MODEL.R.T} × P̂^${MODEL.R.P} × L̂^${MODEL.R.L} × Ĉ^${MODEL.R.C}
X̂ ← max(X/10, 0.02)
R_hedef = R(T*${MODEL.hedef.vektor.T}, P*${MODEL.hedef.vektor.P}, L*${MODEL.hedef.vektor.L}, C*${MODEL.hedef.vektor.C})
R_giriş = R(T*${MODEL.hedef.vektorGiris.T}, P*${MODEL.hedef.vektorGiris.P}, L*${MODEL.hedef.vektorGiris.L}, C*${MODEL.hedef.vektorGiris.C})`,
  },
  {
    title: "Hız · CTL/ATL/TSB",
    body: `load_g = (h_s×${MODEL.hiz.aSiber} + h_d×${MODEL.hiz.aDil}) × kalite × ${MODEL.ctl.loadOlcek}
CTL_g  = CTL + (load − CTL) / ${MODEL.ctl.ctlGun}
ATL_g  = ATL + (load − ATL) / ${MODEL.ctl.atlGun}
TSB    = CTL − ATL
v_tahmin = (${MODEL.hiz.ctlCarpan}×CTL − ${MODEL.hiz.h0}) / ${MODEL.hiz.H}
v_ölçülen = (R_şimdi − R_ref) / Δhafta
κ = v_ölçülen / v_tahmin`,
  },
  {
    title: "Kapılar",
    body: `π_G = ort( min(1, xᵢ / eşikᵢ) )
A: net≥${MODEL.kapi.A.net} ∧ linux≥${MODEL.kapi.A.linux} ∧ win≥${MODEL.kapi.A.win}
B: A ∧ secfund≥${MODEL.kapi.B.secfund} ∧ siem≥${MODEL.kapi.B.siem}
C: ≥${MODEL.kapi.C.publicProje} public+sahipli, ≥1 deger≥${MODEL.kapi.C.minDeger}
D: R≥R_giriş ∧ C ∧ 0 ∧ DE≥${MODEL.kapi.D.de} ∧ EN≥${MODEL.kapi.D.en}
E: D ∧ mülakat14 ≥ ${MODEL.kapi.E.mulakat14gun}
F: runway ≥ ${MODEL.kapi.F.runwayAy} ay`,
  },
  {
    title: "FSRS tekrar",
    body: `R(t,S) = (1 + ${MODEL.tekrar.factor} · t/S)^(-${MODEL.tekrar.w20})
vadesi ⇔ R < ${MODEL.tekrar.rHedef}
başarılı → S ← min(S_max, S·EF) · EF↑`,
  },
  {
    title: "ROI",
    body: `ROI = ΔR / saat
ROI_etkin = ROI × (1 + λ × [kapı darboğazı])   λ=${MODEL.roi.lambda}
ΔR: her aday için model baştan hesaplanır`,
  },
];

export function FormullerPage() {
  const d = useDerived();

  return (
    <div className="page">
      <Section
        as="h1"
        title="Formüller"
        lead={`Model ${MODEL.surum} · canlı R=${round1(d.live.R)} · R_hedef=${d.rTarget} · R_giriş=${d.rEntry}`}
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
