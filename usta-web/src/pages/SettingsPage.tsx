import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bumpRev, DEFAULT_CONFIG, calendarDateKey } from 'usta-core'
import { getDeviceId } from '../lib/deviceId'
import { canEmbedLedger } from '../lib/ledgerBridge'
import type { SyncStatus } from '../lib/storage'
import { useUsta } from '../state/UstaProvider'

const PAGES_DEFAULT = 'https://faikemrepusat.github.io/cyber-security-training/'

const SYNC_LABELS: Record<SyncStatus, string> = {
  'local-only': 'Local only — cloud env not set',
  'signed-out': 'Signed out — changes stay on this device',
  synced: 'Synced with cloud',
  pending: 'Pending — will push when online',
  error: 'Sync error — local copy kept; try Sync now',
}

/** Accepts "41.0082" or "41,0082"; empty or invalid → undefined (default coords are used). */
function parseCoord(raw: string, min: number, max: number): number | undefined {
  const t = raw.trim().replace(',', '.')
  if (!t) return undefined
  const n = Number(t)
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined
}

export function SettingsPage() {
  const { state, setState, cloudReady, refreshCloud, syncStatus, refreshLedgerBridge } = useUsta()
  const [cfg, setCfg] = useState(state.config)
  const [saved, setSaved] = useState(false)
  const [latText, setLatText] = useState(state.config.latitude?.toString() ?? '')
  const [lonText, setLonText] = useState(state.config.longitude?.toString() ?? '')
  const [bridgeMsg, setBridgeMsg] = useState<{ ok: boolean; message: string } | null>(null)
  const [bridgeBusy, setBridgeBusy] = useState(false)

  const latInvalid = latText.trim() !== '' && parseCoord(latText, -90, 90) === undefined
  const lonInvalid = lonText.trim() !== '' && parseCoord(lonText, -180, 180) === undefined

  const save = () => {
    setState(bumpRev({ ...state, config: cfg }, getDeviceId()))
    setSaved(true)
  }

  const setMode = (mode: 'local' | 'pages') => {
    setCfg({
      ...cfg,
      ledgerUrlMode: mode,
      ledgerBaseUrl:
        mode === 'local' ? 'http://localhost:5173/' : cfg.ledgerBaseUrl || PAGES_DEFAULT,
    })
  }

  const onRefreshLedger = async () => {
    setBridgeBusy(true)
    setBridgeMsg(null)
    setState(bumpRev({ ...state, config: cfg }, getDeviceId()))
    const r = await refreshLedgerBridge(cfg.ledgerBaseUrl)
    setBridgeBusy(false)
    setBridgeMsg(r)
  }

  const bridge = state.ledgerBridge
  const today = calendarDateKey(new Date(), cfg.timezone)

  return (
    <section>
      <div className="page-head">
        <h1>Settings</h1>
        <p>
          Set clocks, Ledger link, and your faith reminders once. Daily work stays on{' '}
          <Link to="/">Now</Link>.
        </p>
      </div>

      <p className="hint">
        <strong>Day start / day end:</strong> Outside this window Usta will not push the queue (night =
        rest). Oak 10:00–14:00 still wins on weekdays inside the day.
      </p>

      <label className="field" htmlFor="timezone">
        Timezone
        <input
          id="timezone"
          name="timezone"
          autoComplete="off"
          spellCheck={false}
          value={cfg.timezone}
          onChange={(e) => setCfg({ ...cfg, timezone: e.target.value })}
        />
      </label>

      <label className="field" htmlFor="day-start">
        Day start (when the daily queue may begin; also fallback if prayer calc is off)
        <input
          id="day-start"
          name="dayStart"
          type="time"
          value={`${String(cfg.dayStartHour).padStart(2, '0')}:${String(cfg.dayStartMinute).padStart(2, '0')}`}
          onChange={(e) => {
            const [h, m] = e.target.value.split(':').map(Number)
            if (Number.isFinite(h) && Number.isFinite(m)) {
              setCfg({ ...cfg, dayStartHour: h, dayStartMinute: m })
            }
          }}
        />
      </label>

      <label className="field" htmlFor="day-end">
        Day end (after this, Usta stops the queue — go rest)
        <input
          id="day-end"
          name="dayEnd"
          type="time"
          value={`${String(cfg.dayEndHour ?? 23).padStart(2, '0')}:${String(cfg.dayEndMinute ?? 0).padStart(2, '0')}`}
          onChange={(e) => {
            const [h, m] = e.target.value.split(':').map(Number)
            if (Number.isFinite(h) && Number.isFinite(m)) {
              setCfg({ ...cfg, dayEndHour: h, dayEndMinute: m })
            }
          }}
        />
      </label>

      <label className="field" htmlFor="block-cap">
        Max minutes per block
        <input
          id="block-cap"
          name="blockCap"
          type="number"
          min={20}
          max={90}
          inputMode="numeric"
          value={cfg.blockCapMinutes}
          onChange={(e) =>
            setCfg({ ...cfg, blockCapMinutes: Math.max(20, Number(e.target.value) || 50) })
          }
        />
      </label>

      <h2 className="done-panel-title">Cyber Ledger link</h2>
      <p className="done-panel-lead">
        Stay in Usta for the daily list. Usta pulls Today’s titles from Ledger; open Ledger only when you
        need deep study / Record. When Usta and Ledger share a host (both on localhost, or both on
        GitHub Pages) the pull is silent and automatic. Otherwise press Refresh (opens a popup).
      </p>

      <label className="field" htmlFor="ledger-mode">
        Where “Open Ledger” goes
        <select
          id="ledger-mode"
          name="ledgerMode"
          value={cfg.ledgerUrlMode}
          onChange={(e) => setMode(e.target.value as 'local' | 'pages')}
        >
          <option value="local">Local Vite (localhost)</option>
          <option value="pages">GitHub Pages (online CV)</option>
        </select>
      </label>

      <label className="field" htmlFor="ledger-url">
        Ledger base URL
        <input
          id="ledger-url"
          name="ledgerUrl"
          type="url"
          autoComplete="off"
          spellCheck={false}
          value={cfg.ledgerBaseUrl}
          onChange={(e) => setCfg({ ...cfg, ledgerBaseUrl: e.target.value })}
        />
      </label>

      <label className="field" htmlFor="ledger-auto">
        <span>
          <input
            id="ledger-auto"
            name="ledgerAutoPull"
            type="checkbox"
            checked={cfg.ledgerAutoPull}
            onChange={(e) => setCfg({ ...cfg, ledgerAutoPull: e.target.checked })}
          />{' '}
          Auto-refresh from Ledger (on open, on focus, every 20 min)
        </span>
      </label>
      <p className="meta">
        {canEmbedLedger(cfg.ledgerBaseUrl)
          ? cfg.ledgerAutoPull
            ? 'Auto-refresh: active for this URL (silent, no popup).'
            : 'Auto-refresh: off.'
          : `Auto-refresh: not possible here — Ledger is on a different host than this Usta (${window.location.host}). Use Refresh from Ledger.`}
      </p>

      <div className="actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className="primary" disabled={bridgeBusy} onClick={() => void onRefreshLedger()}>
          {bridgeBusy ? 'Pulling…' : 'Refresh from Ledger'}
        </button>
      </div>
      {bridge ? (
        <p className="meta">
          Bridge: {bridge.tasks.length} task(s) for {bridge.dateKey}
          {bridge.dateKey !== today ? ' (not today — refresh again)' : ''} ·{' '}
          {new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(new Date(bridge.updatedAt))}
        </p>
      ) : (
        <p className="meta">Bridge: empty — press Refresh from Ledger while Ledger runs on that URL.</p>
      )}
      {bridgeMsg ? (
        <p className={`msg ${bridgeMsg.ok ? 'ok' : 'err'}`} role="status">
          {bridgeMsg.message}
        </p>
      ) : null}

      <h2 className="done-panel-title">Prayer location</h2>
      <p className="done-panel-lead">
        <strong>Latitude / longitude</strong> are your position on the map. Usta uses them only to
        calculate prayer times offline (Fajr decides when the morning queue may start). Latitude is
        north–south, longitude is east–west. Istanbul is about <strong>41.0082</strong> /{' '}
        <strong>28.9784</strong> — the defaults. Decimals are normal (comma or dot both work). Change
        them only if you live in another city; leave a box empty to use the Istanbul default.
      </p>

      <label className="field" htmlFor="lat">
        Latitude (north–south, −90 to 90)
        <input
          id="lat"
          name="latitude"
          inputMode="decimal"
          autoComplete="off"
          value={latText}
          aria-invalid={latInvalid}
          onChange={(e) => {
            setLatText(e.target.value)
            setCfg({ ...cfg, latitude: parseCoord(e.target.value, -90, 90) ?? DEFAULT_CONFIG.latitude })
          }}
          placeholder={String(DEFAULT_CONFIG.latitude)}
        />
      </label>
      {latInvalid ? <p className="msg err">Latitude must be a number between −90 and 90 (e.g. 41.0082).</p> : null}
      <label className="field" htmlFor="lon">
        Longitude (east–west, −180 to 180)
        <input
          id="lon"
          name="longitude"
          inputMode="decimal"
          autoComplete="off"
          value={lonText}
          aria-invalid={lonInvalid}
          onChange={(e) => {
            setLonText(e.target.value)
            setCfg({ ...cfg, longitude: parseCoord(e.target.value, -180, 180) ?? DEFAULT_CONFIG.longitude })
          }}
          placeholder={String(DEFAULT_CONFIG.longitude)}
        />
      </label>
      {lonInvalid ? <p className="msg err">Longitude must be a number between −180 and 180 (e.g. 28.9784).</p> : null}

      <h2 className="done-panel-title">Faith cues (your words only)</h2>
      <p className="done-panel-lead">
        These three boxes are <strong>short reminders to yourself</strong> — not the text itself. Usta
        never ships scripture. When Now shows a faith command, the matching box appears underneath as
        your “why / where”. Write where you left off and how you read, for example:
      </p>
      <ul className="done-panel-lead">
        <li>Qur’an: “Mushaf on desk — next page after bookmark, then read the meal on the facing page.”</li>
        <li>Cevşen: “Next bab from the red ribbon; read the Turkish meaning after each bab.”</li>
        <li>Other: “Risale-i Nur, Sözler — one page from where the pencil mark is.”</li>
      </ul>
      <p className="hint">Leave a box empty and Usta shows a neutral hint instead.</p>

      <label className="field" htmlFor="faith-quran">
        Faith cue — Qur’an page
        <textarea
          id="faith-quran"
          name="faithQuran"
          rows={2}
          value={cfg.faithTemplates.quran ?? ''}
          onChange={(e) =>
            setCfg({
              ...cfg,
              faithTemplates: { ...cfg.faithTemplates, quran: e.target.value },
            })
          }
          placeholder="e.g. Mushaf X — next unread page + meal…"
        />
      </label>
      <label className="field" htmlFor="faith-cevsen">
        Faith cue — Cevşen bab
        <textarea
          id="faith-cevsen"
          name="faithCevsen"
          rows={2}
          value={cfg.faithTemplates.cevsen ?? ''}
          onChange={(e) =>
            setCfg({
              ...cfg,
              faithTemplates: { ...cfg.faithTemplates, cevsen: e.target.value },
            })
          }
          placeholder="e.g. Next bab + meaning from my usual book…"
        />
      </label>
      <label className="field" htmlFor="faith-other">
        Faith cue — other source
        <textarea
          id="faith-other"
          name="faithOther"
          rows={2}
          value={cfg.faithTemplates.other ?? ''}
          onChange={(e) =>
            setCfg({
              ...cfg,
              faithTemplates: { ...cfg.faithTemplates, other: e.target.value },
            })
          }
          placeholder="e.g. Risale-i Nur — one page…"
        />
      </label>

      <div className="actions">
        <button type="button" className="primary" onClick={save}>
          Save settings
        </button>
        {cloudReady ? (
          <button type="button" onClick={() => void refreshCloud()}>
            Sync now
          </button>
        ) : null}
      </div>
      <p className="meta">Sync: {SYNC_LABELS[syncStatus]}</p>
      {saved ? (
        <p className="msg ok" role="status">
          Saved{cloudReady ? ' (queued for cloud)' : ' on this device'}.
        </p>
      ) : null}
    </section>
  )
}
