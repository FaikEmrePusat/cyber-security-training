import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MODEL,
  daysSince,
  retrievability,
  round2,
  type RetrievalItem,
} from "../model";
import { DIFF_LABEL } from "../data/oakCurriculum";
import {
  loadSelfCheck,
  saveSelfCheck,
  selfCheckHasNotes,
} from "../lib/selfCheckStore";
import {
  REVIEW_NOTE_OUTCOME,
  curveCaption,
  dueDayIndex,
  dueInfo,
  forgettingCurvePoints,
  recallPrompts,
  type DueTone,
} from "../lib/reviewHelpers";

type MarkResult = "basarili" | "zorlandim" | "basarisiz";

type Props = {
  item: RetrievalItem;
  skillName: string;
  nowMs: number;
  open: boolean;
  showActions?: boolean;
  onToggle: () => void;
  onMark: (item: RetrievalItem, sonuc: MarkResult) => void;
  onRemove: (id: string) => void;
  registerEvidence: (topic: string, alan?: string) => void;
};

function toneClass(tone: DueTone): string {
  if (tone === "overdue") return "review-card__due review-card__due--overdue";
  if (tone === "today") return "review-card__due review-card__due--today";
  if (tone === "soon") return "review-card__due review-card__due--soon";
  return "review-card__due review-card__due--ok";
}

function ForgettingCurve({
  stability,
  elapsedDays,
  dueDay,
  dueDateLabel,
}: {
  stability: number;
  elapsedDays: number;
  dueDay: number;
  dueDateLabel: string;
}) {
  const w = 440;
  const h = 168;
  const padL = 42;
  const padR = 18;
  const padT = 26;
  const padB = 30;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const rTarget = MODEL.tekrar.rHedef;
  const maxT = Math.max(elapsedDays + 2, dueDay + 2, stability * 2.2, 10);
  const pts = forgettingCurvePoints(stability, maxT);
  const x = (t: number) => padL + (Math.min(t, maxT) / maxT) * innerW;
  const y = (r: number) => padT + (1 - Math.max(0, Math.min(1, r))) * innerH;
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.t).toFixed(1)},${y(p.r).toFixed(1)}`)
    .join(" ");
  const areaD = `${d} L${x(maxT).toFixed(1)},${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

  const hereT = Math.min(Math.max(0, elapsedDays), maxT);
  const hereR = retrievability(hereT, Math.max(0.5, stability));
  const hereX = x(hereT);
  const hereY = y(hereR);
  const dueT = Math.min(Math.max(0, dueDay), maxT);
  const dueR = retrievability(dueT, Math.max(0.5, stability));
  const dueX = x(dueT);
  const dueY = y(dueR);
  const threshY = y(rTarget);
  const plotBottom = padT + innerH;
  const plotTop = padT;

  const yTicks = [
    { r: 1, label: "100%" },
    { r: rTarget, label: `${Math.round(rTarget * 100)}%` },
    { r: 0, label: "0%" },
  ];

  const xTickDays = Array.from(
    new Set(
      [0, Math.round(maxT / 2), Math.round(maxT), Math.round(dueT)]
        .map((n) => Math.max(0, Math.min(Math.round(maxT), n)))
        .filter((n, i, arr) => arr.indexOf(n) === i),
    ),
  ).sort((a, b) => a - b);

  const hereLabelSide = hereX > w * 0.62 ? "left" : "right";
  const dueLabelText =
    dueDateLabel === "now" || dueDateLabel === "today"
      ? "due now"
      : `due ${dueDateLabel}`;

  return (
    <svg
      className="review-curve"
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      role="img"
      aria-label={`Forgetting curve — day ${round2(elapsedDays)}, retention ${Math.round(hereR * 100)}%, next due day ${round2(dueDay)}`}
    >
      {/* Forgotten zone below review threshold */}
      <rect
        x={padL}
        y={threshY}
        width={innerW}
        height={Math.max(0, plotBottom - threshY)}
        className="review-curve__zone"
      />

      {/* Soft fill under retention curve */}
      <path d={areaD} className="review-curve__fill" />

      {/* Horizontal grid + Y labels */}
      {yTicks.map((tick) => (
        <g key={tick.label}>
          <line
            x1={padL}
            x2={w - padR}
            y1={y(tick.r)}
            y2={y(tick.r)}
            className={
              tick.r === rTarget ? "review-curve__thresh" : "review-curve__grid"
            }
          />
          <text
            x={padL - 6}
            y={y(tick.r) + 3}
            textAnchor="end"
            className={
              tick.r === rTarget
                ? "review-curve__axis review-curve__axis--target"
                : "review-curve__axis"
            }
          >
            {tick.label}
          </text>
        </g>
      ))}

      {/* Vertical grid at x ticks */}
      {xTickDays.map((day) => (
        <line
          key={`vg-${day}`}
          x1={x(day)}
          x2={x(day)}
          y1={plotTop}
          y2={plotBottom}
          className="review-curve__vgrid"
        />
      ))}

      {/* Retention curve */}
      <path d={d} className="review-curve__path" fill="none" />

      {/* Next-due marker */}
      <line
        x1={dueX}
        x2={dueX}
        y1={plotTop}
        y2={plotBottom}
        className="review-curve__due-line"
      />
      <circle cx={dueX} cy={dueY} r={4} className="review-curve__due-dot" />
      <text
        x={dueX}
        y={plotTop - 8}
        textAnchor="middle"
        className="review-curve__due-label"
      >
        {dueLabelText}
      </text>

      {/* You-are-here */}
      <circle cx={hereX} cy={hereY} r={5.5} className="review-curve__here" />
      <text
        x={hereLabelSide === "right" ? hereX + 9 : hereX - 9}
        y={hereY - 8}
        textAnchor={hereLabelSide === "right" ? "start" : "end"}
        className="review-curve__label"
      >
        you are here · {Math.round(hereR * 100)}%
      </text>

      {/* X axis labels */}
      {xTickDays.map((day) => (
        <text
          key={`xl-${day}`}
          x={x(day)}
          y={h - 8}
          textAnchor="middle"
          className="review-curve__axis"
        >
          day {day}
        </text>
      ))}
    </svg>
  );
}

export function ReviewCard({
  item,
  skillName,
  nowMs,
  open,
  showActions = true,
  onToggle,
  onMark,
  onRemove,
  registerEvidence,
}: Props) {
  const days = daysSince(item.lastIso, nowMs);
  const r = retrievability(days, item.stability);
  const info = dueInfo(item, nowMs);
  const dueDay = dueDayIndex(item, nowMs);
  const caption = curveCaption(r, info);
  const prompts = useMemo(() => recallPrompts(item.topic, item.alan), [item.topic, item.alan]);
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    const doc = loadSelfCheck(item.topic, prompts);
    const nextChecked: Record<string, boolean> = {};
    for (const o of prompts) {
      nextChecked[o] = Boolean(doc.items[o]?.checked);
    }
    setChecked(nextChecked);
    const existing = doc.items[REVIEW_NOTE_OUTCOME]?.note ?? "";
    setNote(existing);
  }, [open, item.topic, prompts]);

  const lastLabel = (() => {
    const t = Date.parse(item.lastIso);
    if (!Number.isFinite(t)) return "—";
    return new Date(t).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  })();

  const persistAndEvidence = (nextNote: string, nextChecked: Record<string, boolean>) => {
    const baseOutcomes = [...prompts];
    const doc = loadSelfCheck(item.topic, baseOutcomes);
    const items = { ...doc.items };
    for (const o of prompts) {
      const prev = items[o] ?? { checked: false, note: "" };
      items[o] = { ...prev, checked: Boolean(nextChecked[o]) };
    }
    const outcomes = doc.outcomes.length ? [...doc.outcomes] : [...baseOutcomes];
    if (nextNote.trim()) {
      if (!outcomes.includes(REVIEW_NOTE_OUTCOME)) outcomes.push(REVIEW_NOTE_OUTCOME);
      items[REVIEW_NOTE_OUTCOME] = { checked: true, note: nextNote.trim() };
    }
    const nextDoc = {
      ...doc,
      topic: item.topic,
      outcomes,
      items,
    };
    saveSelfCheck(nextDoc);
    if (selfCheckHasNotes(nextDoc) || Object.values(nextChecked).some(Boolean)) {
      registerEvidence(item.topic, item.alan);
    }
  };

  const handleMark = (sonuc: MarkResult) => {
    persistAndEvidence(note, checked);
    onMark(item, sonuc);
  };

  const toggleCheck = (outcome: string) => {
    setChecked((prev) => {
      const next = { ...prev, [outcome]: !prev[outcome] };
      return next;
    });
  };

  const statusHeadline = info.due
    ? info.label
    : `Next review ${info.nextDateLabel}`;

  return (
    <article
      className={`review-card${open ? " review-card--open" : ""}${info.due ? " review-card--due" : ""}`}
    >
      <button type="button" className="review-card__head" onClick={onToggle} aria-expanded={open}>
        <div className="review-card__titles">
          <h3 className="review-card__title">{item.topic}</h3>
          <p className="review-card__meta">
            {skillName} · {DIFF_LABEL[item.difficulty] ?? item.difficulty} · S{" "}
            {round2(item.stability)}d · Ready {round2(r)}
          </p>
        </div>
        <div className="review-card__status">
          <span className={toneClass(info.tone)}>{info.label}</span>
          <span className="review-card__chevron" aria-hidden>
            {open ? "▾" : "▸"}
          </span>
        </div>
      </button>

      {open && (
        <div className="review-card__body">
          <div className="review-card__lead">
            <p className="review-card__lead-status">
              <span className={toneClass(info.tone)}>{statusHeadline}</span>
            </p>
            <p className="review-card__lead-copy">
              {info.due
                ? "Recall from memory, then mark how it went."
                : info.tone === "soon"
                  ? `Coming up in ${Math.max(1, Math.round(info.daysUntil))} day${Math.round(info.daysUntil) === 1 ? "" : "s"} — a quick self-check keeps retention high.`
                  : `Not due yet. Practice recall anytime, or wait until ${info.nextDateLabel}.`}
            </p>
          </div>

          <section className="review-card__curve-wrap" aria-labelledby={`curve-h-${item.id}`}>
            <h4 id={`curve-h-${item.id}`} className="review-card__section-label">
              Forgetting curve
            </h4>
            <ForgettingCurve
              stability={item.stability}
              elapsedDays={days}
              dueDay={dueDay}
              dueDateLabel={info.nextDateLabel}
            />
            <p className="review-card__curve-caption">{caption}</p>
            <ul className="review-card__legend" aria-hidden>
              <li>
                <span className="review-card__legend-swatch review-card__legend-swatch--curve" />
                Retention
              </li>
              <li>
                <span className="review-card__legend-swatch review-card__legend-swatch--thresh" />
                Review threshold ({Math.round(MODEL.tekrar.rHedef * 100)}%)
              </li>
              <li>
                <span className="review-card__legend-swatch review-card__legend-swatch--zone" />
                Below target
              </li>
            </ul>
            <dl className="review-card__stats">
              <div>
                <dt>Last review</dt>
                <dd>{lastLabel}</dd>
              </div>
              <div>
                <dt>Stability</dt>
                <dd>{round2(item.stability)} days</dd>
              </div>
              <div>
                <dt>Ease (EF)</dt>
                <dd>{round2(item.ef)}</dd>
              </div>
              <div>
                <dt>Next due</dt>
                <dd>{info.due ? info.label : info.nextDateLabel}</dd>
              </div>
            </dl>
          </section>

          <section className="review-card__recall" aria-labelledby={`recall-h-${item.id}`}>
            <h4 id={`recall-h-${item.id}`} className="review-card__section-label">
              What to remember
            </h4>
            <p className="note review-card__hint">
              Answer from memory, then mark the result. Notes become{" "}
              <strong>record</strong> evidence — see{" "}
              <Link to="/self-check">Self-check notes</Link>.
            </p>
            <ul className="review-card__checklist">
              {prompts.map((o) => (
                <li key={o}>
                  <label className="review-card__check-label">
                    <input
                      type="checkbox"
                      checked={Boolean(checked[o])}
                      onChange={() => toggleCheck(o)}
                    />
                    <span>{o}</span>
                  </label>
                </li>
              ))}
            </ul>
            <label className="review-card__note-label" htmlFor={`review-note-${item.id}`}>
              Short answers / recall notes
              <textarea
                id={`review-note-${item.id}`}
                rows={3}
                value={note}
                placeholder="Write what you recalled (optional)…"
                onChange={(e) => setNote(e.target.value)}
                onBlur={() => {
                  if (note.trim() || Object.values(checked).some(Boolean)) {
                    persistAndEvidence(note, checked);
                  }
                }}
              />
            </label>
          </section>

          {showActions ? (
            <div className="review-card__actions">
              <button type="button" className="cta" onClick={() => handleMark("basarili")}>
                Success
              </button>
              <button
                type="button"
                className="cta cta--ghost"
                onClick={() => handleMark("zorlandim")}
              >
                Struggled
              </button>
              <button
                type="button"
                className="cta cta--ghost"
                onClick={() => handleMark("basarisiz")}
              >
                Failed
              </button>
              <button
                type="button"
                className="cta cta--ghost review-card__delete"
                onClick={() => onRemove(item.id)}
                title="Delete (undo with Ctrl+Z)"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="review-card__actions">
              <button
                type="button"
                className="cta cta--ghost"
                onClick={() => {
                  persistAndEvidence(note, checked);
                }}
              >
                Save recall note
              </button>
              <button
                type="button"
                className="cta cta--ghost review-card__delete"
                onClick={() => onRemove(item.id)}
                title="Delete (undo with Ctrl+Z)"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
