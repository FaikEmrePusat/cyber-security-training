import { useEffect, useMemo } from "react";
import { useDurum } from "../store";
import { useCurriculumStatuses } from "../useCurriculumStatuses";
import { useRollingSchedule } from "../useRollingSchedule";

const USTA_BRIDGE_TYPE = "usta-ledger-bridge-v1";

/**
 * Tiny page opened by Usta in a popup. Posts today’s visible tasks to window.opener, then closes.
 * Hash route: /#/usta-bridge
 */
export function UstaBridgePage() {
  const { state } = useDurum();
  const queueKeys = useMemo(
    () => new Set(state.retrieval.map((r) => r.topic.trim().toLowerCase())),
    [state.retrieval],
  );
  const { getStatus } = useCurriculumStatuses(queueKeys);
  const schedule = useRollingSchedule(getStatus);

  const payload = useMemo(() => {
    const tasks = schedule.bugunGorevler.map((g) => ({
      id: g.id,
      title: g.baslik,
      kind: g.kind,
      minutes: Math.max(5, Math.round(g.saat * 60)),
    }));
    // Local calendar day (en-CA → YYYY-MM-DD); toISOString would be UTC and wrong after local midnight.
    const dateKey = new Date().toLocaleDateString("en-CA");
    return {
      type: USTA_BRIDGE_TYPE,
      dateKey,
      updatedAt: new Date().toISOString(),
      tasks,
    };
  }, [schedule.bugunGorevler]);

  useEffect(() => {
    const opener = window.opener as Window | null;
    if (!opener || opener.closed) return;
    try {
      opener.postMessage(payload, "*");
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => {
      try {
        window.close();
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [payload]);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "1.5rem", maxWidth: "28rem" }}>
      <h1 style={{ fontSize: "1.25rem" }}>Usta bridge</h1>
      <p style={{ color: "#444" }}>
        Sending {payload.tasks.length} Today task(s) to Usta… You can close this tab if it stays open.
      </p>
      <ul>
        {payload.tasks.map((t) => (
          <li key={t.id}>
            [{t.kind}] {t.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
