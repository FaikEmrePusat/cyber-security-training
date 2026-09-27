import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MAX_MONTH_GOALS,
  MAX_WEEKEND_IDEAS,
  addMonthsToKey,
  calendarDateKey,
  monthKeyOf,
  setMonthPlan,
  type MonthPlan,
} from 'usta-core'
import { getDeviceId } from '../lib/deviceId'
import { useUsta } from '../state/UstaProvider'

function formatMonth(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y!, m! - 1, 1)),
  )
}

function padded(list: readonly string[], n: number): string[] {
  return [...list, ...Array<string>(Math.max(0, n - list.length)).fill('')].slice(0, n)
}

function MonthForm({ monthKey, plan }: { monthKey: string; plan: MonthPlan | undefined }) {
  const { state, setState } = useUsta()
  const [theme, setTheme] = useState(plan?.theme ?? '')
  const [goals, setGoals] = useState(() => padded(plan?.goals ?? [], MAX_MONTH_GOALS))
  const [ideas, setIdeas] = useState(() => padded(plan?.weekendIdeas ?? [], MAX_WEEKEND_IDEAS))
  const [saved, setSaved] = useState<string | null>(null)

  const save = () => {
    setState(setMonthPlan(state, monthKey, { theme, goals, weekendIdeas: ideas }, getDeviceId()))
    setSaved('Saved. Weekend project and batch commands on Now mention the month focus.')
  }

  const setAt = (list: string[], set: (v: string[]) => void, i: number, v: string) =>
    set(list.map((x, j) => (j === i ? v : x)))

  return (
    <>
      <label className="field" htmlFor="month-theme">
        Theme for {formatMonth(monthKey)}
        <input
          id="month-theme"
          autoComplete="off"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="e.g. Detection engineering month…"
        />
      </label>

      <fieldset className="field">
        <legend>Month goals (up to {MAX_MONTH_GOALS}) — what will be true at month end?</legend>
        {goals.map((g, i) => (
          <input
            key={i}
            aria-label={`Goal ${i + 1}`}
            autoComplete="off"
            value={g}
            onChange={(e) => setAt(goals, setGoals, i, e.target.value)}
            placeholder={i === 0 ? 'e.g. 10 Sigma rules tested on the lab VM…' : ''}
          />
        ))}
      </fieldset>

      <fieldset className="field">
        <legend>Weekend project ideas (up to {MAX_WEEKEND_IDEAS})</legend>
        {ideas.map((g, i) => (
          <input
            key={i}
            aria-label={`Weekend idea ${i + 1}`}
            autoComplete="off"
            value={g}
            onChange={(e) => setAt(ideas, setIdeas, i, e.target.value)}
            placeholder={i === 0 ? 'e.g. Sigma lab on the VM…' : ''}
          />
        ))}
      </fieldset>

      <div className="actions">
        <button type="button" className="primary" onClick={save}>
          Save month
        </button>
      </div>
      {saved ? (
        <p className="msg ok" role="status">
          {saved}
        </p>
      ) : null}
    </>
  )
}

export function MonthPage() {
  const { state } = useUsta()
  const thisMonth = monthKeyOf(calendarDateKey(new Date(), state.config.timezone))
  const [offset, setOffset] = useState(0)
  const monthKey = addMonthsToKey(thisMonth, offset)

  return (
    <section>
      <div className="page-head">
        <h1>Month</h1>
        <p>
          A light layer above the weekend: one theme, a few goals, and project ideas. It informs the{' '}
          <Link to="/week">Weekend</Link> plan. <Link to="/">Now</Link> still decides every daily
          block.
        </p>
      </div>

      <div className="actions" role="group" aria-label="Which month">
        <button type="button" className={offset === 0 ? 'primary' : ''} onClick={() => setOffset(0)}>
          This month
        </button>
        <button type="button" className={offset === 1 ? 'primary' : ''} onClick={() => setOffset(1)}>
          Next month
        </button>
      </div>

      <MonthForm key={monthKey} monthKey={monthKey} plan={state.months[monthKey]} />

      <p className="hint">
        Keep it short. On the Weekend page, “Use as project” copies an idea into the project title.
        Cyber and German detail stays in Cyber Ledger.
      </p>
    </section>
  )
}
