import type { Difficulty } from "../model";
import coveredRaw from "./tekrar-ekle.txt?raw";
import upcomingRaw from "./tekrar-sonra.txt?raw";

/** Oak curriculum status. `sonra` = not yet covered; locked from FSRS (override required). */
export type CurriculumStatus =
  | "ogrenilmedi"
  | "ogreniyorum"
  | "kuyrukta"
  | "pekiştirildi"
  | "sonra";

export type CurriculumTopic = {
  id: string;
  alan: string;
  zorluk: Difficulty;
  konu: string;
  tags: string[];
  /** Linked topic ids (Obsidian-style edges). */
  links: string[];
  /** true = post-Oak EDR; no note. */
  upcoming: boolean;
};

export const CURRICULUM_STORAGE_KEY = "durum-curriculum-v1";

/** Foundation channel independent of weak area in daily plan — baseline for the SOC path. */
export const FOUNDATION_ALANS = ["net", "linux", "secfund"] as const;

export const ALAN_ORDER = [
  "net",
  "linux",
  "win",
  "secfund",
  "crypto",
  "netsec",
  "def",
  "off",
  "cloud",
  "port",
  "siem",
  "py",
] as const;

export const ALAN_LABEL: Record<string, string> = {
  net: "Networking",
  linux: "Linux",
  win: "Windows/AD",
  secfund: "Security Fundamentals",
  crypto: "Crypto",
  netsec: "Network Security",
  def: "Defensive/SOC",
  off: "Offensive (purple-team)",
  cloud: "Cloud",
  port: "Portfolio",
  siem: "SIEM",
  py: "Python",
};

/** Map node colors — maritime slate/forest. */
export const ALAN_COLOR: Record<string, string> = {
  net: "#1a6b5c",
  linux: "#3d5a80",
  win: "#8a5a2b",
  secfund: "#2d6a4f",
  crypto: "#4a5c68",
  netsec: "#1e5a7a",
  def: "#0f4a3f",
  off: "#8b3a3a",
  cloud: "#4a6a7a",
  port: "#6a7d8a",
  siem: "#2a5a4a",
  py: "#3a5a6a",
};

export const STATUS_LABEL: Record<CurriculumStatus, string> = {
  ogrenilmedi: "Not started",
  ogreniyorum: "Learning",
  kuyrukta: "In queue",
  pekiştirildi: "Reinforced",
  sonra: "Later",
};

export const DIFF_LABEL: Record<Difficulty, string> = {
  kolay: "Easy",
  orta: "Medium",
  zor: "Hard",
};

const DIFFS: Difficulty[] = ["kolay", "orta", "zor"];

const PAIR_RULES: [string, string][] = [
  ["dns", "dhcp"],
  ["dns", "http"],
  ["tls", "https"],
  ["tls", "pki"],
  ["ssl", "tls"],
  ["firewall", "vpn"],
  ["firewall", "nat"],
  ["ids", "ips"],
  ["waf", "owasp"],
  ["vpn", "ipsec"],
  ["active directory", "gpo"],
  ["active directory", "ldap"],
  ["kerberos", "ldap"],
  ["kerberos", "ntlm"],
  ["edr", "antivirus"],
  ["edr", "soc"],
  ["hash", "parola"],
  ["hash", "bcrypt"],
  ["osi", "tcp/ip"],
  ["tcp", "udp"],
  ["vlan", "dmz"],
  ["wireshark", "tcpdump"],
  ["ssh", "telnet"],
  ["smb", "ntfs"],
  ["iam", "mfa"],
  ["iam", "sso"],
  ["kill chain", "apt"],
  ["kill chain", "mitre"],
  ["ransomware", "malware"],
  ["fortigate", "firewall"],
  ["nat", "vip"],
  ["chmod", "chown"],
  ["passwd", "shadow"],
  ["gpo", "parola"],
];

const STOP = new Set([
  "ile",
  "ve",
  "vs",
  "veya",
  "temelleri",
  "temel",
  "türleri",
  "süreci",
  "yapısı",
  "kavramı",
  "farkındalığı",
  "süreç",
  "modeli",
  "project",
]);

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9çğıöşüâîû+/\s.-]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, 48);
}

function parseLines(raw: string, upcoming: boolean, idOffset: number): CurriculumTopic[] {
  const out: CurriculumTopic[] = [];
  let i = 0;
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("|").map((p) => p.trim());
    if (parts.length < 3) continue;
    const [alan, diffRaw, ...rest] = parts;
    const konu = rest.join("|");
    if (!alan || !konu) continue;
    const zorluk = DIFFS.includes(diffRaw as Difficulty) ? (diffRaw as Difficulty) : "orta";
    i += 1;
    const n = idOffset + i;
    const prefix = upcoming ? "oak-sonra" : "oak";
    out.push({
      id: `${prefix}-${alan}-${String(n).padStart(3, "0")}-${slug(konu)}`,
      alan,
      zorluk,
      konu,
      tags: upcoming ? ["sonra"] : [],
      links: [],
      upcoming,
    });
  }
  return out;
}

function hasKw(topic: CurriculumTopic, kw: string): boolean {
  return topic.konu.toLowerCase().includes(kw.toLowerCase());
}

function attachLinks(topics: CurriculumTopic[]): void {
  const edgeSet = new Set<string>();
  const addEdge = (a: string, b: string) => {
    if (a === b) return;
    const [x, y] = a < b ? [a, b] : [b, a];
    edgeSet.add(`${x}|${y}`);
  };

  for (const [ka, kb] of PAIR_RULES) {
    const A = topics.filter((t) => hasKw(t, ka));
    const B = topics.filter((t) => hasKw(t, kb));
    for (const a of A) for (const b of B) addEdge(a.id, b.id);
  }

  const byAlan = new Map<string, CurriculumTopic[]>();
  for (const t of topics) {
    const g = byAlan.get(t.alan) ?? [];
    g.push(t);
    byAlan.set(t.alan, g);
  }

  for (const group of byAlan.values()) {
    const tokens = group.map((t) => ({
      t,
      toks: new Set(
        t.konu
          .toLowerCase()
          .split(/[^a-z0-9çğıöşü+]+/i)
          .filter((w) => w.length >= 4 && !STOP.has(w)),
      ),
    }));
    const deg: Record<string, number> = Object.fromEntries(group.map((t) => [t.id, 0]));
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        let share = 0;
        for (const w of tokens[i].toks) if (tokens[j].toks.has(w)) share++;
        if (share >= 1 && deg[tokens[i].t.id] < 2 && deg[tokens[j].t.id] < 2) {
          addEdge(tokens[i].t.id, tokens[j].t.id);
          deg[tokens[i].t.id]++;
          deg[tokens[j].t.id]++;
        }
      }
    }
  }

  const adj = new Map<string, string[]>();
  for (const t of topics) adj.set(t.id, []);
  for (const key of edgeSet) {
    const [a, b] = key.split("|");
    adj.get(a)!.push(b);
    adj.get(b)!.push(a);
  }
  for (const t of topics) {
    t.links = (adj.get(t.id) ?? []).sort();
  }
}

const covered = parseLines(coveredRaw, false, 0);
const upcoming = parseLines(upcomingRaw, true, 900);
const all = [...covered, ...upcoming];
attachLinks(all);

export const OAK_CURRICULUM: CurriculumTopic[] = all;
export const OAK_COVERED: CurriculumTopic[] = covered;
export const OAK_UPCOMING: CurriculumTopic[] = upcoming;

export const OAK_BY_ID: Record<string, CurriculumTopic> = Object.fromEntries(
  OAK_CURRICULUM.map((t) => [t.id, t]),
);

export function topicsByAlan(alan?: string, opts?: { includeUpcoming?: boolean }): CurriculumTopic[] {
  const includeUpcoming = opts?.includeUpcoming ?? true;
  let list = includeUpcoming ? OAK_CURRICULUM : OAK_COVERED;
  if (alan && alan !== "all") list = list.filter((t) => t.alan === alan);
  return list;
}

export function alanCounts(opts?: { includeUpcoming?: boolean }): { alan: string; count: number }[] {
  const list = opts?.includeUpcoming === false ? OAK_COVERED : OAK_CURRICULUM;
  const m = new Map<string, number>();
  for (const t of list) m.set(t.alan, (m.get(t.alan) ?? 0) + 1);
  return ALAN_ORDER.filter((a) => m.has(a)).map((alan) => ({ alan, count: m.get(alan)! }));
}

export type CurriculumEdge = { a: string; b: string };

export function curriculumEdges(ids?: Set<string>): CurriculumEdge[] {
  const seen = new Set<string>();
  const out: CurriculumEdge[] = [];
  for (const t of OAK_CURRICULUM) {
    if (ids && !ids.has(t.id)) continue;
    for (const other of t.links) {
      if (ids && !ids.has(other)) continue;
      const [x, y] = t.id < other ? [t.id, other] : [other, t.id];
      const key = `${x}|${y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ a: x, b: y });
    }
  }
  return out;
}

/** Queue mapping: topic text (case-insensitive). */
export function topicKey(konu: string): string {
  return konu.trim().toLowerCase();
}
