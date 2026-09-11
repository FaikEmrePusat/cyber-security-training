import { useMemo, useState } from "react";
import type { BugunGorev, JourneySnapshot } from "../useRollingSchedule";
import { buildMentorDayBriefing, type MentorBriefingContext } from "../data/mentorBriefing";

export function MentorBriefingPanel({
  tasks,
  context,
}: {
  tasks: BugunGorev[];
  context: MentorBriefingContext & { journey?: JourneySnapshot };
}) {
  const text = useMemo(() => buildMentorDayBriefing(tasks, context), [tasks, context]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const empty = tasks.length === 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy — open the preview and select the text.");
    }
  };

  const status =
    error ?? (copied ? "Copied. Paste into your mentor chat, then return here to Record work." : null);

  return (
    <section className="mentor-brief" aria-label="Mentor day briefing">
      <div className="mentor-brief__head">
        <div>
          <h3 className="mentor-brief__title">Send today to your mentor</h3>
          <p className="mentor-brief__lead">
            Paste into your study chat. The text sets Teacher / mentor mode: light level-check → teach &amp; Study
            steps → practice → optional check — guided study, not examiner-first. After the session, come back to{" "}
            <strong>Record work</strong>.
          </p>
        </div>
        <button
          type="button"
          className="cta"
          onClick={copy}
          disabled={empty}
          aria-describedby={empty ? "mentor-brief-empty" : undefined}
        >
          {copied ? "Copied" : "Copy day for mentor"}
        </button>
      </div>
      {empty && (
        <p id="mentor-brief-empty" className="mentor-brief__empty">
          No open tasks today — nothing to copy yet.
        </p>
      )}
      <div className="mentor-brief__status" role="status" aria-live="polite">
        {status}
      </div>
      <details className="mentor-brief__preview">
        <summary>Preview text ({text.length.toLocaleString()} characters)</summary>
        <pre className="mentor-brief__pre">{text}</pre>
      </details>
    </section>
  );
}
