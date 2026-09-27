import type {
  ContentPost,
  FloorDay,
  FloorItemId,
  WeekPlan,
  WeekendLifeTick,
  WeekendLifeTicks,
  WeekendProjectDays,
} from './types.js'
import { DEFAULT_PROJECT_BLOCKS, MAX_PROJECT_BLOCKS } from './types.js'
import { calendarDateKey, zonedParts } from './time.js'

export const WEEKEND_LIFE_TICKS: readonly WeekendLifeTick[] = ['faith', 'books', 'music']

/** Floor items a weekend life tick stands in for (weekend days only). */
export const LIFE_TICK_FLOOR: Record<WeekendLifeTick, readonly FloorItemId[]> = {
  faith: ['faith_quran', 'faith_cevsen', 'faith_other'],
  books: ['books_pages'],
  music: ['music_play'],
}

const MIN_BLOCK = 10
const MAX_BLOCK = 120
const LIFE_TICK_KEEP_DAYS = 21

export function addDaysToDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(Date.UTC(y!, m! - 1, d! + days)).toISOString().slice(0, 10)
}

/** Current weekend if today is Sat/Sun, otherwise the upcoming one. */
export function weekendDateKeys(now: Date, timeZone: string): { sat: string; sun: string } {
  const today = calendarDateKey(now, timeZone)
  const weekday = zonedParts(now, timeZone).weekday
  const sat =
    weekday === 6 ? today : weekday === 0 ? addDaysToDateKey(today, -1) : addDaysToDateKey(today, 6 - weekday)
  return { sat, sun: addDaysToDateKey(sat, 1) }
}

/** `weekday` uses JS numbering (0 = Sunday, 6 = Saturday). */
export function isProjectDay(weekday: number, days: WeekendProjectDays): boolean {
  if (weekday === 6) return days !== 'sun'
  if (weekday === 0) return days !== 'sat'
  return false
}

export function normalizeBlocks(value: unknown): number[] {
  if (!Array.isArray(value)) return [...DEFAULT_PROJECT_BLOCKS]
  const blocks = value
    .filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
    .map((n) => Math.min(MAX_BLOCK, Math.max(MIN_BLOCK, Math.round(n))))
    .slice(0, MAX_PROJECT_BLOCKS)
  return blocks.length > 0 ? blocks : [...DEFAULT_PROJECT_BLOCKS]
}

/** "2 × 50 min", "50 min", or "50 + 25 min". */
export function formatBlockPlan(blocks: readonly number[]): string {
  if (blocks.length === 0) return ''
  if (blocks.length === 1) return `${blocks[0]} min`
  if (blocks.every((b) => b === blocks[0])) return `${blocks.length} × ${blocks[0]} min`
  return `${blocks.join(' + ')} min`
}

export function firstReadyPost(week: WeekPlan): ContentPost | undefined {
  return week.contentPosts.find((p) => p.status === 'ready' && p.title.trim() !== '')
}

export function draftPosts(week: WeekPlan): ContentPost[] {
  return week.contentPosts.filter((p) => p.status === 'draft' && p.title.trim() !== '')
}

/**
 * Flip the first Ready post to Published (used when weekday Share is Done).
 * With `dateKey`, the post remembers the share day so Undo can restore it.
 */
export function publishFirstReady(week: WeekPlan, dateKey?: string): WeekPlan {
  const ready = firstReadyPost(week)
  if (!ready) return week
  return {
    ...week,
    contentPosts: week.contentPosts.map((p) =>
      p.id === ready.id
        ? { ...p, status: 'published', ...(dateKey ? { sharedOn: dateKey } : {}) }
        : p,
    ),
  }
}

/**
 * Reverse weekday Share for one day: posts shared that day go back to Ready.
 * `legacyTitle` covers posts published before `sharedOn` existed (matched by title, once).
 */
export function unpublishSharedOn(week: WeekPlan, dateKey: string, legacyTitle?: string): WeekPlan {
  let hit = false
  let posts = week.contentPosts.map((p) => {
    if (p.status !== 'published' || p.sharedOn !== dateKey) return p
    hit = true
    const { sharedOn: _drop, ...rest } = p
    return { ...rest, status: 'ready' as const }
  })
  if (!hit && legacyTitle) {
    const idx = posts.findIndex(
      (p) => p.status === 'published' && !p.sharedOn && p.title.trim() === legacyTitle,
    )
    if (idx >= 0) {
      hit = true
      posts = posts.map((p, i) => (i === idx ? { ...p, status: 'ready' as const } : p))
    }
  }
  return hit ? { ...week, contentPosts: posts } : week
}

/** A weekend life row is done when every floor item it stands for is Done that day. */
export function lifeTickDone(floorDay: FloorDay | undefined, tick: WeekendLifeTick): boolean {
  return LIFE_TICK_FLOOR[tick].every((id) => floorDay?.[id] === true)
}

export function lifeTickProgress(
  floorDay: FloorDay | undefined,
  tick: WeekendLifeTick,
): { done: number; total: number } {
  const ids = LIFE_TICK_FLOOR[tick]
  return { done: ids.filter((id) => floorDay?.[id] === true).length, total: ids.length }
}

/** Legacy `lifeTicks` → same-day floor Done flags (floor is the single source of truth). */
export function foldLifeTicksIntoFloor(
  lifeTicks: WeekPlan['lifeTicks'],
  floor: Record<string, FloorDay>,
): Record<string, FloorDay> {
  const out: Record<string, FloorDay> = { ...floor }
  for (const [dateKey, ticks] of Object.entries(lifeTicks)) {
    const day: FloorDay = { ...(out[dateKey] ?? {}) }
    for (const t of WEEKEND_LIFE_TICKS) {
      if (ticks[t]) for (const id of LIFE_TICK_FLOOR[t]) day[id] = true
    }
    out[dateKey] = day
  }
  return out
}

export function lifeTickCovers(ticks: WeekendLifeTicks | undefined, id: FloorItemId): boolean {
  if (!ticks) return false
  return WEEKEND_LIFE_TICKS.some((t) => ticks[t] === true && LIFE_TICK_FLOOR[t].includes(id))
}

/** Life ticks still open for the day: not ticked and not already done through the queue. */
export function uncheckedLifeTicks(
  week: WeekPlan,
  dateKey: string,
  floorDay: FloorDay = {},
): WeekendLifeTick[] {
  const ticks = week.lifeTicks[dateKey] ?? {}
  return WEEKEND_LIFE_TICKS.filter(
    (t) => !ticks[t] && !LIFE_TICK_FLOOR[t].every((id) => floorDay[id] === true),
  )
}

export function setLifeTick(
  week: WeekPlan,
  dateKey: string,
  tick: WeekendLifeTick,
  checked: boolean,
): WeekPlan {
  const oldest = addDaysToDateKey(dateKey, -LIFE_TICK_KEEP_DAYS)
  const kept: WeekPlan['lifeTicks'] = {}
  for (const [k, v] of Object.entries(week.lifeTicks)) if (k >= oldest) kept[k] = v
  const day: WeekendLifeTicks = { ...(kept[dateKey] ?? {}) }
  if (checked) day[tick] = true
  else delete day[tick]
  if (Object.keys(day).length > 0) kept[dateKey] = day
  else delete kept[dateKey]
  return { ...week, lifeTicks: kept }
}

/** Save the Sunday close; a new next-project title becomes the weekend project. */
export function applySundayClose(
  week: WeekPlan,
  input: { wentWell: string; nextProjectTitle: string },
  dateKey: string,
  nowIso: string,
): WeekPlan {
  const wentWell = input.wentWell.trim()
  const nextProjectTitle = input.nextProjectTitle.trim()
  const next: WeekPlan = {
    ...week,
    sundayClose: { dateKey, wentWell, nextProjectTitle, savedAt: nowIso },
  }
  if (nextProjectTitle && nextProjectTitle !== week.weekendProjectLabel) {
    next.weekendProjectLabel = nextProjectTitle
    next.projectOutcome = undefined
  }
  return next
}
