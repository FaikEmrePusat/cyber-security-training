import { CURRICULUM_STORAGE_KEY } from "../data/oakCurriculum";
import {
  SELF_CHECK_KEY_PREFIX,
  parseSelfCheckRaw,
  type SelfCheckDoc,
} from "./selfCheckStore";
import { normalizeLoadedState, type AppState } from "../model";
import { getDeviceId } from "./deviceId";

export const CLOUD_DOC_VERSION = "durum-v22-cloud" as const;
export const SYNC_META_KEY = "durum-v22-sync-meta";

export type SyncMeta = {
  rev: number;
  updatedAt: string;
  deviceId: string;
};

/** Full private snapshot synced through Supabase (not the public GitHub progress.json). */
export type LedgerCloudDoc = {
  version: typeof CLOUD_DOC_VERSION;
  rev: number;
  updatedAt: string;
  deviceId: string;
  state: AppState;
  curriculum: Record<string, string>;
  selfChecks: Record<string, SelfCheckDoc>;
};

export function loadSyncMeta(): SyncMeta {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<SyncMeta>;
      if (typeof p.rev === "number" && typeof p.updatedAt === "string") {
        return {
          rev: p.rev,
          updatedAt: p.updatedAt,
          deviceId: typeof p.deviceId === "string" ? p.deviceId : getDeviceId(),
        };
      }
    }
  } catch {
    /* fall through */
  }
  return { rev: 0, updatedAt: new Date(0).toISOString(), deviceId: getDeviceId() };
}

export function saveSyncMeta(meta: SyncMeta): void {
  localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
}

export function bumpSyncMeta(): SyncMeta {
  const prev = loadSyncMeta();
  const next: SyncMeta = {
    rev: prev.rev + 1,
    updatedAt: new Date().toISOString(),
    deviceId: getDeviceId(),
  };
  saveSyncMeta(next);
  return next;
}

export function loadCurriculumMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function saveCurriculumMap(map: Record<string, string>): void {
  localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("durum-curriculum-sync"));
}

export function exportSelfChecks(): Record<string, SelfCheckDoc> {
  const out: Record<string, SelfCheckDoc> = {};
  let keys: string[] = [];
  try {
    keys = Object.keys(localStorage).filter((k) => k.startsWith(SELF_CHECK_KEY_PREFIX));
  } catch {
    return out;
  }
  for (const key of keys) {
    const topic = key.slice(SELF_CHECK_KEY_PREFIX.length);
    if (!topic) continue;
    try {
      const raw = localStorage.getItem(key);
      out[topic] = parseSelfCheckRaw(topic, [], raw);
    } catch {
      /* skip */
    }
  }
  return out;
}

export function importSelfChecks(map: Record<string, SelfCheckDoc>): void {
  if (!map || typeof map !== "object") return;
  for (const [topic, doc] of Object.entries(map)) {
    if (!topic || !doc || typeof doc !== "object") continue;
    const normalized = parseSelfCheckRaw(topic, Array.isArray(doc.outcomes) ? doc.outcomes : [], null);
    normalized.outcomes = Array.isArray(doc.outcomes) ? doc.outcomes : normalized.outcomes;
    normalized.items = doc.items && typeof doc.items === "object" ? doc.items : normalized.items;
    normalized.updatedAt = typeof doc.updatedAt === "string" ? doc.updatedAt : normalized.updatedAt;
    try {
      localStorage.setItem(
        `${SELF_CHECK_KEY_PREFIX}${topic}`,
        JSON.stringify({
          v: 2,
          topic,
          outcomes: normalized.outcomes,
          items: normalized.items,
          updatedAt: normalized.updatedAt,
        }),
      );
    } catch {
      /* ignore */
    }
  }
}

export function buildCloudDoc(state: AppState, meta?: SyncMeta): LedgerCloudDoc {
  const m = meta ?? loadSyncMeta();
  return {
    version: CLOUD_DOC_VERSION,
    rev: m.rev,
    updatedAt: m.updatedAt,
    deviceId: m.deviceId,
    state,
    curriculum: loadCurriculumMap(),
    selfChecks: exportSelfChecks(),
  };
}

export function parseCloudDoc(raw: unknown): LedgerCloudDoc | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Partial<LedgerCloudDoc>;
  if (!d.state || typeof d.state !== "object") return null;
  const state = normalizeLoadedState(d.state);
  if (!Array.isArray(state.skills)) return null;
  const rev = typeof d.rev === "number" ? d.rev : 0;
  const updatedAt = typeof d.updatedAt === "string" ? d.updatedAt : new Date(0).toISOString();
  const deviceId = typeof d.deviceId === "string" ? d.deviceId : getDeviceId();
  const curriculum =
    d.curriculum && typeof d.curriculum === "object" && !Array.isArray(d.curriculum)
      ? (d.curriculum as Record<string, string>)
      : {};
  const selfChecks =
    d.selfChecks && typeof d.selfChecks === "object" && !Array.isArray(d.selfChecks)
      ? (d.selfChecks as Record<string, SelfCheckDoc>)
      : {};
  return {
    version: CLOUD_DOC_VERSION,
    rev,
    updatedAt,
    deviceId,
    state,
    curriculum,
    selfChecks,
  };
}

/** True if `a` should replace `b` (strictly newer). */
export function cloudDocNewer(a: LedgerCloudDoc, b: LedgerCloudDoc): boolean {
  if (a.rev !== b.rev) return a.rev > b.rev;
  return a.updatedAt > b.updatedAt;
}
