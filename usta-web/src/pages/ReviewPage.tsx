import { Link } from 'react-router-dom'
import { WEEKDAY_QUEUE, calendarDateKey } from 'usta-core'
import { useUsta } from '../state/UstaProvider'

export function ReviewPage() {
  const { state } = useUsta()
  const tz = state.config.timezone
  const days = Object.keys(state.floor).sort().slice(-7)
  const coreIds = WEEKDAY_QUEUE.filter((id) => id !== 'content_publish')

  let kept = 0
  for (const d of days) {
    const day = state.floor[d] ?? {}
    const ok = coreIds.filter((id) => day[id]).length >= 5
    if (ok) kept += 1
  }

  const today = calendarDateKey(new Date(), tz)
  const todayFloor = state.floor[today] ?? {}
  const snoozes = state.snoozesDate === today ? state.snoozesToday : 0

  return (
    <section>
      <div className="page-head">
        <h1>Review</h1>
        <p>
          Check honesty, not busyness. Did the five domains get real blocks? Use this on Sunday — then
          return to <Link to="/">Now</Link>.
        </p>
      </div>

      <p className="hint">
        <strong>How to read this:</strong> “Solid days” means at least five core queue items marked
        Done that day (cyber, German, three faith steps, books, music — share is bonus).
      </p>

      <p className="meta">
        Solid days (last {Math.max(days.length, 1)} logged):{' '}
        <strong style={{ color: 'var(--paper)' }}>
          {kept}/{Math.max(days.length, 1)}
        </strong>
      </p>
      <p className="meta">
        Weekend project: {state.week.weekendProjectLabel ?? '—'} · Content batch:{' '}
        {state.week.contentBatchLabel ?? '—'}
      </p>
      <p className="meta">
        Today ({today}) done:{' '}
        {coreIds.filter((id) => todayFloor[id]).map((id) => id.replace(/_/g, ' ')).join(', ') ||
          '— none yet —'}
      </p>
      <p className="meta">
        Today snoozes: {snoozes}/2
      </p>

      <h2
        style={{
          fontFamily: 'var(--font-voice)',
          fontSize: '1.15rem',
          margin: '1.5rem 0 0.75rem',
        }}
      >
        Recent Done presses
      </h2>
      <ul className="plain">
        {state.actionHistory.slice(0, 8).map((h) => (
          <li key={h.at + h.actionId}>
            {h.title} ·{' '}
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(h.at))}
          </li>
        ))}
        {state.actionHistory.length === 0 ? (
          <li>No Done presses yet. Start on Now and finish one block.</li>
        ) : null}
      </ul>
    </section>
  )
}
