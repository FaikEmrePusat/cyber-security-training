# Usta — Sync

**Goal:** Phone, PC, and browser show the **same** Next Action when online. Offline Done still works; merge on reconnect.

---

## Source of truth

| Layer | Role |
|-------|------|
| Local cache | `localStorage` key **`usta-v1`** on each client |
| Cloud | Supabase table `usta_state` — one JSON document per authenticated user |
| Engine | Pure `usta-core`; never reads Ledger `durum-v22` |

**Security model (MVP):** Not world-public. Require Supabase Auth. Row Level Security so each user only reads/writes their own row. Data is TLS-protected in transit. **Not** end-to-end encrypted. Free tier is fine for solo use. Security = **auth + RLS**, not “hide the anon key” (the anon key is a public client credential by design).

---

## Document shape (`UstaState`)

Synced fields (high level):

- `rev` — monotonic revision (increment on every successful write)
- `updatedAt` — ISO timestamp
- `deviceId` — last writer device id
- `config` — Oak clocks, timezone, ledger base URL preference, coords for prayer calc, faith templates (user text)
- `week` — 2 primary + 1 optional spotlights, hibernate list, spotlight time windows
- `floor` — map of `YYYY-MM-DD` → per-item done flags
- `energyLow` / `snoozesToday` / `snoozeUntil` — day-scoped controls
- `onRampDay` — optional 1–14
- `actionHistory` — last N Done events (cap early, e.g. 50)

**Not synced into Ledger storage.** Public CV / progress.json remains Cyber Ledger’s job on GitHub Pages.

---

## Conflict rule

**Last-write-wins** with:

1. Higher `rev` wins
2. If `rev` equal, later `updatedAt` wins
3. If still tied, lexicographic `deviceId`

**Floor checklist:** per-item **last-write-wins** using the higher-`rev` document. If you Undo / clear a Done, the newer rev keeps it cleared — sync must not resurrect Done via OR-merge. (Older docs said OR-merge; that broke Undo.)

**Snooze count:** day-scoped. Same `snoozesDate` → max of both counts; different dates → the newer date's count (yesterday's 2/2 never blocks today).

**Action history:** union of both sides, de-duplicated by `at + actionId`, newest first, capped at 50.

**Shape migration:** every load (local `usta-v1` and cloud `doc`) passes through `migrateState` in `usta-core`. It fills missing config fields from defaults, drops malformed floor/slot/history entries, and clamps counters. Old scaffold data needs no manual reset.

---

## Sync loop (implemented in `usta-web/src/lib/storage.ts`)

1. **Local write** → save `usta-v1` → set `usta-v1-pending` → run sync.
2. **Sync** = pull the row → `mergeStates(local, remote)` → save locally → push **only if** pending or the merged doc differs from the cloud doc (key-order-insensitive compare, since jsonb reorders keys). If the push is needed and the merged `rev` is not above the remote `rev`, bump `rev` first so other devices accept it.
3. **Offline queue:** the whole document is the payload, so the queue is a single pending flag. A failed or offline push leaves the flag set. Sync reruns on `online`, on tab focus (`visibilitychange`), after sign-in, and on the next write.
4. **Realtime:** subscribed to `postgres_changes` on `usta_state` filtered to the user's row. An incoming doc is merged into local state. If local still has something the cloud lacks, a sync push follows. Echoes of your own push merge to an identical doc, so they cause no push and no loop.

Status is shown in Settings: `local only`, `signed out`, `synced`, `pending`, or `error`.

### Known limits (MVP, honest)

- The upsert is not compare-and-swap. If two devices push within the same instant, one write may briefly win. The next sync or Realtime event re-merges with LWW by `rev`.
- Realtime requires the table to be in the `supabase_realtime` publication (see Supabase-Setup §4). Without it, sync still happens on write, focus, reconnect, and **Sync now**.
- No background sync while the tab is closed.

---

## Auth

- Provider: **Email magic link**
- Account email: `faikemrep@gmail.com` (login via that Gmail inbox — not a separate product account)
- Browser / future Capacitor / Tauri: same user
- Without env configured: **local-only mode** (full Now UI, no cloud)

---

## Realtime

Wired in the web client (see Sync loop above). Active only when env vars are set **and** the user is signed in. Later: native push notifications (Capacitor), not part of this phase.

---

## Ledger bridge (URL only)

Usta Settings stores preferred Ledger **base URL**:

- Local Vite (e.g. `http://localhost:5173/`)
- GitHub Pages path for the existing Ledger deploy

Usta does **not** publish progress.json. “Open Ledger” navigates to `{baseUrl}` (Today is Ledger’s routing).
