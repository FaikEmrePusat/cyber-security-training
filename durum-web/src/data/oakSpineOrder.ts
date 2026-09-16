import type { CurriculumTopic } from "./oakCurriculum";

/**
 * Oak Academy pedagogical module order for the daily foundation spine.
 * Catalog file `tekrar-ekle.txt` stays domain-grouped (stable topic IDs);
 * this rank list is what Today walks — not raw file order.
 */
export const OAK_SPINE_MODULES = [
  { id: "it-fund", label: "IT Fundamentals" },
  { id: "net", label: "Network Fundamentals" },
  { id: "server", label: "Server Management" },
  { id: "intro-sec", label: "Intro To Security" },
  { id: "crypto", label: "Cryptography" },
  { id: "firewall", label: "Firewall" },
  { id: "edr", label: "EDR" },
  { id: "scan", label: "Scanning & awareness" },
] as const;

export type OakSpineModuleId = (typeof OAK_SPINE_MODULES)[number]["id"];

/** Explicit IT Fundamentals titles (course module 1) — matched before generic secfund. */
const IT_FUND_TITLES: string[] = [
  "Introduction to cybersecurity (field overview)",
  "Computer hardware components (CPU / RAM / motherboard / bus)",
  "Storage devices (HDD / SSD / NVMe) and media types",
  "Processing devices and CPU role",
  "IoT and mobile device basics / risks",
  "Network components (NIC / cabling / media)",
  "Operating system role (kernel / user space / OS types)",
  "Application vs service vs process vs interface",
  "CLI vs GUI; root (#) vs user ($)",
  "Virtualization: Hypervisor Type 1 vs Type 2",
  "VM vs container (Docker)",
  "Cloud computing basics",
  "Cloud storage risks (privacy / ownership)",
];

const IT_FUND_SET = new Set(IT_FUND_TITLES.map((t) => t.toLowerCase()));

function isNmapOrNessus(konu: string): boolean {
  return /nmap|nessus/i.test(konu);
}

/** Module index 0…n-1; unknown topics sort last within a high bucket. */
export function spineModuleIndex(t: CurriculumTopic): number {
  const title = t.konu.trim().toLowerCase();
  if (IT_FUND_SET.has(title) || t.alan === "cloud") return 0;
  if (t.alan === "net" || t.alan === "port") return 1;
  if (t.alan === "linux" || t.alan === "win") return 2;
  if (t.alan === "secfund") return 3;
  if (t.alan === "crypto") return 4;
  if (t.alan === "netsec") return 5;
  if (t.alan === "def") return 6;
  if (t.alan === "off") return isNmapOrNessus(t.konu) ? 7 : 7;
  if (t.alan === "siem" || t.alan === "py") return 8;
  return 9;
}

export function spineModuleLabel(t: CurriculumTopic): string {
  const idx = spineModuleIndex(t);
  return OAK_SPINE_MODULES[idx]?.label ?? "Curriculum";
}

/** Stable within-module order: IT Fund explicit list, else catalog title. */
function withinModuleOrder(t: CurriculumTopic): number {
  const idx = IT_FUND_TITLES.findIndex((x) => x.toLowerCase() === t.konu.trim().toLowerCase());
  if (idx >= 0) return idx;
  // Nmap before Nessus before other off
  if (t.alan === "off") {
    if (/nmap/i.test(t.konu)) return 0;
    if (/nessus/i.test(t.konu)) return 1;
    return 10;
  }
  return 1000;
}

/** Sort covered topics into Oak course spine order (does not change topic IDs). */
export function sortByOakSpineOrder(topics: CurriculumTopic[]): CurriculumTopic[] {
  return [...topics].sort((a, b) => {
    const ma = spineModuleIndex(a);
    const mb = spineModuleIndex(b);
    if (ma !== mb) return ma - mb;
    const wa = withinModuleOrder(a);
    const wb = withinModuleOrder(b);
    if (wa !== wb) return wa - wb;
    return a.konu.localeCompare(b.konu);
  });
}
