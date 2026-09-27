import {
  STORAGE_KEY,
  bumpRev,
  mergeStates,
  migrateState,
  statesEquivalent,
  type UstaState,
} from 'usta-core'
import { getDeviceId } from './deviceId'
import { supabase, supabaseConfigured } from './supabase'

const PENDING_KEY = `${STORAGE_KEY}-pending`

export type SyncStatus = 'local-only' | 'signed-out' | 'synced' | 'pending' | 'error'

export function loadLocalState(): UstaState {
  let raw: unknown = null
  try {
    const text = localStorage.getItem(STORAGE_KEY)
    raw = text ? JSON.parse(text) : null
  } catch {
    raw = null
  }
  return migrateState(raw, getDeviceId())
}

export function saveLocalState(state: UstaState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/** Offline queue: the whole doc is the payload, so one flag is enough. */
export function markPending(): void {
  localStorage.setItem(PENDING_KEY, '1')
}

export function hasPending(): boolean {
  return localStorage.getItem(PENDING_KEY) === '1'
}

function clearPending(): void {
  localStorage.removeItem(PENDING_KEY)
}

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.user.id ?? null
}

async function upsertRemote(userId: string, state: UstaState): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('usta_state').upsert({
    user_id: userId,
    doc: state,
    rev: state.rev,
    updated_at: state.updatedAt,
  })
  return !error
}

/**
 * Merge a remote doc into the local cache. Returns the merged state and
 * whether the cloud copy is missing something local has.
 */
export function mergeRemote(remoteRaw: unknown): { merged: UstaState; needsPush: boolean } {
  const deviceId = getDeviceId()
  const local = loadLocalState()
  const remote = migrateState(remoteRaw, deviceId)
  let merged = migrateState(mergeStates(local, remote), deviceId)
  const needsPush = hasPending() || !statesEquivalent(merged, remote)
  if (needsPush && merged.rev <= remote.rev) merged = bumpRev(merged, deviceId)
  saveLocalState(merged)
  return { merged, needsPush }
}

/**
 * Pull → merge → push-if-needed. Safe to call repeatedly (reconnect, focus,
 * after each local write). Converges because floor merge is monotone and a
 * push only happens when local differs from cloud.
 */
export async function syncNow(): Promise<{ state: UstaState; status: SyncStatus }> {
  if (!supabaseConfigured || !supabase) return { state: loadLocalState(), status: 'local-only' }
  const userId = await currentUserId()
  if (!userId) return { state: loadLocalState(), status: 'signed-out' }
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { state: loadLocalState(), status: hasPending() ? 'pending' : 'synced' }
  }

  const { data, error } = await supabase
    .from('usta_state')
    .select('doc')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return { state: loadLocalState(), status: 'error' }

  if (!data?.doc) {
    const local = loadLocalState()
    const ok = await upsertRemote(userId, local)
    if (ok) clearPending()
    return { state: local, status: ok ? 'synced' : 'pending' }
  }

  const { merged, needsPush } = mergeRemote(data.doc)
  if (!needsPush) {
    clearPending()
    return { state: merged, status: 'synced' }
  }
  const ok = await upsertRemote(userId, merged)
  if (ok) clearPending()
  else markPending()
  return { state: merged, status: ok ? 'synced' : 'pending' }
}

/** Realtime: merge whenever this user's row changes on another device. */
export function subscribeRemote(
  userId: string,
  onRemote: (merged: UstaState, needsPush: boolean) => void,
): () => void {
  if (!supabase) return () => {}
  const client = supabase
  const channel = client
    .channel(`usta_state:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'usta_state', filter: `user_id=eq.${userId}` },
      (payload) => {
        const doc = (payload.new as { doc?: unknown } | null)?.doc
        if (!doc) return
        const { merged, needsPush } = mergeRemote(doc)
        onRemote(merged, needsPush)
      },
    )
    .subscribe()
  return () => {
    void client.removeChannel(channel)
  }
}
