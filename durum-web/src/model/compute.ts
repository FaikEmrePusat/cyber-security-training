import { CEFR, MODEL } from "./constants";
import type {
  Artifact,
  ArtifactType,
  CareerItem,
  ChancenkarteState,
  EvidenceTier,
  LangState,
  LogRecord,
  RetrievalItem,
  Skill,
} from "./types";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function pct(n: number): string {
  return `%${Math.round(n * 100)}`;
}
export function parseNum(raw: string, fallback: number): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function evidenceCap(tier: EvidenceTier, max: number): number {
  return MODEL.kanitOrani[tier] * max;
}

export function cefrFromScore(s: number): string {
  if (s < 3) return "A1";
  if (s < 5) return "A2";
  if (s < 7.5) return "B1";
  if (s < 9.5) return "B2";
  return "C1";
}

export function cefrToScore(ad: string): number {
  const m = CEFR.find((c) => c.ad === ad);
  return m?.skor ?? 1.5;
}

export function langComposite(konusma: number, genel: number): number {
  return MODEL.L.konusma * konusma + MODEL.L.genel * genel;
}

export function langScores(
  lang: LangState,
  kanitTavani: boolean,
): { de: number; en: number; deEff: number; enEff: number } {
  const de = langComposite(lang.deKonusma, lang.deGenel);
  const en = langComposite(lang.enKonusma, lang.enGenel);
  if (!kanitTavani) return { de, en, deEff: de, enEff: en };
  return {
    de,
    en,
    deEff: Math.min(de, evidenceCap(lang.deEv, 10)),
    enEff: Math.min(en, evidenceCap(lang.enEv, 10)),
  };
}

export function computeRFromDims(T: number, P: number, L: number, C: number): number {
  const parts = [T / 10, P / 10, L / 10, C / 10].map((x) => Math.max(x, 0.02));
  const w = [MODEL.R.T, MODEL.R.P, MODEL.R.L, MODEL.R.C];
  if (MODEL.rho === 0) {
    return (
      100 *
      Math.pow(parts[0], w[0]) *
      Math.pow(parts[1], w[1]) *
      Math.pow(parts[2], w[2]) *
      Math.pow(parts[3], w[3])
    );
  }
  return 100 * (w[0] * parts[0] + w[1] * parts[1] + w[2] * parts[2] + w[3] * parts[3]);
}

export function rHedef(): number {
  const v = MODEL.hedef.vektor;
  return round1(computeRFromDims(v.T, v.P, v.L, v.C));
}

export function rGiris(): number {
  const v = MODEL.hedef.vektorGiris;
  return round1(computeRFromDims(v.T, v.P, v.L, v.C));
}

export function sfiaLabel(s: number): string {
  if (s <= 1) return "";
  if (s <= 3) return "SFIA 1 · Follow";
  if (s <= 5) return "SFIA 2 · Assist";
  if (s <= 7) return "SFIA 3 · Apply";
  if (s <= 8) return "SFIA 4 · Enable";
  return "SFIA 5 · beyond target";
}

export function glhForScore(s: number): number {
  if (s <= CEFR[0].skor) return MODEL.glh.A1;
  if (s <= CEFR[1].skor) return MODEL.glh.A2;
  if (s <= CEFR[2].skor) return MODEL.glh.B1;
  if (s <= CEFR[3].skor) return MODEL.glh.B2;
  return MODEL.glh.C1;
}

export function langHoursRemaining(deScore: number, target: number): number {
  return Math.max(0, glhForScore(target) - glhForScore(deScore));
}

export function bandLabel(r: number): string {
  if (r < 25) return "Foundation setup";
  if (r < 45) return "Settling in / lab phase";
  if (r < 65) return "Portfolio + defensive practice";
  if (r < 80) return "Application threshold";
  return "Strong application profile";
}

export function levelLabel(score: number): string {
  if (score <= 1) return "Not familiar";
  if (score <= 3) return "Follow";
  if (score <= 5) return "Assist";
  if (score <= 7) return "Apply — junior target";
  if (score <= 8) return "Enable — beyond target";
  return "Ensure — lead";
}

export function decayMultiplier(days: number, n: number): number {
  const tau = MODEL.curume.tau0 * Math.pow(MODEL.curume.b, n);
  const ret = Math.exp(-Math.max(0, days) / tau);
  return MODEL.curume.taban + (1 - MODEL.curume.taban) * ret;
}

export type PracticeInfo = { days: number; n: number };
export type PracticeMap = Record<string, PracticeInfo>;

export type Derived = {
  T: number;
  P: number;
  L: number;
  C: number;
  R: number;
  sEff: Record<string, number>;
  pSum: number;
  pGrup: Record<EvidenceTier, number>;
  pTavan: EvidenceTier;
  deEff: number;
  enEff: number;
};

export type ComputeOpts = { kanitTavani: boolean; curume: boolean };

export function computeAll(
  skills: Skill[],
  artifacts: Artifact[],
  lang: LangState,
  career: CareerItem[],
  practice: PracticeMap,
  opts: ComputeOpts,
): Derived {
  const sEff: Record<string, number> = {};
  let num = 0;
  let den = 0;
  for (const s of skills) {
    if (MODEL.tHaric.indexOf(s.id) >= 0) continue;
    const capped = opts.kanitTavani ? Math.min(s.claimed, evidenceCap(s.evidence, 10)) : s.claimed;
    const info: PracticeInfo = practice[s.id] ?? { days: 0, n: 0 };
    const eff = opts.curume ? capped * decayMultiplier(info.days, info.n) : capped;
    sEff[s.id] = eff;
    num += s.weight * eff;
    den += s.weight;
  }
  const T = den > 0 ? num / den : 0;

  const grup: Record<EvidenceTier, number> = { yok: 0, kayit: 0, public: 0 };
  let pSum = 0;
  for (const a of artifacts) {
    const q = opts.kanitTavani ? Math.min(a.sahiplik, MODEL.kanitOrani[a.evidence]) : a.sahiplik;
    const katki = q * MODEL.artefaktDeger[a.tur];
    grup[a.evidence] += katki;
    pSum += katki;
  }
  const pSat = (sum: number) => 10 * (1 - Math.exp(-sum / MODEL.pKappa));
  const pDallar: Array<{ tier: EvidenceTier; deger: number }> = [
    { tier: "public", deger: Math.min(pSat(grup.public), evidenceCap("public", 10)) },
    { tier: "kayit", deger: Math.min(pSat(grup.public + grup.kayit), evidenceCap("kayit", 10)) },
    { tier: "yok", deger: Math.min(pSat(pSum), evidenceCap("yok", 10)) },
  ];
  let pEn = pDallar[0];
  for (const d of pDallar) if (d.deger > pEn.deger) pEn = d;
  const P = opts.kanitTavani ? pEn.deger : pSat(pSum);
  const pTavan: EvidenceTier = opts.kanitTavani ? pEn.tier : "public";

  const langs = langScores(lang, opts.kanitTavani);
  const deEff = langs.deEff;
  const enEff = langs.enEff;
  const L = MODEL.L.DE * deEff + MODEL.L.EN * enEff;

  let cSum = 0;
  for (const c of career) {
    cSum += opts.kanitTavani ? Math.min(c.claimed, evidenceCap(c.evidence, c.max)) : c.claimed;
  }
  const C = clamp(cSum, 0, 10);

  const R = computeRFromDims(T, P, L, C);

  return { T, P, L, C, R, sEff, pSum, pGrup: grup, pTavan, deEff, enEff };
}

export type GatePart = { key: string; label: string; ratio: number; ok: boolean };
export type GateResult = {
  id: string;
  name: string;
  formula: string;
  open: boolean;
  pi: number;
  parts: GatePart[];
  unlocks: string;
  bottleneck: GatePart | null;
};

function mkGate(
  id: string,
  name: string,
  formula: string,
  unlocks: string,
  parts: GatePart[],
): GateResult {
  const pi = parts.length ? parts.reduce((a, p) => a + p.ratio, 0) / parts.length : 0;
  const open = parts.every((p) => p.ok);
  let bottleneck: GatePart | null = null;
  for (const p of parts) if (!bottleneck || p.ratio < bottleneck.ratio) bottleneck = p;
  return { id, name, formula, open, pi: open ? 1 : pi, parts, unlocks, bottleneck: open ? null : bottleneck };
}

function part(key: string, label: string, value: number, target: number): GatePart {
  return { key, label: `${label} ${round1(value)}/${target}`, ratio: clamp(value / target, 0, 1), ok: value >= target };
}

export function evaluateGates(
  sEff: Record<string, number>,
  R: number,
  artifacts: Artifact[],
  deEff: number,
  enEff: number,
  interviews14: number,
  gate0Ok: boolean,
  gateFOk: boolean,
): GateResult[] {
  const g = MODEL.kapi;
  const rEsik = rGiris();

  const A = mkGate("A", "Gate A — Foundation baseline", `net≥${g.A.net} ∧ linux≥${g.A.linux} ∧ win≥${g.A.win}`, "Serious defensive lab workload", [
    part("net", "Networking", sEff.net ?? 0, g.A.net),
    part("linux", "Linux", sEff.linux ?? 0, g.A.linux),
    part("win", "Windows/AD", sEff.win ?? 0, g.A.win),
  ]);

  const B = mkGate("B", "Gate B — Defensive practice", `Gate A ∧ secfund≥${g.B.secfund} ∧ siem≥${g.B.siem}`, "Mini SOC lab (Sysmon / SIEM)", [
    { key: "gateA", label: `Gate A ${pct(A.pi)}`, ratio: A.pi, ok: A.open },
    part("secfund", "SecFund", sEff.secfund ?? 0, g.B.secfund),
    part("siem", "SIEM", sEff.siem ?? 0, g.B.siem),
  ]);

  const kanitliPublic = artifacts.filter(
    (a) => a.evidence === "public" && a.sahiplik >= g.C.minSahiplik,
  );
  const degerliLab = kanitliPublic.filter((a) => a.tur === "soc-lab" || a.tur === "ad-lab");
  const cOk =
    kanitliPublic.length >= g.C.publicProje &&
    degerliLab.some((a) => MODEL.artefaktDeger[a.tur] >= g.C.minDeger);
  const cRatio = clamp(
    Math.min(kanitliPublic.length / g.C.publicProje, degerliLab.length >= 1 ? 1 : 0),
    0,
    1,
  );
  const C = mkGate(
    "C",
    "Gate C — Evidence",
    `≥${g.C.publicProje} artifact public+owned, ≥1 value≥${g.C.minDeger}`,
    "Strong project line on CV",
    [
      {
        key: "artefakt-public",
        label: `Public+owned ${kanitliPublic.length}/${g.C.publicProje} · valuable lab ${degerliLab.length >= 1 ? "✓" : "✗"}`,
        ratio: cRatio,
        ok: cOk,
      },
    ],
  );

  const D = mkGate(
    "D",
    "Gate D — Application threshold",
    `R≥${rEsik} ∧ Gate C ∧ Gate 0 ∧ DE≥${g.D.de} ∧ EN≥${g.D.en}`,
    "Regular Germany-focused applications",
    [
      part("R", "R", R, rEsik),
      { key: "gateC", label: `Gate C ${pct(C.pi)}`, ratio: C.pi, ok: C.open },
      { key: "gate0", label: `Gate 0 ${gate0Ok ? "✓" : "✗"}`, ratio: gate0Ok ? 1 : 0, ok: gate0Ok },
      part("de", "DE", deEff, g.D.de),
      part("en", "EN technical", enEff, g.D.en),
    ],
  );

  const E = mkGate("E", "Gate E — Intensive interviews", `Gate D ∧ interviews in last 14 days ≥ ${g.E.mulakat14gun}`, "Intensive interview pace", [
    { key: "gateD", label: `Gate D ${pct(D.pi)}`, ratio: D.pi, ok: D.open },
    part("mulakat", "Interviews (14 days)", interviews14, g.E.mulakat14gun),
  ]);

  const F = mkGate(
    "F",
    "Gate F — Finances (Route B)",
    `Runway ≥ ${g.F.runwayAy} months`,
    "Chancenkarte job-search period",
    [{ key: "runway", label: `Runway ${gateFOk ? "≥12 months" : "insufficient/unknown"}`, ratio: gateFOk ? 1 : 0, ok: gateFOk }],
  );

  const zero = mkGate(
    "0",
    "Gate 0 — Legal prerequisite",
    "Recognition outcome known ∧ residence route defined",
    "Chancenkarte / work visa path",
    [{ key: "gate0durum", label: gate0Ok ? "Route defined" : "Unknown — ETA conditional", ratio: gate0Ok ? 1 : 0.25, ok: gate0Ok }],
  );

  return [zero, A, B, C, D, E, F];
}

export function gateSummary(gates: GateResult[]): string {
  const open = gates.filter((g) => g.open).map((g) => g.id);
  const next = gates.find((g) => !g.open);
  if (!next) return "All gates open";
  const head = open.length ? `Open: ${open.join(", ")}` : "No gates open yet";
  return `${head} · next ${next.id} ${pct(next.pi)}${next.bottleneck ? ` · bottleneck: ${next.bottleneck.label}` : ""}`;
}

export function effectiveHours(hCyber: number, hLang: number, quality: number): number {
  return (MODEL.hiz.aSiber * hCyber + MODEL.hiz.aDil * hLang) * quality;
}

export function predictedVelocity(hCyber: number, hLang: number, quality: number): number {
  const hEff = effectiveHours(hCyber, hLang, quality);
  return clamp((hEff - MODEL.hiz.h0) / MODEL.hiz.H, MODEL.hiz.min, MODEL.hiz.max);
}

export function daysSince(iso: string, nowMs: number): number {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, (nowMs - t) / 86400000);
}

export function buildPractice(history: LogRecord[], skills: Skill[], nowMs: number): PracticeMap {
  const baseIso = history.length ? history[0].t : "2026-08-27T12:00:00+03:00";
  const base = daysSince(baseIso, nowMs);
  const map: PracticeMap = {};
  for (const s of skills) map[s.id] = { days: base, n: 0 };
  for (const rec of history) {
    if (!rec.alan) continue;
    const info = map[rec.alan];
    if (!info) continue;
    if (rec.type !== "session" && rec.type !== "retrieval") continue;
    const d = daysSince(rec.t, nowMs);
    if (d < info.days) info.days = d;
    if (rec.type === "retrieval") {
      if (rec.sonuc === "basarili") info.n += 1;
      else if (rec.sonuc === "basarisiz") info.n = Math.max(0, info.n - 2);
    }
  }
  return map;
}

export type MeasuredVelocity = {
  v: number;
  weeks: number;
  n: number;
  sigma: number | null;
};

export function measuredVelocity(history: LogRecord[]): MeasuredVelocity | null {
  const snaps = history
    .filter((r) => r.type === "snapshot" && r.hesap)
    .slice()
    .sort((a, b) => Date.parse(a.t) - Date.parse(b.t));
  if (snaps.length < 2) return null;
  const last = snaps[snaps.length - 1];
  const lastMs = Date.parse(last.t);
  let ref = snaps[0];
  for (const s of snaps) if (lastMs - Date.parse(s.t) >= 28 * 86400000) ref = s;
  const weeks = (lastMs - Date.parse(ref.t)) / (7 * 86400000);
  if (weeks < 0.5) return null;
  const v = ((last.hesap?.R ?? 0) - (ref.hesap?.R ?? 0)) / weeks;

  let sigma: number | null = null;
  if (snaps.length >= 4) {
    const samples: number[] = [];
    for (let i = 1; i < snaps.length; i++) {
      const dw = (Date.parse(snaps[i].t) - Date.parse(snaps[i - 1].t)) / (7 * 86400000);
      if (dw > 0.2) samples.push(((snaps[i].hesap?.R ?? 0) - (snaps[i - 1].hesap?.R ?? 0)) / dw);
    }
    if (samples.length >= 3) {
      const mu = samples.reduce((a, x) => a + x, 0) / samples.length;
      const varr = samples.reduce((a, x) => a + (x - mu) * (x - mu), 0) / (samples.length - 1);
      sigma = Math.sqrt(varr);
    }
  }
  return { v, weeks, n: snaps.length, sigma };
}

export function sessionsWithin(history: LogRecord[], nowMs: number, days: number): LogRecord[] {
  return history.filter((r) => r.type === "session" && daysSince(r.t, nowMs) <= days);
}

export function interviewsLast14(history: LogRecord[], nowMs: number): number {
  return history.filter((r) => {
    if (daysSince(r.t, nowMs) > 14) return false;
    if (r.type === "session" && r.mod === "mulakat") return true;
    if (r.type === "funnel" && (r.asama === "hr_gorusme" || r.asama === "teknik_gorusme" || r.asama === "final"))
      return true;
    return false;
  }).length;
}

export function streakDays(history: LogRecord[], nowMs: number): number {
  const days = new Set<number>();
  for (const r of history) {
    if (r.type !== "session") continue;
    days.add(Math.floor(Date.parse(r.t) / 86400000));
  }
  if (!days.size) return 0;
  const today = Math.floor(nowMs / 86400000);
  let streak = 0;
  let cursor = days.has(today) ? today : today - 1;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}

export function retrievability(days: number, stability: number): number {
  const t = MODEL.tekrar;
  return Math.pow(1 + (t.factor * days) / stability, -t.w20);
}

export function isRetrievalDue(item: RetrievalItem, nowMs: number): boolean {
  const days = daysSince(item.lastIso, nowMs);
  return retrievability(days, item.stability) < MODEL.tekrar.rHedef;
}

export function nextStability(
  item: RetrievalItem,
  sonuc: "basarili" | "zorlandim" | "basarisiz",
): { s: number; ef: number; n: number } {
  const t = MODEL.tekrar;
  let { stability: s, ef, n } = item;
  if (sonuc === "basarili") {
    ef = Math.min(t.efMax, ef + 0.1);
    s = Math.min(t.sMax, s * ef);
    n += 1;
  } else if (sonuc === "zorlandim") {
    ef = Math.max(t.efMin, ef - 0.14);
    s = s * Math.max(1, ef - 0.6);
  } else {
    ef = Math.max(t.efMin, ef - 0.54);
    s = Math.max(t.s0, s * 0.35);
    n = Math.max(0, n - 2);
  }
  return { s, ef, n };
}

export function overdueRatio(item: RetrievalItem, nowMs: number): number {
  const days = daysSince(item.lastIso, nowMs);
  const r = retrievability(days, item.stability);
  return r >= MODEL.tekrar.rHedef ? 1 : (MODEL.tekrar.rHedef - r) / MODEL.tekrar.rHedef;
}

export function langHoursPerPoint(from: number): number {
  const rem = glhForScore(from + 1) - glhForScore(from);
  return Math.max(20, rem);
}

export function computeChancenkarte(
  ch: ChancenkarteState,
  deScore: number,
  enScore: number,
): {
  puan: number | null;
  detay: Array<{ madde: string; puan: number; ok: boolean }>;
  uygun: boolean;
} {
  const c = MODEL.chancenkarte;
  const detay: Array<{ madde: string; puan: number; ok: boolean }> = [];
  const nitelik = ch.meslekiEgitimYil >= 2;
  const dilOk = deScore >= cefrToScore("A1") || enScore >= cefrToScore("B2");
  const onKosul = nitelik && dilOk && ch.lebensunterhalt;
  if (!onKosul) {
    return {
      puan: null,
      detay: [
        { madde: "Vocational training ≥2 years", puan: 0, ok: nitelik },
        { madde: "DE≥A1 or EN≥B2", puan: 0, ok: dilOk },
        { madde: "Proof of subsistence", puan: 0, ok: ch.lebensunterhalt },
      ],
      uygun: false,
    };
  }
  if (ch.gate0 === "tam_denklik" || ch.anerkennungDurum === "tam") {
    return { puan: null, detay: [{ madde: "Full recognition — outside points system", puan: 0, ok: true }], uygun: true };
  }
  let p = 0;
  if (ch.anerkennungDurum === "kismi" || ch.gate0 === "kismi_denklik") {
    p += 4;
    detay.push({ madde: "Partial recognition bescheid (IHK FOSA)", puan: 4, ok: true });
  } else if (ch.anerkennungDurum === "ihk_fosa_basvuru" || ch.anerkennungDurum === "basvuruldu") {
    detay.push({ madde: "IHK FOSA application — decision pending (3–4 months)", puan: 4, ok: false });
  } else if (ch.anerkennungDurum === "anabin_kontrol" || ch.anerkennungDurum === "arastiriliyor") {
    detay.push({ madde: "Partial recognition — check anabin first (guide §8)", puan: 4, ok: false });
  } else if (ch.anerkennungDurum === "red") {
    detay.push({ madde: "Partial recognition — rejected (alternative points path)", puan: 4, ok: false });
  } else {
    detay.push({ madde: "Partial recognition (Anerkennung)", puan: 4, ok: false });
  }
  if (deScore >= cefrToScore("B2")) {
    p += 3;
    detay.push({ madde: "German B2+", puan: 3, ok: true });
  } else if (deScore >= cefrToScore("B1")) {
    p += 2;
    detay.push({ madde: "German B1", puan: 2, ok: true });
  } else if (deScore >= cefrToScore("A2")) {
    p += 1;
    detay.push({ madde: "German A2", puan: 1, ok: true });
  } else detay.push({ madde: "German A2+", puan: 1, ok: false });
  if (enScore >= cefrToScore("C1")) {
    p += 1;
    detay.push({ madde: "English C1", puan: 1, ok: true });
  }
  if (ch.yas <= c.yasEsik.tam) {
    p += c.yasPuan.tam;
    detay.push({ madde: `Age ≤${c.yasEsik.tam}`, puan: c.yasPuan.tam, ok: true });
  } else if (ch.yas <= c.yasEsik.kismi) {
    p += c.yasPuan.kismi;
    detay.push({ madde: `Age ≤${c.yasEsik.kismi}`, puan: c.yasPuan.kismi, ok: true });
  }
  if (ch.engpassberuf) {
    p += 1;
    detay.push({ madde: "Shortage occupation (unverified)", puan: 1, ok: true });
  }
  return { puan: p, detay, uygun: p >= c.puanEsik };
}

export function runwayAy(ch: ChancenkarteState): number | null {
  const birikim = ch.birikim.trim() === "" ? null : Number(ch.birikim);
  const tasarruf = ch.aylikTasarruf.trim() === "" ? null : Number(ch.aylikTasarruf);
  if (birikim === null || tasarruf === null || !Number.isFinite(birikim) || !Number.isFinite(tasarruf)) return null;
  const gider = MODEL.chancenkarte.gecimAy2026;
  return (birikim + tasarruf * 12) / gider;
}

export type PmcState = { ctl: number; atl: number; tsb: number; series: number[] };

export function buildPmc(history: LogRecord[], nowMs: number): PmcState {
  const days = new Map<number, number>();
  for (const r of history) {
    if (r.type !== "session" || !r.dur_min) continue;
    const d = Math.floor(Date.parse(r.t) / 86400000);
    const isLang = (r.alan ?? "").startsWith("dil");
    const h = r.dur_min / 60;
    const load =
      ((isLang ? 0 : h) * MODEL.hiz.aSiber + (isLang ? h : 0) * MODEL.hiz.aDil) *
      (r.kalite ?? 0.85) *
      MODEL.ctl.loadOlcek;
    days.set(d, (days.get(d) ?? 0) + load);
  }
  const start = days.size ? Math.min(...days.keys()) : Math.floor(nowMs / 86400000) - 42;
  const end = Math.floor(nowMs / 86400000);
  let ctl = 0;
  let atl = 0;
  const series: number[] = [];
  for (let d = start; d <= end; d++) {
    const load = days.get(d) ?? 0;
    ctl = ctl + (load - ctl) / MODEL.ctl.ctlGun;
    atl = atl + (load - atl) / MODEL.ctl.atlGun;
    series.push(round1(ctl));
  }
  return { ctl: round1(ctl), atl: round1(atl), tsb: round1(ctl - atl), series };
}

export function predictedVelocityFromCtl(ctl: number): number {
  return clamp((MODEL.hiz.ctlCarpan * ctl - MODEL.hiz.h0) / MODEL.hiz.H, MODEL.hiz.min, MODEL.hiz.max);
}

export function kalanTeknikSaat(sEff: Record<string, number>): number {
  const Sstar = MODEL.hedef.S;
  let sum = 0;
  for (const [id, target] of Object.entries(Sstar)) {
    if (id === "port") continue;
    const cur = sEff[id] ?? 0;
    sum += MODEL.efor.A * Math.max(0, target * target - cur * cur);
  }
  return sum;
}

export function componentEtaHafta(opts: {
  sEff: Record<string, number>;
  deEff: number;
  enEff: number;
  hoursCyber: number;
  hoursLang: number;
  rotaA: boolean;
}): { T: number; L: number; P: number; C: number; max: number; darboğaz: string } {
  const tekHf = opts.hoursCyber || 18;
  const dilHf = opts.hoursLang || 7;
  const kT = kalanTeknikSaat(opts.sEff);
  const kL = opts.rotaA
    ? langHoursRemaining(opts.enEff, MODEL.hedef.dil.en) / Math.max(1, dilHf * 0.45)
    : langHoursRemaining(opts.deEff, MODEL.hedef.dil.de) / Math.max(1, dilHf * 0.55);
  const kP = 110;
  const kC = 40;
  const etaT = kT / tekHf;
  const etaL = kL;
  const etaP = kP / tekHf;
  const etaC = kC / 10;
  const parts = [
    { k: "T", v: etaT },
    { k: "L", v: etaL },
    { k: "P", v: etaP },
    { k: "C", v: etaC },
  ];
  const maxP = parts.reduce((a, b) => (b.v > a.v ? b : a));
  return { T: etaT, L: etaL, P: etaP, C: etaC, max: maxP.v, darboğaz: maxP.k };
}

export function safetyMarginGun(sEff: Record<string, number>, practice: PracticeMap, esik: number): number {
  let min = Infinity;
  for (const [id, s] of Object.entries(sEff)) {
    if (s < esik) continue;
    const n = practice[id]?.n ?? 0;
    const tau = MODEL.curume.tau0 * Math.pow(MODEL.curume.b, n);
    if (2 * esik >= s) {
      min = Math.min(min, 999);
      continue;
    }
    const gm = tau * Math.log(s / (2 * esik - s));
    min = Math.min(min, gm);
  }
  return Number.isFinite(min) ? min : -1;
}

const TIER_ORDER: EvidenceTier[] = ["yok", "kayit", "public"];

export function minTierFor(needed: number, max: number): EvidenceTier {
  for (const t of TIER_ORDER) if (evidenceCap(t, max) >= needed) return t;
  return "public";
}

export function upgradeTier(current: EvidenceTier, needed: number, max: number): EvidenceTier {
  const min = minTierFor(needed, max);
  return TIER_ORDER.indexOf(min) > TIER_ORDER.indexOf(current) ? min : current;
}

export type RoiAction = {
  id: string;
  baslik: string;
  detay: string;
  deltaR: number;
  saat: number;
  roi: number;
  roiEff: number;
  gate: boolean;
};

export function computeRoiList(args: {
  skills: Skill[];
  artifacts: Artifact[];
  lang: LangState;
  career: CareerItem[];
  practice: PracticeMap;
  blocking: Set<string>;
}): RoiAction[] {
  const { skills, artifacts, lang, career, practice, blocking } = args;
  const opts: ComputeOpts = { kanitTavani: true, curume: true };
  const base = computeAll(skills, artifacts, lang, career, practice, opts).R;
  const sumWModel = skills.reduce((a, s) => a + s.weight, 0);
  const out: RoiAction[] = [];
  const push = (a: Omit<RoiAction, "roi" | "roiEff">) => {
    if (a.deltaR <= 0.01 || a.saat <= 0) return;
    const roi = a.deltaR / a.saat;
    out.push({ ...a, roi, roiEff: roi * (a.gate ? 1 + MODEL.roi.lambda : 1) });
  };

  for (const s of skills) {
    const cap = evidenceCap(s.evidence, 10);
    const gate = blocking.has(s.id);
    if (s.claimed > cap) {
      const tier = minTierFor(s.claimed, 10);
      const mod = skills.map((x) => (x.id === s.id ? { ...x, evidence: tier } : x));
      const r = computeAll(mod, artifacts, lang, career, practice, opts).R;
      push({
        id: `ev-${s.id}`,
        baslik:
          tier === "public"
            ? `${s.name}: add a public evidence link`
            : `${s.name}: add lab recording / screenshot`,
        detay: `Claim ${s.claimed} · cap lock ~${round1(s.claimed - cap)} · target evidence: ${MODEL.kanitAd[tier]}`,
        deltaR: r - base,
        saat: MODEL.roi.saatKanit[tier === "public" ? "public" : "kayit"],
        gate,
      });
    }
    if (s.claimed < 10) {
      const hedef = s.claimed + 1;
      const tier = upgradeTier(s.evidence, hedef, 10);
      const kanitEk = tier !== s.evidence ? MODEL.roi.saatKanit[tier === "public" ? "public" : "kayit"] : 0;
      const mod = skills.map((x) => (x.id === s.id ? { ...x, claimed: hedef, evidence: tier } : x));
      const r = computeAll(mod, artifacts, lang, career, practice, opts).R;
      push({
        id: `s-${s.id}`,
        baslik: `${s.name}: ${s.claimed} → ${hedef}${kanitEk ? " (+ evidence)" : ""}`,
        detay: `w=${s.weight} · ΔT = w/Σw = ${round2(s.weight / sumWModel)}`,
        deltaR: r - base,
        saat: MODEL.roi.saatPuanTeknik + kanitEk,
        gate,
      });
    }
  }

  for (const a of artifacts) {
    if (a.evidence === "public" && a.sahiplik >= 1) continue;
    const mod = artifacts.map((x) =>
      x.id === a.id ? { ...x, evidence: "public" as EvidenceTier, sahiplik: 1 } : x,
    );
    const r = computeAll(skills, mod, lang, career, practice, opts).R;
    const publishPlain =
      a.tur === "writeup"
        ? "Publish a lab write-up on GitHub (public link) — get evidence"
        : a.tur === "lab-egzersizi"
          ? "Publish your lab work with a public link — get evidence"
          : `Add a public link for "${a.ad}" — get evidence`;
    push({
      id: `ap-${a.id}`,
      baslik: publishPlain,
      detay: `Evidence: none/record → public · q_eff ${round2(Math.min(a.sahiplik, MODEL.kanitOrani[a.evidence]))} → 1.0 · v=${MODEL.artefaktDeger[a.tur]}`,
      deltaR: r - base,
      saat: MODEL.roi.saatKanit.public,
      gate: blocking.has("artefakt-public") || blocking.has("gateC"),
    });
  }

  for (const tur of Object.keys(MODEL.artefaktDeger) as ArtifactType[]) {
    let baslik = `Create new ${MODEL.artefaktAd[tur]} and publish publicly`;
    let detay = `v=${MODEL.artefaktDeger[tur]} · public evidence opens P cap of ${evidenceCap("public", 10)}`;
    if (tur === "soc-lab") {
      baslik = "Sysmon + Wazuh / Splunk Lab Setup and Analysis";
      detay = "Valuable SOC lab for Gate B & Gate C (v=3.0) · collect Sysmon/WinEvent logs into SIEM, write and review alert rule";
    } else if (tur === "ad-lab") {
      baslik = "Active Directory Attack & Defense Lab";
      detay = "Valuable AD lab for Gate C (v=2.5) · Kerberos/NTLM/GPO analysis and Event ID 4624/4688 detection";
    }
    const mod = artifacts.concat([
      { id: `sim-${tur}`, ad: baslik, tur, sahiplik: 1, evidence: "public", ref: "sim" },
    ]);
    const r = computeAll(skills, mod, lang, career, practice, opts).R;
    push({
      id: `an-${tur}`,
      baslik,
      detay,
      deltaR: r - base,
      saat: MODEL.artefaktSaat[tur] + MODEL.roi.saatKanit.public,
      gate: blocking.has("artefakt-public") || blocking.has("gateC") || blocking.has("siem") || blocking.has("gateB"),
    });
  }

  const diller: Array<{
    konusma: "deKonusma" | "enKonusma";
    genel: "deGenel" | "enGenel";
    ad: string;
    ev: "deEv" | "enEv";
  }> = [
    { konusma: "deKonusma", genel: "deGenel", ad: "German", ev: "deEv" },
    { konusma: "enKonusma", genel: "enGenel", ad: "English", ev: "enEv" },
  ];
  for (const d of diller) {
    const cur = langComposite(lang[d.konusma], lang[d.genel]);
    const curEv = lang[d.ev];
    const cap = evidenceCap(curEv, 10);
    if (cur > cap) {
      const tier = minTierFor(cur, 10);
      const mod: LangState = { ...lang, [d.ev]: tier };
      const r = computeAll(skills, artifacts, mod, career, practice, opts).R;
      push({
        id: `lev-${d.konusma}`,
        baslik: `${d.ad}: document level (test / certificate)`,
        detay: `Claim ${round1(cur)} · evidence cap ${round1(cap)}`,
        deltaR: r - base,
        saat: MODEL.roi.saatKanit[tier === "public" ? "public" : "kayit"],
        gate: blocking.has(d.konusma),
      });
    }
    const kCur = lang[d.konusma];
    if (kCur < 10) {
      const hedef = kCur + 1;
      const mod: LangState = { ...lang, [d.konusma]: hedef };
      const r = computeAll(skills, artifacts, mod, career, practice, opts).R;
      push({
        id: `l-${d.konusma}`,
        baslik: `${d.ad} speaking: ${round1(kCur)} → ${hedef}`,
        detay: `DE = 0.6·speaking + 0.4·general · GLH-based cost`,
        deltaR: r - base,
        saat: langHoursPerPoint(kCur),
        gate: blocking.has("L"),
      });
    }
  }

  for (const c of career) {
    const cap = evidenceCap(c.evidence, c.max);
    if (c.claimed > cap) {
      const tier = minTierFor(c.claimed, c.max);
      const mod = career.map((x) => (x.id === c.id ? { ...x, evidence: tier } : x));
      const r = computeAll(skills, artifacts, lang, mod, practice, opts).R;
      push({
        id: `cev-${c.id}`,
        baslik: `${c.label}: add document / URL`,
        detay: `Claim ${c.claimed}/${c.max} · evidence cap ${round1(cap)}`,
        deltaR: r - base,
        saat: MODEL.roi.saatKanit[tier === "public" ? "public" : "kayit"],
        gate: blocking.has(c.id),
      });
    }
    if (c.claimed < c.max) {
      const hedef = c.claimed + 1;
      const tier = upgradeTier(c.evidence, hedef, c.max);
      const kanitEk = tier !== c.evidence ? MODEL.roi.saatKanit[tier === "public" ? "public" : "kayit"] : 0;
      const mod = career.map((x) => (x.id === c.id ? { ...x, claimed: hedef, evidence: tier } : x));
      const r = computeAll(skills, artifacts, lang, mod, practice, opts).R;
      push({
        id: `c-${c.id}`,
        baslik: `${c.label}: ${c.claimed} → ${hedef}${kanitEk ? " (+ document)" : ""}`,
        detay: `C weight ${MODEL.R.C}`,
        deltaR: r - base,
        saat: c.saatPuan + kanitEk,
        gate: blocking.has(c.id),
      });
    }
  }

  return out.sort((a, b) => b.roiEff - a.roiEff);
}
