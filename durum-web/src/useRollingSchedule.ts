import { useMemo } from "react";
import {
  ALAN_LABEL,
  FOUNDATION_SPINE_REBUILD,
  OAK_COVERED,
  OAK_COURSE_FOCUS,
  OAK_UPCOMING,
  topicKey,
  type CurriculumStatus,
  type CurriculumTopic,
} from "./data/oakCurriculum";
import { sortByOakSpineOrder, spineModuleLabel } from "./data/oakSpineOrder";
import { buildStudyGuide, type StudyGuide, type StudyGuideGateContext, type StudyGuideInput } from "./data/studyPlans";
import {
  MODEL,
  daysSince,
  isRetrievalDue,
  retrievability,
  round1,
  type RoiAction,
  type RetrievalItem,
  type ScheduleCarryItem,
  type Skill,
} from "./model";
import { useDerived } from "./useDerived";
import { useDurum } from "./store";

export type ScheduleTaskKind = "tekrar" | "konu" | "temel" | "lab" | "dil" | "dinlenme";
export type DayType = "A" | "B";

export type ScheduleTask = {
  id: string;
  kind: ScheduleTaskKind;
  baslik: string;
  detay?: string;
  saat: number;
  alan?: string;
  carried?: boolean;
  topicId?: string;
  retrievalId?: string;
  roiId?: string;
};

export type ScheduleDay = {
  offset: number;
  dateIso: string;
  label: string;
  dayType: DayType;
  dayTypeLabel: string;
  weekGroup: "bugun" | "bu-hafta" | "gelecek-hafta";
  tasks: ScheduleTask[];
  kapasiteSaat: number;
  doluSaat: number;
  tasima: number;
};

export type BugunGorev = ScheduleTask & {
  kindLabel: string;
  neden?: string;
  sure: string;
  dayType?: DayType;
  dayTypeLabel?: string;
  studyGuide?: StudyGuide;
};

export type JourneySnapshot = {
  konuTamamlanan: number;
  konuToplam: number;
  yuzde: number;
  odakAlan: string;
  odakAlanLabel: string;
  konumMetni: string;
  siradakiKonu: string | null;
  siradakiKonuId: string | null;
  sonraKilit: string | null;
  kapıAd: string | null;
  kapıPi: number;
};

const TEKRAR_SAAT = 8 / 60;
/** Deep foundation spine block (~40–45 min understanding tour). */
const TEMEL_SAAT = 0.75;
/** Legacy / non-rebuild topic slot. */
const KONU_SAAT = 0.5;
/** Light class / current-course lane (homework, Nessus, quiz). */
const CLASS_SAAT = 0.25;
const LAB_SAAT_MIN = 0.5;
const DIL_SAAT = 0.5;
const PROJE_GUN = 14;
const MAX_CARRY = MODEL.carry?.maxCarry ?? 2;
const MAX_CARRY_AGE_DAYS = MODEL.carry?.maxAgeDays ?? 7;
/** During spine rebuild, keep FSRS from crowding out the main tour. */
const SPINE_TEKRAR_LIMIT = 1;

export function getDayType(offset: number): { dayType: DayType; dayTypeLabel: string } {
  // 2 Topic days (A), 1 Lab day (B) rhythm: A, A, B, A, A, B ...
  const isLab = offset % 3 === 2;
  return {
    dayType: isLab ? "B" : "A",
    dayTypeLabel: isLab ? "Integrated Lab Day" : "Topic Day",
  };
}

const GUN_AD: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const KIND_LABEL: Record<ScheduleTaskKind, string> = {
  tekrar: "Topic review",
  konu: FOUNDATION_SPINE_REBUILD ? "Class / current course (light)" : "Next topic in weak area",
  temel: FOUNDATION_SPINE_REBUILD ? "Foundation spine (Oak course order)" : "Foundation topic study",
  lab: "Lab / practice",
  dil: "Language study",
  dinlenme: "Rest",
};

function formatSure(saat: number): string {
  if (saat <= 0) return "";
  if (saat <= 1) return `~${Math.max(5, Math.round(saat * 60))} min`;
  return `~${round1(saat)} h`;
}

function dayLabel(offset: number, date: Date): string {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  if (offset < 7) return GUN_AD[date.getDay()] ?? date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function weekGroup(offset: number): ScheduleDay["weekGroup"] {
  if (offset === 0) return "bugun";
  if (offset < 7) return "bu-hafta";
  return "gelecek-hafta";
}

function bottleneckAlan(skills: Skill[]): string {
  const list = skills.filter((s) => s.id !== "port");
  if (!list.length) return "net";
  let worst = list[0];
  for (const s of list) {
    if (s.claimed / Math.max(1, s.weight) < worst.claimed / Math.max(1, worst.weight)) worst = s;
  }
  return worst.id;
}

/** Weak-area candidates (legacy) or fallback when class focus is already reinforced. */
function studyCandidates(
  alan: string,
  getStatus: (id: string) => CurriculumStatus,
  queueKeys: Set<string>,
): CurriculumTopic[] {
  const inAlan = OAK_COVERED.filter(
    (t) =>
      t.alan === alan &&
      getStatus(t.id) !== "pekiştirildi" &&
      getStatus(t.id) !== "ogrenilmedi" &&
      !queueKeys.has(topicKey(t.konu)),
  );
  if (inAlan.length) return inAlan;
  return OAK_COVERED.filter(
    (t) =>
      getStatus(t.id) === "ogreniyorum" &&
      getStatus(t.id) !== "pekiştirildi" &&
      !queueKeys.has(topicKey(t.konu)),
  );
}

/**
 * Oak course module spine (IT Fundamentals first — not raw file/OSI order).
 * Skips reinforced (mark Learning again to re-do) and FSRS-queued titles.
 */
function spineCandidates(
  getStatus: (id: string) => CurriculumStatus,
  queueKeys: Set<string>,
): CurriculumTopic[] {
  const open = OAK_COVERED.filter(
    (t) => getStatus(t.id) !== "pekiştirildi" && !queueKeys.has(topicKey(t.konu)),
  );
  return sortByOakSpineOrder(open);
}

/** Prefer current class topic (e.g. Nessus); else first incomplete weak-area candidate. */
function classLaneCandidates(
  alan: string,
  getStatus: (id: string) => CurriculumStatus,
  queueKeys: Set<string>,
): CurriculumTopic[] {
  const focus = OAK_COVERED.find((t) => t.konu === OAK_COURSE_FOCUS);
  const rest = studyCandidates(alan, getStatus, queueKeys);
  if (
    focus &&
    getStatus(focus.id) !== "pekiştirildi" &&
    !queueKeys.has(topicKey(focus.konu))
  ) {
    return [focus, ...rest.filter((t) => t.id !== focus.id)];
  }
  return rest;
}

function daysUntilDue(item: RetrievalItem, fromMs: number): number {
  const elapsed = daysSince(item.lastIso, fromMs);
  if (retrievability(elapsed, item.stability) < MODEL.tekrar.rHedef) return 0;
  for (let d = elapsed + 1; d < 400; d++) {
    if (retrievability(d, item.stability) < MODEL.tekrar.rHedef) return d - elapsed;
  }
  return 14;
}

function pickLabRoi(roiList: RoiAction[]): RoiAction | null {
  return (
    roiList.find(
      (a) =>
        a.id.startsWith("an-") ||
        a.id.startsWith("ap-") ||
        /lab|pratik|soc|ad lab|vm lab/i.test(a.baslik),
    ) ?? null
  );
}

function carryToTask(c: ScheduleCarryItem): ScheduleTask {
  return {
    id: c.id,
    kind: c.kind,
    baslik: c.baslik,
    saat: c.saat,
    topicId: c.topicId,
    retrievalId: c.retrievalId,
    roiId: c.roiId,
    carried: true,
  };
}

function zayifAlanTask(t: CurriculumTopic): ScheduleTask {
  return {
    id: `konu-${t.id}`,
    kind: "konu",
    baslik: t.konu,
    detay: ALAN_LABEL[t.alan] ?? t.alan,
    saat: FOUNDATION_SPINE_REBUILD ? CLASS_SAAT : KONU_SAAT,
    alan: t.alan,
    topicId: t.id,
  };
}

function temelTask(t: CurriculumTopic): ScheduleTask {
  return {
    id: `temel-${t.id}`,
    kind: "temel",
    baslik: t.konu,
    detay: ALAN_LABEL[t.alan] ?? t.alan,
    saat: FOUNDATION_SPINE_REBUILD ? TEMEL_SAAT : KONU_SAAT,
    alan: t.alan,
    topicId: t.id,
  };
}

function tekrarTask(r: RetrievalItem, count?: number): ScheduleTask {
  const suffix = count && count > 1 ? ` (${count} topics)` : "";
  return {
    id: count && count > 1 ? `tekrar-batch-${r.id}` : `tekrar-${r.id}`,
    kind: "tekrar",
    baslik: count && count > 1 ? `${count} topic reviews${suffix}` : r.topic,
    detay: count && count > 1 ? "Due reviews" : ALAN_LABEL[r.alan] ?? r.alan,
    saat: count && count > 1 ? TEKRAR_SAAT * count : TEKRAR_SAAT,
    alan: r.alan,
    retrievalId: r.id,
  };
}

function labTask(a: RoiAction): ScheduleTask {
  return {
    id: `lab-${a.id}`,
    kind: "lab",
    baslik: a.baslik,
    detay: a.detay,
    saat: Math.max(LAB_SAAT_MIN, Math.min(a.saat, 2)),
    roiId: a.id,
  };
}

function taskToGuideInput(
  task: ScheduleTask,
  gateContext: StudyGuideGateContext,
): StudyGuideInput {
  return {
    kind: task.kind,
    baslik: task.baslik,
    topicId: task.topicId,
    alan: task.alan,
    detay: task.detay,
    roiId: task.roiId,
    gateContext,
  };
}

function buildTaskGuide(task: ScheduleTask, gateContext: StudyGuideGateContext): StudyGuide {
  return buildStudyGuide(taskToGuideInput(task, gateContext));
}

function dilTask(offset: number, lang: "de" | "en" = "de"): ScheduleTask {
  const label = lang === "de" ? "German" : "English";
  return {
    id: `dil-${lang}-${offset}`,
    kind: "dil",
    baslik: `${label} study`,
    detay: lang === "de" ? "Speaking / reading / listening" : "English practice",
    saat: DIL_SAAT,
    alan: lang === "de" ? "dil-de" : "dil-en",
  };
}

type SimState = {
  carry: ScheduleTask[];
  bottleneckStudyIdx: number;
  bottleneckStudyList: CurriculumTopic[];
  spineIdx: number;
  spineList: CurriculumTopic[];
  retrieval: Array<{ item: RetrievalItem; dueOffset: number }>;
  labRoi: RoiAction | null;
  labUsed: boolean;
  langUsed: number;
};

function pickTemelTopic(sim: SimState): CurriculumTopic | null {
  return sim.spineList[sim.spineIdx] ?? null;
}

function advanceTemel(sim: SimState): void {
  sim.spineIdx += 1;
}

function packDay(
  offset: number,
  sim: SimState,
  kapasite: number,
  langKapasite: number,
  tekrarLimit: number,
  dayType: DayType,
): { tasks: ScheduleTask[]; tasima: number; sim: SimState } {
  const tasks: ScheduleTask[] = [];
  let used = 0;
  const nextCarry: ScheduleTask[] = [];
  let tasima = 0;

  const tryAdd = (task: ScheduleTask, forceCarry = false): boolean => {
    if (used + task.saat <= kapasite + 1e-6) {
      tasks.push(task);
      used += task.saat;
      return true;
    }
    if (forceCarry || offset === 0) {
      if (nextCarry.length < MAX_CARRY) {
        nextCarry.push(task);
      }
      tasima += 1;
    }
    return false;
  };

  // 1. Place carried tasks from yesterday / prior days
  for (const c of sim.carry) {
    if (!tryAdd({ ...c, carried: true }, true)) break;
  }
  sim.carry = sim.carry.filter((c) => !tasks.some((t) => t.id === c.id));

  const addRetrieval = () => {
    const dueToday = sim.retrieval
      .filter((r) => r.dueOffset <= offset)
      .sort((a, b) => a.dueOffset - b.dueOffset);
    let tekrarAdded = 0;
    for (const d of dueToday) {
      if (tekrarAdded >= tekrarLimit) {
        if (nextCarry.length < MAX_CARRY) {
          nextCarry.push(tekrarTask(d.item));
        }
        tasima += 1;
        continue;
      }
      if (tryAdd(tekrarTask(d.item))) {
        tekrarAdded += 1;
        sim.retrieval = sim.retrieval.filter((x) => x.item.id !== d.item.id);
      } else {
        if (nextCarry.length < MAX_CARRY) {
          nextCarry.push(tekrarTask(d.item));
        }
        tasima += 1;
      }
    }
  };

  // Day A rebuild: spine first, then light reviews; otherwise reviews first (legacy).
  if (dayType === "A" && FOUNDATION_SPINE_REBUILD) {
    const temelTopic = pickTemelTopic(sim);
    if (temelTopic) {
      const task = temelTask(temelTopic);
      if (tryAdd(task)) advanceTemel(sim);
      else if (offset >= 0) {
        if (nextCarry.length < MAX_CARRY) nextCarry.push(task);
        tasima += 1;
      }
    }
    addRetrieval();
    if (sim.bottleneckStudyIdx < sim.bottleneckStudyList.length) {
      const topic = sim.bottleneckStudyList[sim.bottleneckStudyIdx];
      const task = zayifAlanTask(topic);
      if (tryAdd(task)) sim.bottleneckStudyIdx += 1;
      else if (offset >= 0) {
        if (nextCarry.length < MAX_CARRY) nextCarry.push(task);
        tasima += 1;
      }
    }
  } else if (dayType === "A") {
    addRetrieval();
    const temelTopic = pickTemelTopic(sim);
    if (temelTopic) {
      const task = temelTask(temelTopic);
      if (tryAdd(task)) advanceTemel(sim);
      else if (offset >= 0) {
        if (nextCarry.length < MAX_CARRY) nextCarry.push(task);
        tasima += 1;
      }
    }
    if (sim.bottleneckStudyIdx < sim.bottleneckStudyList.length) {
      const topic = sim.bottleneckStudyList[sim.bottleneckStudyIdx];
      const task = zayifAlanTask(topic);
      if (tryAdd(task)) sim.bottleneckStudyIdx += 1;
      else if (offset >= 0) {
        if (nextCarry.length < MAX_CARRY) nextCarry.push(task);
        tasima += 1;
      }
    }
  } else {
    addRetrieval();
    // --- DAY B (LAB / APPLICATION) ---
    const labTaskItem = sim.labRoi
      ? labTask(sim.labRoi)
      : {
          id: `lab-soc-wazuh-${offset}`,
          kind: "lab" as const,
          baslik: "Sysmon + Wazuh / Splunk Lab Setup and Analysis",
          detay: "Valuable SOC lab for Gate B & Gate C (v=3.0) · Sysmon/WinEvent log analysis",
          saat: 1.25,
        };
    if (tryAdd(labTaskItem)) {
      sim.labUsed = true;
    } else if (offset < 3) {
      if (nextCarry.length < MAX_CARRY) nextCarry.push(labTaskItem);
      tasima += 1;
    }
  }

  // Language channel — separate capacity
  const langRemaining = langKapasite - sim.langUsed;
  if (langRemaining >= DIL_SAAT && (dayType === "A" || langRemaining >= DIL_SAAT * 2)) {
    const dilItem = dilTask(offset, "de");
    if (langRemaining >= dilItem.saat) {
      tasks.push(dilItem);
      sim.langUsed += dilItem.saat;
    }
  }

  sim.carry = nextCarry.slice(-MAX_CARRY);
  return { tasks, tasima, sim };
}

export function useRollingSchedule(getStatus: (id: string) => CurriculumStatus) {
  const { state } = useDurum();
  const d = useDerived();

  return useMemo(() => {
    const todayIso = new Date(d.nowMs).toISOString().slice(0, 10);
    const completedToday = new Set(state.scheduleCompletedToday?.[todayIso] ?? []);
    const queueKeys = new Set(state.retrieval.map((r) => topicKey(r.topic)));
    const alan = bottleneckAlan(state.skills);
    const alanLabel = ALAN_LABEL[alan] ?? alan;

    const dailyCyber = Math.max(0.5, state.tempo.hoursCyber / 7);
    const dailyCapBase = Math.min(
      2,
      Math.max(FOUNDATION_SPINE_REBUILD ? 1.25 : 0.75, dailyCyber),
    );
    const dailyLang = Math.max(0, state.tempo.hoursLang / 7);

    const overdue = state.retrieval.filter((r) => isRetrievalDue(r, d.nowMs));
    const futureRetrieval = state.retrieval
      .filter((r) => !isRetrievalDue(r, d.nowMs))
      .map((r) => ({ item: r, dueOffset: daysUntilDue(r, d.nowMs) }));

    const studyList = classLaneCandidates(alan, getStatus, queueKeys);
    const nextStudy = studyList[0] ?? null;
    const spineList = FOUNDATION_SPINE_REBUILD
      ? spineCandidates(getStatus, queueKeys)
      : studyCandidates(alan, getStatus, queueKeys);
    const nextTemel = spineList[0] ?? null;
    const labRoi = pickLabRoi(d.roiList);

    const persistedCarry = (state.scheduleCarry ?? [])
      .filter((c) => daysSince(c.sinceIso, d.nowMs) <= MAX_CARRY_AGE_DAYS)
      .slice(-MAX_CARRY)
      .map(carryToTask);

    const sim0: SimState = {
      carry: persistedCarry,
      bottleneckStudyIdx: 0,
      bottleneckStudyList: studyList,
      spineIdx: 0,
      spineList,
      retrieval: [
        ...overdue.map((item) => ({ item, dueOffset: 0 })),
        ...futureRetrieval,
      ],
      labRoi,
      labUsed: false,
      langUsed: 0,
    };

    const days: ScheduleDay[] = [];
    let sim = { ...sim0, carry: [...sim0.carry], retrieval: [...sim0.retrieval] };

    for (let offset = 0; offset < PROJE_GUN; offset++) {
      const date = new Date(d.nowMs + offset * 86400000);
      const { dayType, dayTypeLabel } = getDayType(offset);
      let kapasite = dailyCapBase;
      if (offset === 0 && d.pmc.tsb < -20) {
        // High fatigue: keep capacity light (return-mode warm-up is optional and separate).
        kapasite = 0.25;
      }

      const tekrarLim =
        offset === 0 && dayType === "A" && FOUNDATION_SPINE_REBUILD
          ? SPINE_TEKRAR_LIMIT
          : offset === 0
            ? dayType === "A"
              ? MODEL.tekrar.kuyrukTavani
              : 2
            : 2;
      const { tasks, tasima, sim: nextSim } = packDay(
        offset,
        sim,
        kapasite,
        dailyLang,
        tekrarLim,
        dayType,
      );
      sim = nextSim;

      const doluSaat = tasks.reduce((a, t) => a + t.saat, 0);
      days.push({
        offset,
        dateIso: date.toISOString().slice(0, 10),
        label: dayLabel(offset, date),
        dayType,
        dayTypeLabel,
        weekGroup: weekGroup(offset),
        tasks:
          offset === 0 && d.pmc.tsb < -20 && tasks.length === 0
            ? [
                {
                  id: "dinlen",
                  kind: "dinlenme",
                  baslik: "Light review or rest",
                  detay: "Fatigue is high",
                  saat: 0.25,
                },
              ]
            : tasks,
        kapasiteSaat: kapasite,
        doluSaat,
        tasima,
      });
    }

    if (days[0] && completedToday.size > 0) {
      const visible = days[0].tasks.filter((t) => !completedToday.has(t.id));
      days[0] = {
        ...days[0],
        tasks: visible,
        doluSaat: visible.reduce((a, t) => a + t.saat, 0),
      };
    }

    const todayDayType = days[0]?.dayType ?? "A";
    const todayDayTypeLabel = days[0]?.dayTypeLabel ?? "Topic Day";
    const bugunFromSchedule = days[0]?.tasks ?? [];

    const gateC = d.gates.find((g) => g.id === "C");
    const gateContext: StudyGuideGateContext = {
      nextGateId: d.nextGate?.id ?? null,
      gateCBlocked: gateC ? !gateC.open : true,
      portfolioBlocked: gateC ? !gateC.open : true,
      siemBlocked: !d.gates.find((g) => g.id === "B")?.open,
    };

    const guideFor = (task: ScheduleTask) => buildTaskGuide(task, gateContext);

    const mapScheduleTask = (t: ScheduleTask): BugunGorev => ({
      ...t,
      kindLabel: KIND_LABEL[t.kind],
      sure: formatSure(t.saat),
      dayType: todayDayType,
      dayTypeLabel: todayDayTypeLabel,
      studyGuide: guideFor(t),
      neden: t.carried
        ? "Carried-over task from yesterday — recommended to finish first."
        : t.kind === "tekrar"
          ? "FSRS due date reached; forgetting reduces readiness."
          : t.kind === "temel"
                ? FOUNDATION_SPINE_REBUILD
                  ? "Foundation spine — Oak module order (IT Fundamentals → Network → Server → …); one understanding tour (~40–45 min)."
                  : `${ALAN_LABEL[t.alan ?? ""] ?? t.alan ?? "Foundation"} baseline — follow Oak order.`
            : t.kind === "konu"
              ? FOUNDATION_SPINE_REBUILD
                ? `Light class lane — current course / homework (${OAK_COURSE_FOCUS} when open).`
                : `Next curriculum topic in weak ${alanLabel} area.`
              : t.kind === "lab"
                ? "Full lab / SOC practice — produces portfolio evidence for Gate B & C."
                : t.kind === "dil"
                  ? "Daily language capacity — German B2 plan (~100–120 min/day: input, Anki, output, grammar)."
                  : undefined,
    });

    const returnWarmupCard = (): BugunGorev => ({
      id: "donus-tekrar",
      kind: "tekrar",
      kindLabel: KIND_LABEL.tekrar,
      baslik:
        overdue.length > 0
          ? `${Math.min(overdue.length, MODEL.tekrar.kuyrukTavani)} topic reviews`
          : "15 min light practice",
      detay: "Return mode · optional",
      saat: 0.25,
      sure: "~15 min",
      dayType: todayDayType,
      dayTypeLabel: todayDayTypeLabel,
      studyGuide: buildStudyGuide({
        kind: "tekrar",
        baslik:
          overdue.length > 0
            ? `${Math.min(overdue.length, MODEL.tekrar.kuyrukTavani)} topic reviews`
            : "15 min light practice",
        gateContext,
      }),
      neden:
        "Optional warm-up after time away — do these reviews first, or skip and start Today's spine / class tasks.",
    });

    const bugunGorevler: BugunGorev[] = (() => {
      let list: BugunGorev[] = [];

      if (bugunFromSchedule.length > 0) {
        list = bugunFromSchedule.map(mapScheduleTask);
      } else {
        const fallback: BugunGorev[] = [];
        if (overdue.length) {
          const lim =
            todayDayType === "A" && FOUNDATION_SPINE_REBUILD
              ? SPINE_TEKRAR_LIMIT
              : todayDayType === "A"
                ? MODEL.tekrar.kuyrukTavani
                : 2;
          fallback.push({
            ...tekrarTask(overdue[0], Math.min(overdue.length, lim)),
            kindLabel: KIND_LABEL.tekrar,
            sure: formatSure(TEKRAR_SAAT * Math.min(overdue.length, lim)),
            dayType: todayDayType,
            dayTypeLabel: todayDayTypeLabel,
            studyGuide: guideFor(tekrarTask(overdue[0], Math.min(overdue.length, lim))),
            neden: "Overdue reviews take priority.",
          });
        }
        if (todayDayType === "A") {
          if (nextTemel) {
            fallback.push({
              ...temelTask(nextTemel),
              kindLabel: KIND_LABEL.temel,
              sure: formatSure(FOUNDATION_SPINE_REBUILD ? TEMEL_SAAT : KONU_SAAT),
              dayType: todayDayType,
              dayTypeLabel: todayDayTypeLabel,
              studyGuide: guideFor(temelTask(nextTemel)),
              neden: FOUNDATION_SPINE_REBUILD
                ? `Foundation spine — ${spineModuleLabel(nextTemel)} · Oak module order.`
                : `${ALAN_LABEL[nextTemel.alan] ?? nextTemel.alan} foundation — daily baseline.`,
            });
          }
          if (nextStudy) {
            fallback.push({
              ...zayifAlanTask(nextStudy),
              kindLabel: KIND_LABEL.konu,
              sure: formatSure(FOUNDATION_SPINE_REBUILD ? CLASS_SAAT : KONU_SAAT),
              dayType: todayDayType,
              dayTypeLabel: todayDayTypeLabel,
              studyGuide: guideFor(zayifAlanTask(nextStudy)),
              neden: FOUNDATION_SPINE_REBUILD
                ? `Light class lane — ${nextStudy.konu}.`
                : `New topic in weak ${alanLabel} area.`,
            });
          }
        } else {
          const labItem = labRoi
            ? labTask(labRoi)
            : {
                id: "lab-soc-wazuh-fallback",
                kind: "lab" as const,
                baslik: "Sysmon + Wazuh / Splunk Lab Setup and Analysis",
                detay: "Valuable SOC lab for Gate B & Gate C (v=3.0)",
                saat: 1.25,
              };
          fallback.push({
            ...labItem,
            kindLabel: KIND_LABEL.lab,
            sure: formatSure(labItem.saat),
            dayType: todayDayType,
            dayTypeLabel: todayDayTypeLabel,
            studyGuide: guideFor(labItem),
            neden: "Full SOC lab practice — produces portfolio evidence for Gate B & C.",
          });
        }
        list = fallback;
      }

      // Return mode: keep optional warm-up on top; do not hide Today's tasks.
      if (d.geriDonusModu) {
        const withoutDupWarmup = list.filter((t) => t.id !== "donus-tekrar");
        list = [returnWarmupCard(), ...withoutDupWarmup];
      }

      return list;
    })();

    const visibleBugunGorevler = bugunGorevler.filter((t) => !completedToday.has(t.id));

    const pekiştirildi = OAK_COVERED.filter((t) => getStatus(t.id) === "pekiştirildi").length;
    const kuyrukta = OAK_COVERED.filter((t) => getStatus(t.id) === "kuyrukta").length;
    const tamamlanan = pekiştirildi + kuyrukta;
    const sonraIlk = OAK_UPCOMING[0] ?? null;
    const edrIdx = OAK_COVERED.findIndex((t) => /edr/i.test(t.konu));
    const edrDone =
      edrIdx >= 0 &&
      (getStatus(OAK_COVERED[edrIdx].id) === "pekiştirildi" ||
        queueKeys.has(topicKey(OAK_COVERED[edrIdx].konu)));
    const focusTopic = OAK_COVERED.find((t) => t.konu === OAK_COURSE_FOCUS) ?? null;
    const focusStatus = focusTopic ? getStatus(focusTopic.id) : null;

    let konumMetni = "";
    if (FOUNDATION_SPINE_REBUILD && nextTemel) {
      konumMetni = `Spine · ${spineModuleLabel(nextTemel)} · ${nextTemel.konu}`;
      if (focusTopic && focusStatus !== "pekiştirildi") {
        konumMetni += ` · class: ${focusTopic.konu}`;
      }
    } else if (focusTopic && focusStatus !== "pekiştirildi") {
      konumMetni = `Currently: ${focusTopic.konu}`;
    } else if (edrDone && sonraIlk) {
      konumMetni = `After EDR · next: ${sonraIlk.konu}`;
    } else if (nextStudy) {
      konumMetni = `${alanLabel} weak · ${nextStudy.konu}`;
      if (nextTemel) konumMetni += ` · foundation: ${nextTemel.konu}`;
    } else if (nextTemel) {
      konumMetni = `Foundation · ${nextTemel.konu}`;
    } else {
      konumMetni = `Curriculum continues in ${alanLabel} area`;
    }

    const journey: JourneySnapshot = {
      konuTamamlanan: tamamlanan,
      konuToplam: OAK_COVERED.length,
      yuzde: Math.round((tamamlanan / Math.max(1, OAK_COVERED.length)) * 100),
      odakAlan: alan,
      odakAlanLabel: alanLabel,
      konumMetni,
      siradakiKonu: nextTemel?.konu ?? nextStudy?.konu ?? null,
      siradakiKonuId: nextTemel?.id ?? nextStudy?.id ?? null,
      sonraKilit: sonraIlk?.konu ?? null,
      kapıAd: d.nextGate?.name ?? null,
      kapıPi: d.nextGate?.pi ?? 0,
    };

    const carryCount = persistedCarry.length + (days[0]?.tasima ?? 0);

    return {
      days,
      bugunGorevler: visibleBugunGorevler,
      journey,
      carryCount,
      persistedCarryCount: persistedCarry.length,
      todayType: todayDayType,
      todayTypeLabel: todayDayTypeLabel,
      kindLabel: KIND_LABEL,
      formatSure,
    };
  }, [
    state.retrieval,
    state.skills,
    state.tempo,
    state.scheduleCarry,
    state.scheduleCompletedToday,
    getStatus,
    d.nowMs,
    d.geriDonusModu,
    d.pmc.tsb,
    d.roiList,
    d.nextGate,
    d.gates,
  ]);
}
