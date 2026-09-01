import { useState } from "react";
import { MODEL, round1, round2 } from "../model";
import { Section } from "../components/Section";
import { SessionLogForm } from "../components/SessionLogForm";
import { defaultManualForm } from "../components/sessionLogFormUtils";
import { useDurum } from "../store";
import { useDerived } from "../useDerived";

export function LogPage() {
  const { state, appendSessionFromForm, appendLog, clearPending, resetSeed, importJsonl, exportFullBackup, importFullBackup } = useDurum();
  const d = useDerived();
  const [toast, setToast] = useState<string | null>(null);
  const [paste, setPaste] = useState("");
  const [backupPaste, setBackupPaste] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDownloadFullBackup = () => {
    const jsonStr = exportFullBackup();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `durum-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Full backup file downloaded (.json)");
  };

  const handleCopyFullBackup = async () => {
    const jsonStr = exportFullBackup();
    try {
      await navigator.clipboard.writeText(jsonStr);
      flash("Full backup copied to clipboard");
    } catch {
      flash("Could not copy — download as file instead");
    }
  };

  const handleRestoreBackup = () => {
    if (!backupPaste.trim()) {
      flash("Please paste backup JSON text");
      return;
    }
    const ok = importFullBackup(backupPaste.trim());
    if (ok) {
      setBackupPaste("");
      flash("All data restored successfully!");
    } else {
      flash("Invalid backup format!");
    }
  };

  const takeSnapshot = () => {
    appendLog({
      t: new Date().toISOString(),
      type: "snapshot",
      kaynak: "haftalik",
      hesap: {
        T: round2(d.live.T),
        P: round2(d.live.P),
        L: round2(d.live.L),
        C: round2(d.live.C),
        R: round2(d.live.R),
        R_beyan: round2(d.beyan.R),
        kanit_acigi: round2(d.kanitAcigi),
      },
      v_tahmin: round2(d.vTahmin),
      v_olculen: d.vOlculen ? round2(d.vOlculen.v) : null,
      kappa: d.kappa !== null ? round2(d.kappa) : null,
      not: `model ${MODEL.surum} · Σw=${round1(d.sumW)} · decay ${round1(d.curumeKaybi)} R`,
    });
    flash("Weekly snapshot taken");
  };

  const exportPending = async () => {
    const text = state.pending.join("\n");
    if (!text) {
      flash("No pending rows");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      flash("JSONL copied to clipboard — paste into Ilerleme-Log.jsonl");
    } catch {
      flash("Could not copy — copy the text below manually");
    }
  };

  const downloadPending = () => {
    const text = state.pending.join("\n") + (state.pending.length ? "\n" : "");
    const blob = new Blob([text], { type: "application/x-ndjson" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ilerleme-pending-${new Date().toISOString().slice(0, 10)}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <Section as="h1" title="Log" lead="~60 s ritual: log session → mark reviews → weekly snapshot. Progress is invisible without logs.">
        <h2 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.75rem", fontSize: "1.15rem" }}>
          Add session
        </h2>
        <SessionLogForm
          initial={defaultManualForm(state.tempo.quality)}
          skills={state.skills}
          onSubmit={(form) => {
            appendSessionFromForm(form);
            flash("Session saved");
          }}
        />
        <div className="actions" style={{ marginTop: "0.75rem" }}>
          <button type="button" className="cta cta--ghost" onClick={takeSnapshot}>
            Weekly snapshot
          </button>
        </div>
      </Section>

      <Section title="Export" lead="Paste pending rows into Ilerleme-Log.jsonl (append-only).">
        <p className="note">Pending: {state.pending.length} rows · history: {state.history.length}</p>
        <div className="actions">
          <button type="button" className="cta" onClick={exportPending}>
            Copy to clipboard
          </button>
          <button type="button" className="cta cta--ghost" onClick={downloadPending}>
            Download JSONL
          </button>
          <button type="button" className="cta cta--ghost" onClick={() => { clearPending(); flash("Pending cleared"); }}>
            Clear pending
          </button>
        </div>
        {state.pending.length > 0 && (
          <pre
            style={{
              marginTop: "1rem",
              padding: "0.85rem",
              background: "var(--paper-raised)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: "0.75rem",
              overflow: "auto",
              maxHeight: 160,
            }}
          >
            {state.pending.join("\n")}
          </pre>
        )}
      </Section>

      <Section title="Full Backup & Cross-Device Transfer" lead="Move all progress (skills, logs, reviews, map statuses) to phone, tablet, or another browser in one step.">
        <div className="actions" style={{ marginBottom: "1rem" }}>
          <button type="button" className="cta" onClick={handleDownloadFullBackup}>
            Download All Data (.json)
          </button>
          <button type="button" className="cta cta--ghost" onClick={handleCopyFullBackup}>
            Copy Backup to Clipboard
          </button>
        </div>
        <div className="field">
          <label htmlFor="log-backup-json">Restore from Backup (Paste JSON)</label>
          <textarea
            id="log-backup-json"
            value={backupPaste}
            onChange={(e) => setBackupPaste(e.target.value)}
            placeholder='{"version":"durum-v22","state":{...},"curriculum":{...}}'
          />
        </div>
        <button
          type="button"
          className="cta cta--ghost"
          onClick={handleRestoreBackup}
        >
          Load Backup and Apply
        </button>
      </Section>

      <Section title="Import (JSONL Log Rows Only)" lead="Paste JSONL — rows are appended to history.">
        <div className="field">
          <label htmlFor="log-jsonl">JSONL</label>
          <textarea
            id="log-jsonl"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder='{"t":"...","type":"session",...}'
          />
        </div>
        <button
          type="button"
          className="cta cta--ghost"
          onClick={() => {
            const n = importJsonl(paste);
            setPaste("");
            flash(`${n} rows added`);
          }}
        >
          Import pasted rows
        </button>
      </Section>

      <Section title="Recent records">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {[...state.history].reverse().slice(0, 20).map((r, i) => (
                <tr key={`${r.t}-${i}`}>
                  <td style={{ whiteSpace: "nowrap" }}>{r.t.slice(0, 16).replace("T", " ")}</td>
                  <td>{r.type}</td>
                  <td>
                    {r.not ?? r.alan ?? r.kaynak ?? r.konu ?? (r.hesap ? `R=${r.hesap.R}` : "—")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Reset">
        {!confirmReset ? (
          <button type="button" className="cta cta--ghost" onClick={() => setConfirmReset(true)}>
            Restore seed
          </button>
        ) : (
          <div className="actions">
            <button
              type="button"
              className="cta"
              onClick={() => {
                resetSeed();
                setConfirmReset(false);
                flash("Diagnostic seed loaded");
              }}
            >
              Yes, reset
            </button>
            <button type="button" className="cta cta--ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        )}
      </Section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
