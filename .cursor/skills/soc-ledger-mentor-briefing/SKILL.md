---
name: soc-ledger-mentor-briefing
description: >-
  QA and edit SOC Ledger mentor session briefings and English product voice.
  Use when changing mentorBriefing.ts, MentorBriefingPanel, day-log mentor prompts,
  brand copy, Teacher-first protocol, Study-steps guidance, or English UI strings
  for Today → mentor → Record.
---

# SOC Ledger — Mentor briefing & voice

## Product loop

Today → **Copy for mentor** → study chat → return to **Record work** / Day log.

Do not invent topics outside the briefing. English only (see `.cursor/rules/english-only.mdc`).

## Source of truth

| Piece | Path |
|-------|------|
| Protocol + builders | `durum-web/src/data/mentorBriefing.ts` |
| Day copy UI | `durum-web/src/components/MentorBriefingPanel.tsx` |
| Per-task copy | `durum-web/src/pages/Bugun.tsx` |
| Brand names | `durum-web/src/model/brand.ts` (`APP_NAME`, `STUDY_APPROACH_NOTE`) |
| Regression | `durum-web/scripts/validate-system.ts` §7 |

## Teacher-first invariants

Briefings **must**:

1. Default role: **Teacher / mentor** (guided study).
2. Opening: **light level-check** (1–2 easy questions or “what do you already know?”) — not Examiner / hard quiz.
3. Weak / new → teach, then steer to this task’s **Study steps** and resources.
4. Examiner / no-hints only after teaching, or when the learner asks for a check.
5. No vendor AI names (`ChatGPT`, `Claude`, `Gemini`, `OpenAI`) in user-facing or briefing text.
6. Product name **SOC Ledger** (`APP_NAME`), not generic “tracker” as the brand.

## When editing protocol text

- Keep sections A–G (PURPOSE → VERIFICATION).
- Keep dual lens: attack/technique **and** defender/detection (`STUDY_APPROACH_NOTE`).
- Prefer Study-path actions while learning over quiz loops.
- Closing turn: remind learner to return to Record / Day log.

## Panel copy

`MentorBriefingPanel` lead should describe the loop: light level-check → teach & Study steps → practice → optional check — **not examiner-first**.

## Verify

```bash
cd durum-web
npm run test:system
```

Asserts cover Teacher/mentor default, examiner-first ban, Study-steps weak branch, no vendor AI names, and Study steps section when a guide is present.
