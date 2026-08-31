> From: https://chatgpt.com/g/g-p-6a8c50e5eaa88191bee547e3fa692227/c/6a8b759d-6514-83ed-b3e9-de45772d5dd7

# you asked

message time: 2026-08-24 01:36:25

Almanyadaki siber güvenlik ile ilgili junior seviye iş ilanlarına türkiyeden başvurursam kabul almak için ne yapmam lazım

---

# chatgpt response

Evet, **Türkiye'den Almanya'daki junior siber güvenlik ilanlarına başvurup işe alınman mümkün.** Ama burada önemli bir ayrım var:

> Şirketin seni "iyi bir junior" olarak görmesi yetmez.  
> **Şirketin, Türkiye'den seni Almanya'ya getirmeye değecek kadar güçlü bir aday olduğunu düşünmesi gerekiyor.**

Senin durumunda bunu başarabiliriz. Hatta mevcut eğitimini, stajını, Oak Academy eğitimini, projelerini ve Almanya hedefini birlikte düşündüğümüzde sana özel bir strateji çıkarabiliriz.

### Önce gerçek problemi anlayalım

Almanya'daki bir şirket iki junior arasında seçim yapıyor:

**Aday A**
- Almanya'da yaşıyor
- Almanca B1/B2
- Bilgisayar eğitimi var
- Birkaç lab yapmış
- CV'si normal

**Aday B — Türkiye'den**
- Almanya'ya taşınması gerekiyor
- Vize süreci var
- Henüz Almanca yeterli değil
- Junior
- Ama çok iyi GitHub/proje/portfolio
- Gerçek sistemlere benzeyen SOC, network security, AD, SIEM projeleri var
- İngilizcesi iyi
- Almanya'daki çalışma kültürünü araştırmış
- İşverenin vize sürecini anlayıp süreci kolaylaştırıyor

**B'nin A'yı geçmesi gerekiyor.**

Dolayısıyla bizim stratejimiz:

**"Junior olduğum için iş arıyorum."**

değil.

**"Ben Almanya'daki bir şirketin junior seviyede hemen kullanabileceği, kendini kanıtlamış bir siber güvenlik adayım."**

noktasına gelmek.

---

# Senin için hedeflediğim profil

Ben senin yerinde olsam önümüzdeki dönemde kendimi şu şekilde konumlandırırdım:

> **Junior Cybersecurity / SOC Analyst → Blue Team / Detection & Incident Response**

Çünkü senin mevcut altyapın buna oldukça uygun.

Örneğin:

- Networking
- Linux
- Windows
- Active Directory
- Nmap
- Wireshark
- Python
- Scapy
- SIEM
- Splunk
- Incident Response
- Firewall
- EDR
- Vulnerability Management
- Windows Event Logs
- Detection
- Basic penetration testing

gibi alanları birleştirip **SOC/Blue Team ağırlıklı junior profil** oluşturabiliriz.

---

# 1. Öncelikle "işe alınabilir junior" seviyesine gelmen gerekiyor

Burada sertifikadan çok **kanıtlanabilir beceri** önemli.

CV'de:

> "I know Splunk."

demek yerine:

> "Built a Splunk-based detection lab and investigated simulated Windows authentication attacks using Windows Event Logs."

demek çok daha güçlü.

Aynı şey Nmap için de geçerli.

Sadece:

> Nmap

yerine:

> Built a vulnerability assessment lab using Nmap and Nessus, identified exposed services and documented remediation steps.

gibi.

### Senin GitHub'ın böyle görünmeli.

Örneğin:

```text
github.com/username

├── SOC-Lab
│   ├── Windows AD
│   ├── Splunk
│   ├── Sysmon
│   ├── Attack Simulation
│   └── Incident Reports
│
├── Network-Security-Lab
│   ├── Nmap
│   ├── Wireshark
│   ├── Scapy
│   └── Packet Analysis
│
├── Vulnerability-Management
│   ├── Nessus
│   ├── CVE Analysis
│   └── Remediation
│
├── Python-Security-Tools
│   ├── Network Scanner
│   └── Packet Sniffer
│
└── Writeups
    ├── Incident Response
    ├── AD Attack
    ├── Phishing Investigation
    └── Web Vulnerability
```

Senin mevcut Network Scanner, Packet Sniffer, Scapy çalışmaların burada **işe yarayacak**.

---

# 2. En az 3 ciddi proje yap

Ben sana 20 tane küçük proje yaptırmazdım.

**3–5 tane gerçekten güçlü proje** yapardım.

Özellikle:

### Proje 1 — SOC Lab

Windows Server + Windows Client + Active Directory + Sysmon + Splunk.

Sonra kontrollü saldırılar:

- Brute force
- Failed login
- Privilege escalation simülasyonu
- Suspicious PowerShell
- Process execution
- Network scanning

ve Splunk'ta:

**log → detection → alert → investigation → incident report**

zincirini göstereceksin.

Bu tek proje bile CV'de çok güçlü olabilir.

---

### Proje 2 — Vulnerability Management

Örneğin:

```text
Nmap
   ↓
Nessus
   ↓
Vulnerability discovery
   ↓
CVE/CVSS analysis
   ↓
Risk prioritization
   ↓
Remediation
   ↓
Rescan
```

Sonunda profesyonel bir vulnerability assessment raporu.

---

### Proje 3 — Active Directory Security Lab

Örneğin:

```text
Windows Server
      ↓
Active Directory
      ↓
Users / Groups / Policies
      ↓
Attack simulation
      ↓
Event logs
      ↓
Detection
      ↓
Mitigation
```

Böylece hem Windows hem AD hem networking hem security hem SIEM tarafını gösterebilirsin.

---

# 3. Sertifika stratejisini doğru kuracağız

Sen zaten Security+ yolundasın.

Bu iyi.

Ama benim sana yaklaşımım:

**Sertifika = becerinin kanıtı değil, becerinin destekçisi.**

Yani:

```text
Security+
   +
Networking
   +
Linux
   +
Windows/AD
   +
Splunk
   +
Projects
   +
GitHub
   +
Internship
```

çok daha güçlü.

Sadece:

```text
Security+
TryHackMe
Nmap
```

yazmak seni yüzlerce junior adaydan ayırmaz.

---

# 4. Stajını çok iyi kullan

Senin mevcut siber güvenlik stajın aslında önemli.

Dört aylık gerçek iş deneyimi:

**"I completed a cybersecurity internship."**

şeklinde bırakılmamalı.

CV'de mümkün olduğunca:

- ne yaptın?
- hangi teknolojileri kullandın?
- hangi sistemlerde çalıştın?
- hangi problemi çözdün?
- ne kadar sorumluluk aldın?

bunları göstereceğiz.

Örneğin gerçek deneyimin uygunsa:

> Investigated security alerts and analyzed network traffic using Wireshark.

gibi.

**Ama burada kesinlikle yaptığın şeyleri abartmayacağız.**

---

# 5. Almanca çok önemli

Burada sana özellikle katılmadığım bir yaklaşım var:

> "Cybersecurity olduğu için İngilizce yeter."

Bazı uluslararası şirketlerde evet.

Ama Almanya'daki **junior** pozisyonlarda Almanca bilmek seni ciddi şekilde avantajlı hale getirir.

Ben senin için hedefi:

### Minimum:
**B1**

### Daha iyi:
**B2**

yapardım.

Özellikle:

- SOC
- IT Security
- System Administration
- Network Security
- MSSP
- Internal IT Security

pozisyonlarında Almanca çok değerli.

Senin şu anda Almancayı yoğunlaştırmaya çalışman bu nedenle **doğru strateji**.

---

# 6. İngilizceyi de teknik seviyeye çıkaracağız

Burada hedef:

**"İngilizce biliyorum."**

değil.

Şunları yapabilmek:

> Explain an incident.

> Describe a vulnerability.

> Explain how DNS works.

> Explain an authentication attack.

> Present your project.

> Answer technical interview questions.

Özellikle **mülakat İngilizcesi**.

---

# 7. CV'yi Almanya'ya göre hazırlayacağız

Tek bir CV kullanmanı önermiyorum.

Örneğin:

### CV 1
**Junior SOC Analyst**

### CV 2
**Junior Cybersecurity Analyst**

### CV 3
**Junior Network Security**

### CV 4
**Junior IT Security**

İş ilanına göre küçük değişiklikler.

Örneğin ilanda:

```text
SIEM
Splunk
Incident Response
Windows
Networking
```

geçiyorsa CV'nin üst tarafında bunlar görünmeli.

ATS'nin seni yakalaması gerekiyor.

---

# 8. LinkedIn'i de Almanya'ya göre yapacağız

Profilin:

**Türkiye'de iş arayan bir öğrenci**

gibi görünmemeli.

Şuna benzemeli:

> **Junior Cybersecurity Analyst | SOC | SIEM | Network Security | Python | Security+**

Location konusunda da Almanya'ya taşınma hedefini açıkça belirtebiliriz.

Örneğin:

> Open to relocation to Germany

gibi.

---

# 9. En önemli konu: Türkiye'den başvurduğunu gizlemeyeceğiz

Tam tersine profesyonel şekilde yöneteceğiz.

İşverenin kafasındaki soru:

> "Bu adamı Türkiye'den neden getirelim?"

olacak.

Cevabımız:

> **Çünkü aday junior olmasına rağmen işe hazır, pratik deneyime sahip ve Almanya'ya taşınma süreci konusunda hazırlıklı.**

olmalı.

Ayrıca Almanya'nın mevcut göç sistemi IT çalışanları açısından bazı avantajlar sağlıyor. Örneğin resmi kaynaklara göre belirli şartları sağlayan IT çalışanları için formal Almanya mesleki tanınması olmadan çalışma yolları bulunabiliyor; özellikle en az iki yıllık ilgili iş deneyimi gibi şartlar önem taşıyor. ([Make It in Germany](https://www.make-it-in-germany.com/en/looking-for-foreign-professionals/entering/admission-labour-market/it-professionals?utm_source=chatgpt.com))

Senin açısından önemli nokta şu:

**Henüz iki yıl deneyimin yoksa bu yolu şu anda ana stratejimiz olarak kabul etmemeliyiz.**

---

# 10. Senin eğitiminin tanınması ayrıca önemli

Senin Ankara Yıldırım Beyazıt Üniversitesi Bilgisayar Programcılığı eğitimin açısından **Almanya'daki hangi vize/istihdam yoluna girdiğini ayrıca netleştirmemiz gerekiyor.**

Çünkü Almanya'da yabancı mesleki yeterliliklerin tanınması vize türüne göre değişebiliyor. Resmî kaynak da bazı vizelerde yabancı mesleki yeterliliğin tanınmasının gerektiğini, bazı yollarda ise farklı kanıtların yeterli olduğunu belirtiyor. ([Make It in Germany](https://www.make-it-in-germany.com/en/looking-for-foreign-professionals/recruitment/foreign-qualifications/recognition?utm_source=chatgpt.com))

Bu yüzden:

**"Diplomam var → otomatik olarak Almanya'da çalışabilirim."**

diye düşünmemeliyiz.

---

# 11. Ama çok önemli bir avantajın var: Chancenkarte

Sen zaten Chancenkarte'yi araştırıyorsun.

Bu nedenle stratejiyi iki paralel kanala ayırabiliriz:

### Kanal A — Türkiye'den direkt iş

```text
Türkiye
   ↓
Almanya iş ilanları
   ↓
Başvuru
   ↓
Interview
   ↓
Job offer
   ↓
Visa
   ↓
Germany
```

### Kanal B — Chancenkarte

```text
Türkiye
   ↓
Chancenkarte
   ↓
Germany
   ↓
Job search locally
   ↓
Interview
   ↓
Job offer
   ↓
Residence/work status
```

İkinci kanalın büyük avantajı:

**İşverenin karşısında artık Türkiye'den başvuran biri değilsin.**

Almanya'dasın.

Bu junior pozisyonlarda ciddi fark yaratabilir.

Resmî Make it in Germany bilgisine göre iş arayanlar kendi ülkelerinden de başvurabilir; ayrıca uygun şartları sağlayan kişiler Opportunity Card ile Almanya'ya gidip yerinde iş arayabilir. ([Make It in Germany](https://www.make-it-in-germany.com/en/visa-residence/quick-check?cHash=e9c7384213cf9080aad297da12aa6416&tx_clickflow_flow%5Baction%5D=next&tx_clickflow_flow%5Bcontroller%5D=Flow&tx_clickflow_flow%5Bsession%5D=ePbBQ-1733204230&tx_clickflow_flow%5Bstep%5D=77&utm_source=chatgpt.com))

---

# 12. Fakat senin asıl hedefin "junior" olmaktan çıkmak olmalı

Burası çok önemli.

Şu anda:

> **Junior Cybersecurity Candidate**

olabilirsin.

Ama 6–12 ay içinde:

> **Junior SOC Analyst with practical SIEM/Windows/Network Security experience**

haline gelmelisin.

Aradaki fark inanılmaz.

---

# Ben senin için şöyle bir sistem kurardım

## FAZ 1 — Temel

**Networking + Linux + Windows + Python**

↓

## FAZ 2 — Security

**Nmap + Wireshark + Vulnerability Management + Firewalls**

↓

## FAZ 3 — Enterprise

**Windows Server + Active Directory + PowerShell**

↓

## FAZ 4 — SOC

**SIEM + Splunk + Sysmon + Incident Response**

↓

## FAZ 5 — Portfolio

**3 büyük proje + GitHub + write-up**

↓

## FAZ 6 — Certification

**Security+**

↓

## FAZ 7 — Languages

**English B2/C1 technical + German B1 → B2**

↓

## FAZ 8 — Job Hunting

**Germany-focused CV + LinkedIn + targeted applications**

↓

## FAZ 9 — Interviews

**Technical + behavioral + English/German**

↓

## FAZ 10 — Germany

**Job offer → visa → relocation**

---

# Ve başvuru sayısı da önemli

Örneğin:

**5 başvuru yapıp cevap gelmedi → "Almanya'da junior iş bulamıyorum."**

demeyeceğiz.

Bunun yerine funnel oluşturacağız:

```text
100 applications
        ↓
30 recruiter responses
        ↓
15 HR interviews
        ↓
8 technical interviews
        ↓
3 final interviews
        ↓
1 offer
```

Bu rakamlar garanti değil; **stratejiyi ölçmek için örnek funnel**.

Eğer:

```text
100 başvuru
↓
0 response
```

ise problem CV/uygunluk/ilan seçiminde.

```text
20 HR
↓
0 technical
```

ise problem teknik anlatımda.

```text
10 technical
↓
0 offer
```

ise problem mülakatta.

Böylece körlemesine başvuru yapmayız.

---

# Senin özel durumunda en kritik 7 şey

Ben öncelik sırasını şöyle koyardım:

| Öncelik | Hedef |
|---|---|
| 🔴 1 | Gerçek siber güvenlik deneyimi |
| 🔴 2 | Güçlü SOC/Blue Team portfolio |
| 🔴 3 | Almanca B1 |
| 🔴 4 | Security+ |
| 🟠 5 | İngilizce teknik iletişim |
| 🟠 6 | Almanya'ya özel CV + LinkedIn |
| 🟡 7 | Çok sayıda kaliteli başvuru |

Ve **senin için özellikle 1 ve 2 çok önemli**.

Çünkü zaten:

- Bilgisayar Programcılığı eğitimin var
- Siber güvenlik stajın var
- Oak Academy'desin
- Security+ yolundasın
- Network Scanner yaptın
- Packet Sniffer yaptın
- Scapy biliyorsun
- Linux tarafına giriyorsun
- Nmap/Nessus/Splunk/Firewall/EDR gibi konularla uğraşıyorsun

Dolayısıyla sıfırdan başlamıyoruz.

**Asıl işimiz dağınık olan bu parçaları tek bir "Almanya'da işe alınabilir junior cybersecurity profili" haline getirmek.**

Ve bence bunu yapabiliriz.

İstersen bir sonraki adımda sana **** çıkarabiliriz. Bunu genel bir roadmap değil, **senin mevcut seviyeni, stajını, Oak Academy'yi, Security+, Almanca/İngilizce hedeflerini ve Chancenkarte durumunu hesaba katan haftalık sistem** şeklinde kurmak daha mantıklı olur.

---

# you asked

message time: 2026-08-24 10:48:07

evet hadi yapalım

---

# chatgpt response

Tamam. O zaman bunu **"6 ay sonra Almanya'dan junior cybersecurity iş teklifi alma ihtimalini maksimuma çıkarma projesi"** olarak ele alalım.

Önce önemli bir güncelleme: Güncel Almanya kaynaklarına baktığımda bu stratejinin özellikle **SOC / IT Security / Cybersecurity Operations** tarafına kurulması mantıklı görünüyor. Federal İş Ajansı'nın güncel ilanlarında yüzlerce IT-security ilanı bulunuyor ve yakın tarihli bir ilanda doğrudan **Junior SOC Analyst** pozisyonu da mevcut. Bu ilanda Tier-1 monitoring, alert triage ve incident-response desteği gibi görevler öne çıkıyor. ([İş Kurumu](https://www.arbeitsagentur.de/jobsuche/suche?angebotsart=1&was=it+cybersecurity&utm_source=chatgpt.com))

Ayrıca Chancenkarte, Türkiye'den başvurmayı bırakıp Almanya'ya giderek yerinde iş aramaya geçebilmen için gerçek bir ikinci kanal; 2026 için geçim kanıtında aylık €1.091 net tutar belirtiliyor ve kartla iş ararken haftada toplam 20 saate kadar yan iş yapılabiliyor. ([Make It in Germany](https://www.make-it-in-germany.com/en/visa-residence/opportunity-card/job-search?utm_source=chatgpt.com))

## 🎯 6 ay sonraki hedefimiz

Seni şuna dönüştürmek istiyorum:

> **Junior Cybersecurity / SOC Analyst**  
> Networking + Windows/AD + Linux + SIEM + Incident Response + Vulnerability Management + Python  
> Security+ + gerçek staj deneyimi + 3 güçlü security project + Almanca B1 + teknik İngilizce

Ve CV'nin karşısına çıkan şirketin şunu düşünmesini istiyoruz:

**"Bu arkadaş junior ama eğitilecek sıfır bir aday değil. Ekibe girerse çalışmaya başlayabilir."**

---

# 6 aylık ana plan

| Ay | Ana hedef | Çıktı |
|---|---|---|
| **1** | Networking + Linux + Windows temeli | Teknik temel |
| **2** | Windows/AD + Security | Enterprise security |
| **3** | SOC + SIEM + Splunk | SOC projesi |
| **4** | Incident Response + Detection | Profesyonel portfolio |
| **5** | CV + GitHub + Almanya başvuruları | Başvuru makinesi |
| **6** | Mülakat + yoğun başvuru | İş teklifi |

Ama bunu **6 ay boyunca sadece ders çalışarak** yapmayacağız.

Her hafta:

**Öğren → Uygula → Proje → Anlat → GitHub → Mülakat**

döngüsü olacak.

---

# 🟥 AY 1 — Temeli gerçekten oturtuyoruz

Sen şu anda networking çalışıyorsun. Bu nedenle bunu değiştirmiyorum.

### Networking

Şunlara gerçekten hakim ol:

- OSI
- TCP/IP
- Ethernet
- MAC
- ARP
- IPv4
- IPv6
- subnetting
- TCP / UDP
- TCP handshake
- DNS
- DHCP
- HTTP/HTTPS
- TLS
- NAT
- routing
- switching
- VLAN
- firewall
- VPN
- proxy

Ama ezber değil.

Örneğin sana:

> "Bir kullanıcı `google.com` yazdıktan sonra ekranda sayfa açılana kadar ağda ne oluyor?"

dediğimde baştan sona anlatabilmelisin.

---

## Linux

Özellikle:

```text
filesystem
permissions
users
groups
processes
services
systemd
SSH
logs
networking
bash
grep
awk
sed
find
curl
wget
tcpdump
```

---

## Windows

Burada önemli bir kırılma yapacağız.

Windows'u sadece "kullanıcı işletim sistemi" olarak değil:

**security investigation platformu**

olarak öğren.

Özellikle:

- Windows Event Viewer
- Event IDs
- Windows authentication
- users
- groups
- services
- processes
- PowerShell
- Registry
- Task Scheduler
- Windows Firewall
- Sysmon

---

# 🟧 AY 2 — Enterprise Security

Burada seni normal bir cybersecurity öğrencisinden ayırmaya başlıyoruz.

## Active Directory

Öğren:

```text
Domain
Domain Controller
Forest
Tree
OU
Users
Groups
GPO
Kerberos
NTLM
LDAP
DNS
Authentication
Authorization
```

Sonra kendi labını kur.

```text
                    Windows Server
                         │
                    Domain Controller
                         │
              ┌──────────┴──────────┐
              │                     │
        Windows Client 1      Windows Client 2
```

Sonra saldırı ve savunma tarafını incele.

Örneğin:

- brute force
- password spraying
- suspicious login
- privilege escalation
- lateral movement kavramı
- Kerberos saldırı konseptleri

**Kontrollü lab ortamında.**

---

# 🟨 AY 3 — SOC'a giriyoruz

Burası bizim **ana uzmanlaşma noktası**.

Çünkü Almanya'da gerçekten junior seviyede SOC rollerine rastlamak mümkün; güncel bir Junior SOC Analyst ilanında alarm izleme, olayların triage edilmesi ve daha ileri incident-response analizine destek gibi görevler açıkça belirtiliyor. ([Make It in Germany](https://www.make-it-in-germany.com/en/working-in-germany/job-listings/job/job-10001-1003317107-S?utm_source=chatgpt.com))

Öğreneceğin yapı:

```text
Logs
 ↓
SIEM
 ↓
Detection
 ↓
Alert
 ↓
Triage
 ↓
Investigation
 ↓
Incident
 ↓
Response
 ↓
Report
```

## Splunk

Şunları öğren:

- log ingestion
- indexes
- sourcetypes
- fields
- SPL
- searches
- dashboards
- alerts
- correlation
- investigation

Sonra:

**Windows + Sysmon → Splunk**

bağlayacağız.

---

# 🔥 AY 3'ÜN BÜYÜK PROJESİ

## "Mini SOC"

GitHub'da göstereceğimiz ilk büyük proje.

Örneğin:

```text
                    ATTACKER
                       │
                       ▼
                 Windows Client
                       │
                ┌──────┴──────┐
                │   Sysmon    │
                └──────┬──────┘
                       │
                       ▼
                    Splunk
                       │
                       ▼
                  Detection
                       │
                       ▼
                    Alert
                       │
                       ▼
                  Investigation
                       │
                       ▼
                Incident Report
```

Burada bir saldırıyı simüle edeceksin.

Sonra:

**"Ben bunu nasıl tespit ettim?"**

diye rapor yazacaksın.

Bu artık CV'de:

> "Splunk biliyorum."

olmaktan çıkıp:

> **"I built a SIEM-based detection and investigation lab."**

haline geliyor.

---

# 🟩 AY 4 — Incident Response

Şimdi SOC bilgisini profesyonelleştiriyoruz.

Öğreneceksin:

### Incident lifecycle

```text
Preparation
    ↓
Detection
    ↓
Analysis
    ↓
Containment
    ↓
Eradication
    ↓
Recovery
    ↓
Lessons Learned
```

Sonra senaryolar:

### Senaryo 1
Brute force

### Senaryo 2
Suspicious PowerShell

### Senaryo 3
Malware execution

### Senaryo 4
Account compromise

### Senaryo 5
Suspicious network scanning

Her birinde:

```text
Alert
 ↓
What happened?
 ↓
What evidence do I have?
 ↓
What is the severity?
 ↓
What should I do?
 ↓
How do I prevent recurrence?
```

sorularını cevaplayacaksın.

---

# 🟦 Aynı ay: Vulnerability Management

Burada senin Nmap/Nessus tarafını kullanacağız.

Şöyle:

```text
Nmap
 ↓
Discovery
 ↓
Nessus
 ↓
Vulnerabilities
 ↓
CVE
 ↓
CVSS
 ↓
Risk
 ↓
Remediation
 ↓
Rescan
```

Bunun da ayrı GitHub projesi olacak.

---

# 🟪 AY 5 — ARTIK İŞ ARAMAYA BAŞLIYORUZ

Burada çok önemli bir şey yapacağız:

**"Hazır olunca başvururum."**

demeyeceğiz.

5. ayda zaten başvuracağız.

Çünkü gerçek iş ilanları bize neyi eksik yaptığımızı gösterecek.

---

# Almanya'da arayacağımız pozisyonlar

Sadece:

> Junior Cybersecurity

aramayacağız.

Şunları tarayacağız:

### Birincil

- Junior SOC Analyst
- SOC Analyst
- Security Operations Analyst
- Junior Cybersecurity Analyst
- IT Security Analyst
- Security Analyst
- Junior IT Security Consultant

### İkincil

- Junior Network Security
- Vulnerability Management Analyst
- Security Monitoring Analyst
- Junior Incident Response
- Cybersecurity Consultant
- IT Security Consultant

### Entry-level alternatifi

- SOC Trainee
- Cybersecurity Trainee
- IT Security Trainee
- Security Operations Trainee
- Junior System Administrator with Security

Bu son grup önemli.

Çünkü bazen **"junior cybersecurity" diye ilan açmayan şirket**, güvenlik görevleri olan junior IT pozisyonu açıyor.

---

# Ay 5'te CV'miz

CV'nin ilk kısmı yaklaşık şöyle bir mantık taşımalı:

```text
FAIK EMRE PUSAT
Junior Cybersecurity Analyst

Cybersecurity-focused IT professional with practical experience
in networking, Linux, Windows, SIEM, vulnerability management
and security monitoring.

TECHNICAL SKILLS

Networking
Linux
Windows / Active Directory
Splunk / SIEM
Nmap
Nessus
Wireshark
Python / Scapy
Incident Response
Vulnerability Management
```

Ama **buraya sadece gerçekten öğrendiğin şeyleri koyacağız.**

---

# GitHub

Burada çok büyük değişiklik yapacağız.

Senin GitHub'ın "kod çöplüğü" olmayacak.

Bir recruiter girdiğinde ilk 30 saniyede:

**"Bu adam ne yapmış?"**

anlayacak.

Örneğin:

```text
⭐ SOC-Lab
⭐ Active-Directory-Security-Lab
⭐ Vulnerability-Management-Lab
⭐ Network-Security-Toolkit
⭐ Incident-Response-Writeups
```

Her projenin README'sinde:

```text
1. Objective
2. Architecture
3. Technologies
4. Lab Setup
5. Attack Scenario
6. Detection
7. Investigation
8. Mitigation
9. Lessons Learned
```

olacak.

---

# 🟥 AY 6 — MÜLAKAT MAKİNESİ

Bu ay artık yeni teknoloji öğrenmekten çok:

**"Bildiklerimi gösterebiliyor muyum?"**

sorusuna odaklanacağız.

Çünkü daha önce söylediğin bir problemin burada çok önemli olduğunu düşünüyorum:

> Bir şeyi biliyorsun ama yeni tanıştığın kişiye bunu gösteremiyorsun.

Bu özellikle mülakatta ciddi problem olabilir.

Dolayısıyla her gün:

### 10 dakika teknik anlatım

Örneğin:

> "What happens when you enter a URL?"

### 10 dakika cybersecurity

> "How would you investigate a brute-force alert?"

### 10 dakika behavioral

> "Tell me about yourself."

### 10 dakika proje

> "Tell me about your SOC project."

Bunları benimle canlı şekilde çalışacağız.

---

# 🇩🇪 Almanca'yı da paralel götürüyoruz

Burada senin mevcut planını bozmayacağız.

**DW + ChatGPT konuşma pratiği**

devam.

Ama artık genel Almanca yanında:

### Cybersecurity German

öğreneceğiz.

Örneğin:

| Almanca | Türkçe |
|---|---|
| der Sicherheitsvorfall | güvenlik olayı |
| die Sicherheitslücke | güvenlik açığı |
| die Bedrohung | tehdit |
| die Warnmeldung | uyarı |
| die Anmeldung | oturum açma |
| die Authentifizierung | kimlik doğrulama |
| die Zugriffsrechte | erişim hakları |
| die Protokolldatei | log dosyası |
| die Untersuchung | inceleme |
| die Abwehr | savunma |

Sonra bunlarla **iş mülakatı Almancası** çalışacağız.

---

# 🇬🇧 İngilizce

Burada genel İngilizce çalışmayacağız.

**Cybersecurity English.**

Örneğin:

Ben sana:

> "Explain how a SOC analyst investigates a suspicious login."

diyeceğim.

Sen cevaplayacaksın.

Ben:

- grammar
- vocabulary
- technical accuracy
- pronunciation
- naturalness
- interview quality

açısından düzelteceğim.

Bu senin için çok daha verimli.

---

# 💼 Başvuru sistemi

5. aydan itibaren:

### Haftalık

**15–25 kaliteli başvuru**

hedefleriz.

Ama rastgele 100 başvuru değil.

Her ilan için:

```text
Job Description
      ↓
Requirements
      ↓
Our CV
      ↓
Missing skills
      ↓
CV adaptation
      ↓
Application
      ↓
Tracking
```

---

# 📊 Bir başvuru takip sistemi kuracağız

Örneğin:

| Şirket | Pozisyon | Almanca | Match | Başvuru | Durum |
|---|---|---:|---:|---|---|
| X | Junior SOC | B1 | 85% | ✓ | HR |
| Y | IT Security | B2 | 78% | ✓ | Bekliyor |
| Z | SOC Analyst | B1 | 91% | ✓ | Technical |
| A | Cybersecurity | B2 | 65% | ✗ | — |

Böylece 6 ay sonunda elimizde gerçek veri olacak.

---

# 🇩🇪 Almanya'da bulunma stratejisi

Burada iki ayrı rota tutacağız.

### ROTA A

**Türkiye → Job offer → Almanya**

Chancenkarte bunun için şart değil; Almanya'nın resmî portalı da açıkça, kişinin kendi ülkesinden iş arayabileceğini ve iş teklifi aldıktan sonra uygun çalışma vizesine geçebileceğini söylüyor. ([Make It in Germany](https://www.make-it-in-germany.com/en/visa-residence/opportunity-card/job-search?utm_source=chatgpt.com))

### ROTA B

**Türkiye → Chancenkarte → Almanya → yerinde iş arama**

Chancenkarte ilk etapta en fazla bir yıllık iş arama izni veriyor; iş bulunduğunda uygun çalışma oturumuna geçiş yapılabiliyor. ([Make It in Germany](https://www.make-it-in-germany.com/en/visa-residence/opportunity-card/job-search?utm_source=chatgpt.com))

**Ben ikisini aynı anda yürütürdüm.**

---

# ⚠️ Bir şeyi özellikle düzelteyim

Daha önce konuştuğumuz **"6 ayda fluent İngilizce + Almanca + cybersecurity"** gibi hedefleri tek bir dev hedef olarak görürsek çok kolay dağılırız.

Bu 6 ayın ana hedefi:

> **ALMANYA'DA İŞE ALINABİLİR JUNIOR CYBERSECURITY ADAYI OLMAK.**

Diller bunun araçları.

Security+ araç.

GitHub araç.

Projeler araç.

Chancenkarte araç.

---

# 🧠 Ve senin için T-shaped yapı

Bunu da koruyoruz.

```text
              CYBERSECURITY
                    │
       ┌────────────┼────────────┐
       │            │            │
   Network       Linux        Windows
       │            │            │
       │            │            └── AD
       │            │                 │
       │            │                 ▼
       │            │              Security
       │            │
       │            └── SOC
       │                 │
       ▼                 ▼
   Security ──────── SIEM/Splunk
                         │
                         ▼
                  Incident Response
                         │
                         ▼
                  🔥 SPECIALIZATION
                    SOC / Blue Team
```

Yani yatayda cybersecurity'nin tamamını göreceğiz.

Ama **dikeyde SOC/Blue Team'e ciddi derinlik** vereceğiz.

---

# 🚨 İlk 30 günümüz

Şimdi 6 aylık planı bir kenara bırakıp **ilk 30 günü** netleştirelim.

### Hafta 1

**Networking**

- OSI
- TCP/IP
- Ethernet
- MAC
- ARP
- IP
- TCP/UDP

+ Wireshark lab.

### Hafta 2

**Networking**

- DNS
- DHCP
- NAT
- Routing
- Switching
- VLAN
- Firewall

+ Wireshark/Nmap.

### Hafta 3

**Linux**

- filesystem
- permissions
- users/groups
- processes
- services
- SSH
- logs
- networking
- Bash

+ Linux security lab.

### Hafta 4

**Windows**

- users
- groups
- processes
- services
- Event Viewer
- PowerShell
- Windows Firewall
- Event IDs
- Sysmon

+ Windows investigation lab.

---

# Her gün nasıl çalışacağız?

Senin için ben **2–3 saatlik** sistemi tercih ederim.

### 45 dk

**Yeni konu**

### 45 dk

**Lab / uygulama**

### 30 dk

**Eski konuyu tekrar**

### 20 dk

**İngilizce**

### 20 dk

**Almanca**

### 20 dk

**ChatGPT ile anlatım / mülakat**

Toplam:

**~3 saat**

Vaktin azsa:

**90 dakikalık minimum versiyona** düşürürüz.

---

# Ve ChatGPT'yi burada nasıl kullanacağız?

Burası bence sistemin en güçlü tarafı olacak.

Sen konu çalıştıktan sonra bana:

> "VLAN'ı öğrendim."

demeyeceksin.

Bana **VLAN'ı kendi cümlelerinle anlatacaksın.**

Ben de seni sorgulayacağım:

> VLAN neden kullanılır?

> VLAN ile subnet aynı şey mi?

> Access port nedir?

> Trunk nedir?

> 802.1Q ne yapar?

> VLAN güvenlik sağlar mı?

> Native VLAN nedir?

> Bir saldırgan VLAN'lar arasında nasıl hareket etmeye çalışabilir?

Sen cevaplayacaksın.

Ben de:

**❌ yanlış**

**⚠️ eksik**

**✅ doğru**

diye ayırıp tekrar öğreteceğim.

Bu yöntem senin hem **bilgiyi öğrenmeni** hem de **mülakatta ifade edebilmeni** sağlayacak.

---

## Son hedefimiz

6 ayın sonunda CV'ne baktığımda şu tabloyu görmek istiyorum:

```text
FAIK EMRE PUSAT
──────────────────────────────

Junior Cybersecurity Analyst

✓ Cybersecurity Internship
✓ Security+
✓ Networking
✓ Linux
✓ Windows
✓ Active Directory
✓ SIEM / Splunk
✓ Sysmon
✓ Incident Response
✓ Vulnerability Management
✓ Nmap / Nessus / Wireshark
✓ Python / Scapy

PROJECTS
──────────────────────────────

✓ SOC Detection & Investigation Lab
✓ Active Directory Security Lab
✓ Vulnerability Management Lab
✓ Network Security Toolkit

LANGUAGES
──────────────────────────────

English — Technical working proficiency
German  — B1 → B2

LOCATION
──────────────────────────────

Türkiye
Open to relocation to Germany
```

**Bu profile ulaştığımızda başvurulara başlarız değil; 5. aydan itibaren başvururken aynı zamanda eksikleri kapatmaya devam ederiz.**

Ve önemli bir nokta: 2026'da Almanya'nın resmî kaynakları IT için birden fazla çalışma yolu olduğunu belirtiyor; bunların şartları eğitim, deneyim, iş teklifi ve maaşa göre değişiyor. Bu yüzden 6 ayın sonunda sadece "iş bulma" değil, **hangi oturum/çalışma yolunun senin somut teklifine uyduğunu da birlikte kontrol edeceğiz.** ([Make It in Germany](https://www.make-it-in-germany.com/en/visa-residence/types/it-professionals?utm_source=chatgpt.com))

**Şimdi ilk aşamada 6 aylık planı uygulamaya çevirelim:** sen şu anda **Networking → VLAN** konusundasın. Dolayısıyla **1. haftanın ilk dersini VLAN'dan değil, networking temelinin mevcut seviyesini ölçerek** başlatmamız en doğrusu. Böylece zaten bildiğin şeyleri tekrar tekrar çalışıp 6 ayı harcamayacağız.

---

# you asked

message time: 2026-08-24 13:34:35

peki hatırladığım kadarıyla denklik alma gibi bir durum vardı yani cv ni diplomanı falan bir kuruma veriyordun onlar da denklik belegesi çıkarıyordu öyle bir şeyin etkisi ne olur

---

# chatgpt response

Evet, hatırladığın şey **gerçek**. Fakat burada iki farklı işlemi birbirinden ayırmak çok önemli:

1. **Mesleki denklik / Anerkennung**
2. **Üniversite diploması için ZAB Statement of Comparability (Zeugnisbewertung)**

Senin durumunda hangisinin doğru olduğu, diplomanın Almanya'da nasıl sınıflandırıldığına bağlı. Güncel Alman resmî kaynaklarını kontrol ettim ve senin için önemli bir nokta ortaya çıkıyor.

### Senin açından neden önemli?

Almanya'da **cybersecurity/IT regulated profession değil**, yani "denklik olmadan kesinlikle çalışamazsın" şeklinde bir kural yok. Ancak denklik veya diploma karşılaştırması özellikle **vize ve işverenin seni değerlendirmesi** açısından ciddi fayda sağlayabilir. ([Make it in Germany](https://www.make-it-in-germany.com/en/working-in-germany/recognition/foreign-academic-qualifications?utm_source=chatgpt.com))

Örneğin Alman hükümetinin IT sayfası, tanınmış/eşdeğer bir IT yeterliliğine sahip olmanın bazı çalışma vizesi yollarında önemli olduğunu söylüyor. ([Make it in Germany](https://www.make-it-in-germany.com/en/visa-residence/types/it-professionals?utm_source=chatgpt.com))

---

# Senin durumunda önce şu ayrımı yapalım

Sen:

**Ankara Yıldırım Beyazıt Üniversitesi — Bilgisayar Programcılığı**

mezunusun.

Daha önce baktığımız Anabin durumunda üniversiten **H+** olarak görünüyordu; fakat programın Alman sistemindeki karşılığı konusunda **Fachschule** şeklinde bir sınıflandırma vardı.

Bu yüzden senin için:

> "Diplomam var, direkt ZAB'a gönderiyorum ve Bachelor denkliği alıyorum."

diye düşünmek doğru olmayabilir.

Çünkü ZAB'ın verdiği **Statement of Comparability**, yabancı bir **akademik üniversite derecesinin** Alman akademik derecesiyle karşılaştırılmasını ifade ediyor. ([Make it in Germany](https://www.make-it-in-germany.com/en/working-in-germany/recognition/foreign-academic-qualifications?utm_source=chatgpt.com))

Eğer senin programın Alman sisteminde akademik Bachelor olarak değil, **mesleki/tertiary vocational qualification** olarak değerlendiriliyorsa farklı bir tanıma süreci gündeme gelebilir.

---

# Peki "Anerkennung" ne yapıyor?

Mesleki tanıma sürecinde Almanya'daki yetkili kurum senin eğitimini ilgili bir **Alman referans mesleğiyle** karşılaştırıyor.

Sonuç:

### 🟢 Tam denk

**volle Gleichwertigkeit / volle Anerkennung**

ve sana resmi bir **Anerkennungsbescheid** veriliyor.

### 🟡 Kısmi denk

Eksik görülen eğitim/tecrübe alanları belirtiliyor.

Bunları tamamladıktan sonra tam tanıma alınabiliyor.

### 🔴 Denk değil

Yeterli eşdeğerlik bulunmadığı belirtiliyor.

Resmî prosedürde bu sonuçlar bir **Anerkennungsbescheid** ile bildirilir. İşlem genel olarak belgeler tamamlandıktan sonra yaklaşık 3–4 ay sürebiliyor. ([Make it in Germany](https://www.make-it-in-germany.com/en/working-in-germany/recognition/procedure?utm_source=chatgpt.com))

---

# Peki bunu alırsan iş bulma ihtimalin ne kadar artar?

Burada çok önemli bir nokta var:

### Denklik = iş garantisi ❌

Ama:

### Denklik = adayın eğitimini Alman sistemiyle anlaşılır hale getirmek ✅

Özellikle yabancı bir aday olduğun için recruiter'ın kafasındaki:

> "Bu Türkiye'deki iki yıllık bilgisayar programcılığı eğitimi Almanya'da neye denk geliyor?"

sorusunu azaltır.

Anerkennung in Germany de IT mesleki yeterliliğinin tanınmasının işveren açısından avantaj sağladığını ve işverenin senin yeterliliğini Alman eğitimini tamamlamış bir adayla karşılaştırmasının kolaylaştığını belirtiyor. ([Anerkennungsportal](https://www.anerkennung-in-deutschland.de/html/en/9366.php?utm_source=chatgpt.com))

---

# Daha da önemlisi: Vize tarafı

Burada denklik **CV'den daha önemli** hale gelebiliyor.

Örneğin Almanya'nın **qualified professionals work visa** yolunda yabancı yeterliliğin Almanya'da tanınmış veya Alman akademik yeterliliğine eşdeğer olması gerekiyor. ([Make it in Germany](https://www.make-it-in-germany.com/en/visa-residence/types/work-qualified-professionals?utm_source=chatgpt.com))

Dolayısıyla:

**İş buldun → vizeye geçtin**

aşamasında hangi oturum türüne girdiğin çok önemli.

---

# Ama senin için çok güzel bir alternatif de var

Güncel Alman kurallarında **IT profesyonelleri için özel kolaylıklar** bulunuyor.

Örneğin belirli şartları sağlayan, yeterli IT iş deneyimi olan kişiler formal tanıma olmadan da bazı IT çalışma yollarından yararlanabiliyor. Güncel kurala göre ilgili IT deneyimi için en az **2 yıl** deneyim şartı olan yollar mevcut. ([Make it in Germany](https://www.make-it-in-germany.com/en/looking-for-foreign-professionals/entering/admission-labour-market/it-professionals?utm_source=chatgpt.com))

Sen şu anda henüz bu deneyim seviyesinde olmadığın için:

> "Denklik gerekmiyor, boşver."

demek bence doğru strateji değil.

---

# Hatta senin için denklik + portfolio birlikte çok güçlü

Şöyle düşün:

### Sadece diploma

> Türkiye'de Bilgisayar Programcılığı mezunuyum.

Çok sıradan.

### Diploma + Anerkennung

> Türkiye'de aldığım IT eğitimi Almanya'daki ilgili yeterlilikle karşılaştırılmış/tanınmış.

Daha iyi.

### Diploma + Anerkennung + Security+

Daha iyi.

### Bunların üzerine:

**Staj + SOC Lab + AD Lab + Splunk + Nessus + GitHub**

🔥 İşte burada profil ciddi şekilde güçleniyor.

---

# Ben senin yerinde olsam ne yapardım?

**Denklik konusunu 6 aylık planın dışında bırakmazdım.**

Ama hemen rastgele bir kuruma diploma göndermek de istemezdim.

Önce senin diploman için **hangi belgenin doğru olduğunu kesinleştirirdim:**

```text
AYBÜ Bilgisayar Programcılığı
          │
          ▼
Anabin'deki mevcut durum
          │
          ▼
Akademik derece mi?
          │
       ┌──┴──┐
       │     │
      EVET   HAYIR
       │     │
       ▼     ▼
     ZAB    Anerkennung
     /       /
Statement   DAB /
of          Anerkennungs-
Comparability bescheid
```

Çünkü senin durumda asıl kritik soru:

> **"Benim AYBÜ Bilgisayar Programcılığı diplomam için ZAB Statement of Comparability mi, yoksa mesleki Anerkennung/DAB mı daha doğru?"**

Bunu netleştirirsek **hangi kuruma başvuracağını, hangi belgeleri hazırlayacağını, yaklaşık maliyeti ve bunun Chancenkarte + çalışma vizesi + CV açısından ne kazandıracağını** adım adım çıkarabiliriz.

Ve bence bunu **şimdi** netleştirmek mantıklı; çünkü yanlış belgeye aylar ve para harcamayalım.

---

# you asked

message time: 2026-08-24 13:39:01

peki hani bağzı sertifikalar var ya işte sertifikayı almak için 4 5 yıl deneyim istiyor ama gene de girip başarılı olduğuna dair bir belge alabiliyorsun o tarz sertifikalar alsam ve işte deneyimim olmamasına rağmen ben bu sertifikaları geçebilecek bilgiye donanıma sahibim demek avantaj sağlar mı bana

---

# chatgpt response

Evet, **ama düşündüğün avantaj biraz farklı çalışıyor.**

Senin söylediğin şey aslında şu:

> "Bu sertifika normalde deneyimli profesyoneller için tasarlanmış. Ben deneyim şartını karşılamıyorum ama sınavına girip geçtim. Dolayısıyla bu seviyedeki bilgiye sahip olduğumu gösterebiliyorum."

Bu **gerçekten güçlü bir sinyal olabilir**, fakat her sertifika için aynı derecede değil.

## Önce iki şeyi ayıralım

Bazı sertifikalarda:

### 1. Deneyim şartı sınava girmek için zorunlu

Örneğin belirli ileri seviye sertifikalarda birkaç yıl deneyim gerekir.

Bu durumda bazen sınava girip başarılı olsan bile **sertifikayı tam olarak "certified" olarak kullanamazsın**; "passed the exam" veya benzeri bir durum olabilir.

### 2. Deneyim sertifikayı almak için değil, tavsiye edilen/deneyim seviyesi için

Burada çok daha ilginç.

Örneğin sertifika kuruluşu:

> "Bu sertifika için 5 yıl deneyim öneriyoruz."

diyorsa ama sınava girmene izin veriyorsa ve sınavı geçersen:

**sertifikayı gerçekten alırsın.**

Bu durumda junior olman sertifikanın geçerliliğini otomatik olarak ortadan kaldırmaz.

---

# Ama asıl mesele şu

Recruiter'ın gözünde:

**"5 yıllık deneyim gerektiren seviyede bir sınavı geçtim."**

demek güzel.

Fakat recruiter hemen şunu sorabilir:

> "Tamam, sınavı geçmiş. Peki gerçek sistemde ne yaptın?"

İşte burada senin **portfolio + staj + lab** kombinasyonun devreye giriyor.

Örneğin:

```text
Junior aday

4 ay Cybersecurity Internship
        +
Security+
        +
Splunk SOC Lab
        +
Active Directory Lab
        +
Nessus Vulnerability Lab
        +
Advanced Security Certification
```

Bu çok daha etkileyici.

---

# Hatta senin için T-shaped stratejide bunu kullanabiliriz

Senin hedefin şu olmasın:

> "En fazla sertifikayı toplayayım."

Şu olsun:

> **"Junior olduğum halde teknik derinliğimi kanıtlayan sertifikaları seçeyim."**

Örneğin:

```text
                    Cybersecurity
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      Networking       Systems         Security
          │              │              │
          │          Windows / AD       │
          │              │              │
          └──────────────┼──────────────┘
                         │
                       SOC
                         │
               ┌─────────┴─────────┐
               │                   │
              SIEM             IR/Detection
               │                   │
               └─────────┬─────────┘
                         │
                   ADVANCED CERT
```

---

# Fakat burada sana önemli bir uyarı

**"Deneyim istemeyen her ileri sertifikayı alayım."**

❌ Bunu yapmayacağız.

Çünkü bazı sertifikalar junior için gerçekten **ROI'si düşük** olabilir.

Örneğin 1.000–2.000 € verip çok ileri bir sertifika almak yerine aynı parayla:

- Security+
- eğitim
- lab
- cloud lab
- domain
- VPS
- Hack The Box
- TryHackMe
- proje altyapısı

gibi şeyleri birleştirmek çok daha fazla değer yaratabilir.

---

# Peki hangi tip sertifikalar senin için çok değerli?

Ben özellikle **3 kategori** arardım.

## 🟢 1. Deneyim önerilen ama sınava açık sertifikalar

Bunlar senin söylediğin kategori.

Özellikle:

> "Recommended experience: 3–5 years"

ama:

> "No mandatory experience requirement"

olanlar.

Böyle bir sertifikayı gerçekten alabilirsen CV'de güzel bir sinyal olur.

---

# 🟢 2. Uygulamalı sınavı olan sertifikalar

Bence **senin için daha da değerliler.**

Çünkü teorik sınav:

> "Security kavramlarını biliyorum."

der.

Pratik sınav:

> **"Bana sistem verildi ve üzerinde gerçekten çalışabiliyorum."**

der.

Cybersecurity'de ikinci sinyal çok değerlidir.

Örneğin:

**hands-on penetration testing / defensive security / SOC / incident response** sınavları.

---

# 🟢 3. İşverenin gerçekten bildiği sertifikalar

Burada çok kritik bir nokta var.

Bir sertifika:

> "Çok zor."

olabilir.

Ama Almanya'daki recruiter:

> "Bu nedir?"

diyebilir.

O zaman sertifikanın değeri düşer.

Dolayısıyla hedefimiz:

**Zorluk × Tanınırlık × İşe uygunluk**

olmalı.

---

# Örneğin şu iki CV'yi düşün

### CV A

```text
Security+
5 tane küçük sertifika
10 tane online course
```

### CV B

```text
Security+

Practical SOC Certification
+
SOC Lab
+
AD Security Lab
+
Incident Response Writeups
+
Cybersecurity Internship
```

Ben **B'yi tercih ederim.**

---

# Senin durumunda daha ilginç bir şey yapabiliriz

Sen zaten bana daha önce:

- SANS roadmap
- CompTIA
- Security+
- CySA+
- PenTest+
- CASP+
- SOC
- Blue Team
- Cloud Security
- DevSecOps

gibi alanlardan bahsettin.

Buradan çok güzel bir strateji çıkarabiliriz.

Örneğin:

### Aşama 1

**Security+**

↓

### Aşama 2

**Pratik SOC / Blue Team sertifikası**

↓

### Aşama 3

**Daha ileri defensive security sertifikası**

↓

### Aşama 4

**Gerçek proje**

↓

### Aşama 5

**Almanya'da başvurular**

Böylece recruiter:

> "Bu adam junior."

Evet.

Ama hemen arkasından:

> "Fakat bu adam junior seviyesinin üzerinde teknik çalışma yapmış."

diyor.

**Aradığımız algı tam olarak bu.**

---

# Bir de çok önemli bir ayrıntı

CV'de asla şöyle yazma:

> ❌ "I have 5 years of cybersecurity experience."

Sertifikayı geçtiğin için bunu ima bile etmemelisin.

Bunun yerine:

> **"Earned [Certification], demonstrating proficiency in [skills]."**

veya

> **"Passed a hands-on cybersecurity certification exam covering [X, Y, Z]."**

dersin.

Bu hem dürüst hem de güçlü.

---

# Ben bunu senin için daha ileri götürürdüm

Senin **Almanya'da junior iş alma** hedefin olduğu için, rastgele sertifika seçmek yerine **Almanya'daki gerçek junior ilanlarını tarayıp** şunu çıkarabiliriz:

> "2026'da Almanya'daki Junior SOC / Cybersecurity ilanlarında hangi sertifikalar gerçekten geçiyor?"

Sonra onları:

| Sertifika | Deneyim şartı | Sınav zorluğu | Almanya'da tanınırlık | Junior için değer |
|---|---:|---:|---:|---:|
| Security+ | — | Orta | Yüksek | ⭐⭐⭐⭐⭐ |
| Sertifika B | 3 yıl önerilir | Yüksek | Yüksek | ⭐⭐⭐⭐ |
| Sertifika C | 5 yıl önerilir | Çok yüksek | Orta | ⭐⭐⭐ |
| Sertifika D | Yok | Orta | Düşük | ⭐⭐ |

şeklinde karşılaştırabiliriz.

**Bence bunu yapalım.** Çünkü senin durumunda "hangi sertifika zor?" sorusundan çok daha önemli olan soru:

> **"Türkiye'den Almanya'daki junior cybersecurity işine başvururken, benim deneyim açığımı hangi sertifika/proje kombinasyonu en iyi kapatır?"**

Bu soruya göre sertifika seçersek paranı ve 6 aylık zamanını çok daha verimli kullanırız.

---

# you asked

message time: 2026-08-24 13:41:46

yani aslında tryhackme hack the box gibi yerlerden veya dvwa metasploitable gibi labları odaları çözsem ve bunlar ile ilgili mediumda githubda yazı yazsam yeter mi junior için

---

# chatgpt response

**Tek başına hayır; ama doğru şekilde yaparsan junior seviyede başvuru için çok güçlü bir temel olur.** Hatta senin durumda ben "sertifika koleksiyonu" yerine **lab + proje + write-up + staj + 1-2 tanınan sertifika** kombinasyonunu tercih ederim.

Şöyle düşün:

### ❌ Sadece bunu yapmak

- TryHackMe odaları
- HTB makineleri
- DVWA
- Metasploitable
- 50 tane room tamamlandı

CV açısından çok güçlü değil.

Çünkü recruiter şunu görebilir:

> "Bu kişi eğitim platformlarında alıştırma yapmış."

---

### ✅ Bunu yapmak

Örneğin bir saldırı senaryosunu:

**DVWA → SQL Injection**

çalıştın.

Ama sadece çözmedin.

Şunları yaptın:

```text
DVWA
 ↓
Vulnerability discovery
 ↓
SQL Injection
 ↓
Exploit
 ↓
Why does it work?
 ↓
HTTP request analysis
 ↓
Impact
 ↓
Mitigation
 ↓
Detection
 ↓
Write-up
```

Sonra GitHub'a:

> **DVWA SQL Injection — Technical Analysis & Remediation**

koydun.

Medium'da da daha anlaşılır bir teknik yazı yayınladın.

İşte bu çok daha değerli.

---

# Senin için ideal yapı

Ben bunu **4 katmanlı** yapardım.

## 1️⃣ Platformlar → beceri kazan

**TryHackMe / HTB / pwn.college**

Burada:

- Networking
- Linux
- Windows
- Web
- Enumeration
- Privilege escalation
- Active Directory
- SOC
- Detection

çalış.

Bunlar **antrenman sahası.**

---

# 2️⃣ Kendi labların → gerçekten uyguladığını göster

Burada:

- DVWA
- Metasploitable
- Juice Shop
- BWA(BWAPP)
- Windows
- Active Directory
- Splunk
- Sysmon
- Nessus

gibi sistemleri kullan.

Bunlar senin **laboratuvarın.**

---

# 3️⃣ GitHub → kanıt

Burada odanın kendisini değil, **öğrendiğini** göster.

Örneğin:

```text
github
│
├── SOC-Lab
├── Active-Directory-Lab
├── Vulnerability-Management
├── DVWA-Research
├── Network-Security
├── Python-Security-Tools
│
└── Writeups
    ├── HTB
    ├── THM
    ├── Web Security
    ├── AD
    └── Network Security
```

---

# 4️⃣ Medium → iletişim becerisi

Burada her çözdüğün makineyi yazmana gerek yok.

**Kaliteli birkaç yazı** daha iyi.

Mesela:

### Yazı 1

> **How I Built a Mini SOC Lab with Windows, Sysmon and Splunk**

### Yazı 2

> **From Nmap Scan to Vulnerability Assessment: A Practical Lab**

### Yazı 3

> **Investigating a Brute-Force Attack Using Windows Event Logs**

### Yazı 4

> **Active Directory Security: From Authentication to Attack Detection**

Bunlar recruiter'a çok daha fazla şey anlatır.

---

# Ve senin mevcut stajın burada çok önemli

Senin profilini şöyle düşün:

```text
                  FAİK
                    │
       ┌────────────┼────────────┐
       │            │            │
     STAJ         LABS        PROJECTS
       │            │            │
       └────────────┼────────────┘
                    │
                  GitHub
                    │
              Write-ups
                    │
              Security+
                    │
             German B1/B2
                    │
                    ▼
          Junior Cybersecurity
```

Bu, **"sadece TryHackMe çözdüm"** profilinden tamamen farklı.

---

# Peki kaç tane oda/makine?

Burada da bir hata yapmanı istemiyorum.

**1000 room bitirmeye çalışma.**

Örneğin:

### Networking

5–10 kaliteli lab

### Linux

10 civarı

### Web Security

10–15

### Windows/AD

10–15

### SOC

10–15

### Blue Team

10 civarı

Ama her önemli konuyu **uygulayıp anlatabilecek seviyeye gel.**

---

# Bir odadan ne öğrenmiş olmalısın?

Örneğin HTB'de bir makine çözdün.

Kendine şunları sor:

> Bu makineyi neden enumerate ettim?

> Nmap'te gördüğüm port ne anlama geliyor?

> Vulnerability'yi nasıl fark ettim?

> Exploit neden çalıştı?

> Başka nasıl exploit edilebilirdi?

> Bu saldırıyı gerçek sistemde nasıl önlerim?

> Defender tarafında bunu nasıl tespit ederim?

> Hangi log oluşurdu?

İşte **junior seviyeye yaklaştıran düşünme biçimi bu.**

---

# Hatta sana daha önemli bir önerim var

Sen sadece **Red Team** çalışırsan eksik kalırsın.

Senin Almanya hedefin için:

### %40 offensive

- Nmap
- enumeration
- web vulnerabilities
- exploitation
- privilege escalation
- AD attacks

### %60 defensive

- Windows logs
- Sysmon
- SIEM
- Splunk
- detection
- incident response
- vulnerability management
- firewall
- EDR

yapardım.

Çünkü seni:

> **"HTB oynayan kişi"**

olarak değil,

> **"Security olayını hem saldırgan hem savunmacı perspektifinden anlayan junior analyst"**

olarak konumlandırmak istiyoruz.

---

# Sonuç

Senin sorunun cevabı:

**Evet, THM + HTB + DVWA + Metasploitable + GitHub + Medium, junior olmak için gayet yeterli bir pratik temel oluşturabilir.**

Ama şu şartla:

> **Oda sayısı değil, ne öğrendiğini ve bunu gerçek dünyaya nasıl bağladığını göstereceksin.**

Ve senin için ideal CV kombinasyonu bence:

**Staj**
+
**Security+**
+
**THM/HTB**
+
**3 büyük kendi lab projesi**
+
**GitHub write-ups**
+
**birkaç kaliteli Medium yazısı**
+
**Almanca B1/B2**
+
**teknik İngilizce**
+
**iyi hazırlanmış CV**

Bu noktada artık "sertifika almadan junior olabilir miyim?" sorusunun cevabı da **evet** olur. Sertifika sayısı yerine **kanıtlanabilir beceri** gösterirsin.

Hatta istersen bundan sonra senin için **"Junior SOC/Cybersecurity için THM + HTB + DVWA + Metasploitable + kendi lablarımda hangi sırayla ne yapacağım?"** şeklinde tek bir **pratik müfredat** oluşturabiliriz. Bu, 6 aylık Almanya iş planımızın teknik omurgası olur.

---

# you asked

message time: 2026-08-24 13:56:19

şuanda bulunduğum noktayı tarif edeyim sen de bundan sonra nasıl ilerleyeceğimizi anlat: Şuan kursun 3. ayını bitirdik 4. ayın içindeyiz ve edr konusundayız fakat bundan önceki firewall cryptography ve windows ad konularında eksiklerim olduğuna inanıyorum veya diğer konuları da tekrar etmem gerektiğine inanıyorum, security+ sertifikasını daha almadım kurs sonunda sertifikaya yönelik ders verecekler onu bekliyorum onu aldıktan sonra sertifika sınavına kayıt oluşturacağım, ingilizcem b1 civarında ve dil çalışmaya başladım, almancam a1 e yeni geldi tam değil, yaptığım şuan githubımda olan projelerim tamamen wibe coding ile yapılmıştı o sebeple onları baştan anlayarak yapmak istiyorum, USAC projesi daha bitmedi mvp sürümünde ama onu da baştan bir daha tasarlayacağım, mediuma hiç yazı yazmadım daha, thm (90 a yakın oda çözdüm ama bir çoğunu anlamadan sadece soruları cevaplamak için çözdüm) ve htb de çok bir şey yapmadım daha, kursun yaptıracağı 3 4 proje olacak kendi dediklerine göre büyük önemli projeler olacakmış bunlar.

---

# chatgpt response

Evet. Şu anki durumunu tarif edince tablo çok daha netleşti. Ve açıkçası **sıfırdan başlaman gerekmiyor**; fakat şu anda bilgilerin biraz parçalı ve bazı şeyleri "çözmüş görünüyorsun ama gerçekten bilmiyorsun" durumunda. Bunu düzeltirsek 6 aylık Almanya hedefi için çok daha sağlam bir profil çıkarabiliriz.

Önce mevcut durumunu doğru teşhis edelim.

## 1. Şu anki gerçek seviyen

Ben seni şu anda şöyle değerlendiriyorum:

| Alan | Durum |
|---|---|
| IT fundamentals | 🟢 Temel var |
| Networking | 🟡 Öğreniyorsun, tekrar gerekli |
| Linux | 🟡 Temel/orta |
| Windows | 🟡 Tekrar gerekli |
| Active Directory | 🔴 Yeniden çalışmalısın |
| Firewall | 🔴 Tekrar gerekli |
| Cryptography | 🔴 Tekrar gerekli |
| EDR | 🟡 Şu an öğreniyorsun |
| Nmap | 🟡 Kullanmışsın, derinleştirilecek |
| Python | 🟡 Kod okuyup anlayacak/yeniden yazacak seviyeye getirilmeli |
| Scapy | 🟡 |
| SIEM/Splunk | 🟡 Kurs ilerledikçe güçlenecek |
| Vulnerability Management | 🟡 |
| Pentesting | 🟡 THM deneyimi var ama yüzeysel |
| Blue Team/SOC | 🟡 → 🟢 yapabiliriz |
| GitHub | 🟡 Projeler var fakat Wibe coding nedeniyle yeniden yapılmalı |
| Portfolio | 🔴 Henüz profesyonel sunum yok |
| Medium | 🔴 Başlamadın |
| Security+ | 🟡 Kurs devam ediyor |
| İngilizce | 🟡 ~B1 |
| Almanca | 🔴 A1 başlangıcı |
| Gerçek deneyim | 🟢 Stajın var |

Ve **THM'de 90 oda çözmüş olman** ilk bakışta güzel görünse de senin söylediğin şu cümle daha önemli:

> "Birçoğunu anlamadan sadece soruları cevaplamak için çözdüm."

Bu aslında kötü bir şey değil.

Çünkü artık **neyi yanlış yaptığını biliyoruz.**

90 odayı tekrar çözmeyeceğiz.

---

# 2. En önemli kararımız

Şu andan itibaren:

> **"Daha fazla şey bitirmek"**

yerine

> **"Bildiklerimi gerçekten biliyor hale gelmek"**

moduna geçiyoruz.

Çünkü senin şu an ihtiyacın:

**quantity → quality**

dönüşümü.

---

# 3. Kursu bırakmıyoruz

Bu çok önemli.

Kursun şu anda:

**4. ay / EDR**

aşamasında.

Kursu normal şekilde takip edeceksin.

Çünkü kurs sana bizim için çok değerli bir omurga veriyor:

```text
IT Fundamentals
      ↓
Networking
      ↓
Server Management
      ↓
Linux
      ↓
Windows Server
      ↓
Active Directory
      ↓
Security
      ↓
Cryptography
      ↓
Firewall
      ↓
EDR
      ↓
Nmap
      ↓
Nessus
      ↓
Exploitation
      ↓
SIEM / Splunk
      ↓
Incident Response
      ↓
GRC
      ↓
Security+
```

Bu sırayı bozmayacağız.

**Ama arkadan tekrar sistemi kuracağız.**

---

# 4. Yeni sistemimiz: "Çift hat"

Bundan sonra iki paralel yolumuz olacak.

### HAT A — Kurs

Şu an:

**EDR**

→ kursun yeni konularını öğren.

### HAT B — Temel güçlendirme

Eski konuları:

**Firewall → Cryptography → AD → Windows → Linux → Networking**

tekrar edeceğiz.

Böylece:

```text
KURS
  ↓
Yeni bilgi
  ↓
────────────────
  ↑
TEKRAR
  ↑
Eski bilgi
```

şeklinde ilerleyeceğiz.

---

# 5. Fakat her şeyi baştan izlemeyeceğiz

Bu çok önemli.

Örneğin Firewall konusunda 10 saatlik kurs videosu varsa:

**10 saati tekrar izlemeyeceksin.**

Önce bana:

> "Firewall hakkında bildiklerim bunlar..."

diye anlatacaksın.

Ben sana sorular soracağım.

Eksik olduğun noktaları bulacağız.

Sonra sadece o noktaları çalışacaksın.

Buna **diagnostic learning** diyebiliriz.

---

# 6. İlk büyük görevimiz: Bilgi envanteri

Bence hemen şu anda bunu yapmalıyız.

Cybersecurity bilgisini şu başlıklara böleceğiz:

### A — Networking

- OSI
- TCP/IP
- Ethernet
- ARP
- IP
- subnetting
- TCP/UDP
- DNS
- DHCP
- NAT
- routing
- switching
- VLAN
- VPN
- HTTP/HTTPS

### B — Linux

- filesystem
- permissions
- users
- processes
- services
- networking
- SSH
- logs
- Bash

### C — Windows

- users
- groups
- processes
- services
- registry
- PowerShell
- Event Viewer
- Windows logs

### D — Active Directory

- Domain
- DC
- OU
- GPO
- users/groups
- Kerberos
- NTLM
- LDAP
- DNS
- authentication
- authorization

### E — Security Fundamentals

- CIA
- threats
- vulnerabilities
- risks
- attack surface
- authentication
- authorization
- IAM
- least privilege

### F — Cryptography

- encryption
- hashing
- encoding
- symmetric
- asymmetric
- AES
- RSA
- hashing algorithms
- digital signatures
- certificates
- PKI
- TLS

### G — Network Security

- firewall
- IDS
- IPS
- WAF
- VPN
- proxy
- segmentation

### H — Endpoint Security

- EDR
- antivirus
- Sysmon
- endpoint telemetry
- detection
- response

### I — Offensive Security

- reconnaissance
- enumeration
- scanning
- vulnerability
- exploitation
- privilege escalation
- persistence
- lateral movement

### J — Defensive Security

- SIEM
- logs
- detection
- alert
- triage
- incident response
- threat hunting
- IOC
- IOA

### K — Vulnerability Management

- Nmap
- Nessus
- CVE
- CVSS
- remediation
- patching
- validation

---

# 7. Sonra her konuyu üç seviyeye ayıracağız

### 🔴 Level 0

"Biliyorum sanıyorum ama anlatamıyorum."

### 🟡 Level 1

"Temel olarak anlatabiliyorum."

### 🟢 Level 2

"Teknik mülakatta anlatabilir ve labda uygulayabilirim."

Bizim hedefimiz:

**Önemli konuların tamamını 🟢 yapmak.**

---

# 8. THM'yi de tamamen değiştireceğiz

Şu anda:

> Odayı aç → soruyu bul → cevabı yaz → tamamlandı.

yok.

Bundan sonra:

### 1. Konuyu öğren

↓

### 2. Odayı çöz

↓

### 3. Kendi cümlelerinle anlat

↓

### 4. Ben seni sorgulayayım

↓

### 5. Mini write-up

Bu kadar.

Örneğin SQL Injection odası:

> SQL injection nedir?

> Neden oluşur?

> Prepared statement bunu nasıl engeller?

> GET ve POST farkı nedir?

> Attacker ne elde edebilir?

> WAF bunu nasıl etkiler?

Bunları cevaplayamıyorsan oda **bitmiş sayılmayacak.**

---

# 9. 90 THM odasına ne yapacağız?

**Tekrar etmeyeceğiz.**

Ama çözdüğün odalardan önemli kategorileri çıkaracağız.

Örneğin:

```text
90 rooms
   ↓
Categorize
   ↓
Networking
Linux
Web
AD
Privilege Escalation
SOC
Crypto
etc.
```

Sonra hangi kategorilerde boşluk olduğunu göreceğiz.

Böylece 90 odayı çöpe atmıyoruz.

**Onları diagnostic data olarak kullanıyoruz.**

---

# 10. Wibe-coded projeler

Bence burada çok doğru bir karar verdin:

> "Baştan anlayarak yapmak istiyorum."

**Kesinlikle.**

Çünkü GitHub'da 20 tane AI tarafından yazılmış proje yerine:

**3 tane gerçekten anlayabildiğin proje**

çok daha değerli.

---

## Örneğin Network Scanner

Eski kodu:

❌ silmek zorunda değilsin.

Ama yeni repository/branch açıp:

### V1

Kendin yaz.

Önce:

```text
socket nedir?
IP nedir?
port nedir?
TCP connection nasıl kurulur?
timeout nedir?
threading nedir?
```

anla.

Sonra scanner'ı yaz.

Sonra Scapy versiyonunu yaz.

Sonra:

**Nmap neden benim scannerımdan daha gelişmiş?**

diye incele.

İşte o zaman proje gerçekten senin olur.

---

# 11. USAC projesi

USAC'ı da hemen çöpe atmıyoruz.

Mevcut MVP:

**referans prototip.**

Sonra:

```text
MVP
 ↓
What did I build?
 ↓
What don't I understand?
 ↓
Architecture redesign
 ↓
Security analysis
 ↓
V2
```

şeklinde ilerleyeceğiz.

Bu aynı zamanda seni **software + cybersecurity** kesişiminde güçlü yapabilir.

---

# 12. Kursun gelecek 3–4 projesi çok önemli

Buraya özellikle dikkat.

Kurs:

> "Büyük önemli projeler olacak."

diyorsa bunları **ödev gibi yapmayacağız.**

Her projeyi:

### Kurs teslimi

+ 

### GitHub portfolio projesi

haline getireceğiz.

Örneğin kursun Firewall + EDR projesi varsa:

Kursun istediğini yapacağız.

Ama sonra:

- README
- architecture diagram
- threat model
- configuration
- attack scenario
- detection
- mitigation
- screenshots
- lessons learned

ekleyip **profesyonel case study** haline getireceğiz.

Bunlar ileride Medium yazılarımızın da kaynağı olacak.

---

# 13. Medium'a hemen başlamıyoruz

Şu anda Medium'a:

> "Bugün EDR öğrendim."

diye yazı yazmak istemiyorum.

Önce **gerçekten bir şey yap.**

Sonra yaz.

Örneğin:

> **Building a Windows EDR Lab: From Endpoint Telemetry to Detection**

Bu çok daha güçlü.

---

# 14. Security+ konusunda

Burada da doğru yapıyorsun.

Şimdilik:

**kurs → Security+ dersleri → sınav**

akışını takip et.

Ama Security+ derslerini beklerken temel öğrenmeyi bırakmayacağız.

Çünkü Security+ sana:

**sınav bilgisi**

verecek.

Biz ise:

**iş bilgisi**

oluşturacağız.

İkisi aynı şey değil.

---

# 15. İngilizce

B1 civarındaysan şu anda hedefimiz:

**C1 olmak değil.**

Öncelikle:

### Cybersecurity English B2

seviyesine çıkmak.

Özellikle:

- teknik açıklama
- documentation okuma
- GitHub README
- security report
- interview

üzerinden.

---

# 16. Almanca

A1'in yeni başlamış olması gayet normal.

Şimdilik:

**A1 → A2**

ana hedef.

Ama uzun vadede:

**B1 → B2**

Almanya iş başvurularında ciddi avantaj.

---

# 17. Ve asıl portfolio stratejimiz

6 ay sonunda:

### ❌

```text
THM: 150 rooms
HTB: 10 machines
15 certificates
```

istemiyorum.

### ✅

Şunu istiyorum:

```text
Cybersecurity Internship

Security+

──────────────────────

01 SOC / SIEM Lab
02 Active Directory Security Lab
03 Vulnerability Management Lab
04 Network Security Tool
05 Security Automation / USAC

──────────────────────

10-20 high quality THM/HTB writeups

──────────────────────

5-8 high quality Medium articles

──────────────────────

GitHub with clean documentation
```

Bu çok daha güçlü.

---

# 18. Şu anda senin en büyük problemin aslında bilgi eksikliği değil

Bence:

**fragmentation.**

Çok farklı şeylere dokunmuşsun:

```text
Networking
Linux
Windows
AD
Nmap
Python
Scapy
THM
HTB
Cryptography
Firewall
EDR
SIEM
...
```

Ama aralarında bağlantılar tam oturmamış.

Biz şimdi bunları **tek bir sistem** haline getireceğiz.

Örneğin:

> Networking → Firewall → Windows → AD → Attack → Logs → EDR → SIEM → Incident Response

Artık bunlar ayrı dersler olmayacak.

**Tek bir saldırı-savunma hikâyesinin parçaları olacak.**

---

# 19. Dolayısıyla bundan sonraki çalışma sistemimiz

Her yeni konu için:

**1. Öğren**

↓

**2. Bana anlat**

↓

**3. Ben sorgulayayım**

↓

**4. Eksiklerini bulalım**

↓

**5. Lab yap**

↓

**6. Küçük bir görev/proje**

↓

**7. GitHub'a belgele**

↓

**8. İngilizce anlat**

↓

**9. Gerekirse Medium yazısı**

Bu sistem seni sadece sınava değil, **işe** hazırlayacak.

---

# Ve bence şu anda yapmamız gereken ilk şey bu

**Yeni bir roadmap açmayalım.**

Sen zaten yeterince roadmap gördün. 😄

Şu anda doğrudan **mevcut kursunun üzerine bir "Cybersecurity Knowledge Map" çıkaralım.**

İlk konu olarak da **Firewall** seçelim; çünkü hem yakın zamanda gördün hem de "eksik kaldım" diyorsun.

Ben sana **Firewall hakkında hiçbir şey bilmiyormuşsun gibi ders anlatmayacağım.** Önce seni sınayacağım.

Sen kendi bildiklerini anlatacaksın; ben de cevaplarından **tam olarak hangi noktaları bildiğini, hangilerinde ezber yaptığını, hangilerinin eksik olduğunu** çıkaracağım.

Sonra sana yalnızca eksik olduğun yerleri öğreteceğim. Ardından küçük bir firewall labı yapacağız. **Bu yöntemi daha sonra Cryptography → Windows/AD → Networking → EDR → SIEM şeklinde bütün eski konulara uygulayacağız.**

Böylece hem kurs ilerlerken geriye dönük açıkları kapatacağız hem de 6 ay sonunda gerçekten **"Ben bunları biliyorum ve gösterebilirim"** diyebileceğin bir profil oluşturacağız.

---

# you asked

message time: 2026-08-24 15:47:01

kafamdaki şuydu bir süredir de onu yapıyordum chatgpt ile konular ile ilgili notlarımı açıp ona anlayıyordum ilk konudan başlamıştık ben anlatıyorum aklıma gelen soruları soruyordum o eksik konuları gideriyordu ona devam edeyim mi çünkü pasif bir öğrenmeden aktif bir öğrenmeye geçiyorduk öyle ya da başka önerin varsa onu yapalım

---

# chatgpt response

Evet. **Kesinlikle ona devam etmeni öneriyorum.** Hatta senin şu anki durumunu öğrendikten sonra, önceki yöntemi biraz daha sistematik hale getirip **ana öğrenme yöntemimiz** yapardım.

Çünkü yaptığın şey gerçekten pasif öğrenmeden aktif öğrenmeye geçiş:

> Ders/not → hatırlamaya çalışma → kendi cümlelerinle anlatma → takıldığın yerleri fark etme → soru sorma → eksikleri kapatma → tekrar anlatma.

Bu, senin için şu anda yeni bir "roadmap" aramaktan çok daha değerli.

## Ama yöntemde 3 değişiklik yapalım

Senin yaptığın:

> "Notlarımı açıyorum → ChatGPT'ye anlatıyorum → aklıma gelenleri soruyorum."

Bunu:

> **Hatırlama → Açıklama → Sorgulama → Uygulama → Pekiştirme**

haline getirelim.

---

# 1. Notlara bakmadan anlat

Bence en önemli değişiklik bu.

Önce notlarını **kapat**.

Örneğin konu:

**Firewall**

Bana doğrudan şöyle başla:

> "Firewall bildiğim kadarıyla ağ trafiğini kontrol eden bir güvenlik mekanizması..."

Sonra aklına geldiği kadar anlat.

Takıldığın yerde:

> "Burayı tam hatırlamıyorum."

de.

**O anda notuna bakma.**

Çünkü bizim ölçmek istediğimiz şey:

> "Bu bilgi kafamda gerçekten var mı?"

---

# 2. Sonra ben seni sorgulayacağım

Sen anlatmayı bitirdiğinde benim görevim sadece:

> "Evet doğru."

demek olmayacak.

Ben üç şey yapacağım:

### 🟢 Doğru olanlar

Bunları onaylayacağım.

### 🟡 Eksik olanlar

Örneğin:

> Firewall'ın stateful/stateful olmayan ayrımından bahsettin ama state table'ın nasıl çalıştığını açıklamadın.

### 🔴 Yanlış olanlar

Örneğin:

> "Firewall saldırıları tamamen engeller."

gibi bir şey söylersen düzelteceğim.

Sonra sana **sorular** soracağım.

---

# 3. Soruların kolaydan zora gitmesini sağlayacağız

Mesela Firewall:

### Seviye 1 — Tanım

> Firewall nedir?

### Seviye 2 — Mekanizma

> Firewall trafiği nasıl değerlendirir?

### Seviye 3 — Teknik

> Stateful firewall TCP bağlantısını nasıl takip eder?

### Seviye 4 — Uygulama

> Bir web sunucusunun 443 portunu internete açmak istiyorsan nasıl bir kural yazarsın?

### Seviye 5 — Güvenlik

> Firewall'ın arkasındaki web sunucusu SQL Injection'a karşı güvende midir?

### Seviye 6 — Senaryo

> Şirketin internete açık bir web sunucusu var. Firewall yalnızca 80/443'e izin veriyor ama saldırgan yine de sistemi compromise ediyor. Nasıl mümkün olabilir?

İşte son seviyelere geldiğinde **gerçekten düşünmeye başlıyorsun.**

---

# 4. Sonra notlarına geri dön

Sorgulama bittikten sonra:

**notlarını aç.**

Ve benimle birlikte:

> "Benim söylediğim ile notlarda ne eksik?"

diye karşılaştır.

Bu aşamada notlarını tekrar okumak artık pasif öğrenme değil.

Çünkü beynin önce:

> "Bunu biliyor muyum?"

diye aramış oluyor.

Sonra eksik bilgiyi yerine koyuyorsun.

---

# 5. Sonra lab

İşte burada yöntemin en önemli eksik parçasını ekliyoruz:

**uygulama.**

Çünkü:

> "Firewall nedir?"

sorusunu cevaplamak başka.

Gerçekten:

> "Linux'ta firewall kuralı oluştur, trafiği engelle, izin ver, logla ve sonucu test et."

demek başka.

Bu nedenle her büyük konunun sonunda **mini lab** olacak.

---

# 6. Son aşama: tekrar anlat

Labdan sonra bana tekrar anlat:

> "Tamam, firewall'ı şimdi baştan anlatıyorum."

Ve bu sefer:

**not yok.**

Eğer ikinci anlatımda daha düzgün, daha bağlantılı ve daha teknik konuşabiliyorsan:

### Konu tamam. 🟢

---

# Böylece her konu için döngümüz şu olacak

```text
                 DERS / KAYNAK
                       ↓
                  KISA NOTLAR
                       ↓
               ┌───────────────┐
               │ NOTLARA BAKMA │
               └───────┬───────┘
                       ↓
                  KENDİN ANLAT
                       ↓
                CHATGPT SORGUSU
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
           EKSİK                YANLIŞ
             ↓                   ↓
             └─────────┬─────────┘
                       ↓
                  NOTLARA DÖN
                       ↓
                     LAB
                       ↓
                 TEKRAR ANLAT
                       ↓
                  🟢 KONU TAMAM
```

**Bence senin için bundan daha iyi bir temel öğrenme sistemi kurmaya gerek yok.**

---

# Ama bir şey daha eklemek istiyorum: "Bağlantı kurma"

Senin asıl eksikliğinin sadece bilgi olmadığını düşünüyorum.

Örneğin Firewall, EDR, AD, SIEM, Networking ayrı ayrı öğrenilirse bir süre sonra yine parçalanır.

Bu yüzden her konunun sonunda sana:

> **"Bu konu diğer öğrendiğin konularla nerede kesişiyor?"**

sorusunu sorduracağım.

Örneğin Firewall:

```text
Networking
    │
    ├── IP
    ├── TCP
    └── Port
          │
          ▼
       Firewall
          │
     ┌────┼────┐
     ↓    ↓    ↓
   Allow Deny Log
               │
               ▼
             SIEM
               │
               ▼
           Detection
               │
               ▼
        Incident Response
```

Bir süre sonra böyle düşünmeye başlayacaksın.

Bu, **junior cybersecurity analyst** için çok daha önemli bir yetenek.

---

# THM/HTB'yi de bu sisteme bağlayacağız

Örneğin Firewall çalıştık.

Sonra THM'de firewall/network security ile ilgili bir oda.

Ama bu sefer:

> "Cevabı bulup geç."

yok.

Odayı çözerken kendine:

**"Şu anda hangi bilgimi kullanıyorum?"**

diyeceksin.

Sonra bana:

> "Bu odada şunu yaptım ve neden yaptığımı şöyle anladım."

diye anlatacaksın.

Böylece THM **ikinci bir ders kaynağı değil, bilgiyi test ettiğin saha** olacak.

---

# GitHub/Medium da bunun son halkası

Örneğin:

**Firewall öğrendin → lab yaptın → anladın.**

Hemen Medium yazısı yazmak zorunda değilsin.

Ama kendi GitHub notlarında:

```text
Firewall
├── What is it?
├── How it works
├── Stateful vs stateless
├── Rules
├── NAT
├── Limitations
├── Linux lab
└── Lessons learned
```

gibi bir kayıt tutabiliriz.

Daha sonra gerçekten ilginç bir şey yaptığında:

> **"Understanding Stateful Firewalls Through a Practical Lab"**

gibi Medium yazısına dönüştürürüz.

---

# Ve senin mevcut durumunda sıralamamız şöyle olsun

**Kurs:** EDR'den devam.

**Paralel tekrar:** Daha önce işlediğin konular.

Ama tekrar sırası kurs sırasıyla olmak zorunda değil.

Ben şunu tercih ederim:

### 1. Networking
↓
### 2. Linux
↓
### 3. Windows
↓
### 4. Active Directory
↓
### 5. Security Fundamentals
↓
### 6. Cryptography
↓
### 7. Firewall
↓
### 8. EDR
↓
### 9. Nmap / Vulnerability Management
↓
### 10. SIEM / Splunk
↓
### 11. Incident Response

Çünkü sonunda:

**network → endpoint → identity → security control → detection → response**

şeklinde bir bütün oluşturuyor.

---

## Ve bence şu anda yeni bir şey yapmayalım.

Senin zaten başladığın sistemi değiştirmek yerine **onu profesyonel hale getirelim.**

Bir sonraki oturumda notlarını açıp **ilk konudan kaldığımız yerden devam edebilirsin.**

Sen konuyu **kendi bildiğin şekilde anlatacaksın**. Ben de anlatımını bölmeden dinleyip, sonunda:

- 🟢 bildiklerin
- 🟡 eksiklerin
- 🔴 yanlışların
- ❓ sana soracağım sorular
- 🧪 yapacağın mini lab
- 🔗 diğer konularla bağlantıları

çıkaracağım.

Ve **senin notlarının yerine geçmeye çalışmayacağım**; notların senin kaynak materyalin, ben ise **öğretmen + sınavcı + tartışma partneri + lab mentoru** gibi çalışacağım.

Bence senin şu an ihtiyacın tam olarak bu.

---

# you asked

message time: 2026-08-24 16:51:40

peki bu şekilde günlük kaç saat çalışmalıyım ve 6 ayda nereye gelirim

---

# chatgpt response

Evet. Senin mevcut noktanı düşününce **günde 3 saat civarı, haftada 6 gün** bence en iyi denge. Ama kritik olan 3 saat boyunca "ders tüketmek" değil; **aktif öğrenme + lab + proje** yapmak.

6 ay boyunca bunu gerçekten uygularsan, başlangıçtaki durumuna göre oldukça ciddi bir yere gelebilirsin.

## 🎯 Benim önerdiğim tempo

### İdeal: 3 saat/gün × 6 gün = 18 saat/hafta

Bunu şöyle bölelim:

| Süre | Ne yapacaksın? |
|---:|---|
| **60 dk** | Konu öğrenme + kendi notlarından aktif anlatım |
| **45 dk** | Sorgulama / eksik kapatma / tekrar |
| **45 dk** | Lab / THM / HTB |
| **30 dk** | İngilizce veya Almanca |

Ama burada bir ayrıntı var:

**60 + 45 dakika kısmını her gün yapmak zorunda değilsin.**

Proje döneminde örneğin:

> 30 dk teori + 2 saat lab + 30 dk dil

çok daha mantıklı olabilir.

---

# Haftada 1 gün "hafif gün"

6 gün çalışıp 1 gün tamamen boş bırakmanı öneririm.

Örneğin:

**Pazartesi–Cumartesi:** çalışma  
**Pazar:** dinlenme

Çünkü senin problemin bilgiye erişim değil, **bilgiyi uzun süre zihinde tutup kullanabilir hale getirmek.**

---

# Peki 6 ay sonra nereye gelirsin?

Gerçekçi konuşayım.

**6 ayda senior olmazsın.**

Ama şu anki seviyenden:

> "Cybersecurity öğreniyorum, çeşitli şeylere dokundum."

seviyesinden:

> **"Junior cybersecurity/SOC pozisyonlarına başvurabilecek ve teknik mülakatta kendini gösterebilecek aday."**

seviyesine gelmen **gayet gerçekçi.**

---

# 1. AY

### Hedef:

**Temelleri birbirine bağlamak.**

Özellikle:

- Networking
- Linux
- Windows
- Security fundamentals
- Firewall
- Cryptography
- AD'nin temelleri

Burada büyük miktarda yeni konu öğrenmekten çok:

> **"Ben bunu gerçekten anlatabiliyor muyum?"**

sorusuna cevap arayacağız.

### Ay sonunda:

Birisi sana:

> "TCP ile UDP arasındaki fark?"

> "DNS nasıl çalışıyor?"

> "VLAN nedir?"

> "Firewall ne yapıyor?"

> "Hash ile encryption arasındaki fark?"

> "Active Directory nedir?"

dediğinde düzgün şekilde açıklayabilmeye başlamalısın.

---

# 2. AY

### Windows + Active Directory + Security

Burada artık enterprise ortamını anlamaya başlayacaksın.

Örneğin:

```text
User
 ↓
Computer
 ↓
Domain
 ↓
Domain Controller
 ↓
Authentication
 ↓
Authorization
 ↓
GPO
 ↓
Security Logs
```

Sonra kontrollü saldırı/savunma labları.

### Ay sonunda:

Bir Windows/AD ortamına baktığında:

> "Burada kullanıcılar, makineler, domain controller, authentication ve policy mekanizması böyle çalışıyor."

diyebilmen gerekir.

---

# 3. AY

### SOC / SIEM

Burada profilin ciddi şekilde değişmeye başlar.

Öğren:

- logs
- Sysmon
- SIEM
- Splunk
- detection
- alerts
- triage
- IOC
- incident

Sonra kursun büyük projelerinden birini profesyonel hale getiririz.

### Ay sonunda:

Bir alert geldiğinde:

> "Ne olmuş?"

> "Hangi loglara bakmalıyım?"

> "Bu false positive olabilir mi?"

> "Severity nedir?"

> "Ne yapmalıyım?"

diye düşünmeye başlayabilirsin.

Bu **junior SOC** açısından çok önemli.

---

# 4. AY

### Offensive + Defensive birleşiyor

THM/HTB'yi burada daha ciddi kullanacağız.

Ama artık:

> "Makineyi rootladım."

değil.

Şunu soracağız:

> **"Bu saldırı nasıl gerçekleşti ve defender bunu nasıl tespit ederdi?"**

Örneğin:

```text
Nmap
 ↓
Enumeration
 ↓
Vulnerability
 ↓
Exploitation
 ↓
Privilege Escalation
 ↓
Logs
 ↓
Detection
 ↓
Response
```

Bu düşünce seni sadece "CTF oyuncusu" olmaktan çıkarıyor.

---

# 5. AY

### Portfolio + gerçek başvurular

Burada elimizde yaklaşık:

**3–4 ciddi proje**

olmasını isterim.

Örneğin:

### 🔥 SOC Lab

Windows + Sysmon + Splunk + detection.

### 🔥 AD Security Lab

Active Directory + saldırı/savunma.

### 🔥 Vulnerability Management

Nmap + Nessus + CVE/CVSS + remediation.

### 🔥 Security Tool

Kendi yazdığın Network Scanner / Packet Analyzer gibi.

Ve kursun kendi projeleri de bunların arasına girebilir.

---

# 6. AY

Burada artık:

## **JOB MODE**

açıyoruz.

Başvurular:

- Junior SOC Analyst
- SOC Analyst
- Junior Cybersecurity Analyst
- IT Security Analyst
- Security Operations
- Junior IT Security Consultant
- Vulnerability Management
- Security Monitoring
- Junior Network Security

gibi pozisyonlara.

Ve aynı anda:

**mülakat çalışması.**

---

# 6 ayın sonunda CV'ni nasıl görmek istiyorum?

Şuna yakın:

```text
FAIK EMRE PUSAT
Junior Cybersecurity Analyst
────────────────────────────────

EDUCATION
Computer Programming

EXPERIENCE
Cybersecurity Internship

CERTIFICATION
CompTIA Security+

TECHNICAL
Networking
Linux
Windows
Active Directory
SIEM / Splunk
EDR
Nmap
Nessus
Wireshark
Python / Scapy
Incident Response

PROJECTS
────────────────────────────────

SOC Detection & Investigation Lab

Active Directory Security Lab

Vulnerability Management Lab

Network Security Toolkit

USAC Security/Software Project

PORTFOLIO
────────────────────────────────

GitHub
Technical Write-ups
Medium

LANGUAGES
────────────────────────────────

English: B1 → B2
German: A1 → A2/B1
```

Buradaki seviyeler hedef; CV'ye yalnızca gerçekten ulaştığın seviyeyi yazacağız.

---

# Dil tarafında 6 ayda ne olur?

Burada biraz daha temkinli olacağım.

## İngilizce

Şu anda yaklaşık B1 diyorsun.

Günde 30 dakika teknik İngilizce + normal dil çalışması yaparsan:

**B1 → güçlü B1 / B2**

gayet mümkün.

Özellikle:

- teknik dokümantasyon
- GitHub
- interview
- cybersecurity explanation

üzerinden çalışırsak iş için yeterli seviyeye yaklaşabilirsin.

---

## Almanca

Şu an A1'in başındasın.

6 ayda:

**A2'yi sağlamlaştırmak**, iyi tempoyla **B1'e yaklaşmak/ulaşmak** gerçekçi bir hedef.

Ama burada 30 dakika/gün yeterli olmayabilir.

Almanya hedefini ciddi tutuyorsan Almancaya ayrıca:

**45–60 dakika/gün**

ayırmanı isterim.

Bu durumda günlük toplam çalışma süren:

### Cybersecurity: ~2.5–3 saat
### Almanca: ~45–60 dk

olabilir.

---

# O zaman ideal günlük sistemin aslında şu

## 🧠 Cybersecurity — 2.5 saat

**60 dk**

Aktif konu çalışması:

> anlat → sorgula → eksik bul

**45 dk**

Lab:

> THM / HTB / kendi labın

**45 dk**

Proje / kod / write-up

---

## 🇩🇪 Almanca — 45–60 dk

DW + konuşma pratiği.

---

## 🇬🇧 İngilizce

Bunu ayrı bir saat yapmak zorunda değilsin.

Cybersecurity çalışırken:

**kaynakları İngilizce oku + bana İngilizce anlat + teknik yazı yaz.**

Böylece iki işi aynı anda yapıyoruz.

---

# Yani toplam

### Minimum gün

**2 saat cybersecurity + 30 dk Almanca**

### Normal gün

**2.5–3 saat cybersecurity + 45 dk Almanca**

### Güçlü gün

**3–4 saat cybersecurity + 1 saat Almanca**

Bence **her gün 5–6 saat hedef koyma.**

Senin geçmişteki planlarında en büyük risklerden biri çok büyük hedef koyup bir süre sonra sistemin sürdürülemez hale gelmesi.

Bizim istediğimiz:

> **18 saat/hafta × 26 hafta ≈ 468 saat cybersecurity**

Bu **çok ciddi bir çalışma hacmi.**

Üstelik bunun önemli kısmı pasif video izlemek değil:

**anlatma + sorgulama + lab + proje.**

---

# 468 saat sonunda ne kadar ilerlersin?

Kabaca şöyle düşün:

### Şu an

**Temel bilgileri çeşitli yerlerden toplamış ama parçalı junior aday.**

↓

### ~150 saat

Temeller oturmaya başlar.

↓

### ~300 saat

Labları kendi başına yapmaya ve açıklamaya başlarsın.

↓

### ~400+ saat

Portfolio oluşturmuş, gerçek senaryoları tartışabilen, teknik mülakata hazırlanabilir junior aday.

↓

### 6 ay

**Almanya'daki junior pozisyonlara ciddi şekilde başvurabilecek profil.**

Ama bir noktayı özellikle vurgulayayım:

**468 saat = iş garantisi değil.**

İş piyasası, Almanca, CV, vize/çalışma hakkı, mülakat performansı ve ilanların gereksinimleri de sonucu etkiler.

Ama **senin mevcut durumundan 6 ayda "başvurulabilir junior" seviyesine çıkmak**, doğru çalışmayla bence gayet gerçekçi.

---

# Hatta bir hedef daha koyardım

6 ay sonunda sadece:

> **"İşe başvurmaya hazırım."**

demeyelim.

Şunu hedefleyelim:

> **"Bana rastgele bir junior SOC teknik mülakatı yap ve bildiğim şeyleri açıklayabileyim."**

Mesela sana:

> "Bir kullanıcı phishing linkine tıkladı. SOC analyst olarak ne yaparsın?"

dediğimde 5 dakika boyunca mantıklı bir investigation süreci anlatabiliyorsan...

**işte o zaman gerçekten ilerlemişiz demektir.**

Ve senin şu an yaptığın **"notu açıp kendi cümlelerimle anlatıyorum, sonra ChatGPT beni sorguluyor"** yöntemi tam olarak bu hedefe hizmet ediyor. O yüzden **yöntemi değiştirmeyelim; onu sistemleştirelim.**

---

# you asked

message time: 2026-08-24 17:06:58

o zaman şimdi nasıl başlayacağız ne yapacağız

---

# chatgpt response

Aynen. **Şimdi roadmap değiştirmiyoruz, yeni kaynak toplamıyoruz, THM'ye saldırmıyoruz.** Senin mevcut sisteminden başlıyoruz.

Şu anda yapacağımız şey çok basit:

# 1. Kurs → EDR'den devam

Kursun 4. ayında ve EDR'desin.

EDR dersini normal şekilde çalışmaya devam et.

Ders sırasında yine kısa, anahtar kelime şeklinde not al. Uzun uzun yazma.

Örneğin:

```text
EDR
├── Endpoint
├── Telemetry
├── Detection
├── Response
├── Process
├── Network
├── File
├── Registry
└── Behavior
```

Bunlar senin **ham notların**.

---

# 2. Aynı anda eski konuları sırayla toparlayacağız

Ama **dersleri baştan izlemeyeceksin.**

İlk olarak **Networking** ile başlayacağız.

Çünkü networking diğer her şeyin altında.

Sıra kabaca:

**Networking → Linux → Windows → AD → Security Fundamentals → Cryptography → Firewall → EDR → Nmap/Nessus → SIEM → Incident Response**

olacak.

Ama bu sırayı gerektiğinde değiştirebiliriz.

---

# 3. Her gün bizim çalışma döngümüz

Sen bana gelip:

> "Bugün Firewall çalışacağım."

demeyeceksin.

Önce kendi notlarını açacaksın.

### Aşama 1 — Notlara bakmadan anlat

Notlarını kapat.

Bana bildiğin her şeyi anlat.

Örneğin:

> "Firewall, ağ trafiğini belirli kurallara göre kontrol eden bir güvenlik mekanizmasıdır..."

Aklına geleni söyle.

**Takılırsan takıl.**

"Burayı bilmiyorum."

demek problem değil.

Hatta bizim için faydalı.

---

# 4. Ben o sırada öğretmen gibi davranacağım

Sen anlatmayı bitirince ben:

### 🟢 Doğru

Bildiklerini göstereceğim.

### 🟡 Eksik

Mesela:

> Stateful firewall'ın connection state'i nasıl tuttuğunu anlatmadın.

### 🔴 Yanlış

Varsa yanlışını düzelteceğim.

### ❓ Sorular

Sonra seni sınayacağım.

Örneğin:

> Stateful ve stateless firewall arasındaki fark nedir?

> Firewall OSI'nin hangi katmanlarında çalışabilir?

> NAT ile firewall aynı şey midir?

> Firewall 443 portuna izin veriyorsa HTTPS uygulaması güvenli midir?

Sorular giderek zorlaşacak.

---

# 5. Eksiklerini tekrar öğreneceğiz

Ben sana:

> "Firewall'ı baştan oku."

demeyeceğim.

Örneğin 10 alt konudan 7'sini biliyorsan:

**sadece 3 tanesini çalışacağız.**

Sonra tekrar bana anlatacaksın.

---

# 6. Ardından mini uygulama

Her konuya uygun küçük bir uygulama yapacağız.

Örneğin Firewall için:

- Linux firewall
- Windows Firewall
- firewall rule
- allow/deny
- port filtering
- logging

gibi.

Büyük proje olmak zorunda değil.

Ama:

> **"Ben bunu teoride biliyorum."**

yerine:

> **"Ben bunu çalıştırdım."**

noktasına geçeceğiz.

---

# 7. Sonra tekrar anlatacaksın

Labdan sonra:

> "Tamam, şimdi firewall'ı baştan anlatıyorum."

diyeceksin.

Bu sefer daha düzgün anlatabiliyorsan:

**🟢 Konu tamam.**

---

# 8. THM'yi bundan sonra böyle kullanacağız

90 odayı tekrar çözmüyoruz.

Bir konu üzerinde çalışırken, o konuyla ilişkili **1–3 kaliteli oda** seçiyoruz.

Örneğin networking çalışıyorsak:

> Network enumeration / protocols / packet analysis

ile ilgili oda.

Ve artık:

**soruları cevaplayıp geçmek yok.**

Oda bittikten sonra bana:

> "Bu odada şu saldırıyı yaptım ve bunun sebebi şu."

diye anlatacaksın.

---

# 9. GitHub'a henüz yüklenmiyoruz

Şu anda:

**öğren → anla → uygula**

aşamasındayız.

GitHub'ı biraz sonra devreye sokacağız.

Çünkü şu anda 20 tane yarım yamalak write-up üretmek istemiyorum.

Önce birkaç konuyu gerçekten öğren.

---

# 10. Büyük projeleri kursla birlikte yapacağız

Kursun vereceği 3–4 büyük proje geldiğinde:

**ödev → teslim**

yapmayacağız.

Onları:

**ödev → gerçek portfolio projesi**

haline getireceğiz.

README, mimari, açıklamalar, screenshots, attack/detection senaryoları, lessons learned vs. ekleyeceğiz.

---

# 11. Bugün ne yapıyoruz?

**Bugün sadece başlangıç yapıyoruz.**

### Görev:

## Networking'i anlat.

Notlarını **açabilirsin**, ama önce **bakma**.

Bana şu soruya cevap vererek başla:

> **"Bir bilgisayarın internete bağlanıp başka bir bilgisayarla iletişim kurmasını sağlayan şeyleri, bildiğin kadarıyla baştan sona anlat."**

Kafana gelen her şeyi söyle.

Şunları biliyorsan dahil et:

- Ethernet
- MAC
- IP
- ARP
- switch
- router
- TCP/UDP
- port
- DNS
- DHCP
- NAT
- VLAN
- firewall

Ama **bunları tek tek tanımlamaya çalışma**. Birbirleriyle nasıl bağlantılı olduklarını anlatmaya çalış.

Takıldığın yerde dur.

Yanlış söylemekten çekinme.

**Ben seni bölmeden önce anlatımını tamamlamanı bekleyeceğim; sonra nerelerde gerçekten bildiğini, nerelerde ezber kaldığını beraber çıkaracağız.**

Ve bundan sonra her konu için aynı sistemi kullanacağız.