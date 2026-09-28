/** Local self-check ticks + answer notes (Today study plan). Not part of durum-v22. */

export const SELF_CHECK_KEY_PREFIX = "cyber-ledger-selfcheck:";

export type SelfCheckItem = {
  checked: boolean;
  /** Your explanation / source notes for this outcome question. */
  note: string;
};

export type SelfCheckDoc = {
  v: 2;
  topic: string;
  /** Snapshot of questions so the library stays readable if the guide changes. */
  outcomes: string[];
  /** Keyed by outcome text (stable if order changes). */
  items: Record<string, SelfCheckItem>;
  updatedAt: string;
};

export type SelfCheckLibraryEntry = SelfCheckDoc & {
  storageKey: string;
  noteCount: number;
  checkedCount: number;
};

function storageKeyFor(topicKey: string): string {
  return `${SELF_CHECK_KEY_PREFIX}${topicKey}`;
}

function emptyItem(): SelfCheckItem {
  return { checked: false, note: "" };
}

/** Migrate v1 (index → boolean) or already-v2 JSON into a SelfCheckDoc. */
export function parseSelfCheckRaw(
  topicKey: string,
  outcomes: string[],
  raw: string | null,
): SelfCheckDoc {
  const base: SelfCheckDoc = {
    v: 2,
    topic: topicKey,
    outcomes: [...outcomes],
    items: {},
    updatedAt: new Date().toISOString(),
  };

  if (!raw) {
    for (const o of outcomes) base.items[o] = emptyItem();
    return base;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && (parsed as SelfCheckDoc).v === 2) {
      const doc = parsed as SelfCheckDoc;
      const items: Record<string, SelfCheckItem> = {};
      const outcomeList = doc.outcomes?.length ? doc.outcomes : outcomes;
      for (const o of outcomeList) {
        const prev = doc.items?.[o];
        items[o] = {
          checked: Boolean(prev?.checked),
          note: typeof prev?.note === "string" ? prev.note : "",
        };
      }
      // Keep orphan notes from older outcome wording
      if (doc.items) {
        for (const [k, v] of Object.entries(doc.items)) {
          if (!items[k]) {
            items[k] = {
              checked: Boolean(v?.checked),
              note: typeof v?.note === "string" ? v.note : "",
            };
          }
        }
      }
      return {
        v: 2,
        topic: doc.topic || topicKey,
        outcomes: outcomeList,
        items,
        updatedAt: doc.updatedAt || new Date().toISOString(),
      };
    }

    // v1: { "0": true, "1": false }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const map = parsed as Record<string, unknown>;
      const items: Record<string, SelfCheckItem> = {};
      outcomes.forEach((o, i) => {
        items[o] = {
          checked: Boolean(map[String(i)] ?? map[i as unknown as string]),
          note: "",
        };
      });
      return { ...base, items, updatedAt: new Date().toISOString() };
    }
  } catch {
    /* ignore */
  }

  for (const o of outcomes) base.items[o] = emptyItem();
  return base;
}

export function loadSelfCheck(topicKey: string, outcomes: string[]): SelfCheckDoc {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(storageKeyFor(topicKey));
  } catch {
    raw = null;
  }
  const doc = parseSelfCheckRaw(topicKey, outcomes, raw);
  // Prefer current guide wording as the primary order; merge prior notes by text key
  const mergedOutcomes = [...outcomes];
  for (const o of doc.outcomes) {
    if (!mergedOutcomes.includes(o) && (doc.items[o]?.note || doc.items[o]?.checked)) {
      mergedOutcomes.push(o);
    }
  }
  const items: Record<string, SelfCheckItem> = {};
  for (const o of mergedOutcomes) {
    items[o] = doc.items[o] ?? emptyItem();
  }
  return {
    v: 2,
    topic: topicKey,
    outcomes: mergedOutcomes,
    items,
    updatedAt: doc.updatedAt,
  };
}

export function saveSelfCheck(doc: SelfCheckDoc): void {
  const payload: SelfCheckDoc = {
    ...doc,
    v: 2,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(storageKeyFor(doc.topic), JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

export function listSelfCheckLibrary(): SelfCheckLibraryEntry[] {
  const out: SelfCheckLibraryEntry[] = [];
  let keys: string[] = [];
  try {
    keys = Object.keys(localStorage).filter((k) => k.startsWith(SELF_CHECK_KEY_PREFIX));
  } catch {
    return out;
  }

  for (const key of keys) {
    const topic = key.slice(SELF_CHECK_KEY_PREFIX.length);
    if (!topic) continue;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      continue;
    }
    const doc = parseSelfCheckRaw(topic, [], raw);
    const noteCount = Object.values(doc.items).filter((i) => i.note.trim()).length;
    const checkedCount = Object.values(doc.items).filter((i) => i.checked).length;
    if (noteCount === 0 && checkedCount === 0 && doc.outcomes.length === 0) continue;
    out.push({
      ...doc,
      storageKey: key,
      noteCount,
      checkedCount,
    });
  }

  out.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return out;
}

export function deleteSelfCheckTopic(topicKey: string): void {
  try {
    localStorage.removeItem(storageKeyFor(topicKey));
  } catch {
    /* ignore */
  }
}

/** Stable evidence ref for portfolio / skill kayit tier (not a public URL). */
export function selfCheckEvidenceRef(topicKey: string): string {
  return `self-check:${topicKey.trim()}`;
}

export function selfCheckHasNotes(doc: SelfCheckDoc): boolean {
  return Object.values(doc.items).some((i) => i.note.trim().length > 0);
}

/** One evidence row pointing at the self-check library entry for this topic. */
export function selfCheckEvidenceRows(topicKey: string): string[] {
  return [selfCheckEvidenceRef(topicKey)];
}

/** Append Q&A block into a Record session note. */
export function formatSelfCheckSessionBlock(doc: SelfCheckDoc): string {
  const lines: string[] = [];
  for (const outcome of doc.outcomes) {
    const note = doc.items[outcome]?.note?.trim();
    if (!note) continue;
    lines.push(`Q: ${outcome}`, `A: ${note}`, "");
  }
  for (const [outcome, item] of Object.entries(doc.items)) {
    if (doc.outcomes.includes(outcome)) continue;
    const note = item.note.trim();
    if (!note) continue;
    lines.push(`Q: ${outcome}`, `A: ${note}`, "");
  }
  if (lines.length === 0) return "";
  return [`Self-check notes (${doc.topic}):`, ...lines].join("\n").trim();
}
