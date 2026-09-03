import { APP_NAME, LEARNER_NAME, LEARNER_ROLE, STUDY_APPROACH_NOTE } from "../model/brand";
import { stepLabel, type StudyGuide } from "./studyPlans";
import type { BugunGorev, JourneySnapshot } from "../useRollingSchedule";

export type MentorBriefingContext = {
  dateIso?: string;
  dayTypeLabel?: string;
  dayType?: string;
  journey?: JourneySnapshot;
  nextGateLabel?: string | null;
  readiness?: number;
  readinessTarget?: number;
};

function formatGuide(guide: StudyGuide): string {
  const lines: string[] = [];
  if (guide.actions.length) {
    lines.push("What you can do:");
    for (const a of guide.actions) lines.push(`  - ${a}`);
  }
  if (guide.steps.length) {
    lines.push("Study steps:");
    for (const s of guide.steps) {
      lines.push(`  ${stepLabel(s)}`);
      if (s.logHint) lines.push(`     Log hint: ${s.logHint}`);
    }
  }
  if (guide.resources.length) {
    lines.push("Resources:");
    for (const r of guide.resources) {
      lines.push(`  - ${r.label} (${r.type}): ${r.url}`);
    }
  }
  return lines.join("\n");
}

function formatTaskBlock(g: BugunGorev, index: number): string {
  const parts = [`### Task ${index + 1}: ${g.kindLabel}`, `Title: ${g.baslik}`];
  if (g.detay) parts.push(`Detail: ${g.detay}`);
  if (g.alan) parts.push(`Area: ${g.alan}`);
  if (g.sure) parts.push(`Planned time: ${g.sure}`);
  if (g.carried) parts.push("Status: Carried from a previous day");
  if (g.neden) parts.push(`Why today: ${g.neden}`);
  if (g.studyGuide) {
    parts.push("");
    parts.push(formatGuide(g.studyGuide));
  }
  return parts.join("\n");
}

const MENTOR_INSTRUCTIONS = `You are my cybersecurity mentor for a Germany Junior SOC / Blue Team path.

Rules:
1. You cannot open my tracker site — treat this message as the full source of truth for TODAY.
2. Teach one task at a time in the order listed. Start with Task 1 unless I say otherwise.
3. For each technical topic: explain how the attack/technique works AND how a defender detects, contains, or prevents it.
4. Prefer short checks: questions, mini-labs, commands I can run in a VM, and "what would you look for in logs?".
5. Keep German tasks in German-practice mode (speaking / reading / listening), not SOC theory.
6. When I finish a task, remind me to return to SOC Ledger and use Record work or Day log (JSON).
7. Do not invent topics that are not in this briefing. If something is unclear, ask me.`;

export function buildMentorTaskBriefing(g: BugunGorev, ctx: MentorBriefingContext = {}): string {
  const date = ctx.dateIso ?? new Date().toISOString().slice(0, 10);
  const header = [
    `${APP_NAME} — single-task briefing for a study mentor`,
    `Learner: ${LEARNER_NAME} (${LEARNER_ROLE})`,
    `Date: ${date}`,
    ctx.dayTypeLabel ? `Day type: ${ctx.dayTypeLabel}` : "",
    "",
    MENTOR_INSTRUCTIONS,
    "",
    "Approach:",
    STUDY_APPROACH_NOTE,
    "",
    formatTaskBlock(g, 0),
    "",
    "Start now with this task. Ask me what I already know, then teach and test.",
  ].filter((line) => line !== "");
  return header.join("\n");
}

export function buildMentorDayBriefing(tasks: BugunGorev[], ctx: MentorBriefingContext = {}): string {
  const date = ctx.dateIso ?? new Date().toISOString().slice(0, 10);
  const journey = ctx.journey;
  const meta: string[] = [
    `${APP_NAME} — today's full briefing for a study mentor`,
    `Learner: ${LEARNER_NAME} (${LEARNER_ROLE})`,
    `Date: ${date}`,
  ];
  if (ctx.dayTypeLabel) {
    meta.push(
      `Day type: ${ctx.dayTypeLabel}${ctx.dayType ? ` (${ctx.dayType === "A" ? "topics & reviews" : "integrated lab"})` : ""}`,
    );
  }
  if (journey) {
    meta.push(
      `Oak progress: ${journey.konuTamamlanan}/${journey.konuToplam} topics (${journey.yuzde}%)`,
      `Focus area: ${journey.odakAlanLabel}`,
      `Position: ${journey.konumMetni}`,
    );
    if (journey.kapıAd) meta.push(`Next gate: ${journey.kapıAd} (${Math.round(journey.kapıPi * 100)}%)`);
  }
  if (ctx.nextGateLabel) meta.push(`Pipeline next gate: ${ctx.nextGateLabel}`);
  if (ctx.readiness != null && ctx.readinessTarget != null) {
    meta.push(`Readiness R: ${ctx.readiness.toFixed(1)} / target ${ctx.readinessTarget.toFixed(1)}`);
  }

  const body =
    tasks.length === 0
      ? "No open tasks for today (empty plan or rest)."
      : tasks.map((g, i) => formatTaskBlock(g, i)).join("\n\n");

  return [
    ...meta,
    "",
    MENTOR_INSTRUCTIONS,
    "",
    "Approach:",
    STUDY_APPROACH_NOTE,
    "",
    `Today's task count: ${tasks.length}`,
    "",
    body,
    "",
    "Begin with Task 1. After each task, give me a 3-question check, then wait for me before moving on.",
  ].join("\n");
}
