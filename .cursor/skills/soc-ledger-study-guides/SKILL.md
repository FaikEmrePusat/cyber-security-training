---
name: soc-ledger-study-guides
description: >-
  Author and validate Cyber Ledger study plans (TOPIC_GUIDES, ROI_GUIDES, ALAN_GUIDES).
  Use when adding curriculum topic guides, fixing keyword false positives, editing
  studyPlanGuides.ts / studyPlans.ts, or when Today Study plan steps look wrong.
---

# Cyber Ledger — Study guides

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
- `actions` — Goal bullets (what to practice this tour)
- `steps` (≥3) — ordered, with `durationMin` + `logHint` when useful
- `outcomes` (3–5) — **done-when**: “After this tour you should be able to…”
  - Prefer explain-back / do-from-memory wording over term dumps
  - IT Fund + Network spine guides: pass explicit `outcomes` as `mkGuide` 5th arg
  - Others: `mkGuide` derives from `actions` if omitted
- Dual lens for technical topics (technique + detection)

Helpers: `mkGuide`, `thm`, `doc`, `lab`, `tool`, `oakResource`, `oakNotes`, `foundationTourSteps`, `integratedStudySteps`.
UI helper: `primaryOakPdf(guide)` for the PDF-first resource.

## Today Study path (UI)

Goal → Open this PDF → Steps → After this tour you should be able to… → Self-check → Record.

Do not invent a different order. Mentor briefings must mirror the same path.

## Adding a topic rule

1. Put the new `{ test, build }` **above** broader patterns that could steal the match (e.g. `\bnat\b` must not match Antivirus).
2. Prefer word boundaries for short tokens (`/\bnat\b/`).
3. For spine / foundation tours: include explicit `outcomes` (3–5 done-when bullets).
4. Run:

```bash
cd durum-web
npm run test:plans
```

5. Smoke a real title via `buildStudyGuide({ kind, baslik, alan })` if unsure.

## False-positive guards

`validate-study-plans.ts` already guards Antivirus vs NAT. When adding short regexes, add a similar guard if collision risk is high.
Every non-rest guide must have ≥3 outcomes (`test:plans` fails otherwise).

## Weak / detection topics

Detection-heavy weak areas (Windows Event Logs, Sysmon, SIEM triage, AD detection) should get **dedicated** TOPIC_GUIDES with Event IDs / lab rooms — do not rely only on generic `ALAN_GUIDES.win`. Frame them for a **security practitioner / multiple DE cyber roles**, not “only so you can close a SOC ticket.” Dual lens (attack + defense) still applies; SOC triage language is one useful example among admin/risk/ops practice.
