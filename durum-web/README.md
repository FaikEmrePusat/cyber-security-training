# Durum — Progress State Web

Model **2.1** progress panel: state, gates, Chancenkarte, FSRS review, log.

Browser version of Canvas (`ilerleme-durum-dashboard.canvas.tsx`) formulas. State is stored under `localStorage` key `durum-v22`.

Technical reference: [TECHNICAL-DOCUMENTATION.md](./TECHNICAL-DOCUMENTATION.md)

## Running

```bash
cd "D:\Projects\Cyber Security Training\durum-web"
npm install
npm run dev
```

Open the address Vite prints in the browser (usually http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

## What's included?

| Page | Content |
|------|---------|
| **Today** | SINGLE TASK + GM / R / TSB |
| **Status** | T/P/L/C, R gauge, evidence gap, radar |
| **Skills** | Editable score + evidence latch, artifacts, language, career |
| **Gates** | Gate 0, A–F · π · bottleneck |
| **Germany** | Chancenkarte points, Anerkennung, Route A/B ETA, runway |
| **Velocity** | CTL/ATL/TSB, v, κ, projection, ROI |
| **Map** | Oak curriculum tree / graph / list · add to FSRS selectively · Upcoming (post-EDR) locked |
| **Review** | FSRS queue + outcome (queue only — full curriculum on Map) |
| **Log** | Session, snapshot, JSONL export/import |
| **Formulas** | Expandable math reference |

## Undo / Redo

**Undo** and **Redo** buttons are in the top menu.

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` (Mac: `Cmd+Z`) | Undo last change |
| `Ctrl+Y` or `Ctrl+Shift+Z` | Redo |

Skills, evidence, log, Germany fields, review, Map→queue add, reset — all undoable. While typing (savings, session notes, etc.) keystrokes within ~0.8 s count as one step; accidentally deleting one character won't lose the whole sentence.

## Curriculum (Map)

Topics extracted from Oak notes (`src/data/tekrar-ekle.txt`, source: `Oak-Study-Notes/TEKRAR-EKLE.txt`) **do not auto-enter the FSRS queue**. Browse via tree, domain map, and list on `/harita`; status is under `localStorage` key `durum-curriculum-v1`. Post-EDR topics from `TEKRAR-SONRA.txt` → Upcoming / Later (locked).

## Seed

Startup: **2026-08-27** diagnostic. Geometric R (ρ=0, portfolio excluded from T) yields R ≈ **23** (older linear seed log had 26.62 — aligned with `Durum-Dashboard.md`).

Markdown documents and canvas were not removed; this app complements them.
