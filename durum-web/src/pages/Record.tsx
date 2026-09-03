import { Link } from "react-router-dom";
import {
  ALAN_LABEL,
  OAK_CURRICULUM,
  STATUS_LABEL,
  type CurriculumStatus,
} from "../data/oakCurriculum";
import { GatePipeline } from "../components/GatePipeline";
import { Section } from "../components/Section";
import { kaynakLabel } from "../components/sessionLogFormUtils";
import { artifactAlreadyHasUrl, isPublicHttpUrl, shortUrlLabel } from "../data/evidencePromote";
import { APP_NAME, APP_TAGLINE, LEARNER_NAME, LEARNER_ROLE } from "../model/brand";
import { MODEL, evidenceCap, round1, sfiaLabel, type EvidenceTier } from "../model";
import { useCurriculumStatuses } from "../useCurriculumStatuses";
import { useDerived } from "../useDerived";
import { useDurum } from "../store";
import { useRollingSchedule } from "../useRollingSchedule";

const EVIDENCE_LABEL: Record<EvidenceTier, string> = {
  yok: "Claim only",
  kayit: "Private notes",
  public: "Public",
};

export function RecordPage() {
  const { state, promoteLogEvidence } = useDurum();
  const d = useDerived();
  const queueKeys = new Set(state.retrieval.map((r) => r.topic.trim().toLowerCase()));
  const { getStatus, counts } = useCurriculumStatuses(queueKeys);
  const schedule = useRollingSchedule(getStatus);

  const reinforced = OAK_CURRICULUM.filter((t) => getStatus(t.id) === "pekiştirildi");
  const learning = OAK_CURRICULUM.filter((t) => {
    const st: CurriculumStatus = getStatus(t.id);
    return st === "ogreniyorum" || st === "kuyrukta";
  });
  const publicArtifacts = state.artifacts.filter((a) => a.evidence === "public" && a.ref.trim());
  const nextTask = schedule.bugunGorevler[0];
  const workLog = [...state.history]
    .reverse()
    .filter((r) => r.type === "session" && !r.seed)
    .slice(0, 12);
  const gateC = d.gates.find((g) => g.id === "C");

  return (
    <div className="page record-page">
      <header className="hero hero--compact">
        <div className="hero__atmosphere" aria-hidden />
        <p className="hero__brand">{APP_NAME}</p>
        <p className="hero__tagline">{APP_TAGLINE}</p>
        <h1 className="hero__headline">{LEARNER_NAME}</h1>
        <p className="hero__sub hero__sub--short">{LEARNER_ROLE}</p>
        <p className="record-intro">
          Public snapshot of path, skills, and what was recorded after mentor sessions. Daily
          teaching happens in a mentor session; this site stores the trail.
        </p>
      </header>

      <Section title="Now" lead="What is next on the Oak path — not a complete résumé.">
        {nextTask ? (
          <p className="record-now">
            <strong>{nextTask.kindLabel}:</strong> {nextTask.baslik}
            {nextTask.alan && ALAN_LABEL[nextTask.alan] ? ` · ${ALAN_LABEL[nextTask.alan]}` : ""}
          </p>
        ) : (
          <p className="note">No open task for today.</p>
        )}
        <p className="note" style={{ marginTop: "0.5rem" }}>
          Oak path · {schedule.journey.konuTamamlanan}/{schedule.journey.konuToplam} topics ·{" "}
          {d.band} · readiness {round1(d.live.R)} (evidence-capped)
        </p>
        <p className="note">
          Reinforced {counts.pekiştirildi} · Learning {counts.ogreniyorum + counts.kuyrukta} · Later{" "}
          {counts.sonra}
        </p>
        <div className="actions" style={{ marginTop: "0.75rem" }}>
          <Link className="cta" to="/">
            Today’s topics
          </Link>
          <Link className="cta cta--ghost" to="/harita">
            Curriculum map
          </Link>
        </div>
      </Section>

      <Section
        title="Recorded work"
        lead="Session trail. Public http(s) evidence can be promoted into Gate C portfolio artifacts."
      >
        {workLog.length === 0 ? (
          <p className="note">Nothing recorded yet. Finish a topic with your mentor, then Record work on Today.</p>
        ) : (
          <ul className="record-work">
            {workLog.map((r, i) => {
              const url = r.kanit?.trim() ?? "";
              const canPromote = isPublicHttpUrl(url) && !artifactAlreadyHasUrl(state.artifacts, url);
              return (
                <li key={`${r.t}-${i}`}>
                  <time dateTime={r.t}>{r.t.slice(0, 16).replace("T", " ")}</time>
                  {r.konu && <strong> {r.konu}</strong>}
                  {typeof r.dur_min === "number" && <span> · {r.dur_min} min</span>}
                  {r.kaynak && <span className="note"> · {kaynakLabel(r.kaynak)}</span>}
                  {(r.tags?.length || r.sonuc) && (
                    <p className="record-work__tags">
                      {(r.tags ?? r.sonuc?.split(",").map((s) => s.trim()) ?? []).join(" · ")}
                    </p>
                  )}
                  {r.not && <p>{r.not}</p>}
                  {url && (
                    <p className="record-work__evidence">
                      <a href={url} target="_blank" rel="noopener noreferrer" title={url}>
                        {shortUrlLabel(url)}
                      </a>
                      {canPromote && (
                        <button
                          type="button"
                          className="cta cta--ghost cta--sm"
                          onClick={() =>
                            promoteLogEvidence({
                              title: r.konu ?? "Session evidence",
                              url,
                              alan: r.alan,
                              tags: r.tags,
                              kind: r.mod === "lab" ? "lab" : undefined,
                            })
                          }
                        >
                          Add to portfolio
                        </button>
                      )}
                      {!canPromote && isPublicHttpUrl(url) && (
                        <span className="note"> · in portfolio</span>
                      )}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Skills" lead="Claimed level vs what evidence allows (effective). Public links belong here or via Record work promote.">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Area</th>
                <th>Claim</th>
                <th>Evidence</th>
                <th>Effective</th>
              </tr>
            </thead>
            <tbody>
              {state.skills
                .filter((s) => s.id !== "port")
                .map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.claimed}</td>
                    <td>
                      {EVIDENCE_LABEL[s.evidence]}
                      {s.evidence === "public" && s.ref ? (
                        <>
                          {" · "}
                          <a href={s.ref} target="_blank" rel="noopener noreferrer">
                            link
                          </a>
                        </>
                      ) : null}
                    </td>
                    <td>
                      {round1(Math.min(s.claimed, evidenceCap(s.evidence, 10)))}
                      <span className="note"> · {sfiaLabel(d.live.sEff[s.id] ?? 0) || `cap ${evidenceCap(s.evidence, 10)}`}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="note" style={{ marginTop: "0.5rem" }}>
          Evidence gap vs uncapped claim: {round1(d.kanitAcigi)}
        </p>
      </Section>

      <Section
        title="Public lab evidence"
        lead={`Gate C needs ≥${MODEL.kapi.C.publicProje} public owned artifacts with a URL, including ≥1 SOC/AD lab (v≥${MODEL.kapi.C.minDeger}).`}
      >
        {publicArtifacts.length === 0 ? (
          <p className="note">
            None yet. Record work with a public GitHub/Medium URL (promote checked), or use Add to
            portfolio above.
          </p>
        ) : (
          <ul className="record-artifacts">
            {publicArtifacts.map((a) => (
              <li key={a.id}>
                <a href={a.ref} target="_blank" rel="noopener noreferrer">
                  {a.ad}
                </a>
                <span className="note" style={{ margin: 0 }}>
                  {" "}
                  · {MODEL.artefaktAd[a.tur]} (v={MODEL.artefaktDeger[a.tur]})
                </span>
              </li>
            ))}
          </ul>
        )}
        {gateC && (
          <p className="note" style={{ marginTop: "0.75rem" }}>
            Gate C · {Math.round(gateC.pi * 100)}%{gateC.open ? " · open" : ""}
            {gateC.bottleneck ? ` · ${gateC.bottleneck.label}` : ""}
          </p>
        )}
      </Section>

      <Section title="Gates" lead="Hiring-adjacent checkpoints. Filled ring = open.">
        <GatePipeline gates={d.gates} currentId={d.nextGate?.id ?? null} />
        {d.nextGate && (
          <p className="note" style={{ marginTop: "0.75rem" }}>
            Next: {d.nextGate.name}
            {d.nextGate.bottleneck ? ` · bottleneck: ${d.nextGate.bottleneck.label}` : ""}
          </p>
        )}
        <Link className="cta cta--ghost" to="/kapilar" style={{ marginTop: "0.75rem", display: "inline-flex" }}>
          Gate detail
        </Link>
      </Section>

      <Section
        title="Reinforced topics"
        lead="Topics marked Reinforced after you recorded work, or set on the map."
      >
        {reinforced.length === 0 ? (
          <p className="note">None yet. Mark foundation and weak-area topics done as you finish them.</p>
        ) : (
          <ul className="record-topics">
            {reinforced.map((t) => (
              <li key={t.id}>
                <span className="record-topics__alan">{ALAN_LABEL[t.alan] ?? t.alan}</span>
                {t.konu}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="In progress" lead="Currently learning or in the review queue.">
        {learning.length === 0 ? (
          <p className="note">No topics marked in progress.</p>
        ) : (
          <ul className="record-topics">
            {learning.slice(0, 24).map((t) => (
              <li key={t.id}>
                <span className="record-topics__alan">{ALAN_LABEL[t.alan] ?? t.alan}</span>
                {t.konu}
                <span className="note" style={{ margin: 0 }}>
                  {" "}
                  · {STATUS_LABEL[getStatus(t.id)]}
                </span>
              </li>
            ))}
          </ul>
        )}
        {learning.length > 24 && (
          <p className="note">
            +{learning.length - 24} more — see the <Link to="/harita">map</Link>.
          </p>
        )}
      </Section>
    </div>
  );
}
