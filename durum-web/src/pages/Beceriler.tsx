import { useState } from "react";
import {
  MODEL,
  evidenceCap,
  levelLabel,
  round1,
  sfiaLabel,
  type ArtifactType,
  type EvidenceTier,
} from "../model";
import { Section } from "../components/Section";
import { tryRaiseSkill, useDurum } from "../store";
import { useDerived } from "../useDerived";

const TIERS: EvidenceTier[] = ["yok", "kayit", "public"];
const ARTIFACT_TYPES = Object.keys(MODEL.artefaktDeger) as ArtifactType[];

export function BecerilerPage() {
  const { state, setSkills, setArtifacts, setLang, setCareer, appendLog } = useDurum();
  const d = useDerived();
  const [msg, setMsg] = useState<string | null>(null);
  const [editRef, setEditRef] = useState<Record<string, string>>({});
  const [newTur, setNewTur] = useState<ArtifactType>("vm-lab");

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(null), 2800);
  };

  const nowIso = () => new Date().toISOString();

  return (
    <div className="page">
      <Section
        as="h1"
        title="Skills"
        lead="Claimed level vs evidence-capped skill. Raising a score needs an evidence reference; lowering is free."
      >
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Area</th>
                <th>Claim</th>
                <th>Evidence</th>
                <th>S_etkin</th>
                <th>Ref</th>
              </tr>
            </thead>
            <tbody>
              {state.skills.map((s) => {
                const ref = editRef[s.id] ?? s.ref;
                return (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name}</strong>
                      <div className="note" style={{ margin: 0, fontSize: "0.75rem" }}>
                        w={s.weight} · {sfiaLabel(d.live.sEff[s.id] ?? 0) || levelLabel(s.claimed)}
                      </div>
                    </td>
                    <td>
                      <select
                        style={{ minHeight: 44, minWidth: 56 }}
                        value={s.claimed}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          if (next === s.claimed) return;
                          const res = tryRaiseSkill(s, next, s.evidence, ref);
                          if (!res.ok) {
                            flash(res.reason);
                            return;
                          }
                          setSkills((all) => all.map((x) => (x.id === s.id ? res.skill : x)));
                          appendLog({
                            t: nowIso(),
                            type: "skor",
                            alan: s.id,
                            s_once: s.claimed,
                            s_sonra: next,
                            yon: next > s.claimed ? "artis" : "dusus",
                            kanit_seviyesi: s.evidence,
                            kanit: ref.trim() || undefined,
                          });
                        }}
                      >
                        {Array.from({ length: 11 }, (_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        style={{ minHeight: 44 }}
                        value={s.evidence}
                        onChange={(e) => {
                          const next = e.target.value as EvidenceTier;
                          if (next === s.evidence) return;
                          const res = tryRaiseSkill(s, s.claimed, next, ref);
                          if (!res.ok) {
                            flash(res.reason);
                            return;
                          }
                          setSkills((all) => all.map((x) => (x.id === s.id ? res.skill : x)));
                          appendLog({
                            t: nowIso(),
                            type: "skor",
                            alan: s.id,
                            s_once: s.claimed,
                            s_sonra: s.claimed,
                            yon: "kanit",
                            kanit_seviyesi: next,
                            kanit: ref.trim() || undefined,
                          });
                        }}
                      >
                        {TIERS.map((t) => (
                          <option key={t} value={t}>
                            {MODEL.kanitAd[t]} (≤{evidenceCap(t, 10)})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <strong>{round1(d.live.sEff[s.id] ?? 0)}</strong>
                    </td>
                    <td>
                      <input
                        style={{ minHeight: 44, minWidth: 120 }}
                        placeholder="file / URL"
                        value={ref}
                        onChange={(e) => setEditRef((m) => ({ ...m, [s.id]: e.target.value }))}
                        onBlur={() => {
                          const trimmed = ref.trim();
                          if (trimmed === s.ref) return;
                          setSkills((all) =>
                            all.map((x) => (x.id === s.id ? { ...x, ref: trimmed } : x)),
                          );
                          appendLog({
                            t: nowIso(),
                            type: "skor",
                            alan: s.id,
                            s_once: s.claimed,
                            s_sonra: s.claimed,
                            yon: "ref",
                            kanit_seviyesi: s.evidence,
                            kanit: trimmed || undefined,
                          });
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Artifacts (P)" lead="P saturates + evidence-capped. Cap 8 without public. Type selection reveals model values.">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Ownership</th>
                <th>Evidence</th>
                <th>Ref</th>
              </tr>
            </thead>
            <tbody>
              {state.artifacts.map((a) => (
                <tr key={a.id}>
                  <td>
                    <input
                      style={{ minHeight: 44, minWidth: 100 }}
                      value={a.ad}
                      onChange={(e) =>
                        setArtifacts((all) =>
                          all.map((x) => (x.id === a.id ? { ...x, ad: e.target.value } : x)),
                        )
                      }
                    />
                  </td>
                  <td>
                    <select
                      style={{ minHeight: 44 }}
                      value={a.tur}
                      onChange={(e) => {
                        const tur = e.target.value as ArtifactType;
                        setArtifacts((all) =>
                          all.map((x) => (x.id === a.id ? { ...x, tur } : x)),
                        );
                      }}
                    >
                      {ARTIFACT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {MODEL.artefaktAd[t]} (v={MODEL.artefaktDeger[t]})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      style={{ minHeight: 44 }}
                      value={String(a.sahiplik)}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setArtifacts((all) =>
                          all.map((x) => (x.id === a.id ? { ...x, sahiplik: v } : x)),
                        );
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                  </td>
                  <td>
                    <select
                      style={{ minHeight: 44 }}
                      value={a.evidence}
                      onChange={(e) => {
                        const next = e.target.value as EvidenceTier;
                        if (
                          ["yok", "kayit", "public"].indexOf(next) >
                            ["yok", "kayit", "public"].indexOf(a.evidence) &&
                          !a.ref.trim()
                        ) {
                          flash("Reference required to raise artifact.");
                          return;
                        }
                        setArtifacts((all) =>
                          all.map((x) => (x.id === a.id ? { ...x, evidence: next } : x)),
                        );
                      }}
                    >
                      {TIERS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      style={{ minHeight: 44 }}
                      value={a.ref}
                      onChange={(e) =>
                        setArtifacts((all) =>
                          all.map((x) => (x.id === a.id ? { ...x, ref: e.target.value } : x)),
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="field-row" style={{ alignItems: "flex-end", marginTop: "0.75rem" }}>
          <div className="field">
            <label>New type</label>
            <select
              style={{ minHeight: 44 }}
              value={newTur}
              onChange={(e) => setNewTur(e.target.value as ArtifactType)}
            >
              {ARTIFACT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {MODEL.artefaktAd[t]} (v={MODEL.artefaktDeger[t]})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="cta cta--ghost"
            onClick={() => {
              const id = `a${Date.now()}`;
              setArtifacts((all) =>
                all.concat([
                  {
                    id,
                    ad: "New artifact",
                    tur: newTur,
                    sahiplik: 1,
                    evidence: "yok",
                    ref: "",
                  },
                ]),
              );
            }}
          >
            Add artifact
          </button>
        </div>
        <p className="note">
          Σ q·v = {round1(d.live.pSum)} → P = {round1(d.live.P)} / 10 · cap{" "}
          {evidenceCap(d.live.pTavan, 10)}
        </p>
      </Section>

      <Section title="Language" lead="DE/EN = 0.6·speaking + 0.4·general (language score on canvas does not write score log).">
        <div className="field-row">
          {(
            [
              ["deKonusma", "DE speaking"],
              ["deGenel", "DE general"],
              ["enKonusma", "EN speaking"],
              ["enGenel", "EN general"],
            ] as const
          ).map(([key, label]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={state.lang[key]}
                onChange={(e) =>
                  setLang((l) => ({ ...l, [key]: Number(e.target.value) }))
                }
              />
            </div>
          ))}
          <div className="field">
            <label>DE evidence</label>
            <select
              value={state.lang.deEv}
              onChange={(e) => setLang((l) => ({ ...l, deEv: e.target.value as EvidenceTier }))}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>EN evidence</label>
            <select
              value={state.lang.enEv}
              onChange={(e) => setLang((l) => ({ ...l, enEv: e.target.value as EvidenceTier }))}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Career (C)">
        {state.career.map((c) => (
          <div key={c.id} className="field-row" style={{ marginBottom: "0.75rem" }}>
            <div className="field">
              <label>{c.label}</label>
              <select
                value={c.claimed}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (next === c.claimed) return;
                  if (next > c.claimed && !c.ref.trim()) {
                    flash("Document/URL required to raise career.");
                    return;
                  }
                  setCareer((all) =>
                    all.map((x) => (x.id === c.id ? { ...x, claimed: next } : x)),
                  );
                  appendLog({
                    t: nowIso(),
                    type: "skor",
                    alan: `kariyer.${c.id}`,
                    s_once: c.claimed,
                    s_sonra: next,
                    yon: next > c.claimed ? "artis" : "dusus",
                    kanit_seviyesi: c.evidence,
                    kanit: c.ref.trim() || undefined,
                  });
                }}
              >
                {Array.from({ length: c.max + 1 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}/{c.max}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Evidence</label>
              <select
                value={c.evidence}
                onChange={(e) => {
                  const t2 = e.target.value as EvidenceTier;
                  if (t2 === c.evidence) return;
                  if (t2 !== "yok" && !c.ref.trim()) {
                    flash("Document/URL required to raise career evidence.");
                    return;
                  }
                  setCareer((all) =>
                    all.map((x) => (x.id === c.id ? { ...x, evidence: t2 } : x)),
                  );
                  appendLog({
                    t: nowIso(),
                    type: "skor",
                    alan: `kariyer.${c.id}`,
                    s_once: c.claimed,
                    s_sonra: c.claimed,
                    yon: "kanit",
                    kanit_seviyesi: t2,
                    kanit: c.ref.trim() || undefined,
                  });
                }}
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Ref</label>
              <input
                value={c.ref}
                onChange={(e) =>
                  setCareer((all) =>
                    all.map((x) => (x.id === c.id ? { ...x, ref: e.target.value } : x)),
                  )
                }
              />
            </div>
          </div>
        ))}
      </Section>

      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}
