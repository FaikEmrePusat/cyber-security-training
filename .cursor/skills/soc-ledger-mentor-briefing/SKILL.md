---
name: soc-ledger-mentor-briefing
description: >-
  QA and edit Cyber Ledger mentor session briefings and English product voice.
  Use when changing mentorBriefing.ts, MentorBriefingPanel, day-log mentor prompts,
  brand copy, Teacher-first protocol, Study-steps guidance, or English UI strings
  for Today → mentor → Record.
---

# Cyber Ledger — Mentor briefing & voice

## Product loop

Today → **Copy for mentor** → study chat → return to **Record work** / Day log.

Do not invent topics outside the briefing. English only (see `.cursor/rules/english-only.mdc`).

## Source of truth

| Piece | Path |
|-------|------|
| Protocol + builders | `durum-web/src/data/mentorBriefing.ts` |
| Day copy UI | `durum-web/src/components/MentorBriefingPanel.tsx` |
| Per-task copy | `durum-web/src/pages/Bugun.tsx` |
| Brand names | `durum-web/src/model/brand.ts` (`APP_NAME`, `APP_SUBTITLE`, `LEARNER_ROLE`, `STUDY_APPROACH_NOTE`) |
| Regression | `durum-web/scripts/validate-system.ts` §7 |

## Teacher-first invariants

Briefings **must**:

1. Default role: **Teacher / mentor** (guided study).
2. Opening: **light level-check** (1–2 easy questions or “what do you already know?”) — not Examiner / hard quiz.
3. Weak / new → teach, then steer to this task’s **Study steps** and resources.
4. Examiner / no-hints only after teaching, or when the learner asks for a check.
5. After each micro-step: learner **explain-back** (2–3 sentences) before more teaching / dual-lens extras.
6. No vendor AI names (`ChatGPT`, `Claude`, `Gemini`, `OpenAI`) in user-facing or briefing text.
7. Product name **Cyber Ledger** (`APP_NAME`), not generic “tracker” as the brand.
8. Respect **foundation spine**: deep tour in **Oak module order** (IT Fundamentals → Network → Server → … via `oakSpineOrder.ts`); class/Nessus = light lane; one solid tour > clearing every Today card.
9. Gap bridge: unknown concept → map to earlier spine topic + 2-min bridge or return to foundation.

## Learner profile (Context block)

- Goal: **Germany cybersecurity multi-role foundation** — apply broadly; SOC / Blue Team is one possible outcome and dual-lens training mode, not the only identity
- Understands when they can **do + explain while doing**
- Autopilot risk on long wall-of-text rooms — avoid “read the whole room” steers
- ~40–45 min focus blocks
- Spine ≠ raw `tekrar-ekle.txt` domain order
## When editing protocol text

- Keep sections A–G (PURPOSE → VERIFICATION).
- PURPOSE must stay multi-role Germany cyber (not SOC-only destiny); SOC ticket language = one on-the-job example among roles.
- Keep dual lens: attack/technique **and** defender/detection (`STUDY_APPROACH_NOTE`) — helps all target roles.
- Prefer Study-path actions while learning over quiz loops.
- Closing turn: remind learner to return to Record / Day log.

## Panel copy

`MentorBriefingPanel` lead should describe the loop: light level-check → teach & Study steps → practice → optional check — **not examiner-first**.

## Brand

| Constant | Role |
|----------|------|
| `APP_NAME` | **Cyber Ledger** |
| `APP_SUBTITLE` | Multi-role Germany cyber foundation tracker |
| `LEARNER_ROLE` | Multi-role foundation wording — not “Aspiring Junior SOC Analyst” destiny |
| `STUDY_APPROACH_NOTE` | Dual lens across DE cyber roles |

Skill folder name `soc-ledger-mentor-briefing` is kept for path stability; product brand is Cyber Ledger.

## Verify

```bash
cd durum-web
npm run test:system
```

Asserts cover Teacher/mentor default, examiner-first ban, Study-steps weak branch, explain-back, spine rebuild, no vendor AI names, multi-role PURPOSE / LEARNER_ROLE, and Study steps section when a guide is present.
