import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  loadSelfCheck,
  saveSelfCheck,
  type SelfCheckDoc,
  selfCheckEvidenceRef,
  selfCheckHasNotes,
} from "../lib/selfCheckStore";
import { useDurum } from "../store";

export function StudyPlanSelfCheck({
  outcomes,
  topicKey,
  alan,
}: {
  outcomes: string[];
  topicKey: string;
  alan?: string;
}) {
  const { registerSelfCheckEvidence } = useDurum();
  const [doc, setDoc] = useState<SelfCheckDoc>(() => loadSelfCheck(topicKey, outcomes));
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outcomesKey = outcomes.join("\n");

  useEffect(() => {
    setDoc(loadSelfCheck(topicKey, outcomes));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- outcomesKey tracks content
  }, [topicKey, outcomesKey]);

  const persist = (next: SelfCheckDoc, registerEvidence: boolean) => {
    setDoc(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveSelfCheck(next);
      if (registerEvidence && selfCheckHasNotes(next)) {
        registerSelfCheckEvidence(topicKey, alan);
      }
    }, 280);
  };

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  const toggle = (outcome: string) => {
    const cur = doc.items[outcome] ?? { checked: false, note: "" };
    persist(
      {
        ...doc,
        topic: topicKey,
        outcomes,
        items: {
          ...doc.items,
          [outcome]: { ...cur, checked: !cur.checked },
        },
      },
      false,
    );
  };

  const setNote = (outcome: string, note: string) => {
    const cur = doc.items[outcome] ?? { checked: false, note: "" };
    persist(
      {
        ...doc,
        topic: topicKey,
        outcomes,
        items: {
          ...doc.items,
          [outcome]: { ...cur, note },
        },
      },
      true,
    );
  };

  const flush = () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    saveSelfCheck(doc);
    if (selfCheckHasNotes(doc)) {
      registerSelfCheckEvidence(topicKey, alan);
    }
  };

  return (
    <section className="study-plan__section study-plan__selfcheck">
      <h3 className="study-plan__heading">Self-check</h3>
      <p className="study-plan__selfcheck-note">
        Tick when you can do + explain each item. Written notes become <strong>record (kayit)</strong>{" "}
        evidence for this area and stay in{" "}
        <Link to="/self-check">Self-check notes</Link>. Public http(s) links still use Record → Evidence
        for Gate C.
      </p>
      <ul className="study-plan__checklist">
        {outcomes.map((o, i) => {
          const item = doc.items[o] ?? { checked: false, note: "" };
          const noteId = `selfcheck-note-${topicKey}-${i}`;
          return (
            <li key={`${i}-${o}`} className="study-plan__check-item">
              <label className="study-plan__check-label">
                <input
                  type="checkbox"
                  checked={Boolean(item.checked)}
                  onChange={() => toggle(o)}
                />
                <span>{o}</span>
              </label>
              <label className="study-plan__note-label" htmlFor={noteId}>
                Your answer / source notes
                <textarea
                  id={noteId}
                  rows={3}
                  value={item.note}
                  onChange={(e) => setNote(o, e.target.value)}
                  onBlur={flush}
                  placeholder="Explain in your words, paste a quote, link, or where you found it…"
                  autoComplete="off"
                />
              </label>
            </li>
          );
        })}
      </ul>
      <p className="study-plan__selfcheck-foot">
        <Link to="/self-check">Browse all self-check notes →</Link>
        {selfCheckHasNotes(doc) ? (
          <>
            {" "}
            · Evidence ref: <code>{selfCheckEvidenceRef(topicKey)}</code>
          </>
        ) : null}
      </p>
    </section>
  );
}
