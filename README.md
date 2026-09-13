# SOC Ledger

[![Live demo](https://img.shields.io/badge/live-GitHub%20Pages-1a6b5c?style=flat-square)](https://faikemrepusat.github.io/cyber-security-training/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**SOC Ledger** is a client-side competency tracker for a Junior SOC / Blue Team path — especially toward work in Germany. It tracks skills with evidence caps, career gates, FSRS spaced repetition, and a rolling “Today” study plan. Progress lives in the browser (`localStorage`); there is no account server.

Built and maintained by **[Faik Emre Pusat](https://github.com/FaikEmrePusat)** as a personal training ledger (not a multi-tenant SaaS product).

**Live app:** [https://faikemrepusat.github.io/cyber-security-training/](https://faikemrepusat.github.io/cyber-security-training/)

---

## Who it is for

- Learners building a **Junior SOC Analyst / Blue Team** profile
- Anyone who wants **evidence-backed** skill scores instead of calendar checklists
- Readers of the public **Record** / published progress snapshot (view-only)

## What you get

| Area | What it does |
|------|----------------|
| **Today** | One primary task, study-plan steps, mentor briefing hooks |
| **Status & Skills** | Technical / production / language / career dimensions with evidence latch |
| **Gates** | Condition-based readiness stages (Gate 0, A–F) and bottleneck |
| **Review** | FSRS retrieval queue (due items only — full curriculum on Map) |
| **Map** | Oak curriculum browse; selective add to the review queue |
| **Germany** | Chancenkarte-oriented career runway fields |
| **Record / Publish** | Shareable competency snapshot; optional publish of static progress JSON |
| **Data** | JSON export / import and undo / redo from the app |

Study both sides of each topic: how a technique works, and how you detect, contain, or prevent it.

## Quick start

Requirements: **Node.js 20+** and npm.

```bash
cd durum-web
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # local preview of the build
npm run test:all # lint, seed/plan/system checks, then build
```

App source lives under [`durum-web/`](./durum-web/) (legacy package name; display name is **SOC Ledger**).

## Documentation

| Doc | Role |
|-----|------|
| This README | Orientation and quick start |
| [`durum-web/README.md`](./durum-web/README.md) | Local pages, shortcuts, study-plan / curriculum notes |
| [`durum-web/TECHNICAL-DOCUMENTATION.md`](./durum-web/TECHNICAL-DOCUMENTATION.md) | Model, formulas, storage, and architecture reference |

## Privacy and data

- Training state is stored **only in your browser** (`localStorage` keys such as `durum-v22`).
- Clearing site data resets local progress unless you exported a backup (**More → Data**).
- Publishing progress uses a token kept in the browser; visitors can read published JSON but cannot edit your ledger.

## Deploy

Pushes to `main` build and deploy the Vite SPA via [GitHub Pages](.github/workflows/deploy.yml) (`durum-web` → `npm run test:all` → Pages artifact).

## Repository note

Root-level personal planning notes and private strategy files are gitignored. The public face of this repo is **SOC Ledger** (`durum-web`) plus this README.

## Contributing

This is a personal training project. Bug reports and thoughtful issues are welcome; there is no formal contribution guide or CLA. Please keep discussion and PRs in English.
