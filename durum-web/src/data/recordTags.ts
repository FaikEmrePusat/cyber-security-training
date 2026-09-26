/**
 * Record / day-log tag catalog for Cyber Ledger.
 * Derived from ALAN_LABEL (areas), OAK_SPINE_MODULES (modules),
 * study-guide resource types (platforms), and session activities.
 * Tag ids are stable for localStorage history — do not rename lightly.
 */

import type { BugunGorev } from "../useRollingSchedule";
import { ALAN_LABEL, OAK_BY_ID, OAK_COVERED } from "./oakCurriculum";
import { OAK_SPINE_MODULES, spineModuleIndex } from "./oakSpineOrder";

export type RecordTagGroupId = "area" | "module" | "activity" | "platform";

export type RecordTag = {
  id: string;
  label: string;
  group: RecordTagGroupId;
};

export const RECORD_TAG_GROUPS: ReadonlyArray<{ id: RecordTagGroupId; label: string }> = [
  { id: "area", label: "Area" },
  { id: "module", label: "Module" },
  { id: "activity", label: "Activity" },
  { id: "platform", label: "Platform" },
];

/** Area tags — ids align with legacy LOG_TAGS where possible; labels match ALAN_LABEL. */
const AREA_TAGS: RecordTag[] = [
  { id: "networking", label: ALAN_LABEL.net, group: "area" },
  { id: "linux", label: ALAN_LABEL.linux, group: "area" },
  { id: "windows", label: ALAN_LABEL.win, group: "area" },
  { id: "secfund", label: ALAN_LABEL.secfund, group: "area" },
  { id: "crypto", label: ALAN_LABEL.crypto, group: "area" },
  { id: "netsec", label: ALAN_LABEL.netsec, group: "area" },
  { id: "detection", label: ALAN_LABEL.def, group: "area" },
  { id: "techniques", label: ALAN_LABEL.off, group: "area" },
  { id: "cloud", label: ALAN_LABEL.cloud, group: "area" },
  { id: "portfolio", label: ALAN_LABEL.port, group: "area" },
  { id: "siem", label: ALAN_LABEL.siem, group: "area" },
  { id: "python", label: ALAN_LABEL.py, group: "area" },
];

/** Oak Academy module spine — pedagogical tour order. */
const MODULE_TAGS: RecordTag[] = OAK_SPINE_MODULES.map((m) => ({
  id: `mod-${m.id}`,
  label: m.label,
  group: "module" as const,
}));

const ACTIVITY_TAGS: RecordTag[] = [
  { id: "review", label: "Review", group: "activity" },
  { id: "lab", label: "Lab", group: "activity" },
  { id: "practice", label: "Practice", group: "activity" },
  { id: "theory", label: "Theory", group: "activity" },
  { id: "writeup", label: "Write-up", group: "activity" },
  { id: "german", label: "German", group: "activity" },
  { id: "dual-lens", label: "Dual lens", group: "activity" },
  { id: "explain-back", label: "Explain-back", group: "activity" },
];

/** Platforms / resources seen in study guides (THM, Oak, docs, lab, MITRE, …). */
const PLATFORM_TAGS: RecordTag[] = [
  { id: "oak", label: "Oak Academy", group: "platform" },
  { id: "thm", label: "TryHackMe", group: "platform" },
  { id: "htb", label: "Hack The Box", group: "platform" },
  { id: "pwn", label: "pwn.college", group: "platform" },
  { id: "vm", label: "Local VM", group: "platform" },
  { id: "mitre", label: "MITRE ATT&CK", group: "platform" },
  { id: "docs", label: "Docs", group: "platform" },
  { id: "video", label: "Video", group: "platform" },
  { id: "tool", label: "Tooling", group: "platform" },
  { id: "nessus", label: "Nessus", group: "platform" },
];

export const RECORD_TAGS: readonly RecordTag[] = [
  ...AREA_TAGS,
  ...MODULE_TAGS,
  ...ACTIVITY_TAGS,
  ...PLATFORM_TAGS,
];

/** Flat list for prompts / chips that only need id + label (legacy LOG_TAGS shape). */
export const LOG_TAGS: ReadonlyArray<{ id: string; label: string }> = RECORD_TAGS.map((t) => ({
  id: t.id,
  label: t.label,
}));

export const RECORD_TAG_IDS: ReadonlySet<string> = new Set(RECORD_TAGS.map((t) => t.id));

const TAG_BY_ID: Map<string, RecordTag> = new Map(RECORD_TAGS.map((t) => [t.id, t]));

/** Map curriculum `alan` keys → area tag ids. */
const ALAN_TO_AREA_TAG: Record<string, string> = {
  net: "networking",
  linux: "linux",
  win: "windows",
  secfund: "secfund",
  crypto: "crypto",
  netsec: "netsec",
  def: "detection",
  off: "techniques",
  cloud: "cloud",
  port: "portfolio",
  siem: "siem",
  py: "python",
};

/** Aliases so older mentor JSON / typos still normalize into catalog ids. */
const TAG_ALIASES: Record<string, string> = {
  "windows / ad": "windows",
  "windows/ad": "windows",
  win: "windows",
  net: "networking",
  network: "networking",
  "detection / soc": "detection",
  detection_soc: "detection",
  soc: "detection",
  def: "detection",
  off: "techniques",
  "techniques & detection": "techniques",
  "security fundamentals": "secfund",
  "network security": "netsec",
  py: "python",
  port: "portfolio",
  ports: "portfolio",
  "tryhackme": "thm",
  "hack the box": "htb",
  "pwn.college": "pwn",
  "local vm": "vm",
  "oak academy": "oak",
  "mitre att&ck": "mitre",
  write_up: "writeup",
  "write-up": "writeup",
};

const TOPIC_BY_TITLE = new Map(OAK_COVERED.map((t) => [t.konu.trim().toLowerCase(), t]));

function moduleTagIdForIndex(idx: number): string | undefined {
  const mod = OAK_SPINE_MODULES[idx];
  return mod ? `mod-${mod.id}` : undefined;
}

export function resolveTagId(raw: string): string | null {
  const s = String(raw).trim().toLowerCase();
  if (!s) return null;
  if (RECORD_TAG_IDS.has(s)) return s;
  const aliased = TAG_ALIASES[s];
  if (aliased && RECORD_TAG_IDS.has(aliased)) return aliased;
  return null;
}

/**
 * Normalize tag arrays from mentor JSON / forms.
 * Keeps only catalog ids (after alias); drops unknowns so prompts stay coherent.
 * Old logs already used catalog ids — they stay valid.
 */
export function normalizeRecordTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  const out: string[] = [];
  for (const t of tags) {
    const id = resolveTagId(String(t));
    if (id && !out.includes(id)) out.push(id);
  }
  return out;
}

export function tagLabel(id: string): string {
  return TAG_BY_ID.get(id)?.label ?? id;
}

export function formatTagLabels(ids: string[]): string {
  return ids.map(tagLabel).join(" · ");
}

export function tagsInGroup(group: RecordTagGroupId): RecordTag[] {
  return RECORD_TAGS.filter((t) => t.group === group);
}

export function tagsByGroup(): Array<{ group: (typeof RECORD_TAG_GROUPS)[number]; tags: RecordTag[] }> {
  return RECORD_TAG_GROUPS.map((group) => ({
    group,
    tags: tagsInGroup(group.id),
  }));
}

/** Suggest useful defaults from today’s task (area + Oak module + activity). */
export function suggestedRecordTags(g: BugunGorev): string[] {
  const out = new Set<string>();

  if (g.kind === "tekrar") out.add("review");
  if (g.kind === "lab") out.add("lab");
  if (g.kind === "dil") out.add("german");
  if (g.kind === "temel" || g.kind === "konu") out.add("theory");

  const alan = g.alan ?? "";
  const areaTag = ALAN_TO_AREA_TAG[alan];
  if (areaTag) out.add(areaTag);

  if (/linux|bash|kernel/i.test(g.baslik)) out.add("linux");
  if (/antivirus|edr|soc|siem|triage/i.test(g.baslik)) out.add("detection");
  if (/dns|tcp|wireshark|network|subnet|osi/i.test(g.baslik)) out.add("networking");
  if (/mitre|att&ck|attack/i.test(g.baslik)) out.add("mitre");
  if (/nmap|nessus|exploit|scan/i.test(g.baslik)) {
    out.add("techniques");
    if (/nessus/i.test(g.baslik)) out.add("nessus");
  }
  if (/firewall|fortigate|waf|vpn/i.test(g.baslik)) out.add("netsec");
  if (/encrypt|hash|tls|pki|crypto/i.test(g.baslik)) out.add("crypto");

  const topic =
    (g.topicId && OAK_BY_ID[g.topicId]) || TOPIC_BY_TITLE.get(g.baslik.trim().toLowerCase());
  if (topic) {
    const modId = moduleTagIdForIndex(spineModuleIndex(topic));
    if (modId) out.add(modId);
    out.add("oak");
  } else if (areaTag && g.kind !== "dil") {
    // Soft module hints from alan when title is not in covered catalog
    const soft: Record<string, string> = {
      networking: "mod-net",
      linux: "mod-server",
      windows: "mod-server",
      secfund: "mod-intro-sec",
      crypto: "mod-crypto",
      netsec: "mod-firewall",
      detection: "mod-edr",
      techniques: "mod-scan",
      cloud: "mod-it-fund",
    };
    if (soft[areaTag]) out.add(soft[areaTag]);
  }

  if (g.studyGuide?.resources.some((r) => r.type === "thm")) out.add("thm");
  if (g.studyGuide?.resources.some((r) => r.type === "htb")) out.add("htb");
  if (g.studyGuide?.resources.some((r) => r.type === "lab")) out.add("lab");
  if (g.studyGuide?.resources.some((r) => r.type === "oak")) out.add("oak");
  if (g.studyGuide?.resources.some((r) => /mitre/i.test(r.label) || /mitre/i.test(r.url))) {
    out.add("mitre");
  }

  return [...out].filter((id) => RECORD_TAG_IDS.has(id));
}
