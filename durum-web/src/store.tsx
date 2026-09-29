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
  isRetrievalDue,
  nextStability,
  clamp,
  normalizeLoadedState,
  sanitizeCarry,
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
import { applySessionEvidence, applyKayitNoteEvidence, isPublicHttpUrl } from "./data/evidencePromote";
import { mergeEvidenceUrls, mergeSources } from "./data/sessionMultiFields";
import { generateSessionNot } from "./components/sessionLogFormUtils";
import { bumpSyncMeta, buildCloudDoc, importSelfChecks } from "./lib/cloudDoc";
import {
  applyCloudExtras,
  markPending,
  subscribeRemote,
  syncNow,
  type SyncStatus,
} from "./lib/cloudSync";
import { supabase, supabaseConfigured } from "./lib/supabase";

const MAX_HISTORY = 50;
const CLOUD_DEBOUNCE_MS = 900;
/** Coalesce consecutive keystrokes into one undo step (ms). */
const COALESCE_MS = 800;

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
  /** Self-check written notes → kayit (record) evidence on skill + portfolio artifact. */
  registerSelfCheckEvidence: (topic: string, alan?: string) => void;
  /** State + log in one undo step (e.g. marking a review). */
  commitWithLog: (updater: (s: AppState) => AppState, rec: LogRecord) => void;
  resetSeed: () => void;
  importJsonl: (text: string) => number;
  clearPending: () => void;
  exportFullBackup: () => string;
  importFullBackup: (jsonText: string) => boolean;
  /** Cloud sync (Supabase). Offline / signed-out still keep localStorage. */
  syncStatus: SyncStatus;
  syncEmail: string | null;
  refreshCloud: () => Promise<void>;
};

const StoreContext = createContext<StoreApi | null>(null);

function newRetrievalId(): string {
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
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
  const sources = mergeSources(form.kaynak, form.extraSources);
  const evidenceUrls = mergeEvidenceUrls(form.kanit, form.evidenceUrls);
  return {
    t: new Date().toISOString(),
    type: "session",
    alan: form.alan,
    mod: form.mod,
    dur_min: clamp(form.dakika, 1, 600),
    kalite: clamp(form.kalite, 0.3, 1),
    kanit: evidenceUrls[0],
    evidenceUrls: evidenceUrls.length > 0 ? evidenceUrls : undefined,
    kaynak: sources[0] ?? form.kaynak,
    sources: sources.length > 0 ? sources : undefined,
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
  const urls = mergeEvidenceUrls(form.kanit, form.evidenceUrls);
  if (urls.length === 0) return s;
  const promote = form.promoteEvidence !== false;
  const baseTitle = form.aktiviteCustom?.trim() || task.baslik || "Session evidence";
  const alan = form.alan || task.alan;
  let next = s;
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]!;
    if (isPublicHttpUrl(url)) {
      const { state } = applySessionEvidence(next, {
        title: urls.length > 1 ? `${baseTitle} (${i + 1})` : baseTitle,
        url,
        kind: task.kind,
        alan,
        tags: form.tags,
        promote,
      });
      next = state;
      continue;
    }
    // Local paths and self-check:… refs count as kayit (record) evidence.
    const { state } = applyKayitNoteEvidence(next, {
      title: url.startsWith("self-check:")
        ? `Self-check: ${url.slice("self-check:".length)}`.slice(0, 100)
        : urls.length > 1
          ? `${baseTitle} (${i + 1})`
          : baseTitle,
      ref: url,
      alan,
    });
    next = state;
  }
  return next;
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
    return normalizeLoadedState(JSON.parse(raw));
  } catch {
    return createSeedState();
  }
}

export function DurumProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    supabaseConfigured ? "signed-out" : "local-only",
  );
  const [syncEmail, setSyncEmail] = useState<string | null>(null);

  const pastRef = useRef<AppState[]>([]);
  const futureRef = useRef<AppState[]>([]);
  const coalesceUntilRef = useRef(0);
  const applyingHistoryRef = useRef(false);
  const applyingRemoteRef = useRef(false);
  const syncTimerRef = useRef(0);
  const syncingRef = useRef(false);
  const syncAgainRef = useRef(false);
  /** Current state ref so stack is not corrupted during Strict Mode double-invoke. */
  const stateRef = useRef(state);
  stateRef.current = state;

  const runCloudSync = useCallback(async () => {
    if (!supabaseConfigured) {
      setSyncStatus("local-only");
      return;
    }
    if (syncingRef.current) {
      syncAgainRef.current = true;
      return;
    }
    syncingRef.current = true;
    try {
      do {
        syncAgainRef.current = false;
        const result = await syncNow(stateRef.current);
        setSyncStatus(result.status);
        if (result.replacedLocal) {
          applyingRemoteRef.current = true;
          stateRef.current = result.state;
          setState(result.state);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.state));
        }
      } while (syncAgainRef.current);
    } catch {
      setSyncStatus("error");
    } finally {
      syncingRef.current = false;
    }
  }, []);

  const scheduleCloudSync = useCallback(() => {
    if (!supabaseConfigured || applyingRemoteRef.current) return;
    bumpSyncMeta();
    markPending();
    setSyncStatus((s) => (s === "local-only" || s === "signed-out" ? s : "pending"));
    window.clearTimeout(syncTimerRef.current);
    syncTimerRef.current = window.setTimeout(() => {
      void runCloudSync();
    }, CLOUD_DEBOUNCE_MS);
  }, [runCloudSync]);

  // Persist locally; signed-in sessions also push to Supabase (debounced).
  useEffect(() => {
    if (applyingHistoryRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (applyingRemoteRef.current) {
      applyingRemoteRef.current = false;
      return;
    }
    scheduleCloudSync();
  }, [state, scheduleCloudSync]);

  useEffect(() => {
    if (!supabase) return;
    let unsubRealtime: (() => void) | undefined;

    const bindUser = (userId: string | null, email: string | null) => {
      unsubRealtime?.();
      unsubRealtime = undefined;
      setSyncEmail(email);
      if (!userId) {
        setSyncStatus(supabaseConfigured ? "signed-out" : "local-only");
        return;
      }
      void runCloudSync();
      unsubRealtime = subscribeRemote(userId, (doc) => {
        applyCloudExtras(doc);
        applyingRemoteRef.current = true;
        stateRef.current = doc.state;
        setState(doc.state);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doc.state));
        setSyncStatus("synced");
      });
    };

    void supabase.auth.getSession().then(({ data }) => {
      bindUser(data.session?.user.id ?? null, data.session?.user.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      bindUser(session?.user.id ?? null, session?.user.email ?? null);
    });

    const onFocus = () => {
      if (document.visibilityState === "visible") void runCloudSync();
    };
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onFocus);

    return () => {
      unsubRealtime?.();
      sub.subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onFocus);
      window.clearTimeout(syncTimerRef.current);
    };
  }, [runCloudSync]);

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
      registerSelfCheckEvidence: (topic, alan) => {
        const t = topic.trim();
        if (!t) return;
        const ref = `self-check:${t}`;
        commit(
          (s) =>
            applyKayitNoteEvidence(s, {
              title: `Self-check: ${t}`.slice(0, 100),
              ref,
              alan,
            }).state,
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
        const doc = buildCloudDoc(state);
        const payload = {
          version: "durum-v22",
          exportedAt: new Date().toISOString(),
          state: doc.state,
          curriculum: doc.curriculum,
          selfChecks: doc.selfChecks,
          sync: { rev: doc.rev, updatedAt: doc.updatedAt },
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
          if (parsed.selfChecks && typeof parsed.selfChecks === "object") {
            importSelfChecks(parsed.selfChecks);
          }
          commit(() => normalizeLoadedState(nextState), { forceHistory: true });
          coalesceUntilRef.current = 0;
          return true;
        } catch {
          return false;
        }
      },
      syncStatus,
      syncEmail,
      refreshCloud: () => runCloudSync(),
    }),
    [state, canUndo, canRedo, undo, redo, patch, commit, syncStatus, syncEmail, runCloudSync],
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
