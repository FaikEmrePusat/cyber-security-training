/**
 * Dry-run ~1 month of learner use (not a wall-clock wait).
 * Simulates 5–6 study days/week, reinforcing one spine topic per day,
 * optional light Nessus lane, optional skip of FSRS reviews.
 *
 * Run: npx vite-node scripts/simulate-month.ts
 */
import { OAK_COVERED, OAK_COURSE_FOCUS, topicKey } from "../src/data/oakCurriculum";
import { sortByOakSpineOrder, spineModuleLabel } from "../src/data/oakSpineOrder";
import { buildStudyGuide } from "../src/data/studyPlans";
import type { CurriculumStatus } from "../src/data/oakCurriculum";

const STUDY_DAYS = 22; // ~5–6 days/week × 4 weeks
const statuses = new Map<string, CurriculumStatus>();
for (const t of OAK_COVERED) statuses.set(t.id, "ogreniyorum");

function openSpine() {
  const open = OAK_COVERED.filter((t) => statuses.get(t.id) !== "pekiştirildi");
  return sortByOakSpineOrder(open);
}

type DayRow = {
  day: number;
  week: number;
  spine: string;
  module: string;
  primaryPdf: string | null;
  thmPrimary: boolean;
  dualLens: boolean;
  classLane: string;
  flags: string[];
};

const rows: DayRow[] = [];
const flagsAll: string[] = [];

for (let d = 1; d <= STUDY_DAYS; d++) {
  const spineList = openSpine();
  const topic = spineList[0];
  if (!topic) break;

  const guide = buildStudyGuide({ kind: "temel", baslik: topic.konu, alan: topic.alan });
  const oakRes = guide.resources.find((r) => /Oak Study Notes/i.test(r.label));
  const thmFirst = guide.resources[0] && /TryHackMe/i.test(guide.resources[0].label) && !/optional/i.test(guide.resources[0].label);
  const dual =
    guide.steps.some((s) => /Dual lens|attacker|attack\/|technique/i.test(s.action)) ||
    guide.actions.some((a) => /Dual lens|attacker/i.test(a));

  const flags: string[] = [];
  if (thmFirst) flags.push("THM-first resource");
  if (!oakRes && topic.alan !== "lang") flags.push("no Oak Study Notes PDF resource");
  if (!dual) flags.push("weak dual-lens steps");
  if (/Complete THM|full room|Linux Fundamentals(?! Part 1 \(optional)/i.test(guide.steps.map((s) => s.action).join(" "))) {
    flags.push("autopilot room pressure in steps");
  }
  const stepMins = guide.steps.reduce((n, s) => n + (s.durationMin ?? 0), 0);
  if (stepMins > 55) flags.push(`tour steps sum ${stepMins}m (>45m budget)`);

  const classTopic = OAK_COVERED.find((t) => t.konu === OAK_COURSE_FOCUS);
  const classLane =
    classTopic && statuses.get(classTopic.id) !== "pekiştirildi"
      ? `${OAK_COURSE_FOCUS} (light — skip if fatigued)`
      : "class lane clear";

  rows.push({
    day: d,
    week: Math.ceil(d / 6),
    spine: topic.konu,
    module: spineModuleLabel(topic),
    primaryPdf: oakRes?.label.replace(/^Oak Study Notes — /, "") ?? null,
    thmPrimary: !!thmFirst,
    dualLens: dual,
    classLane,
    flags,
  });
  flagsAll.push(...flags.map((f) => `D${d}: ${f}`));

  // Learner completes one understanding tour → reinforce spine topic
  statuses.set(topic.id, "pekiştirildi");
}

// Week summaries
const byWeek = new Map<number, DayRow[]>();
for (const r of rows) {
  const list = byWeek.get(r.week) ?? [];
  list.push(r);
  byWeek.set(r.week, list);
}

console.log("=== 1-month learner dry-run (22 study days) ===\n");
for (const [week, list] of byWeek) {
  console.log(`Week ${week}: ${list[0].module} → ${list[list.length - 1].module}`);
  for (const r of list) {
    const pdf = r.primaryPdf ? r.primaryPdf.slice(0, 56) : "(no oakNotes)";
    const mark = r.flags.length ? ` !! ${r.flags.join("; ")}` : "";
    console.log(`  D${String(r.day).padStart(2)} spine: ${r.spine}`);
    console.log(`       PDF: ${pdf}${mark}`);
  }
  console.log("");
}

const remaining = openSpine();
const nextModules = [...new Set(remaining.slice(0, 8).map(spineModuleLabel))];
console.log(`After ${rows.length} tours: ${rows.length} reinforced, ${remaining.length} spine topics still open`);
console.log(`Next modules in queue: ${nextModules.join(" → ") || "(none)"}`);
console.log(`Class lane throughout: ${OAK_COURSE_FOCUS} stays light/parallel (not blocking spine)\n`);

const thmHits = rows.filter((r) => r.thmPrimary).length;
const dualMiss = rows.filter((r) => !r.dualLens).length;
const flagHits = flagsAll.length;

console.log("=== Verdict inputs ===");
console.log(`THM-first primary days: ${thmHits}/${rows.length}`);
console.log(`Missing dual-lens days: ${dualMiss}/${rows.length}`);
console.log(`Flag events: ${flagHits}`);
if (flagHits) {
  for (const f of flagsAll.slice(0, 20)) console.log(`  - ${f}`);
}

const ok = thmHits === 0 && dualMiss === 0 && flagHits === 0;
console.log(`\nVERDICT_CODE: ${ok ? "PASS_SOLID" : flagHits <= 3 && thmHits === 0 ? "PASS_WITH_NOTES" : "NEEDS_FIX"}`);
