# Usta — NowEngine

**Purpose:** Pure rule engine that answers “what now?” with **one** Next Action.  
**Package:** `usta-core` → `computeNextAction(now, state, config, prayerTimes?)`.  
**Timezone default:** `Europe/Istanbul`.  
**Rule book:** [`Master-Plan.md`](Master-Plan.md).

---

## Priority order (locked)

| Rank | Rule | Action |
|------|------|--------|
| 1 | Oak lock | `oak_presence` — weekdays config Oak window (default 10:00–14:00). |
| 2 | Oak transition | `oak_transition` — Oak end → +`transitionMinutes`. |
| — | Active snooze | `snoozed` — never overrides Oak/transition. |
| 3 | Weekend project window | `project_deep` — Sat/Sun same clock as Oak (10–14). |
| 4 | Daily / weekend queue | First incomplete **due** item in the active queue. |
| 5 | Energy low | Queue shrinks to `ledger_touch` + `german_block` only, then rest. |
| 6 | Else | `rest_or_light`. |

### Weekday queue (`WEEKDAY_QUEUE`)

1. `ledger_touch` — Cyber Ledger / homework (≤ block cap, default 50)
2. `german_block`
3. `faith_quran` — one page + meaning/tafsīr
4. `faith_cevsen` — one bab + meaning
5. `faith_other` — one page other sources
6. `books_pages` — ~10 pages
7. `music_play` — ney or piano piece
8. `content_publish` — share prepared post only (skip/Done if nothing ready)

Ledger + German become **due after Oak transition**. Faith / books / music can be due after day start / Fajr but **not during Oak/transition**.

### Weekend

- **10:00–14:00:** `project_deep` until Done.
- **Outside that window:** `WEEKEND_AFTER_QUEUE` — `content_batch` first, then the five domains.

### Block cap

`config.blockCapMinutes` (default **50**) soft-caps every queue action duration shown in the UI.

### Faith content

User templates only (`faithTemplates.quran` / `cevsen` / `other`). Nothing bundled.

---

## Snooze & energy

| Control | Rule |
|---------|------|
| Snooze | +15 min, max 2/day; refused during Oak/transition. |
| Energy low | Career-only queue for that calendar day. |
| Done | Marks that queue id complete for today. |

---

## Month layer (context only)

`state.months["YYYY-MM"]` holds a theme, up to 3 goals, and up to 5 weekend project ideas (Month page). It **never changes which action is picked**. After the pick, `withMonthContext` appends `Month focus: <theme> (<goals>).` to the `why` of `project_deep` and `content_batch` only. Weekday queue commands are untouched. Weekend ideas feed the Weekend page (“Use as project” copies one into the project title).

---

## What NowEngine does **not** do

- No LLM planning
- No Cyber Ledger FSRS / Map mutation
- No bundled scripture
- No site/app blocking
