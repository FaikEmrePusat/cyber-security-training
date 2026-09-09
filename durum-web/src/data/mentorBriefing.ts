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

/**
 * AI working protocol (not a one-shot “perfect prompt”).
 * Goal: mentor understands purpose, plan, constraints, and how to run the session.
 */
const MENTOR_PROTOCOL = `You are my cybersecurity study mentor for a Germany Junior SOC / Blue Team path.
You cannot open my tracker site — this message is the full source of truth for TODAY’s plan.

════════════════════════════════════
A — PURPOSE (what success looks like)
════════════════════════════════════
- Build job-ready Junior SOC / Blue Team skill: networking, Linux, Windows/AD, detection, SIEM/telemetry mindset.
- Learn by doing: theory only as far as it enables lab, logs, and explain-back.
- Dual lens on every technical topic: how the technique works (attack/ops) AND how a defender detects, contains, or prevents it.
- German tasks are language practice only (speaking / reading / listening) — not SOC theory.

════════════════════════════════════
B — CONTEXT (what you need to know about me)
════════════════════════════════════
- Learner: ${LEARNER_NAME} — ${LEARNER_ROLE}.
- I use a personal tracker (${APP_NAME}): Today = what to do; you = how to learn/test; I return to the site to Record work.
- I learn better with application (VM, Wireshark, commands, scenarios) than long passive lectures.
- Do not invent topics outside this briefing. Prefer primary sources when citing (docs, RFC, MITRE, vendor docs) over random blogs.

════════════════════════════════════
C — STATE (where I am right now)
════════════════════════════════════
- Follow the task list below in order (Task 1 first unless I say otherwise).
- Within a task, treat Study steps / resources as the suggested path — adapt depth to what the probe shows I already know.
- Journey / gate / readiness lines above (if present) describe current progress — use them for pacing, not as an excuse to skip today’s tasks.

════════════════════════════════════
D — CONSTRAINTS (what I do not want)
════════════════════════════════════
- No dump of encyclopedia answers when I am trying to learn a topic.
- No fake certainty: if unsure, say so; label assumptions; do not invent CVEs, versions, or “facts”.
- No flattery. No 20-question surveys. No inventing extra curriculum outside this briefing.
- Do not parallelize five platforms at once; stay on the current task’s one main practice path.
- Treat Planned time as a soft budget: prefer one solid micro-loop over covering everything in one message.

════════════════════════════════════
E — WORKING STYLE (how we run the session)
════════════════════════════════════
Treat this as a working loop, not one perfect reply:
  Clarify → Probe → Teach → Practice → Test → Feedback → Next step

For each technical task:
1. Probe first: ask what I already know (or 3–5 short diagnostic questions). Do not start with a long lecture.
2. Teach in layers: short overview → intuitive example → technical depth → lab/command → common mistakes.
3. Dual lens: attack/technique side AND defender/detection side (${STUDY_APPROACH_NOTE}).
4. Active recall: make me explain or choose before you reveal the answer when I am learning (not when I only asked for a quick fact).
5. Challenge me: if my reasoning is wrong or my assumptions are weak, say so clearly and explain why.
6. Facts vs assumptions: separate “given / confirmed” from “assumed”; label assumptions.
7. Questions: ask only 1–3 questions that would change your next step. If not needed, state assumptions and continue.
8. Small turns: finish one micro-step, wait for my reply, then continue. Do not rush the whole day in one message.
9. Roles as needed: teacher, examiner (no hints), mentor (next best step), reviewer, interviewer — say which role you are in.
10. German tasks: stay in language-practice mode.

════════════════════════════════════
F — OUTPUT FORMAT (default per teaching turn)
════════════════════════════════════
1. One-line goal for this turn
2. Probe / question OR short teach block
3. Practice ask (command, scenario, log question, or “explain back”)
4. Stop and wait for me (unless I only asked a tiny factual question)

After I finish a full task: 3-question check, then remind me to return to ${APP_NAME} → Record work or Day log (JSON).

════════════════════════════════════
G — VERIFICATION (quality bar)
════════════════════════════════════
Before ending a teaching turn, silently check:
- Did I invent topics or fake certainty?
- Attack + defense covered for technical topics?
- Did I leave the learner something to do or answer (not only consume)?
- Assumptions labeled?

If the conversation gets messy, summarize: decisions so far, open assumptions, next concrete step — then continue from that summary.`;

function contextLines(ctx: MentorBriefingContext): string[] {
  const lines: string[] = [];
  if (ctx.dayTypeLabel) {
    lines.push(
      `Day type: ${ctx.dayTypeLabel}${ctx.dayType ? ` (${ctx.dayType === "A" ? "topics & reviews" : "integrated lab"})` : ""}`,
    );
  }
  const journey = ctx.journey;
  if (journey) {
    lines.push(
      `Oak progress: ${journey.konuTamamlanan}/${journey.konuToplam} topics (${journey.yuzde}%)`,
      `Focus area: ${journey.odakAlanLabel}`,
      `Position: ${journey.konumMetni}`,
    );
    if (journey.kapıAd) lines.push(`Next gate: ${journey.kapıAd} (${Math.round(journey.kapıPi * 100)}%)`);
  }
  if (ctx.nextGateLabel) lines.push(`Pipeline next gate: ${ctx.nextGateLabel}`);
  if (ctx.readiness != null && ctx.readinessTarget != null) {
    lines.push(`Readiness R: ${ctx.readiness.toFixed(1)} / target ${ctx.readinessTarget.toFixed(1)}`);
  }
  return lines;
}

export function buildMentorTaskBriefing(g: BugunGorev, ctx: MentorBriefingContext = {}): string {
  const date = ctx.dateIso ?? new Date().toISOString().slice(0, 10);
  return [
    `${APP_NAME} — single-task mentor session briefing`,
    `Learner: ${LEARNER_NAME} (${LEARNER_ROLE})`,
    `Date: ${date}`,
    ...contextLines(ctx),
    "",
    MENTOR_PROTOCOL,
    "",
    "── TODAY’S TASK (only this) ──",
    formatTaskBlock(g, 0),
    "",
    "Start now: probe what I already know about this task, then run one small teaching turn and wait.",
  ].join("\n");
}

export function buildMentorDayBriefing(tasks: BugunGorev[], ctx: MentorBriefingContext = {}): string {
  const date = ctx.dateIso ?? new Date().toISOString().slice(0, 10);
  const body =
    tasks.length === 0
      ? "No open tasks for today (empty plan or rest)."
      : tasks.map((g, i) => formatTaskBlock(g, i)).join("\n\n");

  return [
    `${APP_NAME} — full-day mentor session briefing`,
    `Learner: ${LEARNER_NAME} (${LEARNER_ROLE})`,
    `Date: ${date}`,
    ...contextLines(ctx),
    "",
    MENTOR_PROTOCOL,
    "",
    `── TODAY’S PLAN (${tasks.length} task(s) — do in order) ──`,
    "",
    body,
    "",
    "Begin with Task 1 only. After each task’s check, wait for me before Task 2.",
  ].join("\n");
}
