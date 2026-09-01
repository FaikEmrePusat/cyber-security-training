import { MODEL, round1, type ChancenkarteState, type Gate0State } from "../model";
import { Section } from "../components/Section";
import { useDurum } from "../store";
import { useDerived } from "../useDerived";

const GATE0_OPTS: { value: Gate0State; label: string }[] = [
  { value: "bilinmiyor", label: "Unknown" },
  { value: "tam_denklik", label: "Full recognition (Option 1)" },
  { value: "kismi_denklik", label: "Partial recognition (+4 points)" },
  { value: "denk_degil", label: "Not recognized" },
];

const ANER_OPTS: { value: ChancenkarteState["anerkennungDurum"]; label: string }[] = [
  { value: "arastiriliyor", label: "Researching" },
  { value: "anabin_kontrol", label: "anabin check" },
  { value: "ihk_fosa_basvuru", label: "IHK FOSA application" },
  { value: "basvuruldu", label: "Applied — awaiting decision" },
  { value: "kismi", label: "Partial recognition (bescheid)" },
  { value: "tam", label: "Full recognition" },
  { value: "red", label: "Rejected" },
];

export function AlmanyaPage() {
  const { state, setChancenkarte, setTempo } = useDurum();
  const d = useDerived();
  const ch = state.chancenkarte;

  return (
    <div className="page">
      <Section
        as="h1"
        title="Germany / Chancenkarte"
        lead="§20b AufenthG points engine · Gate 0 legal prerequisite · Route A (EN) vs Route B (DE B2)."
      >
        <div className="dim-row">
          <div className="dim">
            <div className="dim__label">Points</div>
            <div className="dim__value">
              {d.ck.puan === null ? "—" : d.ck.puan}
            </div>
            <div className="dim__sub">
              threshold ≥{MODEL.chancenkarte.puanEsik} · {d.ck.uygun ? "eligible" : "short"}
            </div>
          </div>
          <div className="dim">
            <div className="dim__label">Runway</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {d.runway === null ? "unknown" : `${round1(d.runway)} mo`}
            </div>
            <div className="dim__sub">Gate F ≥ {MODEL.kapi.F.runwayAy} months</div>
          </div>
          <div className="dim">
            <div className="dim__label">Gate 0</div>
            <div className="dim__value" style={{ fontSize: "1.5rem" }}>
              {d.gate0Ok ? "open" : "closed"}
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

      <Section title="Anerkennung status" lead="Details: Anerkennung-Rehberi.md — anabin → IHK FOSA → bescheid.">
        <div className="field-row">
          <div className="field">
            <label>Gate 0 outcome</label>
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
            <label>Anerkennung stage</label>
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
            <label>Age</label>
            <input
              type="number"
              min={18}
              max={55}
              value={ch.yas}
              onChange={(e) => setChancenkarte((c) => ({ ...c, yas: Number(e.target.value) }))}
            />
          </div>
          <div className="field">
            <label>Vocational training (years)</label>
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
            Proof of subsistence (~{MODEL.chancenkarte.gecimAy2026} €/month)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", minHeight: 44 }}>
            <input
              type="checkbox"
              checked={ch.engpassberuf}
              onChange={(e) =>
                setChancenkarte((c) => ({ ...c, engpassberuf: e.target.checked }))
              }
            />
            Shortage occupation (+1, unverified)
          </label>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Savings (€)</label>
            <input
              value={ch.birikim}
              placeholder="e.g. 8000"
              onChange={(e) => setChancenkarte((c) => ({ ...c, birikim: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Monthly savings (€)</label>
            <input
              value={ch.aylikTasarruf}
              placeholder="e.g. 400"
              onChange={(e) =>
                setChancenkarte((c) => ({ ...c, aylikTasarruf: e.target.value }))
              }
            />
          </div>
        </div>
        <p className="note">
          Official self-check:{" "}
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

      <Section title="Dual route ETA" lead="ETA = max_k ETA_k (T, L, P, C). Hidden in return mode.">
        {d.geriDonusModu ? (
          <p className="note">Return mode active — ETA hidden. Do reviews / sessions first.</p>
        ) : (
          <div className="dim-row">
            <div className="dim">
              <div className="dim__label">Route A · EN</div>
              <div className="dim__value" style={{ fontSize: "1.6rem" }}>
                ~{round1(d.etaRotaA.max)} wk
              </div>
              <div className="dim__sub">bottleneck {d.etaRotaA.darboğaz}</div>
            </div>
            <div className="dim">
              <div className="dim__label">Route B · DE @ 7h</div>
              <div className="dim__value" style={{ fontSize: "1.6rem" }}>
                ~{round1(d.etaRotaB7.max)} wk
              </div>
              <div className="dim__sub">bottleneck {d.etaRotaB7.darboğaz}</div>
            </div>
            <div className="dim">
              <div className="dim__label">Route B · DE @ 14h</div>
              <div className="dim__value" style={{ fontSize: "1.6rem" }}>
                ~{round1(d.etaRotaB14.max)} wk
              </div>
              <div className="dim__sub">bottleneck {d.etaRotaB14.darboğaz}</div>
            </div>
          </div>
        )}
        <div className="field-row">
          <div className="field">
            <label>Cyber h/week</label>
            <input
              type="number"
              value={state.tempo.hoursCyber}
              onChange={(e) =>
                setTempo((t) => ({ ...t, hoursCyber: Number(e.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Language h/week (7)</label>
            <input
              type="number"
              value={state.tempo.hoursLang}
              onChange={(e) =>
                setTempo((t) => ({ ...t, hoursLang: Number(e.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Language h/week (14 alt)</label>
            <input
              type="number"
              value={state.tempo.hoursLangAlt}
              onChange={(e) =>
                setTempo((t) => ({ ...t, hoursLangAlt: Number(e.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Quality plan</label>
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
