import type { CurriculumStatus } from "../data/oakCurriculum";
import { STATUS_LABEL } from "../data/oakCurriculum";

const ORDER: CurriculumStatus[] = ["ogreniyorum", "kuyrukta", "pekiştirildi", "sonra"];

export function StatusMark({ status }: { status: CurriculumStatus | "ogrenilmedi" }) {
  const cls =
    status === "pekiştirildi"
      ? "status-mark status-mark--pekistirildi"
      : `status-mark status-mark--${status}`;
  return <span className={cls} aria-hidden />;
}

export function StatusLegend({ compact }: { compact?: boolean }) {
  const items = compact ? ORDER : (["ogreniyorum", "kuyrukta", "pekiştirildi", "sonra", "ogrenilmedi"] as const);
  return (
    <ul className="legend-strip" aria-label="Status legend">
      {items.map((s) => (
        <li key={s}>
          <StatusMark status={s} />
          <span>{STATUS_LABEL[s]}</span>
        </li>
      ))}
      {!compact && (
        <>
          <li>
            <span className="diff-mark diff-mark--kolay" aria-hidden />
            <span>Easy</span>
          </li>
          <li>
            <span className="diff-mark diff-mark--orta" aria-hidden />
            <span>Medium</span>
          </li>
          <li>
            <span className="diff-mark diff-mark--zor" aria-hidden />
            <span>Hard</span>
          </li>
        </>
      )}
    </ul>
  );
}

export function AlanSwatch({ color, label }: { color: string; label?: string }) {
  return (
    <span className="alan-chip">
      <span className="alan-chip__swatch" style={{ background: color }} aria-hidden />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
