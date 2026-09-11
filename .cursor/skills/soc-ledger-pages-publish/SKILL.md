---
name: soc-ledger-pages-publish
description: >-
  Ship SOC Ledger as a static Vite SPA on GitHub Pages and publish public progress.
  Use when changing vite base, deploy.yml, public/progress.json, PublishPanel,
  or GitHub Pages / static hosting setup.
---

# SOC Ledger — GitHub Pages & publish

## Static app

| Item | Value |
|------|--------|
| App root | `durum-web/` |
| Vite base | `./` in `vite.config.ts` (relative assets for Pages) |
| Build output | `durum-web/dist` |
| Workflow | `.github/workflows/deploy.yml` (push to `main`) |

SPA is client-only: no server secrets in the bundle. Personal data stays in `localStorage`.

## CI checklist before deploy

Workflow should:

1. `npm ci` in `durum-web`
2. Run validation (`test:plans`, `test:system` at minimum; prefer `test:all`)
3. `vite build` → upload `dist` as Pages artifact

Do not deploy a green Pages site that failed mentor/study/FSRS invariants.

## Public progress publish

| Piece | Path |
|-------|------|
| Panel | `src/components/PublishPanel.tsx` |
| API + schema | `src/data/publicProgress.ts` |
| Static file | `public/progress.json` → served as `PROGRESS_PATH` |

- Token: fine-grained PAT, **Contents: Read and write**, stored **only** in browser localStorage — never commit.
- Visitors without the token can read published progress; they cannot publish.

## Local verify

```bash
cd durum-web
npm run test:all
npm run preview
```

Confirm relative asset paths work under a subpath / `file`-like base (`base: './'`).
