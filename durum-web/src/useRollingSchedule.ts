import { useMemo } from "react";
import {
  ALAN_LABEL,
  FOUNDATION_ALANS,
  OAK_COVERED,
  OAK_UPCOMING,
  topicKey,
  type CurriculumStatus,
  type CurriculumTopic,
} from "./data/oakCurriculum";
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
const KONU_SAAT = 0.5;
const LAB_SAAT_MIN = 0.5;
const DIL_SAAT = 0.5;
const PROJE_GUN = 14;
const MAX_CARRY = MODEL.carry?.maxCarry ?? 2;
const MAX_CARRY_AGE_DAYS = MODEL.carry?.maxAgeDays ?? 7;

export function getDayType(offset: number): { dayType: DayType; dayTypeLabel: string } {
  // 2 gün Konu (A), 1 gün Lab (B) ritmi: A, A, B, A, A, B ...
  const isLab = offset % 3 === 2;
  return {
    dayType: isLab ? "B" : "A",
    dayTypeLabel: isLab ? "Lab Günü" : "Konu Günü",
  };
}

const GUN_AD: Record<number, string> = {
  0: "Pazar",
  1: "Pazartesi",
  2: "Salı",
  3: "Çarşamba",
  4: "Perşembe",
  5: "Cuma",
  6: "Cumartesi",
};

const KIND_LABEL: Record<ScheduleTaskKind, string> = {
  tekrar: "Konu tekrarı",
  konu: "Zayıf alanda sıradaki konu",
  temel: "Temel konu çalışma",
  lab: "Lab / pratik",
  dil: "Dil çalışması",
  dinlenme: "Dinlenme",
};

function formatSure(saat: number): string {
  if (saat <= 0) return "";
  if (saat <= 1) return `~${Math.max(5, Math.round(saat * 60))} dk`;
  return `~${round1(saat)} sa`;
}

function dayLabel(offset: number, date: Date): string {
  if (offset === 0) return "Bugün";
  if (offset === 1) return "Yarın";
  if (offset < 7) return GUN_AD[date.getDay()] ?? date.toLocaleDateString("tr-TR", { weekday: "long" });
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
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

/** Temel kanal: en düşük claimed/weight alanı önce; günler arası round-robin. */
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
    saat: KONU_SAAT,
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
    saat: KONU_SAAT,
    alan: t.alan,
    topicId: t.id,
  };
}

function tekrarTask(r: RetrievalItem, count?: number): ScheduleTask {
  const suffix = count && count > 1 ? ` (${count} konu)` : "";
  return {
    id: count && count > 1 ? `tekrar-batch-${r.id}` : `tekrar-${r.id}`,
    kind: "tekrar",
    baslik: count && count > 1 ? `${count} konu tekrarı${suffix}` : r.topic,
    detay: count && count > 1 ? "Vadesi gelen tekrarlar" : ALAN_LABEL[r.alan] ?? r.alan,
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

function dilTask(offset: number, lang: "de" | "en" = "de"): ScheduleTask {
  const label = lang === "de" ? "Almanca" : "İngilizce";
  return {
    id: `dil-${lang}-${offset}`,
    kind: "dil",
    baslik: `${label} çalışması`,
    detay: lang === "de" ? "Konuşma / okuma / dinleme" : "İngilizce pratik",
    saat: DIL_SAAT,
    alan: lang === "de" ? "dil-de" : "dil-en",
  };
}

type SimState = {
  carry: ScheduleTask[];
  bottleneckStudyIdx: number;
  bottleneckStudyList: CurriculumTopic[];
  temelIdxByAlan: Record<string, number>;
  temelAlanRotate: number;
  temelAlanOrder: string[];
  retrieval: Array<{ item: RetrievalItem; dueOffset: number }>;
  labRoi: RoiAction | null;
  labUsed: boolean;
  langUsed: number;
};

function pickTemelTopic(
  sim: SimState,
  temelLists: Record<string, CurriculumTopic[]>,
): CurriculumTopic | null {
  const order = sim.temelAlanOrder;
  if (!order.length) return null;
  for (let i = 0; i < order.length; i++) {
    const alan = order[(sim.temelAlanRotate + i) % order.length];
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

function packDay(
  offset: number,
  sim: SimState,
  temelLists: Record<string, CurriculumTopic[]>,
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

  // 1. Dünden / önceki günlerden taşınan görevleri (max MAX_CARRY) kapasiteye yerleştir
  for (const c of sim.carry) {
    if (!tryAdd({ ...c, carried: true }, true)) break;
  }
  sim.carry = sim.carry.filter((c) => !tasks.some((t) => t.id === c.id));

  // 2. FSRS Aralıklı Tekrar Kanalı
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

  // 3. Günün Modüler Ritmi:
  if (dayType === "A") {
    // --- GÜN A (KONU / DERİNLEŞME): Temel Konu + Zayıf Alan Konusu ---
    const temelTopic = pickTemelTopic(sim, temelLists);
    if (temelTopic) {
      const task = temelTask(temelTopic);
      if (tryAdd(task)) advanceTemel(sim, temelTopic.alan);
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
    // --- GÜN B (LAB / UYGULAMA): Kapsamlı SOC / AD Lab Pratiği (~60-90 dk) ---
    const labTaskItem = sim.labRoi
      ? labTask(sim.labRoi)
      : {
          id: `lab-soc-wazuh-${offset}`,
          kind: "lab" as const,
          baslik: "Sysmon + Wazuh / Splunk Lab Kurulumu ve Analizi",
          detay: "Gate B & Gate C için değerli SOC labı (v=3.0) · Sysmon/WinEvent log analizi",
          saat: 1.25,
        };
    if (tryAdd(labTaskItem)) {
      sim.labUsed = true;
    } else if (offset < 3) {
      if (nextCarry.length < MAX_CARRY) nextCarry.push(labTaskItem);
      tasima += 1;
    }
  }

  // 4. Dil kanalı — ayrı kapasite (hoursLang / 7); Konu günlerinde öncelikli
  const langRemaining = langKapasite - sim.langUsed;
  if (langRemaining >= DIL_SAAT && (dayType === "A" || langRemaining >= DIL_SAAT * 2)) {
    const dilItem = dilTask(offset, "de");
    if (langRemaining >= dilItem.saat) {
      tasks.push(dilItem);
      sim.langUsed += dilItem.saat;
    }
  }

  // Taşıma listesini tavanla sınırla (max 2 görev)
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
    const dailyCapBase = Math.min(2, Math.max(0.75, dailyCyber));
    const dailyLang = Math.max(0, state.tempo.hoursLang / 7);

    const overdue = state.retrieval.filter((r) => isRetrievalDue(r, d.nowMs));
    const futureRetrieval = state.retrieval
      .filter((r) => !isRetrievalDue(r, d.nowMs))
      .map((r) => ({ item: r, dueOffset: daysUntilDue(r, d.nowMs) }));

    const studyList = studyCandidates(alan, getStatus, queueKeys);
    const nextStudy = studyList[0] ?? null;
    const temelLists: Record<string, CurriculumTopic[]> = {};
    for (const a of FOUNDATION_ALANS) {
      temelLists[a] = studyCandidates(a, getStatus, queueKeys);
    }
    const temelAlanOrder = foundationAlanOrder(state.skills);
    const temelIdxByAlan: Record<string, number> = {};
    for (const a of FOUNDATION_ALANS) temelIdxByAlan[a] = 0;
    const nextTemel = pickTemelTopic(
      { temelAlanOrder, temelAlanRotate: 0, temelIdxByAlan, carry: [], bottleneckStudyIdx: 0, bottleneckStudyList: [], retrieval: [], labRoi: null, labUsed: false, langUsed: 0 },
      temelLists,
    );
    const labRoi = pickLabRoi(d.roiList);

    const persistedCarry = (state.scheduleCarry ?? [])
      .filter((c) => daysSince(c.sinceIso, d.nowMs) <= MAX_CARRY_AGE_DAYS)
      .slice(-MAX_CARRY)
      .map(carryToTask);

    const sim0: SimState = {
      carry: persistedCarry,
      bottleneckStudyIdx: 0,
      bottleneckStudyList: studyList,
      temelIdxByAlan,
      temelAlanRotate: 0,
      temelAlanOrder,
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
      if (offset === 0) {
        if (d.geriDonusModu) kapasite = 0.25;
        else if (d.pmc.tsb < -20) kapasite = 0.25;
      }

      const tekrarLim = offset === 0 ? (dayType === "A" ? MODEL.tekrar.kuyrukTavani : 2) : 2;
      const { tasks, tasima, sim: nextSim } = packDay(
        offset,
        sim,
        temelLists,
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
                  baslik: "Hafif tekrar veya dinlen",
                  detay: "Yorgunluk yüksek",
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
    const todayDayTypeLabel = days[0]?.dayTypeLabel ?? "Konu Günü";
    const bugunFromSchedule = days[0]?.tasks ?? [];

    const bugunGorevler: BugunGorev[] = (() => {
      if (d.geriDonusModu) {
        return [
          {
            id: "donus-tekrar",
            kind: "tekrar",
            kindLabel: KIND_LABEL.tekrar,
            baslik:
              overdue.length > 0
                ? `${Math.min(overdue.length, MODEL.tekrar.kuyrukTavani)} konu tekrarı`
                : "15 dk hafif pratik",
            detay: "Geri dönüş modu",
            saat: 0.25,
            sure: "~15 dk",
            dayType: todayDayType,
            dayTypeLabel: todayDayTypeLabel,
            neden: "Birkaç gündür ara var — önce hafif başla.",
          },
        ];
      }

      if (bugunFromSchedule.length > 0) {
        return bugunFromSchedule.map((t) => ({
          ...t,
          kindLabel: KIND_LABEL[t.kind],
          sure: formatSure(t.saat),
          dayType: todayDayType,
          dayTypeLabel: todayDayTypeLabel,
          neden: t.carried
            ? "Dünden kalan taşınan görev — öncelikle tamamlanması önerilir."
            : t.kind === "tekrar"
              ? "FSRS vadesi geldi; unutma hazırlığı düşürür."
              : t.kind === "temel"
                ? `${ALAN_LABEL[t.alan ?? ""] ?? t.alan ?? "Temel"} zemin — Oak sırasıyla ilerlenir.`
                : t.kind === "konu"
                  ? `${alanLabel} zayıf alanında sıradaki müfredat konusu.`
                  : t.kind === "lab"
                    ? "Kapsamlı lab / SOC pratiği — Gate B & C için portföy kanıtı üretir."
                    : t.kind === "dil"
                      ? "Günlük dil kapasitesi — Almanca hedefi için düzenli pratik."
                      : undefined,
        }));
      }

      const fallback: BugunGorev[] = [];
      if (overdue.length) {
        const lim = todayDayType === "A" ? MODEL.tekrar.kuyrukTavani : 2;
        fallback.push({
          ...tekrarTask(overdue[0], Math.min(overdue.length, lim)),
          kindLabel: KIND_LABEL.tekrar,
          sure: formatSure(TEKRAR_SAAT * Math.min(overdue.length, lim)),
          dayType: todayDayType,
          dayTypeLabel: todayDayTypeLabel,
          neden: "Vadesi geçmiş tekrarlar öncelikli.",
        });
      }
      if (todayDayType === "A") {
        if (nextTemel) {
          fallback.push({
            ...temelTask(nextTemel),
            kindLabel: KIND_LABEL.temel,
            sure: formatSure(KONU_SAAT),
            dayType: todayDayType,
            dayTypeLabel: todayDayTypeLabel,
            neden: `${ALAN_LABEL[nextTemel.alan] ?? nextTemel.alan} temeli — günlük zemin.`,
          });
        }
        if (nextStudy) {
          fallback.push({
            ...zayifAlanTask(nextStudy),
            kindLabel: KIND_LABEL.konu,
            sure: formatSure(KONU_SAAT),
            dayType: todayDayType,
            dayTypeLabel: todayDayTypeLabel,
            neden: `${alanLabel} zayıf alanında yeni konu.`,
          });
        }
      } else {
        const labItem = labRoi ? labTask(labRoi) : {
          id: "lab-soc-wazuh-fallback",
          kind: "lab" as const,
          baslik: "Sysmon + Wazuh / Splunk Lab Kurulumu ve Analizi",
          detay: "Gate B & Gate C için değerli SOC labı (v=3.0)",
          saat: 1.25,
        };
        fallback.push({
          ...labItem,
          kindLabel: KIND_LABEL.lab,
          sure: formatSure(labItem.saat),
          dayType: todayDayType,
          dayTypeLabel: todayDayTypeLabel,
          neden: "Kapsamlı SOC lab pratiği — Gate B & C için portföy kanıtı üretir.",
        });
      }
      return fallback;
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

    let konumMetni = "";
    if (edrDone && sonraIlk) {
      konumMetni = `EDR sonrası · sıradaki: ${sonraIlk.konu}`;
    } else if (nextStudy) {
      konumMetni = `${alanLabel} zayıf · ${nextStudy.konu}`;
      if (nextTemel) konumMetni += ` · temel: ${nextTemel.konu}`;
    } else if (nextTemel) {
      konumMetni = `Temel · ${nextTemel.konu}`;
    } else {
      konumMetni = `${alanLabel} alanında müfredat devam ediyor`;
    }

    const journey: JourneySnapshot = {
      konuTamamlanan: tamamlanan,
      konuToplam: OAK_COVERED.length,
      yuzde: Math.round((tamamlanan / Math.max(1, OAK_COVERED.length)) * 100),
      odakAlan: alan,
      odakAlanLabel: alanLabel,
      konumMetni,
      siradakiKonu: nextStudy?.konu ?? null,
      siradakiKonuId: nextStudy?.id ?? null,
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
  ]);
}
