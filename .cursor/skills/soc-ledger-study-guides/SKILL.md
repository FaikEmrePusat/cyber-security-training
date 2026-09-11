---
name: soc-ledger-study-guides
description: >-
  Author and validate SOC Ledger study plans (TOPIC_GUIDES, ROI_GUIDES, ALAN_GUIDES).
  Use when adding curriculum topic guides, fixing keyword false positives, editing
  studyPlanGuides.ts / studyPlans.ts, or when Today Study plan steps look wrong.
---

# SOC Ledger — Study guides

## Resolution order

`buildStudyGuide` in `durum-web/src/data/studyPlans.ts`:

1. `ROI_GUIDES` (portfolio / gate ROI text)
2. `TOPIC_GUIDES` (keyword match on topic title — **most-specific first**)
3. `ALAN_GUIDES[alan]` (domain fallback)
4. `templateByKind` (kind template)

Guides live in `durum-web/src/data/studyPlanGuides.ts` (not `studyPlans.ts`).

## Guide shape

Each guide needs:

- `resources` (≥1 for non-rest kinds) — prefer primary docs / THM / MITRE over random blogs
- `actions` — concrete session actions
- `steps` (≥3) — ordered, with `durationMin` + `logHint` when useful
- Dual lens for technical topics (technique + detection)

Helpers: `mkGuide`, `thm`, `doc`, `lab`, `tool`, `oakResource`, `integratedStudySteps`.

## Adding a topic rule

1. Put the new `{ test, build }` **above** broader patterns that could steal the match (e.g. `\bnat\b` must not match Antivirus).
2. Prefer word boundaries for short tokens (`/\bnat\b/`).
3. Run:

```bash
cd durum-web
npm run test:plans
```

4. Smoke a real title via `buildStudyGuide({ kind, baslik, alan })` if unsure.

## False-positive guards

`validate-study-plans.ts` already guards Antivirus vs NAT. When adding short regexes, add a similar guard if collision risk is high.

## Weak / SIEM topics

Junior SOC weak areas (Windows Event Logs, Sysmon, SIEM triage, AD detection) should get **dedicated** TOPIC_GUIDES with Event IDs / lab rooms — do not rely only on generic `ALAN_GUIDES.win`.
