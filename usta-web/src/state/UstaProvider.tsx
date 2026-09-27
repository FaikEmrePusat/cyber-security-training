import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  applySnooze,
  bumpRev,
  calendarDateKey,
  computeNextAction,
  computePrayerTimes,
  markQueueDone,
  setEnergyLow,
  unmarkFloorDone,
  clearFloorDay,
  type FloorItemId,
  type LedgerBridge,
  type NextAction,
  type UstaState,
} from 'usta-core'
import { getDeviceId } from '../lib/deviceId'
import {
  loadLocalState,
  markPending,
  saveLocalState,
  subscribeRemote,
  syncNow,
  type SyncStatus,
} from '../lib/storage'
import { supabase, supabaseConfigured } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

type UstaContextValue = {
  state: UstaState
  action: NextAction
  session: Session | null
  cloudReady: boolean
  syncStatus: SyncStatus
  tick: number
  canUndoDone: boolean
  setState: (next: UstaState) => void
  markDone: () => void
  undoLastDone: () => boolean
  unmarkDoneItem: (item: FloorItemId) => boolean
  clearTodayDones: () => boolean
  refreshLedgerBridge: (ledgerBaseUrl?: string) => Promise<{ ok: boolean; message: string }>
  snooze: () => { ok: boolean; reason?: string }
  energyLow: () => void
  refreshCloud: () => Promise<void>
}

const UstaContext = createContext<UstaContextValue | null>(null)

const FLOOR_IDS: FloorItemId[] = [
  'ledger_touch',
  'german_block',
  'faith_quran',
  'faith_cevsen',
  'faith_other',
  'books_pages',
  'music_play',
  'project_deep',
  'content_batch',
  'content_publish',
]

export function UstaProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<UstaState>(() => loadLocalState())
  const [session, setSession] = useState<Session | null>(null)
  const [tick, setTick] = useState(0)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    supabaseConfigured ? 'signed-out' : 'local-only',
  )
  const syncing = useRef(false)
  const syncAgain = useRef(false)
  /** Snapshot before the last Done — one-step undo. */
  const undoSnapshot = useRef<UstaState | null>(null)
  const [canUndoDone, setCanUndoDone] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  const runSync = useCallback(async () => {
    if (!supabaseConfigured) return
    if (syncing.current) {
      syncAgain.current = true
      return
    }
    syncing.current = true
    try {
      do {
        syncAgain.current = false
        const result = await syncNow()
        setStateRaw(result.state)
        setSyncStatus(result.status)
      } while (syncAgain.current)
    } catch {
      setSyncStatus('error')
    } finally {
      syncing.current = false
    }
  }, [])

  const commit = useCallback(
    (next: UstaState) => {
      setStateRaw(next)
      saveLocalState(next)
      if (!supabaseConfigured) return
      markPending()
      setSyncStatus((s) => (s === 'signed-out' ? s : 'pending'))
      void runSync()
    },
    [runSync],
  )

  /** Edits from other pages invalidate the Undo snapshot, or Undo would roll them back too. */
  const setState = useCallback(
    (next: UstaState) => {
      undoSnapshot.current = null
      setCanUndoDone(false)
      commit(next)
    },
    [commit],
  )

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id ?? null

  useEffect(() => {
    if (!userId) {
      if (supabaseConfigured) setSyncStatus('signed-out')
      return
    }
    void runSync()
    const unsubscribe = subscribeRemote(userId, (merged, needsPush) => {
      setStateRaw(merged)
      if (needsPush) void runSync()
    })
    const onWake = () => {
      if (document.visibilityState === 'visible') void runSync()
    }
    window.addEventListener('online', onWake)
    document.addEventListener('visibilitychange', onWake)
    return () => {
      unsubscribe()
      window.removeEventListener('online', onWake)
      document.removeEventListener('visibilitychange', onWake)
    }
  }, [userId, runSync])

  const now = useMemo(() => new Date(), [tick, state])
  const prayers = useMemo(
    () => computePrayerTimes(now, state.config),
    [now, state.config],
  )
  const action = useMemo(
    () => computeNextAction(now, state, state.config, prayers),
    [now, state, prayers],
  )

  const markDone = useCallback(() => {
    const deviceId = getDeviceId()
    const dateKey = calendarDateKey(new Date(), state.config.timezone)
    undoSnapshot.current = structuredClone(state)
    setCanUndoDone(true)
    if (FLOOR_IDS.includes(action.id as FloorItemId)) {
      commit(markQueueDone(state, dateKey, action.id as FloorItemId, deviceId))
      return
    }
    const next = {
      ...state,
      snoozeUntil: null,
      rev: state.rev + 1,
      updatedAt: new Date().toISOString(),
      deviceId,
      actionHistory: [
        { at: new Date().toISOString(), actionId: action.id, title: action.title },
        ...state.actionHistory,
      ].slice(0, 50),
    }
    commit(next)
  }, [action, commit, state])

  /** Undo the most recent queue Done (ignores cloud OR that used to resurrect Done). */
  const undoLastDone = useCallback(() => {
    const dateKey = calendarDateKey(new Date(), state.config.timezone)
    const day = state.floor[dateKey] ?? {}

    // Prefer explicit snapshot from this session's last Done
    if (undoSnapshot.current) {
      const snap = undoSnapshot.current
      undoSnapshot.current = null
      setCanUndoDone(false)
      const restored = {
        ...snap,
        rev: Math.max(state.rev, snap.rev) + 1,
        updatedAt: new Date().toISOString(),
        deviceId: getDeviceId(),
      }
      setState(restored)
      return true
    }

    // Fallback: unmark newest floor Done still set for today (from history)
    for (const h of state.actionHistory) {
      if (h.actionId.startsWith('undo:')) continue
      const id = h.actionId as FloorItemId
      if (!FLOOR_IDS.includes(id)) continue
      if (!day[id]) continue
      setState(unmarkFloorDone(state, dateKey, id, getDeviceId()))
      setCanUndoDone(false)
      return true
    }
    return false
  }, [setState, state])

  const unmarkDoneItem = useCallback(
    (item: FloorItemId) => {
      const dateKey = calendarDateKey(new Date(), state.config.timezone)
      if (!state.floor[dateKey]?.[item]) return false
      undoSnapshot.current = structuredClone(state)
      setCanUndoDone(true)
      commit(unmarkFloorDone(state, dateKey, item, getDeviceId()))
      return true
    },
    [commit, state],
  )

  const clearTodayDones = useCallback(() => {
    const dateKey = calendarDateKey(new Date(), state.config.timezone)
    const day = state.floor[dateKey]
    if (!day || Object.keys(day).length === 0) return false
    undoSnapshot.current = structuredClone(state)
    setCanUndoDone(true)
    commit(clearFloorDay(state, dateKey, getDeviceId()))
    return true
  }, [commit, state])

  const snooze = useCallback(() => {
    if (action.kind === 'oak' || action.kind === 'transition') {
      return { ok: false, reason: 'Oak is a hard container — snooze is not available now.' }
    }
    const dateKey = calendarDateKey(new Date(), state.config.timezone)
    const result = applySnooze(state, dateKey, getDeviceId())
    if (result.ok) commit(result.state)
    return { ok: result.ok, reason: result.reason }
  }, [action.kind, commit, state])

  const energyLow = useCallback(() => {
    const dateKey = calendarDateKey(new Date(), state.config.timezone)
    commit(setEnergyLow(state, dateKey, getDeviceId()))
  }, [commit, state])

  const refreshCloud = useCallback(() => runSync(), [runSync])

  const refreshLedgerBridge = useCallback((ledgerBaseUrl?: string): Promise<{ ok: boolean; message: string }> => {
    return new Promise((resolve) => {
      const base = (ledgerBaseUrl ?? stateRef.current.config.ledgerBaseUrl).replace(/\/$/, '')
      const url = `${base}/#/usta-bridge`
      const popup = window.open(url, 'usta-ledger-bridge', 'width=480,height=640')
      if (!popup) {
        resolve({
          ok: false,
          message: 'Popup blocked. Allow popups for this site, then try again. Ledger must be running (e.g. localhost:5173).',
        })
        return
      }

      let settled = false
      const finish = (ok: boolean, message: string) => {
        if (settled) return
        settled = true
        window.clearTimeout(timer)
        window.removeEventListener('message', onMessage)
        try {
          popup.close()
        } catch {
          /* ignore */
        }
        resolve({ ok, message })
      }

      const onMessage = (event: MessageEvent) => {
        const data = event.data as {
          type?: string
          dateKey?: string
          updatedAt?: string
          tasks?: LedgerBridge['tasks']
        }
        if (!data || data.type !== 'usta-ledger-bridge-v1') return
        if (!data.dateKey || !Array.isArray(data.tasks)) {
          finish(false, 'Ledger sent an empty bridge payload.')
          return
        }
        const bridge: LedgerBridge = {
          dateKey: data.dateKey,
          updatedAt: data.updatedAt ?? new Date().toISOString(),
          tasks: data.tasks,
        }
        setState(bumpRev({ ...stateRef.current, ledgerBridge: bridge }, getDeviceId()))
        finish(
          true,
          `Pulled ${bridge.tasks.length} Today task(s) from Ledger. Cyber/German commands on Now will show those titles.`,
        )
      }

      window.addEventListener('message', onMessage)
      const timer = window.setTimeout(() => {
        finish(
          false,
          'Timed out waiting for Ledger. Is Cyber Ledger running at the URL in Settings?',
        )
      }, 12_000)
    })
  }, [setState])

  const value: UstaContextValue = {
    state,
    action,
    session,
    cloudReady: supabaseConfigured,
    syncStatus,
    tick,
    canUndoDone,
    setState,
    markDone,
    undoLastDone,
    unmarkDoneItem,
    clearTodayDones,
    refreshLedgerBridge,
    snooze,
    energyLow,
    refreshCloud,
  }

  return <UstaContext.Provider value={value}>{children}</UstaContext.Provider>
}

export function useUsta(): UstaContextValue {
  const ctx = useContext(UstaContext)
  if (!ctx) throw new Error('useUsta outside provider')
  return ctx
}
