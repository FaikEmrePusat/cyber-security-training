# Life Usta — Research Brief & Questions

**Audience:** Faik  
**Scope:** Research + locked decisions for Phase 0/1. Cyber Ledger stays in `durum-web/`.  
**Sources:** [plan](file:///c:/Users/User/.cursor/plans/life_usta_coach_8d84d617.plan.md), [`docs/Personal-Time-Architecture.md`](../Personal-Time-Architecture.md).  
**Research limit:** Few web/GitHub searches (2026-09-27). Steal **patterns**, not product identity.

---

## Already decided (pre-answers)

- External executive-function coach: **one Next Action**, Done / Snooze / Energy — not a life dashboard.
- Daily **floor** + **2–3 weekly spotlights**; Oak hard lock → transition → floor → spotlights.
- Cyber Ledger = cyber + German spine only; Usta **bridges** (open/mark), never dumps life domains into FSRS/Map/`durum-v22`.
- Stack defaults: shared `usta-core` + Vite/React `usta-web`; **Android Capacitor** later; **Windows Tauri** later; **Supabase** auth + one JSON state doc + Realtime; offline-first LWW/`rev`.
- Out of MVP: LLM planner, iOS store ship, app/site blocking, clinical ADHD claims.
- Faith content: **user-supplied templates only** (no baked religious corpus in product).

---

## Answers from Faik (locked)

| # | Question | Answer |
|---|----------|--------|
| 1 | Daily phone | **Android** — Redmi Note 10 Pro. Capacitor later (not this Phase 0/1 run). |
| 2 | Sync backend | **Supabase free tier** OK. He has **no account yet** — scaffold + setup doc only; **do not invent secrets**. |
| 3 | Auth email | **faikemrep@gmail.com**. Magic link = sign-in via that Gmail. He does **not** need a separate “magic link account.” |
| 4 | Oak lock | **Weekdays 10:00–14:00**, timezone **Europe/Istanbul**. No fixed exceptions named yet. |
| 5 | Faith floor anchors | **Prayer anchors** (not plain clocks) for faith tiny / journal stacks where relevant. Oak stays **clock-based**. |
| 6 | Faith content | **User-supplied templates only**; no bundled Islamic scripture. |
| 7 | Ledger URL | **Settings toggle**: local Vite vs GitHub Pages. Progress must persist. Public CV via existing Ledger GitHub Pages path remains Ledger’s job — Usta only stores preferred Ledger **base URL**. |
| 8 | Privacy | TLS to Supabase OK; **not world-public** — require auth. No E2E required for MVP. |
| 9 | App name | **Usta** (renamable later). |
| 10 | Browser client | **Yes** as third client, but **auth-gated** (not public anonymous). Local-only mode OK until Supabase is configured. |

---

## Useful prior art (architecture / UX patterns)

| Project | URL | 1-line takeaway |
|---------|-----|-----------------|
| **niyet** | https://github.com/burakgizlice/niyet | Closest UX: one physical action fills the screen + reusable ritual **chains** (hide the queue). |
| **Nudge** | https://github.com/thatsjet/nudge-app | ADHD-first: concrete next steps, no streak/guilt UI — but chat/LLM-heavy (out of our MVP). |
| **Taskwarrior** | https://github.com/GothenburgBitFactory/taskwarrior | Classic GTD: urgency/`next` filter by context + energy; prove “what now?” is a **rule**, not a list. |
| **CES** | https://github.com/Arush-235/Cognitive-Execution-System | External EF framing: pick next from energy/momentum/time — same idea as NowEngine, different stack. |
| **Loop Habit Tracker** | https://github.com/iSoron/uhabits | Mature local Android habits: fidelity/stats without forcing cloud or gamification. |
| **Habitica** | https://github.com/HabitRPG/habitica | Multi-client sync at scale — **anti-pattern** for us: RPG/dashboard cognitive load. |
| **Perfice** | https://github.com/p0lloc/perfice | Web app + **Capacitor Android**; local-first IndexedDB with **optional** sync backend. |
| **Glow / Loop Capacitor** | https://github.com/pi0trdotsys/glow-habit-widget | Capacitor shell: Preferences bridge, local notifications, idempotent offline queue reconcile. |

Honest gap: few mature open-source apps combine **strict one-next-action** + **phone↔desktop Realtime** without becoming a full Life OS. Our shape is closer to niyet UX + Taskwarrior rules + Perfice/Glow shell patterns.

---

## Stack risks (≤5)

1. **Capacitor notifications** — local schedules drift across reboot/Doze; Oak-end nudges need real-device QA, not emulator-only.
2. **Tauri + WebView** — tray/notifications are fine; deep-linking to local Ledger (`localhost` vs Pages) is the brittle desktop bridge.
3. **Supabase Realtime + LWW** — simultaneous Done on phone and PC same minute can flip; need `rev`/`deviceId` tests and floor merge-by-item-id (as planned).
4. **Magic-link auth on sideloaded APK** — email deep-link return paths are fiddly; confirm return URLs for that Gmail + Capacitor later.
5. **One JSON document** — simple until history grows; cap action history early or sync will get chatty.

---

## Status

All **MUST** items answered. Phase 0 docs + `usta-core` + `usta-web` MVP are in progress. Capacitor / Tauri deferred.
