import type { LedgerBridge, LedgerBridgeTask } from 'usta-core'

const BRIDGE_TYPE = 'usta-ledger-bridge-v1'
const TIMEOUT_MS = 12_000

export type BridgePull =
  | { ok: true; bridge: LedgerBridge; hasData: boolean }
  | { ok: false; message: string }

function ledgerUrl(baseUrl: string): URL | null {
  try {
    return new URL(baseUrl.trim() || 'about:blank')
  } catch {
    return null
  }
}

/**
 * A hidden iframe only sees Ledger's real localStorage when both apps are same-site
 * (same scheme + host; ports ignored). Otherwise browsers partition storage and the
 * frame would report an empty Ledger, so we fall back to a popup.
 */
export function canEmbedLedger(baseUrl: string): boolean {
  const u = ledgerUrl(baseUrl)
  if (!u || !/^https?:$/.test(u.protocol)) return false
  return u.protocol === window.location.protocol && u.hostname === window.location.hostname
}

function bridgeHref(baseUrl: string): string {
  const base = baseUrl.trim().replace(/\/$/, '')
  return `${base}/#/usta-bridge?origin=${encodeURIComponent(window.location.origin)}`
}

function parsePayload(data: unknown): { bridge: LedgerBridge; hasData: boolean } | null {
  const d = data as {
    type?: unknown
    dateKey?: unknown
    updatedAt?: unknown
    hasData?: unknown
    tasks?: unknown
  } | null
  if (!d || d.type !== BRIDGE_TYPE) return null
  if (typeof d.dateKey !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(d.dateKey)) return null
  if (!Array.isArray(d.tasks)) return null
  const tasks: LedgerBridgeTask[] = d.tasks
    .filter((t): t is Record<string, unknown> => typeof t === 'object' && t !== null)
    .filter((t) => typeof t.id === 'string' && typeof t.title === 'string' && t.title !== '')
    .slice(0, 30)
    .map((t) => ({
      id: t.id as string,
      title: (t.title as string).slice(0, 200),
      kind: typeof t.kind === 'string' ? t.kind : 'konu',
      minutes: typeof t.minutes === 'number' && t.minutes > 0 ? Math.floor(t.minutes) : 25,
    }))
  return {
    bridge: {
      dateKey: d.dateKey,
      updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : new Date().toISOString(),
      tasks,
    },
    // Older Ledger builds did not send the flag; treat them as real data.
    hasData: d.hasData !== false,
  }
}

function waitForBridge(
  source: () => Window | null,
  origin: string,
  cleanup: () => void,
  timeoutMessage: string,
): Promise<BridgePull> {
  return new Promise((resolve) => {
    const finish = (result: BridgePull) => {
      window.clearTimeout(timer)
      window.removeEventListener('message', onMessage)
      cleanup()
      resolve(result)
    }
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== source()) return
      const parsed = parsePayload(event.data)
      if (!parsed) return
      finish({ ok: true, ...parsed })
    }
    window.addEventListener('message', onMessage)
    const timer = window.setTimeout(() => finish({ ok: false, message: timeoutMessage }), TIMEOUT_MS)
  })
}

/** Silent pull through a hidden iframe (no popup, no user gesture needed). */
export function pullViaIframe(baseUrl: string): Promise<BridgePull> {
  const u = ledgerUrl(baseUrl)
  if (!u || !canEmbedLedger(baseUrl)) {
    return Promise.resolve({ ok: false, message: 'Ledger is on another site; use the popup refresh.' })
  }
  const frame = document.createElement('iframe')
  frame.title = 'Cyber Ledger bridge'
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  frame.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden'
  const pending = waitForBridge(
    () => frame.contentWindow,
    u.origin,
    () => frame.remove(),
    'Timed out waiting for Ledger. Is Cyber Ledger running at the URL in Settings?',
  )
  frame.src = bridgeHref(baseUrl)
  document.body.appendChild(frame)
  return pending
}

/** Popup pull; needs a click. Works across sites because the popup is a top-level window. */
export function pullViaPopup(baseUrl: string): Promise<BridgePull> {
  const u = ledgerUrl(baseUrl)
  if (!u || !/^https?:$/.test(u.protocol)) {
    return Promise.resolve({ ok: false, message: 'Ledger base URL is not a valid http(s) address.' })
  }
  const popup = window.open(bridgeHref(baseUrl), 'usta-ledger-bridge', 'width=480,height=640')
  if (!popup) {
    return Promise.resolve({
      ok: false,
      message:
        'Popup blocked. Allow popups for this site, then try again. Ledger must be running (e.g. localhost:5173).',
    })
  }
  return waitForBridge(
    () => popup,
    u.origin,
    () => {
      try {
        popup.close()
      } catch {
        /* ignore */
      }
    },
    'Timed out waiting for Ledger. Is Cyber Ledger running at the URL in Settings?',
  )
}

/** Same day and same tasks → no write (avoids rev churn and sync ping-pong). */
export function sameBridge(a: LedgerBridge | null, b: LedgerBridge): boolean {
  if (!a || a.dateKey !== b.dateKey || a.tasks.length !== b.tasks.length) return false
  return a.tasks.every((t, i) => {
    const o = b.tasks[i]!
    return t.id === o.id && t.title === o.title && t.kind === o.kind && t.minutes === o.minutes
  })
}
