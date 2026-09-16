import { ALAN_LABEL } from "./oakCurriculum";
import { GERMAN_B2_PLAN, GERMAN_LEARNING_SCIENCE } from "./germanPlan";
import { PORTFOLIO_PROJECTS, projectForGate } from "./portfolioProjects";
import type {
  StudyGuide,
  StudyGuideGateContext,
  StudyGuideTaskKind,
  StudyPlanStep,
  StudyResource,
} from "./studyPlans";

export type GuideBuilder = (ctx: {
  konu: string;
  alan: string;
  kind: StudyGuideTaskKind;
  detay?: string;
  roiId?: string;
}) => StudyGuide;

const OAK_SEARCH = "https://www.google.com/search?q=site%3Aoakademy.com+";

function oakResource(konu: string): StudyResource {
  return { label: "Oak Academy — search curriculum", url: `${OAK_SEARCH}${encodeURIComponent(konu)}`, type: "oak" };
}

/** Prefer naming the real Oak Study Notes PDF (local folder path in the label). */
function oakNotes(pdfFile: string, folder = "IT Fundamentals"): StudyResource {
  const stem = pdfFile.replace(/\.pdf$/i, "");
  return {
    label: `Oak Study Notes — ${folder}/${pdfFile}`,
    url: `${OAK_SEARCH}${encodeURIComponent(stem)}`,
    type: "oak",
  };
}

/**
 * ~40–45 min understanding tour: PDF concept → explain-back (attack + defense) → quick check → log.
 * Always keep a light dual lens — even on fundamentals (not a pentest drill).
 */
function foundationTourSteps(
  pdfFocus: string,
  explainBack: string,
  dualLens: string,
): Omit<StudyPlanStep, "order">[] {
  return [
    {
      action: `Concept — skim Oak PDF (${pdfFocus}); list 5 terms you must recall`,
      durationMin: 15,
      logHint: "5 terms from the PDF",
    },
    {
      action: `Explain-back while doing: ${explainBack}. Dual lens — ${dualLens}`,
      durationMin: 15,
      logHint: "Attacker angle + defender angle (2–3 sentences)",
    },
    {
      action: "Quick check — sketch or table from memory; reopen PDF only to close gaps",
      durationMin: 10,
      logHint: "1 gap closed",
    },
    {
      action: "Log session — PDF terms + attacker/defender one-liners",
      durationMin: 5,
      logHint: "Note title or screenshot path",
    },
  ];
}

function thm(slug: string, label: string): StudyResource {
  return { label, url: `https://tryhackme.com/room/${slug}`, type: "thm" };
}

function thmPath(path: string, label: string): StudyResource {
  return { label, url: `https://tryhackme.com/path/outline/${path}`, type: "thm" };
}

function doc(url: string, label: string): StudyResource {
  return { label, url, type: "doc" };
}

function lab(url: string, label: string): StudyResource {
  return { label, url, type: "lab" };
}

function tool(url: string, label: string): StudyResource {
  return { label, url, type: "tool" };
}

function steps(...items: Omit<StudyPlanStep, "order">[]): StudyPlanStep[] {
  return items.map((s, i) => ({ ...s, order: i + 1 }));
}

function mkGuide(
  konu: string,
  resources: StudyResource[],
  actions: string[],
  stepItems: Omit<StudyPlanStep, "order">[],
): StudyGuide {
  return { topic: konu, resources, actions, steps: steps(...stepItems) };
}

const SOC_L1 = thmPath("soclevel1", "TryHackMe — SOC Level 1 path");
const PRE_SEC = thmPath("presecurity", "TryHackMe — Pre-Security path");
const JR_PENTEST = thmPath("jrpenetrationtester", "TryHackMe — Jr Penetration Tester path");
const HTB_START = lab("https://app.hackthebox.com/tracks", "Hack The Box — Starting Point tracks");
const LETS_DEFEND = lab("https://letsdefend.io/", "LetsDefend — free SOC alert triage");
const CYBER_DEF = lab("https://cyberdefenders.org/blueteam-ctf-challenges/", "CyberDefenders — blue team challenges");
const MITRE = doc("https://attack.mitre.org/", "MITRE ATT&CK framework");
const SIGMA = doc("https://github.com/SigmaHQ/sigma", "Sigma HQ — detection rules");

function integratedStudySteps(konu: string, labMin = 25): Omit<StudyPlanStep, "order">[] {
  return [
    {
      action: `Concept — both sides: how "${konu}" works (attacker view) and why defenders monitor it`,
      durationMin: 15,
      logHint: "Attacker goal + defender goal (2 bullets each)",
    },
    {
      action: "Technique — hands-on in authorized lab (room, command, or simulation)",
      durationMin: labMin,
      logHint: "Technique observed or command used",
    },
    {
      action: "Detection — logs, alerts, Event IDs, controls, or mitigations for the same activity",
      durationMin: 15,
      logHint: "Log source + detection or mitigation idea",
    },
    {
      action: "Map to MITRE ATT&CK; write 3 recall questions linking attack and defense",
      durationMin: 10,
      logHint: "Technique ID + hardest question",
    },
    { action: "Log session — evidence from both technique and detection work", durationMin: 5, logHint: "Dual-perspective evidence" },
  ];
}

function integratedSecurityGuide(konu: string, labMin = 30): StudyGuide {
  return mkGuide(
    konu,
    [
      SOC_L1,
      LETS_DEFEND,
      CYBER_DEF,
      JR_PENTEST,
      PRE_SEC,
      MITRE,
      thm("nmap", "TryHackMe — Nmap"),
      thm("owasptop10", "TryHackMe — OWASP Top 10"),
      HTB_START,
      oakResource(konu),
    ],
    [
      `Study "${konu}" as one story: technique → telemetry → detection → response`,
      "Never stop at attack-only or reading-only — pair each action with defender visibility",
      "Authorized labs only (THM, HTB, local VM)",
      "Log MITRE technique ID and at least one detection idea",
    ],
    integratedStudySteps(konu, labMin),
  );
}

/** @deprecated Use integratedStudySteps — kept as alias for gradual migration */
function standardStudySteps(konu: string, labMin = 25): Omit<StudyPlanStep, "order">[] {
  return integratedStudySteps(konu, labMin);
}

/** Specific topic patterns — ordered most-specific first. */
export const TOPIC_GUIDES: Array<{ test: RegExp; build: GuideBuilder }> = [
  // --- IT Fundamentals spine (Oak module 1 PDFs) — before broad linux/risk/cloud patterns ---
  {
    test: /introduction to cybersecurity|field overview/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("0.2 - Introduction to Cybersecurity.pdf"),
          oakNotes("Siber Güvenlik Kariyer Eğitim Programı.pdf"),
          doc("https://csrc.nist.gov/glossary", "NIST — cybersecurity glossary"),
          doc("https://www.nist.gov/cyberframework", "NIST Cybersecurity Framework (overview)"),
        ],
        [
          "Define cyberspace, cybersecurity scope, and why the field exists (from Oak 0.2)",
          "List 3 career/role families and which one you are aiming at",
          "Write one SOC-relevant example of confidentiality, integrity, or availability (preview only)",
        ],
        foundationTourSteps(
          "0.2 terminology / scope / principles",
          "what cybersecurity protects and what it does not",
          "attacker: harm assets in cyberspace / defender: how a junior SOC uses these terms in a ticket",
        ),
      ),
  },
  {
    test: /computer hardware components|cpu\s*\/\s*ram\s*\/\s*motherboard|motherboard\s*\/\s*bus/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.1 - Computer Components.pdf"),
          oakNotes("Bilgisayar Biliminin Temelleri - I.pdf"),
          doc("https://csrc.nist.gov/glossary/term/central_processing_unit", "NIST glossary — CPU"),
        ],
        [
          "Map input → process → output using Oak 1.1 + Temelleri I",
          "Name CPU, RAM, motherboard, bus roles in one sentence each",
          "Note one hardware-adjacent security idea (e.g. keylogger on input path)",
        ],
        foundationTourSteps(
          "1.1 computer components + Temelleri I",
          "how the major hardware pieces cooperate",
          "where malware or physical access could interfere with the I/O loop",
        ),
      ),
  },
  {
    test: /storage devices|hdd\s*\/\s*ssd|nvme|media types/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.2 - Storage Devices.pdf"),
          oakNotes("Bilgisayar Biliminin Temelleri - I.pdf"),
          doc("https://csrc.nist.gov/glossary/term/storage", "NIST glossary — storage"),
        ],
        [
          "Compare primary vs secondary memory and HDD vs SSD vs NVMe",
          "Explain RAM vs disk in one analogy from the PDF",
          "Note forensic/SOC angle: volatile vs persistent evidence",
        ],
        foundationTourSteps(
          "1.2 storage devices / memory types",
          "when data lives in RAM vs on disk and why it matters",
          "volatile vs persistent evidence after an alert",
        ),
      ),
  },
  {
    test: /processing devices|cpu role/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.3 - Processing Devices.pdf"),
          oakNotes("Bilgisayar Biliminin Temelleri - I.pdf"),
          doc("https://csrc.nist.gov/glossary/term/central_processing_unit", "NIST glossary — CPU"),
        ],
        [
          "Distinguish CPU vs GPU vs motherboard roles from Oak 1.3",
          "Explain why CPU is the 'brain' in one plain sentence",
          "Note one abuse/load idea (crypto-mining / DoS overload) for SOC awareness",
        ],
        foundationTourSteps(
          "1.3 processing devices (CPU / GPU)",
          "what each processing device does",
          "how abnormal CPU/GPU load can show up as a SOC signal",
        ),
      ),
  },
  {
    test: /iot and mobile|mobile device basics/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.4 - IoT and Mobile.pdf"),
          doc("https://www.cisa.gov/topics/risk-management/iot-security", "CISA — IoT security topics"),
          doc("https://csrc.nist.gov/publications/detail/sp/800-213/final", "NIST SP 800-213 — IoT device cybersecurity"),
        ],
        [
          "Define IoT and list 4 use-case domains from Oak 1.4",
          "Name privacy/security risks unique to always-connected devices",
          "Write one SOC/enterprise concern (shadow IoT, default creds, patch lag)",
        ],
        foundationTourSteps(
          "1.4 IoT and mobile risks",
          "why IoT expands the attack surface",
          "what a SOC would ask when an unknown IoT device appears on the network",
        ),
      ),
  },
  {
    test: /network components \(nic|nic\s*\/\s*cabling|cabling\s*\/\s*media\)/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.5 - Network Component.pdf"),
          doc("https://www.cloudflare.com/learning/network-layer/what-is-a-nic/", "Cloudflare — What is a NIC?"),
        ],
        [
          "Identify NIC, cabling/media, and basic device roles from Oak 1.5",
          "Explain how NIC choice affects speed/connectivity",
          "Relate physical media to later packet capture / link troubleshooting",
        ],
        foundationTourSteps(
          "1.5 NIC / cabling / network components",
          "how a host joins a network at the hardware layer",
          "why link/NIC issues matter before blaming 'malware' in an alert",
        ),
      ),
  },
  {
    test: /operating system role|kernel\s*\/\s*user space|os types/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.6 - Operating Systems.pdf"),
          oakNotes("Bilgisayar Biliminin Temelleri - II.pdf"),
          doc("https://csrc.nist.gov/glossary/term/operating_system", "NIST glossary — operating system"),
        ],
        [
          "Explain OS as the bridge between hardware and applications (Temelleri II)",
          "Define kernel vs user space in one sentence each",
          "Note EOL / unpatched OS risk for SOC asset context",
        ],
        foundationTourSteps(
          "1.6 OS role + Temelleri II",
          "what the OS does and why hardware is useless without it",
          "how EOL OS shows up as vulnerability/risk context in tickets",
        ),
      ),
  },
  {
    test: /application vs service vs process|service vs process vs interface/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.7 - Application, Service, Process, Interface, CLI & GUI.pdf"),
          doc("https://csrc.nist.gov/glossary/term/process", "NIST glossary — process"),
        ],
        [
          "Define application, service, process, and interface from Oak 1.7 (no Linux lab yet)",
          "Explain client–server request/response with one example",
          "SOC lens: why 'process' in an EDR alert is not the same as 'service' or 'app'",
        ],
        foundationTourSteps(
          "1.7 application / service / process / interface",
          "how the four concepts differ",
          "how you would describe a suspicious process to a teammate",
        ),
      ),
  },
  {
    test: /cli vs gui|root\s*\(#\)\s*vs user|root.*vs.*user\s*\(\$\)/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.7 - Application, Service, Process, Interface, CLI & GUI.pdf"),
          oakNotes("1.6 - Operating Systems.pdf"),
          thm("linuxfundamentalspart1", "TryHackMe — Linux Fundamentals Part 1 (optional shell practice)"),
        ],
        [
          "Compare CLI vs GUI from Oak 1.7 first (concepts before commands)",
          "Explain root (#) vs user ($) privilege meaning",
          "Optional: open a shell only to observe prompt difference — not a full Linux command drill",
        ],
        foundationTourSteps(
          "1.7 CLI vs GUI and privilege prompts",
          "when CLI is required and what # vs $ signals",
          "why privilege level matters in SOC investigations",
        ),
      ),
  },
  {
    test: /virtualization.*hypervisor|hypervisor type\s*1|type\s*1 vs type\s*2/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.9 - Virtualization.pdf"),
          doc("https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/", "Microsoft — Hyper-V overview"),
          oakResource(konu),
        ],
        [
          "Define virtualization and Type 1 vs Type 2 hypervisor from Oak 1.9",
          "Sketch host vs guest and snapshot idea",
          "Note one security angle (isolation, snapshot rollback, shared host risk)",
        ],
        foundationTourSteps(
          "1.9 virtualization / hypervisor types",
          "Type 1 vs Type 2 in your own words",
          "how VMs help SOC labs and what isolation does not guarantee",
        ),
      ),
  },
  {
    test: /vm vs container|container \(docker\)/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.9 - Virtualization.pdf"),
          thm("introductorydocker", "TryHackMe — Intro to Docker"),
          doc("https://docs.docker.com/get-started/docker-overview/", "Docker — overview"),
        ],
        [
          "Compare VM vs container isolation from Oak 1.9",
          "State when a SOC lab uses a VM vs a container",
          "Optional: one authorized docker info/ps command after the concept pass",
        ],
        foundationTourSteps(
          "1.9 VM vs container",
          "what each isolates and what they share",
          "how container escapes / shared kernel change the risk story",
        ),
      ),
  },
  {
    test: /cloud computing basics/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.10 - Cloud Computing.pdf"),
          doc("https://csrc.nist.gov/publications/detail/sp/800-145/final", "NIST SP 800-145 — cloud computing definition"),
          oakResource(konu),
        ],
        [
          "Define cloud computing and list IaaS / PaaS / SaaS from Oak 1.10",
          "Compare one deployment model (public / private / hybrid)",
          "Note which log sources a SOC might see from cloud apps later",
        ],
        foundationTourSteps(
          "1.10 cloud service and deployment models",
          "IaaS vs PaaS vs SaaS with one example each",
          "shared-responsibility idea for a junior analyst",
        ),
      ),
  },
  {
    test: /cloud storage risks|privacy\s*\/\s*ownership/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.10 - Cloud Computing.pdf"),
          oakNotes("1.2 - Storage Devices.pdf"),
          doc("https://www.nist.gov/privacy-framework", "NIST Privacy Framework (overview)"),
        ],
        [
          "Explain cloud storage privacy and ownership risks from Oak notes",
          "Contrast local disk control vs provider-held data",
          "Write one question you would ask before syncing sensitive lab notes to cloud storage",
        ],
        foundationTourSteps(
          "1.10 / 1.2 cloud storage risk themes",
          "who controls and who can access cloud-stored data",
          "how data residency / ownership shows up in incident impact",
        ),
      ),
  },
  // --- Network Fundamentals spine (Oak module 2 PDFs) — Oak first; THM optional ---
  {
    test: /wireshark|pcap|packet analysis|tcpdump/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.9 - Network101-LAB.pdf", "Network Fundamentals"),
          doc("https://www.wireshark.org/docs/dfref/", "Wireshark display filters"),
          thm("wireshark", "TryHackMe — Wireshark 101 (optional short practice)"),
        ],
        [
          "Open Oak Network101-LAB: Wireshark/tcpdump first — not a full wall-of-text room",
          "Apply 2–3 filters for one protocol; explain attacker use vs defender visibility",
          "Log one capture artifact + one suspicious pattern a SOC would flag",
        ],
        foundationTourSteps(
          "2.9 Network101-LAB packet tools",
          "what you filtered and why (technique + detection)",
          "attacker: hide in noise / defender: which field would you alert on",
        ),
      ),
  },
  {
    test: /subnet|cidr|subnet mask/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.3.1 - Network Layer - Subnetting.pdf", "Network Fundamentals"),
          oakNotes("2.3 - Network Layer and Protocols.pdf", "Network Fundamentals"),
          doc("https://www.subnet-calculator.com/", "Subnet calculator (check only)"),
        ],
        [
          "Work /26 and /24 by hand from Oak 2.3.1 before using a calculator",
          "Identify network / broadcast / usable hosts for one example",
          "Dual lens: how an attacker scopes a subnet vs how alerts show internal vs external IP",
        ],
        foundationTourSteps(
          "2.3.1 subnetting / CIDR",
          "how you split network vs host bits on one example",
          "attacker: lateral range / defender: internal vs external IP in a ticket",
        ),
      ),
  },
  {
    test: /osi model|tcp\/ip|encapsulation|mac vs ip/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.1 - OSI Reference Model.pdf", "Network Fundamentals"),
          oakNotes("2.2 - Data Link Layer and Protocols-Broadcast-Collision.pdf", "Network Fundamentals"),
          doc("https://www.cloudflare.com/learning/network-layer/what-is-the-osi-model/", "Cloudflare — OSI model (optional)"),
        ],
        [
          "Draw OSI 7 layers with one protocol each from Oak 2.1",
          "Trace encapsulation for an HTTPS request in one sketch",
          "Dual lens: where an attacker tampers vs which layer a SOC inspects first",
        ],
        foundationTourSteps(
          "2.1 OSI / TCP-IP reference models",
          "each layer’s job in one sentence",
          "attacker: which layer to abuse / defender: which pane or log first",
        ),
      ),
  },
  {
    test: /arp/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.2 - Data Link Layer and Protocols-Broadcast-Collision.pdf", "Network Fundamentals"),
          oakNotes("2.9 - Network101-LAB.pdf", "Network Fundamentals"),
          doc("https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/arp-caching", "Microsoft — ARP"),
        ],
        [
          "Explain ARP request/reply from Oak Layer-2 notes",
          "Optional: arp -a once; say what the table means",
          "Dual lens: ARP spoofing goal vs how a defender notices a wrong gateway MAC",
        ],
        foundationTourSteps(
          "2.2 / lab ARP basics",
          "how a host learns MAC for an IP",
          "attacker: poison mapping / defender: unexpected MAC for gateway",
        ),
      ),
  },
  {
    test: /vlan|collision domain|broadcast domain|ethernet frame/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.2 - Data Link Layer and Protocols-Broadcast-Collision.pdf", "Network Fundamentals"),
          oakNotes("2.6 - Networking Components-Switch.pdf", "Network Fundamentals"),
        ],
        [
          "Compare collision vs broadcast domain from Oak 2.2",
          "Explain VLAN purpose in one sentence",
          "Dual lens: flat LAN for attacker reach vs VLAN segmentation for defenders",
        ],
        foundationTourSteps(
          "2.2 Ethernet / domains + switch notes",
          "why VLANs and domains matter for segmentation",
          "attacker: same broadcast domain / defender: segment + monitor trunks",
        ),
      ),
  },
  {
    test: /\bnat\b|private vs public|default gateway|loopback|link-local|ipv4 vs ipv6/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.3 - Network Layer and Protocols.pdf", "Network Fundamentals"),
          doc("https://www.cloudflare.com/learning/network-layer/what-is-nat/", "Cloudflare — NAT (optional)"),
        ],
        [
          "From Oak 2.3: private RFC1918 ranges + why NAT exists",
          "Explain default gateway / loopback / link-local in one line each",
          "Dual lens: what NAT hides from an attacker vs what defenders still see in logs",
        ],
        foundationTourSteps(
          "2.3 network layer addressing / NAT themes",
          "how a packet leaves a LAN toward the internet",
          "attacker: reachability limits / defender: internal vs external IP fields",
        ),
      ),
  },
  {
    test: /dhcp/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.3 - Network Layer and Protocols.pdf", "Network Fundamentals"),
          oakNotes("2.9 - Network101-LAB.pdf", "Network Fundamentals"),
          doc("https://datatracker.ietf.org/doc/html/rfc2131", "RFC 2131 — DHCP (reference)"),
        ],
        [
          "Explain DORA in your own words (Discover–Offer–Request–Ack)",
          "Optional short capture: filter bootp/dhcp — do not clear a whole THM room",
          "Dual lens: rogue DHCP offer (attacker) vs lease/gateway anomalies (defender)",
        ],
        foundationTourSteps(
          "DHCP DORA from Oak notes / Network101-LAB",
          "each DORA step in one sentence",
          "attacker: rogue DHCP / defender: unexpected gateway or DNS",
        ),
      ),
  },
  {
    test: /dns|nslookup|\bdig\b/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.5 - Application Layer and Protocols.pdf", "Network Fundamentals"),
          oakNotes("2.9 - Network101-LAB.pdf", "Network Fundamentals"),
          doc("https://www.cloudflare.com/learning/dns/what-is-dns/", "Cloudflare — How DNS works (optional)"),
        ],
        [
          "Draw recursive DNS lookup flow from Oak 2.5 (no full THM room)",
          "List A, AAAA, CNAME, MX, TXT with one use each",
          "Dual lens: DNS for C2/tunneling ideas vs odd query patterns a SOC hunts",
        ],
        foundationTourSteps(
          "2.5 DNS hierarchy and records",
          "how a name becomes an IP",
          "attacker: resolve or hide C2 / defender: unusual queries or NXDOMAIN bursts",
        ),
      ),
  },
  {
    test: /icmp|ping|traceroute/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.3 - Network Layer and Protocols.pdf", "Network Fundamentals"),
          oakNotes("2.9 - Network101-LAB.pdf", "Network Fundamentals"),
        ],
        [
          "From Oak notes: what ICMP is for (not “just ping”)",
          "Optional: one ping + traceroute; explain TTL meaning",
          "Dual lens: ICMP for recon vs when defenders treat ICMP as scan noise",
        ],
        foundationTourSteps(
          "ICMP / path tools in Oak Network notes",
          "what ping and traceroute prove and what they do not",
          "attacker: path discovery / defender: ICMP flood or sweep signals",
        ),
      ),
  },
  {
    test: /tcp.*handshake|syn.*ack|tcp vs udp|port range|well-known/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.4 - Transport Layer and Protocols.pdf", "Network Fundamentals"),
          oakNotes("2.5 - Application Layer and Protocols.pdf", "Network Fundamentals"),
        ],
        [
          "Draw TCP 3-way handshake from Oak 2.4",
          "Compare TCP vs UDP with two real services each",
          "Dual lens: SYN scan idea vs SYN/half-open patterns defenders watch",
        ],
        foundationTourSteps(
          "2.4 transport layer (TCP/UDP/ports)",
          "handshake + reliability difference",
          "attacker: probe open ports / defender: port + protocol in firewall or SIEM",
        ),
      ),
  },
  {
    test: /critical port|^port|port \d/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.4 - Transport Layer and Protocols.pdf", "Network Fundamentals"),
          doc("https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", "IANA port registry"),
          oakNotes("2.9 - Network101-LAB.pdf", "Network Fundamentals"),
        ],
        [
          "Build a 10–15 port cheat sheet (22, 53, 80, 443, 445, 3389…)",
          "Map port → service → typical log source",
          "Dual lens: why attackers hit 445/3389 vs which ports are high-signal for SOC",
        ],
        foundationTourSteps(
          "2.4 ports + Network101-LAB connection view",
          "your top ports and their services",
          "attacker: service exposure / defender: unexpected listeners or internet noise",
        ),
      ),
  },
  {
    test: /http|status code|request method/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.5 - Application Layer and Protocols.pdf", "Network Fundamentals"),
          doc("https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "MDN HTTP status codes"),
        ],
        [
          "From Oak 2.5: client–server HTTP and common methods",
          "List 5 status codes you must recall (200/301/302/404/500)",
          "Dual lens: odd methods (PUT/DELETE) as technique hints vs web-log signals for defenders",
        ],
        foundationTourSteps(
          "2.5 HTTP methods and status codes",
          "request vs response and what a status code means",
          "attacker: abuse verbs/paths / defender: status and method anomalies in logs",
        ),
      ),
  },
  {
    test: /https|ssl|tls|certificate|pki|ocsp/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.5 - Application Layer and Protocols.pdf", "Network Fundamentals"),
          doc("https://www.cloudflare.com/learning/ssl/what-is-ssl/", "Cloudflare — TLS (optional)"),
        ],
        [
          "Explain HTTPS as HTTP over TLS from Oak application-layer notes",
          "Inspect one certificate; name subject / issuer / expiry",
          "Dual lens: what TLS hides from sniffers vs what defenders still see (SNI, cert, JA3 later)",
        ],
        foundationTourSteps(
          "2.5 HTTPS / TLS basics",
          "what TLS protects and what it does not",
          "attacker: trust or downgrade themes / defender: cert expiry or TLS errors in tickets",
        ),
      ),
  },
  {
    test: /smtp|imap|pop3|email protocol/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.5 - Application Layer and Protocols.pdf", "Network Fundamentals"),
          doc("https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks", "CISA — phishing context"),
        ],
        [
          "Map SMTP/IMAP/POP3 to ports from Oak notes",
          "Explain which is send vs retrieve",
          "Dual lens: phish delivery via SMTP vs header fields a defender checks",
        ],
        foundationTourSteps(
          "2.5 email protocols",
          "ports and roles of SMTP/IMAP/POP3",
          "attacker: deliver lure / defender: header + SPF/DKIM clues",
        ),
      ),
  },
  {
    test: /ssh|telnet|rdp|ftp|sftp|smb/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.4 - Transport Layer and Protocols.pdf", "Network Fundamentals"),
          oakNotes("2.5 - Application Layer and Protocols.pdf", "Network Fundamentals"),
          doc("https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/", "Microsoft — RDP (optional)"),
        ],
        [
          "Compare SSH vs Telnet security from Oak port/protocol notes",
          "Note RDP 3389 and SMB 445 as high-signal exposure",
          "Dual lens: brute/spray ideas (authorized labs only later) vs Event/firewall signals — no Linux Fundamentals room now",
        ],
        foundationTourSteps(
          "remote access / file protocols (Oak 2.4–2.5)",
          "which protocols are encrypted and which are not",
          "attacker: exposed remote service / defender: 3389/445 internet noise",
        ),
      ),
  },
  {
    test: /snmp|ntp|network topology|switch.*router|dmz|nac|proxy|load balancer|access point|\bhub\b/i,
    build: ({ konu }) => {
      const title = konu.toLowerCase();
      const pdf = /dmz/.test(title)
        ? "2.11 - DMZ.pdf"
        : /nac/.test(title)
          ? "2.14 - NAC.pdf"
          : /proxy/.test(title)
            ? "2.13 - Proxy Servers.pdf"
            : /load balancer/.test(title)
              ? "2.12 - Load Balancer.pdf"
              : /access point/.test(title)
                ? "2.8 - Networking Components-Access Point.pdf"
                : /router/.test(title)
                  ? "2.7 - Networking Components-Router.pdf"
                  : /switch|hub/.test(title)
                    ? "2.6 - Networking Components-Switch.pdf"
                    : "2.10 - Network Topology.pdf";
      return mkGuide(
        konu,
        [
          oakNotes(pdf, "Network Fundamentals"),
          oakNotes("2.6 - Networking Components-Switch.pdf", "Network Fundamentals"),
          oakNotes("2.7 - Networking Components-Router.pdf", "Network Fundamentals"),
        ],
        [
          `Open the matching Oak PDF (${pdf}) for this title first`,
          "Sketch device/zone roles (switch vs router vs AP / DMZ / LB / NAC / proxy as relevant)",
          "Dual lens: how an attacker abuses misplacement vs where defenders place sensors/logs",
        ],
        foundationTourSteps(
          `${pdf.replace(/\.pdf$/i, "")} device / architecture`,
          "the device or zone purpose in your own words",
          "attacker: bypass or pivot path / defender: sensor or log placement",
        ),
      );
    },
  },
  {
    test: /netstat|connection analysis/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("2.9 - Network101-LAB.pdf", "Network Fundamentals"),
          doc("https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netstat", "Microsoft — netstat"),
        ],
        [
          "From Oak Network101-LAB: LISTEN vs ESTABLISHED",
          "Run netstat or ss once; name three states you see",
          "Dual lens: unexpected listener as attacker foothold vs defender triage of foreign ESTABLISHED — no Linux Fundamentals room",
        ],
        foundationTourSteps(
          "2.9 netstat / connection view",
          "listening vs established and why it matters",
          "attacker: backdoor listener / defender: unknown remote ESTABLISHED",
        ),
      ),
  },
  {
    test: /active directory|ldap|kerberos|ntlm|gpo|ntds|domain controller|\bou\b/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("attacktivedirectory", "TryHackMe — Attacktive Directory"), doc("https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview", "Microsoft — AD overview"), oakResource(konu)],
        ["Map Domain / DC / OU / user objects", "Run one AD query (ldapsearch or Get-ADUser)", "Relate Kerberos/NTLM to SOC alert type"],
        [
          { action: "Read Oak AD section; list 4 object types", durationMin: 20, logHint: "4 AD object types" },
          { action: "Enumerate users/groups in lab; note default groups", durationMin: 25, logHint: "1 interesting membership" },
          { action: "Skim THM Attacktive Directory intro tasks", durationMin: 30, logHint: "Tasks done" },
          { action: "Note relevant Windows Event IDs (4624, 4768)", durationMin: 10, logHint: "Event ID or log source" },
        ],
      ),
  },
  {
    test: /windows event|event log|event viewer|evtx|\bevent id\b|security log|sysmon event/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          thm("windowseventlogs", "TryHackMe — Windows Event Logs"),
          doc("https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624", "Microsoft — Event 4624 (logon)"),
          doc("https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/basic-audit-policy-settings", "Microsoft — Basic audit policy"),
          tool("https://github.com/SwiftOnSecurity/sysmon-config", "Sysmon config (Event ID 1+)"),
          oakResource(konu),
        ],
        [
          "Open Event Viewer; locate Security / System / Application channels",
          "Explain 4624 vs 4625 vs 4688 in one sentence each",
          "Map one Event ID to a SOC alert you would write",
        ],
        [
          {
            action: "Tour Event Viewer channels; note where Security vs Sysmon land",
            durationMin: 15,
            logHint: "3 channel names + why they matter",
          },
          {
            action: "Generate or find 4624/4625 (and 4688 if available); screenshot key fields",
            durationMin: 25,
            logHint: "Event IDs + Logon Type or New Process name",
          },
          {
            action: "Complete THM Windows Event Logs (or first half)",
            durationMin: 30,
            logHint: "Room progress %",
          },
          {
            action: "Draft detection idea: Event ID → condition → action",
            durationMin: 10,
            logHint: "1 detection bullet + MITRE technique if known",
          },
        ],
      ),
  },
  {
    test: /powershell|registry|task scheduler|windows service|iis|defender firewall|net user|smb share|ntfs/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("windowsprivesc20", "TryHackMe — Windows PrivEsc (admin basics)"), thm("windowseventlogs", "TryHackMe — Windows Event Logs"), oakResource(konu)],
        ["Run 5 PowerShell cmdlets for enumeration", "Check Services and Scheduled Tasks", "Review firewall inbound rule"],
        standardStudySteps(konu, 25),
      ),
  },
  {
    // Word-bound short tokens — bare "du"/"process"/"tar" falsely steal IT Fund titles (e.g. Introdu**du**ction).
    test: /linux.*command|\bbash\b|\bchmod\b|\bchown\b|\bsystemctl\b|\/etc\/passwd|\bapt\b|\bdpkg\b|filesystem hierarchy|\bprocess(?:es)?\b|\bdf\b|\bdu\b|\btar\b|\bgzip\b|remote.*ssh/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("linuxfundamentalspart1", "TryHackMe — Linux Fundamentals Part 1"), thm("linuxfundamentalspart2", "TryHackMe — Linux Fundamentals Part 2"), doc("https://man7.org/linux/man-pages/", "Linux man pages"), oakResource(konu)],
        ["Complete commands in live Linux VM", "Fix permissions on misconfigured file", "Check service status and /var/log entry"],
        [
          { action: "Read Oak Linux section for this topic", durationMin: 15, logHint: "5 commands to memorize" },
          { action: "Practice in VM; capture terminal snippet", durationMin: 20, logHint: "Command + output" },
          { action: "THM Linux fundamentals task block", durationMin: 25, logHint: "Tasks completed" },
          { action: "Log with evidence screenshot path", durationMin: 5, logHint: "Screenshot filename" },
        ],
      ),
  },
  {
    test: /siem architecture|splunk|spl query|wazuh|sysmon|soc alert|alert triage|incident investigation|mini soc|project 4/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("splunk101", "TryHackMe — Splunk Basics"), doc("https://documentation.wazuh.com/", "Wazuh documentation"), tool("https://github.com/SwiftOnSecurity/sysmon-config", "Sysmon config"), SOC_L1, LETS_DEFEND],
        ["Verify log forwarding to SIEM", "Write one search for suspicious process creation", "Triage sample alert end-to-end"],
        [
          { action: "Verify log source forwarding (agent or Winlogbeat)", durationMin: 20, logHint: "Source name + index" },
          { action: "Run 3 baseline searches (failed logon, new service, rare parent)", durationMin: 25, logHint: "Best search string" },
          { action: "Work THM Splunk or SOC L1 SIEM module", durationMin: 30, logHint: "Room / task %" },
          { action: "Document one FP vs TP example", durationMin: 10, logHint: "FP vs TP one-liner" },
        ],
      ),
  },
  {
    test: /edr|sophos|tamper|quarantine|live discover|threat graph|endpoint isolation|fim|dlp|bitlocker|antivirus|sandbox/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [SOC_L1, doc("https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/", "Microsoft Defender for Endpoint"), oakResource(konu)],
        ["Compare signature vs behavioral detection", "Walk through EDR alert triage steps", "Note isolation/quarantine lifecycle"],
        standardStudySteps(konu, 30),
      ),
  },
  {
    test: /soc analyst|soc workflow|alert.*rca|false positive|true positive|3-2-1 backup|hardening|virustotal/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [SOC_L1, LETS_DEFEND, CYBER_DEF, doc("https://www.virustotal.com/", "VirusTotal"), oakResource(konu)],
        ["Follow alert → enrich → decide → escalate workflow", "Look up sample hash on VirusTotal", "Draft 3-step SOC playbook bullets"],
        [
          { action: "Review SOC L1 Alert Triage module on THM", durationMin: 20, logHint: "Key triage steps" },
          { action: "Complete 2 LetsDefend alert scenarios", durationMin: 30, logHint: "Alert titles + decisions" },
          { action: "Document FP vs TP criteria for one alert type", durationMin: 15, logHint: "3 criteria bullets" },
        ],
      ),
  },
  {
    test: /intro to security/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("4.01 - CIA Triad.pdf", "Intro To Security"),
          oakNotes("4.02 - Cybersecurity Terminology.pdf", "Intro To Security"),
          oakNotes("4.05 - Cyber Kill Chain.pdf", "Intro To Security"),
          MITRE,
        ],
        [
          "Open Oak Intro To Security PDFs (4.01–4.02) — module map, not every later card today",
          "Explain CIA with one attack example and one defender control each",
          "Preview Kill Chain stages: attacker progression vs where detection can interrupt",
        ],
        foundationTourSteps(
          "4.01 CIA + 4.02 terminology (module orientation)",
          "what this module covers and how CIA frames every later topic",
          "attacker: break C/I/A / defender: which control restores which letter",
        ),
      ),
  },
  {
    test: /cia triad/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("4.01 - CIA Triad.pdf", "Intro To Security"),
          doc("https://csrc.nist.gov/glossary/term/confidentiality", "NIST — confidentiality"),
        ],
        [
          "Define C, I, A from Oak 4.01 with one concrete example each",
          "For each letter: one attacker action + one defender control",
          "Write one SOC ticket sentence that names which CIA letter was hit",
        ],
        foundationTourSteps(
          "4.01 CIA Triad",
          "CIA in your own words with ticket-ready examples",
          "attacker goal per letter / defender control per letter",
        ),
      ),
  },
  {
    test: /cyber kill chain/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("4.05 - Cyber Kill Chain.pdf", "Intro To Security"),
          oakNotes("4.06 - Advanced Persistent Threat (APT).pdf", "Intro To Security"),
          MITRE,
        ],
        [
          "List the 7 Kill Chain stages from Oak 4.05",
          "Pick one stage: attacker actions vs a detection or interrupt idea",
          "Relate APT persistence (4.06) without dumping the whole MITRE matrix",
        ],
        foundationTourSteps(
          "4.05 Cyber Kill Chain (+ APT preview)",
          "stage order and one interrupt point",
          "attacker: progress the chain / defender: break one stage early",
        ),
      ),
  },
  {
    test: /\bapt\b|advanced persistent/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("4.06 - Advanced Persistent Threat (APT).pdf", "Intro To Security"),
          oakNotes("4.05 - Cyber Kill Chain.pdf", "Intro To Security"),
          MITRE,
        ],
        [
          "Define APT traits from Oak 4.06 (goal, dwell, stealth)",
          "Contrast smash-and-grab vs long dwell with one example",
          "Dual lens: attacker persistence idea vs defender telemetry you would want",
        ],
        foundationTourSteps(
          "4.06 APT",
          "what makes a threat 'advanced' and 'persistent'",
          "attacker: stay quiet and long / defender: dwell-time and staging signals",
        ),
      ),
  },
  {
    test: /\biam\b|iaaa|identification.*authentication|mfa factors|\bsso\b/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("4.07 - IAM - AAA.pdf", "Intro To Security"),
          doc("https://csrc.nist.gov/glossary/term/identity_and_access_management", "NIST — IAM"),
        ],
        [
          "Walk identify → authenticate → authorize → account from Oak 4.07",
          "Explain MFA factors (know / have / are) with one abuse path if a factor is stolen",
          "Dual lens: credential theft vs MFA/least-privilege as defender controls",
        ],
        foundationTourSteps(
          "4.07 IAM / AAA",
          "AAA steps and least privilege in plain language",
          "attacker: steal or reuse identity / defender: MFA + least privilege + logs",
        ),
      ),
  },
  {
    // Avoid bare "risk(s)" — steals IoT/cloud-storage IT Fund titles into MITRE guide.
    test: /mitre|zero trust|defense in depth|threat.*vulner|risk management|risk assess|\bexploit\b|zero-day|\bcve\b|blue.*red.*purple/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [MITRE, oakNotes("4.02 - Cybersecurity Terminology.pdf", "Intro To Security"), thm("introductoryresearching", "TryHackMe — Introductory Researching (optional)")],
        [
          "Map one technique to MITRE ID (authorized notes / ATT&CK site)",
          "State attacker goal and defender visibility for that technique",
          "Describe defense-in-depth layers without encyclopedia dump",
        ],
        foundationTourSteps(
          "Oak terminology + MITRE awareness",
          "one technique both as attack step and detection idea",
          "attacker procedure / defender data source",
        ),
      ),
  },
  {
    test: /phishing|social engineering|malware types|virus|worm|trojan|ransomware|spyware|rootkit|hacker type/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("4.03 - Types of Malware.pdf", "Intro To Security"),
          oakNotes("4.04 - Types of Hackers.pdf", "Intro To Security"),
          doc("https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks", "CISA — phishing guidance"),
          thm("phishing", "TryHackMe — Phishing (optional short practice)"),
        ],
        [
          "Oak 4.03/4.04 first: malware types and hacker hats — not a full phishing room",
          "For one malware type: attacker delivery idea + defender signal",
          "If phishing: one header check — skip wall-of-text room autopilot",
        ],
        foundationTourSteps(
          "4.03 malware + 4.04 hacker types",
          "taxonomy with one concrete example",
          "attacker: choose tool/hat for the goal / defender: user report + telemetry clue",
        ),
      ),
  },
  {
    test: /firewall|fortigate|ids|ips|waf|vpn|ipsec|ngfw|implicit deny|deep inspection|owasp/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [doc("https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/954635/firewall-policy", "FortiGate — firewall policy"), thm("firewalls", "TryHackMe — Firewalls"), oakResource(konu)],
        ["Sketch FortiGate policy order (top-down)", "Compare IDS vs IPS placement", "Explain implicit deny default"],
        standardStudySteps(konu, 25),
      ),
  },
  {
    test: /encrypt|hash|aes|rsa|sha|md5|digital signature|mac.*hmac|e2ee|password hash|bcrypt|argon|cyberchef|openssl/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("encryptioncrypto", "TryHackMe — Encryption & Crypto"), doc("https://gchq.github.io/CyberChef/", "CyberChef"), oakResource(konu)],
        ["Distinguish encryption vs hashing vs encoding", "Use CyberChef for one hash/decode demo", "Explain why MD5/SHA-1 are weak for passwords"],
        standardStudySteps(konu),
      ),
  },
  {
    test: /python|script|automation|log parse|socket/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("pythonforcybersecurity", "TryHackMe — Python for Cybersecurity"), doc("https://docs.python.org/3/tutorial/", "Python tutorial"), oakResource(konu)],
        ["Write script to parse 20-line log file", "Extract IPs or usernames with regex", "Output summary counts"],
        [
          { action: "Review Oak Python section", durationMin: 15, logHint: "3 functions to use" },
          { action: "Complete THM Python room task block", durationMin: 30, logHint: "Tasks done" },
          { action: "Run custom script on sample log", durationMin: 20, logHint: "Output snippet" },
        ],
      ),
  },
  {
    // Residual cloud/virt topics not covered by IT Fund spine guides above.
    test: /\bdocker\b|kubernetes|iaas|paas|saas|shared responsibility/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          oakNotes("1.10 - Cloud Computing.pdf"),
          oakNotes("1.9 - Virtualization.pdf"),
          thm("introductorydocker", "TryHackMe — Intro to Docker"),
          oakResource(konu),
        ],
        ["Prefer Oak PDF concepts before lab commands", "Compare VM vs container or cloud service model as applicable", "Note cloud log sources for SOC"],
        foundationTourSteps("Oak cloud/virt PDF for this title", "the core model in your own words", "one SOC-relevant visibility gap"),
      ),
  },
  {
    test: /nmap|network scan/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("nmap", "TryHackMe — Nmap"), JR_PENTEST, HTB_START, doc("https://nmap.org/book/man.html", "Nmap reference manual"), oakResource(konu)],
        ["Run safe scan on lab target only (-sV -sC)", "Interpret open ports and service versions", "List 3 detections a SOC could build from scan traffic"],
        [
          { action: "Read Oak / THM Nmap theory (port states, scan types)", durationMin: 15, logHint: "3 scan types" },
          { action: "Complete THM Nmap room tasks in lab VPN", durationMin: 35, logHint: "Room progress %" },
          { action: "Document one command chain and expected defender log", durationMin: 15, logHint: "Command + log source" },
          { action: "Map findings to MITRE T1046 (Network Service Discovery)", durationMin: 10, logHint: "Technique ID" },
        ],
      ),
  },
  {
    test: /vulnerability scan|nessus|vuln.*manage/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [
          thm("vulnversity", "TryHackMe — Vulnversity"),
          doc("https://docs.tenable.com/nessus/Content/GettingStarted.htm", "Nessus — getting started"),
          doc("https://www.first.org/cvss/", "FIRST — CVSS overview"),
          JR_PENTEST,
          oakResource(konu),
        ],
        [
          "Separate vulnerability scanning from exploitation / pentest",
          "Prioritize findings by CVSS, exploitability, and asset criticality",
          "Draft a remediation ticket a SOC/IT team could act on",
          "Note how mass scanning appears in network/EDR telemetry (defender lens)",
        ],
        [
          { action: "Oak notes: Vulnerability Management lifecycle (discover → prioritize → remediate → verify)", durationMin: 20, logHint: "4 lifecycle stages" },
          { action: "Oak notes: Vulnerability Scanning — scan types, auth vs unauth, false positives", durationMin: 20, logHint: "2 scan types" },
          { action: "Review Nessus-style or THM Vulnversity output; pick top 3 findings", durationMin: 25, logHint: "Top 3 CVEs / plugins" },
          { action: "Write defender detection idea for aggressive vulnerability scanning", durationMin: 15, logHint: "1 detection bullet" },
          { action: "Optional: Nmap–Nessus cheat-sheet refresh for safe lab-only commands", durationMin: 10, logHint: "2 commands" },
        ],
      ),
  },
  {
    test: /exploitation|metasploit|exploit/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [JR_PENTEST, thm("vulnversity", "TryHackMe — Vulnversity"), HTB_START, MITRE, oakResource(konu)],
        ["Walk through exploit only in authorized lab", "Document attack chain steps for blue-team detection", "Identify patch or control that would block exploit"],
        [
          { action: "Review exploit phases: recon → exploit → post-exploit", durationMin: 15, logHint: "3 phases" },
          { action: "Complete one THM Jr Pentest or Starting Point machine", durationMin: 45, logHint: "Machine name + flag" },
          { action: "List Event IDs / logs defenders should monitor", durationMin: 15, logHint: "3 log sources" },
          { action: "Draft mini write-up: attack timeline + detection points", durationMin: 20, logHint: "Public or private notes URL" },
        ],
      ),
  },
  {
    test: /sql injection|xss|owasp|injection/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("owasptop10", "TryHackMe — OWASP Top 10"), JR_PENTEST, oakResource(konu)],
        ["Reproduce safe lab injection; never test without permission", "Explain input validation and WAF role", "Write SOC/web alert indicators"],
        [
          { action: "Review OWASP Top 10 entry for this topic", durationMin: 15, logHint: "Risk + mitigation" },
          { action: "Complete related THM room task block", durationMin: 30, logHint: "Payload or fix applied" },
          { action: "Note defender controls: WAF, parameterized queries, CSP", durationMin: 10, logHint: "2 controls" },
        ],
      ),
  },
  {
    test: /brute force|password attack|hashcat|john/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [JR_PENTEST, thm("owasptop10", "TryHackMe — OWASP Top 10"), doc("https://hashcat.net/wiki/", "Hashcat wiki"), oakResource(konu)],
        ["Distinguish online brute force vs offline hash crack", "Relate to Event 4625 / lockout policies", "Never attack systems you do not own"],
        [
          { action: "Review password policy and lockout best practices", durationMin: 10, logHint: "2 policy settings" },
          { action: "Crack sample hash in THM lab only", durationMin: 25, logHint: "Hash type" },
          { action: "List SOC alerts for credential attacks", durationMin: 10, logHint: "Event ID or rule name" },
        ],
      ),
  },
  {
    test: /fileless|lolbin|rundll32|certutil|bitsadmin|dos|ddos|spoof|sniff/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [MITRE, doc("https://lolbas-project.github.io/", "LOLBAS — living-off-the-land binaries"), SOC_L1, oakResource(konu)],
        ["Identify LOLBin abuse in sample alert", "Map to MITRE execution / defense evasion", "Propose one detection rule idea"],
        [
          { action: "Read LOLBAS entry for one binary (certutil or bitsadmin)", durationMin: 15, logHint: "Binary + abuse case" },
          { action: "Review SOC alert example for same technique", durationMin: 15, logHint: "Alert name" },
          { action: "Write 3-bullet detection hypothesis", durationMin: 10, logHint: "Detection bullets" },
        ],
      ),
  },
  {
    // Avoid bare "risk(s)" matching IoT/cloud-storage titles.
    test: /\bgrc\b|governance|compliance|risk management|risk assess/i,
    build: ({ konu }) =>
      mkGuide(konu, [doc("https://www.nist.gov/cyberframework", "NIST Cybersecurity Framework"), oakResource(konu)], ["Define GRC in SOC context", "List 3 compliance drivers (GDPR, ISO 27001)", "Relate to ticket documentation"], standardStudySteps(konu, 15)),
  },
];

/** Fallback guides keyed by curriculum domain (alan). */
export const ALAN_GUIDES: Record<string, GuideBuilder> = {
  net: ({ konu }) =>
    mkGuide(
      konu,
      [
        oakNotes("2.1 - OSI Reference Model.pdf", "Network Fundamentals"),
        oakNotes("2.9 - Network101-LAB.pdf", "Network Fundamentals"),
        oakResource(konu),
      ],
      [
        `Open the matching Oak Network Fundamentals PDF for ${konu}`,
        "Diagram or one authorized lab check — skip long THM reading rooms",
        "Dual lens: how the technique works + how a defender would see it",
      ],
      foundationTourSteps(
        "Oak Network Fundamentals PDF for this title",
        "core concept in your own words while doing",
        "attacker use of the concept / defender visibility",
      ),
    ),
  linux: ({ konu }) =>
    mkGuide(
      konu,
      [thm("linuxfundamentalspart1", "TryHackMe — Linux Fundamentals"), doc("https://man7.org/linux/man-pages/", "Linux man pages"), oakResource(konu)],
      ["Practice commands in live VM without copy-paste", "Check /var/log for relevant entries", "Dual lens: attacker command vs defender log line"],
      standardStudySteps(konu, 25),
    ),
  win: ({ konu }) =>
    mkGuide(
      konu,
      [thm("windowseventlogs", "TryHackMe — Windows Event Logs"), thm("attacktivedirectory", "TryHackMe — Attacktive Directory"), oakResource(konu)],
      ["Use PowerShell or GUI for admin task", "Identify relevant Event ID", "Map attacker action to the Event ID defenders collect"],
      standardStudySteps(konu, 25),
    ),
  secfund: ({ konu }) =>
    mkGuide(
      konu,
      [
        oakNotes("4.02 - Cybersecurity Terminology.pdf", "Intro To Security"),
        MITRE,
        oakResource(konu),
      ],
      [
        "Prefer Oak Intro To Security PDF over long Pre-Security rooms",
        "Link concept to one attack step and one detection idea",
        "Add to FSRS after first solid explain-back",
      ],
      foundationTourSteps(
        "Oak Intro To Security notes for this title",
        "definition + one SOC example",
        "attacker angle / defender angle",
      ),
    ),
  crypto: ({ konu }) =>
    mkGuide(
      konu,
      [thm("encryptioncrypto", "TryHackMe — Encryption & Crypto"), doc("https://gchq.github.io/CyberChef/", "CyberChef"), oakResource(konu)],
      ["Distinguish encrypt vs hash vs encode", "Use CyberChef for one demo", "Note TLS/cert relevance for SOC"],
      standardStudySteps(konu),
    ),
  netsec: ({ konu }) =>
    mkGuide(
      konu,
      [thm("firewalls", "TryHackMe — Firewalls"), doc("https://docs.fortinet.com/", "FortiGate documentation"), oakResource(konu)],
      ["Sketch policy or rule order", "Compare host vs network control", "Relate to alert types in NGFW"],
      standardStudySteps(konu, 25),
    ),
  def: ({ konu }) => integratedSecurityGuide(konu, 30),
  off: ({ konu }) => integratedSecurityGuide(konu, 30),
  cloud: ({ konu }) =>
    mkGuide(
      konu,
      [thm("introductorydocker", "TryHackMe — Intro to Docker"), oakResource(konu)],
      ["Compare VM vs container", "Note cloud log sources", "Sketch simple cloud architecture"],
      standardStudySteps(konu),
    ),
  port: ({ konu, kind }) => {
    const proj = PORTFOLIO_PROJECTS[0];
    return kind === "lab"
      ? proj.guide
      : mkGuide(
          konu,
          [SOC_L1, LETS_DEFEND, doc("https://github.com/search?q=soc+investigation+writeup&type=repositories", "Investigation write-up examples")],
          ["Pick one portfolio project from Gates page", "Publish public evidence URL", "Update artifact in dashboard"],
          [
            { action: "Review Gate C requirements (2 public artifacts, 1 valuable lab)", durationMin: 10, logHint: "Gap list" },
            { action: "Start or continue primary SOC lab project", durationMin: 45, logHint: "Project name + progress" },
            { action: "Capture evidence screenshot or repo commit", durationMin: 10, logHint: "Evidence URL" },
          ],
        );
  },
  siem: ({ konu }) =>
    mkGuide(
      konu,
      [thm("splunk101", "TryHackMe — Splunk Basics"), doc("https://documentation.wazuh.com/", "Wazuh docs"), SIGMA, SOC_L1],
      ["Configure or verify log ingestion", "Write one detection search", "Document FP vs TP example"],
      standardStudySteps(konu, 30),
    ),
  py: ({ konu }) =>
    mkGuide(
      konu,
      [thm("pythonforcybersecurity", "TryHackMe — Python for Cybersecurity"), doc("https://docs.python.org/3/", "Python docs"), oakResource(konu)],
      ["Automate one repetitive SOC task", "Parse sample log with script", "Publish snippet to notes"],
      standardStudySteps(konu, 25),
    ),
};

/** Match ROI / lab task titles to portfolio project guides. */
export const ROI_GUIDES: Array<{ test: RegExp; build: GuideBuilder }> = [
  { test: /sysmon.*wazuh|wazuh.*splunk|mini soc|soc lab/i, build: () => PORTFOLIO_PROJECTS[0].guide },
  { test: /splunk|bots|sigma/i, build: () => PORTFOLIO_PROJECTS[1].guide },
  { test: /active directory|ad lab|kerberos|ntlm detection/i, build: () => PORTFOLIO_PROJECTS[2].guide },
  { test: /letsdefend|alert triage|triage session/i, build: () => PORTFOLIO_PROJECTS[3].guide },
  { test: /cyberdefenders|blue team challenge/i, build: () => PORTFOLIO_PROJECTS[4].guide },
  { test: /integrated lab|pentest|htb starting|jr pentest|attack.*write-?up/i, build: () => PORTFOLIO_PROJECTS[5].guide },
  { test: /python.*script|log parser|automation tool/i, build: () => PORTFOLIO_PROJECTS[6].guide },
  {
    test: /public link|publish|evidence|portfolio|write-up|writeup|artefakt/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [doc("https://github.com/search?q=soc+investigation+writeup+template&type=repositories", "Investigation write-up templates"), SOC_L1],
        ["Add public GitHub URL to artifact in dashboard", "Include architecture diagram or timeline", "Verify link works before logging session"],
        [
          { action: "Review existing artifact; list missing evidence", durationMin: 10, logHint: "Gap list" },
          { action: "Publish or update public repo / write-up", durationMin: 30, logHint: "Public URL" },
          { action: "Update artifact evidence tier in dashboard", durationMin: 5, logHint: "Evidence tier" },
        ],
      ),
  },
];

export function germanStudyGuide(konu: string): StudyGuide {
  const blocks = GERMAN_B2_PLAN.dailyBlocks;
  const input = blocks.find((b) => b.id === "input")!;
  const anki = blocks.find((b) => b.id === "anki")!;
  const output = blocks.find((b) => b.id === "output")!;
  const grammar = blocks.find((b) => b.id === "grammar")!;
  return {
    topic: konu,
    resources: [
      doc("https://learngerman.dw.com/en/nicos-weg/c-1", "DW — Nicos Weg (A1–B1 track)"),
      doc("https://learngerman.dw.com/", "DW Learn German"),
      doc("https://www.goethe.de/en/spr/kup/prf/prf/gb2.html", "Goethe-Institut — B2 exam"),
      doc("https://ankiweb.net/shared/decks/german", "Anki — German decks (SRS)"),
      doc("https://www.easygerman.org/", "Easy German"),
      tool("https://apps.ankiweb.net/", "Anki / FSRS desktop"),
    ],
    actions: [
      `Run the ${GERMAN_B2_PLAN.durationMonths}-month B2 daily routine (~${GERMAN_B2_PLAN.dailyMinutes.min}–${GERMAN_B2_PLAN.dailyMinutes.max} min) — language only`,
      GERMAN_LEARNING_SCIENCE.pillars[0],
      "Clear Anki dues with active recall + feedback (no cramming backlog)",
      `Speaking target: ${GERMAN_B2_PLAN.speakingPerWeek.months1to4}×/week early; ${GERMAN_B2_PLAN.speakingPerWeek.months5to9}×/week from month 5`,
      GERMAN_B2_PLAN.criticalRules[0],
    ],
    steps: steps(
      {
        action: `${input.label} (comprehensible input — Nicos Weg / DW / Easy German)`,
        durationMin: input.minutesMin,
        logHint: "Source + CEFR band",
      },
      {
        action: `${anki.label} — retrieval practice, keep dues current`,
        durationMin: anki.minutesMin,
        logHint: "Cards due / new",
      },
      {
        action: `${output.label} — tutor, partner, or timed self-speak/write with correction`,
        durationMin: output.minutesMin,
        logHint: "Minutes spoken/written + self-rating",
      },
      {
        action: `${grammar.label} — form inside meaning; fix articles + verb position`,
        durationMin: grammar.minutesMin,
        logHint: "1 pattern practiced",
      },
      {
        action: "Log language session (minutes + quality); no SOC theory in this block",
        durationMin: 2,
        logHint: "Minutes + quality",
      },
    ),
  };
}

export function labStudyGuide(konu: string, gateContext?: StudyGuideGateContext): StudyGuide {
  const portfolioBlocked = gateContext?.portfolioBlocked ?? gateContext?.gateCBlocked;
  if (portfolioBlocked) {
    const proj = projectForGate(gateContext?.nextGateId) ?? PORTFOLIO_PROJECTS[0];
    return {
      ...proj.guide,
      topic: proj.title,
      actions: [
        ...proj.guide.actions,
        "Priority: Gate C requires 2 public artifacts with ≥1 valuable SOC/AD lab",
      ],
    };
  }
  return mkGuide(
    konu,
    [SOC_L1, doc("https://documentation.wazuh.com/current/getting-started/index.html", "Wazuh getting started"), LETS_DEFEND, JR_PENTEST, MITRE],
    [
      "Boot lab VMs; run technique and capture defender telemetry in the same session",
      "Produce screenshot, PCAP, detection rule, or triage note",
      "Tie output to Gate B/C portfolio evidence",
    ],
    [
      { action: "Boot lab VMs; verify stack and logging pipeline", durationMin: 15, logHint: "Stack status" },
      { action: "Execute lab task (technique or simulated attack in scope)", durationMin: 30, logHint: "Technique / task name" },
      { action: "Analyze logs or alerts generated by the same activity", durationMin: 20, logHint: "Event ID or alert name" },
      { action: "Capture dual evidence (attack step + detection output)", durationMin: 10, logHint: "Screenshot or export path" },
      { action: "Log lab session with MITRE ID and artifact reference", durationMin: 5, logHint: "Artifact type + technique" },
    ],
  );
}

export function templateByKind(
  kind: StudyGuideTaskKind,
  konu: string,
  alan: string,
  gateContext?: StudyGuideGateContext,
): StudyGuide {
  const alanLabel = ALAN_LABEL[alan] ?? alan;

  switch (kind) {
    case "tekrar":
      return mkGuide(
        konu,
        [tool("https://apps.ankiweb.net/", "Anki / FSRS notes"), oakResource(konu)],
        ["Active recall without notes first", "Mark missed items for shorter interval", "Link review to one lab example"],
        [
          { action: `Blind recall: write everything about "${konu}"`, durationMin: 5, logHint: "Recall score /10" },
          { action: "Check Oak notes; fill gaps", durationMin: 8, logHint: "1 gap fixed" },
          { action: "Do 3 practice questions or explain aloud", durationMin: 7, logHint: "Hardest question" },
          { action: "Rate recall quality in session log", durationMin: 2, logHint: "Quality slider" },
        ],
      );
    case "lab":
      return labStudyGuide(konu, gateContext);
    case "dil":
      return germanStudyGuide(konu);
    case "dinlenme":
      return mkGuide(
        konu,
        [doc("/", "Light review — due FSRS queue")],
        ["Optional light recall only", "Rest if fatigue is high"],
        [
          { action: "Skim 1–2 due review cards only", durationMin: 10, logHint: "Optional" },
          { action: "Stretch / walk; no new material", durationMin: 10, logHint: "Rest noted" },
        ],
      );
    case "temel":
      return mkGuide(
        konu,
        [oakResource(konu), PRE_SEC, doc(`https://tryhackme.com/hacktivities/search?query=${encodeURIComponent(alanLabel)}`, "TryHackMe search")],
        [`Follow Oak order for ${alanLabel} foundation`, "Take structured notes with diagrams", "Add to review queue when first pass done"],
        [
          { action: `Read Oak section: ${konu} — note attacker and defender angles`, durationMin: 20, logHint: "2 bullets per angle" },
          { action: "Hands-on: one technique or command, then find its log footprint", durationMin: 15, logHint: "Command + log source" },
          { action: "Write 3 exam-style questions (include one detection question)", durationMin: 10, logHint: "Question headlines" },
          { action: "Mark topic on map; log session", durationMin: 5, logHint: "Map status" },
        ],
      );
    default:
      return mkGuide(
        konu,
        [oakResource(konu), doc(`https://tryhackme.com/hacktivities/search?query=${encodeURIComponent(konu)}`, "TryHackMe search")],
        [`Study ${konu} in ${alanLabel} — technique and detection in one pass`, "Connect theory to logs, alerts, or controls", "Queue for spaced repetition after session"],
        integratedStudySteps(konu),
      );
  }
}
