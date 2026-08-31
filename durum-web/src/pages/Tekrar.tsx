import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MODEL,
  daysSince,
  nextStability,
  retrievability,
  round2,
  type Difficulty,
  type RetrievalItem,
} from "../model";
import { ROADMAP_SUGGESTIONS } from "../data/roadmapTopics";
import { Section } from "../components/Section";
import { useDurum } from "../store";
import { useDerived } from "../useDerived";

const DIFFS: Difficulty[] = ["kolay", "orta", "zor"];
const SKILL_IDS = new Set([
  "net",
  "linux",
  "win",
  "secfund",
  "crypto",
  "netsec",
  "siem",
  "def",
  "off",
  "py",
  "cloud",
  "port",
]);

function newId(): string {
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeItem(topic: string, alan: string, difficulty: Difficulty): RetrievalItem {
  return {
    id: newId(),
    topic: topic.trim(),
    alan,
    difficulty,
    n: 0,
    stability: MODEL.tekrar.s0,
    ef: MODEL.tekrar.ef0,
    lastIso: new Date().toISOString(),
  };
}

function parseBulkLine(
  line: string,
  defaultAlan: string,
): { topic: string; alan: string; difficulty: Difficulty } | null {
  const raw = line.trim();
  if (!raw || raw.startsWith("#")) return null;

  const parts = raw.split("|").map((p) => p.trim());
  if (parts.length >= 3) {
    const [alanRaw, diffRaw, ...rest] = parts;
    const topic = rest.join("|").trim();
    if (!topic) return null;
    const alan = SKILL_IDS.has(alanRaw) ? alanRaw : defaultAlan;
    const difficulty = DIFFS.includes(diffRaw as Difficulty) ? (diffRaw as Difficulty) : "orta";
    return { topic, alan, difficulty };
  }
  if (parts.length === 2) {
    const [a, b] = parts;
    if (SKILL_IDS.has(a) && b) return { topic: b, alan: a, difficulty: "orta" };
    return { topic: raw, alan: defaultAlan, difficulty: "orta" };
  }
  return { topic: raw, alan: defaultAlan, difficulty: "orta" };
}

export function TekrarPage() {
  const { state, setRetrieval, commitWithLog } = useDurum();
  const d = useDerived();

  const [topic, setTopic] = useState("");
  const [alan, setAlan] = useState("net");
  const [difficulty, setDifficulty] = useState<Difficulty>("orta");
  const [bulk, setBulk] = useState("");
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [showLater, setShowLater] = useState(false);

  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2200);
  };

  const existingTopics = useMemo(
    () => new Set(state.retrieval.map((r) => r.topic.toLowerCase())),
    [state.retrieval],
  );

  const suggestions = useMemo(
    () =>
      ROADMAP_SUGGESTIONS.filter((s) => {
        if (existingTopics.has(s.topic.toLowerCase())) return false;
        if (s.later && !showLater) return false;
        return true;
      }),
    [existingTopics, showLater],
  );

  const mark = (item: RetrievalItem, sonuc: "basarili" | "zorlandim" | "basarisiz") => {
    const next = nextStability(item, sonuc);
    const nowIso = new Date().toISOString();
    commitWithLog(
      (s) => ({
        ...s,
        retrieval: s.retrieval.map((r) =>
          r.id === item.id
            ? { ...r, stability: next.s, ef: next.ef, n: next.n, lastIso: nowIso }
            : r,
        ),
      }),
      {
        t: nowIso,
        type: "retrieval",
        alan: item.alan,
        konu: item.topic,
        sonuc,
        n_once: item.n,
        n_sonra: next.n,
        gecikme_gun: round2(daysSince(item.lastIso, d.nowMs)),
      },
    );
  };

  const addOne = () => {
    const t = topic.trim();
    if (!t) {
      flash("Konu boş olamaz");
      return;
    }
    if (existingTopics.has(t.toLowerCase())) {
      flash("Bu konu zaten kuyrukta");
      return;
    }
    setRetrieval((all) => all.concat([makeItem(t, alan, difficulty)]));
    setTopic("");
    flash("Konu eklendi");
  };

  const addBulk = () => {
    const lines = bulk.split(/\r?\n/);
    const items: RetrievalItem[] = [];
    const seen = new Set(existingTopics);
    for (const line of lines) {
      const parsed = parseBulkLine(line, "net");
      if (!parsed) continue;
      const key = parsed.topic.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(makeItem(parsed.topic, parsed.alan, parsed.difficulty));
    }
    if (!items.length) {
      flash("Eklenecek satır yok");
      return;
    }
    setRetrieval((all) => all.concat(items));
    setBulk("");
    flash(`${items.length} konu eklendi`);
  };

  const removeItem = (id: string) => {
    setRetrieval((all) => all.filter((r) => r.id !== id));
    flash("Silindi — Ctrl+Z ile geri al");
  };

  const addPickedSuggestions = () => {
    const ids = Object.keys(picked).filter((id) => picked[id]);
    if (!ids.length) {
      flash("Öneri seçilmedi");
      return;
    }
    const seen = new Set(existingTopics);
    const items: RetrievalItem[] = [];
    for (const id of ids) {
      const s = ROADMAP_SUGGESTIONS.find((x) => x.id === id);
      if (!s) continue;
      const key = s.topic.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(makeItem(s.topic, s.alan, s.difficulty));
    }
    if (!items.length) {
      flash("Hepsi zaten kuyrukta");
      return;
    }
    setRetrieval((all) => all.concat(items));
    setPicked({});
    flash(`${items.length} öneri eklendi`);
  };

  const skillName = (id: string) => state.skills.find((s) => s.id === id)?.kisa ?? id;

  const todayIds = useMemo(() => new Set(d.kuyruk.map((x) => x.item.id)), [d.kuyruk]);
  const laterOverdue = d.overdue.filter((x) => !todayIds.has(x.item.id));
  const notDue = state.retrieval.filter((item) => {
    const days = daysSince(item.lastIso, d.nowMs);
    return retrievability(days, item.stability) >= 0.85;
  });
  const laterCount = laterOverdue.length + notDue.length;

  const renderRow = (item: RetrievalItem, opts?: { showActions?: boolean }) => {
    const days = daysSince(item.lastIso, d.nowMs);
    const r = retrievability(days, item.stability);
    const due = r < 0.85;
    const showActions = opts?.showActions !== false;
    return (
      <tr key={item.id} style={{ background: due ? "rgba(138,90,43,0.08)" : undefined }}>
        <td>
          {item.topic}
          {due && (
            <span className="badge badge--warn" style={{ marginLeft: 6 }}>
              vade
            </span>
          )}
        </td>
        <td>{skillName(item.alan)}</td>
        <td>{item.difficulty}</td>
        <td title="R(t) — hatırlama olasılığı">{round2(r)}</td>
        <td title="S — kararlılık (gün)">{round2(item.stability)}</td>
        <td>
          {showActions ? (
            <div className="actions" style={{ margin: 0 }}>
              <button
                type="button"
                className="cta"
                style={{ minHeight: 40, padding: "0.4rem 0.7rem" }}
                onClick={() => mark(item, "basarili")}
              >
                Başarılı
              </button>
              <button
                type="button"
                className="cta cta--ghost"
                style={{ minHeight: 40, padding: "0.4rem 0.7rem" }}
                onClick={() => mark(item, "zorlandim")}
              >
                Zorlandım
              </button>
              <button
                type="button"
                className="cta cta--ghost"
                style={{ minHeight: 40, padding: "0.4rem 0.7rem" }}
                onClick={() => mark(item, "basarisiz")}
              >
                Başarısız
              </button>
            </div>
          ) : (
            <span className="note" style={{ margin: 0 }}>
              —
            </span>
          )}
        </td>
        <td>
          <button
            type="button"
            className="cta cta--ghost"
            style={{ minHeight: 40, padding: "0.4rem 0.7rem" }}
            onClick={() => removeItem(item.id)}
            title="Sil (Ctrl+Z ile geri al)"
          >
            Sil
          </button>
        </td>
      </tr>
    );
  };

  const tableHead = (
    <thead>
      <tr>
        <th>Konu</th>
        <th>Alan</th>
        <th>Z</th>
        <th title="R(t) — hatırlama">Hazır</th>
        <th title="S — kararlılık">S</th>
        <th>Sonuç</th>
        <th />
      </tr>
    </thead>
  );

  return (
    <div className="page">
      <Section
        as="h1"
        title="Tekrar"
        lead={`Bugün en fazla ${MODEL.tekrar.kuyrukTavani} madde. Vadesi gelenleri işaretle — motor arka planda çalışır.`}
      >
        <p className="note" style={{ marginTop: 0 }} title="FSRS — spaced repetition motoru">
          Tam müfredat (141+ yaklaşan) → <Link to="/harita">Harita</Link> — buraya dump etme.
        </p>
        {toast && <p className="note">{toast}</p>}

        {d.overdue.length === 0 ? (
          <p className="note">Vadesi geçmiş madde yok — iyi.</p>
        ) : (
          <p className="note">
            Vadesi geçmiş: <strong>{d.overdue.length}</strong> · bugün önerilen:{" "}
            <strong>{d.kuyruk.length}</strong>
            {laterOverdue.length > 0 ? ` · sonra: ${laterOverdue.length}` : ""}
          </p>
        )}

        <h2 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.75rem", fontSize: "1.15rem" }}>
          Bugün önerilen ({d.kuyruk.length})
        </h2>
        {d.kuyruk.length === 0 ? (
          <p className="note">Bugün için öncelikli vade yok.</p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              {tableHead}
              <tbody>{d.kuyruk.map((x) => renderRow(x.item))}</tbody>
            </table>
          </div>
        )}

        {laterCount > 0 && (
          <details className="roi-alts" style={{ marginTop: "1rem" }}>
            <summary className="roi-alts__summary">
              Daha sonra ({laterCount}
              {laterOverdue.length ? ` · ${laterOverdue.length} vade` : ""})
            </summary>
            <div className="table-wrap" style={{ marginTop: "0.75rem" }}>
              <table className="data">
                {tableHead}
                <tbody>
                  {laterOverdue.map((x) => renderRow(x.item))}
                  {notDue.map((item) => renderRow(item))}
                </tbody>
              </table>
            </div>
          </details>
        )}

        <h3 style={{ fontFamily: "var(--font-display)", margin: "1.5rem 0 0.75rem", fontSize: "1.05rem" }}>
          Konu ekle
        </h3>
        <div className="field-row">
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="tekrar-konu">Konu</label>
            <input
              id="tekrar-konu"
              value={topic}
              placeholder="örn. DNS query/response (Wireshark)"
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addOne();
                }
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="tekrar-alan">Alan</label>
            <select id="tekrar-alan" value={alan} onChange={(e) => setAlan(e.target.value)}>
              {state.skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tekrar-zorluk">Zorluk</label>
            <select
              id="tekrar-zorluk"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {DIFFS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="actions" style={{ marginTop: 0 }}>
          <button type="button" className="cta" onClick={addOne}>
            Konu ekle
          </button>
        </div>

        <h3 style={{ fontFamily: "var(--font-display)", margin: "1.5rem 0 0.5rem", fontSize: "1.05rem" }}>
          Toplu ekle
        </h3>
        <p className="note" style={{ marginTop: 0 }}>
          Satır başına bir konu. Biçim: <code>konu</code> veya <code>alan|zorluk|konu</code> (varsayılan: net · orta).
        </p>
        <div className="field">
          <label htmlFor="tekrar-bulk">Konu listesi</label>
          <textarea
            id="tekrar-bulk"
            value={bulk}
            rows={4}
            placeholder={"TCP 3-way handshake\nlinux|orta|chmod / sticky bit\ndef|zor|SOC triage zinciri"}
            onChange={(e) => setBulk(e.target.value)}
          />
        </div>
        <div className="actions" style={{ marginTop: 0 }}>
          <button type="button" className="cta cta--ghost" onClick={addBulk}>
            Toplu ekle
          </button>
        </div>
      </Section>

      <Section
        title="Önerilenlerden ekle"
        lead="Junior SOC odaklı seçki. Sadece öğrendiğin konuları ekle — tüm yol haritasını buraya doldurma."
      >
        <label className="note" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showLater}
            onChange={(e) => setShowLater(e.target.checked)}
          />
          Junior SOC sonrası konuları da göster
        </label>

        {suggestions.length === 0 ? (
          <p className="note">Gösterilecek öneri kalmadı (hepsi kuyrukta veya filtre kapalı).</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "0.45rem",
              marginTop: "0.75rem",
            }}
          >
            {suggestions.map((s) => (
              <label
                key={s.id}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  padding: "0.45rem 0.55rem",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  background: picked[s.id] ? "rgba(138,90,43,0.08)" : "var(--paper-raised)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!picked[s.id]}
                  onChange={(e) => setPicked((p) => ({ ...p, [s.id]: e.target.checked }))}
                  style={{ marginTop: 3, minHeight: 18 }}
                />
                <span>
                  <strong>{s.topic}</strong>
                  <span className="note" style={{ display: "block", margin: 0, fontSize: "0.75rem" }}>
                    {skillName(s.alan)} · {s.difficulty}
                    {s.later ? " · sonra" : ""}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="actions">
          <button type="button" className="cta" onClick={addPickedSuggestions}>
            Seçilenleri ekle
          </button>
        </div>
      </Section>
    </div>
  );
}
