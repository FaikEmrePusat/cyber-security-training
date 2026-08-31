import { Link } from "react-router-dom";
import { useState } from "react";
import { ALAN_COLOR } from "../data/oakCurriculum";
import { GatePipeline } from "../components/GatePipeline";
import { GaugeRing } from "../components/GaugeRing";
import { SiemGapCallout } from "../components/SiemGapCallout";
import { round1 } from "../model";
import { useCurriculumStatuses } from "../useCurriculumStatuses";
import { useDerived } from "../useDerived";
import { useRollingSchedule, type BugunGorev, type ScheduleDay } from "../useRollingSchedule";
import { SessionLogForm } from "../components/SessionLogForm";
import { defaultFormFromGorev } from "../components/sessionLogFormUtils";
import { useDurum } from "../store";

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
    label: "Hazırlık",
    line: "Almanya junior'a ne kadar yakınsın (0–100)",
  },
  {
    key: "gm",
    mark: "GM",
    label: "Güven payı",
    line: "Bir kapı becerisinin unutulmadan önceki gün marjı; — = henüz ölçülmedi",
  },
  {
    key: "tsb",
    mark: "TSB",
    label: "Yorgunluk",
    line: "Son günlerin yükü; yüksekse dinlen",
  },
  {
    key: "gates",
    mark: "0–F",
    label: "Kapılar",
    line: "Doluluk = ne kadar açığa yakın; vurgulu halka = sıradaki engel",
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
          {gorev.carried && <span className="gorev-card__badge gorev-card__badge--carry">Taşınan</span>}
        </div>
        <h2 className="gorev-card__title">{gorev.baslik}</h2>
        {gorev.detay && <p className="gorev-card__detay">{gorev.detay}</p>}
        {gorev.neden && <p className="gorev-card__neden">{gorev.neden}</p>}
        <div className="gorev-card__meta">
          {gorev.sure && <span>{gorev.sure}</span>}
          {gorev.kind === "temel" && <span className="gorev-card__badge gorev-card__badge--temel">TEMEL</span>}
          {gorev.kind === "konu" && <span className="gorev-card__badge gorev-card__badge--zayif">ZAYIF ALAN</span>}
          {gorev.kind === "lab" && <span className="gorev-card__badge gorev-card__badge--lab">LAB PRATİĞİ</span>}
          {gorev.kind === "dil" && <span className="gorev-card__badge gorev-card__badge--dil">ALMANCA</span>}
          {gorev.carried && <span className="gorev-card__badge">Dünden kalan</span>}
        </div>
        {(onComplete || onDefer) && (
          <div className="gorev-card__actions">
            {onComplete && (
              <button type="button" className="cta cta--sm" onClick={onComplete}>
                Bitti
              </button>
            )}
            {onDefer && (
              <button type="button" className="cta cta--ghost cta--sm" onClick={onDefer}>
                Yarına aktar
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
          <span className="plan-day__slide" title="Kapasite yetmedi — görevler kayıyor">
            +{day.tasima} kayıyor
          </span>
        )}
      </header>
      {day.tasks.length === 0 ? (
        <p className="plan-day__empty">Boş gün (kapasite dolu veya dinlenme)</p>
      ) : (
        <ul className="plan-day__list">
          {day.tasks.map((t) => (
            <li key={t.id} className={`plan-day__item plan-day__item--${t.kind}`}>
              <span className="plan-day__kind">
                {t.kind === "tekrar"
                  ? "Tekrar"
                  : t.kind === "temel"
                    ? "Temel"
                    : t.kind === "konu"
                      ? "Zayıf"
                      : t.kind === "lab"
                        ? "Lab"
                        : t.kind === "dil"
                          ? "Dil"
                          : "Dinlen"}
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
  const [loggingTaskId, setLoggingTaskId] = useState<string | null>(null);
  const queueKeys = new Set(state.retrieval.map((r) => r.topic.trim().toLowerCase()));
  const { getStatus } = useCurriculumStatuses(queueKeys);
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
        <p className="hero__brand">Durum</p>
        <h1 className="hero__headline">Bugün</h1>
        <p className="hero__sub hero__sub--short" title="Hazırlık skoru (R) — Almanya junior hedefine yakınlık">
          {round1(d.live.R)} hazırlık · {d.band}
        </p>

        <section className="yolculuk-strip" aria-label="Müfredat yolculuğu">
          <div className="yolculuk-strip__progress">
            <div className="yolculuk-strip__bar" aria-hidden>
              <span className="yolculuk-strip__fill" style={{ width: `${schedule.journey.yuzde}%` }} />
            </div>
            <p className="yolculuk-strip__stat">
              Oak yolu · {schedule.journey.konuTamamlanan}/{schedule.journey.konuToplam} konu ·{" "}
              %{schedule.journey.yuzde}
            </p>
          </div>
          <p className="yolculuk-strip__konum">{schedule.journey.konumMetni}</p>
          {schedule.journey.kapıAd && (
            <p className="yolculuk-strip__gate">
              Sıradaki kapı: {schedule.journey.kapıAd} · %{Math.round(schedule.journey.kapıPi * 100)}
            </p>
          )}
          <Link className="yolculuk-strip__link" to="/harita">
            Haritada gör →
          </Link>
        </section>

        <section className="bugun-gorevler" aria-label="Bugünün görevleri">
          <div className="bugun-gorevler__head">
            <div className="bugun-gorevler__headline-row">
              <h2 className="bugun-gorevler__title">Bugün ne yapacağım?</h2>
              <span className={`bugun-day-badge bugun-day-badge--${schedule.todayType}`}>
                {schedule.todayTypeLabel} ({schedule.todayType === "A" ? "Konu & Tekrar" : "Lab & SOC"})
              </span>
            </div>
            {schedule.carryCount > 0 && (
              <div className="bugun-gorevler__carry-wrap">
                <span className="bugun-gorevler__carry">{schedule.carryCount} taşınan görev (tavan: 2)</span>
                <button
                  type="button"
                  className="bugun-gorevler__clear-carry"
                  onClick={() => {
                    clearScheduleCarry();
                    flash("Taşınan görevler müfredat havuzuna iade edildi");
                  }}
                  title="Taşınan görevleri temizle ve müfredat havuzuna geri döndür"
                >
                  Havuza İade Et
                </button>
              </div>
            )}
          </div>
          <div className="bugun-gorevler__list">
            {schedule.bugunGorevler.map((g) => (
              <div key={g.id} className="bugun-gorevler__item">
                <GorevCard
                  gorev={g}
                  onComplete={() => setLoggingTaskId(g.id)}
                  onDefer={() => {
                    deferScheduleTask(toCarryItem(g));
                    flash("Yarına aktarıldı");
                  }}
                />
                {loggingTaskId === g.id && (
                  <div className="session-log-panel" role="region" aria-label="Oturum kaydı">
                    <p className="session-log-panel__title">Ne yaptın? — kısa log</p>
                    <SessionLogForm
                      initial={defaultFormFromGorev(g, state.tempo.quality)}
                      skills={state.skills}
                      onSubmit={(form) => {
                        completeScheduleTaskWithLog(toTaskRef(g), form);
                        setLoggingTaskId(null);
                        flash("Görev tamamlandı ve log kaydedildi");
                      }}
                      onCancel={() => setLoggingTaskId(null)}
                      submitLabel="Kaydet ve bitir"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="actions bugun-gorevler__links">
            <Link className="cta" to="/log" title="Çalışmayı Log sayfasına kaydet">
              Log&apos;a yaz
            </Link>
            <Link className="cta cta--ghost" to="/tekrar" title="Vadesi gelen tekrar listesi">
              Tekrar kuyruğu
            </Link>
            <Link className="cta cta--ghost" to="/harita" title="Müfredat haritası">
              Konu haritası
            </Link>
            <Link className="map-affordance" to="/harita" title="Müfredat haritası">
              <MapGlyph />
              Harita
            </Link>
          </div>
        </section>

        <section className="plan-timeline" aria-label="Yaklaşan günler">
          <h2 className="plan-timeline__title">Önümüzdeki günler</h2>
          <p className="plan-timeline__note">
            Tahmini plan — bitmeyen görevler ertesi güne kayar; tempo: ~
            {round1(state.tempo.hoursCyber / 7)} sa/gün siber · ~
            {round1(state.tempo.hoursLang / 7)} sa/gün dil.
          </p>
          <div className="plan-timeline__today">
            <ScheduleDayCard day={schedule.days[0]} />
          </div>
          {buHafta.length > 0 && (
            <>
              <h3 className="plan-timeline__section">Bu hafta</h3>
              <div className="plan-timeline__grid">
                {buHafta.map((day) => (
                  <ScheduleDayCard key={day.dateIso} day={day} />
                ))}
              </div>
            </>
          )}
          {gelecekHafta.length > 0 && (
            <>
              <h3 className="plan-timeline__section">Gelecek hafta</h3>
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
            label="Hazırlık"
            display={String(round1(d.live.R))}
            ratio={rRatio}
            tone="accent"
            title="Hazırlık (R): Almanya junior'a ne kadar yakınsın (0–100)"
          />
          <GaugeRing
            label="Güven payı"
            display={gmDisplay}
            ratio={gmRatio}
            tone={d.gmMin < 14 ? "warn" : "ok"}
            title="Güven payı (GM): bir kapı becerisinin unutulmadan önceki gün marjı; — = henüz ölçülmedi"
          />
          <GaugeRing
            label="Yorgunluk"
            display={String(d.pmc.tsb)}
            ratio={tsbNorm}
            tone={tsbTone}
            title="Yorgunluk (TSB): son günlerin yükü; yüksekse dinlen (form = CTL − ATL)"
          />
        </div>

        <details className="metric-legend">
          <summary className="metric-legend__summary">Ne anlama geliyor?</summary>
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
