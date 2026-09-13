# SOC Ledger — app (`durum-web`)

Browser app for **SOC Ledger** (Model 2.1): daily plan, competency state, gates, Germany path fields, FSRS review, and session log.

Product overview and live link: [repository README](../README.md)  
Technical reference: [TECHNICAL-DOCUMENTATION.md](./TECHNICAL-DOCUMENTATION.md)

Internal package and `localStorage` keys still use the legacy `durum-*` names for compatibility.

## Running

```bash
cd durum-web
npm install
npm run dev
```

Open the address Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
npm run test:all
```

## Pages

| Page | Content |
|------|---------|
| **Today** | Primary task + GM / R / TSB, study plan, mentor briefing |
| **Status** | T / P / L / C, R gauge, evidence gap, radar |
| **Skills** | Editable score + evidence latch, artifacts, language, career |
| **Gates** | Gate 0, A–F · π · bottleneck |
| **Germany** | Chancenkarte points, Anerkennung, route ETA, runway |
| **Velocity** | CTL / ATL / TSB, projection, ROI |
| **Map** | Oak curriculum tree / graph / list · selective FSRS add |
| **Review** | FSRS due queue + outcomes |
| **Log** | Session, snapshot, JSONL export / import |
| **Record** | Public competency snapshot |
| **Formulas** | Expandable math reference |

## Undo / Redo

Available from the top menu.

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` (Mac: `Cmd+Z`) | Undo |
| `Ctrl+Y` or `Ctrl+Shift+Z` | Redo |

Skills, evidence, log, Germany fields, review, Map → queue add, and reset are undoable. Rapid typing (~0.8 s) collapses into one undo step.

## Study plans (Today)

Each scheduled task can expand a **Study plan**: resources, actions, and step-by-step prompts. Keyword rules live in `src/data/studyPlanGuides.ts` (`TOPIC_GUIDES`). Fallbacks exist per task kind (`tekrar`, `konu`, `temel`, `lab`, `dil`).

## Curriculum (Map)

Oak topics from `src/data/tekrar-ekle.txt` do **not** auto-enter the FSRS queue. Browse on Map; curriculum status uses `localStorage` key `durum-curriculum-v1`. Post-EDR topics from `TEKRAR-SONRA.txt` stay in Upcoming / Later (locked) until unlocked by the model.

## Further reading

For formulas, seed profile, storage migration, and architecture diagrams, see [TECHNICAL-DOCUMENTATION.md](./TECHNICAL-DOCUMENTATION.md).
