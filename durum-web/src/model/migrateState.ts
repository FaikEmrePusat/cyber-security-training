import { MODEL } from "./constants";
import { createSeedState } from "./seed";
import { daysSince } from "./compute";
import type { AppState, ScheduleCarryItem, Skill } from "./types";

const MAX_CARRY = MODEL.carry.maxCarry;
const MAX_CARRY_AGE_DAYS = MODEL.carry.maxAgeDays;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

/** Drop stale / overflow carry so debt cannot snowball. */
export function sanitizeCarry(carryList: ScheduleCarryItem[], nowMs: number): ScheduleCarryItem[] {
  const fresh = carryList.filter((c) => daysSince(c.sinceIso, nowMs) <= MAX_CARRY_AGE_DAYS);
  return fresh.slice(-MAX_CARRY);
}

function mergeSkills(parsed: Skill[] | undefined, seedSkills: Skill[]): Skill[] {
  if (!Array.isArray(parsed) || parsed.length === 0) return structuredClone(seedSkills);
  const byId = new Map(parsed.map((s) => [s.id, s]));
  const merged = seedSkills.map((seed) => {
    const existing = byId.get(seed.id);
    return existing ? { ...seed, ...existing, id: seed.id } : structuredClone(seed);
  });
  for (const s of parsed) {
    if (!seedSkills.some((seed) => seed.id === s.id)) merged.push(s);
  }
  return merged;
}

function asArray<T>(v: unknown, fallback: T[]): T[] {
  return Array.isArray(v) ? (v as T[]) : fallback;
}

function normalizeCompletedToday(raw: unknown): Record<string, string[]> {
  if (!isPlainObject(raw)) return {};
  const out: Record<string, string[]> = {};
  for (const [date, ids] of Object.entries(raw)) {
    if (Array.isArray(ids)) out[date] = ids.filter((id): id is string => typeof id === "string");
  }
  return out;
}

/**
 * Merge a parsed localStorage / backup payload with seed defaults.
 * Keeps older saves usable when new seed fields or skills appear.
 */
export function normalizeLoadedState(parsed: unknown, nowMs = Date.now()): AppState {
  const seed = createSeedState();
  if (!isPlainObject(parsed)) return seed;

  const p = parsed as Partial<AppState>;
  if (!Array.isArray(p.skills) || p.skills.length === 0) return seed;

  const carryRaw = asArray<ScheduleCarryItem>(p.scheduleCarry, []);
  return {
    ...seed,
    ...p,
    skills: mergeSkills(p.skills, seed.skills),
    artifacts: asArray(p.artifacts, seed.artifacts),
    career: asArray(p.career, seed.career),
    retrieval: asArray(p.retrieval, seed.retrieval),
    history: asArray(p.history, seed.history),
    pending: asArray(p.pending, []),
    lang: isPlainObject(p.lang) ? { ...seed.lang, ...p.lang } : seed.lang,
    tempo: isPlainObject(p.tempo) ? { ...seed.tempo, ...p.tempo } : seed.tempo,
    chancenkarte: isPlainObject(p.chancenkarte)
      ? { ...seed.chancenkarte, ...p.chancenkarte }
      : seed.chancenkarte,
    draft: isPlainObject(p.draft) ? { ...seed.draft, ...p.draft } : seed.draft,
    scheduleCarry: sanitizeCarry(carryRaw, nowMs),
    scheduleCompletedToday: normalizeCompletedToday(p.scheduleCompletedToday),
  };
}
