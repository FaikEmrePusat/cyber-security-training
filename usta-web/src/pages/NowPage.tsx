import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  WEEKDAY_QUEUE,
  calendarDateKey,
  isProjectDay,
  isQueueItemDone,
  isWeekday,
  zonedParts,
  type FloorItemId,
} from 'usta-core'
import { useUsta } from '../state/UstaProvider'

const CHIP_LABELS: Partial<Record<FloorItemId, string>> = {
  ledger_touch: 'Cyber',
  german_block: 'German',
  faith_quran: 'Qur’an',
  faith_cevsen: 'Cevşen',
  faith_other: 'Faith+',
  books_pages: 'Books',
  music_play: 'Music',
  content_publish: 'Share',
  project_deep: 'Project',
  content_batch: 'Batch',
}

export function NowPage() {
  const {
    action,
    markDone,
    undoLastDone,
    unmarkDoneItem,
    clearTodayDones,
    canUndoDone,
    snooze,
    energyLow,
    state,
  } = useUsta()
  const [msg, setMsg] = useState<string | null>(null)
  const tz = state.config.timezone
  const now = new Date()
  const dateKey = calendarDateKey(now, tz)
  const day = state.floor[dateKey] ?? {}
  const weekday = isWeekday(now, tz)
  const projectToday = isProjectDay(zonedParts(now, tz).weekday, state.week.projectDays)
  const track: FloorItemId[] = weekday
    ? [...WEEKDAY_QUEUE]
    : [
        ...(projectToday ? (['project_deep'] as FloorItemId[]) : []),
        'content_batch',
        'ledger_touch',
        'german_block',
        'faith_quran',
        'faith_cevsen',
        'faith_other',
        'books_pages',
        'music_play',
      ]

  const doneIds = track.filter((id) => Boolean(day[id]))

  const onSnooze = () => {
    const r = snooze()
    setMsg(r.ok ? 'Paused 15 minutes. Come back when ready.' : (r.reason ?? 'Cannot snooze now'))
  }

  const onUndo = () => {
    if (undoLastDone()) {
      setMsg('Undid the last Done. That block is open again.')
    } else {
      setMsg('Nothing to undo right now — use the list below to clear any Done.')
    }
  }

  const onClearOne = (id: FloorItemId) => {
    if (unmarkDoneItem(id)) {
      setMsg(`Cleared “${CHIP_LABELS[id] ?? id}”. It is open in the queue again.`)
    } else {
      setMsg(`Could not clear “${CHIP_LABELS[id] ?? id}”. Try Reset today.`)
    }
  }

  const onResetToday = () => {
    const ok = window.confirm(
      'Clear ALL Done marks for today? The queue starts from the first block again. Energy-low for today is also cleared.',
    )
    if (!ok) return
    if (clearTodayDones()) {
      setMsg('Today reset. No blocks are marked Done.')
    } else {
      setMsg('Nothing to reset — today had no Done marks.')
    }
  }

  return (
    <section className="hero-action" aria-live="polite">
      <p className="hint">
        <strong>This is your main screen.</strong> Do the command → <strong>Done — next</strong>. Wrong
        Done? Clear it in <strong>Today’s Dones</strong> below (any item), or <strong>Reset today</strong>.
        Guide: <Link to="/guide">How to use</Link>.
      </p>

      <div className="queue-track" aria-label="Today’s queue progress">
        {track.map((id) => {
          const done = isQueueItemDone(state, dateKey, id, !weekday)
          const current = action.id === id
          return (
            <span
              key={id}
              className={`queue-chip${done ? ' done' : ''}${current ? ' current' : ''}`}
            >
              {CHIP_LABELS[id] ?? id}
            </span>
          )
        })}
      </div>

      <p className="kind-badge">
        {action.kind === 'oak'
          ? 'Oak class'
          : action.kind === 'transition'
            ? 'Transition'
            : action.kind === 'weekend'
              ? 'Weekend block'
              : action.kind === 'rest'
                ? 'Rest'
                : 'Queue block'}{' '}
        · ~{action.durationMin} min
        {state.energyLow && state.energyLowDate === dateKey ? ' · energy-low mode' : ''}
      </p>

      <h1>{action.title}</h1>
      <p className="why">{action.why}</p>

      <div className="actions">
        <button type="button" className="primary" onClick={markDone}>
          Done — next
        </button>
        {canUndoDone ? (
          <button type="button" onClick={onUndo} aria-label="Undo the last Done mark">
            Undo last Done
          </button>
        ) : null}
        <button type="button" onClick={onSnooze} aria-label="Snooze this command for 15 minutes">
          Snooze 15m
        </button>
        <button
          type="button"
          onClick={energyLow}
          aria-label="Mark energy low — only cyber and German required today"
        >
          Energy low
        </button>
        {action.domain === 'ledger' || action.domain === 'german' ? (
          <a className="btn" href={state.config.ledgerBaseUrl} target="_blank" rel="noreferrer">
            Open Ledger
          </a>
        ) : null}
      </div>
      {msg ? (
        <p
          className={`msg${msg.toLowerCase().includes('could not') || msg.toLowerCase().includes('nothing to') ? ' err' : ' ok'}`}
          role="status"
        >
          {msg}
        </p>
      ) : null}

      <div className="done-panel">
        <h2 className="done-panel-title">Today’s Dones</h2>
        <p className="done-panel-lead">
          Clear any mistaken mark. This is the reliable way — not only the last Done.
        </p>
        {doneIds.length === 0 ? (
          <p className="meta">No Done marks yet today.</p>
        ) : (
          <ul className="done-list">
            {doneIds.map((id) => (
              <li key={id}>
                <span>{CHIP_LABELS[id] ?? id}</span>
                <button type="button" onClick={() => onClearOne(id)}>
                  Clear
                </button>
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="danger-btn" onClick={onResetToday}>
          Reset today (clear all Dones)
        </button>
      </div>
    </section>
  )
}
