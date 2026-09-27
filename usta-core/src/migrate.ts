import type {
  ContentPost,
  ContentPostStatus,
  FaithTemplates,
  FloorDay,
  FloorItemId,
  LedgerBridge,
  LedgerBridgeTask,
  SpotlightSlot,
  SundayClose,
  UstaConfig,
  UstaState,
  WeekPlan,
  WeekendLifeTicks,
  WeekendProjectDays,
} from './types.js'
import {
  ACTION_HISTORY_CAP,
  DEFAULT_CONFIG,
  MAX_CONTENT_POSTS,
  createEmptyState,
} from './types.js'
import { WEEKEND_LIFE_TICKS, foldLifeTicksIntoFloor, normalizeBlocks } from './weekend.js'

type Obj = Record<string, unknown>

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

function isObj(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

function optNum(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

function str(v: unknown, fallback: string): string {
  return typeof v === 'string' ? v : fallback
}

function optStr(v: unknown): string | undefined {
  return typeof v === 'string' && v !== '' ? v : undefined
}

function strOrNull(v: unknown): string | null {
  return typeof v === 'string' ? v : null
}

function migrateFaith(v: unknown): FaithTemplates {
  if (!isObj(v)) return {}
  return {
    quran: optStr(v.quran) ?? optStr(v.morning),
    cevsen: optStr(v.cevsen) ?? optStr(v.daytime),
    other: optStr(v.other) ?? optStr(v.evening),
    morning: optStr(v.morning),
    daytime: optStr(v.daytime),
    evening: optStr(v.evening),
  }
}

function migrateConfig(v: unknown): UstaConfig {
  const c = isObj(v) ? v : {}
  const d = DEFAULT_CONFIG
  return {
    timezone: str(c.timezone, d.timezone) || d.timezone,
    oakStartHour: num(c.oakStartHour, d.oakStartHour),
    oakStartMinute: num(c.oakStartMinute, d.oakStartMinute),
    oakEndHour: num(c.oakEndHour, d.oakEndHour),
    oakEndMinute: num(c.oakEndMinute, d.oakEndMinute),
    transitionMinutes: num(c.transitionMinutes, d.transitionMinutes),
    dayStartHour: num(c.dayStartHour, d.dayStartHour),
    dayStartMinute: num(c.dayStartMinute, d.dayStartMinute),
    dayEndHour: num(c.dayEndHour, d.dayEndHour),
    dayEndMinute: num(c.dayEndMinute, d.dayEndMinute),
    blockCapMinutes: num(c.blockCapMinutes, d.blockCapMinutes),
    ledgerBaseUrl: str(c.ledgerBaseUrl, d.ledgerBaseUrl),
    ledgerUrlMode: c.ledgerUrlMode === 'pages' ? 'pages' : 'local',
    ledgerAutoPull: c.ledgerAutoPull !== false,
    latitude: 'latitude' in c ? optNum(c.latitude) : d.latitude,
    longitude: 'longitude' in c ? optNum(c.longitude) : d.longitude,
    prayerMethod: optStr(c.prayerMethod) ?? d.prayerMethod,
    faithTemplates: migrateFaith(c.faithTemplates),
  }
}

function migrateSlot(v: unknown, i: number): SpotlightSlot | null {
  if (!isObj(v)) return null
  const dayOfWeek = num(v.dayOfWeek, -1)
  if (dayOfWeek < 0 || dayOfWeek > 6) return null
  return {
    id: str(v.id, `slot-${i}`),
    label: str(v.label, 'Spotlight'),
    dayOfWeek,
    startHour: num(v.startHour, 0),
    startMinute: num(v.startMinute, 0),
    endHour: num(v.endHour, 0),
    endMinute: num(v.endMinute, 0),
    primary: Boolean(v.primary),
  }
}

/** Older builds and hand-edited docs used other words for the same three states. */
const POST_STATUS_ALIASES: Record<string, ContentPostStatus> = {
  draft: 'draft',
  idea: 'draft',
  todo: 'draft',
  wip: 'draft',
  ready: 'ready',
  scheduled: 'ready',
  queued: 'ready',
  published: 'published',
  posted: 'published',
  shared: 'published',
  live: 'published',
  done: 'published',
}
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

function migratePostStatus(p: Obj): ContentPostStatus {
  if (typeof p.status === 'string') {
    const hit = POST_STATUS_ALIASES[p.status.trim().toLowerCase()]
    if (hit) return hit
  }
  if (p.published === true || p.posted === true) return 'published'
  if (p.ready === true) return 'ready'
  return 'draft'
}

function migratePosts(v: unknown): ContentPost[] {
  if (!Array.isArray(v)) return []
  const seen = new Set<string>()
  const out: ContentPost[] = []
  for (const [i, p] of v.entries()) {
    if (!isObj(p)) continue
    let id = str(p.id, '') || `post-${i}`
    if (seen.has(id)) id = `${id}-${i}`
    seen.add(id)
    const title = optStr(p.title) ?? optStr(p.label) ?? optStr(p.name) ?? ''
    const status = migratePostStatus(p)
    const post: ContentPost = { id, title, status }
    if (status === 'published' && typeof p.sharedOn === 'string' && DATE_KEY.test(p.sharedOn)) {
      post.sharedOn = p.sharedOn
    }
    out.push(post)
  }
  return out.slice(0, MAX_CONTENT_POSTS)
}

function migrateLifeTicks(v: unknown): WeekPlan['lifeTicks'] {
  if (!isObj(v)) return {}
  const out: WeekPlan['lifeTicks'] = {}
  for (const [dateKey, day] of Object.entries(v)) {
    if (!DATE_KEY.test(dateKey) || !isObj(day)) continue
    const clean: WeekendLifeTicks = {}
    for (const t of WEEKEND_LIFE_TICKS) if (day[t] === true) clean[t] = true
    if (Object.keys(clean).length > 0) out[dateKey] = clean
  }
  return out
}

function migrateSundayClose(v: unknown): SundayClose | null {
  if (!isObj(v)) return null
  const dateKey = str(v.dateKey, '')
  if (!DATE_KEY.test(dateKey)) return null
  return {
    dateKey,
    wentWell: str(v.wentWell, ''),
    nextProjectTitle: str(v.nextProjectTitle, ''),
    savedAt: str(v.savedAt, ''),
  }
}

function migrateProjectDays(v: unknown): WeekendProjectDays {
  if (typeof v !== 'string') return 'both'
  const s = v.trim().toLowerCase()
  if (s === 'sat' || s === 'saturday') return 'sat'
  if (s === 'sun' || s === 'sunday') return 'sun'
  return 'both'
}

function migrateWeek(v: unknown): WeekPlan {
  const w = isObj(v) ? v : {}
  const empty = createEmptyState('tmp').week
  return {
    weekendProjectLabel:
      optStr(w.weekendProjectLabel) ??
      optStr(w.projectTitle) ??
      optStr(w.projectLabel) ??
      optStr(w.weekendProject) ??
      optStr(w.primaryA) ??
      empty.weekendProjectLabel,
    projectOutcome: optStr(w.projectOutcome) ?? optStr(w.outcome),
    projectBlocks: normalizeBlocks(w.projectBlocks ?? w.blocks),
    projectDays: migrateProjectDays(w.projectDays ?? w.days),
    contentBatchLabel:
      optStr(w.contentBatchLabel) ??
      optStr(w.contentLabel) ??
      optStr(w.optional) ??
      empty.contentBatchLabel,
    contentPosts: migratePosts(w.contentPosts),
    lifeTicks: migrateLifeTicks(w.lifeTicks),
    sundayClose: migrateSundayClose(w.sundayClose),
    hibernate: Array.isArray(w.hibernate)
      ? w.hibernate.filter((x): x is string => typeof x === 'string')
      : [],
    slots: Array.isArray(w.slots)
      ? w.slots.map(migrateSlot).filter((s): s is SpotlightSlot => s !== null)
      : [],
    primaryA: optStr(w.primaryA),
    primaryB: optStr(w.primaryB),
    optional: optStr(w.optional),
  }
}

function migrateFloorDay(day: Obj): FloorDay {
  const clean: FloorDay = {}
  for (const id of FLOOR_IDS) if (day[id] === true) clean[id] = true

  // Legacy → new
  if (day.faith_tiny === true) {
    clean.faith_quran = true
    clean.faith_cevsen = true
    clean.faith_other = true
  }
  if (day.german_tiny === true) clean.german_block = true
  // journal_due dropped from required queue — ignore
  return clean
}

function migrateFloor(v: unknown): Record<string, FloorDay> {
  if (!isObj(v)) return {}
  const out: Record<string, FloorDay> = {}
  for (const [dateKey, day] of Object.entries(v)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !isObj(day)) continue
    out[dateKey] = migrateFloorDay(day)
  }
  return out
}

function migrateHistory(v: unknown): UstaState['actionHistory'] {
  if (!Array.isArray(v)) return []
  return v
    .filter(isObj)
    .filter((h) => typeof h.at === 'string' && typeof h.actionId === 'string')
    .map((h) => ({
      at: h.at as string,
      actionId: h.actionId as string,
      title: str(h.title, h.actionId as string),
    }))
    .slice(0, ACTION_HISTORY_CAP)
}

function migrateLedgerBridge(v: unknown): LedgerBridge | null {
  if (!isObj(v)) return null
  const dateKey = str(v.dateKey, '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null
  const tasksRaw = Array.isArray(v.tasks) ? v.tasks : []
  const tasks: LedgerBridgeTask[] = []
  for (const t of tasksRaw) {
    if (!isObj(t)) continue
    const id = str(t.id, '')
    const title = str(t.title, '')
    if (!id || !title) continue
    tasks.push({
      id,
      title,
      kind: str(t.kind, 'konu'),
      minutes: Math.max(1, Math.floor(num(t.minutes, 25))),
    })
  }
  return {
    dateKey,
    updatedAt: str(v.updatedAt, new Date().toISOString()),
    tasks,
  }
}

/**
 * Normalize any stored `usta-v1` payload into a valid UstaState.
 */
export function migrateState(raw: unknown, deviceId: string): UstaState {
  if (!isObj(raw)) return createEmptyState(deviceId)
  const empty = createEmptyState(deviceId)
  const week = migrateWeek(raw.week)
  const floor = foldLifeTicksIntoFloor(week.lifeTicks, migrateFloor(raw.floor))
  return {
    rev: Math.max(0, Math.floor(num(raw.rev, 0))),
    updatedAt: str(raw.updatedAt, empty.updatedAt),
    deviceId: str(raw.deviceId, deviceId) || deviceId,
    config: migrateConfig(raw.config),
    week: { ...week, lifeTicks: {} },
    floor,
    ledgerBridge: migrateLedgerBridge(raw.ledgerBridge),
    energyLow: raw.energyLow === true,
    energyLowDate: strOrNull(raw.energyLowDate),
    snoozesToday: Math.max(0, Math.floor(num(raw.snoozesToday, 0))),
    snoozesDate: strOrNull(raw.snoozesDate),
    snoozeUntil: strOrNull(raw.snoozeUntil),
    onRampDay: Math.min(14, Math.max(1, Math.floor(num(raw.onRampDay, 1)))),
    actionHistory: migrateHistory(raw.actionHistory),
  }
}
