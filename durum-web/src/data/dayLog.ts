import type { BugunGorev } from "../useRollingSchedule";
import type { SessionFormData } from "../model";

export const LOG_TAGS = [
  { id: "linux", label: "Linux" },
  { id: "networking", label: "Networking" },
  { id: "windows", label: "Windows / AD" },
  { id: "detection", label: "Detection / SOC" },
  { id: "review", label: "Review" },
  { id: "lab", label: "Lab" },
  { id: "thm", label: "TryHackMe" },
  { id: "htb", label: "Hack The Box" },
  { id: "pwn", label: "pwn.college" },
  { id: "vm", label: "Local VM" },
  { id: "german", label: "German" },
  { id: "mitre", label: "MITRE" },
  { id: "writeup", label: "Write-up" },
] as const;

export const LOG_SOURCES = [
  { id: "mentor", label: "Mentor session" },
  { id: "thm", label: "TryHackMe" },
  { id: "htb", label: "Hack The Box" },
  { id: "pwn", label: "pwn.college" },
  { id: "oak", label: "Oak Academy" },
  { id: "lab-vm", label: "Lab / VM" },
  { id: "docs", label: "Docs" },
] as const;

export const LOG_MODES = [
  { id: "teori", label: "Theory" },
  { id: "lab", label: "Lab" },
  { id: "tekrar", label: "Review" },
  { id: "pratik", label: "Practice" },
  { id: "dil", label: "Language" },
] as const;

export type DayLogEntry = {
  topic: string;
  kind?: string;
  area?: string;
  tags?: string[];
  mode?: string;
  source?: string;
  minutes?: number;
  quality?: number;
  stepsDone?: number[];
  attacker?: string;
  defender?: string;
  summary: string;
  evidence?: string;
};

export type DayLogJson = {
  date?: string;
  entries: DayLogEntry[];
};

const TAG_IDS: Set<string> = new Set(LOG_TAGS.map((t) => t.id));
const SOURCE_IDS: Set<string> = new Set(LOG_SOURCES.map((s) => s.id));
const MODE_IDS: Set<string> = new Set(LOG_MODES.map((m) => m.id));

function normalizeSource(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (s === "chatgpt") return "mentor";
  return SOURCE_IDS.has(s) ? s : "mentor";
}

function kindToAktivite(kind?: string): string {
  if (kind === "tekrar") return "konu-tekrar";
  if (kind === "temel") return "temel-konu";
  if (kind === "lab") return "lab-pratik";
  if (kind === "dil") return "almanca";
  return "yeni-konu";
}

function qualityToKalite(q: number | undefined): number {
  if (q == null || Number.isNaN(q)) return 0.85;
  if (q > 1) return Math.min(1, Math.max(0.3, q / 10));
  return Math.min(1, Math.max(0.3, q));
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter((t) => TAG_IDS.has(t)))];
}

export function suggestedTags(g: BugunGorev): string[] {
  const out = new Set<string>();
  if (g.kind === "tekrar") out.add("review");
  if (g.kind === "lab") out.add("lab");
  if (g.kind === "dil") out.add("german");
  const alan = g.alan ?? "";
  if (alan === "linux") out.add("linux");
  if (alan === "net" || alan === "netsec") out.add("networking");
  if (alan === "win") out.add("windows");
  if (alan === "def" || alan === "siem") out.add("detection");
  if (/linux|bash|kernel/i.test(g.baslik)) out.add("linux");
  if (/antivirus|edr|soc|siem/i.test(g.baslik)) out.add("detection");
  if (/dns|tcp|wireshark|network/i.test(g.baslik)) out.add("networking");
  return [...out];
}

export function buildDayLogTemplate(tasks: BugunGorev[]): DayLogJson {
  const date = new Date().toISOString().slice(0, 10);
  return {
    date,
    entries: tasks.map((g) => ({
      topic: g.baslik,
      kind: g.kind,
      area: g.alan ?? "",
      tags: suggestedTags(g),
      mode: g.kind === "dil" ? "dil" : g.kind === "tekrar" ? "tekrar" : "lab",
      source: "mentor",
      minutes: Math.max(15, Math.round(g.saat * 60)),
      quality: 7,
      stepsDone: g.studyGuide?.steps.map((s) => s.order) ?? [],
      attacker: "",
      defender: "",
      summary: "",
      evidence: "",
    })),
  };
}

export function dayLogChatPrompt(template: DayLogJson): string {
  const tagList = LOG_TAGS.map((t) => t.id).join(", ");
  const sourceList = LOG_SOURCES.map((s) => s.id).join(", ");
  const modeList = LOG_MODES.map((m) => m.id).join(", ");
  return `Fill this SOC Ledger day log as JSON only (no markdown). Keep the same "topic" strings. Delete entries we did not do. Use only these tags: ${tagList}. source must be one of: ${sourceList}. mode must be one of: ${modeList}. quality is 1–10. minutes is a number. summary = what we actually did. attacker/defender = 1–2 sentences each (empty for German). evidence = URL or empty.

${JSON.stringify(template, null, 2)}`;
}

function asEntry(raw: unknown): DayLogEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const topic = String(o.topic ?? o.baslik ?? "").trim();
  const summary = String(o.summary ?? o.not ?? "").trim();
  if (!topic || !summary) return null;
  const source = normalizeSource(String(o.source ?? o.kaynak ?? "mentor"));
  const mode = String(o.mode ?? o.mod ?? "lab");
  return {
    topic,
    kind: o.kind != null ? String(o.kind) : undefined,
    area: o.area != null ? String(o.area) : o.alan != null ? String(o.alan) : undefined,
    tags: normalizeTags(o.tags),
    mode: MODE_IDS.has(mode) ? mode : "lab",
    source,
    minutes: Number(o.minutes ?? o.dakika ?? 30) || 30,
    quality: Number(o.quality ?? o.kalite ?? 7) || 7,
    stepsDone: Array.isArray(o.stepsDone) ? o.stepsDone.map(Number).filter((n) => n > 0) : undefined,
    attacker: o.attacker != null ? String(o.attacker) : undefined,
    defender: o.defender != null ? String(o.defender) : undefined,
    summary,
    evidence: o.evidence != null ? String(o.evidence) : o.kanit != null ? String(o.kanit) : undefined,
  };
}

export function parseDayLogJson(text: string): { ok: true; log: DayLogJson } | { ok: false; error: string } {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: "Not valid JSON. Copy the JSON block from your mentor chat." };
  }
  let entriesRaw: unknown[] = [];
  let date: string | undefined;
  if (Array.isArray(parsed)) {
    entriesRaw = parsed;
  } else if (parsed && typeof parsed === "object") {
    const o = parsed as Record<string, unknown>;
    date = o.date != null ? String(o.date) : undefined;
    if (Array.isArray(o.entries)) entriesRaw = o.entries;
    else return { ok: false, error: "JSON needs an \"entries\" array." };
  } else {
    return { ok: false, error: "JSON must be { entries: [...] }." };
  }
  const entries = entriesRaw.map(asEntry).filter((e): e is DayLogEntry => e != null);
  if (entries.length === 0) return { ok: false, error: "No complete entries (each needs topic + summary)." };
  return { ok: true, log: { date, entries } };
}

function topicKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function matchLogEntry(entry: DayLogEntry, tasks: BugunGorev[]): BugunGorev | undefined {
  const key = topicKey(entry.topic);
  const exact = tasks.find((g) => topicKey(g.baslik) === key);
  if (exact) return exact;
  return tasks.find((g) => topicKey(g.baslik).includes(key) || key.includes(topicKey(g.baslik)));
}

export function entryToForm(entry: DayLogEntry, task?: BugunGorev): SessionFormData {
  const lines = [
    entry.summary,
    entry.attacker?.trim() ? `Attacker: ${entry.attacker.trim()}` : "",
    entry.defender?.trim() ? `Defender: ${entry.defender.trim()}` : "",
    entry.stepsDone?.length ? `Steps: ${entry.stepsDone.join(", ")}` : "",
    entry.tags?.length ? `Tags: ${entry.tags.join(", ")}` : "",
  ].filter(Boolean);
  return {
    aktivite: kindToAktivite(entry.kind ?? task?.kind),
    aktiviteCustom: entry.topic,
    kaynak: entry.source ?? "mentor",
    dakika: Math.max(5, Math.min(300, Math.round(entry.minutes ?? 30))),
    mod: entry.mode ?? "lab",
    alan: entry.area || task?.alan || "net",
    kanit: entry.evidence?.trim() || undefined,
    kalite: qualityToKalite(entry.quality),
    not: lines.join("\n"),
    tags: entry.tags,
    promoteEvidence: true,
  };
}
