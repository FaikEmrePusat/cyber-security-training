import { useMemo, useState } from "react";
import type { BugunGorev } from "../useRollingSchedule";
import type { ScheduleTaskRef, SessionFormData } from "../model";
import {
  LOG_TAGS,
  buildDayLogTemplate,
  dayLogChatPrompt,
  entryToForm,
  matchLogEntry,
  parseDayLogJson,
} from "../data/dayLog";

export function DayLogJsonPanel({
  tasks,
  onImport,
}: {
  tasks: BugunGorev[];
  onImport: (items: Array<{ task: ScheduleTaskRef; form: SessionFormData }>, unmatched: number) => void;
}) {
  const template = useMemo(() => buildDayLogTemplate(tasks), [tasks]);
  const prompt = useMemo(() => dayLogChatPrompt(template), [template]);
  const [paste, setPaste] = useState("");
  const [copied, setCopied] = useState<"prompt" | "json" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copy = async (kind: "prompt" | "json", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Could not copy — select the text manually.");
    }
  };

  const toRef = (g: BugunGorev): ScheduleTaskRef => ({
    id: g.id,
    kind: g.kind,
    topicId: g.topicId,
    retrievalId: g.retrievalId,
    roiId: g.roiId,
    baslik: g.baslik,
    alan: g.alan,
  });

  return (
    <section className="day-log" aria-label="Day log JSON">
      <h3 className="day-log__title">Day log (JSON)</h3>
      <p className="day-log__lead">
        Copy the prompt into ChatGPT after you finish. Paste the JSON it returns. Tags you can use:{" "}
        {LOG_TAGS.map((t) => t.id).join(", ")}.
      </p>
      <div className="day-log__chips" aria-label="Allowed tags">
        {LOG_TAGS.map((t) => (
          <span key={t.id} className="day-log__chip">
            {t.label}
          </span>
        ))}
      </div>
      <div className="day-log__actions">
        <button type="button" className="cta" onClick={() => copy("prompt", prompt)}>
          {copied === "prompt" ? "Copied prompt" : "Copy ChatGPT prompt"}
        </button>
        <button type="button" className="cta cta--ghost" onClick={() => copy("json", JSON.stringify(template, null, 2))}>
          {copied === "json" ? "Copied JSON" : "Copy empty JSON"}
        </button>
      </div>
      <label className="return-work__label" htmlFor="day-log-paste">
        Paste ChatGPT JSON
      </label>
      <textarea
        id="day-log-paste"
        className="day-log__paste"
        rows={8}
        value={paste}
        onChange={(e) => {
          setPaste(e.target.value);
          setError(null);
        }}
        placeholder='{"date":"...","entries":[{ "topic": "...", "tags": ["linux"], "summary": "..." }]}'
      />
      {error && <p className="day-log__error">{error}</p>}
      <button
        type="button"
        className="cta"
        disabled={!paste.trim()}
        onClick={() => {
          const parsed = parseDayLogJson(paste);
          if (!parsed.ok) {
            setError(parsed.error);
            return;
          }
          const items: Array<{ task: ScheduleTaskRef; form: SessionFormData }> = [];
          let unmatched = 0;
          const used = new Set<string>();
          for (const entry of parsed.log.entries) {
            const available = tasks.filter((t) => !used.has(t.id));
            const task = matchLogEntry(entry, available);
            if (!task) {
              unmatched += 1;
              continue;
            }
            used.add(task.id);
            items.push({ task: toRef(task), form: entryToForm(entry, task) });
          }
          if (items.length === 0) {
            setError("No topics matched today’s plan. Keep the same topic titles.");
            return;
          }
          onImport(items, unmatched);
          setPaste("");
        }}
      >
        Import JSON log
      </button>
    </section>
  );
}
