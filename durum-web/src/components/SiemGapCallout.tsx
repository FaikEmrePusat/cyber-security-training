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
      aria-label="SIEM kariyer boşluğu"
    >
      <span className="siem-gap__swatch" aria-hidden />
      <div className="siem-gap__body">
        <p className="siem-gap__eyebrow">Gate B · EDR sonrası</p>
        <p className="siem-gap__title">
          Sonraki kurs bloğu: <strong>SIEM</strong>
        </p>
        <p className="siem-gap__meta" title="Yaklaşan konular tekrar kuyruğuna otomatik dökülmez">
          {claimed}/{need} · yaklaşan kilitli (tekrar kuyruğuna dökülmez)
        </p>
      </div>
      <Link className="siem-gap__link" to="/harita#yaklasan">
        Yaklaşan
      </Link>
    </aside>
  );
}
