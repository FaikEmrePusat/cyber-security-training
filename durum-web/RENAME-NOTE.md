# Product rename: Durum → Cyber Ledger

**Display name:** **Cyber Ledger** (`APP_NAME`)  
**Subtitle:** Germany cyber multi-role foundation tracker

**Rationale:** Keeps a recognizable ledger brand while framing progress as a broad cybersecurity foundation for Germany applications — SOC / Blue Team is one useful dual-lens mode and possible outcome, not the only destiny. (Earlier working name “SOC Ledger” was dropped as too identity-narrow.)

**What changed (display only):**
- Nav brand, page titles, hero labels, README, HTML `<title>`
- Profile SVG/script labels where synced
- Mentor briefing / day-log prompts via `APP_NAME`

**What did NOT change (backward compatibility):**
- npm package name `durum-web`
- `localStorage` keys (`durum-v22`, `durum-curriculum-v1`)
- Artifact types such as `soc-lab` (schema)
- React hooks (`useDurum`, `DurumProvider`)
- Git repo / folder paths
- Route `/durum` (Status page)
- Skill folder names `soc-ledger-*` (path stability)

Single source of truth: `src/model/brand.ts`.
