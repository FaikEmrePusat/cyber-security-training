import type { Difficulty } from "../model";

/** Önerilen FSRS konuları — roadmap.sh cyber-security'den junior SOC odaklı seçki. Otomatik eklenmez. */
export type SuggestedTopic = {
  id: string;
  topic: string;
  alan: string;
  difficulty: Difficulty;
  /** true = junior SOC sonrası / derinleşme */
  later?: boolean;
};

export const ROADMAP_SUGGESTIONS: SuggestedTopic[] = [
  // Networking
  { id: "rm-osi", topic: "OSI modeli (katmanlar)", alan: "net", difficulty: "kolay" },
  { id: "rm-ports", topic: "Yaygın portlar ve protokolleri", alan: "net", difficulty: "kolay" },
  { id: "rm-subnet", topic: "Subnetting / CIDR temelleri", alan: "net", difficulty: "orta" },
  { id: "rm-dns", topic: "DNS (query/response, kayıt türleri)", alan: "net", difficulty: "orta" },
  { id: "rm-dhcp", topic: "DHCP / NAT / public vs private IP", alan: "net", difficulty: "kolay" },
  { id: "rm-tls", topic: "SSL/TLS temelleri", alan: "net", difficulty: "orta" },
  { id: "rm-vpn", topic: "VPN kavramı", alan: "net", difficulty: "kolay" },
  { id: "rm-vlan", topic: "VLAN / DMZ / segmentasyon", alan: "netsec", difficulty: "orta" },
  { id: "rm-pcap", topic: "Packet capture (Wireshark / tcpdump)", alan: "net", difficulty: "orta" },
  { id: "rm-nmap", topic: "nmap temelleri (keşif farkındalığı)", alan: "off", difficulty: "orta" },

  // Linux
  { id: "rm-linux-perm", topic: "Linux permissions / kullanıcılar", alan: "linux", difficulty: "orta" },
  { id: "rm-linux-cli", topic: "Linux CLI: grep/head/tail/journalctl", alan: "linux", difficulty: "orta" },
  { id: "rm-linux-svc", topic: "systemctl / servis yönetimi", alan: "linux", difficulty: "orta" },
  { id: "rm-linux-fw", topic: "UFW / iptables temelleri", alan: "linux", difficulty: "zor" },
  { id: "rm-linux-logs", topic: "Linux syslog /var/log", alan: "linux", difficulty: "orta" },

  // Windows
  { id: "rm-win-evt", topic: "Windows Event Log (Security/System)", alan: "win", difficulty: "zor" },
  { id: "rm-win-gpo", topic: "Group Policy / ACL temelleri", alan: "win", difficulty: "zor" },
  { id: "rm-win-auth", topic: "Kerberos / LDAP / SSO kavramı", alan: "win", difficulty: "zor" },
  { id: "rm-win-pwr", topic: "PowerShell temel okuma", alan: "win", difficulty: "orta" },

  // Security fundamentals
  { id: "rm-cia", topic: "CIA triad + threat model", alan: "secfund", difficulty: "kolay" },
  { id: "rm-aaa", topic: "Authentication vs Authorization + MFA", alan: "secfund", difficulty: "kolay" },
  { id: "rm-kill", topic: "Cyber Kill Chain / ATT&CK farkındalığı", alan: "secfund", difficulty: "orta" },
  { id: "rm-risk", topic: "Risk tanımı + false positive/negative", alan: "secfund", difficulty: "kolay" },
  { id: "rm-ir", topic: "IR süreci: Prep→Identify→Contain→Eradicate→Recover", alan: "def", difficulty: "orta" },
  { id: "rm-social", topic: "Social engineering / phishing türleri", alan: "secfund", difficulty: "kolay" },
  { id: "rm-malware", topic: "Malware türleri + EDR/AV kavramı", alan: "secfund", difficulty: "orta" },

  // Crypto
  { id: "rm-crypto", topic: "Hashing / salting / simetrik vs asimetrik", alan: "crypto", difficulty: "orta" },
  { id: "rm-pki", topic: "PKI / sertifika temelleri", alan: "crypto", difficulty: "orta" },

  // Network security / defensive
  { id: "rm-fw", topic: "Firewall / NGFW / IDS-IPS", alan: "netsec", difficulty: "orta" },
  { id: "rm-hardening", topic: "OS hardening + patching", alan: "netsec", difficulty: "orta" },
  { id: "rm-secure-proto", topic: "Güvenli vs güvensiz protokoller (FTP/SFTP, HTTP/HTTPS)", alan: "netsec", difficulty: "kolay" },

  // SIEM / SOC
  { id: "rm-siem", topic: "SIEM kavramı (korelasyon, alert)", alan: "siem", difficulty: "orta" },
  { id: "rm-logs", topic: "Log kaynakları: event / syslog / netflow / firewall", alan: "siem", difficulty: "orta" },
  { id: "rm-triage", topic: "SOC triage düşünce zinciri", alan: "def", difficulty: "zor" },
  { id: "rm-runbook", topic: "Runbook / playbook kavramı", alan: "def", difficulty: "kolay" },
  { id: "rm-diamond", topic: "Diamond Model temelleri", alan: "def", difficulty: "orta" },

  // Web (awareness)
  { id: "rm-owasp", topic: "OWASP Top 10 farkındalığı", alan: "off", difficulty: "orta" },
  { id: "rm-xss-sqli", topic: "XSS / SQLi / CSRF (savunma perspektifi)", alan: "off", difficulty: "orta" },

  // Python
  { id: "rm-py-parse", topic: "Python ile log parse / basit otomasyon", alan: "py", difficulty: "orta" },
  { id: "rm-bash", topic: "Bash temel scripting", alan: "linux", difficulty: "orta" },

  // Cloud — junior'da ikincil
  { id: "rm-cloud-models", topic: "IaaS / PaaS / SaaS + shared responsibility", alan: "cloud", difficulty: "kolay", later: true },
  { id: "rm-cloud-aws", topic: "AWS/Azure güvenlik temelleri", alan: "cloud", difficulty: "orta", later: true },

  // Later / beyond junior SOC
  { id: "rm-soar", topic: "SOAR kavramı", alan: "siem", difficulty: "zor", later: true },
  { id: "rm-threat-hunt", topic: "Threat hunting temelleri", alan: "def", difficulty: "zor", later: true },
  { id: "rm-forensics", topic: "Forensics temelleri (disk/memory)", alan: "def", difficulty: "zor", later: true },
  { id: "rm-re", topic: "Reverse engineering farkındalığı", alan: "off", difficulty: "zor", later: true },
  { id: "rm-pentest", topic: "Penetration testing RoE / metodoloji", alan: "off", difficulty: "zor", later: true },
  { id: "rm-zerotrust", topic: "Zero Trust kavramı", alan: "secfund", difficulty: "orta", later: true },
];
