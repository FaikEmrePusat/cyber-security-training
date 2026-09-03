import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ALAN_LABEL,
  OAK_CURRICULUM,
  STATUS_LABEL,
  type CurriculumStatus,
} from "../data/oakCurriculum";
import { GatePipeline } from "../components/GatePipeline";
import { PublishPanel } from "../components/PublishPanel";
import { Section } from "../components/Section";
import { kaynakLabel } from "../components/sessionLogFormUtils";
import { artifactAlreadyHasUrl, isPublicHttpUrl, shortUrlLabel } from "../data/evidencePromote";
import {
  fetchPublicProgress,
  getPublishToken,
  loadCurriculumMap,
  type PublicProgress,
} from "../data/publicProgress";
import { resolveStatus } from "../useCurriculumStatuses";
import { APP_NAME, APP_TAGLINE, LEARNER_NAME, LEARNER_ROLE } from "../model/brand";
import {
  MODEL,
  computeAll,
  evaluateGates,
  evidenceCap,
  rHedef,
  round1,
  sfiaLabel,
  type AppState,
  type EvidenceTier,
} from "../model";
import { useCurriculumStatuses } from "../useCurriculumStatuses";
import { useDerived } from "../useDerived";
import { useDurum } from "../store";
import { useRollingSchedule } from "../useRollingSchedule";

const EVIDENCE_LABEL: Record<EvidenceTier, string> = {
  yok: "Claim only",
  kayit: "Private notes",
  public: "Public",
};

/** True when this browser is the learner’s workspace (not a cold visitor). */
function isOwnerWorkspace(state: AppState): boolean {
  if (getPublishToken()) return true;
  if (state.history.some((r) => r.type === "session" && !r.seed)) return true;
  if (Object.keys(loadCurriculumMap()).length > 0) return true;
  return false;
}

function curriculumCounts(map: Record<string, CurriculumStatus>, queueKeys: Set<string>) {
  const c: Record<CurriculumStatus, number> = {
    ogrenilmedi: 0,
    ogreniyorum: 0,
    kuyrukta: 0,
    pekiştirildi: 0,
    sonra: 0,
  };
  for (const t of OAK_CURRICULUM) {
    const inQueue = queueKeys.has(t.konu.trim().toLowerCase());
    c[resolveStatus(t.id, map[t.id], inQueue)] += 1;
  }
  return c;
}

export function RecordPage() {
  const { state, promoteLogEvidence } = useDurum();
  const d = useDerived();
  const queueKeys = new Set(state.retrieval.map((r) => r.topic.trim().toLowerCase()));
  const { getStatus, counts } = useCurriculumStatuses(queueKeys);
  const schedule = useRollingSchedule(getStatus);

  const [published, setPublished] = useState<PublicProgress | null>(null);
  const [pubStatus, setPubStatus] = useState<"loading" | "ok" | "missing">("loading");
  const ownerHere = isOwnerWorkspace(state);
  const isPublisher = Boolean(getPublishToken());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchPublicProgress();
      if (cancelled) return;
      if (data && data.publishedAt) {
        setPublished(data);
        setPubStatus("ok");
      } else if (data) {
        setPublished(data);
        setPubStatus("missing");
      } else {
        setPubStatus("missing");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Cold visitors see published snapshot; owner browser always sees live local. */
  const usePublishedView = !ownerHere && pubStatus === "ok" && published != null && Boolean(published.publishedAt);

  const view = useMemo(() => {
    if (!usePublishedView || !published) return null;
    const st = published.state;
    const practice: Record<string, { days: number; n: number }> = {};
    for (const s of st.skills) practice[s.id] = { days: 0, n: 0 };
    const live = computeAll(st.skills, st.artifacts, st.lang, st.career, practice, {
      kanitTavani: true,
      curume: true,
    });
    const gates = evaluateGates(live.sEff, live.R, st.artifacts, live.deEff, live.enEff, 0, false, false);
    const nextGate = gates.find((g) => !g.open) ?? null;
    const qKeys = new Set(st.retrieval.map((r) => r.topic.trim().toLowerCase()));
    const countsPub = curriculumCounts(published.curriculum, qKeys);
    const getPubStatus = (id: string): CurriculumStatus =>
      resolveStatus(id, published.curriculum[id], false);
    return { st, live, gates, nextGate, countsPub, getPubStatus, published };
  }, [usePublishedView, published]);

  const skills = view?.st.skills ?? state.skills;
  const artifacts = view?.st.artifacts ?? state.artifacts;
  const historySrc = view?.st.history ?? state.history;
  const liveR = view ? view.live.R : d.live.R;
  const liveSEff = view ? view.live.sEff : d.live.sEff;
  const kanitAcigi = view ? 0 : d.kanitAcigi;
  const gates = view?.gates ?? d.gates;
  const nextGate = view?.nextGate ?? d.nextGate;
  const band = view ? "Published" : d.band;
  const countsView = view?.countsPub ?? counts;
  const getStatusView = view?.getPubStatus ?? getStatus;
  const oakDone = view
    ? view.published.summary.oakReinforced
    : schedule.journey.konuTamamlanan;
  const oakTotal = view ? view.published.summary.oakTotal : schedule.journey.konuToplam;
  const nextTask = view ? null : schedule.bugunGorevler[0];
  const learnerName = view?.published.learner.name ?? LEARNER_NAME;
  const learnerRole = view?.published.learner.role ?? LEARNER_ROLE;

  const publicArtifacts = artifacts.filter((a) => a.evidence === "public" && a.ref.trim());
  const workLog = [...historySrc]
    .reverse()
    .filter((r) => r.type === "session" && !r.seed)
    .slice(0, 12);
  const gateC = gates.find((g) => g.id === "C");
  const readOnly = usePublishedView;

  return (
    <div className="page record-page">
      <header className="hero hero--compact">
        <div className="hero__atmosphere" aria-hidden />
        <p className="hero__brand">{APP_NAME}</p>
        <p className="hero__tagline">{APP_TAGLINE}</p>
        <h1 className="hero__headline">{learnerName}</h1>
        <p className="hero__sub hero__sub--short">{learnerRole}</p>
        <p className="record-intro">
          {readOnly
            ? "Public progress snapshot published by the learner. Read-only — you cannot change this record."
            : "Working copy from this browser. Publish from Data (or below) so visitors see the same trail."}
        </p>
        {published?.publishedAt && (
          <p className="note">
            Last public publish: {published.publishedAt.slice(0, 19).replace("T", " ")} UTC
            {isPublisher ? " · visitors see that until you publish again" : ownerHere ? " · publish to update what visitors see" : ""}
          </p>
        )}
        {pubStatus === "missing" && !isPublisher && (
          <p className="note">No public progress published yet.</p>
        )}
      </header>

      {ownerHere && (
        <Section title="Publish" lead="Push this browser’s progress to GitHub for followers.">
          <PublishPanel compact />
        </Section>
      )}

      <Section title="Now" lead="What is next on the Oak path — not a complete résumé.">
        {nextTask ? (
          <p className="record-now">
            <strong>{nextTask.kindLabel}:</strong> {nextTask.baslik}
            {nextTask.alan && ALAN_LABEL[nextTask.alan] ? ` · ${ALAN_LABEL[nextTask.alan]}` : ""}
          </p>
        ) : readOnly ? (
          <p className="note">
            Oak path · {oakDone}/{oakTotal} topics reinforced · readiness {round1(liveR)} /{" "}
            {round1(rHedef())}
          </p>
        ) : (
          <p className="note">No open task for today.</p>
        )}
        {!readOnly && (
          <p className="note" style={{ marginTop: "0.5rem" }}>
            Oak path · {oakDone}/{oakTotal} topics · {band} · readiness {round1(liveR)}{" "}
            (evidence-capped)
          </p>
        )}
        <p className="note">
          Reinforced {countsView.pekiştirildi} · Learning{" "}
          {countsView.ogreniyorum + countsView.kuyrukta} · Later {countsView.sonra}
        </p>
        {!readOnly && (
          <div className="actions" style={{ marginTop: "0.75rem" }}>
            <Link className="cta" to="/">
              Today’s topics
            </Link>
            <Link className="cta cta--ghost" to="/harita">
              Curriculum map
            </Link>
          </div>
        )}
      </Section>

      <Section
        title="Recorded work"
        lead={
          readOnly
            ? "Published session trail."
            : "Session trail. Public http(s) evidence can be promoted into Gate C portfolio artifacts."
        }
      >
        {workLog.length === 0 ? (
          <p className="note">
            {readOnly ? "No sessions in the public snapshot yet." : "Nothing recorded yet."}
          </p>
        ) : (
          <ul className="record-work">
            {workLog.map((r, i) => {
              const url = r.kanit?.trim() ?? "";
              const canPromote =
                !readOnly && isPublicHttpUrl(url) && !artifactAlreadyHasUrl(artifacts, url);
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
                      {!canPromote && !readOnly && isPublicHttpUrl(url) && (
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

      <Section title="Skills" lead="Claimed level vs what evidence allows (effective).">
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
              {skills
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
                      <span className="note">
                        {" "}
                        · {sfiaLabel(liveSEff[s.id] ?? 0) || `cap ${evidenceCap(s.evidence, 10)}`}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!readOnly && (
          <p className="note" style={{ marginTop: "0.5rem" }}>
            Evidence gap vs uncapped claim: {round1(kanitAcigi)}
          </p>
        )}
      </Section>

      <Section
        title="Public lab evidence"
        lead={`Gate C needs ≥${MODEL.kapi.C.publicProje} public owned artifacts with a URL, including ≥1 SOC/AD lab (v≥${MODEL.kapi.C.minDeger}).`}
      >
        {publicArtifacts.length === 0 ? (
          <p className="note">No public artifacts in this view yet.</p>
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
        <GatePipeline gates={gates} currentId={nextGate?.id ?? null} />
        {nextGate && (
          <p className="note" style={{ marginTop: "0.75rem" }}>
            Next: {nextGate.name}
            {nextGate.bottleneck ? ` · bottleneck: ${nextGate.bottleneck.label}` : ""}
          </p>
        )}
        {!readOnly && (
          <Link className="cta cta--ghost" to="/kapilar" style={{ marginTop: "0.75rem", display: "inline-flex" }}>
            Gate detail
          </Link>
        )}
      </Section>

      <Section title="Reinforced topics" lead="Topics marked Reinforced.">
        {(() => {
          const reinforced = OAK_CURRICULUM.filter((t) => getStatusView(t.id) === "pekiştirildi");
          if (reinforced.length === 0) return <p className="note">None yet.</p>;
          return (
            <ul className="record-topics">
              {reinforced.map((t) => (
                <li key={t.id}>
                  <span className="record-topics__alan">{ALAN_LABEL[t.alan] ?? t.alan}</span>
                  {t.konu}
                </li>
              ))}
            </ul>
          );
        })()}
      </Section>

      <Section title="In progress" lead="Currently learning or in the review queue.">
        {(() => {
          const learning = OAK_CURRICULUM.filter((t) => {
            const st = getStatusView(t.id);
            return st === "ogreniyorum" || st === "kuyrukta";
          });
          if (learning.length === 0) return <p className="note">No topics marked in progress.</p>;
          return (
            <>
              <ul className="record-topics">
                {learning.slice(0, 24).map((t) => (
                  <li key={t.id}>
                    <span className="record-topics__alan">{ALAN_LABEL[t.alan] ?? t.alan}</span>
                    {t.konu}
                    <span className="note" style={{ margin: 0 }}>
                      {" "}
                      · {STATUS_LABEL[getStatusView(t.id)]}
                    </span>
                  </li>
                ))}
              </ul>
              {learning.length > 24 && (
                <p className="note">+{learning.length - 24} more</p>
              )}
            </>
          );
        })()}
      </Section>
    </div>
  );
}
