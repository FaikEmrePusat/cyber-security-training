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
    flash("Tam yedek dosyası indirildi (.json)");
  };

  const handleCopyFullBackup = async () => {
    const jsonStr = exportFullBackup();
    try {
      await navigator.clipboard.writeText(jsonStr);
      flash("Tam yedek panoya kopyalandı");
    } catch {
      flash("Kopyalanamadı — dosya olarak indir");
    }
  };

  const handleRestoreBackup = () => {
    if (!backupPaste.trim()) {
      flash("Lütfen yedek JSON metnini yapıştırın");
      return;
    }
    const ok = importFullBackup(backupPaste.trim());
    if (ok) {
      setBackupPaste("");
      flash("Tüm veriler başarıyla geri yüklendi!");
    } else {
      flash("Geçersiz yedek formatı!");
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
      not: `model ${MODEL.surum} · Σw=${round1(d.sumW)} · çürüme ${round1(d.curumeKaybi)} R`,
    });
    flash("Haftalık snapshot alındı");
  };

  const exportPending = async () => {
    const text = state.pending.join("\n");
    if (!text) {
      flash("Bekleyen satır yok");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      flash("JSONL panoya kopyalandı — Ilerleme-Log.jsonl'a yapıştır");
    } catch {
      flash("Kopyalanamadı — aşağıdaki metni elle kopyala");
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
      <Section as="h1" title="Log" lead="~60 sn ritüel: oturum yaz → tekrar işaretle → haftada bir snapshot. Ölçüm log'suz görünmez.">
        <h2 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.75rem", fontSize: "1.15rem" }}>
          Oturum ekle
        </h2>
        <SessionLogForm
          initial={defaultManualForm(state.tempo.quality)}
          skills={state.skills}
          onSubmit={(form) => {
            appendSessionFromForm(form);
            flash("Oturum kaydedildi");
          }}
        />
        <div className="actions" style={{ marginTop: "0.75rem" }}>
          <button type="button" className="cta cta--ghost" onClick={takeSnapshot}>
            Haftalık snapshot
          </button>
        </div>
      </Section>

      <Section title="Dışa aktar" lead="Bekleyen satırları Ilerleme-Log.jsonl dosyasına yapıştır (append-only).">
        <p className="note">Bekleyen: {state.pending.length} satır · geçmiş: {state.history.length}</p>
        <div className="actions">
          <button type="button" className="cta" onClick={exportPending}>
            Panoya kopyala
          </button>
          <button type="button" className="cta cta--ghost" onClick={downloadPending}>
            JSONL indir
          </button>
          <button type="button" className="cta cta--ghost" onClick={() => { clearPending(); flash("Bekleyen temizlendi"); }}>
            Bekleyeni temizle
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

      <Section title="Tam Veri Yedekleme & Cihazlar Arası Aktarım" lead="Telefon, tablet veya başka bir tarayıcıya geçerken tüm ilerlemenizi (beceriler, loglar, tekrarlar, harita durumları) tek tıkla aktarın.">
        <div className="actions" style={{ marginBottom: "1rem" }}>
          <button type="button" className="cta" onClick={handleDownloadFullBackup}>
            Tüm Veriyi İndir (.json)
          </button>
          <button type="button" className="cta cta--ghost" onClick={handleCopyFullBackup}>
            Yedeği Panoya Kopyala
          </button>
        </div>
        <div className="field">
          <label htmlFor="log-backup-json">Yedekten Geri Yükle (JSON Yapıştır)</label>
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
          Yedeği Sisteme Yükle ve Uygula
        </button>
      </Section>

      <Section title="İçe aktar (Yalnızca JSONL Log Satırları)" lead="JSONL yapıştır — satırlar geçmişe eklenir.">
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
            flash(`${n} satır eklendi`);
          }}
        >
          Yapıştırılanı içe aktar
        </button>
      </Section>

      <Section title="Son kayıtlar">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>Tür</th>
                <th>Özet</th>
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

      <Section title="Sıfırla">
        {!confirmReset ? (
          <button type="button" className="cta cta--ghost" onClick={() => setConfirmReset(true)}>
            Seed'e dön
          </button>
        ) : (
          <div className="actions">
            <button
              type="button"
              className="cta"
              onClick={() => {
                resetSeed();
                setConfirmReset(false);
                flash("Diagnostic seed yüklendi");
              }}
            >
              Evet, sıfırla
            </button>
            <button type="button" className="cta cta--ghost" onClick={() => setConfirmReset(false)}>
              Vazgeç
            </button>
          </div>
        )}
      </Section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
