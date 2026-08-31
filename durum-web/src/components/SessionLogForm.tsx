import { useState, type FormEvent } from "react";
import type { Skill } from "../model";
import type { SessionFormData } from "../model";
import {
  AKTIVITE_OPTIONS,
  KALITE_PRESETS,
  KAYNAK_OPTIONS,
  MOD_OPTIONS,
  generateSessionNot,
} from "./sessionLogFormUtils";

type Props = {
  initial: SessionFormData;
  skills: Skill[];
  onSubmit: (form: SessionFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  compact?: boolean;
};

export function SessionLogForm({
  initial,
  skills,
  onSubmit,
  onCancel,
  submitLabel = "Kaydet",
  compact = false,
}: Props) {
  const [form, setForm] = useState<SessionFormData>(initial);
  const [showCustomAktivite, setShowCustomAktivite] = useState(initial.aktivite === "diger");

  const patch = (partial: Partial<SessionFormData>) => setForm((f) => ({ ...f, ...partial }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const not = form.not?.trim() || generateSessionNot(form);
    onSubmit({ ...form, not });
  };

  const handleQuickSave = () => {
    const not = form.not?.trim() || generateSessionNot(form);
    onSubmit({ ...form, not });
  };

  return (
    <form className={`session-log-form${compact ? " session-log-form--compact" : ""}`} onSubmit={handleSubmit}>
      <div className="session-log-form__grid">
        <div className="field">
          <label htmlFor="slf-aktivite">Ne yaptın?</label>
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
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {showCustomAktivite && (
          <div className="field">
            <label htmlFor="slf-aktivite-custom">Ne yaptın? (yaz)</label>
            <input
              id="slf-aktivite-custom"
              value={form.aktiviteCustom ?? ""}
              onChange={(e) => patch({ aktiviteCustom: e.target.value })}
              placeholder="Kısa açıklama"
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="slf-kaynak">Nereden?</label>
          <select id="slf-kaynak" value={form.kaynak} onChange={(e) => patch({ kaynak: e.target.value })}>
            {KAYNAK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="slf-dakika">Süre (dk)</label>
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
          <label htmlFor="slf-mod">Mod</label>
          <select id="slf-mod" value={form.mod} onChange={(e) => patch({ mod: e.target.value })}>
            {MOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="slf-alan">Alan</label>
          <select id="slf-alan" value={form.alan} onChange={(e) => patch({ alan: e.target.value })}>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            <option value="dil-de">Dil — Almanca</option>
            <option value="dil-en">Dil — İngilizce</option>
          </select>
        </div>
      </div>

      {!compact && (
        <>
          <div className="field">
            <label htmlFor="slf-kanit">Kanıt / not (opsiyonel)</label>
            <input
              id="slf-kanit"
              value={form.kanit ?? ""}
              onChange={(e) => patch({ kanit: e.target.value })}
              placeholder="URL, dosya veya kısa not"
            />
          </div>

          <div className="field">
            <label htmlFor="slf-not">Not (opsiyonel — otomatik üretilir)</label>
            <textarea
              id="slf-not"
              value={form.not ?? ""}
              onChange={(e) => patch({ not: e.target.value })}
              placeholder={generateSessionNot(form)}
              rows={2}
            />
          </div>

          <div className="field">
            <label htmlFor="slf-kalite">Kalite ({form.kalite.toFixed(2)})</label>
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
        <button type="submit" className="cta cta--sm">{submitLabel}</button>
        {compact && (
          <button type="button" className="cta cta--ghost cta--sm" onClick={handleQuickSave}>
            Hızlı kaydet
          </button>
        )}
        {onCancel && (
          <button type="button" className="cta cta--ghost cta--sm" onClick={onCancel}>
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
