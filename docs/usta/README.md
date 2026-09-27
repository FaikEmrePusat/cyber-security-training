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
| [How-to-Use.md](./How-to-Use.md) | Plain-language daily use |
| [Native-Apps.md](./Native-Apps.md) | Android (Capacitor) + Windows tray (Tauri): build and run |

## Live

**Usta:** [https://faikemrepusat.github.io/cyber-security-training/usta/](https://faikemrepusat.github.io/cyber-security-training/usta/)  
**Cyber Ledger:** [https://faikemrepusat.github.io/cyber-security-training/](https://faikemrepusat.github.io/cyber-security-training/)

Both deploy from `.github/workflows/deploy.yml` on every push to `main`. Usta is built with `USTA_BASE=/cyber-security-training/usta/` and copied into the Ledger artifact under `usta/`; a site-wide `404.html` (`usta-web/pages-404.html`) sends Usta deep links back to the SPA. Supabase URL + publishable key come from the repo secrets `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (client-side keys by design; RLS protects the data). Add the Pages URL to Supabase redirect URLs (see Supabase-Setup §3).

## Status (2026-09-27)

| Item | State |
|------|-------|
| Weekday five-domain queue, weekend package (project / content / life / Sunday close), day-end | Done |
| Supabase sync (LWW by rev, floor per-item LWW) | Done |
| Undo of weekday Share restores the post to Ready | Done |
| GitHub Pages deploy | Done (live) |
| Ledger bridge: silent auto-pull when same-host, popup otherwise, origin checks | Done |
| Month layer (theme / goals / weekend ideas; context only) | Done |
| Android app (Capacitor) | Scaffolded; APK not built yet (needs Android Studio on the PC) |
| Windows tray app (Tauri) | Scaffolded; not built yet (needs Rust + VS Build Tools) |

Remaining / TODO:

- Build and install the debug APK on the Redmi Note 10 Pro; confirm the Oak-end reminder fires.
- Build the Tauri app; confirm tray, close-to-tray, and toast at Oak end.
- Supabase dashboard (manual, by you): add the Pages redirect URL; put `{{ .Token }}` in the Magic Link email template for code sign-in in the apps.
- Optional: Windows auto-start, Android deep links for magic links, background push.

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
| `usta-web/` | Vite + React UI (Now / Weekend / Month / Review / Guide / Settings / Login) |
| `usta-web/android/` | Capacitor Android project |
| `usta-web/src-tauri/` | Tauri 2 Windows tray shell |
