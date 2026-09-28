import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "../components/Section";
import {
  deleteSelfCheckTopic,
  listSelfCheckLibrary,
  type SelfCheckLibraryEntry,
} from "../lib/selfCheckStore";

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function QaList({ entry }: { entry: SelfCheckLibraryEntry }) {
  const rows: { outcome: string; checked: boolean; note: string }[] = [];
  for (const outcome of entry.outcomes) {
    const item = entry.items[outcome];
    if (!item?.note?.trim() && !item?.checked) continue;
    rows.push({
      outcome,
      checked: Boolean(item?.checked),
      note: item?.note?.trim() ?? "",
    });
  }
  for (const [outcome, item] of Object.entries(entry.items)) {
    if (entry.outcomes.includes(outcome)) continue;
    if (!item.note.trim() && !item.checked) continue;
    rows.push({
      outcome,
      checked: item.checked,
      note: item.note.trim(),
    });
  }
  if (rows.length === 0) {
    return <p className="self-check-lib__a is-empty">No answers stored for this topic yet.</p>;
  }
  return (
    <ul className="self-check-lib__qa">
      {rows.map((row) => (
        <li key={row.outcome}>
          <p className="self-check-lib__q">
            {row.checked ? <span className="self-check-lib__tick">✓ </span> : null}
            {row.outcome}
          </p>
          {row.note ? (
            <p className="self-check-lib__a">{row.note}</p>
          ) : (
            <p className="self-check-lib__a is-empty">Checked — no written note yet.</p>
          )}
        </li>
      ))}
    </ul>
  );
}

export function SelfCheckNotesPage() {
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);
  const entries = useMemo(() => listSelfCheckLibrary(), [tick]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((e) => {
      if (e.topic.toLowerCase().includes(needle)) return true;
      return e.outcomes.some((o) => {
        if (o.toLowerCase().includes(needle)) return true;
        const note = e.items[o]?.note ?? "";
        return note.toLowerCase().includes(needle);
      });
    });
  }, [entries, q]);

  const onDelete = (e: SelfCheckLibraryEntry) => {
    const ok = window.confirm(
      `Delete all self-check ticks and notes for “${e.topic}”? This cannot be undone.`,
    );
    if (!ok) return;
    deleteSelfCheckTopic(e.topic);
    setTick((n) => n + 1);
  };

  return (
    <div className="page self-check-lib">
      <Section
        as="h1"
        title="Self-check notes"
        lead="Answers you write under Today’s Self-check stay on this device and count as kayit (record) evidence on the matching skill. Search and reopen them here anytime."
      >
        <p className="section__lead section__lead--short">
          Back to <Link to="/">Today</Link>.
        </p>

        <label className="self-check-lib__search">
          Search topics, questions, or notes
          <input
            type="search"
            value={q}
            onChange={(ev) => setQ(ev.target.value)}
            placeholder="e.g. subnet, SIEM, German…"
            autoComplete="off"
          />
        </label>

        {filtered.length === 0 ? (
          <p className="self-check-lib__a is-empty">
            {entries.length === 0
              ? "No notes yet. Open a study plan on Today, answer a Self-check question, and it will appear here."
              : "No matches for that search."}
          </p>
        ) : (
          <ul className="self-check-lib__list">
            {filtered.map((entry) => (
              <li key={entry.storageKey} className="self-check-lib__card">
                <div className="self-check-lib__card-head">
                  <h2>{entry.topic}</h2>
                  <p className="self-check-lib__meta">
                    {entry.noteCount} note{entry.noteCount === 1 ? "" : "s"} · {entry.checkedCount}{" "}
                    checked · updated {formatWhen(entry.updatedAt)}
                  </p>
                </div>
                <QaList entry={entry} />
                <button type="button" className="cta cta--ghost" onClick={() => onDelete(entry)}>
                  Delete this topic’s notes
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
