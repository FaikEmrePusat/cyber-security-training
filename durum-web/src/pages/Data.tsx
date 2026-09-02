import { useState } from "react";
import { Section } from "../components/Section";
import { useDurum } from "../store";

export function DataPage() {
  const { resetSeed, exportFullBackup, importFullBackup } = useDurum();
  const [toast, setToast] = useState<string | null>(null);
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
    flash("Backup downloaded");
  };

  const handleCopyFullBackup = async () => {
    try {
      await navigator.clipboard.writeText(exportFullBackup());
      flash("Backup copied to clipboard");
    } catch {
      flash("Could not copy — download as file instead");
    }
  };

  const handleRestoreBackup = () => {
    if (!backupPaste.trim()) {
      flash("Paste backup JSON first");
      return;
    }
    const ok = importFullBackup(backupPaste.trim());
    if (ok) {
      setBackupPaste("");
      flash("Data restored");
    } else {
      flash("Invalid backup format");
    }
  };

  return (
    <div className="page">
      <Section
        as="h1"
        title="Data"
        lead="Backup and restore for this browser. Session diaries are not part of the tracker."
      >
        <div className="actions" style={{ marginBottom: "1rem" }}>
          <button type="button" className="cta" onClick={handleDownloadFullBackup}>
            Download backup (.json)
          </button>
          <button type="button" className="cta cta--ghost" onClick={handleCopyFullBackup}>
            Copy backup
          </button>
        </div>
        <div className="field">
          <label htmlFor="data-backup-json">Restore (paste JSON)</label>
          <textarea
            id="data-backup-json"
            value={backupPaste}
            onChange={(e) => setBackupPaste(e.target.value)}
            placeholder='{"version":"durum-v22","state":{...},"curriculum":{...}}'
          />
        </div>
        <button type="button" className="cta cta--ghost" onClick={handleRestoreBackup}>
          Load backup
        </button>
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
