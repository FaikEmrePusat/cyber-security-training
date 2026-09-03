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
  clamp,
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
  type SessionFormData,
  type Skill,
  type Tempo,
} from "./model";
import { OAK_BY_ID, topicKey } from "./data/oakCurriculum";
import { applySessionEvidence } from "./data/evidencePromote";
import { generateSessionNot } from "./components/sessionLogFormUtils";

const MAX_HISTORY = 50;
/** Coalesce consecutive keystrokes into one undo step (ms). */
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
  appendSessionFromForm: (form: SessionFormData) => void;
  completeScheduleTaskWithLog: (task: ScheduleTaskRef, form: SessionFormData) => void;
  completeScheduleTasksWithLogs: (items: Array<{ task: ScheduleTaskRef; form: SessionFormData }>) => void;
  promoteLogEvidence: (input: {
    title: string;
    url: string;
    kind?: string;
    alan?: string;
    tags?: string[];
  }) => void;
  /** State + log in one undo step (e.g. marking a review). */
  commitWithLog: (updater: (s: AppState) => AppState, rec: LogRecord) => void;
  resetSeed: () => void;
  importJsonl: (text: string) => number;
  clearPending: () => void;
  exportFullBackup: () => string;
  importFullBackup: (jsonText: string) => boolean;
};

const StoreContext = createContext<StoreApi | null>(null);

function newRetrievalId(): string {
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function sanitizeCarry(carryList: ScheduleCarryItem[], nowMs: number): ScheduleCarryItem[] {
  // Tasks older than 7 days return to curriculum pool to avoid debt snowball
  const fresh = carryList.filter((c) => daysSince(c.sinceIso, nowMs) <= MAX_CARRY_AGE_DAYS);
  // At most MAX_CARRY (2) tasks are carried
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

function formToLogRecord(form: SessionFormData): LogRecord {
  const not = form.not?.trim() || generateSessionNot(form);
  return {
    t: new Date().toISOString(),
    type: "session",
    alan: form.alan,
    mod: form.mod,
    dur_min: clamp(form.dakika, 1, 600),
    kalite: clamp(form.kalite, 0.3, 1),
    kanit: form.kanit?.trim() || undefined,
    kaynak: form.kaynak,
    konu: form.aktiviteCustom?.trim() || undefined,
    sonuc: form.tags?.length ? form.tags.join(", ") : undefined,
    tags: form.tags?.length ? form.tags : undefined,
    not,
  };
}

function applyEvidenceFromSession(
  s: AppState,
  task: ScheduleTaskRef,
  form: SessionFormData,
): AppState {
  const url = form.kanit?.trim();
  if (!url) return s;
  const promote = form.promoteEvidence !== false;
  const { state } = applySessionEvidence(s, {
    title: form.aktiviteCustom?.trim() || task.baslik || "Session evidence",
    url,
    kind: task.kind,
    alan: form.alan || task.alan,
    tags: form.tags,
    promote,
  });
  return state;
}

function applyScheduleTaskCompletion(
  s: AppState,
  task: ScheduleTaskRef,
  todayIso: string,
  nowMs: number,
  nowIso: string,
): AppState {
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
  /** Current state ref so stack is not corrupted during Strict Mode double-invoke. */
  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist locally only — personal tracker, no account / cloud sync.
  useEffect(() => {
    if (applyingHistoryRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const syncFlags = useCallback(() => {
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  /** Push current state onto stack before change. Coalesces within short interval. */
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
        // Allow undo inside inputs too (wrong score, etc.)
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
          (s) => applyScheduleTaskCompletion(s, task, todayIso, nowMs, nowIso),
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
      appendSessionFromForm: (form) => {
        const rec = formToLogRecord(form);
        commit(
          (s) => ({
            ...s,
            history: s.history.concat([rec]),
            pending: s.pending.concat([JSON.stringify(rec)]),
          }),
          { forceHistory: true },
        );
      },
      completeScheduleTaskWithLog: (task, form) => {
        const todayIso = new Date().toISOString().slice(0, 10);
        const nowMs = Date.now();
        const nowIso = new Date().toISOString();
        const rec = formToLogRecord(form);
        commit(
          (s) => {
            let next = applyScheduleTaskCompletion(s, task, todayIso, nowMs, nowIso);
            next = applyEvidenceFromSession(next, task, form);
            return {
              ...next,
              history: next.history.concat([rec]),
              pending: next.pending.concat([JSON.stringify(rec)]),
            };
          },
          { forceHistory: true },
        );
      },
      completeScheduleTasksWithLogs: (items) => {
        if (items.length === 0) return;
        const todayIso = new Date().toISOString().slice(0, 10);
        const nowMs = Date.now();
        const nowIso = new Date().toISOString();
        commit(
          (s) => {
            let next = s;
            const recs: LogRecord[] = [];
            for (const item of items) {
              next = applyScheduleTaskCompletion(next, item.task, todayIso, nowMs, nowIso);
              next = applyEvidenceFromSession(next, item.task, item.form);
              recs.push(formToLogRecord(item.form));
            }
            return {
              ...next,
              history: next.history.concat(recs),
              pending: next.pending.concat(recs.map((r) => JSON.stringify(r))),
            };
          },
          { forceHistory: true },
        );
      },
      promoteLogEvidence: (input) => {
        commit(
          (s) => applySessionEvidence(s, { ...input, promote: true }).state,
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
      exportFullBackup: () => {
        let curriculumMap: Record<string, string> = {};
        try {
          const raw = localStorage.getItem("durum-curriculum-v1");
          if (raw) curriculumMap = JSON.parse(raw);
        } catch {
          /* skip */
        }
        const payload = {
          version: "durum-v22",
          exportedAt: new Date().toISOString(),
          state,
          curriculum: curriculumMap,
        };
        return JSON.stringify(payload, null, 2);
      },
      importFullBackup: (jsonText: string) => {
        try {
          const parsed = JSON.parse(jsonText);
          const nextState = parsed.state ?? parsed;
          if (!nextState || !Array.isArray(nextState.skills)) {
            return false;
          }
          if (parsed.curriculum && typeof parsed.curriculum === "object") {
            try {
              localStorage.setItem("durum-curriculum-v1", JSON.stringify(parsed.curriculum));
              window.dispatchEvent(new Event("durum-curriculum-sync"));
            } catch {
              /* skip */
            }
          }
          commit(() => ({ ...createSeedState(), ...nextState }), { forceHistory: true });
          coalesceUntilRef.current = 0;
          return true;
        } catch {
          return false;
        }
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

/** Asymmetric latch: raising requires evidence ref. */
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
    return { ok: false, reason: "Evidence reference (file path / URL) required to raise." };
  }
  return {
    ok: true,
    skill: { ...skill, claimed: nextClaimed, evidence: nextEvidence, ref: nextRef },
  };
}
