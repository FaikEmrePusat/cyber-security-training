import { describe, expect, it } from 'vitest'
import { computeNextAction } from '../src/nowEngine.js'
import { createEmptyState, type UstaState } from '../src/types.js'
import { calendarDateKey } from '../src/time.js'
import { mergeStates, markFloorDone, unmarkFloorDone } from '../src/merge.js'
import { migrateState } from '../src/migrate.js'

const TZ = 'Europe/Istanbul'

function istanbulDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  let guess = new Date(Date.UTC(year, month - 1, day, hour - 3, minute, 0))
  for (let i = 0; i < 4; i++) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(guess)
    const map: Record<string, string> = {}
    for (const p of parts) if (p.type !== 'literal') map[p.type] = p.value
    const gotMin = Number(map.hour) * 60 + Number(map.minute)
    const wantMin = hour * 60 + minute
    const dayGot = Number(map.day)
    guess = new Date(
      guess.getTime() +
        (wantMin - gotMin) * 60_000 +
        (day - dayGot) * 86_400_000,
    )
  }
  return guess
}

function baseState(): UstaState {
  return createEmptyState('test-device')
}

const PRAYERS_MON = {
  fajr: istanbulDate(2026, 9, 28, 5, 30),
  dhuhr: istanbulDate(2026, 9, 28, 13, 0),
  asr: istanbulDate(2026, 9, 28, 16, 0),
  maghrib: istanbulDate(2026, 9, 28, 19, 0),
  isha: istanbulDate(2026, 9, 28, 20, 30),
}

describe('computeNextAction', () => {
  it('locks oak on weekday 10:00–14:00 Istanbul', () => {
    const now = istanbulDate(2026, 9, 28, 11, 0)
    expect(computeNextAction(now, baseState()).id).toBe('oak_presence')
  })

  it('returns oak_transition 14:00–14:20 weekdays', () => {
    expect(computeNextAction(istanbulDate(2026, 9, 28, 14, 10), baseState()).id).toBe(
      'oak_transition',
    )
  })

  it('weekday queue: ledger → german → faith×3 → books → music', () => {
    const now = istanbulDate(2026, 9, 28, 15, 0)
    const state = baseState()
    const dateKey = calendarDateKey(now, TZ)

    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('ledger_touch')

    state.floor[dateKey] = { ledger_touch: true }
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('german_block')

    state.floor[dateKey] = { ledger_touch: true, german_block: true }
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('faith_quran')

    state.floor[dateKey] = {
      ledger_touch: true,
      german_block: true,
      faith_quran: true,
    }
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('faith_cevsen')

    state.floor[dateKey] = {
      ledger_touch: true,
      german_block: true,
      faith_quran: true,
      faith_cevsen: true,
    }
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('faith_other')

    state.floor[dateKey] = {
      ledger_touch: true,
      german_block: true,
      faith_quran: true,
      faith_cevsen: true,
      faith_other: true,
    }
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('books_pages')

    state.floor[dateKey] = {
      ...state.floor[dateKey],
      books_pages: true,
    }
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('music_play')
  })

  it('does not start oak on weekend; 10–14 is project', () => {
    const now = istanbulDate(2026, 9, 27, 11, 0)
    expect(computeNextAction(now, baseState()).id).toBe('project_deep')
  })

  it('weekend after 14:00 offers content batch first', () => {
    const now = istanbulDate(2026, 9, 27, 15, 0)
    expect(computeNextAction(now, baseState(), undefined, null).id).toBe('content_batch')
  })
})

describe('oak lock vs snooze', () => {
  it('snooze does not override oak lock', () => {
    const now = istanbulDate(2026, 9, 28, 10, 5)
    const state = baseState()
    state.snoozeUntil = new Date(now.getTime() + 10 * 60_000).toISOString()
    expect(computeNextAction(now, state).id).toBe('oak_presence')
  })

  it('snooze does not override oak transition', () => {
    const now = istanbulDate(2026, 9, 28, 14, 5)
    const state = baseState()
    state.snoozeUntil = new Date(now.getTime() + 10 * 60_000).toISOString()
    expect(computeNextAction(now, state).id).toBe('oak_transition')
  })

  it('snooze applies outside oak', () => {
    const now = istanbulDate(2026, 9, 28, 15, 0)
    const state = baseState()
    state.snoozeUntil = new Date(now.getTime() + 10 * 60_000).toISOString()
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('snoozed')
  })
})

describe('due anchors', () => {
  it('nothing before day start / fajr', () => {
    const now = istanbulDate(2026, 9, 28, 5, 0)
    expect(computeNextAction(now, baseState(), undefined, PRAYERS_MON).kind).toBe('rest')
  })

  it('weekday ledger waits for oak transition end', () => {
    const state = baseState()
    // Morning after fajr but before oak — faith can run, not ledger
    expect(computeNextAction(istanbulDate(2026, 9, 28, 8, 0), state, state.config, PRAYERS_MON).id).toBe(
      'faith_quran',
    )
  })
})

describe('day end', () => {
  it('stops the queue at day end (default 23:00)', () => {
    const state = baseState()
    const now = istanbulDate(2026, 9, 28, 23, 15)
    const a = computeNextAction(now, state, state.config, PRAYERS_MON)
    expect(a.id).toBe('rest_or_light')
    expect(a.why).toContain('Day end (23:00)')
  })

  it('respects a custom day end', () => {
    const state = baseState()
    state.config.dayEndHour = 21
    state.config.dayEndMinute = 30
    expect(
      computeNextAction(istanbulDate(2026, 9, 28, 21, 0), state, state.config, PRAYERS_MON).id,
    ).toBe('ledger_touch')
    expect(
      computeNextAction(istanbulDate(2026, 9, 28, 21, 45), state, state.config, PRAYERS_MON).id,
    ).toBe('rest_or_light')
  })

  it('day end after midnight does not rest the whole evening', () => {
    const state = baseState()
    state.config.dayEndHour = 1
    state.config.dayEndMinute = 0
    expect(
      computeNextAction(istanbulDate(2026, 9, 28, 23, 30), state, state.config, PRAYERS_MON).id,
    ).toBe('ledger_touch')
  })
})

describe('ledger bridge', () => {
  it('uses Ledger Today titles for cyber and German when the bridge is for today', () => {
    const state = baseState()
    const now = istanbulDate(2026, 9, 28, 15, 0)
    const dateKey = calendarDateKey(now, TZ)
    state.ledgerBridge = {
      dateKey,
      updatedAt: now.toISOString(),
      tasks: [
        { id: 'r', title: 'Break', kind: 'dinlenme', minutes: 15 },
        { id: 'a', title: 'Windows event logs', kind: 'konu', minutes: 40 },
        { id: 'b', title: 'A2 Lektion 3', kind: 'dil', minutes: 30 },
      ],
    }
    const cyber = computeNextAction(now, state, state.config, PRAYERS_MON)
    expect(cyber.title).toBe('Cyber (from Ledger): Windows event logs')
    expect(cyber.durationMin).toBe(40)
    state.floor[dateKey] = { ledger_touch: true }
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).title).toBe(
      'German (from Ledger): A2 Lektion 3',
    )
  })

  it('ignores a stale bridge from another day', () => {
    const state = baseState()
    state.ledgerBridge = {
      dateKey: '2026-09-27',
      updatedAt: '2026-09-27T10:00:00.000Z',
      tasks: [{ id: 'a', title: 'Old task', kind: 'konu', minutes: 40 }],
    }
    const a = computeNextAction(istanbulDate(2026, 9, 28, 15, 0), state, state.config, PRAYERS_MON)
    expect(a.title).not.toContain('Old task')
  })
})

describe('energy low', () => {
  const dateKey = '2026-09-28'
  const now = istanbulDate(2026, 9, 28, 18, 0)

  it('energy low only requires ledger + german then rest', () => {
    const state = baseState()
    state.energyLow = true
    state.energyLowDate = dateKey
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('ledger_touch')
    state.floor[dateKey] = { ledger_touch: true, german_block: true }
    expect(computeNextAction(now, state, state.config, PRAYERS_MON).id).toBe('rest_or_light')
  })
})

describe('mergeStates snooze counts', () => {
  it('same day takes max', () => {
    const a = baseState()
    const b = baseState()
    a.snoozesDate = b.snoozesDate = '2026-09-28'
    a.snoozesToday = 1
    b.snoozesToday = 2
    expect(mergeStates(a, b).snoozesToday).toBe(2)
  })

  it('markFloorDone bumps rev', () => {
    const s = markFloorDone(baseState(), '2026-09-28', 'ledger_touch', 'd1')
    expect(s.rev).toBe(1)
    expect(s.floor['2026-09-28']?.ledger_touch).toBe(true)
  })
})

describe('unmarkFloorDone', () => {
  it('clears a mistaken Done', () => {
    const done = markFloorDone(baseState(), '2026-09-28', 'ledger_touch', 'd1')
    const undone = unmarkFloorDone(done, '2026-09-28', 'ledger_touch', 'd1')
    expect(undone.floor['2026-09-28']?.ledger_touch).toBeUndefined()
    expect(undone.rev).toBeGreaterThan(done.rev)
  })
})

describe('migrateState', () => {
  it('maps legacy faith_tiny / german_tiny', () => {
    const m = migrateState(
      {
        rev: 3,
        config: { timezone: 'Europe/Istanbul' },
        floor: { '2026-09-28': { faith_tiny: true, german_tiny: true, journal_due: true } },
        week: { primaryA: 'AI SIEM', optional: 'LinkedIn batch' },
      },
      'd1',
    )
    expect(m.floor['2026-09-28']?.faith_quran).toBe(true)
    expect(m.floor['2026-09-28']?.german_block).toBe(true)
    expect(m.week.weekendProjectLabel).toBe('AI SIEM')
    expect(m.config.blockCapMinutes).toBe(50)
    expect(m.config.dayEndHour).toBe(23)
    expect(m.ledgerBridge).toBeNull()
  })

  it('OR-merge no longer resurrects a cleared Done when undo has higher rev', () => {
    const a = baseState()
    a.rev = 2
    a.floor['2026-09-28'] = { content_batch: true, ledger_touch: true }
    const b = baseState()
    b.rev = 3
    b.updatedAt = '2099-01-01T00:00:00.000Z'
    b.floor['2026-09-28'] = { content_batch: true }
    const m = mergeStates(a, b)
    expect(m.floor['2026-09-28']?.content_batch).toBe(true)
    expect(m.floor['2026-09-28']?.ledger_touch).toBeUndefined()
  })
})
