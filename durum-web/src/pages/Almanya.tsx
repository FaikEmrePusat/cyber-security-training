import { MODEL, round1, type ChancenkarteState, type Gate0State } from "../model";
import { Section } from "../components/Section";
import { useDurum } from "../store";
import { useDerived } from "../useDerived";

const GATE0_OPTS: { value: Gate0State; label: string }[] = [
  { value: "bilinmiyor", label: "Bilinmiyor" },
  { value: "tam_denklik", label: "Tam denklik (Seçenek 1)" },
  { value: "kismi_denklik", label: "Kısmi denklik (+4 puan)" },
  { value: "denk_degil", label: "Denk değil" },
];

const ANER_OPTS: { value: ChancenkarteState["anerkennungDurum"]; label: string }[] = [
  { value: "arastiriliyor", label: "Araştırılıyor" },
  { value: "anabin_kontrol", label: "anabin kontrolü" },
  { value: "ihk_fosa_basvuru", label: "IHK FOSA başvurusu" },
  { value: "basvuruldu", label: "Başvuruldu — karar bekleniyor" },
  { value: "kismi", label: "Kısmi denklik (bescheid)" },
  { value: "tam", label: "Tam denklik" },
  { value: "red", label: "Red" },
];

export function AlmanyaPage() {
  const { state, setChancenkarte, setTempo } = useDurum();
  const d = useDerived();
  const ch = state.chancenkarte;

  return (
    <div className="page">
      <Section
        as="h1"
        title="Almanya / Chancenkarte"
        lead="§20b AufenthG puan motoru · Gate 0 hukuki ön koşul · Rota A (EN) vs Rota B (DE B2)."
      >
        <div className="dim-row">
          <div className="dim">
            <div className="dim__label">Puan</div>
            <div className="dim__value">
              {d.ck.puan === null ? "—" : d.ck.puan}
            </div>
            <div className="dim__sub">
              eşik ≥{MODEL.chancenkarte.puanEsik} · {d.ck.uygun ? "uygun" : "eksik"}
            </div>
          </div>
          <div className="dim">
            <div className="dim__label">Runway</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {d.runway === null ? "bilinmiyor" : `${round1(d.runway)} ay`}
            </div>
            <div className="dim__sub">Gate F ≥ {MODEL.kapi.F.runwayAy} ay</div>
          </div>
          <div className="dim">
            <div className="dim__label">Gate 0</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {d.gate0Ok ? "açık" : "kapalı"}
            </div>
          </div>
        </div>

        <ul style={{ paddingLeft: "1.1rem", color: "var(--ink-soft)" }}>
          {d.ck.detay.map((x) => (
            <li key={x.madde}>
              {x.ok ? "✓" : "·"} {x.madde}
              {x.puan ? ` (+${x.puan})` : ""}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Anerkennung durumu" lead="Detay: Anerkennung-Rehberi.md — anabin → IHK FOSA → bescheid.">
        <div className="field-row">
          <div className="field">
            <label>Gate 0 sonucu</label>
            <select
              value={ch.gate0}
              onChange={(e) =>
                setChancenkarte((c) => ({ ...c, gate0: e.target.value as Gate0State }))
              }
            >
              {GATE0_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Anerkennung aşaması</label>
            <select
              value={ch.anerkennungDurum}
              onChange={(e) =>
                setChancenkarte((c) => ({
                  ...c,
                  anerkennungDurum: e.target.value as ChancenkarteState["anerkennungDurum"],
                }))
              }
            >
              {ANER_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Yaş</label>
            <input
              type="number"
              min={18}
              max={55}
              value={ch.yas}
              onChange={(e) => setChancenkarte((c) => ({ ...c, yas: Number(e.target.value) }))}
            />
          </div>
          <div className="field">
            <label>Mesleki eğitim (yıl)</label>
            <input
              type="number"
              min={0}
              max={10}
              value={ch.meslekiEgitimYil}
              onChange={(e) =>
                setChancenkarte((c) => ({ ...c, meslekiEgitimYil: Number(e.target.value) }))
              }
            />
          </div>
        </div>
        <div className="field-row">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", minHeight: 44 }}>
            <input
              type="checkbox"
              checked={ch.lebensunterhalt}
              onChange={(e) =>
                setChancenkarte((c) => ({ ...c, lebensunterhalt: e.target.checked }))
              }
            />
            Geçim kanıtı (~{MODEL.chancenkarte.gecimAy2026} €/ay)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", minHeight: 44 }}>
            <input
              type="checkbox"
              checked={ch.engpassberuf}
              onChange={(e) =>
                setChancenkarte((c) => ({ ...c, engpassberuf: e.target.checked }))
              }
            />
            Engpassberuf (+1, doğrulanmadı)
          </label>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Birikim (€)</label>
            <input
              value={ch.birikim}
              placeholder="örn. 8000"
              onChange={(e) => setChancenkarte((c) => ({ ...c, birikim: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Aylık tasarruf (€)</label>
            <input
              value={ch.aylikTasarruf}
              placeholder="örn. 400"
              onChange={(e) =>
                setChancenkarte((c) => ({ ...c, aylikTasarruf: e.target.value }))
              }
            />
          </div>
        </div>
        <p className="note">
          Resmi self-check:{" "}
          <a
            href="https://www.make-it-in-germany.com/de/visum-aufenthalt/chancenkarte/self-check-chancenkarte"
            target="_blank"
            rel="noreferrer"
          >
            make-it-in-germany.com
          </a>
          {" · "}
          <a href="https://anabin.kmk.org" target="_blank" rel="noreferrer">
            anabin.kmk.org
          </a>
          {" · "}
          <a href="https://www.ihk-fosa.de/antragstellung/" target="_blank" rel="noreferrer">
            IHK FOSA
          </a>
        </p>
      </Section>

      <Section title="Dual rota ETA" lead="ETA = max_k ETA_k (T, L, P, C). Geri dönüş modunda gizlenir.">
        {d.geriDonusModu ? (
          <p className="note">Geri dönüş modu aktif — ETA gizlendi. Önce tekrar / oturum.</p>
        ) : (
          <div className="dim-row">
            <div className="dim">
              <div className="dim__label">Rota A · EN</div>
              <div className="dim__value" style={{ fontSize: "1.6rem" }}>
                ~{round1(d.etaRotaA.max)} hf
              </div>
              <div className="dim__sub">darboğaz {d.etaRotaA.darboğaz}</div>
            </div>
            <div className="dim">
              <div className="dim__label">Rota B · DE @ 7h</div>
              <div className="dim__value" style={{ fontSize: "1.6rem" }}>
                ~{round1(d.etaRotaB7.max)} hf
              </div>
              <div className="dim__sub">darboğaz {d.etaRotaB7.darboğaz}</div>
            </div>
            <div className="dim">
              <div className="dim__label">Rota B · DE @ 14h</div>
              <div className="dim__value" style={{ fontSize: "1.6rem" }}>
                ~{round1(d.etaRotaB14.max)} hf
              </div>
              <div className="dim__sub">darboğaz {d.etaRotaB14.darboğaz}</div>
            </div>
          </div>
        )}
        <div className="field-row">
          <div className="field">
            <label>Siber sa/hf</label>
            <input
              type="number"
              value={state.tempo.hoursCyber}
              onChange={(e) =>
                setTempo((t) => ({ ...t, hoursCyber: Number(e.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Dil sa/hf (7)</label>
            <input
              type="number"
              value={state.tempo.hoursLang}
              onChange={(e) =>
                setTempo((t) => ({ ...t, hoursLang: Number(e.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Dil sa/hf (14 alt)</label>
            <input
              type="number"
              value={state.tempo.hoursLangAlt}
              onChange={(e) =>
                setTempo((t) => ({ ...t, hoursLangAlt: Number(e.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Kalite plan</label>
            <input
              type="number"
              min={0.3}
              max={1}
              step={0.05}
              value={state.tempo.quality}
              onChange={(e) =>
                setTempo((t) => ({ ...t, quality: Number(e.target.value) }))
              }
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
