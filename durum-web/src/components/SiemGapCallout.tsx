import { Link } from "react-router-dom";
import { MODEL } from "../model";
import { useDurum } from "../store";

/** Glanceable Gate B / SIEM career signal — does not unlock upcoming into FSRS. */
export function SiemGapCallout({ compact }: { compact?: boolean }) {
  const { state } = useDurum();
  const siem = state.skills.find((s) => s.id === "siem");
  const claimed = siem?.claimed ?? 0;
  const need = MODEL.kapi.B.siem;
  if (claimed >= need) return null;

  return (
    <aside
      className={`siem-gap${compact ? " siem-gap--compact" : ""}`}
      aria-label="SIEM career gap"
    >
      <span className="siem-gap__swatch" aria-hidden />
      <div className="siem-gap__body">
        <p className="siem-gap__eyebrow">Gate B · After EDR</p>
        <p className="siem-gap__title">
          Next course block: <strong>SIEM</strong>
        </p>
        <p className="siem-gap__meta" title="Upcoming topics are not auto-dumped into the review queue">
          {claimed}/{need} · upcoming locked (not dumped into review queue)
        </p>
      </div>
      <Link className="siem-gap__link" to="/harita#yaklasan">
        Upcoming
      </Link>
    </aside>
  );
}
