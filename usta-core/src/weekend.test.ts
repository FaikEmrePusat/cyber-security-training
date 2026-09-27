import { describe, expect, it } from 'vitest'
import { computeNextAction, isQueueItemDone } from './nowEngine.js'
import { createEmptyState, type UstaState } from './types.js'
import { migrateState } from './migrate.js'
import { markQueueDone, mergeStates, setLifeDone, unmarkFloorDone } from './merge.js'
import {
  addDaysToDateKey,
  applySundayClose,
  formatBlockPlan,
  isProjectDay,
  lifeTickDone,
  lifeTickProgress,
  normalizeBlocks,
  publishFirstReady,
  setLifeTick,
  uncheckedLifeTicks,
  weekendDateKeys,
} from './weekend.js'

const TZ = 'Europe/Istanbul'

/** Istanbul is UTC+3 all year. */
function ist(y: number, m: number, d: number, h: number, min: number): Date {
  return new Date(Date.UTC(y, m - 1, d, h - 3, min))
}

function base(): UstaState {
  return createEmptyState('test-device')
}

// 2026-09-26 = Saturday, 2026-09-27 = Sunday, 2026-09-28 = Monday
const SAT = '2026-09-26'
const SUN = '2026-09-27'
const MON = '2026-09-28'

describe('weekend date helpers', () => {
  it('addDaysToDateKey crosses month and year boundaries', () => {
    expect(addDaysToDateKey('2026-09-30', 1)).toBe('2026-10-01')
    expect(addDaysToDateKey('2027-01-01', -1)).toBe('2026-12-31')
  })

  it('weekendDateKeys returns the current weekend on Sat/Sun and the next one on weekdays', () => {
    expect(weekendDateKeys(ist(2026, 9, 26, 12, 0), TZ)).toEqual({ sat: SAT, sun: SUN })
    expect(weekendDateKeys(ist(2026, 9, 27, 22, 0), TZ)).toEqual({ sat: SAT, sun: SUN })
    expect(weekendDateKeys(ist(2026, 9, 28, 9, 0), TZ)).toEqual({
      sat: '2026-10-03',
      sun: '2026-10-04',
    })
  })

  it('isProjectDay honours Sat / Sun / both', () => {
    expect(isProjectDay(6, 'both')).toBe(true)
    expect(isProjectDay(0, 'both')).toBe(true)
    expect(isProjectDay(6, 'sun')).toBe(false)
    expect(isProjectDay(0, 'sat')).toBe(false)
    expect(isProjectDay(3, 'both')).toBe(false)
  })
})

describe('block plan', () => {
  it('normalizeBlocks clamps, rounds, caps and falls back to 2×50', () => {
    expect(normalizeBlocks([5, 49.6, 500])).toEqual([10, 50, 120])
    expect(normalizeBlocks([])).toEqual([50, 50])
    expect(normalizeBlocks('x')).toEqual([50, 50])
    expect(normalizeBlocks(Array(12).fill(25))).toHaveLength(8)
  })

  it('formatBlockPlan', () => {
    expect(formatBlockPlan([50, 50])).toBe('2 × 50 min')
    expect(formatBlockPlan([45])).toBe('45 min')
    expect(formatBlockPlan([50, 25])).toBe('50 + 25 min')
  })
})

describe('content factory', () => {
  it('publishFirstReady flips only the first Ready post', () => {
    const w = base().week
    w.contentPosts = [
      { id: 'a', title: 'Draft one', status: 'draft' },
      { id: 'b', title: 'SIEM notes', status: 'ready' },
      { id: 'c', title: 'KQL tips', status: 'ready' },
    ]
    const next = publishFirstReady(w)
    expect(next.contentPosts.map((p) => p.status)).toEqual(['draft', 'published', 'ready'])
    expect(w.contentPosts[1]!.status).toBe('ready')
  })

  it('weekday content_publish shows the Ready title', () => {
    const s = base()
    s.week.contentPosts = [
      { id: 'a', title: 'Draft one', status: 'draft' },
      { id: 'b', title: 'SIEM notes', status: 'ready' },
    ]
    s.floor[MON] = {
      ledger_touch: true,
      german_block: true,
      faith_quran: true,
      faith_cevsen: true,
      faith_other: true,
      books_pages: true,
      music_play: true,
    }
    const a = computeNextAction(ist(2026, 9, 28, 16, 0), s, s.config, null)
    expect(a.id).toBe('content_publish')
    expect(a.title).toBe('Content: publish “SIEM notes” (Ready).')
  })

  it('Done on content_publish marks the first Ready post Published', () => {
    const s = base()
    s.week.contentPosts = [
      { id: 'a', title: 'Draft one', status: 'draft' },
      { id: 'b', title: 'SIEM notes', status: 'ready' },
      { id: 'c', title: 'KQL tips', status: 'ready' },
    ]
    const next = markQueueDone(s, MON, 'content_publish', 'd1')
    expect(next.floor[MON]?.content_publish).toBe(true)
    expect(next.week.contentPosts.map((p) => p.status)).toEqual(['draft', 'published', 'ready'])
    expect(next.actionHistory[0]!.title).toBe('Published: SIEM notes')
    expect(next.rev).toBe(s.rev + 1)

    const other = markQueueDone(s, MON, 'books_pages', 'd1')
    expect(other.week.contentPosts).toEqual(s.week.contentPosts)
  })

  it('weekend content_batch names the first draft', () => {
    const s = base()
    s.week.contentPosts = [
      { id: 'a', title: 'Log triage story', status: 'draft' },
      { id: 'b', title: 'Second', status: 'draft' },
    ]
    const a = computeNextAction(ist(2026, 9, 27, 15, 0), s, s.config, null)
    expect(a.id).toBe('content_batch')
    expect(a.title).toBe('Content batch: finish “Log triage story” (+1 more draft).')
  })
})

describe('project day', () => {
  it('project_deep title uses title + block plan, why uses outcome', () => {
    const s = base()
    s.week.weekendProjectLabel = 'AI SIEM lab'
    s.week.projectOutcome = 'Sigma rules fire on the lab VM.'
    s.week.projectBlocks = [50, 50, 25]
    const a = computeNextAction(ist(2026, 9, 26, 11, 0), s, s.config, null)
    expect(a.id).toBe('project_deep')
    expect(a.title).toBe('Weekend project (10:00–14:00): AI SIEM lab — 50 + 50 + 25 min.')
    expect(a.durationMin).toBe(50)
    expect(a.why).toContain('When the weekend ends: Sigma rules fire on the lab VM.')
  })

  it('Saturday-only project leaves Sunday 10–14 to the after-queue', () => {
    const s = base()
    s.week.projectDays = 'sat'
    expect(computeNextAction(ist(2026, 9, 26, 11, 0), s, s.config, null).id).toBe('project_deep')
    expect(computeNextAction(ist(2026, 9, 27, 11, 0), s, s.config, null).id).toBe('content_batch')
  })
})

describe('weekend life ticks', () => {
  it('ticks satisfy weekend faith/books/music but never the weekday queue', () => {
    const s = base()
    s.week = setLifeTick(s.week, SUN, 'faith', true)
    s.week = setLifeTick(s.week, MON, 'faith', true)
    expect(isQueueItemDone(s, SUN, 'faith_cevsen', true)).toBe(true)
    expect(isQueueItemDone(s, MON, 'faith_cevsen', false)).toBe(false)

    s.floor[SUN] = { content_batch: true, ledger_touch: true, german_block: true }
    expect(computeNextAction(ist(2026, 9, 27, 16, 0), s, s.config, null).id).toBe('books_pages')
  })

  it('project why mentions unchecked ticks lightly', () => {
    const s = base()
    s.week = setLifeTick(s.week, SAT, 'books', true)
    const a = computeNextAction(ist(2026, 9, 26, 11, 0), s, s.config, null)
    expect(a.why).toContain('Later today, lightly: faith, music.')
  })

  it('uncheckedLifeTicks treats queue Done as covered', () => {
    const w = base().week
    expect(uncheckedLifeTicks(w, SAT, { music_play: true })).toEqual(['faith', 'books'])
  })

  it('setLifeDone writes the same floor flags Now uses, both ways', () => {
    let s = base()
    s = setLifeDone(s, SUN, 'faith', true, 'd1')
    expect(s.floor[SUN]).toEqual({ faith_quran: true, faith_cevsen: true, faith_other: true })
    expect(lifeTickDone(s.floor[SUN], 'faith')).toBe(true)

    s.floor[SUN] = { content_batch: true, ledger_touch: true, german_block: true, ...s.floor[SUN] }
    expect(computeNextAction(ist(2026, 9, 27, 16, 0), s, s.config, null).id).toBe('books_pages')

    s = unmarkFloorDone(s, SUN, 'faith_cevsen', 'd1')
    expect(lifeTickDone(s.floor[SUN], 'faith')).toBe(false)
    expect(lifeTickProgress(s.floor[SUN], 'faith')).toEqual({ done: 2, total: 3 })

    s = setLifeDone(s, SUN, 'faith', false, 'd1')
    expect(s.floor[SUN]?.faith_quran).toBeUndefined()
    expect(s.floor[SUN]?.ledger_touch).toBe(true)
  })

  it('setLifeTick unchecks and prunes old days', () => {
    let w = base().week
    w = setLifeTick(w, '2026-08-01', 'music', true)
    w = setLifeTick(w, SAT, 'music', true)
    expect(Object.keys(w.lifeTicks)).toEqual([SAT])
    w = setLifeTick(w, SAT, 'music', false)
    expect(w.lifeTicks).toEqual({})
  })
})

describe('Sunday close', () => {
  it('copies the next project title and clears the old outcome', () => {
    const w = base().week
    w.weekendProjectLabel = 'Old'
    w.projectOutcome = 'old outcome'
    const next = applySundayClose(
      w,
      { wentWell: ' Shipped the parser ', nextProjectTitle: ' Honeypot v2 ' },
      SUN,
      '2026-09-27T18:00:00.000Z',
    )
    expect(next.weekendProjectLabel).toBe('Honeypot v2')
    expect(next.projectOutcome).toBeUndefined()
    expect(next.sundayClose).toEqual({
      dateKey: SUN,
      wentWell: 'Shipped the parser',
      nextProjectTitle: 'Honeypot v2',
      savedAt: '2026-09-27T18:00:00.000Z',
    })
  })

  it('keeps the current project when next title is empty', () => {
    const w = base().week
    w.weekendProjectLabel = 'Keep me'
    w.projectOutcome = 'still true'
    const next = applySundayClose(w, { wentWell: 'ok', nextProjectTitle: '' }, SUN, 'x')
    expect(next.weekendProjectLabel).toBe('Keep me')
    expect(next.projectOutcome).toBe('still true')
  })

  it('Sunday rest copy nudges the close until it is saved', () => {
    const s = base()
    s.config.dayEndHour = 23
    s.floor[SUN] = {
      project_deep: true,
      content_batch: true,
      ledger_touch: true,
      german_block: true,
      faith_quran: true,
      faith_cevsen: true,
      faith_other: true,
      books_pages: true,
      music_play: true,
    }
    const at = ist(2026, 9, 27, 20, 0)
    expect(computeNextAction(at, s, s.config, null).why).toContain('Sunday close')
    s.week = applySundayClose(s.week, { wentWell: 'x', nextProjectTitle: '' }, SUN, 'x')
    expect(computeNextAction(at, s, s.config, null).why).not.toContain('Sunday close')
  })
})

describe('migrate + merge for weekend fields', () => {
  it('fills defaults for old payloads', () => {
    const m = migrateState({ week: { weekendProjectLabel: 'Lab' } }, 'd1')
    expect(m.week.projectBlocks).toEqual([50, 50])
    expect(m.week.projectDays).toBe('both')
    expect(m.week.contentPosts).toEqual([])
    expect(m.week.lifeTicks).toEqual({})
    expect(m.week.sundayClose).toBeNull()
  })

  it('sanitises posts, ticks and close', () => {
    const m = migrateState(
      {
        week: {
          projectDays: 'sun',
          projectOutcome: 'Done lab',
          contentPosts: [
            { id: 'a', title: 'One', status: 'ready' },
            { id: 'a', title: 'Dup id', status: 'weird' },
            'junk',
          ],
          lifeTicks: { [SAT]: { faith: true, books: 'yes' }, bad: { music: true } },
          sundayClose: { dateKey: SUN, wentWell: 'good', nextProjectTitle: 'Next' },
        },
      },
      'd1',
    )
    expect(m.week.projectDays).toBe('sun')
    expect(m.week.projectOutcome).toBe('Done lab')
    expect(m.week.contentPosts).toEqual([
      { id: 'a', title: 'One', status: 'ready' },
      { id: 'a-1', title: 'Dup id', status: 'draft' },
    ])
    expect(m.week.lifeTicks).toEqual({})
    expect(m.floor[SAT]).toEqual({ faith_quran: true, faith_cevsen: true, faith_other: true })
    expect(m.floor.bad).toBeUndefined()
    expect(m.week.sundayClose?.nextProjectTitle).toBe('Next')
  })

  it('accepts old week labels and post status words', () => {
    const m = migrateState(
      {
        week: {
          projectLabel: 'Old lab',
          outcome: 'It runs',
          days: 'Saturday',
          contentLabel: 'LinkedIn x2',
          contentPosts: [
            { id: 'a', title: 'A', status: 'Posted' },
            { id: 'b', label: 'B', status: 'scheduled' },
            { id: 'c', title: 'C', published: true },
            { id: 'd', title: 'D', status: 'Ready ' },
            { id: 'e', title: 'E', status: 'idea' },
          ],
        },
      },
      'd1',
    )
    expect(m.week.weekendProjectLabel).toBe('Old lab')
    expect(m.week.projectOutcome).toBe('It runs')
    expect(m.week.projectDays).toBe('sat')
    expect(m.week.contentBatchLabel).toBe('LinkedIn x2')
    expect(m.week.contentPosts.map((p) => [p.title, p.status])).toEqual([
      ['A', 'published'],
      ['B', 'ready'],
      ['C', 'published'],
      ['D', 'ready'],
      ['E', 'draft'],
    ])
  })

  it('still reads the 2+1 spotlight labels', () => {
    const m = migrateState({ week: { primaryA: 'Cyber lab', optional: 'Blog' } }, 'd1')
    expect(m.week.weekendProjectLabel).toBe('Cyber lab')
    expect(m.week.contentBatchLabel).toBe('Blog')
  })

  it('week is last-write-wins by rev', () => {
    const a = base()
    a.rev = 5
    a.week.contentPosts = [{ id: 'x', title: 'Newer', status: 'ready' }]
    const b = base()
    b.rev = 4
    b.week.contentPosts = [{ id: 'y', title: 'Older', status: 'draft' }]
    expect(mergeStates(b, a).week.contentPosts[0]!.title).toBe('Newer')
  })
})
