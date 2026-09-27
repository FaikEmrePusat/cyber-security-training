import type { FloorDay, FloorItemId, UstaState, WeekendLifeTick } from './types.js'
import { ACTION_HISTORY_CAP } from './types.js'
import {
  LIFE_TICK_FLOOR,
  firstReadyPost,
  publishFirstReady,
  setLifeTick,
  unpublishSharedOn,
} from './weekend.js'

function floorLwwMerge(
  winnerDay: FloorDay = {},
  loserDay: FloorDay = {},
): FloorDay {
  const ids = new Set([
    ...Object.keys(winnerDay),
    ...Object.keys(loserDay),
  ]) as Set<string>
  const out: FloorDay = {}
  for (const id of ids) {
    const key = id as FloorItemId
    const w = Boolean(winnerDay[key])
    const l = Boolean(loserDay[key])
    if (w === l) {
      if (w) out[key] = true
      continue
    }
    // Disagree: higher-rev side wins so Undo/clear is not re-OR'd back to Done
    if (w) out[key] = true
  }
  return out
}

function mergeFloorMaps(
  winnerFloor: Record<string, FloorDay>,
  loserFloor: Record<string, FloorDay>,
): Record<string, FloorDay> {
  const keys = new Set([...Object.keys(winnerFloor), ...Object.keys(loserFloor)])
  const out: Record<string, FloorDay> = {}
  for (const k of keys) {
    out[k] = floorLwwMerge(winnerFloor[k], loserFloor[k])
  }
  return out
}

/** Snooze counters are day-scoped: a newer day resets; same day takes the max. */
function mergeSnoozeCount(
  a: UstaState,
  b: UstaState,
): Pick<UstaState, 'snoozesToday' | 'snoozesDate'> {
  if (a.snoozesDate === b.snoozesDate) {
    return {
      snoozesToday: Math.max(a.snoozesToday, b.snoozesToday),
      snoozesDate: a.snoozesDate,
    }
  }
  if (a.snoozesDate === null) return { snoozesToday: b.snoozesToday, snoozesDate: b.snoozesDate }
  if (b.snoozesDate === null) return { snoozesToday: a.snoozesToday, snoozesDate: a.snoozesDate }
  const newer = a.snoozesDate > b.snoozesDate ? a : b
  return { snoozesToday: newer.snoozesToday, snoozesDate: newer.snoozesDate }
}

/**
 * Higher rev wins; ties → later updatedAt; then deviceId.
 * Floor: per-item last-write-wins from the winning rev (Undo can clear Done).
 */
export function mergeStates(local: UstaState, remote: UstaState): UstaState {
  const localWins =
    local.rev > remote.rev ||
    (local.rev === remote.rev && local.updatedAt > remote.updatedAt) ||
    (local.rev === remote.rev &&
      local.updatedAt === remote.updatedAt &&
      local.deviceId >= remote.deviceId)

  const winner = localWins ? local : remote
  const loser = localWins ? remote : local

  return {
    ...winner,
    floor: mergeFloorMaps(winner.floor, loser.floor),
    ...mergeSnoozeCount(local, remote),
    actionHistory: dedupeHistory([...winner.actionHistory, ...loser.actionHistory])
      .sort((a, b) => (a.at < b.at ? 1 : -1))
      .slice(0, ACTION_HISTORY_CAP),
  }
}

function dedupeHistory(items: UstaState['actionHistory']): UstaState['actionHistory'] {
  const seen = new Set<string>()
  return items.filter((h) => {
    const key = `${h.at}|${h.actionId}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const obj = value as Record<string, unknown>
  return `{${Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(',')}}`
}

/** Key-order-insensitive equality (Postgres jsonb does not preserve key order). */
export function statesEquivalent(a: UstaState, b: UstaState): boolean {
  return stableStringify(a) === stableStringify(b)
}

export function bumpRev(state: UstaState, deviceId: string, now = new Date()): UstaState {
  return {
    ...state,
    rev: state.rev + 1,
    updatedAt: now.toISOString(),
    deviceId,
  }
}

export function markFloorDone(
  state: UstaState,
  dateKey: string,
  item: FloorItemId,
  deviceId: string,
  now = new Date(),
): UstaState {
  const day = { ...(state.floor[dateKey] ?? {}), [item]: true }
  const next: UstaState = {
    ...state,
    floor: { ...state.floor, [dateKey]: day },
    snoozeUntil: null,
    actionHistory: [
      {
        at: now.toISOString(),
        actionId: item,
        title: item,
      },
      ...state.actionHistory,
    ].slice(0, ACTION_HISTORY_CAP),
  }
  return bumpRev(next, deviceId, now)
}

const PUBLISHED_PREFIX = 'Published: '

/** Now's Done: floor mark, plus content_publish flips the first Ready post to Published. */
export function markQueueDone(
  state: UstaState,
  dateKey: string,
  item: FloorItemId,
  deviceId: string,
  now = new Date(),
): UstaState {
  const next = markFloorDone(state, dateKey, item, deviceId, now)
  if (item !== 'content_publish') return next
  const ready = firstReadyPost(state.week)
  if (!ready) return next
  const [head, ...rest] = next.actionHistory
  return {
    ...next,
    week: publishFirstReady(next.week, dateKey),
    actionHistory: [{ ...head!, title: `${PUBLISHED_PREFIX}${ready.title.trim()}` }, ...rest],
  }
}

/** Newest Share title from history, for posts published before `sharedOn` was recorded. */
function lastSharedTitle(history: UstaState['actionHistory']): string | undefined {
  const h = history.find((x) => x.actionId === 'content_publish' && x.title.startsWith(PUBLISHED_PREFIX))
  return h ? h.title.slice(PUBLISHED_PREFIX.length).trim() : undefined
}

function restoreSharedPost(state: UstaState, dateKey: string): UstaState['week'] {
  if (!state.floor[dateKey]?.content_publish) return state.week
  return unpublishSharedOn(state.week, dateKey, lastSharedTitle(state.actionHistory))
}

/**
 * Weekend life checklist row: check/uncheck every floor item the row stands for
 * (faith = Qur’an + Cevşen + Faith+). One rev bump, so Now and Weekend stay in step.
 */
export function setLifeDone(
  state: UstaState,
  dateKey: string,
  tick: WeekendLifeTick,
  checked: boolean,
  deviceId: string,
  now = new Date(),
): UstaState {
  const day: FloorDay = { ...(state.floor[dateKey] ?? {}) }
  for (const id of LIFE_TICK_FLOOR[tick]) {
    if (checked) day[id] = true
    else delete day[id]
  }
  const week =
    !checked && state.week.lifeTicks[dateKey]?.[tick]
      ? setLifeTick(state.week, dateKey, tick, false)
      : state.week
  const next: UstaState = {
    ...state,
    week,
    floor: { ...state.floor, [dateKey]: day },
    actionHistory: [
      {
        at: now.toISOString(),
        actionId: `${checked ? 'life' : 'undo-life'}:${tick}`,
        title: `${checked ? 'Weekend life' : 'Undo weekend life'}: ${tick}`,
      },
      ...state.actionHistory,
    ].slice(0, ACTION_HISTORY_CAP),
  }
  return bumpRev(next, deviceId, now)
}

/** Clear a mistaken Done for today (or any dateKey). Sync-safe via rev bump. */
export function unmarkFloorDone(
  state: UstaState,
  dateKey: string,
  item: FloorItemId,
  deviceId: string,
  now = new Date(),
): UstaState {
  const prev = state.floor[dateKey] ?? {}
  if (!prev[item]) return state
  const day: FloorDay = { ...prev }
  delete day[item]
  const next: UstaState = {
    ...state,
    week: item === 'content_publish' ? restoreSharedPost(state, dateKey) : state.week,
    floor: { ...state.floor, [dateKey]: day },
    snoozeUntil: null,
    actionHistory: [
      {
        at: now.toISOString(),
        actionId: `undo:${item}`,
        title: `Undo ${item}`,
      },
      ...state.actionHistory,
    ].slice(0, ACTION_HISTORY_CAP),
  }
  return bumpRev(next, deviceId, now)
}

/** Wipe all Done flags for one calendar day (full today reset). */
export function clearFloorDay(
  state: UstaState,
  dateKey: string,
  deviceId: string,
  now = new Date(),
): UstaState {
  if (!state.floor[dateKey] || Object.keys(state.floor[dateKey]!).length === 0) {
    return state
  }
  const { [dateKey]: _removed, ...rest } = state.floor
  const next: UstaState = {
    ...state,
    week: restoreSharedPost(state, dateKey),
    floor: rest,
    snoozeUntil: null,
    energyLow: state.energyLowDate === dateKey ? false : state.energyLow,
    energyLowDate: state.energyLowDate === dateKey ? null : state.energyLowDate,
    actionHistory: [
      {
        at: now.toISOString(),
        actionId: `reset:${dateKey}`,
        title: `Reset day ${dateKey}`,
      },
      ...state.actionHistory,
    ].slice(0, ACTION_HISTORY_CAP),
  }
  return bumpRev(next, deviceId, now)
}

export function applySnooze(
  state: UstaState,
  dateKey: string,
  deviceId: string,
  minutes = 15,
  maxPerDay = 2,
  now = new Date(),
): { state: UstaState; ok: boolean; reason?: string } {
  const snoozes =
    state.snoozesDate === dateKey ? state.snoozesToday : 0
  if (snoozes >= maxPerDay) {
    return {
      state,
      ok: false,
      reason: 'Snooze limit reached (2/day). Do the action or mark Done.',
    }
  }
  const until = new Date(now.getTime() + minutes * 60_000).toISOString()
  const next = bumpRev(
    {
      ...state,
      snoozesToday: snoozes + 1,
      snoozesDate: dateKey,
      snoozeUntil: until,
    },
    deviceId,
    now,
  )
  return { state: next, ok: true }
}

export function setEnergyLow(
  state: UstaState,
  dateKey: string,
  deviceId: string,
  now = new Date(),
): UstaState {
  return bumpRev(
    {
      ...state,
      energyLow: true,
      energyLowDate: dateKey,
    },
    deviceId,
    now,
  )
}
