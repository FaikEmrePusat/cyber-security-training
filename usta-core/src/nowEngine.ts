import type {
  FloorDay,
  FloorItemId,
  NextAction,
  PrayerTimesOfDay,
  UstaConfig,
  UstaState,
} from './types.js'
import { DEFAULT_BLOCK_CAP } from './types.js'
import {
  calendarDateKey,
  getTimeZone,
  hmToMinutes,
  isWeekday,
  minutesSinceMidnight,
  zonedParts,
} from './time.js'
import { isAfterPrayer } from './prayer.js'
import { withMonthContext } from './month.js'
import {
  draftPosts,
  firstReadyPost,
  formatBlockPlan,
  isProjectDay,
  lifeTickCovers,
  uncheckedLifeTicks,
} from './weekend.js'

/** Weekday queue after Oak (Master Plan §2). Career first, then faith → books → music. */
export const WEEKDAY_QUEUE: FloorItemId[] = [
  'ledger_touch',
  'german_block',
  'faith_quran',
  'faith_cevsen',
  'faith_other',
  'books_pages',
  'music_play',
  'content_publish',
]

/** After weekend project window — content batch + five domains. */
export const WEEKEND_AFTER_QUEUE: FloorItemId[] = [
  'content_batch',
  'ledger_touch',
  'german_block',
  'faith_quran',
  'faith_cevsen',
  'faith_other',
  'books_pages',
  'music_play',
]

/** Energy-low safety: career blocks only. */
const ENERGY_LOW_QUEUE: FloorItemId[] = ['ledger_touch', 'german_block']

/** @deprecated alias */
export const FLOOR_ORDER = WEEKDAY_QUEUE

function floorForToday(state: UstaState, dateKey: string): FloorDay {
  return state.floor[dateKey] ?? {}
}

function isFloorDone(day: FloorDay, id: FloorItemId): boolean {
  return Boolean(day[id])
}

/**
 * Done for queue purposes: a floor Done mark, or (weekend only) a Weekend-page life tick
 * that covers this item. Weekday queue ignores life ticks.
 */
export function isQueueItemDone(
  state: UstaState,
  dateKey: string,
  id: FloorItemId,
  weekend: boolean,
): boolean {
  const day = state.floor[dateKey] ?? {}
  if (isFloorDone(day, id)) return true
  return weekend && lifeTickCovers(state.week.lifeTicks[dateKey], id)
}

function hm(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

/** Light "later today" nudge for unchecked weekend life ticks, or '' when none. */
function lifeTickNudge(week: UstaState['week'], dateKey: string, day: FloorDay): string {
  const open = uncheckedLifeTicks(week, dateKey, day)
  return open.length > 0 ? ` Later today, lightly: ${open.join(', ')}.` : ''
}

function energyLowActive(state: UstaState, dateKey: string): boolean {
  return state.energyLow && state.energyLowDate === dateKey
}

function inSnooze(state: UstaState, now: Date): boolean {
  if (!state.snoozeUntil) return false
  return now.getTime() < new Date(state.snoozeUntil).getTime()
}

function cap(config: UstaConfig, preferred: number): number {
  const max = config.blockCapMinutes || DEFAULT_BLOCK_CAP
  return Math.min(preferred, max)
}

function oakAction(): NextAction {
  return {
    id: 'oak_presence',
    title: 'Be present at Oak. Capture one line if needed — do not start other domains.',
    durationMin: 240,
    why: 'Oak is a hard container. The five-domain queue waits until after class.',
    domain: 'oak',
    kind: 'oak',
  }
}

function transitionAction(): NextAction {
  return {
    id: 'oak_transition',
    title: 'Transition: water, short walk, close school tabs. Queue starts after this.',
    durationMin: 20,
    why: 'A buffer after Oak stops the attention crash before cyber and German.',
    domain: 'oak',
    kind: 'transition',
  }
}

function actionFor(
  id: FloorItemId,
  config: UstaConfig,
  week: UstaState['week'],
  bridge: UstaState['ledgerBridge'],
  dateKey: string,
  day: FloorDay = {},
): NextAction {
  const t = config.faithTemplates
  const bridgeOk = bridge && bridge.dateKey === dateKey && bridge.tasks.length > 0
  const cyberTasks = bridgeOk
    ? bridge!.tasks.filter((x) => x.kind !== 'dil' && x.kind !== 'dinlenme')
    : []
  const germanTasks = bridgeOk
    ? bridge!.tasks.filter((x) => x.kind === 'dil')
    : []

  switch (id) {
    case 'ledger_touch': {
      const top = cyberTasks[0]
      const more =
        cyberTasks.length > 1 ? ` (+${cyberTasks.length - 1} more in Ledger)` : ''
      return {
        id,
        title: top
          ? `Cyber (from Ledger): ${top.title}${more}`
          : 'Cyber: pull Today from Ledger (Settings → Refresh from Ledger), then one real block.',
        durationMin: cap(config, top?.minutes ?? 50),
        why: top
          ? 'Shown from Cyber Ledger Today. Deep Map/Record stays in Ledger when you need it.'
          : 'Usta shows the next cyber job after you refresh the Ledger bridge.',
        domain: 'ledger',
        kind: 'queue',
      }
    }
    case 'german_block': {
      const top = germanTasks[0]
      return {
        id,
        title: top
          ? `German (from Ledger): ${top.title}`
          : 'German: run today’s language block (refresh Ledger bridge if you want the exact title).',
        durationMin: cap(config, top?.minutes ?? 50),
        why: top
          ? 'Pulled from Ledger language lane.'
          : 'One German block per day. Open Ledger only if you need the full study UI.',
        domain: 'german',
        kind: 'queue',
      }
    }
    case 'faith_quran':
      return {
        id,
        title: 'Faith: one page of Qur’an + its meaning / tafsīr.',
        durationMin: cap(config, 45),
        why: t.quran || t.morning || 'Paste your page cue in Settings (nothing is bundled).',
        domain: 'faith',
        kind: 'queue',
      }
    case 'faith_cevsen':
      return {
        id,
        title: 'Faith: one bab of Cevşen + its meaning.',
        durationMin: cap(config, 30),
        why: t.cevsen || t.daytime || 'Your Cevşen cue only — Settings templates.',
        domain: 'faith',
        kind: 'queue',
      }
    case 'faith_other':
      return {
        id,
        title: 'Faith: at least one page from your other religious sources.',
        durationMin: cap(config, 30),
        why: t.other || t.evening || 'Risale / siyar / other — your text, your pace.',
        domain: 'faith',
        kind: 'queue',
      }
    case 'books_pages':
      return {
        id,
        title: 'Books: read about ten pages of your current book.',
        durationMin: cap(config, 45),
        why: 'Small daily reading beats waiting for a perfect free evening.',
        domain: 'books',
        kind: 'queue',
      }
    case 'music_play':
      return {
        id,
        title: 'Music: open ney or piano and try a piece. No theory required today.',
        durationMin: cap(config, 45),
        why: 'Play first. Theory can wait for a weekend if you want it.',
        domain: 'music',
        kind: 'queue',
      }
    case 'project_deep': {
      const window = `${hm(config.oakStartHour, config.oakStartMinute)}–${hm(config.oakEndHour, config.oakEndMinute)}`
      const plan = formatBlockPlan(week.projectBlocks)
      const outcome = week.projectOutcome?.trim()
      return {
        id,
        title: `Weekend project (${window}): ${week.weekendProjectLabel ?? 'software / cyber project'}${plan ? ` — ${plan}` : ''}.`,
        durationMin: cap(config, week.projectBlocks[0] ?? 50),
        why:
          (outcome
            ? `When the weekend ends: ${outcome}`
            : 'Oak is off. This window belongs to building, not browsing.') +
          lifeTickNudge(week, dateKey, day),
        domain: 'project',
        kind: 'weekend',
      }
    }
    case 'content_batch': {
      const label = week.contentBatchLabel ?? 'prepare Medium / LinkedIn for next week'
      const drafts = draftPosts(week)
      const readyCount = week.contentPosts.filter((p) => p.status === 'ready').length
      const nudge = lifeTickNudge(week, dateKey, day)
      if (drafts.length > 0) {
        const more = drafts.length > 1 ? ` (+${drafts.length - 1} more draft${drafts.length > 2 ? 's' : ''})` : ''
        return {
          id,
          title: `Content batch: finish “${drafts[0]!.title.trim()}”${more}.`,
          durationMin: cap(config, 50),
          why: `${label}. Set each post to Ready on the Weekend page once it can ship as-is.${nudge}`,
          domain: 'content',
          kind: 'weekend',
        }
      }
      return {
        id,
        title: `Content batch: ${label}.`,
        durationMin: cap(config, 50),
        why:
          (readyCount > 0
            ? `${readyCount} post${readyCount > 1 ? 's' : ''} already Ready. Draft one more or polish, then list it on the Weekend page.`
            : 'Draft and stage now so weekdays only need publish/share. List posts on the Weekend page.') +
          nudge,
        domain: 'content',
        kind: 'weekend',
      }
    }
    case 'content_publish': {
      const ready = firstReadyPost(week)
      if (ready) {
        const rest = week.contentPosts.filter((p) => p.status === 'ready').length - 1
        return {
          id,
          title: `Content: publish “${ready.title.trim()}” (Ready).`,
          durationMin: cap(config, 20),
          why: `Done marks it Published in the Weekend list.${rest > 0 ? ` ${rest} more Ready after this.` : ''}`,
          domain: 'content',
          kind: 'queue',
        }
      }
      return {
        id,
        title: 'Content: publish or share one already-prepared post (no long drafting).',
        durationMin: cap(config, 20),
        why: 'Weekday rule: share what the weekend prepared. Skip if nothing is ready — mark Done.',
        domain: 'content',
        kind: 'queue',
      }
    }
  }
}

function dayStartDue(
  now: Date,
  timeZone: string,
  config: UstaConfig,
  prayers: PrayerTimesOfDay | null | undefined,
): boolean {
  const mins = minutesSinceMidnight(now, timeZone)
  if (prayers?.fajr) return isAfterPrayer(now, 'fajr', prayers)
  return mins >= hmToMinutes(config.dayStartHour, config.dayStartMinute)
}

function afterOakTransition(
  now: Date,
  timeZone: string,
  config: UstaConfig,
): boolean {
  const mins = minutesSinceMidnight(now, timeZone)
  const end =
    hmToMinutes(config.oakEndHour, config.oakEndMinute) + config.transitionMinutes
  return mins >= end
}

/** Sat/Sun 10–14 on a day the Weekend page selected as a project day. */
function inWeekendProjectWindow(
  now: Date,
  timeZone: string,
  config: UstaConfig,
  week: UstaState['week'],
): boolean {
  if (!isProjectDay(zonedParts(now, timeZone).weekday, week.projectDays)) return false
  const mins = minutesSinceMidnight(now, timeZone)
  const start = hmToMinutes(config.oakStartHour, config.oakStartMinute)
  const end = hmToMinutes(config.oakEndHour, config.oakEndMinute)
  return mins >= start && mins < end
}

function itemIsDue(
  id: FloorItemId,
  now: Date,
  timeZone: string,
  config: UstaConfig,
  prayers: PrayerTimesOfDay | null | undefined,
  week: UstaState['week'],
): boolean {
  if (!dayStartDue(now, timeZone, config, prayers)) return false
  const projectWindow = inWeekendProjectWindow(now, timeZone, config, week)

  if (id === 'project_deep') return projectWindow

  if (id === 'content_batch') {
    return !isWeekday(now, timeZone) && !projectWindow
  }

  if (id === 'ledger_touch' || id === 'german_block') {
    if (isWeekday(now, timeZone)) return afterOakTransition(now, timeZone, config)
    return !projectWindow
  }

  if (id === 'content_publish') {
    return isWeekday(now, timeZone) && afterOakTransition(now, timeZone, config)
  }

  if (isWeekday(now, timeZone)) {
    const mins = minutesSinceMidnight(now, timeZone)
    const oakStart = hmToMinutes(config.oakStartHour, config.oakStartMinute)
    const transitionEnd =
      hmToMinutes(config.oakEndHour, config.oakEndMinute) + config.transitionMinutes
    if (mins >= oakStart && mins < transitionEnd) return false
  }
  if (projectWindow) return false
  return true
}

/** Day end may be after midnight (e.g. 01:00); then the rest window is dayEnd → dayStart. */
function pastDayEnd(mins: number, config: UstaConfig): boolean {
  const dayEnd = hmToMinutes(config.dayEndHour, config.dayEndMinute)
  const dayStart = hmToMinutes(config.dayStartHour, config.dayStartMinute)
  if (dayEnd > dayStart) return mins >= dayEnd
  return mins >= dayEnd && mins < dayStart
}

function restAction(hint: string): NextAction {
  return {
    id: 'rest_or_light',
    title: 'Rest or light living. Protect sleep.',
    durationMin: 30,
    why: hint,
    domain: 'rest',
    kind: 'rest',
  }
}

function firstDueInQueue(
  queue: FloorItemId[],
  state: UstaState,
  now: Date,
  timeZone: string,
  config: UstaConfig,
  prayers: PrayerTimesOfDay | null | undefined,
  dateKey: string,
): NextAction | null {
  const weekend = !isWeekday(now, timeZone)
  const day = floorForToday(state, dateKey)
  for (const id of queue) {
    if (isQueueItemDone(state, dateKey, id, weekend)) continue
    if (!itemIsDue(id, now, timeZone, config, prayers, state.week)) continue
    return actionFor(id, config, state.week, state.ledgerBridge, dateKey, day)
  }
  return null
}

/**
 * Master Plan NowEngine:
 * 1 Oak lock → 2 transition → snooze →
 * weekend 10–14: project →
 * weekday five-domain queue / weekend after-queue →
 * energy low: cyber+german only → rest
 */
export function computeNextAction(
  now: Date,
  state: UstaState,
  config: UstaConfig = state.config,
  prayerTimes?: PrayerTimesOfDay | null,
): NextAction {
  const dateKey = calendarDateKey(now, getTimeZone(config.timezone))
  return withMonthContext(pickNextAction(now, state, config, prayerTimes), state, dateKey)
}

function pickNextAction(
  now: Date,
  state: UstaState,
  config: UstaConfig,
  prayerTimes: PrayerTimesOfDay | null | undefined,
): NextAction {
  const timeZone = getTimeZone(config.timezone)
  const dateKey = calendarDateKey(now, timeZone)
  const mins = minutesSinceMidnight(now, timeZone)
  const oakStart = hmToMinutes(config.oakStartHour, config.oakStartMinute)
  const oakEnd = hmToMinutes(config.oakEndHour, config.oakEndMinute)
  const transitionEnd = oakEnd + config.transitionMinutes

  if (isWeekday(now, timeZone)) {
    if (mins >= oakStart && mins < oakEnd) return oakAction()
    if (mins >= oakEnd && mins < transitionEnd) return transitionAction()
  }

  if (inSnooze(state, now)) {
    return {
      id: 'snoozed',
      title: 'Snoozed. Breathe — then return when the timer ends.',
      durationMin: Math.max(
        1,
        Math.ceil(
          (new Date(state.snoozeUntil!).getTime() - now.getTime()) / 60_000,
        ),
      ),
      why: 'Snooze is a pause, not a new plan. Max 2 per day.',
      domain: 'rest',
      kind: 'rest',
    }
  }

  if (pastDayEnd(mins, config)) {
    return restAction(
      `Day end (${String(config.dayEndHour).padStart(2, '0')}:${String(config.dayEndMinute).padStart(2, '0')}). Stop the queue — protect sleep. Tomorrow’s queue starts after day start.`,
    )
  }

  const day = floorForToday(state, dateKey)
  const low = energyLowActive(state, dateKey)

  if (
    inWeekendProjectWindow(now, timeZone, config, state.week) &&
    !isFloorDone(day, 'project_deep')
  ) {
    return actionFor('project_deep', config, state.week, state.ledgerBridge, dateKey, day)
  }

  const queue = low
    ? ENERGY_LOW_QUEUE
    : isWeekday(now, timeZone)
      ? WEEKDAY_QUEUE
      : WEEKEND_AFTER_QUEUE

  const next = firstDueInQueue(queue, state, now, timeZone, config, prayerTimes, dateKey)
  if (next) return next

  if (low) {
    return restAction(
      'Energy low: only cyber + German were required. Rest. Clear Energy low tomorrow.',
    )
  }

  if (isWeekday(now, timeZone)) {
    return restAction(
      'Weekday queue clear. Protect sleep. Weekend: projects 10:00–14:00 + content batch.',
    )
  }
  const sundayCloseDue =
    zonedParts(now, timeZone).weekday === 0 && state.week.sundayClose?.dateKey !== dateKey
  return restAction(
    'Weekend queue clear (or project window finished). Light living — protect sleep.' +
      (sundayCloseDue ? ' Sunday close (5 min) is waiting on the Weekend page.' : ''),
  )
}
