import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SEED_HISTORY } from "../model/seed";
import { useDurum } from "../store";
import { useCurriculumStatuses } from "../useCurriculumStatuses";
import { useRollingSchedule } from "../useRollingSchedule";

const USTA_BRIDGE_TYPE = "usta-ledger-bridge-v1";

/** Usta runs on localhost (Vite, Capacitor, Tauri) or on the same Pages host as Ledger. */
function allowedUstaOrigin(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.origin === "null" && !/^(capacitor|tauri):/.test(u.protocol)) return null;
    const origin = u.origin !== "null" ? u.origin : `${u.protocol}//${u.host}`;
    if (origin === window.location.origin) return origin;
    if (["localhost", "127.0.0.1", "tauri.localhost"].includes(u.hostname)) return origin;
    if (u.hostname === "faikemrepusat.github.io") return origin;
    return null;
  } catch {
    return null;
  }
}

/**
 * Tiny page Usta opens in a popup or a hidden iframe. Posts today's visible tasks to the
 * requesting Usta origin (`?origin=`), then closes when it is a popup.
 * Hash route: /#/usta-bridge?origin=http://localhost:5174
 */
export function UstaBridgePage() {
  const { state } = useDurum();
  const { search } = useLocation();
  const target = useMemo(
    () => allowedUstaOrigin(new URLSearchParams(search).get("origin")),
    [search],
  );
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
      /** False on a browser that never logged a Ledger session (e.g. phone); Usta keeps its copy. */
      hasData: state.history.length > SEED_HISTORY.length,
      tasks,
    };
  }, [schedule.bugunGorevler, state.history.length]);

  useEffect(() => {
    if (!target) return;
    const embedded = window.parent !== window;
    const peer = embedded ? window.parent : (window.opener as Window | null);
    if (!peer || peer.closed) return;
    try {
      peer.postMessage(payload, target);
    } catch {
      /* ignore */
    }
    if (embedded) return;
    const t = window.setTimeout(() => {
      try {
        window.close();
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [payload, target]);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "1.5rem", maxWidth: "28rem" }}>
      <h1 style={{ fontSize: "1.25rem" }}>Usta bridge</h1>
      <p style={{ color: "#444" }}>
        {target
          ? `Sending ${payload.tasks.length} Today task(s) to Usta… You can close this tab if it stays open.`
          : "No trusted Usta origin in the link, so nothing was sent. Open this page from Usta Settings."}
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
