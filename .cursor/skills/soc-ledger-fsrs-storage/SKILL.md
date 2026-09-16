---
name: soc-ledger-fsrs-storage
description: >-
  Preserve SOC Ledger FSRS retrieval, gate, seed, and localStorage invariants.
  Use when changing MODEL.tekrar, store load/save, seed, curriculum storage keys,
  Gate C evidence promote, carry limits, or migrateState / backup import.
---

# SOC Ledger — FSRS, gates & localStorage

## Keys (do not rename lightly)

| Key | Constant / location | Purpose |
|-----|---------------------|---------|
| `durum-v22` | `STORAGE_KEY` in `src/model/constants.ts` | AppState |
| `durum-curriculum-v1` | `CURRICULUM_STORAGE_KEY` in `src/data/oakCurriculum.ts` | Topic statuses |
| Publish token | `publicProgress.ts` | Browser-only GitHub PAT |

Internal package/storage names may stay `durum-*`; UI brand is **SOC Ledger**.

## Load / seed safety

- Load path: `normalizeLoadedState` / `loadState` in `src/model/migrateState.ts` + `src/store.tsx`.
- Always merge missing fields from `createSeedState()`; never replace seed with partial JSON that drops required arrays.
- Preserve all seed skill IDs when importing older saves (add missing skills from seed).
- `scheduleCarry`: max `MODEL.carry.maxCarry` (2), max age `MODEL.carry.maxAgeDays` (7).
- Curriculum statuses are separate — backup import must sync both keys when present.

## FSRS (`MODEL.tekrar`)

- Queue lives in `AppState.retrieval`; Map topics do **not** auto-enqueue.
- Outcomes update via `nextStability` / `isRetrievalDue` in `src/model/compute.ts`.
- Seed retrieval must stay non-empty (`SEED_RETRIEVAL`).

## Foundation spine rebuild (`FOUNDATION_SPINE_REBUILD`)

- When true (default): Topic Day packs **Oak module spine** first (`oakSpineOrder.ts`: IT Fundamentals → Network → Server → Intro Sec → Crypto → Firewall → EDR → scan), then at most **1** FSRS review, then light **class lane** (`OAK_COURSE_FOCUS`, e.g. Nessus).
- Spine skips `pekiştirildi` and queued titles. To re-do a topic, set it back to Learning on Map.
- Do **not** assume raw `tekrar-ekle.txt` line order is the spine (that file stays domain-grouped for stable IDs).
- Logic: `useRollingSchedule.ts` (`spineCandidates`, `packDay`).

## Gates (high risk)

- Gate C: ≥2 **public** valuable labs **with HTTP(S) URL** (`MODEL.kapi.C`).
- Promote path: `src/data/evidencePromote.ts` — reject non-http paths; no duplicate refs.
- Evidence caps: `yok` / `kayit` / `public` via `evidenceCap`.

## Verify

```bash
cd durum-web
npm run test:seed
npm run test:system
```

System tests cover seed R, carry, Gate C promote, FSRS stability, and load normalization.
