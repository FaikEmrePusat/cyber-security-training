# Usta

Artificial master: one Next Action, floor + spotlights, optional Supabase sync.  
Cyber Ledger stays the cyber/German spine — this package does not change FSRS/Map.

## Docs

| Doc | What |
|-----|------|
| [Research-Brief-and-Questions.md](./Research-Brief-and-Questions.md) | Locked decisions |
| [NowEngine.md](./NowEngine.md) | Priority rules |
| [Sync.md](./Sync.md) | `usta-v1` + merge + auth model |
| [Supabase-Setup.md](./Supabase-Setup.md) | Create free project (once) |
| [Model-Routing.md](./Model-Routing.md) | Which subagent model for which task |

## Run (web MVP)

```bash
cd usta-web
npm install
npm run dev
```

Open the URL Vite prints (often `http://localhost:5174`). Works **offline-local** without Supabase.

Cloud sync: follow [Supabase-Setup.md](./Supabase-Setup.md), then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `usta-web/.env.local` (template: `usta-web/.env.example`). Restart `npm run dev` after editing env.

Engine tests:

```bash
cd usta-core
npm install
npm test
```

## Packages

| Path | Role |
|------|------|
| `usta-core/` | Types, `computeNextAction`, merge, Istanbul helpers, prayer times |
| `usta-web/` | Vite + React UI (Now / Week / Review / Settings / Login) |

## Not in this phase

Capacitor Android, Tauri Windows — later, same `usta-web` UI.
