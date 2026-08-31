/**
 * Quick seed sanity check (run with: npx tsx scripts/check-seed.ts)
 * Or compile via vite; this mirrors computeAll for seed at Δt=0.
 */
import {
  SEED_ARTIFACTS,
  SEED_CAREER,
  SEED_LANG,
  SEED_SKILLS,
  computeAll,
  rGiris,
  rHedef,
  round2,
} from "../src/model";

const practice: Record<string, { days: number; n: number }> = {};
for (const s of SEED_SKILLS) practice[s.id] = { days: 0, n: 0 };

const live = computeAll(SEED_SKILLS, SEED_ARTIFACTS, SEED_LANG, SEED_CAREER, practice, {
  kanitTavani: true,
  curume: true,
});
const beyan = computeAll(SEED_SKILLS, SEED_ARTIFACTS, SEED_LANG, SEED_CAREER, practice, {
  kanitTavani: false,
  curume: false,
});

console.log({
  T: round2(live.T),
  P: round2(live.P),
  L: round2(live.L),
  C: round2(live.C),
  R: round2(live.R),
  R_beyan: round2(beyan.R),
  R_hedef: rHedef(),
  R_giris: rGiris(),
});
