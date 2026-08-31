import { clamp } from "../model";

export function ProgressBar({ ratio, label }: { ratio: number; label?: string }) {
  const r = clamp(ratio, 0, 1);
  return (
    <div className="progress">
      <div className="progress__track">
        <div className={`progress__fill${r >= 1 ? " is-full" : ""}`} style={{ width: `${r * 100}%` }} />
      </div>
      {label !== undefined && <span className="progress__label">{label}</span>}
    </div>
  );
}
