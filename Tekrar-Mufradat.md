# Tekrar · Müfredat karşılaştırma

Oak Academy’de işlenen konular ↔ [roadmap.sh/cyber-security](https://roadmap.sh/cyber-security) boşluk analizi.

**Kaynak:** roadmap düğümleri `https://roadmap.sh/api/v1-official-roadmap/cyber-security` üzerinden alındı (2026-08). Etiketler İngilizce; Durum uygulamasında Türkçe/özet konu yazılabilir.

---

## İş akışı

1. **Notları bırak (tercih)** — Ders notlarını `Oak-Study-Notes/` klasörüne koy (PDF/TXT/MD) veya sohbette yapıştır. Ayrıntı: `Oak-Study-Notes/README.md`. Agent yalnızca notlarda geçen konuları çıkarır → Oak checklist + Tekrar satırları.
2. **Oak listesini elle de doldurabilirsin** — Aşağıdaki `## Oak (kullanıcı doldurur)` bölümüne, kursunda işlenen her konuyu bir satır `- [ ] …` olarak ekle (veya tek blok halinde not düş).
3. **Birleştir** — Oak maddelerini roadmap kontrol listesiyle karşılaştır; ortak olanları her iki tarafta da işaretle.
4. **Boşlukları seç** — Roadmap’te olup Oak’ta olmayanlardan **öğrendiğin / öğrenmekte olduğun** konuları Durum → **Tekrar** sayfasına ekle (`Konu ekle`, `Toplu ekle` veya `Önerilenlerden ekle`).
5. **Kuyruk ≠ tüm yol haritası** — FSRS kuyruğuna yalnızca öğrenilmiş veya aktif öğrenilen konular girer. Tüm roadmap’i dump etme; lab sonrası ekleme &lt;15 sn hedefi.

Alan id’leri (toplu ekle: `alan|zorluk|konu`): `net` · `linux` · `win` · `secfund` · `crypto` · `netsec` · `siem` · `def` · `off` · `py` · `cloud` · `port`

**Toplu ekle dosyası (işlenen):** `Oak-Study-Notes/TEKRAR-EKLE.txt` · **Yaklaşan:** `TEKRAR-SONRA.txt` · **Özet:** `OZET.md` · **UI:** Durum → **Harita** (`/harita`)

---

## Oak (işlenen — EDR dahil)

> Kaynak: `Oak-Study-Notes/` PDF sunum + study note’lar (2026-08-27 tarama). Yalnızca dosya içeriği / adından kanıtlanan konular. **Kurs konumu: EDR.**

### IT Fundamentals

- [x] Bilgisayar bileşenleri (CPU, GPU, anakart, RAM/ROM, HDD/SSD)
- [x] Binary / bit-byte / ASCII
- [x] Depolama: NAS, SAN, bulut depolama riskleri
- [x] Ağ donanımı: NIC, hub, switch, router, modem, WAP
- [x] IoT ve mobil tehditler (juice jacking, jailbreak/root, zero-day)
- [x] İşletim sistemi temelleri (Windows / Linux / macOS; EOL)
- [x] Uygulama / servis / process / CLI & GUI
- [x] Sanallaştırma (Hypervisor Type 1/2, snapshot, VMware/VirtualBox)
- [x] Konteyner vs VM (Docker / Kubernetes farkındalık)
- [x] Cloud computing temelleri
- [x] Siber güvenlik kariyer / öğrenme metodolojisi (program özeti)

### Network Fundamentals

- [x] Ağ / internet / protokol kavramı
- [x] OSI modeli
- [x] TCP/IP modeli ve kapsülleme
- [x] Veri bağlantı katmanı: Ethernet, MAC, CSMA/CD
- [x] Collision / broadcast domain
- [x] ARP
- [x] VLAN
- [x] WLAN (SSID / BSSID / ESSID)
- [x] Ağ katmanı: IPv4/IPv6, TTL, NAT
- [x] Private vs public IP, loopback, link-local
- [x] Subnetting / CIDR / subnet mask / default gateway
- [x] DHCP (DORA), ICMP
- [x] ping / traceroute / ipconfig / ifconfig
- [x] Taşıma katmanı: TCP, UDP, portlar
- [x] TCP 3-way handshake
- [x] DNS hiyerarşisi, kayıt tipleri, nslookup/dig, Whois
- [x] Uygulama katmanı: HTTP/HTTPS, durum kodları, cookies
- [x] SMTP / IMAP / POP3
- [x] SSH / Telnet / RDP / FTP / SMB / SNMP / NTP
- [x] Ağ topolojileri (star / bus / ring / mesh / hybrid)
- [x] Switch / Router / Access Point
- [x] Load balancer (L4/L7)
- [x] Proxy sunucu
- [x] DMZ
- [x] NAC
- [x] Wireshark / tcpdump / netstat / Network Miner
- [x] Network101 lab

### Server Management — Linux

- [x] Linux giriş (kernel, distro, shell, Kali farkındalık)
- [x] Linux temel komutlar
- [x] Kullanıcı yönetimi (/etc/passwd, /etc/shadow, adduser, usermod)
- [x] Gruplar, sudo, su
- [x] Dosya sistemi hiyerarşisi
- [x] Dosya izinleri (chmod / chown / least privilege)
- [x] Linux ağ yapılandırması (ifconfig, ip addr, netstat)
- [x] tcpdump (Linux)
- [x] Process yönetimi (ps, top, pstree, kill)
- [x] Servis yönetimi (systemctl / service)
- [x] Sistem izleme (df, du, /proc, vmstat)
- [x] tar / gzip arşivleme
- [x] Paket yönetimi (APT/DPKG; Yum/DNF farkındalık)
- [x] SSH uzaktan erişim

### Server Management — Windows & AD

- [x] İşletim sistemleri / sunucu türleri
- [x] Windows Server temelleri ve yaşam döngüsü (EOL)
- [x] Server Manager (rol / özellik)
- [x] Windows Administrative Tools / Computer Management
- [x] Process / Task Manager
- [x] Windows Services
- [x] RDP
- [x] Windows DHCP / DNS / IIS
- [x] Windows Commandline / PowerShell
- [x] SMB paylaşım / NTFS izinleri
- [x] Windows Defender Firewall
- [x] Registry / Task Scheduler / Device Manager / Disk Management
- [x] Active Directory (Domain, DC, OU, ADUC)
- [x] LDAP / Kerberos / NTLM / NTDS.dit / SAM
- [x] AD kullanıcı ve grup yönetimi
- [x] Group Policy (GPO, parola/lockout, gpupdate)

### Intro To Security

- [x] CIA triad
- [x] Defense in Depth
- [x] Threat / Vulnerability / Risk / Exploit / Zero-Day / CVE / Backdoor / Botnet
- [x] Blue / Red / Purple Team
- [x] Zero Trust / least privilege / attack surface
- [x] Malware türleri
- [x] Hacker türleri
- [x] Cyber Kill Chain
- [x] APT
- [x] MITRE ATT&CK farkındalığı
- [x] Sosyal mühendislik / phishing
- [x] DoS/DDoS, spoofing/sniffing, SQLi/XSS, brute force (farkındalık)
- [x] IAM / IAAA / MFA / SSO / Directory (AD, Entra ID, LDAP)
- [x] Pentest adımları (yüksek seviye)
- [x] Stuxnet / ICS farkındalık
- [x] VirusTotal / HaveIBeenPwned / Shodan farkındalık

### Cryptography

- [x] Encryption vs Hashing vs Encoding vs Obfuscation
- [x] Simetrik / asimetrik (AES, RSA, Diffie-Hellman, ECC)
- [x] Hash (SHA-256; MD5/SHA-1 zayıf)
- [x] Dijital imza
- [x] PKI / CA / sertifika zinciri / OCSP / CRL
- [x] SSL/TLS / HTTPS / TLS handshake
- [x] MAC / HMAC
- [x] E2EE
- [x] SSH anahtar doğrulama
- [x] Parola hash: salt / pepper / bcrypt / Argon2
- [x] CyberChef / OpenSSL / steganografi farkındalık

### Firewall / Network Security

- [x] Firewall türleri (packet filter, proxy, WAF, NGFW)
- [x] Host vs network firewall
- [x] Implicit Deny / Deny All / HA
- [x] FortiGate arayüz ve politika yönetimi
- [x] FortiGate NAT / VIP
- [x] NGFW: App Control, Web Filter, DNS Filter, ISDB
- [x] SSL Inspection (certificate vs deep)
- [x] IDS vs IPS
- [x] WAF / OWASP Top 10 koruması
- [x] VPN / IPSec (Remote Access, Site-to-Site)
- [x] SSL VPN (FortiClient)

### EDR / Endpoint

- [x] Antivirus (imza / heuristic)
- [x] EDR vs AV; ajan–konsol mimarisi (Sophos)
- [x] Tamper Protection
- [x] Endpoint izolasyon (quarantine)
- [x] Threat Graph / Live Discover
- [x] EDR politikaları (scan, USB, app/web control)
- [x] DLP / BitLocker / FIM / Lockdown
- [x] SOC analist iş akışı
- [x] Sandboxing / fileless / LOLBins farkındalık
- [x] Synchronized Security / Data Lake farkındalık

---

## Oak — Yaklaşan / Sonra (EDR sonrası)

> Not yok. Checklist’te “işlenen” sayılmaz. FSRS’e varsayılan eklenmez. Kaynak: `TEKRAR-SONRA.txt`.

- [ ] Network Scanning (Nmap) — `off`
- [ ] Vulnerability Scanning & Management (Nessus) — `off`
- [ ] Project 2: Vulnerability Management — `off`
- [ ] Exploitation — `off`
- [ ] Project 3: Exploitation — `off`
- [ ] SIEM / Splunk / Incident Response — `siem`
- [ ] Project 4: SIEM — `siem`
- [ ] GRC (Governance, Risk, Compliance) — `secfund`

---

## Kaynak envanteri

İşlenen kök: `D:\Projects\Cyber Security Training\Oak-Study-Notes`

| Klasör | Dosya (yaklaşık) | Tür |
|--------|------------------|-----|
| *(kök)* | `README.md` | md |
| `IT Fundamentals/` | 14 PDF | sunum + TR study note |
| `Network Fundamentals/` | 22 PDF | sunum + TR study note |
| `Server Management/` | 36 PDF | sunum + TR study note |
| `Intro To Security/` | 11 PDF | sunum + TR study note |
| `Cryptography/` | 8 PDF | sunum + TR study note |
| `Firewall/` | 8 PDF | sunum + TR study note |
| `EDR/` | 6 PDF | sunum + TR study note |
| **Toplam** | **108 PDF + 1 md** | |

Üretilen dosyalar:

- `Oak-Study-Notes/TEKRAR-EKLE.txt` — işlenen konular (EDR dahil)
- `Oak-Study-Notes/TEKRAR-SONRA.txt` — EDR sonrası yaklaşan (8 satır)
- `Oak-Study-Notes/OZET.md` — Türkçe özet + boşluklar
- Durum **Harita** (`/harita`) — müfredat UI; FSRS kuyruğuna seçerek ekler

---

## roadmap.sh Cyber Security — kontrol listesi

Gruplar resmi roadmap bölümlerine göre. **(sonra)** = junior SOC / L1 hedefinin ötesinde; farkındalık yeterli, FSRS’e erken doldurma.

### Fundamental IT Skills

- [x] Computer Hardware Components
- [ ] Connection Types (NFC, WiFi, Bluetooth, Infrared) — Wi-Fi/WAP kısmen; NFC/Infrared ayrıntısı yok
- [ ] OS-Independent Troubleshooting
- [ ] Popular suites (MS Office, Google Suite, iCloud) — genelde atla
- [x] Basics of Computer Networking

**CTF platformları (pratik, zorunlu değil):** HackTheBox · TryHackMe · VulnHub · picoCTF · pwn.college

**Sertifikalar (hedef/plan; FSRS konusu değil):** CompTIA A+ · Linux+ · Network+ · Security+ · CCNA · CEH **(sonra)** · CISA/CISM **(sonra)** · GSEC/GPEN/GWAPT/GIAC **(sonra)** · OSCP **(sonra)** · CREST **(sonra)** · CISSP **(sonra)**

### Operating Systems

- [x] Windows — kurulum, GUI/CLI, permissions, yazılım, CRUD, troubleshooting, common commands
- [x] Linux — aynı liste
- [ ] MacOS — ikincil
- [x] Virtualization: Hypervisor, Host/Guest OS, VMWare, VirtualBox, esxi, proxmox — VMware/VirtualBox/Hyper-V adı; esxi/proxmox ayrıntısı yok

### Networking Knowledge

- [x] OSI Model
- [x] Subnetting / CIDR / subnet mask / default gateway
- [x] Public vs Private IP · localhost · loopback
- [x] VLAN · DMZ · ARP
- [x] DHCP · DNS · NAT · IP · NTP · IPAM — IPAM ayrıntısı yok
- [x] Router · Switch · VPN
- [x] Topologies: Star / Ring / Mesh / Bus · LAN / WAN / WLAN / MAN — MAN zayıf
- [x] Protocols: SSH · RDP · FTP · SFTP · HTTP/HTTPS · SSL/TLS
- [x] Auth: Kerberos · LDAP · SSO · RADIUS · Certificates · Local Auth — RADIUS ayrıntısı zayıf
- [x] Tools: nslookup · dig · ping · tracert · route · netstat · ipconfig · arp · iptables · nmap · tcpdump · packet sniffers / protocol analyzers · port scanners — nmap/iptables/route sınırlı veya yok

### Security Skills and Knowledge

**Kavramlar**

- [x] CIA Triad
- [x] Authentication vs Authorization · MFA / 2FA
- [x] Defense in Depth · Isolation · Zero Trust **(sonra derin)**
- [x] Risk tanımı · False/True Positive/Negative
- [x] Blue / Red / Purple Teams
- [x] Cyber Kill Chain · ATT&CK · Diamond Model — Diamond Model yok
- [ ] Runbooks
- [x] Perimeter vs DMZ vs Segmentation
- [x] Backups and Resiliency
- [ ] Compliance / auditors / ISO · NIST · RMF · CIS · CSF **(sonra derin)** — GDPR/KVKK adı geçiyor; derin yok

**Savunma / SOC**

- [ ] SIEM · SOAR **(SOAR sonra)** — SIEM yalnızca adı
- [x] IDS / IPS · HIPS · NIDS · NIPS
- [x] Firewall & NGFW · Host firewall · ACL · NAC · Port blocking
- [x] Antivirus / Antimalware · EDR · DLP · Sandboxing · Endpoint Security
- [ ] Logs: Event Logs · syslog · netflow · packet captures · firewall logs — FortiGate/EDR log var; Windows Event Log derin yok
- [x] Hardening: Patching · Jump Server · Group Policy · Sinkholes — GPO/patching var; jump/sinkhole zayıf
- [ ] Incident Response: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned — EDR müdahale var; tam IR döngüsü yok
- [x] Threat classification: Zero Day · Known vs Unknown · APT
- [x] Threat intel / OSINT temelleri · VirusTotal · urlscan · WHOIS (farkındalık) — urlscan zayıf

**Kriptografi**

- [x] Hashing · Salting · Key Exchange · PKI · Private vs Public Keys · Obfuscation

**Saldırı farkındalığı (savunma için; derin offensive sonra)**

- [x] Social engineering: Phishing · Smishing · Whaling · Tailgating · …
- [x] Network: DoS/DDoS · MITM · Spoofing · DNS Poisoning · Evil Twin · VLAN Hopping — bir kısmı yüzeysel
- [x] App: XSS · SQL Injection · CSRF · Directory Traversal · Buffer Overflow **(sonra)** · Memory Leak **(sonra)** — SQLi/XSS/Directory Traversal var
- [x] Creds: Brute Force vs Password Spray · Pass the Hash **(sonra derin)** · Privilege Escalation **(sonra derin)**
- [x] Web / OWASP Top 10
- [x] Malware types · Common hacking tools / exploit frameworks **(farkındalık; CEH/OSCP yolu sonra)**
- [x] Secure vs unsecure protocols: FTP vs SFTP · SSL vs TLS · IPSEC · DNSSEC · LDAPS · … — DNSSEC/LDAPS zayıf

**IR / discovery araçları (seçici):** wireshark · curl · nmap · Kali/Parrot **(ortam)** · LOLBAS / GTFOBins **(sonra)** · FTK / Autopsy / memdump **(forensics sonra)**

**Threat hunting / forensics / reverse engineering** — **(sonra)** junior SOC L1 sonrası — Live Discover ile hafif hunting var

### Cloud Skills and Knowledge **(junior’da ikincil / sonra)**

- [x] Security in the cloud · shared responsibility — yüzeysel
- [ ] Cloud vs on-prem · deploy flow
- [ ] IaaS / PaaS / SaaS · Private / Public / Hybrid
- [ ] AWS · Azure · GCP (temel farkındalık) — kariyer PDF’te ad; lab yok
- [ ] IaC · Serverless **(sonra)**
- [x] Cloud storage (S3, Drive, …) — düşük öncelik / genel risk notu

### Programming Skills

- [ ] Python (log parse / otomasyon)
- [x] Bash · PowerShell — Bash/shell + PowerShell notlarda
- [ ] Go · JavaScript · C++ **(sonra / role göre)**

---

## Seed (mevcut 8)

Durum uygulamasının varsayılan FSRS kuyruğu (`SEED_RETRIEVAL`):

- [x] DNS query/response (Wireshark) — `net` · orta
- [x] TCP 3-way handshake — `net` · kolay
- [x] Linux process / permissions — `linux` · orta
- [x] CIA triad + threat model — `secfund` · kolay
- [x] Simetrik vs asimetrik kripto — `crypto` · orta
- [x] Windows event log temelleri — `win` · zor
- [x] Python socket / log parse — `py` · orta
- [x] SOC triage düşünce zinciri — `def` · zor

---

## Notlar

- Retrieval kuyruğu **müfredat checklist’i değildir**; sadece tekrar edilecek öğrenilmiş konuları tutar.
- Tam müfredat: Durum → **Harita**. Oradan grup başına en fazla 3–5 konu ekle; Yaklaşan bölümü kilitli.
- Oak listesini doldurduktan sonra eksikleri Tekrar sayfasında `Toplu ekle` ile şöyle yapıştırabilirsin:

```
net|orta|OSI modeli
linux|orta|chmod / sticky bit
def|orta|SOC triage düşünce zinciri
```

(SIEM / Nmap / Nessus lab satırlarını not gelmeden ekleme — `TEKRAR-SONRA.txt`.)

veya sadece konu adı (varsayılan `net` · `orta`).

- Uygulama içi öneriler: `durum-web/src/data/roadmapTopics.ts` → Tekrar → **Önerilenlerden ekle**.
