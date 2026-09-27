import { describe, expect, it } from 'vitest'
import { computeNextAction } from './nowEngine.js'
import { createEmptyState } from './types.js'
import { migrateState } from './migrate.js'
import { mergeStates } from './merge.js'
import { addMonthsToKey, monthContextLine, monthKeyOf, setMonthPlan } from './month.js'

/** Istanbul is UTC+3 all year. */
function ist(y: number, m: number, d: number, h: number, min: number): Date {
  return new Date(Date.UTC(y, m - 1, d, h - 3, min))
}

const SAT_11 = ist(2026, 9, 26, 11, 0)
const MON_16 = ist(2026, 9, 28, 16, 0)

describe('month keys', () => {
  it('monthKeyOf and addMonthsToKey cross year boundaries', () => {
    expect(monthKeyOf('2026-09-26')).toBe('2026-09')
    expect(addMonthsToKey('2026-12', 1)).toBe('2027-01')
    expect(addMonthsToKey('2026-01', -1)).toBe('2025-12')
  })
})

describe('setMonthPlan', () => {
  it('trims, caps lists, bumps rev, and deletes an empty plan', () => {
    const s = createEmptyState('d1')
    const saved = setMonthPlan(
      s,
      '2026-09',
      { theme: ' Detection ', goals: ['a', ' ', 'b', 'c', 'd'], weekendIdeas: ['Sigma lab'] },
      'd1',
    )
    expect(saved.months['2026-09']).toMatchObject({
      theme: 'Detection',
      goals: ['a', 'b', 'c'],
      weekendIdeas: ['Sigma lab'],
    })
    expect(saved.rev).toBe(s.rev + 1)
    const cleared = setMonthPlan(saved, '2026-09', { theme: '', goals: [], weekendIdeas: [] }, 'd1')
    expect(cleared.months['2026-09']).toBeUndefined()
  })

  it('prunes months older than a year', () => {
    let s = createEmptyState('d1')
    s = setMonthPlan(s, '2025-01', { theme: 'Old', goals: [], weekendIdeas: [] }, 'd1')
    s = setMonthPlan(s, '2026-09', { theme: 'Now', goals: [], weekendIdeas: [] }, 'd1')
    expect(Object.keys(s.months)).toEqual(['2026-09'])
  })
})

describe('month context in NowEngine', () => {
  it('adds the month focus to the weekend project why, without changing the pick', () => {
    const plain = createEmptyState('d1')
    const s = setMonthPlan(
      plain,
      '2026-09',
      { theme: 'Detection engineering', goals: ['Sigma basics'], weekendIdeas: [] },
      'd1',
    )
    const a = computeNextAction(SAT_11, s, s.config, null)
    const b = computeNextAction(SAT_11, plain, plain.config, null)
    expect(a.id).toBe('project_deep')
    expect(a.id).toBe(b.id)
    expect(a.title).toBe(b.title)
    expect(a.why).toBe(`${b.why} Month focus: Detection engineering (Sigma basics).`)
  })

  it('leaves weekday queue commands alone', () => {
    const s = setMonthPlan(createEmptyState('d1'), '2026-09', { theme: 'X', goals: [], weekendIdeas: [] }, 'd1')
    expect(computeNextAction(MON_16, s, s.config, null).why).not.toContain('Month focus')
  })

  it('monthContextLine handles theme-only and goals-only', () => {
    expect(monthContextLine(undefined)).toBe('')
    expect(monthContextLine({ theme: 'T', goals: [], weekendIdeas: ['x'], updatedAt: '' })).toBe(
      ' Month focus: T.',
    )
    expect(monthContextLine({ theme: '', goals: ['g1', 'g2'], weekendIdeas: [], updatedAt: '' })).toBe(
      ' Month focus: g1; g2.',
    )
  })
})

describe('months migrate + merge', () => {
  it('migrate drops bad keys and junk values', () => {
    const m = migrateState(
      {
        months: {
          '2026-09': { theme: 'Ok', goals: ['a', 3], weekendIdeas: 'nope' },
          '2026-13': { theme: 'bad month' },
          '2026-10': { theme: '', goals: [] },
        },
      },
      'd1',
    )
    expect(Object.keys(m.months)).toEqual(['2026-09'])
    expect(m.months['2026-09']).toMatchObject({ theme: 'Ok', goals: ['a'], weekendIdeas: [] })
    expect(migrateState({}, 'd1').months).toEqual({})
  })

  it('months follow the higher-rev document', () => {
    const base = createEmptyState('d1')
    const a = setMonthPlan(base, '2026-09', { theme: 'A', goals: [], weekendIdeas: [] }, 'a')
    const b = setMonthPlan(a, '2026-09', { theme: 'B', goals: [], weekendIdeas: [] }, 'b')
    expect(mergeStates(a, b).months['2026-09']!.theme).toBe('B')
    expect(mergeStates(b, a).months['2026-09']!.theme).toBe('B')
  })
})
