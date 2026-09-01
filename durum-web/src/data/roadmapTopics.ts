import type { Difficulty } from "../model";

/** Suggested FSRS topics — junior SOC selection from roadmap.sh cyber-security. Not auto-added. */
export type SuggestedTopic = {
  id: string;
  topic: string;
  alan: string;
  difficulty: Difficulty;
  /** true = post–junior SOC / deep dive */
  later?: boolean;
};

export const ROADMAP_SUGGESTIONS: SuggestedTopic[] = [
  // Networking
  { id: "rm-osi", topic: "OSI model (layers)", alan: "net", difficulty: "kolay" },
  { id: "rm-ports", topic: "Common ports and protocols", alan: "net", difficulty: "kolay" },
  { id: "rm-subnet", topic: "Subnetting / CIDR basics", alan: "net", difficulty: "orta" },
  { id: "rm-dns", topic: "DNS (query/response, record types)", alan: "net", difficulty: "orta" },
  { id: "rm-dhcp", topic: "DHCP / NAT / public vs private IP", alan: "net", difficulty: "kolay" },
  { id: "rm-tls", topic: "SSL/TLS basics", alan: "net", difficulty: "orta" },
  { id: "rm-vpn", topic: "VPN concept", alan: "net", difficulty: "kolay" },
  { id: "rm-vlan", topic: "VLAN / DMZ / segmentation", alan: "netsec", difficulty: "orta" },
  { id: "rm-pcap", topic: "Packet capture (Wireshark / tcpdump)", alan: "net", difficulty: "orta" },
  { id: "rm-nmap", topic: "nmap basics (recon awareness)", alan: "off", difficulty: "orta" },

  // Linux
  { id: "rm-linux-perm", topic: "Linux permissions / users", alan: "linux", difficulty: "orta" },
  { id: "rm-linux-cli", topic: "Linux CLI: grep/head/tail/journalctl", alan: "linux", difficulty: "orta" },
  { id: "rm-linux-svc", topic: "systemctl / service management", alan: "linux", difficulty: "orta" },
  { id: "rm-linux-fw", topic: "UFW / iptables basics", alan: "linux", difficulty: "zor" },
  { id: "rm-linux-logs", topic: "Linux syslog /var/log", alan: "linux", difficulty: "orta" },

  // Windows
  { id: "rm-win-evt", topic: "Windows Event Log (Security/System)", alan: "win", difficulty: "zor" },
  { id: "rm-win-gpo", topic: "Group Policy / ACL basics", alan: "win", difficulty: "zor" },
  { id: "rm-win-auth", topic: "Kerberos / LDAP / SSO concept", alan: "win", difficulty: "zor" },
  { id: "rm-win-pwr", topic: "PowerShell basic reading", alan: "win", difficulty: "orta" },

  // Security fundamentals
  { id: "rm-cia", topic: "CIA triad + threat model", alan: "secfund", difficulty: "kolay" },
  { id: "rm-aaa", topic: "Authentication vs Authorization + MFA", alan: "secfund", difficulty: "kolay" },
  { id: "rm-kill", topic: "Cyber Kill Chain / ATT&CK awareness", alan: "secfund", difficulty: "orta" },
  { id: "rm-risk", topic: "Risk definition + false positive/negative", alan: "secfund", difficulty: "kolay" },
  { id: "rm-ir", topic: "IR process: Prep→Identify→Contain→Eradicate→Recover", alan: "def", difficulty: "orta" },
  { id: "rm-social", topic: "Social engineering / phishing types", alan: "secfund", difficulty: "kolay" },
  { id: "rm-malware", topic: "Malware types + EDR/AV concept", alan: "secfund", difficulty: "orta" },

  // Crypto
  { id: "rm-crypto", topic: "Hashing / salting / symmetric vs asymmetric", alan: "crypto", difficulty: "orta" },
  { id: "rm-pki", topic: "PKI / certificate basics", alan: "crypto", difficulty: "orta" },

  // Network security / defensive
  { id: "rm-fw", topic: "Firewall / NGFW / IDS-IPS", alan: "netsec", difficulty: "orta" },
  { id: "rm-hardening", topic: "OS hardening + patching", alan: "netsec", difficulty: "orta" },
  { id: "rm-secure-proto", topic: "Secure vs insecure protocols (FTP/SFTP, HTTP/HTTPS)", alan: "netsec", difficulty: "kolay" },

  // SIEM / SOC
  { id: "rm-siem", topic: "SIEM concept (correlation, alert)", alan: "siem", difficulty: "orta" },
  { id: "rm-logs", topic: "Log sources: event / syslog / netflow / firewall", alan: "siem", difficulty: "orta" },
  { id: "rm-triage", topic: "SOC triage thought chain", alan: "def", difficulty: "zor" },
  { id: "rm-runbook", topic: "Runbook / playbook concept", alan: "def", difficulty: "kolay" },
  { id: "rm-diamond", topic: "Diamond Model basics", alan: "def", difficulty: "orta" },

  // Web (awareness)
  { id: "rm-owasp", topic: "OWASP Top 10 awareness", alan: "off", difficulty: "orta" },
  { id: "rm-xss-sqli", topic: "XSS / SQLi / CSRF (defense perspective)", alan: "off", difficulty: "orta" },

  // Python
  { id: "rm-py-parse", topic: "Log parsing / simple automation with Python", alan: "py", difficulty: "orta" },
  { id: "rm-bash", topic: "Basic Bash scripting", alan: "linux", difficulty: "orta" },

  // Cloud — secondary at junior level
  { id: "rm-cloud-models", topic: "IaaS / PaaS / SaaS + shared responsibility", alan: "cloud", difficulty: "kolay", later: true },
  { id: "rm-cloud-aws", topic: "AWS/Azure security basics", alan: "cloud", difficulty: "orta", later: true },

  // Later / beyond junior SOC
  { id: "rm-soar", topic: "SOAR concept", alan: "siem", difficulty: "zor", later: true },
  { id: "rm-threat-hunt", topic: "Threat hunting basics", alan: "def", difficulty: "zor", later: true },
  { id: "rm-forensics", topic: "Forensics basics (disk/memory)", alan: "def", difficulty: "zor", later: true },
  { id: "rm-re", topic: "Reverse engineering awareness", alan: "off", difficulty: "zor", later: true },
  { id: "rm-pentest", topic: "Penetration testing RoE / methodology", alan: "off", difficulty: "zor", later: true },
  { id: "rm-zerotrust", topic: "Zero Trust concept", alan: "secfund", difficulty: "orta", later: true },
];
