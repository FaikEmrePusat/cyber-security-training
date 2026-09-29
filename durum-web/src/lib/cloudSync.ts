import type { AppState } from "../model";
import {
  buildCloudDoc,
  cloudDocNewer,
  importSelfChecks,
  loadSyncMeta,
  parseCloudDoc,
  saveCurriculumMap,
  saveSyncMeta,
  type LedgerCloudDoc,
} from "./cloudDoc";
import { getDeviceId } from "./deviceId";
import { supabase, supabaseConfigured } from "./supabase";

const PENDING_KEY = "durum-v22-sync-pending";
const TABLE = "ledger_state";

export type SyncStatus = "local-only" | "signed-out" | "synced" | "pending" | "error";

export function markPending(): void {
  localStorage.setItem(PENDING_KEY, "1");
}

export function hasPending(): boolean {
  return localStorage.getItem(PENDING_KEY) === "1";
}

function clearPending(): void {
  localStorage.removeItem(PENDING_KEY);
}

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

async function upsertRemote(userId: string, doc: LedgerCloudDoc): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(TABLE).upsert({
    user_id: userId,
    doc,
    rev: doc.rev,
    updated_at: doc.updatedAt,
  });
  return !error;
}

export function applyCloudExtras(doc: LedgerCloudDoc): void {
  saveSyncMeta({
    rev: doc.rev,
    updatedAt: doc.updatedAt,
    deviceId: getDeviceId(),
  });
  saveCurriculumMap(doc.curriculum);
  importSelfChecks(doc.selfChecks);
}

export type SyncApply = {
  state: AppState;
  status: SyncStatus;
  replacedLocal: boolean;
};

/**
 * Pull → last-write-wins on the whole snapshot → push if local is ahead or pending.
 * Self-checks + curriculum ride inside the same doc.
 */
export async function syncNow(localState: AppState): Promise<SyncApply> {
  if (!supabaseConfigured || !supabase) {
    return { state: localState, status: "local-only", replacedLocal: false };
  }
  const userId = await currentUserId();
  if (!userId) return { state: localState, status: "signed-out", replacedLocal: false };
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { state: localState, status: hasPending() ? "pending" : "synced", replacedLocal: false };
  }

  const localDoc = buildCloudDoc(localState);

  const { data, error } = await supabase.from(TABLE).select("doc").eq("user_id", userId).maybeSingle();
  if (error) return { state: localState, status: "error", replacedLocal: false };

  if (!data?.doc) {
    const ok = await upsertRemote(userId, localDoc);
    if (ok) clearPending();
    else markPending();
    return { state: localState, status: ok ? "synced" : "pending", replacedLocal: false };
  }

  const remote = parseCloudDoc(data.doc);
  if (!remote) {
    const ok = await upsertRemote(userId, localDoc);
    if (ok) clearPending();
    else markPending();
    return { state: localState, status: ok ? "synced" : "pending", replacedLocal: false };
  }

  if (cloudDocNewer(remote, localDoc)) {
    applyCloudExtras(remote);
    clearPending();
    return { state: remote.state, status: "synced", replacedLocal: true };
  }

  if (cloudDocNewer(localDoc, remote) || hasPending()) {
    const ok = await upsertRemote(userId, localDoc);
    if (ok) clearPending();
    else markPending();
    return { state: localState, status: ok ? "synced" : "pending", replacedLocal: false };
  }

  clearPending();
  return { state: localState, status: "synced", replacedLocal: false };
}

export function subscribeRemote(userId: string, onRemote: (doc: LedgerCloudDoc) => void): () => void {
  if (!supabase) return () => {};
  const client = supabase;
  const channel = client
    .channel(`ledger_state:${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE, filter: `user_id=eq.${userId}` },
      (payload) => {
        const parsed = parseCloudDoc((payload.new as { doc?: unknown } | null)?.doc);
        if (!parsed) return;
        const localMeta = loadSyncMeta();
        const localAsDoc: LedgerCloudDoc = {
          version: "durum-v22-cloud",
          rev: localMeta.rev,
          updatedAt: localMeta.updatedAt,
          deviceId: localMeta.deviceId,
          state: parsed.state,
          curriculum: {},
          selfChecks: {},
        };
        if (!cloudDocNewer(parsed, localAsDoc)) return;
        if (parsed.deviceId === getDeviceId() && parsed.rev === localMeta.rev) return;
        onRemote(parsed);
      },
    )
    .subscribe();
  return () => {
    void client.removeChannel(channel);
  };
}

export async function getSessionEmail(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.email ?? null;
}
