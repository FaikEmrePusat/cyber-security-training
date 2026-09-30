import { MODEL, daysSince, retrievability, type RetrievalItem } from "../model";
import { buildStudyGuide } from "../data/studyPlans";

export type DueTone = "overdue" | "today" | "soon" | "ok";

export type DueInfo = {
  daysUntil: number;
  daysOverdue: number;
  due: boolean;
  label: string;
  tone: DueTone;
  nextDateLabel: string;
};

/** Days until R(t) falls below target; 0 if already due. */
export function daysUntilDue(item: RetrievalItem, fromMs: number): number {
  const elapsed = daysSince(item.lastIso, fromMs);
  if (retrievability(elapsed, item.stability) < MODEL.tekrar.rHedef) return 0;
  for (let d = elapsed + 1; d < 400; d++) {
    if (retrievability(d, item.stability) < MODEL.tekrar.rHedef) return d - elapsed;
  }
  return 14;
}

function daysOverdue(item: RetrievalItem, fromMs: number): number {
  const elapsed = daysSince(item.lastIso, fromMs);
  if (retrievability(elapsed, item.stability) >= MODEL.tekrar.rHedef) return 0;
  for (let d = 0; d <= elapsed; d++) {
    if (retrievability(d, item.stability) < MODEL.tekrar.rHedef) {
      return Math.max(0, elapsed - d);
    }
  }
  return elapsed;
}

function formatNextDate(item: RetrievalItem, fromMs: number, daysUntil: number): string {
  const last = Date.parse(item.lastIso);
  const base = Number.isFinite(last) ? last : fromMs;
  const dueMs = base + daysUntil * 86400000;
  return new Date(dueMs).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export function dueInfo(item: RetrievalItem, nowMs: number): DueInfo {
  const due = retrievability(daysSince(item.lastIso, nowMs), item.stability) < MODEL.tekrar.rHedef;
  const until = daysUntilDue(item, nowMs);
  const overdueAmt = daysOverdue(item, nowMs);
  const nextDateLabel = formatNextDate(item, nowMs, due ? 0 : until);

  if (due && overdueAmt >= 1) {
    const n = Math.floor(overdueAmt);
    return {
      daysUntil: 0,
      daysOverdue: overdueAmt,
      due: true,
      label: n <= 1 ? "Overdue" : `Overdue · ${n}d`,
      tone: "overdue",
      nextDateLabel: "now",
    };
  }
  if (due) {
    return {
      daysUntil: 0,
      daysOverdue: overdueAmt,
      due: true,
      label: "Due today",
      tone: "today",
      nextDateLabel: "today",
    };
  }
  if (until <= 1) {
    return {
      daysUntil: until,
      daysOverdue: 0,
      due: false,
      label: "Due tomorrow",
      tone: "soon",
      nextDateLabel,
    };
  }
  if (until <= 7) {
    return {
      daysUntil: until,
      daysOverdue: 0,
      due: false,
      label: `In ${Math.round(until)} days`,
      tone: "soon",
      nextDateLabel,
    };
  }
  return {
    daysUntil: until,
    daysOverdue: 0,
    due: false,
    label: `Next ${nextDateLabel}`,
    tone: "ok",
    nextDateLabel,
  };
}

/** Recall prompts from TOPIC_GUIDES outcomes, else short generic self-checks. */
export function recallPrompts(topic: string, alan: string): string[] {
  const guide = buildStudyGuide({ kind: "tekrar", baslik: topic, alan });
  if (guide.outcomes.length >= 2) return guide.outcomes.slice(0, 5);
  const t = topic.trim() || "this topic";
  return [
    `Explain ${t} from memory — what it is and why it matters.`,
    `What would you check or do first when practicing ${t}?`,
    `Name one common mistake or misconception about ${t}.`,
  ];
}

export type CurvePoint = { t: number; r: number };

/** Sample forgetting curve R(t) for a simple SVG. */
export function forgettingCurvePoints(
  stability: number,
  maxDays: number,
  samples = 64,
): CurvePoint[] {
  const s = Math.max(0.5, stability);
  const end = Math.max(maxDays, s * 1.5, 7);
  const pts: CurvePoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (end * i) / samples;
    pts.push({ t, r: retrievability(t, s) });
  }
  return pts;
}

/** Day index from last review when R first falls below the review target. */
export function dueDayIndex(item: RetrievalItem, fromMs: number): number {
  const elapsed = daysSince(item.lastIso, fromMs);
  const s = Math.max(0.5, item.stability);
  if (retrievability(elapsed, s) < MODEL.tekrar.rHedef) {
    for (let d = 0; d <= Math.ceil(elapsed) + 1; d++) {
      if (retrievability(d, s) < MODEL.tekrar.rHedef) return d;
    }
    return Math.max(0, elapsed);
  }
  return elapsed + daysUntilDue(item, fromMs);
}

/** Plain-language caption under the forgetting curve. */
export function curveCaption(retention: number, info: DueInfo): string {
  const pct = Math.round(retention * 100);
  if (info.tone === "overdue") {
    return `Review now · retention about ${pct}% (below target)`;
  }
  if (info.tone === "today") {
    return `Due today · retention about ${pct}% — time to reinforce`;
  }
  if (retention >= 0.95) {
    return `Next review: ${info.nextDateLabel} · retention still high`;
  }
  if (retention >= MODEL.tekrar.rHedef) {
    return `Next review: ${info.nextDateLabel} · retention about ${pct}% (above target)`;
  }
  return `Next review: ${info.nextDateLabel} · retention about ${pct}%`;
}

export const REVIEW_NOTE_OUTCOME = "Review recall (from Review page)";
