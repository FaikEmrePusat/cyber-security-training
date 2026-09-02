import { Link } from "react-router-dom";
import { useState } from "react";
import { ALAN_COLOR } from "../data/oakCurriculum";
import { stepLabel, type StudyGuide } from "../data/studyPlans";
import { APP_NAME, APP_TAGLINE, STUDY_APPROACH_NOTE } from "../model/brand";
import { GatePipeline } from "../components/GatePipeline";
import { GaugeRing } from "../components/GaugeRing";
import { SiemGapCallout } from "../components/SiemGapCallout";
import { round1 } from "../model";
import { useCurriculumStatuses } from "../useCurriculumStatuses";
import { useDerived } from "../useDerived";
import { useRollingSchedule, type BugunGorev, type ScheduleDay } from "../useRollingSchedule";
import { useDurum } from "../store";
import type { SessionFormData } from "../model";

function MapGlyph() {
  return (
    <svg className="map-affordance__glyph" viewBox="0 0 28 28" aria-hidden>
      <circle cx={14} cy={14} r={4} fill="var(--ink)" />
      <circle cx={6} cy={8} r={2.5} fill="var(--alan-net)" />
      <circle cx={23} cy={10} r={2.5} fill="var(--alan-linux)" />
      <circle cx={20} cy={22} r={2.5} fill="var(--alan-win)" />
      <line x1={14} y1={14} x2={6} y2={8} stroke="var(--line)" strokeWidth={1.5} />
      <line x1={14} y1={14} x2={23} y2={10} stroke="var(--line)" strokeWidth={1.5} />
      <line x1={14} y1={14} x2={20} y2={22} stroke="var(--line)" strokeWidth={1.5} />
    </svg>
  );
}

const METRIC_HELP = [
  {
    key: "r",
    mark: "R",
    label: "Readiness",
    line: "How close you are to Germany junior target (0–100)",
  },
  {
    key: "gm",
    mark: "GM",
    label: "Safety margin",
    line: "Days before a gate skill decays; — = not measured yet",
  },
  {
    key: "tsb",
    mark: "TSB",
    label: "Fatigue",
    line: "Recent training load; rest when high",
  },
  {
    key: "gates",
    mark: "0–F",
    label: "Gates",
    line: "Fill = how close to open; highlighted ring = next blocker",
  },
] as const;

const KIND_CLASS: Record<string, string> = {
  tekrar: "gorev-card--tekrar",
  konu: "gorev-card--konu",
  temel: "gorev-card--temel",
  lab: "gorev-card--lab",
  dil: "gorev-card--dil",
  dinlenme: "gorev-card--dinlenme",
};

function StudyPlanPanel({ guide, kind }: { guide: StudyGuide; kind?: BugunGorev["kind"] }) {
  const showApproach = kind !== "dil" && kind !== "dinlenme";
  return (
    <details className="study-plan">
      <summary className="study-plan__summary">Study plan — {guide.steps.length} steps</summary>
      <div className="study-plan__body">
        {showApproach && <p className="study-plan__approach">{STUDY_APPROACH_NOTE}</p>}
        {guide.actions.length > 0 && (
          <section className="study-plan__section">
            <h3 className="study-plan__heading">What you can do</h3>
            <ul className="study-plan__actions">
              {guide.actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>
        )}
        {guide.resources.length > 0 && (
          <section className="study-plan__section">
            <h3 className="study-plan__heading">Resources</h3>
            <ul className="study-plan__resources">
              {guide.resources.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="study-plan__link">
                    {r.label}
                  </a>
                  <span className="study-plan__rtype">{r.type.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="study-plan__section">
          <h3 className="study-plan__heading">Step-by-step</h3>
          <ol className="study-plan__steps">
            {guide.steps.map((s) => (
              <li key={s.order} className="study-plan__step">
                <span className="study-plan__step-action">{stepLabel(s)}</span>
                {s.logHint && <span className="study-plan__step-hint">{s.logHint}</span>}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </details>
  );
}

function kindToForm(g: BugunGorev): Pick<SessionFormData, "aktivite" | "mod"> {
  if (g.kind === "tekrar") return { aktivite: "konu-tekrar", mod: "tekrar" };
  if (g.kind === "temel") return { aktivite: "temel-konu", mod: "lab" };
  if (g.kind === "lab") return { aktivite: "lab-pratik", mod: "lab" };
  if (g.kind === "dil") return { aktivite: "almanca", mod: "dil" };
  return { aktivite: "yeni-konu", mod: "lab" };
}

function ReturnWorkPanel({
  gorev,
  onSave,
  onCancel,
}: {
  gorev: BugunGorev;
  onSave: (form: SessionFormData) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState("");
  const [evidence, setEvidence] = useState("");
  const [minutes, setMinutes] = useState(Math.max(15, Math.round(gorev.saat * 60)));

  return (
    <form
      className="return-work"
      aria-label="Record what you did"
      onSubmit={(e) => {
        e.preventDefault();
        const mapped = kindToForm(gorev);
        onSave({
          ...mapped,
          aktiviteCustom: gorev.baslik,
          kaynak: "chatgpt",
          dakika: minutes,
          alan: gorev.alan && gorev.alan.length < 12 ? gorev.alan : "net",
          kanit: evidence.trim() || undefined,
          kalite: 0.85,
          not: note.trim() || `Completed with mentor: ${gorev.baslik}`,
        });
      }}
    >
      <p className="return-work__title">Back from ChatGPT — what did you do?</p>
      <p className="return-work__topic">{gorev.baslik}</p>
      <label className="return-work__label" htmlFor={`rw-note-${gorev.id}`}>
        What you did (commands, rooms, answers — paste from the chat)
      </label>
      <textarea
        id={`rw-note-${gorev.id}`}
        className="return-work__note"
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Explained kernel vs distro vs shell; uname -a on Ubuntu; THM Linux Fundamentals Part 1 tasks 1–5"
        required
      />
      <div className="return-work__row">
        <div>
          <label className="return-work__label" htmlFor={`rw-min-${gorev.id}`}>
            Minutes
          </label>
          <input
            id={`rw-min-${gorev.id}`}
            type="number"
            min={5}
            max={300}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value) || 30)}
          />
        </div>
        <div className="return-work__grow">
          <label className="return-work__label" htmlFor={`rw-ev-${gorev.id}`}>
            Evidence URL (optional)
          </label>
          <input
            id={`rw-ev-${gorev.id}`}
            type="text"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="https://tryhackme.com/room/… or GitHub gist"
          />
        </div>
      </div>
      <div className="return-work__actions">
        <button type="submit" className="cta cta--sm">
          Save to record
        </button>
        <button type="button" className="cta cta--ghost cta--sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function GorevCard({
  gorev,
  onComplete,
  onDefer,
}: {
  gorev: BugunGorev;
  onComplete?: () => void;
  onDefer?: () => void;
}) {
  const barColor = gorev.alan ? ALAN_COLOR[gorev.alan] ?? "var(--accent)" : "var(--accent)";
  return (
    <article
      className={`gorev-card ${KIND_CLASS[gorev.kind] ?? ""}${gorev.carried ? " gorev-card--carried" : ""}`}
      style={{ ["--task-alan" as string]: barColor }}
    >
      <div className="gorev-card__bar" style={{ background: barColor }} aria-hidden />
      <div className="gorev-card__body">
        <div className="gorev-card__top">
          <p className="gorev-card__kind">{gorev.kindLabel}</p>
          {gorev.carried && <span className="gorev-card__badge gorev-card__badge--carry">Carried</span>}
        </div>
        <h2 className="gorev-card__title">{gorev.baslik}</h2>
        {gorev.detay && <p className="gorev-card__detay">{gorev.detay}</p>}
        {gorev.neden && <p className="gorev-card__neden">{gorev.neden}</p>}
        {gorev.studyGuide && <StudyPlanPanel guide={gorev.studyGuide} kind={gorev.kind} />}
        <div className="gorev-card__meta">
          {gorev.sure && <span>{gorev.sure}</span>}
          {gorev.kind === "temel" && <span className="gorev-card__badge gorev-card__badge--temel">FOUNDATION</span>}
          {gorev.kind === "konu" && <span className="gorev-card__badge gorev-card__badge--zayif">WEAK AREA</span>}
          {gorev.kind === "lab" && <span className="gorev-card__badge gorev-card__badge--lab">LAB PRACTICE</span>}
          {gorev.kind === "dil" && <span className="gorev-card__badge gorev-card__badge--dil">GERMAN</span>}
          {gorev.carried && <span className="gorev-card__badge">From yesterday</span>}
        </div>
        {(onComplete || onDefer) && (
          <div className="gorev-card__actions">
            {onComplete && (
              <button type="button" className="cta cta--sm" onClick={onComplete}>
                Record work
              </button>
            )}
            {onDefer && (
              <button type="button" className="cta cta--ghost cta--sm" onClick={onDefer}>
                Defer to tomorrow
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ScheduleDayCard({ day }: { day: ScheduleDay }) {
  const isToday = day.offset === 0;
  return (
    <article className={`plan-day${isToday ? " plan-day--today" : ""}`}>
      <header className="plan-day__head">
        <span className="plan-day__label">{day.label}</span>
        <span className={`plan-day__daytype plan-day__daytype--${day.dayType}`}>
          {day.dayTypeLabel}
        </span>
        <span className="plan-day__date">{day.dateIso.slice(5).replace("-", ".")}</span>
        {day.tasima > 0 && (
          <span className="plan-day__slide" title="Capacity full — tasks rolling over">
            +{day.tasima} rolling
          </span>
        )}
      </header>
      {day.tasks.length === 0 ? (
        <p className="plan-day__empty">Empty day (capacity full or rest)</p>
      ) : (
        <ul className="plan-day__list">
          {day.tasks.map((t) => (
            <li key={t.id} className={`plan-day__item plan-day__item--${t.kind}`}>
              <span className="plan-day__kind">
                {t.kind === "tekrar"
                  ? "Review"
                  : t.kind === "temel"
                    ? "Foundation"
                    : t.kind === "konu"
                      ? "Weak"
                      : t.kind === "lab"
                        ? "Lab"
                        : t.kind === "dil"
                          ? "Lang"
                          : "Rest"}
              </span>
              <span className="plan-day__task">{t.baslik}</span>
              {t.carried && <span className="plan-day__carry">↩</span>}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function BugunPage() {
  const d = useDerived();
  const { state, completeScheduleTaskWithLog, deferScheduleTask, clearScheduleCarry } = useDurum();
  const [toast, setToast] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);
  const queueKeys = new Set(state.retrieval.map((r) => r.topic.trim().toLowerCase()));
  const { getStatus, setStatus } = useCurriculumStatuses(queueKeys);
  const schedule = useRollingSchedule(getStatus);

  const flash = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  };

  const rRatio = Math.min(1, d.live.R / Math.max(1, d.rTarget));
  const gmRatio =
    d.gmMin < 0 ? 0 : d.gmMin > 100 ? 1 : Math.min(1, d.gmMin / 100);
  const tsbNorm = Math.max(0, Math.min(1, (d.pmc.tsb + 40) / 80));
  const tsbTone = d.pmc.tsb < -20 ? "warn" : d.pmc.tsb > 10 ? "ok" : "accent";

  const gmDisplay =
    d.gmMin < 0 ? "—" : d.gmMin > 100 ? "100+" : `${Math.round(d.gmMin)}g`;

  const buHafta = schedule.days.filter((day) => day.weekGroup === "bu-hafta" && day.offset > 0);
  const gelecekHafta = schedule.days.filter((day) => day.weekGroup === "gelecek-hafta");

  const toCarryItem = (g: BugunGorev) => ({
    id: g.id,
    kind: g.kind === "dinlenme" ? ("tekrar" as const) : g.kind,
    baslik: g.baslik,
    saat: g.saat,
    topicId: g.topicId,
    retrievalId: g.retrievalId,
    roiId: g.roiId,
    sinceIso: new Date().toISOString().slice(0, 10),
  });

  const toTaskRef = (g: BugunGorev) => ({
    id: g.id,
    kind: g.kind,
    topicId: g.topicId,
    retrievalId: g.retrievalId,
    roiId: g.roiId,
    baslik: g.baslik,
    alan: g.alan,
  });

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__atmosphere" aria-hidden />
        <p className="hero__brand">{APP_NAME}</p>
        <p className="hero__tagline">{APP_TAGLINE}</p>
        <h1 className="hero__headline">Today</h1>
        <p className="hero__sub hero__sub--short">
          Open Today → work the topic in ChatGPT → come back and record what you did.
        </p>
        <ol className="work-loop">
          <li>
            <strong>Here:</strong> read the next topic
          </li>
          <li>
            <strong>ChatGPT:</strong> learn, retrieve, lab
          </li>
          <li>
            <strong>Here:</strong> Save to record
          </li>
        </ol>

        <section className="yolculuk-strip" aria-label="Curriculum journey">
          <div className="yolculuk-strip__progress">
            <div className="yolculuk-strip__bar" aria-hidden>
              <span className="yolculuk-strip__fill" style={{ width: `${schedule.journey.yuzde}%` }} />
            </div>
            <p className="yolculuk-strip__stat">
              Oak path · {schedule.journey.konuTamamlanan}/{schedule.journey.konuToplam} topics ·{" "}
              %{schedule.journey.yuzde}
            </p>
          </div>
          <p className="yolculuk-strip__konum">{schedule.journey.konumMetni}</p>
          {schedule.journey.kapıAd && (
            <p className="yolculuk-strip__gate">
              Next gate: {schedule.journey.kapıAd} · %{Math.round(schedule.journey.kapıPi * 100)}
            </p>
          )}
          <Link className="yolculuk-strip__link" to="/harita">
            View on map →
          </Link>
        </section>

        <section className="bugun-gorevler" aria-label="Today's tasks">
          <div className="bugun-gorevler__head">
            <div className="bugun-gorevler__headline-row">
              <h2 className="bugun-gorevler__title">Next topics</h2>
              <span className={`bugun-day-badge bugun-day-badge--${schedule.todayType}`}>
                {schedule.todayTypeLabel} ({schedule.todayType === "A" ? "Topic & Review" : "Integrated lab"})
              </span>
            </div>
            {schedule.carryCount > 0 && (
              <div className="bugun-gorevler__carry-wrap">
                <span className="bugun-gorevler__carry">{schedule.carryCount} carried tasks (cap: 2)</span>
                <button
                  type="button"
                  className="bugun-gorevler__clear-carry"
                  onClick={() => {
                    clearScheduleCarry();
                    flash("Carried tasks returned to curriculum pool");
                  }}
                  title="Clear carried tasks and return them to the curriculum pool"
                >
                  Return to Pool
                </button>
              </div>
            )}
          </div>
          <div className="bugun-gorevler__list">
            {schedule.bugunGorevler.map((g) => (
              <div key={g.id} className="bugun-gorevler__item">
                <GorevCard
                  gorev={g}
                  onComplete={() => setReturningId(g.id)}
                  onDefer={() => {
                    deferScheduleTask(toCarryItem(g));
                    flash("Deferred to tomorrow");
                  }}
                />
                {returningId === g.id && (
                  <ReturnWorkPanel
                    gorev={g}
                    onSave={(form) => {
                      completeScheduleTaskWithLog(toTaskRef(g), form);
                      if (g.topicId && (g.kind === "konu" || g.kind === "temel")) {
                        setStatus(g.topicId, "pekiştirildi");
                      }
                      setReturningId(null);
                      flash("Saved to your record");
                    }}
                    onCancel={() => setReturningId(null)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="actions bugun-gorevler__links">
            <Link className="cta" to="/record" title="Public competency record">
              Open record
            </Link>
            <Link className="cta cta--ghost" to="/tekrar" title="Due review list">
              Review queue
            </Link>
            <Link className="cta cta--ghost" to="/harita" title="Curriculum map">
              Topic map
            </Link>
            <Link className="map-affordance" to="/harita" title="Curriculum map">
              <MapGlyph />
              Map
            </Link>
          </div>
        </section>

        <section className="plan-timeline" aria-label="Upcoming days">
          <h2 className="plan-timeline__title">Days ahead</h2>
          <p className="plan-timeline__note">
            Estimated plan — unfinished tasks roll to the next day; pace: ~
            {round1(state.tempo.hoursCyber / 7)} h/day cyber · ~
            {round1(state.tempo.hoursLang / 7)} h/day language.
          </p>
          <div className="plan-timeline__today">
            <ScheduleDayCard day={schedule.days[0]} />
          </div>
          {buHafta.length > 0 && (
            <>
              <h3 className="plan-timeline__section">This week</h3>
              <div className="plan-timeline__grid">
                {buHafta.map((day) => (
                  <ScheduleDayCard key={day.dateIso} day={day} />
                ))}
              </div>
            </>
          )}
          {gelecekHafta.length > 0 && (
            <>
              <h3 className="plan-timeline__section">Next week</h3>
              <div className="plan-timeline__grid plan-timeline__grid--compact">
                {gelecekHafta.slice(0, 7).map((day) => (
                  <ScheduleDayCard key={day.dateIso} day={day} />
                ))}
              </div>
            </>
          )}
        </section>

        <SiemGapCallout compact />

        <div className="gauge-strip">
          <GaugeRing
            label="Readiness"
            display={String(round1(d.live.R))}
            ratio={rRatio}
            tone="accent"
            title="Readiness (R): how close you are to Germany junior (0–100)"
          />
          <GaugeRing
            label="Safety margin"
            display={gmDisplay}
            ratio={gmRatio}
            tone={d.gmMin < 14 ? "warn" : "ok"}
            title="Safety margin (GM): days before a gate skill decays; — = not measured yet"
          />
          <GaugeRing
            label="Fatigue"
            display={String(d.pmc.tsb)}
            ratio={tsbNorm}
            tone={tsbTone}
            title="Fatigue (TSB): recent training load; rest when high (form = CTL − ATL)"
          />
        </div>

        <details className="metric-legend">
          <summary className="metric-legend__summary">What do these mean?</summary>
          <ul className="metric-legend__list">
            {METRIC_HELP.map((m) => (
              <li key={m.key}>
                <span className="metric-legend__mark" aria-hidden>
                  {m.mark}
                </span>
                <span>
                  <strong>{m.label}</strong> — {m.line}
                </span>
              </li>
            ))}
          </ul>
        </details>

        <div style={{ marginTop: "1.25rem" }}>
          <GatePipeline gates={d.gates} currentId={d.nextGate?.id ?? null} compact showNames />
        </div>
      </header>
      {toast && <p className="toast-fixed">{toast}</p>}
    </div>
  );
}
