# Cursor subagent model routing

**Audience:** Faik + agents  
**Scope:** Life Usta + Cyber Ledger in this repo. Durable policy — pick by **task risk**, not habit.  
**Rule:** Do **not** default to `claude-opus-5-thinking-max`. Critical → Claude family (usually medium). Grunt → Grok.

Slugs below are the **only** allowed values. Do not invent others.

**Evidence note:** Relative strengths below mix public 2026 coding writeups with project judgment. Benchmarks shift; treat “why” as guidance. Items marked *(speculation)* are not measured claims.

---

## Decision table

| Task type | Recommended slug | Why | Escalate when |
|-----------|------------------|------|----------------|
| **Architecture / invariants** (NowEngine rules, LWW/merge, FSRS/Ledger boundaries, auth model) | `claude-opus-5-5-medium` | Strong judgment + consistency on cross-cutting rules; cheaper than Max. *(speculation: better instruction-following on multi-constraint product design than Grok/Flash)* | Stuck after one pass, conflicting invariants, or irreversible data-model risk → `claude-opus-5-thinking-max` |
| **Hardest long-horizon agent work** (rare) | `claude-opus-5-thinking-max` | Ceiling Claude reasoning for stuck agents / deep repo-wide redesign. **Token expensive — rare by policy.** | N/A (already top). Prefer narrowing the task before re-running Max. |
| **Ceiling Claude alternate** (only if Max fails or harness needs Fable) | `claude-fable-5-1-thinking-high` | Newer Fable tier; use only when medium + Max still fail. Prefer `…-5-1…` over `claude-fable-5-thinking-high`. | Cost blow-up — stop and re-scope. |
| **Feature coding / multi-file impl** (against locked design) | `claude-opus-5-5-medium` | Default **critical** coding path. | Non-converging bugs / subtle race → Max **or** second opinion `gpt-5.6-sol-medium` |
| **Second opinion / alternate coder** | `gpt-5.6-sol-medium` | Strong balanced coding + tools; good cross-check when Claude loop stalls. *(speculation)* | Still stuck → Claude Max once, with a sharper prompt |
| **Grunt** (boilerplate, renames, docs copy-edit, mechanical wiring, simple tests) | `grok-4.7-high` | Fast/cheap enough for volume; default **grunt**. Prefer over `cursor-grok-4.6-xhigh` unless that slug is required by the harness. | Touches invariants, security, or sync → Claude medium |
| **Cheap research / skim** (web/docs survey, prior-art tables, non-binding notes) | `gemini-3.8-flash-high` | Low-cost breadth. Verify before locking product decisions. | Research becomes a **decision** → Claude medium |
| **IDE-native light edits** (tiny local patches, parent already holding context) | `composer-2.5-fast` or `inherit` | Fast Composer / parent model; avoid spinning a heavy subagent. | Needs deep reasoning → Claude medium |
| **Huge-context dump** (very large logs/docs; rare) | `kimi-k3-max` | Large-context niche. *(speculation)* | Synthesis/decision quality matters → Claude medium on a **summary**, not the dump |
| **Benchmark / harness experiments** | `muse-spark-1.3-high` | Optional coding-harness contender; **not** a default product path. | Production Usta/Ledger work → use table rows above |

---

## Explicit defaults (memorize)

| Role | Slug | When |
|------|------|------|
| **Default critical** | `claude-opus-5-5-medium` | Architecture, product rules, non-trivial coding, security-sensitive review |
| **Grunt** | `grok-4.7-high` | Boilerplate, mechanical, low-risk volume |
| **Second opinion / code alt** | `gpt-5.6-sol-medium` | Claude stuck or want a different coding style |
| **Cheap research** | `gemini-3.8-flash-high` | Skims only; do not lock decisions from Flash alone |
| **Rare ceiling** | `claude-opus-5-thinking-max` | Only after medium failed, or irreversible / high blast-radius work |

---

## Anti-patterns

- Spawning Max “just in case.”
- Using Claude for every rename, CSS tweak, or markdown fix.
- Locking product decisions from Flash/Grok research without a Claude (or human) pass.
- Inventing model slugs not in the allowed list.

---

## Recommended next agent (Usta Phase 0/1 completion)

**Slug:** `claude-opus-5-5-medium`  

Phase 0/1 is finishing MVP against **already locked** decisions (core + web, sync/auth docs, NowEngine). Needs critical judgment, not Max token spend. Escalation path: `gpt-5.6-sol-medium` for a coding second opinion; `claude-opus-5-thinking-max` only if merge/NowEngine correctness still fails after one medium pass.
