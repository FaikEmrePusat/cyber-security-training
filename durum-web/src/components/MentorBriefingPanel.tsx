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

  return (
    <section className="mentor-brief" aria-label="Mentor day briefing">
      <div className="mentor-brief__head">
        <div>
          <h3 className="mentor-brief__title">Send today to your mentor</h3>
          <p className="mentor-brief__lead">
            Paste this into whatever study chat you use. It includes today’s topics and study plans so the
            mentor does not need this site.
          </p>
        </div>
        <button type="button" className="cta" onClick={copy} disabled={tasks.length === 0}>
          {copied ? "Copied" : "Copy day for mentor"}
        </button>
      </div>
      {error && <p className="mentor-brief__error">{error}</p>}
      <details className="mentor-brief__preview">
        <summary>Preview text ({text.length.toLocaleString()} characters)</summary>
        <pre className="mentor-brief__pre">{text}</pre>
      </details>
    </section>
  );
}
