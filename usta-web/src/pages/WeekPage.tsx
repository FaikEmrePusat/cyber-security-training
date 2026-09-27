import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  MAX_CONTENT_POSTS,
  MAX_PROJECT_BLOCKS,
  WEEKEND_LIFE_TICKS,
  applySundayClose,
  bumpRev,
  calendarDateKey,
  formatBlockPlan,
  hmToMinutes,
  lifeTickDone,
  lifeTickProgress,
  normalizeBlocks,
  setLifeDone,
  weekendDateKeys,
  zonedParts,
  type ContentPost,
  type ContentPostStatus,
  type FloorDay,
  type WeekPlan,
  type WeekendLifeTick,
  type WeekendProjectDays,
} from 'usta-core'
import { getDeviceId } from '../lib/deviceId'
import { useUsta } from '../state/UstaProvider'

const DEFAULT_PROJECT = 'Software / cyber project'
const DEFAULT_BATCH = 'Medium / LinkedIn batch for next week'

const DAY_OPTIONS: { value: WeekendProjectDays; label: string }[] = [
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
  { value: 'both', label: 'Both' },
]

const STATUS_OPTIONS: { value: ContentPostStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'ready', label: 'Ready' },
  { value: 'published', label: 'Published' },
]

const TICK_LABELS: Record<WeekendLifeTick, { label: string; hint: string }> = {
  faith: { label: 'Faith', hint: 'Qur’an, Cevşen or another source' },
  books: { label: 'Books', hint: 'A few pages of the current book' },
  music: { label: 'Music', hint: 'Ney or piano, one piece' },
}

function newPostId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function formatDateKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y!, m! - 1, d!)))
}

function sameBlocks(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((n, i) => n === b[i])
}

function samePosts(a: ContentPost[], b: ContentPost[]): boolean {
  return (
    a.length === b.length &&
    a.every((p, i) => p.id === b[i]!.id && p.title === b[i]!.title && p.status === b[i]!.status)
  )
}

type CommitWeek = (update: (week: WeekPlan) => WeekPlan) => void

function Card({
  step,
  title,
  lead,
  highlight,
  badge,
  children,
}: {
  step: number
  title: string
  lead: ReactNode
  highlight?: boolean
  badge?: string
  children: ReactNode
}) {
  const headingId = `wk-step-${step}`
  return (
    <section className={`wk-card${highlight ? ' is-today' : ''}`} aria-labelledby={headingId}>
      <header className="wk-card-head">
        <span className="wk-step" aria-hidden="true">
          {step}
        </span>
        <div>
          <h2 id={headingId}>
            {title}
            {badge ? <span className="wk-badge">{badge}</span> : null}
          </h2>
          <p className="wk-lead">{lead}</p>
        </div>
      </header>
      {children}
    </section>
  )
}

function SaveRow({
  label,
  dirty,
  saved,
  onSave,
}: {
  label: string
  dirty: boolean
  saved: string | null
  onSave: () => void
}) {
  return (
    <div className="wk-save-row">
      <button type="button" className="primary" onClick={onSave} disabled={!dirty}>
        {label}
      </button>
      <span className={`wk-save-state${dirty ? ' dirty' : ''}`} role="status">
        {dirty ? 'Unsaved changes' : saved}
      </span>
    </div>
  )
}

function Segmented<T extends string>({
  name,
  legend,
  value,
  options,
  onChange,
  compact,
}: {
  name: string
  legend: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  compact?: boolean
}) {
  return (
    <fieldset className={`segmented${compact ? ' compact' : ''}`}>
      <legend className={compact ? 'visually-hidden' : undefined}>{legend}</legend>
      <div className="segmented-track">
        {options.map((o) => (
          <label key={o.value} data-value={o.value}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function ProjectSection({
  week,
  windowMinutes,
  windowLabel,
  commitWeek,
}: {
  week: WeekPlan
  windowMinutes: number
  windowLabel: string
  commitWeek: CommitWeek
}) {
  const savedTitle = week.weekendProjectLabel ?? DEFAULT_PROJECT
  const savedOutcome = week.projectOutcome ?? ''
  const savedHibernate = week.hibernate.join(', ')
  const [title, setTitle] = useState(savedTitle)
  const [outcome, setOutcome] = useState(savedOutcome)
  const [blocks, setBlocks] = useState<number[]>(week.projectBlocks)
  const [days, setDays] = useState<WeekendProjectDays>(week.projectDays)
  const [hibernate, setHibernate] = useState(savedHibernate)
  const [saved, setSaved] = useState<string | null>(null)

  const dirty =
    title.trim() !== savedTitle ||
    outcome.trim() !== savedOutcome ||
    !sameBlocks(blocks, week.projectBlocks) ||
    days !== week.projectDays ||
    hibernate !== savedHibernate

  const total = blocks.reduce((a, b) => a + b, 0)
  const overWindow = total > windowMinutes

  const save = () => {
    const nextBlocks = normalizeBlocks(blocks)
    commitWeek((w) => ({
      ...w,
      weekendProjectLabel: title.trim() || DEFAULT_PROJECT,
      projectOutcome: outcome.trim() || undefined,
      projectBlocks: nextBlocks,
      projectDays: days,
      hibernate: hibernate
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      slots: [],
    }))
    setTitle(title.trim() || DEFAULT_PROJECT)
    setOutcome(outcome.trim())
    setBlocks(nextBlocks)
    setHibernate(
      hibernate
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(', '),
    )
    setSaved('Saved. Now shows this in the project window.')
  }

  return (
    <Card
      step={1}
      title="Project day"
      lead={`${windowLabel} on the day(s) you pick. Name it, say what will be true, plan the blocks.`}
    >
      <label className="field" htmlFor="wk-project-title">
        Project title
        <input
          id="wk-project-title"
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. AI SIEM lab…"
        />
      </label>

      <label className="field" htmlFor="wk-project-outcome">
        When the weekend ends, what will be true?
        <textarea
          id="wk-project-outcome"
          rows={2}
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="e.g. Sigma rules fire on the lab VM and the README explains how…"
        />
      </label>

      <div className="field">
        <span className="field-label" id="wk-blocks-label">
          Block plan
        </span>
        <ul className="chip-row" aria-labelledby="wk-blocks-label">
          {blocks.map((b, i) => (
            <li key={i} className="block-chip">
              <span>
                <span className="block-chip-n">{i + 1}</span>
                {b} min
              </span>
              <button
                type="button"
                aria-label={`Remove block ${i + 1} (${b} min)`}
                onClick={() => setBlocks(blocks.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </li>
          ))}
          {[25, 50].map((m) => (
            <li key={`add-${m}`}>
              <button
                type="button"
                className="chip-add"
                disabled={blocks.length >= MAX_PROJECT_BLOCKS}
                onClick={() => setBlocks([...blocks, m])}
              >
                + {m} min
              </button>
            </li>
          ))}
        </ul>
        <p className={`wk-meta${overWindow ? ' warn' : ''}`}>
          {blocks.length === 0
            ? 'No blocks — saving falls back to 2 × 50 min.'
            : `${formatBlockPlan(blocks)} · ${total} of ${windowMinutes} min in the window`}
          {overWindow ? ' — more than the window holds; drop a block.' : ''}
        </p>
      </div>

      <Segmented
        name="wk-project-days"
        legend="Project day"
        value={days}
        options={DAY_OPTIONS}
        onChange={setDays}
      />

      <label className="field" htmlFor="wk-hibernate">
        Parked ideas (optional, comma-separated)
        <input
          id="wk-hibernate"
          autoComplete="off"
          value={hibernate}
          onChange={(e) => setHibernate(e.target.value)}
          placeholder="ideas you will not chase this weekend…"
        />
      </label>

      <SaveRow label="Save project" dirty={dirty} saved={saved} onSave={save} />
    </Card>
  )
}

function ContentSection({ week, commitWeek }: { week: WeekPlan; commitWeek: CommitWeek }) {
  const savedLabel = week.contentBatchLabel ?? DEFAULT_BATCH
  const [label, setLabel] = useState(savedLabel)
  const [posts, setPosts] = useState<ContentPost[]>(week.contentPosts)
  const [newTitle, setNewTitle] = useState('')
  const [saved, setSaved] = useState<string | null>(null)

  const dirty = label.trim() !== savedLabel || !samePosts(posts, week.contentPosts)
  const counts = STATUS_OPTIONS.map((o) => ({
    ...o,
    n: posts.filter((p) => p.status === o.value).length,
  }))
  const publishedCount = counts.find((c) => c.value === 'published')!.n
  const full = posts.length >= MAX_CONTENT_POSTS

  const addPost = () => {
    const t = newTitle.trim()
    if (!t || full) return
    setPosts([...posts, { id: newPostId(), title: t, status: 'draft' }])
    setNewTitle('')
  }

  const update = (id: string, patch: Partial<ContentPost>) =>
    setPosts(
      posts.map((p) => {
        if (p.id !== id) return p
        const next = { ...p, ...patch }
        if (patch.status && patch.status !== p.status) delete next.sharedOn
        return next
      }),
    )

  const save = () => {
    const clean = posts
      .map((p) => ({ ...p, title: p.title.trim() }))
      .filter((p) => p.title !== '')
    commitWeek((w) => ({
      ...w,
      contentBatchLabel: label.trim() || DEFAULT_BATCH,
      contentPosts: clean,
    }))
    setPosts(clean)
    setLabel(label.trim() || DEFAULT_BATCH)
    setSaved('Saved. Weekday Share picks the first Ready post.')
  }

  return (
    <Card
      step={2}
      title="Content factory"
      lead="Next week’s posts. Draft on the weekend, mark Ready when it can ship as-is — weekday Share on Now publishes the first Ready one."
    >
      <label className="field" htmlFor="wk-batch-label">
        Batch focus
        <input
          id="wk-batch-label"
          autoComplete="off"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. 2 LinkedIn posts + 1 Medium article…"
        />
      </label>

      <p className="wk-meta" aria-live="polite">
        {counts.map((c, i) => (
          <span key={c.value} className={`status-count status-${c.value}`}>
            {i > 0 ? ' · ' : ''}
            {c.n} {c.label.toLowerCase()}
          </span>
        ))}
      </p>

      {posts.length === 0 ? (
        <p className="wk-empty">No posts yet. Add the first one below.</p>
      ) : (
        <ul className="post-list">
          {posts.map((p, i) => (
            <li key={p.id} className={`post-row status-${p.status}`}>
              <input
                aria-label={`Post ${i + 1} title`}
                autoComplete="off"
                value={p.title}
                onChange={(e) => update(p.id, { title: e.target.value })}
              />
              <div className="post-row-controls">
                <Segmented
                  compact
                  name={`wk-post-${p.id}`}
                  legend={`Post ${i + 1} status`}
                  value={p.status}
                  options={STATUS_OPTIONS}
                  onChange={(status) => update(p.id, { status })}
                />
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Remove post “${p.title || i + 1}”`}
                  onClick={() => setPosts(posts.filter((x) => x.id !== p.id))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        className="post-add"
        onSubmit={(e) => {
          e.preventDefault()
          addPost()
        }}
      >
        <input
          aria-label="New post title"
          autoComplete="off"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={full ? `Limit of ${MAX_CONTENT_POSTS} posts reached` : 'New post title…'}
          disabled={full}
        />
        <button type="submit" disabled={!newTitle.trim() || full}>
          Add post
        </button>
      </form>

      <SaveRow label="Save posts" dirty={dirty} saved={saved} onSave={save} />
      {publishedCount > 0 ? (
        <button
          type="button"
          className="link-btn"
          onClick={() => setPosts(posts.filter((p) => p.status !== 'published'))}
        >
          Clear {publishedCount} published
        </button>
      ) : null}
    </Card>
  )
}

function LifeTicksSection({
  floor,
  days,
  todayKey,
  onToggle,
}: {
  floor: Record<string, FloorDay>
  days: { key: string; label: string }[]
  todayKey: string
  onToggle: (dateKey: string, tick: WeekendLifeTick, checked: boolean) => void
}) {
  return (
    <Card
      step={3}
      title="Weekend life checklist"
      lead="Same Done marks as Now. Ticking Faith marks Qur’an, Cevşen and Faith+ Done for that day; clearing one on Now unticks it here."
      highlight={days.some((d) => d.key === todayKey)}
    >
      <div className="tick-grid">
        {days.map((d) => {
          const floorDay = floor[d.key]
          const future = d.key > todayKey
          return (
            <fieldset
              key={d.key}
              className={`tick-day${d.key === todayKey ? ' today' : ''}`}
              disabled={future}
            >
              <legend>
                {d.label}
                {d.key === todayKey ? <span className="wk-badge">Today</span> : null}
              </legend>
              {WEEKEND_LIFE_TICKS.map((t) => {
                const done = lifeTickDone(floorDay, t)
                const { done: n, total } = lifeTickProgress(floorDay, t)
                const id = `wk-tick-${d.key}-${t}`
                return (
                  <label key={t} className="tick" htmlFor={id}>
                    <input
                      id={id}
                      type="checkbox"
                      checked={done}
                      onChange={(e) => onToggle(d.key, t, e.target.checked)}
                    />
                    <span>
                      <strong>{TICK_LABELS[t].label}</strong>
                      <small>
                        {future
                          ? 'Opens on the day'
                          : !done && n > 0
                            ? `${n}/${total} done on Now`
                            : TICK_LABELS[t].hint}
                      </small>
                    </span>
                  </label>
                )
              })}
            </fieldset>
          )
        })}
      </div>
    </Card>
  )
}

function SundayCloseSection({
  week,
  todayKey,
  isSunday,
  commitWeek,
  onClosed,
}: {
  week: WeekPlan
  todayKey: string
  isSunday: boolean
  commitWeek: CommitWeek
  onClosed: () => void
}) {
  const todays = week.sundayClose?.dateKey === todayKey ? week.sundayClose : null
  const [wentWell, setWentWell] = useState(todays?.wentWell ?? '')
  const [nextTitle, setNextTitle] = useState(todays?.nextProjectTitle ?? '')
  const [saved, setSaved] = useState<string | null>(null)
  const last = week.sundayClose

  const dirty =
    wentWell.trim() !== (todays?.wentWell ?? '') ||
    nextTitle.trim() !== (todays?.nextProjectTitle ?? '')

  const save = () => {
    const t = nextTitle.trim()
    commitWeek((w) =>
      applySundayClose(w, { wentWell, nextProjectTitle: t }, todayKey, new Date().toISOString()),
    )
    setWentWell(wentWell.trim())
    setNextTitle(t)
    onClosed()
    setSaved(
      t ? `Saved. “${t}” is now the weekend project — add its outcome in step 1.` : 'Saved.',
    )
  }

  return (
    <Card
      step={4}
      title="Sunday close"
      badge={isSunday ? (todays ? 'Done today' : 'Due today') : undefined}
      highlight={isSunday && !todays}
      lead="Five minutes on Sunday evening, after the project window. The next title replaces the project title in step 1."
    >
      <label className="field" htmlFor="wk-went-well">
        What went well?
        <textarea
          id="wk-went-well"
          rows={2}
          value={wentWell}
          onChange={(e) => setWentWell(e.target.value)}
          placeholder="One or two lines are enough…"
        />
      </label>
      <label className="field" htmlFor="wk-next-title">
        Next weekend project title
        <input
          id="wk-next-title"
          autoComplete="off"
          value={nextTitle}
          onChange={(e) => setNextTitle(e.target.value)}
          placeholder="Leave empty to keep the current project"
        />
      </label>
      <SaveRow label="Save Sunday close" dirty={dirty} saved={saved} onSave={save} />
      {last && last.dateKey !== todayKey ? (
        <p className="wk-meta">
          Last close ({formatDateKey(last.dateKey)}): {last.wentWell || '—'}
          {last.nextProjectTitle ? ` · next: “${last.nextProjectTitle}”` : ''}
        </p>
      ) : null}
    </Card>
  )
}

export function WeekPage() {
  const { state, setState } = useUsta()
  const [projectEpoch, setProjectEpoch] = useState(0)
  const { config, week } = state
  const now = new Date()
  const todayKey = calendarDateKey(now, config.timezone)
  const isSunday = zonedParts(now, config.timezone).weekday === 0
  const { sat, sun } = weekendDateKeys(now, config.timezone)
  const windowMinutes =
    hmToMinutes(config.oakEndHour, config.oakEndMinute) -
    hmToMinutes(config.oakStartHour, config.oakStartMinute)
  const pad = (n: number) => String(n).padStart(2, '0')
  const windowLabel = `${pad(config.oakStartHour)}:${pad(config.oakStartMinute)}–${pad(config.oakEndHour)}:${pad(config.oakEndMinute)}`

  const commitWeek: CommitWeek = (update) => {
    setState(bumpRev({ ...state, week: update(state.week) }, getDeviceId()))
  }

  return (
    <section className="wk">
      <div className="page-head">
        <h1>Weekend</h1>
        <p>
          The planning hub for Saturday and Sunday. <Link to="/">Now</Link> still shows one command at
          a time — this page feeds it.
        </p>
      </div>

      <p className="hint">
        <strong>This weekend:</strong> {formatDateKey(sat)} · {formatDateKey(sun)}. Plan on Friday or
        Saturday morning, tick life items as you go, close on Sunday evening.
      </p>

      <ProjectSection
        key={projectEpoch}
        week={week}
        windowMinutes={windowMinutes}
        windowLabel={windowLabel}
        commitWeek={commitWeek}
      />
      <ContentSection week={week} commitWeek={commitWeek} />
      <LifeTicksSection
        floor={state.floor}
        days={[
          { key: sat, label: formatDateKey(sat) },
          { key: sun, label: formatDateKey(sun) },
        ]}
        todayKey={todayKey}
        onToggle={(dateKey, tick, checked) =>
          setState(setLifeDone(state, dateKey, tick, checked, getDeviceId()))
        }
      />
      <SundayCloseSection
        week={week}
        todayKey={todayKey}
        isSunday={isSunday}
        commitWeek={commitWeek}
        onClosed={() => setProjectEpoch((e) => e + 1)}
      />
    </section>
  )
}
