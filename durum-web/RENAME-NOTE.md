# Product rename: Durum → SOC Ledger

**Proposed display name:** **SOC Ledger**

**Rationale:** Conveys a professional competency ledger for Junior SOC / Blue Team progress tracking — structured, evidence-oriented, and distinct from generic "dashboard" names.

**Alternatives if you prefer another direction:**
- **Compass** — navigation metaphor; less domain-specific
- **TrackSheet** — neutral training tracker; less SOC identity
- **Progress Lab** — emphasizes hands-on labs; softer on gates/metrics

**What changed (display only):**
- Nav brand, page titles, hero labels, README, HTML `<title>`
- Profile SVG/script labels where synced

**What did NOT change (backward compatibility):**
- npm package name `durum-web`
- `localStorage` keys (`durum-v22`, `durum-curriculum-v1`)
- React hooks (`useDurum`, `DurumProvider`)
- Git repo / folder paths
- Route `/durum` (Status page)

Approve or reply with your preferred name from the list (or another) and we can swap `APP_NAME` in `src/model/brand.ts` in one place.
