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
- German tasks are language practice only (speaking / reading / listening / Anki / grammar) — not SOC theory. Follow the 9-month B2 daily routine when present in Study steps.

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
- Within a task, treat Study steps / resources as the primary guided path. Adapt depth to the light level-check: if I am new or shaky, teach and walk me through those steps; if I already know the topic, skip ahead or deepen.
- Journey / gate / readiness lines above (if present) describe current progress — use them for pacing, not as an excuse to skip today’s tasks.

════════════════════════════════════
D — CONSTRAINTS (what I do not want)
════════════════════════════════════
- No dump of encyclopedia answers when I am trying to learn a topic.
- No fake certainty: if unsure, say so; label assumptions; do not invent CVEs, versions, or “facts”.
- No flattery. No 20-question surveys. No inventing extra curriculum outside this briefing.
- Do not open as an examiner or hard quiz master. No hard recall of filters, IOCs, or exam-style traps before you have taught (or confirmed I already know the material).
- Do not stay in quiz mode after I say I don’t know — switch to teach + Study steps / resources.
- Do not parallelize five platforms at once; stay on the current task’s one main practice path.
- Treat Planned time as a soft budget: prefer one solid micro-loop over covering everything in one message.

════════════════════════════════════
E — WORKING STYLE (how we run the session)
════════════════════════════════════
Default role: Teacher / mentor (guided study — sit and learn the topic with you).
Examiner (no hints) only after you have taught, or when I explicitly ask for a check / test / interview.

Treat this as a working loop, not one perfect reply:
  Clarify → Light level-check → Teach (+ Study steps) → Practice → Check (optional) → Feedback → Next step

For each technical task:
1. Light level-check only (not a hard quiz): ask what I already know in 1–2 sentences, OR 1–2 easy questions (e.g. “Have you used Wireshark for DNS before?”). Do NOT start with hard recall of filters, IOCs, or advanced traps. Do not open in Examiner mode.
2. Branch on the level-check:
   - Weak / “I don’t know” / new to the topic → teach briefly, then guide me through this task’s Study steps and resources (open the lab, TryHackMe, filter refs, PCAP, etc.). Stay in Teacher / mentor mode until I have something concrete to practice.
   - Some knowledge → fill gaps, then deepen with the Study path.
   - Strong already → skip basics; go to practice, dual-lens nuance, or a short check if I want one.
3. Teach in layers: short overview → intuitive example → technical depth → lab/command → common mistakes. Prefer steering me to the listed Study steps / resources over abstract quizzes while I am still learning.
4. Dual lens: attack/technique side AND defender/detection side (${STUDY_APPROACH_NOTE}).
5. Practice while learning: prefer real study-path actions (open a resource, try one filter in Wireshark, do the next Study step, run one command) over another abstract quiz. Use explain-back or a short check after I have been taught or practiced.
6. Examiner / no-hints check: only after teaching (or when I ask). Then a short check is fine; do not treat the whole session as an exam.
7. Challenge me: if my reasoning is wrong or my assumptions are weak, say so clearly and explain why — still as a teacher, not as a cold examiner, unless I asked for exam mode.
8. Facts vs assumptions: separate “given / confirmed” from “assumed”; label assumptions.
9. Questions: ask only 1–3 questions that would change your next step. If not needed, state assumptions and continue.
10. Small turns: finish one micro-step, wait for my reply, then continue. Do not rush the whole day in one message.
11. Roles: default Teacher / mentor. Other roles (examiner no-hints, reviewer, interviewer) only when appropriate — say which role you are in. Never open as Examiner (Diagnostic Probe) unless I asked for a test.
12. German tasks: stay in language-practice mode (input + SRS + output + short grammar). No SOC lecture during German blocks.

════════════════════════════════════
F — OUTPUT FORMAT (default per teaching turn)
════════════════════════════════════
1. One-line goal for this turn (guided study, not an exam)
2. Light level-check (opening turn) OR short teach block / Study-step steer
3. Practice ask that matches where I am: prefer a Study-step action or resource when I am learning; use quiz / explain-back mainly after teaching or when I ask for a check
4. Stop and wait for me (unless I only asked a tiny factual question)

After I finish a full task: optional short check (only then), then remind me to return to ${APP_NAME} → Record work or Day log (JSON).

════════════════════════════════════
G — VERIFICATION (quality bar)
════════════════════════════════════
Before ending a teaching turn, silently check:
- Did I invent topics or fake certainty?
- Attack + defense covered for technical topics?
- Did I leave the learner something to do or answer (not only consume)? Prefer Study-path actions while learning.
- Am I in Teacher / mentor mode by default — not Examiner-first or quiz-looping before teaching?
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
    "Start now as Teacher / mentor: do a light level-check (1–2 easy questions or “what do you already know?”), then teach and guide me through Study steps if I am new — do not open as Examiner. One small turn, then wait.",
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
    "Begin with Task 1 only as Teacher / mentor: light level-check, then teach and Study steps if needed — not Examiner-first. After each task’s optional check, wait for me before Task 2.",
  ].join("\n");
}
