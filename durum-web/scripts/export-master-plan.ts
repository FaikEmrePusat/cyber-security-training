/**
 * Perfect-progress master plan → CSV (Excel). Run: npm run export:plan
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ALAN_LABEL,
  FOUNDATION_ALANS,
  OAK_COVERED,
  OAK_UPCOMING,
  topicKey,
  type CurriculumStatus,
  type CurriculumTopic,
} from "../src/data/oakCurriculum";
import {
  MODEL,
  SEED_SKILLS,
  SEED_RETRIEVAL,
  daysSince,
  isRetrievalDue,
  nextStability,
  rHedef,
  type RetrievalItem,
  type Skill,
} from "../src/model";
import {
  getDayType,
  type ScheduleTask,
  type ScheduleTaskKind,
} from "../src/useRollingSchedule";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../exports");

const TEKRAR_SAAT = 8 / 60;
const KONU_SAAT = 0.5;
const LAB_SAAT_MIN = 0.5;
const DIL_SAAT = 0.5;
const MAX_CARRY = 0; // perfect progress — no backlog

const TEMPO = { hoursCyber: 28, hoursLang: 10 };
const START = new Date("2026-09-02T08:00:00+03:00");

const KIND_LABEL: Record<ScheduleTaskKind, string> = {
  tekrar: "Review",
  konu: "Weak area",
  temel: "Foundation",
  lab: "Integrated lab",
  dil: "German",
  dinlenme: "Rest",
};

type SimState = {
  carry: ScheduleTask[];
  temelIdxByAlan: Record<string, number>;
  temelAlanRotate: number;
  temelAlanOrder: string[];
  retrieval: RetrievalItem[];
  labUsed: boolean;
  langUsed: number;
};

function bottleneckAlan(skills: Skill[]): string {
  const list = skills.filter((s) => s.id !== "port");
  let worst = list[0];
  for (const s of list) {
    if (s.claimed / Math.max(1, s.weight) < worst.claimed / Math.max(1, worst.weight)) worst = s;
  }
  return worst.id;
}

function foundationAlanOrder(skills: Skill[]): string[] {
  return [...FOUNDATION_ALANS].sort((a, b) => {
    const sa = skills.find((s) => s.id === a);
    const sb = skills.find((s) => s.id === b);
    const ra = (sa?.claimed ?? 0) / Math.max(1, sa?.weight ?? 1);
    const rb = (sb?.claimed ?? 0) / Math.max(1, sb?.weight ?? 1);
    if (ra !== rb) return ra - rb;
    return FOUNDATION_ALANS.indexOf(a) - FOUNDATION_ALANS.indexOf(b);
  });
}

function studyCandidates(
  alan: string,
  statuses: Record<string, CurriculumStatus>,
  queueKeys: Set<string>,
): CurriculumTopic[] {
  const inAlan = OAK_COVERED.filter(
    (t) =>
      t.alan === alan &&
      statuses[t.id] !== "pekiştirildi" &&
      statuses[t.id] !== "ogrenilmedi" &&
      !queueKeys.has(topicKey(t.konu)),
  );
  if (inAlan.length) return inAlan;
  return OAK_COVERED.filter(
    (t) =>
      statuses[t.id] === "ogreniyorum" &&
      statuses[t.id] !== "pekiştirildi" &&
      !queueKeys.has(topicKey(t.konu)),
  );
}

function temelListsFor(
  statuses: Record<string, CurriculumStatus>,
  queueKeys: Set<string>,
): Record<string, CurriculumTopic[]> {
  const out: Record<string, CurriculumTopic[]> = {};
  for (const a of FOUNDATION_ALANS) {
    out[a] = studyCandidates(a, statuses, queueKeys);
  }
  return out;
}

function pickTemelTopic(sim: SimState, temelLists: Record<string, CurriculumTopic[]>): CurriculumTopic | null {
  for (let i = 0; i < sim.temelAlanOrder.length; i++) {
    const alan = sim.temelAlanOrder[(sim.temelAlanRotate + i) % sim.temelAlanOrder.length];
    const list = temelLists[alan] ?? [];
    const idx = sim.temelIdxByAlan[alan] ?? 0;
    if (idx < list.length) return list[idx];
  }
  return null;
}

function advanceTemel(sim: SimState, alan: string): void {
  sim.temelIdxByAlan[alan] = (sim.temelIdxByAlan[alan] ?? 0) + 1;
  sim.temelAlanRotate = (sim.temelAlanRotate + 1) % Math.max(1, sim.temelAlanOrder.length);
}

function newRetrievalId(): string {
  return `r-plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function packPerfectDay(
  offset: number,
  sim: SimState,
  temelLists: Record<string, CurriculumTopic[]>,
  weakList: CurriculumTopic[],
  kapasite: number,
  langKapasite: number,
  dayType: "A" | "B",
): { tasks: ScheduleTask[]; sim: SimState } {
  const tasks: ScheduleTask[] = [];
  let used = 0;

  const tryAdd = (task: ScheduleTask): boolean => {
    if (used + task.saat <= kapasite + 1e-6) {
      tasks.push(task);
      used += task.saat;
      return true;
    }
    return false;
  };

  const nowMs = START.getTime() + offset * 86400000;
  const due = sim.retrieval.filter((r) => isRetrievalDue(r, nowMs));
  let tekrarAdded = 0;
  for (const r of due.slice(0, 2)) {
    if (tekrarAdded >= 2) break;
    if (
      tryAdd({
        id: `tekrar-${r.id}`,
        kind: "tekrar",
        baslik: r.topic,
        detay: ALAN_LABEL[r.alan] ?? r.alan,
        saat: TEKRAR_SAAT,
        alan: r.alan,
        retrievalId: r.id,
      })
    ) {
      tekrarAdded += 1;
    }
  }

  if (dayType === "A") {
    const temelTopic = pickTemelTopic(sim, temelLists);
    if (temelTopic) {
      const task: ScheduleTask = {
        id: `temel-${temelTopic.id}`,
        kind: "temel",
        baslik: temelTopic.konu,
        detay: ALAN_LABEL[temelTopic.alan] ?? temelTopic.alan,
        saat: KONU_SAAT,
        alan: temelTopic.alan,
        topicId: temelTopic.id,
      };
      if (tryAdd(task)) advanceTemel(sim, temelTopic.alan);
    }
    if (weakList.length) {
      const topic = weakList[0];
      tryAdd({
        id: `konu-${topic.id}`,
        kind: "konu",
        baslik: topic.konu,
        detay: ALAN_LABEL[topic.alan] ?? topic.alan,
        saat: KONU_SAAT,
        alan: topic.alan,
        topicId: topic.id,
      });
    }
  } else {
    tryAdd({
      id: `lab-${offset}`,
      kind: "lab",
      baslik: "Integrated Lab — Attack Timeline + Detection Write-up",
      detay: "Portfolio evidence · Gate B & C",
      saat: 1.25,
    });
  }

  if (langKapasite >= DIL_SAAT) {
    tasks.push({
      id: `dil-de-${offset}`,
      kind: "dil",
      baslik: "German study",
      detay: "Speaking / reading / listening",
      saat: DIL_SAAT,
      alan: "dil-de",
    });
  }

  return { tasks, sim };
}

function countReinforced(statuses: Record<string, CurriculumStatus>): number {
  return OAK_COVERED.filter((t) => statuses[t.id] === "pekiştirildi").length;
}

function allCoveredDone(statuses: Record<string, CurriculumStatus>): boolean {
  return OAK_COVERED.every((t) => statuses[t.id] === "pekiştirildi");
}

function csvEscape(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function main() {
  const skills = structuredClone(SEED_SKILLS);
  const statuses: Record<string, CurriculumStatus> = {};
  for (const t of OAK_COVERED) statuses[t.id] = "ogreniyorum";
  for (const t of OAK_UPCOMING) statuses[t.id] = "sonra";

  let retrieval = structuredClone(SEED_RETRIEVAL);
  const temelIdxByAlan: Record<string, number> = {};
  for (const a of FOUNDATION_ALANS) temelIdxByAlan[a] = 0;

  let sim: SimState = {
    carry: [],
    temelIdxByAlan,
    temelAlanRotate: 0,
    temelAlanOrder: foundationAlanOrder(skills),
    retrieval,
    labUsed: false,
    langUsed: 0,
  };

  const dailyCyber = TEMPO.hoursCyber / 7;
  const dailyLang = TEMPO.hoursLang / 7;
  const rows: string[][] = [];

  rows.push([
    "Day",
    "Date",
    "Weekday",
    "Day type",
    "Oak progress",
    "Task 1 type",
    "Task 1 topic",
    "Task 1 area",
    "Task 2 type",
    "Task 2 topic",
    "Task 2 area",
    "Task 3 type",
    "Task 3 topic",
    "Task 3 area",
    "Task 4 type",
    "Task 4 topic",
    "Task 4 area",
    "German",
    "Notes",
  ]);

  let day = 0;
  const maxDays = 400;

  while (day < maxDays && !allCoveredDone(statuses)) {
    const date = new Date(START.getTime() + day * 86400000);
    const { dayType, dayTypeLabel } = getDayType(day);
    const queueKeys = new Set(retrieval.map((r) => topicKey(r.topic)));
    const alan = bottleneckAlan(skills);
    const temelLists = temelListsFor(statuses, queueKeys);
    const weakList = studyCandidates(alan, statuses, queueKeys);

    const { tasks } = packPerfectDay(
      day,
      sim,
      temelLists,
      weakList,
      dailyCyber,
      dailyLang,
      dayType,
    );

    const nowIso = date.toISOString();
    const nowMs = date.getTime();

    for (const task of tasks) {
      if (task.kind === "tekrar" && task.retrievalId) {
        retrieval = retrieval.map((r) => {
          if (r.id !== task.retrievalId) return r;
          const next = nextStability(r, "basarili");
          return { ...r, stability: next.s, ef: next.ef, n: next.n, lastIso: nowIso };
        });
      }
      if ((task.kind === "temel" || task.kind === "konu") && task.topicId) {
        statuses[task.topicId] = "pekiştirildi";
        const topic = OAK_COVERED.find((t) => t.id === task.topicId);
        if (topic) {
          const key = topicKey(topic.konu);
          if (!retrieval.some((r) => topicKey(r.topic) === key)) {
            retrieval.push({
              id: newRetrievalId(),
              topic: topic.konu,
              alan: topic.alan,
              difficulty: topic.zorluk,
              n: 0,
              stability: MODEL.tekrar.s0,
              ef: MODEL.tekrar.ef0,
              lastIso: nowIso,
            });
          }
        }
      }
    }

    sim.retrieval = retrieval;

    const progress = `${countReinforced(statuses)}/${OAK_COVERED.length}`;
    const taskCells: string[] = [];
    for (let i = 0; i < 4; i++) {
      const t = tasks[i];
      if (t) {
        taskCells.push(KIND_LABEL[t.kind], t.baslik, ALAN_LABEL[t.alan ?? ""] ?? t.alan ?? "");
      } else {
        taskCells.push("", "", "");
      }
    }
    const german = tasks.some((t) => t.kind === "dil") ? "German study" : "";
    const notes =
      dayType === "B"
        ? "Lab day — portfolio / integrated attack+defense"
        : weakList.length === 0 && !pickTemelTopic(sim, temelLists)
          ? "Reviews + language only"
          : "";

    rows.push([
      String(day + 1),
      date.toISOString().slice(0, 10),
      date.toLocaleDateString("en-US", { weekday: "long" }),
      dayTypeLabel,
      progress,
      ...taskCells,
      german,
      notes,
    ]);

    day += 1;
  }

  const totalDays = day;
  const endDate = new Date(START.getTime() + (totalDays - 1) * 86400000);
  rows.push([]);
  rows.push(["Summary", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
  rows.push([
    "Assumption",
    "Perfect progress — Normal tempo (28h cyber + 10h German per week), no carry, all tasks completed",
  ]);
  rows.push(["Start date", START.toISOString().slice(0, 10)]);
  rows.push(["End date (141 Oak topics)", endDate.toISOString().slice(0, 10)]);
  rows.push(["Total days", String(totalDays)]);
  rows.push(["Weeks (approx)", String(Math.ceil(totalDays / 7))]);
  rows.push(["Goal R (Germany junior target)", String(rHedef())]);
  rows.push(["Rhythm", "2 Topic days + 1 Integrated Lab day (A, A, B, …)"]);
  rows.push([
    "After Oak 141",
    `Then ${OAK_UPCOMING.length} post-EDR topics unlock (not included in this table)`,
  ]);

  mkdirSync(OUT_DIR, { recursive: true });
  const csv = "\uFEFF" + rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const csvPath = join(OUT_DIR, "SOC-Ledger-Master-Plan.csv");
  writeFileSync(csvPath, csv, "utf8");

  console.log(`Master plan: ${totalDays} days (${countReinforced(statuses)}/${OAK_COVERED.length} topics)`);
  console.log(`Written: ${csvPath}`);
}

main();
