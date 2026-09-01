import { ALAN_LABEL } from "./oakCurriculum";
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

function standardStudySteps(konu: string, labMin = 25): Omit<StudyPlanStep, "order">[] {
  return [
    { action: `Read Oak section: ${konu}`, durationMin: 15, logHint: "3 bullet summary" },
    { action: "Hands-on lab or command practice in VM", durationMin: labMin, logHint: "Command or screenshot" },
    { action: "Write 3 recall questions; explain topic aloud", durationMin: 10, logHint: "Hardest question" },
    { action: "Log session with evidence note", durationMin: 5, logHint: "Evidence field" },
  ];
}

/** Specific topic patterns — ordered most-specific first. */
export const TOPIC_GUIDES: Array<{ test: RegExp; build: GuideBuilder }> = [
  {
    test: /wireshark|pcap|packet analysis|tcpdump/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("wireshark", "TryHackMe — Wireshark 101"), doc("https://www.wireshark.org/docs/dfref/", "Wireshark display filters"), lab("https://www.malware-traffic-analysis.net/", "Malware Traffic Analysis PCAPs"), oakResource(konu)],
        ["Capture HTTP/DNS in lab VM", "Apply display filters for one protocol", "Export PCAP; note 3 IOCs"],
        [
          { action: "Review Wireshark filter reference (15 min)", durationMin: 15, logHint: "3 filters to use" },
          { action: "Complete THM Wireshark 101 (or first 5 tasks)", durationMin: 30, logHint: "Room progress %" },
          { action: "Analyze one Malware Traffic Analysis PCAP", durationMin: 20, logHint: "1 suspicious host + why" },
          { action: "Log: PCAP filename + 3 IOCs", durationMin: 5, logHint: "Evidence URL or filename" },
        ],
      ),
  },
  {
    test: /subnet|cidr|subnet mask/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("introtonetworking", "TryHackMe — Intro to Networking"), doc("https://www.subnet-calculator.com/", "Subnet calculator"), oakResource(konu)],
        ["Calculate 5 subnet scenarios by hand", "Identify network/broadcast/host for a /26", "Relate to SOC: internal vs external IP in alerts"],
        standardStudySteps(konu, 20),
      ),
  },
  {
    test: /osi model|tcp\/ip|encapsulation|mac vs ip/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("introtonetworking", "TryHackMe — Intro to Networking"), doc("https://www.cloudflare.com/learning/network-layer/what-is-the-osi-model/", "Cloudflare — OSI model"), oakResource(konu)],
        ["Draw OSI 7 layers with one protocol each", "Trace encapsulation for HTTPS request", "Map layer to Wireshark pane"],
        standardStudySteps(konu),
      ),
  },
  {
    test: /arp/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("introtonetworking", "TryHackMe — Intro to Networking"), doc("https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/arp-caching", "Microsoft — ARP"), oakResource(konu)], ["Run arp -a; explain request/reply", "Capture ARP in Wireshark", "Note ARP spoofing relevance for SOC"], standardStudySteps(konu, 20)),
  },
  {
    test: /vlan|collision domain|broadcast domain|ethernet frame/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("introtonetworking", "TryHackMe — Intro to Networking"), oakResource(konu)], ["Explain VLAN tagging purpose", "Compare collision vs broadcast domain", "Sketch small office VLAN layout"], standardStudySteps(konu)),
  },
  {
    test: /nat|private vs public|default gateway|loopback|link-local/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("introtonetworking", "TryHackMe — Intro to Networking"), doc("https://www.cloudflare.com/learning/network-layer/what-is-nat/", "Cloudflare — NAT"), oakResource(konu)], ["Identify private RFC1918 ranges", "Explain SNAT vs DNAT in one sentence each", "Trace packet path through gateway"], standardStudySteps(konu)),
  },
  {
    test: /dhcp/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("dhcp", "TryHackMe — DHCP"), doc("https://datatracker.ietf.org/doc/html/rfc2131", "RFC 2131 — DHCP"), oakResource(konu)],
        ["Explain DORA in your own words", "Capture DHCP handshake in Wireshark", "Troubleshoot simulated lease failure"],
        [
          { action: "Study DORA process and lease timers", durationMin: 15, logHint: "DORA one-liner each letter" },
          { action: "Capture DHCP handshake (filter bootp/dhcp)", durationMin: 20, logHint: "Screenshot of 4-message flow" },
          { action: "THM DHCP room or Oak lab equivalent", durationMin: 25, logHint: "Lab completion note" },
          { action: "Add 3 recall questions to review queue", durationMin: 10, logHint: "3 questions" },
        ],
      ),
  },
  {
    test: /dns/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("dnsindetail", "TryHackMe — DNS in Detail"), doc("https://www.cloudflare.com/learning/dns/what-is-dns/", "Cloudflare — How DNS works"), oakResource(konu)],
        ["Trace recursive lookup with dig/nslookup", "Identify A, CNAME, MX, TXT in a zone", "Spot DNS tunneling indicators in sample log"],
        [
          { action: "Review DNS hierarchy and record types", durationMin: 15, logHint: "Draw query flow in 4 steps" },
          { action: "Run dig +trace; screenshot key lines", durationMin: 15, logHint: "dig output snippet" },
          { action: "Complete THM DNS room tasks", durationMin: 25, logHint: "Tasks completed" },
          { action: "Write 3 flashcard Q&As for record types", durationMin: 10, logHint: "3 Q&A headlines" },
        ],
      ),
  },
  {
    test: /icmp|ping|traceroute/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("introtonetworking", "TryHackMe — Intro to Networking"), oakResource(konu)], ["Run ping and traceroute to external host", "Identify TTL and ICMP type in capture", "Note when ICMP appears in SOC alerts"], standardStudySteps(konu, 15)),
  },
  {
    test: /tcp.*handshake|syn.*ack|tcp vs udp|port range|well-known/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("introtonetworking", "TryHackMe — Intro to Networking"), doc("https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/", "Cloudflare — TCP/IP"), oakResource(konu)], ["Draw 3-way handshake", "List 5 well-known ports with services", "Compare TCP vs UDP use cases"], standardStudySteps(konu)),
  },
  {
    test: /critical port|^port|port \d/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [doc("https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", "IANA port registry"), thm("introtonetworking", "TryHackMe — Intro to Networking"), oakResource(konu)],
        ["Memorize top 15 SOC-relevant ports", "Map port → service → typical log source", "Use netstat/ss to verify listening ports"],
        [
          { action: "Build port cheat sheet (22, 53, 80, 443, 445, 3389…)", durationMin: 15, logHint: "15 ports listed" },
          { action: "Run netstat -ano or ss -tuln; match to cheat sheet", durationMin: 15, logHint: "3 active services" },
          { action: "Write 5 flashcards: port → service → risk", durationMin: 10, logHint: "Highest-risk port" },
        ],
      ),
  },
  {
    test: /http|status code|request method/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("contentdiscovery", "TryHackMe — Content Discovery"), doc("https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "MDN HTTP status codes"), oakResource(konu)], ["Inspect HTTP request/response in browser devtools", "List 5 common status codes", "Capture HTTP in Wireshark"], standardStudySteps(konu)),
  },
  {
    test: /https|ssl|tls|certificate|pki|ocsp|handshake/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("sslstrip", "TryHackMe — SSL/Trip (TLS basics)"), doc("https://www.cloudflare.com/learning/ssl/what-is-ssl/", "Cloudflare — TLS"), oakResource(konu)],
        ["Inspect certificate chain in browser", "Explain symmetric vs asymmetric in TLS", "Note cert expiry alerts in SOC"],
        standardStudySteps(konu),
      ),
  },
  {
    test: /smtp|imap|pop3|email protocol/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("snortchallenges2", "TryHackMe — Snort (email traffic context)"), oakResource(konu)], ["Map SMTP/IMAP/POP3 to ports", "Read email headers for phishing triage", "Identify SPF/DKIM fields"], standardStudySteps(konu)),
  },
  {
    test: /ssh|telnet|rdp|ftp|sftp|smb/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("linuxfundamentalspart1", "TryHackMe — Linux Fundamentals"), doc("https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/", "Microsoft — RDP"), oakResource(konu)],
        ["Connect via SSH to lab VM", "Compare Telnet vs SSH security", "Note RDP (3389) and SMB (445) in SOC alerts"],
        standardStudySteps(konu, 20),
      ),
  },
  {
    test: /snmp|ntp|network topology|switch.*router|dmz|nac|proxy|load balancer/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("introtonetworking", "TryHackMe — Intro to Networking"), oakResource(konu)], ["Sketch star vs mesh topology", "Explain DMZ purpose", "List device roles: switch vs router vs AP"], standardStudySteps(konu)),
  },
  {
    test: /netstat|connection analysis/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("linuxfundamentalspart1", "TryHackMe — Linux Fundamentals"), oakResource(konu)], ["Run netstat -ano and ss -tuln", "Identify ESTABLISHED vs LISTENING", "Correlate PID to process"], standardStudySteps(konu, 20)),
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
    test: /linux.*command|bash|chmod|chown|systemctl|\/etc\/passwd|apt|dpkg|filesystem hierarchy|process|df|du|tar|gzip|remote.*ssh/i,
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
    test: /mitre|kill chain|apt|zero trust|iam|iaaa|mfa|sso|defense in depth|cia triad|threat.*vulner|risk|exploit|zero-day|cve|blue.*red.*purple/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [MITRE, thm("mitre", "TryHackMe — MITRE"), thm("introductoryresearching", "TryHackMe — Introductory Researching"), oakResource(konu)],
        ["Map one attack technique to MITRE ID", "Explain CIA triad with SOC example", "Describe defense-in-depth layers"],
        standardStudySteps(konu),
      ),
  },
  {
    test: /phishing|social engineering|malware|virus|worm|trojan|ransomware|spyware|rootkit|hacker type/i,
    build: ({ konu }) =>
      mkGuide(
        konu,
        [thm("phishing", "TryHackMe — Phishing"), thm("phishingemails", "TryHackMe — Phishing Emails in Action"), doc("https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks", "CISA — Phishing guidance"), oakResource(konu)],
        ["Analyze sample phishing email header", "List 5 user-reporting indicators", "Map attack stage to Kill Chain / MITRE"],
        [
          { action: "Review malware/phishing taxonomy in Oak notes", durationMin: 15, logHint: "3 malware types + example" },
          { action: "Analyze one sample phish (EML or room artifact)", durationMin: 20, logHint: "Suspicious header field" },
          { action: "THM Phishing room section", durationMin: 25, logHint: "Progress" },
          { action: "Draft SOC playbook: detect → contain → report", durationMin: 10, logHint: "3 playbook bullets" },
        ],
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
    test: /cloud|docker|hypervisor|virtualization|vm vs container/i,
    build: ({ konu }) =>
      mkGuide(konu, [thm("introductorydocker", "TryHackMe — Intro to Docker"), doc("https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/", "Microsoft — Hyper-V"), oakResource(konu)], ["Compare Type 1 vs Type 2 hypervisor", "Run one docker command in lab", "Note cloud log sources for SOC"], standardStudySteps(konu)),
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
        [thm("vulnversity", "TryHackMe — Vulnversity"), doc("https://docs.tenable.com/nessus/Content/GettingStarted.htm", "Nessus — getting started"), JR_PENTEST, oakResource(konu)],
        ["Compare vulnerability scan vs penetration test", "Prioritize findings by CVSS and exploitability", "Draft remediation ticket for one finding"],
        [
          { action: "Review vulnerability management lifecycle", durationMin: 15, logHint: "4 lifecycle stages" },
          { action: "Run or review a scan output (THM room or sample report)", durationMin: 30, logHint: "Top 3 CVEs" },
          { action: "Write defender detection idea for mass scanning", durationMin: 15, logHint: "1 detection bullet" },
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
    test: /grc|governance|risk|compliance/i,
    build: ({ konu }) =>
      mkGuide(konu, [doc("https://www.nist.gov/cyberframework", "NIST Cybersecurity Framework"), oakResource(konu)], ["Define GRC in SOC context", "List 3 compliance drivers (GDPR, ISO 27001)", "Relate to ticket documentation"], standardStudySteps(konu, 15)),
  },
];

/** Fallback guides keyed by curriculum domain (alan). */
export const ALAN_GUIDES: Record<string, GuideBuilder> = {
  net: ({ konu }) =>
    mkGuide(
      konu,
      [PRE_SEC, thm("introtonetworking", "TryHackMe — Intro to Networking"), oakResource(konu)],
      [`Follow Oak networking order for ${konu}`, "Capture or diagram one protocol example", "Connect to Wireshark or netstat practice"],
      standardStudySteps(konu),
    ),
  linux: ({ konu }) =>
    mkGuide(
      konu,
      [thm("linuxfundamentalspart1", "TryHackMe — Linux Fundamentals"), doc("https://man7.org/linux/man-pages/", "Linux man pages"), oakResource(konu)],
      ["Practice commands in live VM without copy-paste", "Check /var/log for relevant entries", "Relate to SOC log analysis"],
      standardStudySteps(konu, 25),
    ),
  win: ({ konu }) =>
    mkGuide(
      konu,
      [thm("windowseventlogs", "TryHackMe — Windows Event Logs"), thm("attacktivedirectory", "TryHackMe — Attacktive Directory"), oakResource(konu)],
      ["Use PowerShell or GUI for admin task", "Identify relevant Event ID", "Map to enterprise SOC scenario"],
      standardStudySteps(konu, 25),
    ),
  secfund: ({ konu }) =>
    mkGuide(
      konu,
      [PRE_SEC, MITRE, thm("introductoryresearching", "TryHackMe — Introductory Researching"), oakResource(konu)],
      ["Link concept to MITRE or Kill Chain stage", "Write one SOC-relevant example", "Add to FSRS after first pass"],
      standardStudySteps(konu),
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
  def: ({ konu }) =>
    mkGuide(
      konu,
      [SOC_L1, LETS_DEFEND, CYBER_DEF, oakResource(konu)],
      ["Follow SOC triage workflow", "Produce one artifact or screenshot", "Tie to Gate B/C evidence if lab"],
      standardStudySteps(konu, 30),
    ),
  off: ({ konu }) =>
    mkGuide(
      konu,
      [JR_PENTEST, PRE_SEC, thm("nmap", "TryHackMe — Nmap"), thm("owasptop10", "TryHackMe — OWASP Top 10"), HTB_START, MITRE, oakResource(konu)],
      [
        "Learn the attack technique in an authorized lab only",
        "Map to MITRE ATT&CK and one defender detection point",
        "Log evidence: command, screenshot, or write-up section",
      ],
      [
        { action: `Review Oak / curriculum notes: ${konu}`, durationMin: 15, logHint: "3 attack steps" },
        { action: "Hands-on: THM Jr Pentest, Nmap, or HTB Starting Point task", durationMin: 35, logHint: "Room or machine name" },
        { action: "Write defender view: what log or alert would fire?", durationMin: 15, logHint: "Log source + Event ID" },
        { action: "Add MITRE technique ID to session log", durationMin: 5, logHint: "Txxxx.xxx" },
      ],
    ),
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
  { test: /offensive|pentest|htb starting|jr pentest|attack.*write-?up/i, build: () => PORTFOLIO_PROJECTS[5].guide },
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
  return {
    topic: konu,
    resources: [
      doc("https://learngerman.dw.com/", "DW Learn German — B1 track"),
      doc("https://www.goethe.de/en/index.html", "Goethe-Institut — courses & exams"),
      doc("https://ankiweb.net/shared/decks/german", "Anki — German decks"),
      doc("https://www.deutsch-lernen.com/", "Deutsch-lernen — grammar & vocabulary"),
      doc("https://www.it-sicherheitsbeauftragter.de/glossar/", "IT security glossary (DE)"),
    ],
    actions: [
      "15 min speaking or shadowing (DW or podcast)",
      "Learn 10 SOC-relevant German terms (Alarm, Vorfall, Protokoll, Warnung…)",
      "Summarize one technical topic in 3 German sentences",
      "Practice B1 listening: note 5 new words with context",
    ],
    steps: steps(
      { action: "Warm-up: review yesterday's vocabulary aloud", durationMin: 5, logHint: "Words reviewed" },
      { action: "DW or Goethe listening/reading block (B1 if available)", durationMin: 20, logHint: "Source title" },
      { action: "Learn 5 IT-Security German terms; use in sentences", durationMin: 10, logHint: "5 terms + examples" },
      { action: "Speaking: summarize today's cyber topic in German", durationMin: 10, logHint: "Self-rating" },
      { action: "Log language session with duration", durationMin: 2, logHint: "Minutes + quality" },
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
    [SOC_L1, doc("https://documentation.wazuh.com/current/getting-started/index.html", "Wazuh getting started"), LETS_DEFEND],
    ["Boot lab VMs; verify log ingestion", "Produce screenshot, PCAP, or detection rule", "Tie output to Gate B/C portfolio evidence"],
    [
      { action: "Boot lab VMs; verify stack status", durationMin: 15, logHint: "Stack status" },
      { action: "Complete core lab task (detection or analysis)", durationMin: 45, logHint: "Task name" },
      { action: "Capture evidence (screenshot/PCAP/export)", durationMin: 10, logHint: "Evidence path or URL" },
      { action: "Log lab session with artifact reference", durationMin: 5, logHint: "Artifact type" },
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
          { action: `Read Oak section: ${konu}`, durationMin: 20, logHint: "3 bullet summary" },
          { action: "Hands-on: one command or diagram in lab", durationMin: 15, logHint: "Command or diagram" },
          { action: "Write 3 exam-style questions", durationMin: 10, logHint: "Question headlines" },
          { action: "Mark topic on map; log session", durationMin: 5, logHint: "Map status" },
        ],
      );
    default:
      return mkGuide(
        konu,
        [oakResource(konu), doc(`https://tryhackme.com/hacktivities/search?query=${encodeURIComponent(konu)}`, "TryHackMe search")],
        [`Study ${konu} in weak ${alanLabel} area`, "Connect theory to one SOC-relevant example", "Queue for spaced repetition after session"],
        standardStudySteps(konu),
      );
  }
}
