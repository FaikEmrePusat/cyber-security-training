import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  STORAGE_KEY,
  createSeedState,
  MODEL,
  daysSince,
  isRetrievalDue,
  nextStability,
  type AppState,
  type Artifact,
  type CareerItem,
  type ChancenkarteState,
  type EvidenceTier,
  type LangState,
  type LogRecord,
  type RetrievalItem,
  type ScheduleCarryItem,
  type ScheduleTaskRef,
  type SessionDraft,
  type Skill,
  type Tempo,
} from "./model";
import { OAK_BY_ID, topicKey } from "./data/oakCurriculum";

const MAX_HISTORY = 50;
/** Ardışık tuş vuruşlarını tek geri alma adımında birleştir (ms). */
const COALESCE_MS = 800;
const MAX_CARRY = MODEL.carry?.maxCarry ?? 2;
const MAX_CARRY_AGE_DAYS = MODEL.carry?.maxAgeDays ?? 7;

type StoreApi = {
  state: AppState;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  setSkills: (fn: (s: Skill[]) => Skill[]) => void;
  setArtifacts: (fn: (a: Artifact[]) => Artifact[]) => void;
  setLang: (fn: (l: LangState) => LangState) => void;
  setCareer: (fn: (c: CareerItem[]) => CareerItem[]) => void;
  setTempo: (fn: (t: Tempo) => Tempo) => void;
  setRetrieval: (fn: (r: RetrievalItem[]) => RetrievalItem[]) => void;
  setHistory: (fn: (h: LogRecord[]) => LogRecord[]) => void;
  setPending: (fn: (p: string[]) => string[]) => void;
  setScheduleCarry: (fn: (c: ScheduleCarryItem[]) => ScheduleCarryItem[]) => void;
  completeScheduleTask: (task: ScheduleTaskRef) => void;
  deferScheduleTask: (item: ScheduleCarryItem) => void;
  clearScheduleCarry: () => void;
  recycleScheduleCarry: (taskId?: string) => void;
  setChancenkarte: (fn: (c: ChancenkarteState) => ChancenkarteState) => void;
  setDraft: (fn: (d: SessionDraft) => SessionDraft) => void;
  appendLog: (rec: LogRecord) => void;
  /** State + log tek undo adımında (ör. tekrar işaretleme). */
  commitWithLog: (updater: (s: AppState) => AppState, rec: LogRecord) => void;
  resetSeed: () => void;
  importJsonl: (text: string) => number;
  clearPending: () => void;
};

const StoreContext = createContext<StoreApi | null>(null);

function newRetrievalId(): string {
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function sanitizeCarry(carryList: ScheduleCarryItem[], nowMs: number): ScheduleCarryItem[] {
  // 7 günden eski görevler borç kar topu yapmaması için müfredat havuzuna döner
  const fresh = carryList.filter((c) => daysSince(c.sinceIso, nowMs) <= MAX_CARRY_AGE_DAYS);
  // En fazla MAX_CARRY (2) görev taşınır
  return fresh.slice(-MAX_CARRY);
}

function dismissTaskToday(s: AppState, taskId: string, todayIso: string): AppState {
  const completed = s.scheduleCompletedToday?.[todayIso] ?? [];
  if (completed.includes(taskId)) {
    return {
      ...s,
      scheduleCarry: s.scheduleCarry.filter((c) => c.id !== taskId),
    };
  }
  return {
    ...s,
    scheduleCarry: s.scheduleCarry.filter((c) => c.id !== taskId),
    scheduleCompletedToday: {
      ...(s.scheduleCompletedToday ?? {}),
      [todayIso]: [...completed, taskId],
    },
  };
}

function applyRetrievalReview(item: RetrievalItem, nowIso: string): RetrievalItem {
  const next = nextStability(item, "basarili");
  return { ...item, stability: next.s, ef: next.ef, n: next.n, lastIso: nowIso };
}

function cloneState(s: AppState): AppState {
  return JSON.parse(JSON.stringify(s)) as AppState;
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed?.skills?.length) return createSeedState();
    const sanitizedCarry = sanitizeCarry(parsed.scheduleCarry ?? [], Date.now());
    return { ...createSeedState(), ...parsed, scheduleCarry: sanitizedCarry, scheduleCompletedToday: parsed.scheduleCompletedToday ?? {} };
  } catch {
    return createSeedState();
  }
}

export function DurumProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pastRef = useRef<AppState[]>([]);
  const futureRef = useRef<AppState[]>([]);
  const coalesceUntilRef = useRef(0);
  const applyingHistoryRef = useRef(false);
  /** Strict Mode setState double-invoke sırasında yığın bozulmasın diye güncel state. */
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (applyingHistoryRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const syncFlags = useCallback(() => {
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  /** Değişiklikten önce mevcut state'i yığına koy. Kısa aralıkta birleşir. */
  const pushPast = useCallback(
    (current: AppState, force = false) => {
      if (applyingHistoryRef.current) return;
      const now = Date.now();
      if (!force && now < coalesceUntilRef.current) {
        return;
      }
      pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), cloneState(current)];
      futureRef.current = [];
      coalesceUntilRef.current = now + COALESCE_MS;
      syncFlags();
    },
    [syncFlags],
  );

  const commit = useCallback(
    (updater: (s: AppState) => AppState, opts?: { forceHistory?: boolean }) => {
      const current = stateRef.current;
      pushPast(current, opts?.forceHistory);
      const next = updater(current);
      stateRef.current = next;
      setState(next);
    },
    [pushPast],
  );

  const undo = useCallback(() => {
    const prev = pastRef.current[pastRef.current.length - 1];
    if (!prev) return;
    const current = stateRef.current;
    pastRef.current = pastRef.current.slice(0, -1);
    futureRef.current = [...futureRef.current, cloneState(current)];
    applyingHistoryRef.current = true;
    const restored = cloneState(prev);
    stateRef.current = restored;
    setState(restored);
    coalesceUntilRef.current = 0;
    queueMicrotask(() => {
      applyingHistoryRef.current = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
      syncFlags();
    });
    syncFlags();
  }, [syncFlags]);

  const redo = useCallback(() => {
    const next = futureRef.current[futureRef.current.length - 1];
    if (!next) return;
    const current = stateRef.current;
    futureRef.current = futureRef.current.slice(0, -1);
    pastRef.current = [...pastRef.current, cloneState(current)];
    applyingHistoryRef.current = true;
    const restored = cloneState(next);
    stateRef.current = restored;
    setState(restored);
    coalesceUntilRef.current = 0;
    queueMicrotask(() => {
      applyingHistoryRef.current = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
      syncFlags();
    });
    syncFlags();
  }, [syncFlags]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable;
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        // Input içinde de geri alma istiyoruz (yanlış skor vs.)
        e.preventDefault();
        undo();
        return;
      }
      if (key === "y" || (key === "z" && e.shiftKey)) {
        e.preventDefault();
        redo();
        return;
      }
      // typing unused — kept for clarity that we intentionally override even in inputs
      void typing;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const patch = useCallback(
    <K extends keyof AppState>(key: K, fn: (v: AppState[K]) => AppState[K], force = false) => {
      commit((s) => ({ ...s, [key]: fn(s[key]) }), { forceHistory: force });
    },
    [commit],
  );

  const api = useMemo<StoreApi>(
    () => ({
      state,
      canUndo,
      canRedo,
      undo,
      redo,
      setSkills: (fn) => patch("skills", fn, true),
      setArtifacts: (fn) => patch("artifacts", fn, true),
      setLang: (fn) => patch("lang", fn, true),
      setCareer: (fn) => patch("career", fn, true),
      setTempo: (fn) => patch("tempo", fn),
      setRetrieval: (fn) => patch("retrieval", fn, true),
      setHistory: (fn) => patch("history", fn, true),
      setPending: (fn) => patch("pending", fn, true),
      setScheduleCarry: (fn) => patch("scheduleCarry", fn, true),
      completeScheduleTask: (task) => {
        const todayIso = new Date().toISOString().slice(0, 10);
        const nowMs = Date.now();
        const nowIso = new Date().toISOString();
        commit(
          (s) => {
            let next = dismissTaskToday(s, task.id, todayIso);

            if (task.kind === "tekrar") {
              if (task.id.startsWith("tekrar-batch-")) {
                const overdueIds = new Set(
                  next.retrieval.filter((r) => isRetrievalDue(r, nowMs)).map((r) => r.id),
                );
                next = {
                  ...next,
                  retrieval: next.retrieval.map((r) =>
                    overdueIds.has(r.id) ? applyRetrievalReview(r, nowIso) : r,
                  ),
                };
              } else if (task.retrievalId) {
                next = {
                  ...next,
                  retrieval: next.retrieval.map((r) =>
                    r.id === task.retrievalId ? applyRetrievalReview(r, nowIso) : r,
                  ),
                };
              }
            } else if ((task.kind === "konu" || task.kind === "temel") && task.topicId) {
              const topic = OAK_BY_ID[task.topicId];
              if (topic) {
                const key = topicKey(topic.konu);
                const exists = next.retrieval.some((r) => topicKey(r.topic) === key);
                if (!exists) {
                  next = {
                    ...next,
                    retrieval: next.retrieval.concat([
                      {
                        id: newRetrievalId(),
                        topic: topic.konu,
                        alan: topic.alan,
                        difficulty: topic.zorluk,
                        n: 0,
                        stability: MODEL.tekrar.s0,
                        ef: MODEL.tekrar.ef0,
                        lastIso: nowIso,
                      },
                    ]),
                  };
                }
              }
            }

            return next;
          },
          { forceHistory: true },
        );
      },
      deferScheduleTask: (item) => {
        const todayIso = new Date().toISOString().slice(0, 10);
        commit(
          (s) => {
            const rest = s.scheduleCarry.filter((c) => c.id !== item.id);
            const combined = [...rest, { ...item, sinceIso: todayIso }];
            const sanitized = sanitizeCarry(combined, Date.now());
            const completed = s.scheduleCompletedToday?.[todayIso] ?? [];
            return {
              ...s,
              scheduleCarry: sanitized,
              scheduleCompletedToday: completed.includes(item.id)
                ? (s.scheduleCompletedToday ?? {})
                : {
                    ...(s.scheduleCompletedToday ?? {}),
                    [todayIso]: [...completed, item.id],
                  },
            };
          },
          { forceHistory: true },
        );
      },
      clearScheduleCarry: () => {
        commit(
          (s) => ({
            ...s,
            scheduleCarry: [],
          }),
          { forceHistory: true },
        );
      },
      recycleScheduleCarry: (taskId?: string) => {
        commit(
          (s) => ({
            ...s,
            scheduleCarry: taskId ? s.scheduleCarry.filter((c) => c.id !== taskId) : [],
          }),
          { forceHistory: true },
        );
      },
      setChancenkarte: (fn) => patch("chancenkarte", fn, true),
      setDraft: (fn) => patch("draft", fn),
      appendLog: (rec) => {
        commit(
          (s) => ({
            ...s,
            history: s.history.concat([rec]),
            pending: s.pending.concat([JSON.stringify(rec)]),
          }),
          { forceHistory: true },
        );
      },
      commitWithLog: (updater, rec) => {
        commit(
          (s) => {
            const next = updater(s);
            return {
              ...next,
              history: next.history.concat([rec]),
              pending: next.pending.concat([JSON.stringify(rec)]),
            };
          },
          { forceHistory: true },
        );
      },
      resetSeed: () => {
        commit(() => createSeedState(), { forceHistory: true });
        coalesceUntilRef.current = 0;
      },
      clearPending: () => patch("pending", () => [], true),
      importJsonl: (text) => {
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const recs: LogRecord[] = [];
        for (const line of lines) {
          try {
            recs.push(JSON.parse(line) as LogRecord);
          } catch {
            /* skip */
          }
        }
        if (recs.length) {
          commit(
            (s) => ({
              ...s,
              history: s.history.concat(recs),
              pending: s.pending.concat(recs.map((r) => JSON.stringify(r))),
            }),
            { forceHistory: true },
          );
        }
        return recs.length;
      },
    }),
    [state, canUndo, canRedo, undo, redo, patch, commit],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useDurum() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useDurum outside provider");
  return ctx;
}

/** Asimetrik mandal: yükseltmek için kanıt ref gerekir. */
export function tryRaiseSkill(
  skill: Skill,
  nextClaimed: number,
  nextEvidence: EvidenceTier,
  nextRef: string,
): { ok: true; skill: Skill } | { ok: false; reason: string } {
  const raising =
    nextClaimed > skill.claimed ||
    (nextEvidence !== skill.evidence &&
      ["yok", "kayit", "public"].indexOf(nextEvidence) > ["yok", "kayit", "public"].indexOf(skill.evidence));
  if (raising && !nextRef.trim()) {
    return { ok: false, reason: "Yükseltmek için kanıt referansı (dosya yolu / URL) zorunlu." };
  }
  return {
    ok: true,
    skill: { ...skill, claimed: nextClaimed, evidence: nextEvidence, ref: nextRef },
  };
}
