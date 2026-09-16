import { OAK_COVERED, type CurriculumTopic } from "./oakCurriculum";

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

/**
 * Network Fundamentals pedagogical order (Oak PDFs 2.1 → 2.14 + Network101-LAB).
 * Includes Critical ports (port alan) after port ranges — not alphabetical.
 */
const NETWORK_SPINE_TITLES: string[] = [
  "OSI model (7 layers)",
  "TCP/IP model and encapsulation",
  "MAC vs IP address",
  "Ethernet frame / CSMA/CD",
  "Collision domain vs broadcast domain",
  "ARP (request/reply, arp -a)",
  "VLAN basics",
  "IPv4 vs IPv6",
  "Subnetting / CIDR / subnet mask",
  "Private vs public IP and NAT",
  "Loopback (127.0.0.0/8) and link-local",
  "Default gateway",
  "DHCP DORA process",
  "ICMP / ping / traceroute",
  "TCP 3-way handshake (SYN/SYN-ACK/ACK)",
  "TCP vs UDP",
  "Port ranges (well-known / registered / dynamic)",
  "Critical ports (22, 53, 80, 443, 3389, 445, 25…)",
  "DNS hierarchy and query flow",
  "DNS records (A, AAAA, CNAME, MX, NS, TXT)",
  "nslookup / dig",
  "HTTP request methods and status codes",
  "HTTP vs HTTPS / SSL-TLS",
  "Email protocols (SMTP / IMAP / POP3)",
  "SSH (22) vs Telnet (23)",
  "RDP (3389)",
  "FTP / SFTP / SMB",
  "SNMP and NTP",
  "Network topologies (star / bus / ring / mesh)",
  "Switch / Router / Access Point / Hub",
  "Load balancer (L4 vs L7)",
  "Proxy server",
  "DMZ architecture",
  "NAC (Network Access Control)",
  "Packet analysis with Wireshark",
  "tcpdump basics",
  "Port/connection analysis with netstat",
];

/**
 * Server Management pedagogical order (Oak Linux → Windows Server → AD/GPO).
 * Catalog file stays domain-grouped; this list is within-module spine order only.
 */
const SERVER_SPINE_TITLES: string[] = [
  "Linux kernel / distro / shell (bash)",
  "Linux basic commands (navigation / files)",
  "/etc/passwd and /etc/shadow",
  "User/group management (adduser, usermod, deluser)",
  "sudo / su / whoami",
  "File permissions (rwx) and chmod",
  "chown and least privilege",
  "Linux filesystem hierarchy (/bin /etc /var /home…)",
  "ifconfig / ip addr",
  "Linux processes (ps, top, pstree, kill)",
  "Linux service management (systemctl / service)",
  "Disk/memory monitoring (df, du, /proc)",
  "tar / gzip archiving",
  "APT / DPKG package management",
  "Remote Linux access via SSH",
  "Windows Server / Client–Server basics",
  "Server Manager (roles / features)",
  "Windows processes / Task Manager / PID",
  "Windows Services (services.msc, startup types)",
  "Computer Management / local users and groups",
  "net user / net localgroup",
  "RDP configuration and security",
  "Windows DHCP / DNS / IIS roles",
  "IIS security (directory browsing, auth)",
  "PowerShell cmdlet basics",
  "SMB shares and NTFS permissions",
  "Windows Defender Firewall (inbound/outbound)",
  "Registry (HKLM/HKCU, Run keys)",
  "Task Scheduler (persistence awareness)",
  "Disk Management / NTFS vs FAT32",
  "Active Directory: Domain / DC / OU",
  "AD user and group management",
  "LDAP and Kerberos (AD context)",
  "NTDS.dit / SAM / NTLM awareness",
  "GPO basics (Default Domain Policy)",
  "GPO password and account lockout policy",
  "gpupdate /force",
];

/** Intro To Security module atoms — Oak 4.01 → 4.07 order. */
const INTRO_SEC_TITLES: string[] = [
  "Intro To Security",
  "CIA triad",
  "Defense in Depth (prevent/detect/respond/block)",
  "Threat / Vulnerability / Risk / Exploit",
  "Zero-Day and CVE",
  "Blue / Red / Purple Team",
  "Cyber Kill Chain (7 stages)",
  "APT (Advanced Persistent Threat)",
  "MITRE ATT&CK awareness",
  "Zero Trust and least privilege",
  "IAM / IAAA (Identification–Authentication–Authorization–Accountability)",
  "MFA factors (know / have / are)",
  "SSO (SAML / OAuth / Kerberos)",
  "Malware types (virus, worm, trojan, ransomware, spyware, rootkit, adware)",
  "Hacker types (white / black / grey)",
  "Social engineering and phishing",
  "Attack surface",
  "Pentest steps (recon → exploit → report)",
];

const IT_FUND_SET = new Set(IT_FUND_TITLES.map((t) => t.toLowerCase()));
const IT_FUND_ORDER = new Map(IT_FUND_TITLES.map((t, i) => [t.toLowerCase(), i]));
const NETWORK_ORDER = new Map(NETWORK_SPINE_TITLES.map((t, i) => [t.toLowerCase(), i]));
const SERVER_ORDER = new Map(SERVER_SPINE_TITLES.map((t, i) => [t.toLowerCase(), i]));
const INTRO_SEC_ORDER = new Map(INTRO_SEC_TITLES.map((t, i) => [t.toLowerCase(), i]));

/** Fallback: stable catalog line order from tekrar-ekle (does not change topic IDs). */
const CATALOG_ORDER = new Map(OAK_COVERED.map((t, i) => [t.konu.trim().toLowerCase(), i]));

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

/** Stable within-module order: explicit Oak lists, else catalog line order (not A–Z). */
function withinModuleOrder(t: CurriculumTopic): number {
  const key = t.konu.trim().toLowerCase();
  const it = IT_FUND_ORDER.get(key);
  if (it != null) return it;
  const net = NETWORK_ORDER.get(key);
  if (net != null) return net;
  const server = SERVER_ORDER.get(key);
  if (server != null) return server;
  const intro = INTRO_SEC_ORDER.get(key);
  if (intro != null) return intro;
  if (t.alan === "off") {
    if (/nmap/i.test(t.konu)) return 0;
    if (/nessus/i.test(t.konu)) return 1;
    return 10;
  }
  return CATALOG_ORDER.get(key) ?? 10_000;
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
