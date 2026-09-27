import type { MonthPlan, NextAction, UstaState } from './types.js'
import { bumpRev } from './merge.js'

export const MAX_MONTH_GOALS = 3
export const MAX_WEEKEND_IDEAS = 5
const MONTHS_KEPT = 12
const TEXT_MAX = 160

export const MONTH_KEY = /^\d{4}-(0[1-9]|1[0-2])$/

/** `YYYY-MM` for a `YYYY-MM-DD` day key. */
export function monthKeyOf(dateKey: string): string {
  return dateKey.slice(0, 7)
}

export function addMonthsToKey(monthKey: string, months: number): string {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(Date.UTC(y!, m! - 1 + months, 1))
  return d.toISOString().slice(0, 7)
}

export function monthPlanFor(state: UstaState, dateKey: string): MonthPlan | undefined {
  return state.months[monthKeyOf(dateKey)]
}

function cleanList(items: readonly string[], max: number): string[] {
  return items
    .map((s) => s.trim().slice(0, TEXT_MAX))
    .filter(Boolean)
    .slice(0, max)
}

export function normalizeMonthPlan(input: {
  theme?: string
  goals?: readonly string[]
  weekendIdeas?: readonly string[]
  updatedAt?: string
}): MonthPlan {
  return {
    theme: (input.theme ?? '').trim().slice(0, TEXT_MAX),
    goals: cleanList(input.goals ?? [], MAX_MONTH_GOALS),
    weekendIdeas: cleanList(input.weekendIdeas ?? [], MAX_WEEKEND_IDEAS),
    updatedAt: input.updatedAt ?? '',
  }
}

function isEmptyPlan(p: MonthPlan): boolean {
  return !p.theme && p.goals.length === 0 && p.weekendIdeas.length === 0
}

/** Save one month (empty plan deletes it). Keeps the last 12 months before `monthKey`. */
export function setMonthPlan(
  state: UstaState,
  monthKey: string,
  input: { theme: string; goals: readonly string[]; weekendIdeas: readonly string[] },
  deviceId: string,
  now = new Date(),
): UstaState {
  const plan = normalizeMonthPlan({ ...input, updatedAt: now.toISOString() })
  const oldest = addMonthsToKey(monthKey, -MONTHS_KEPT)
  const months: UstaState['months'] = {}
  for (const [k, v] of Object.entries(state.months)) if (k >= oldest && k !== monthKey) months[k] = v
  if (!isEmptyPlan(plan)) months[monthKey] = plan
  return bumpRev({ ...state, months }, deviceId, now)
}

/** Short context for weekend commands; empty when the month has no theme or goals. */
export function monthContextLine(plan: MonthPlan | undefined): string {
  if (!plan || (!plan.theme && plan.goals.length === 0)) return ''
  const goals = plan.goals.length > 0 ? plan.goals.join('; ') : ''
  if (plan.theme && goals) return ` Month focus: ${plan.theme} (${goals}).`
  return ` Month focus: ${plan.theme || goals}.`
}

/**
 * The month layer only colours weekend planning commands. NowEngine still decides
 * what comes next every day; this never changes which action is picked.
 */
export function withMonthContext(action: NextAction, state: UstaState, dateKey: string): NextAction {
  if (action.id !== 'project_deep' && action.id !== 'content_batch') return action
  const line = monthContextLine(monthPlanFor(state, dateKey))
  return line ? { ...action, why: `${action.why}${line}` } : action
}
