/**
 * Export durum backup → profile-stats.json + SVG cards for GitHub README.
 *
 * Usage:
 *   npx tsx scripts/generate-profile-stats.ts --input backup.json --output ./profile-output
 *   npx tsx scripts/generate-profile-stats.ts --seed --output ./profile-output
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  bandLabel,
  buildPractice,
  computeAll,
  evaluateGates,
  gateSummary,
  interviewsLast14,
  round1,
  sessionsWithin,
  streakDays,
} from "../src/model/compute.ts";
import { MODEL } from "../src/model/constants.ts";
import { createSeedState } from "../src/model/seed.ts";
import type { AppState } from "../src/model/types.ts";

const DIM_COLOR: Record<string, string> = {
  T: "#1a6b5c",
  P: "#3d5a80",
  L: "#8a5a2b",
  C: "#0f4a3f",
};

type BackupPayload = {
  version?: string;
  exportedAt?: string;
  state: AppState;
  curriculum?: Record<string, string>;
};

function parseArgs(argv: string[]) {
  let input: string | null = null;
  let output = resolve("profile-output");
  let useSeed = false;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--input" && argv[i + 1]) input = resolve(argv[++i]);
    else if (a === "--output" && argv[i + 1]) output = resolve(argv[++i]);
    else if (a === "--seed") useSeed = true;
  }
  return { input, output, useSeed };
}

function loadState(input: string | null, useSeed: boolean): { state: AppState; exportedAt: string } {
  if (useSeed) {
    return { state: createSeedState(), exportedAt: new Date().toISOString() };
  }
  if (!input) {
    console.error("Provide --input <backup.json> or --seed");
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(input, "utf8")) as BackupPayload | AppState;
  const state = "state" in raw && raw.state ? raw.state : (raw as AppState);
  const exportedAt = "exportedAt" in raw && raw.exportedAt ? raw.exportedAt : new Date().toISOString();
  if (!state?.skills?.length) {
    console.error("Invalid backup: missing state.skills");
    process.exit(1);
  }
  return { state, exportedAt };
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function summarySvg(opts: {
  R: number;
  band: string;
  boyutlar: Array<{ key: string; v: number; hedef: number }>;
  streak: number;
  saat7: number;
}): string {
  const w = 520;
  const h = 280;
  const r = 72;
  const cx = 110;
  const cy = 130;
  const ratio = Math.min(1, opts.R / 100);
  const c = 2 * Math.PI * r;
  const offset = c * (1 - ratio);
  const bars = opts.boyutlar
    .map((b, i) => {
      const y = 48 + i * 52;
      const barW = 280;
      const fill = Math.min(1, b.v / b.hedef) * barW;
      const color = DIM_COLOR[b.key] ?? "#1a6b5c";
      return `<text x="220" y="${y - 8}" fill="#6a7d8a" font-size="12" font-weight="600">${b.key}</text>
<text x="500" y="${y - 8}" fill="#14212b" font-size="12" text-anchor="end">${round1(b.v)}/${b.hedef}</text>
<rect x="220" y="${y}" width="${barW}" height="14" rx="7" fill="#e8eef0"/>
<rect x="220" y="${y}" width="${fill}" height="14" rx="7" fill="${color}"/>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Durum summary R ${round1(opts.R)}">
  <rect width="100%" height="100%" fill="#f7f9fa" rx="12"/>
  <text x="24" y="32" fill="#14212b" font-size="16" font-weight="700">Durum · Model ${MODEL.surum}</text>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e8eef0" stroke-width="12"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1a6b5c" stroke-width="12" stroke-linecap="round"
    stroke-dasharray="${c}" stroke-dashoffset="${offset}" transform="rotate(-90 ${cx} ${cy})"/>
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="#14212b" font-size="36" font-weight="700">${round1(opts.R)}</text>
  <text x="${cx}" y="${cy + 20}" text-anchor="middle" fill="#6a7d8a" font-size="13" font-weight="600">R</text>
  <text x="${cx}" y="${cy + 44}" text-anchor="middle" fill="#3d5a80" font-size="11">${esc(opts.band)}</text>
  ${bars}
  <text x="24" y="${h - 18}" fill="#6a7d8a" font-size="11">Streak: ${opts.streak} days · Last 7 days: ${round1(opts.saat7)} h</text>
</svg>`;
}

function skillsSvg(skills: Array<{ kisa: string; v: number }>): string {
  const w = 520;
  const top = [...skills].sort((a, b) => b.v - a.v).slice(0, 8);
  const rowH = 34;
  const h = 56 + top.length * rowH;
  const max = 10;
  const rows = top
    .map((s, i) => {
      const y = 48 + i * rowH;
      const barW = 300;
      const fill = (s.v / max) * barW;
      return `<text x="24" y="${y + 12}" fill="#14212b" font-size="12" font-weight="600">${esc(s.kisa)}</text>
<rect x="140" y="${y}" width="${barW}" height="16" rx="8" fill="#e8eef0"/>
<rect x="140" y="${y}" width="${fill}" height="16" rx="8" fill="#1a6b5c"/>
<text x="456" y="${y + 12}" fill="#6a7d8a" font-size="11" text-anchor="end">${round1(s.v)}</text>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Skills summary">
  <rect width="100%" height="100%" fill="#f7f9fa" rx="12"/>
  <text x="24" y="32" fill="#14212b" font-size="16" font-weight="700">Skills (effective score)</text>
  ${rows}
</svg>`;
}

function gatesSvg(gates: Array<{ id: string; name: string; open: boolean; pi: number }>): string {
  const w = 520;
  const h = 120;
  const gap = w / (gates.length + 1);
  const dots = gates
    .map((g, i) => {
      const x = gap * (i + 1);
      const fill = g.open ? "#1a6b5c" : "#c5ddd6";
      const stroke = g.open ? "#0f4a3f" : "#6a7d8a";
      return `<circle cx="${x}" cy="52" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
<text x="${x}" y="57" text-anchor="middle" fill="${g.open ? "#fff" : "#14212b"}" font-size="11" font-weight="700">${esc(g.id)}</text>
<text x="${x}" y="88" text-anchor="middle" fill="#6a7d8a" font-size="9">${esc(g.name.split(" ")[0])}</text>`;
    })
    .join("\n");
  const lines = gates
    .slice(0, -1)
    .map((_, i) => {
      const x1 = gap * (i + 1) + 18;
      const x2 = gap * (i + 2) - 18;
      return `<line x1="${x1}" y1="52" x2="${x2}" y2="52" stroke="#c5ddd6" stroke-width="2"/>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Gate pipeline">
  <rect width="100%" height="100%" fill="#f7f9fa" rx="12"/>
  <text x="24" y="28" fill="#14212b" font-size="16" font-weight="700">Gate Pipeline</text>
  ${lines}
  ${dots}
</svg>`;
}

function main() {
  const { input, output, useSeed } = parseArgs(process.argv);
  const { state, exportedAt } = loadState(input, useSeed);
  const nowMs = Date.now();
  const practice = buildPractice(state.history, state.skills, nowMs);
  const live = computeAll(state.skills, state.artifacts, state.lang, state.career, practice, {
    kanitTavani: true,
    curume: true,
  });
  const gate0Ok =
    state.chancenkarte.gate0 !== "bilinmiyor" && state.chancenkarte.gate0 !== "denk_degil";
  const gates = evaluateGates(
    live.sEff,
    live.R,
    state.artifacts,
    live.deEff,
    live.enEff,
    interviewsLast14(state.history, nowMs),
    gate0Ok,
    false,
  );
  const hedefV = MODEL.hedef.vektor;
  const boyutlar = [
    { key: "T", ad: "Technical", v: live.T, hedef: hedefV.T },
    { key: "P", ad: "Production", v: live.P, hedef: hedefV.P },
    { key: "L", ad: "Language", v: live.L, hedef: hedefV.L },
    { key: "C", ad: "Career", v: live.C, hedef: hedefV.C },
  ];
  const streak = streakDays(state.history, nowMs);
  const saat7 =
    sessionsWithin(state.history, nowMs, 7).reduce((a, r) => a + (r.dur_min ?? 0), 0) / 60;

  const profileStats = {
    exportedAt,
    model: MODEL.surum,
    R: round1(live.R),
    band: bandLabel(live.R),
    boyutlar: boyutlar.map((b) => ({ ...b, v: round1(b.v) })),
    skills: state.skills.map((s) => ({
      id: s.id,
      kisa: s.kisa,
      v: round1(live.sEff[s.id] ?? 0),
    })),
    gates: gates.map((g) => ({
      id: g.id,
      name: g.name,
      open: g.open,
      pi: round1(g.pi * 100),
    })),
    gateOzet: gateSummary(gates),
    streak,
    saat7: round1(saat7),
  };

  mkdirSync(output, { recursive: true });
  mkdirSync(resolve(output, "assets"), { recursive: true });

  const assetsDir = resolve(output, "assets");
  writeFileSync(resolve(output, "profile-stats.json"), JSON.stringify(profileStats, null, 2));
  writeFileSync(
    resolve(output, "durum-backup.json"),
    JSON.stringify({ version: "durum-v22", exportedAt, state }, null, 2),
  );
  writeFileSync(
    resolve(assetsDir, "durum-summary.svg"),
    summarySvg({ R: live.R, band: profileStats.band, boyutlar, streak, saat7 }),
  );
  writeFileSync(
    resolve(assetsDir, "durum-skills.svg"),
    skillsSvg(profileStats.skills.map((s) => ({ kisa: s.kisa, v: s.v }))),
  );
  writeFileSync(
    resolve(assetsDir, "durum-gates.svg"),
    gatesSvg(gates.map((g) => ({ id: g.id, name: g.name, open: g.open, pi: g.pi }))),
  );

  console.log(`Wrote profile stats to ${output}`);
}

main();
