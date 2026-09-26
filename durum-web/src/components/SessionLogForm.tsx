import { useState, type FormEvent } from "react";
import type { Skill } from "../model";
import type { SessionFormData } from "../model";
import { LOG_SOURCES } from "../data/dayLog";
import { isPublicHttpUrl } from "../data/evidencePromote";
import {
  AKTIVITE_OPTIONS,
  KALITE_PRESETS,
  KAYNAK_OPTIONS,
  MOD_OPTIONS,
  generateSessionNot,
} from "./sessionLogFormUtils";
import type { StudyPlanStep } from "../data/studyPlans";

type Props = {
  initial: SessionFormData;
  skills: Skill[];
  studySteps?: StudyPlanStep[];
  onSubmit: (form: SessionFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  compact?: boolean;
};

function initialEvidenceRows(initial: SessionFormData): string[] {
  const urls = (initial.evidenceUrls?.length ? initial.evidenceUrls : [initial.kanit ?? ""])
    .map((u) => u.trim())
    .filter(Boolean);
  return urls.length > 0 ? urls : [""];
}

export function SessionLogForm({
  initial,
  skills,
  studySteps,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  compact = false,
}: Props) {
  const [form, setForm] = useState<SessionFormData>(initial);
  const [showCustomAktivite, setShowCustomAktivite] = useState(initial.aktivite === "diger");
  const [extraSources, setExtraSources] = useState<string[]>(() => initial.extraSources ?? []);
  const [evidenceRows, setEvidenceRows] = useState<string[]>(() => initialEvidenceRows(initial));

  const patch = (partial: Partial<SessionFormData>) => setForm((f) => ({ ...f, ...partial }));

  const activeStep = studySteps?.find((s) => s.order === (form.studyStep ?? 1));

  const buildPayload = (): SessionFormData => {
    const evidenceUrls = evidenceRows.map((r) => r.trim()).filter(Boolean);
    const extras = extraSources.filter((s) => s !== form.kaynak);
    const not =
      form.not?.trim() ||
      generateSessionNot({ ...form, extraSources: extras, evidenceUrls }, activeStep);
    return {
      ...form,
      extraSources: extras.length > 0 ? extras : undefined,
      kanit: evidenceUrls[0],
      evidenceUrls: evidenceUrls.length > 0 ? evidenceUrls : undefined,
      not,
    };
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(buildPayload());
  };

  const handleQuickSave = () => {
    onSubmit(buildPayload());
  };

  const toggleExtraSource = (id: string) => {
    if (id === form.kaynak) return;
    setExtraSources((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));
  };

  const extraSourceOptions = [
    ...KAYNAK_OPTIONS.map((o) => ({ id: o.value, label: o.label })),
    ...LOG_SOURCES.filter((s) => !KAYNAK_OPTIONS.some((o) => o.value === s.id)).map((s) => ({
      id: s.id,
      label: s.label,
    })),
  ].filter((s) => s.id !== form.kaynak);

  const evidenceLooksPublic = evidenceRows.some((r) => isPublicHttpUrl(r));

  return (
    <form
      className={`session-log-form${compact ? " session-log-form--compact" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="session-log-form__grid">
        {studySteps && studySteps.length > 0 && (
          <div className="field field--full">
            <label htmlFor="slf-study-step">Study plan step</label>
            <select
              id="slf-study-step"
              value={form.studyStep ?? 1}
              onChange={(e) => {
                const order = Number(e.target.value) || 1;
                const step = studySteps.find((s) => s.order === order);
                patch({
                  studyStep: order,
                  not: step
                    ? `Step ${step.order} — ${step.action}${step.logHint ? ` (${step.logHint})` : ""}`
                    : form.not,
                });
              }}
            >
              {studySteps.map((s) => (
                <option key={s.order} value={s.order}>
                  {s.order}. {s.action}
                  {s.durationMin ? ` (${s.durationMin} min)` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor="slf-aktivite">What did you do?</label>
          <select
            id="slf-aktivite"
            value={form.aktivite}
            onChange={(e) => {
              const v = e.target.value;
              setShowCustomAktivite(v === "diger");
              patch({ aktivite: v });
            }}
          >
            {AKTIVITE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {showCustomAktivite && (
          <div className="field">
            <label htmlFor="slf-aktivite-custom">What did you do? (type)</label>
            <input
              id="slf-aktivite-custom"
              value={form.aktiviteCustom ?? ""}
              onChange={(e) => patch({ aktiviteCustom: e.target.value })}
              placeholder="Short description"
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="slf-kaynak">Primary source</label>
          <select
            id="slf-kaynak"
            value={form.kaynak}
            onChange={(e) => {
              const next = e.target.value;
              patch({ kaynak: next });
              setExtraSources((cur) => cur.filter((s) => s !== next));
            }}
          >
            {KAYNAK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="slf-dakika">Duration (min)</label>
          <input
            id="slf-dakika"
            type="number"
            min={1}
            max={600}
            value={form.dakika}
            onChange={(e) => patch({ dakika: Number(e.target.value) || 0 })}
          />
        </div>

        <div className="field">
          <label htmlFor="slf-mod">Mode</label>
          <select id="slf-mod" value={form.mod} onChange={(e) => patch({ mod: e.target.value })}>
            {MOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="slf-alan">Area</label>
          <select id="slf-alan" value={form.alan} onChange={(e) => patch({ alan: e.target.value })}>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option value="dil-de">Language — German</option>
            <option value="dil-en">Language — English</option>
          </select>
        </div>
      </div>

      {!compact && (
        <>
          {extraSourceOptions.length > 0 && (
            <div className="field field--full">
              <span className="session-log-form__sublabel">Also used (optional)</span>
              <div className="day-log__chips" role="group" aria-label="Additional sources">
                {extraSourceOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`day-log__chip${extraSources.includes(s.id) ? " is-on" : ""}`}
                    aria-pressed={extraSources.includes(s.id)}
                    onClick={() => toggleExtraSource(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="field field--full">
            <span className="session-log-form__sublabel">Evidence (optional)</span>
            {evidenceRows.map((row, index) => (
              <div key={index} className="return-work__evidence-row" style={{ marginBottom: "0.4rem" }}>
                <input
                  id={`slf-kanit-${index}`}
                  value={row}
                  onChange={(e) =>
                    setEvidenceRows((rows) => rows.map((r, i) => (i === index ? e.target.value : r)))
                  }
                  aria-label={`Evidence ${index + 1}`}
                  placeholder="URL, file path, or short note"
                />
                {evidenceRows.length > 1 && (
                  <button
                    type="button"
                    className="cta cta--ghost cta--sm"
                    onClick={() =>
                      setEvidenceRows((rows) =>
                        rows.length <= 1 ? [""] : rows.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="cta cta--ghost cta--sm"
              onClick={() => setEvidenceRows((rows) => [...rows, ""])}
            >
              Add evidence
            </button>
            {evidenceLooksPublic && (
              <label className="return-work__promote" style={{ marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={form.promoteEvidence !== false}
                  onChange={(e) => patch({ promoteEvidence: e.target.checked })}
                />
                Add public http(s) evidence to portfolio
              </label>
            )}
          </div>

          <div className="field">
            <label htmlFor="slf-not">Note (optional — auto-generated)</label>
            <textarea
              id="slf-not"
              value={form.not ?? ""}
              onChange={(e) => patch({ not: e.target.value })}
              placeholder={generateSessionNot({ ...form, extraSources }, activeStep)}
              rows={2}
            />
          </div>

          <div className="field">
            <label htmlFor="slf-kalite">Quality ({form.kalite.toFixed(2)})</label>
            <input
              id="slf-kalite"
              type="range"
              min={0.3}
              max={1}
              step={0.05}
              value={form.kalite}
              onChange={(e) => patch({ kalite: Number(e.target.value) })}
              className="session-log-form__slider"
            />
            <div className="session-log-form__kalite-presets">
              {KALITE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`session-log-form__kalite-btn${form.kalite === p.value ? " session-log-form__kalite-btn--active" : ""}`}
                  onClick={() => patch({ kalite: p.value })}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="session-log-form__actions">
        <button type="submit" className="cta cta--sm">
          {submitLabel}
        </button>
        {compact && (
          <button type="button" className="cta cta--ghost cta--sm" onClick={handleQuickSave}>
            Quick save
          </button>
        )}
        {onCancel && (
          <button type="button" className="cta cta--ghost cta--sm" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
