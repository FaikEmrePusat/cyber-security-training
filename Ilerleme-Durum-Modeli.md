# İlerleme Durum Modeli
## Tarihsiz · Çok Boyutlu · Formül Tabanlı Takip

Bu bir “27’sinde şunu yap” takvimi **değildir**.  
Bu, yolculuktaki **durumunu** (state), **hızını** ve **kapılarını** (gates) ölçen bir sistemdir.

Mentor her oturumda bu modeli günceller. Sen her gün bütün modeli okumak zorunda değilsin; istediğinde:

> “Durumumu göster.”  
> “Hangi kapıdayım?”  
> “Şu beceride neredeyim?”

dersin.

---

## 1. Felsefe

| Eski (istemediğin) | Yeni (bu model) |
|---|---|
| 27 Ağustos: DNS | DNS seviyesi = 🟡, son pratik = T−3 gün |
| Ay 3’te SIEM | SIEM kapısı: Linux≥6 AND Windows≥5 AND Networking≥7 |
| “Plan bitti mi?” | “Hedef state’e ne kadar yakınız?” |
| Takvim günü | **Durum + hız + kalan mesafe** |

Zaman vardır; ama zaman **girdi**dir (kaç saat çalıştın).  
Asıl çıktı **yetkinlik state’idir**.

---

## 2. Boyutlar (Dimensions)

Her an 4 paralel hat + 1 birleşik skor:

```text
D1 TEKNİK          — yetkinlik skorları (0–10)
D2 ÜRETİM          — lab / proje / kanıt
D3 DİL             — EN + DE seviyeleri
D4 KARİYER         — CV / başvuru hazırlığı
────────────────────────────────
R  READINESS       — Almanya junior başvuru hazırlığı (0–100)
```

İstersen 5. boyut:

```text
D5 SÜREKLİLİK      — haftalık aktif saat, streak, unutma riski
```

---

## 3. Yetkinlik skalası (SFIA çıpalı — P1.2)

**İki eksen:** yetkinlik (S) ve kanıt ayrıdır. ⚪🟡🟢🔵 artık **kanıt bandıdır**, beceri bandı değil.

| S | SFIA | Özü | Hedefe göre |
|---:|---|---|---|
| 0–1 | — | Terimleri duymuş | — |
| 2–3 | 1 · Follow | Runbook adım adım | Junior altı |
| **4–5** | **2 · Assist** | Rutin vakayı kendi çözer | Junior tabanı |
| **6–7** | **3 · Apply** | Rutin olmayan işi bağımsız yapar | **Junior hedefi — işe alınabilir** |
| 8 | 4 · Enable | Özerk, prosedür yazar | Hedefin ötesi |
| 9–10 | 5 · Ensure | Alanda otorite | Lead — hedefin çok ötesi |

**Kural:** 🟡 → 🟢 geçişi labsız olmaz.  
**Kural:** 🟢 → 🔵 geçişi kanıtsız olmaz.

Sürüm 2.0'da bu iki kural artık **temenni değil, aritmetik**: kanıt seviyesi skorun tavanını belirler
(§4.0). Kanıtın yoksa 🟢'ye çıkamazsın — panel seni 5.0'da tutar.

| Kanıt seviyesi | Ulaşılabilir en yüksek seviye |
|---|---|
| `yok` (beyan) | 🟡 Anlıyorum (tavan 5.0) |
| `kayıt` (lab / ekran / dosya) | 🟢 Kullanabiliyorum (tavan 8.0) |
| `public` (URL) | 🔵 Kanıtlayabiliyorum (tavan 10.0) |

Panel görüntülenen seviyeyi `S_etkin`'den okur, beyandan değil.

roadmap.sh kutuları bu skalayla işaretlenir; “tick = bitti” değil.

---

## 4. Ana formüller

> **Model sürümü 2.1.** P1: geometrik R (ρ=0), portfolio T'den çıkarıldı, hedef vektörü, CTL/ATL/TSB, FSRS tekrar, Chancenkarte.
> (`ilerleme-durum-dashboard.canvas.tsx`). Bu belge o bloğun **normatif açıklamasıdır**; ikisi
> ayrışırsa panel kazanır ve belge düzeltilir. Sürüm 1.0'dan farklar §12'de.

### 4.0 Kanıt merdiveni — bütün boyutların üstündeki kural

Sürüm 1.0'ın en büyük yapısal hatası şuydu: her skor **serbest beyandı**. Panelde 90 saniye yazarak
R 32 → 73 yapılabiliyordu. Kapatan kural tek cümle:

> **Hiçbir skor, onu destekleyen kanıtın izin verdiğinden yüksek olamaz.**

| Kanıt seviyesi | Ne demek | `oran` | 0–10 skalasında tavan |
|---|---|---:|---:|
| `yok` | Yalnızca beyan | 0.50 | 5.0 |
| `kayıt` | Lab kaydı, ekran görüntüsü, dosya, komut geçmişi | 0.80 | 8.0 |
| `public` | Erişilebilir URL: GitHub, write-up, sertifika | 1.00 | 10.0 |

```text
x_etkin = min(x_beyan, oran(kanıt) × x_max)
```

Bu dört boyutta da aynı uygulanır. Ayrıntı ve oyunlanamazlık kanıtı: `Log-Semasi.md` §4.

**Asimetrik mandal.** Bir skoru veya kanıt seviyesini **yükseltmek** dolu bir kanıt referansı ister;
**düşürmek** her zaman serbesttir. Ölçüm sisteminin değeri, ölçtüğü şeyi taklit etmenin maliyetiyle
orantılıdır.

### 4.1 Alan skoru ve çürüme

```text
S_beyan    = 0..10                                   (öz-değerlendirme + mentor kalibrasyonu)
S_tavanlı  = min(S_beyan, oran(kanıt) × 10)
S_etkin    = S_tavanlı × (0.5 + 0.5 × exp(−Δt / τ)) ,   τ = 10 × 2ⁿ gün
```

- `Δt` = o alanda son `session` veya `retrieval` üzerinden geçen gün (log'dan).
- `n` = o alandaki başarılı tekrar sayısı. Her başarılı tekrar τ'yu **iki katına** çıkarır: bilgi
  pekiştikçe daha yavaş unutulur.
- Taban 0.5: hiçbir şey sıfıra düşmez, tanışıklık kalır — ama yarısı gider.

**Çürüme, "sıfır efor = sıfır ilerleme" kuralının uygulama yeridir.** Hiç log yazmazsan `Δt` büyür,
`S_etkin` düşer, `R` geriler. Bugünkü state'ten hiç çalışmama senaryosu:

| Hafta | +0 | +2 | +4 | +8 | +12 | +26 |
|---|---:|---:|---:|---:|---:|---:|
| R | 26.62 | 21.14 | 19.79 | 19.37 | 19.35 | 19.35 |

İlk iki hafta en sert düşüş (−5.5 R), sonra asimptot 19.35'e oturur — taban 0.5 sayesinde hiçbir şey
sıfırlanmaz ama yarısı gider. Panel bu eğriyi "çalışmazsan" adıyla plan eğrisinin altına çizer;
aradaki fark sistemin ürettiği değerdir.

`snapshot` almak çürümeyi **sıfırlamaz** — yoksa "snapshot al" tuşuna basmak unutmayı silerdi.

### 4.2 Teknik bileşik skor (T)

```text
T = Σ (wᵢ × S_etkin,ᵢ) / Σ wᵢ        # Portfolio (port) T'den çıkarıldı — yalnız P'de · Σw = 10.9
```

**Kanonik alan listesi — 12 alan, Σw(T) = 10.9** (portfolio yalnız P'de). Bu liste kilitlidir;

| `id` | Alan | w | Rol | **S\*** |
|---:|---|---:|---|---:|
| `def` | Defensive/SOC | 1.5 | çekirdek | **7** |
| `win` | Windows/AD | 1.4 | çekirdek | **6** |
| `port` | Portfolio | 1.4 | vitrin (P only) | **7** |
| `linux` | Linux | 1.3 | çekirdek | **6** |
| `net` | Networking | 1.2 | çekirdek | **6** |
| `siem` | SIEM | 1.1 | çekirdek | **7** |
| `secfund` | Security Fundamentals | 1.0 | çekirdek | **6** |
| `netsec` | Network Security | 0.9 | destek | **5** |
| `py` | Python | 0.8 | destek | **4** |
| `off` | Offensive | 0.7 | destek | **3** |
| `crypto` | Crypto | 0.6 | destek | **4** |
| `cloud` | Cloud | 0.4 | destek | **3** |
| | **Σ (T)** | **10.9** | | |

**Hedef vektörü (türetilmiş R):** `T* 5.8 · P* 6.6 · L* 7.5 · C* 9.0` ⇒ `R_hedef ≈ 67.3` (ρ=0) · `R_giriş ≈ 54.8`

Ağırlık değişirse `Ilerleme-Log.jsonl`'a yeni bir `meta` satırı yazılır; eski snapshot'lar hangi
modelle hesaplandıklarını korur.

### 4.3 Üretim skoru (P)

Sürüm 1.0'ın `P` formülü **doğrusal ve sayıma dayalıydı** — satır ekleyerek şişirilebiliyordu. Yeni
formül hem doygun hem kanıt-tavanlı:

```text
q_etkin = min(sahiplik, oran(kanıt))          # sahiplik ∈ {0, 0.5, 1}
P       = maxₜ  min( 10 × (1 − exp(−Σ_(kanıt ≥ t) q_etkin·v / 5)) , oran(t) × 10 )
```

| Artefakt türü | `v` | Tipik saat |
|---|---:|---:|
| SOC lab (Sysmon / SIEM / tespit) | 3.0 | ~60 |
| AD lab | 2.5 | ~40 |
| VM / ağ lab | 2.0 | ~25 |
| Araç / script | 1.5 | ~15 |
| Write-up | 0.5 | ~6 |
| Lab egzersizi (rehberli oda) | 0.5 | ~8 |

Üç koruma birlikte çalışır:

1. **Doygunluk** (`κ = 5`): 10. write-up 1.'si kadar değerli değildir.
2. **Sahiplik**: "AI yazdı, anlatamıyorum" ⇒ `q = 0` ⇒ katkı **0**.
3. **Boyut tavanı**: bir kanıt seviyesinin tavanı yalnızca **o seviye ve üstündeki** artefaktlarla
   açılır. Public artefakt yoksa `P ≤ 8`; hiç kanıt yoksa `P ≤ 5`. Kanıtsız satır çoğaltmak işe
   yaramaz.

### 4.4 Dil skoru (L)

```text
DE = 0.6 × konuşma + 0.4 × genel
EN = 0.6 × konuşma + 0.4 × genel
L  = 0.55 × DE_etkin + 0.45 × EN_etkin
```

CEFR çıpaları (saat-çıpalı, P1.3):

| CEFR | A1 | A2 | B1 | B2 | C1 |
|---|---:|---:|---:|---:|---:|
| Skor | 1.5 | 3 | 5 | 7.5 | 9.5 |

GLH kümülatif (planlama): A1 95 · A2 190 · B1 320 · B2 550 · C1 750

### 4.5 Kariyer skoru (C)

```text
C = Σ min(beyanᵢ, oran(kanıtᵢ) × maxᵢ)        # Σ maxᵢ = 10
```

| Madde | max | Kanıt ne demek |
|---|---:|---|
| CV hazır | 2 | PDF dosya yolu |
| Ağ (LinkedIn + referans) | 2 | Profil URL + gerçek temas |
| Staj belgelenmiş | 2 | Belge / referans |
| Başvuru funnel aktif | 2 | Log'da `basvuru` satırları |
| Mülakat pratiği | 2 | Log'da `session(mod=mulakat)` |

`vize` kaldırıldı → Chancenkarte Gate 0/ F. Hedef `C* = 9` (mülakat 1/2).

Denetimin bulduğu **en ucuz istismar buydu**: puan başına 1.5 R, maliyeti bir metin kutusu. Artık her
madde belge/URL ister.

### 4.6 Readiness (R) — ana gösterge

```text
R = 100 × T̂^0.40 × P̂^0.25 × L̂^0.20 × Ĉ^0.15     (ρ=0 geometrik; X̂ ← max(X̂, 0.02))
R_hedef := R(T*5.8, P*6.6, L*7.5, C*9.0) ≈ 67.3
R_giriş := R(T*5.0, P*5.0, L*6.1, C*7.0) ≈ 54.8
```

Panel üç R'yi yan yana gösterir:

| Gösterge | Ne | Ne işe yarar |
|---|---|---|
| `R_beyan` | Kanıt tavanı ve çürüme yok | Kendine ne kadar puan verdiğin |
| `R_tavanlı` | Kanıt tavanı var, çürüme yok | Kanıtın ne kadarını taşıyor |
| `R` (etkin) | İkisi de var | **Gerçek sayı.** Kapılar bunu kullanır |
| `kanıt_açığı` | `R_beyan − R_tavanlı` | Sadece belge yükleyerek kazanacağın puan |

Hedef bantlar:

| R | Anlam |
|---:|---|
| 0–25 | Temel kurulum |
| 25–45 | Oturtma / lab dönemi |
| 45–65 | Portföy + defensive pratik |
| 65–80 | Başvuru eşiği (R_giriş ≈ 55'ten itibaren) |
| 80+ | Güçlü başvuru profili |

🔴 R iş garantisi değildir. "Başvurulabilirlik intensitesi"dir.

### 4.7 Hız: ölçülen · tahmin · kalibrasyon

Bunlar **iki farklı büyüklüktür** ve panelde yan yana durur. Sürüm 1.0 ikisini karıştırıyordu.

**Tahmin** (CTL tabanlı, P1.4):

```text
load_g = (h_siber×0.80 + h_dil×0.20) × kalite × 10
CTL_g  = CTL_{g−1} + (load_g − CTL_{g−1}) / 42
ATL_g  = ATL_{g−1} + (load_g − ATL_{g−1}) / 7
TSB_g  = CTL_g − ATL_g
v_tahmin = (0.7 × CTL − 3.7) / 9.25
```

- `0.80 / 0.20`: uydurma değil, R'nin kendi ağırlık vektörü (T+P+C = 0.80 · L = 0.20).
- `h₀ = 3.7` **bakım eşiği**: altında `v` negatiftir. Sıfır saatte `v = −0.4` — model hiç
  çalışmadığın hafta ilerleme **göstermez**. (Sürüm 1.0'daki `clamp(v, 0.3, 4.5)` tabanı kaldırıldı;
  o taban "hiçbir şey yapmadan haftada +0.3 R" demek oluyordu.)
- `H = 9.25`: §8 tempo tablosunun uçlarına fit edildi; üç bandın üçü de tutuyor.
- `kalite`: log'da oturum varsa son 14 günün ortalaması, yoksa elle girilen plan değeri. Pasif video
  ≈ 0.3 · aktif recall + lab ≈ 1.0.

**Ölçüm** (geçmişten geriye bakar):

```text
v_ölçülen = (R_şimdi − R_ref) / Δhafta          # ref = ≥4 hafta öncesi en yeni snapshot
κ         = v_ölçülen / v_tahmin
```

`κ` modelin kendini yanlışladığı yerdir: `κ ≈ 1` model çalışıyor · `κ < 0.7` ya saatler abartılı ya
kalite düşük · `κ > 1.3` model fazla muhafazakâr.

**ETA (P1.6):** `ETA = max_k ETA_k` — bileşen bazlı (T, L, P, C). Plan: güç yasası + GLH. Ölçüm: ≥4 snapshot'ta Monte Carlo P50/P85/P95. Dual rota: Rota A (EN işveren) vs Rota B (Chancenkarte + DE B2 @ 7 veya 14 h/hf).

| Durum | Panel ne gösterir |
|---|---|
| < 2 snapshot | "ÖLÇÜLMEDİ" etiketiyle `v_tahmin × (1 ± 0.2)` **plan bandı** |
| ≥ 2 snapshot | `ETA = (R* − R) / v_ölçülen`, tek nokta, `n` ile birlikte |
| ≥ 4 snapshot | `ETA` **%68 aralığı**: `σ_v` ardışık ΔR/Δhafta örneklerinden |
| `v ≤ 0` | "∞ · durgun" — sahte sayı yok |

### 4.8 Unutma / tekrar (FSRS + SM-2, P1.5)

Retrieval olasılığı:

```text
R(t,S) = (1 + factor × t/S)^(−w20)     factor=19/81, w20=0.5
vadesi geldi ⇔ R(t,S) < 0.85
```

Stabilite güncellemesi SM-2 tabanlı; başarılı tekrar sonrası `S` büyür. Eski T+1/T+3/T+7 merdiveni
kaldırıldı — 70 günlük ufuk için tipik aralık ~12 gün civarı (Cepeda düzeltmeli).

**Sonuç kaydı zorunlu.** `basarili` → stabilite artar · `zorlandim` → sabit · `basarisiz` → düşer.

### 4.9 Marjinal getiri (ROI) — "şimdi ne yapayım?"

```text
ROI       = ΔR / saat
ROI_etkin = ROI × (1 + λ × [iş, sıradaki kapının darboğazı mı])        λ = 1.5
```

`ΔR` analitik türev değil: her aday iş için model **baştan hesaplanır**. Böylece kanıt tavanı ve P'nin
doygunluğu otomatik hesaba katılır — "bu artefaktı eklesem ne olur"un cevabı gerçek cevaptır.

`λ` kapı darboğazlarını öne çeker: kapı konjonktiftir (AND), en zayıf halka çözülmeden diğerlerinin
marjinal değeri düşüktür.

### 4.10 Chancenkarte puan motoru (P1.1)

§20b AufenthG — panel canlı hesaplar:

| Kriter | Puan | Not |
|---|---:|---|
| Yaş ≤35 | 2 | Kullanıcı kararı |
| Kısmi tanınma (Anerkennung) | 4 | Durum bilinmiyorsa "araştırılıyor" |
| Almanca B2 | 3 | DE skor ≥7.5 |
| İngilizce C1 | 2 | EN skor ≥9.5 |
| Mesleki deneyim 2+ yıl | 1 | Beyan |
| Almanya'da 6+ ay kalış | 1 | Beyan |

**Gate 0:** net ≥6 puan + giriş koşulları (denklik sonucu bilinmeli).  
**Gate F:** runway ≥12 ay (birikim ÷ aylık tasarruf; bilinmiyorsa panel "bilinmiyor" gösterir).

**Dual rota:** Rota A (EN odaklı işveren) ve Rota B (Chancenkarte + DE B2) **paralel** — ayrı ETA;
hangisi önce tamamlanırsa o rota kazanır.

### 4.11 Geri dönüş modu ve güvenlik marjı (P1.7)

```text
GM_gün = min_k ( (S_k − eşik_k) / günlük_çürüme_k )     Gate A becerileri için
```

**Geri dönüş modu:** 14+ gün session yok veya TSB > eşik → ETA gizlenir, tekrar kuyruğu öncelikli.
Hedef gevşetme (akrasia) **7 gün gecikmeli** uygulanır.

---

## 5. Kapılar (Gates) — “ne zaman ne?”

Kapı = tarih değil, **koşul**. Bütün eşikler `S_etkin` (kanıt tavanlı + çürümeli) ile karşılaştırılır —
beyanla değil.

Kapı ikili ama gösterge sürekli:

```text
π_G = ort( min(1, xᵢ / eşikᵢ) )      # açık = bütün koşullar sağlandı
darboğaz = argminᵢ (xᵢ / eşikᵢ)      # en zayıf halka
```

"KAPALI" bilgi taşımaz; "%66 ve en zayıf halka Windows/AD 3/5" taşır.

### Gate 0 — Hukuki ön koşul (P1.1)
```text
Denklik sonucu biliniyor (tam/kısmi/yok) ∧ oturum rotası tanımlı
```
Anerkennung durumu bilinmiyorsa panel uyarı gösterir; ETA koşulludur.

### Gate A — Temel oturma
```text
net ≥ 6  ∧  linux ≥ 6  ∧  win ≥ 5
```
Açılan: ciddi defensive lab yoğunluğu.

> Bu eşiklerin üçü de **kanıtsız tavanın (5.0) üstünde ya da tam üstünde**. Yani Gate A yazarak
> açılamaz: en az `kayıt` seviyesinde kanıt gerekir. Bu tasarım gereğidir.

### Gate B — Defensive pratik
```text
Gate A  ∧  secfund ≥ 6  ∧  siem ≥ 5
```
Açılan: Mini SOC lab (Sysmon / SIEM).

### Gate C — Kanıt (artefakt)
```text
≥2 artefakt: seviye=public ∧ sahiplik=1.0, bunlardan ≥1 deger≥2.5 (SOC veya AD lab)
```

### Gate D — Başvuru eşiği
```text
R ≥ R_giriş (≈55)  ∧  Gate C  ∧  Gate 0  ∧  DE ≥ 5  ∧  EN ≥ 7
```

### Gate F — Finans (Rota B)
```text
Runway_ay ≥ 12
```

### Gate E — Yoğun mülakat
```text
Gate D  ∧  (son 14 günde mülakat kaydı ≥ 2)
```

Bu bir **oran koşuludur**, statik bir öz-beyan değil. Sürüm 1.0 metni "≥1 tur/hafta (son 2 hafta)"
diyordu ama kod bunu 0–2 arası elle girilen bir sayıya çevirmişti — pencere de oran da kaybolmuştu.
Artık doğrudan log'dan sayılır: son 14 gündeki `session(mod = mulakat)` + mülakat aşamalı `funnel`
kayıtları. Log yoksa 0'dır ve kapı kapalıdır; bu bir ceza değil, ölçümün yokluğudur.

**Kapı geri kapanabilir.** Çürüme `S_etkin`'i eşiğin altına düşürürse kapı kapanır ve log'a
`{"type":"gate","durum":"kapandi"}` satırı yazılır. Bu bir hata değil, ölçümdür.

Önceki kapı kapanmadan sonrakine “takvim yüzünden” atlama yok.  
İstisna: mentor + sen birlikte kapıyı bilinçli gevşetirsiniz.

---

## 6. Günlük oturumun modele bağlanması

Model, log'a yazılmayan hiçbir şeyi göremez. Ritüel üç katmanlı:

| Ritim | Süre | Ne yazılır | Neyi besler |
|---|---:|---|---|
| **Günlük** | ~60 sn | 1× `session` (+ tekrar yaptıysan `retrieval`) | Çürüme çıpası, gerçek saat, kalite, streak |
| **Haftalık** | ~10 dk | 1× `snapshot` | `v_ölçülen`, `κ`, trend grafikleri, ETA |
| **Aylık** | ~30 dk | 2–3× `assessment` (kör test) + ağırlık gözden geçirme | Öz-değerlendirme sapması `b̂` |

Haftalık snapshot sistemin **meta-döngüsüdür**: modelin kendi hatasını ölçtüğü tek an. Atlanırsa
model zamanla yeniden sapar — denetimin bulduğu durum tam olarak buydu.

Her mentor oturumu sonunda (kısa):

```text
Bugün:
  Alan: ...
  Önce: S=x → Sonra: S=y      (yükseliyorsa kanıt referansı zorunlu)
  Kanıt: yok / kayıt / public + URL
  Saat: ...   Kalite: 0.3–1.0
  Sonraki retrieval: T+n      (formülden, elle değil)
  ΔR: ...     Gate ilerlemesi: A/B/C ... %
```

Senin gördüğün sonuç cümlesi:

> “DNS çalıştım” ❌  
> “DNS query/response’u Wireshark’ta ayırt edebiliyorum (🟡→🟢 adayı)” ✅  
> “…ve pcap dosyası `labs/wireshark-dns-01.pcapng`” ✅✅ — bu üçüncüsü tavanı açan şeydir.

---

## 7. Kanonik anlık görüntü (2026-08-27 · diagnostic seed)

> Bu sayılar `Ilerleme-Log.jsonl`'ın 2. satırıyla **birebir aynıdır** ve panelin açılış state'ini
> üretir. Üç belgenin farklı R söylediği durum (36 / 32.4 / 32.2) burada bitiyor.

| # | Alan | S beyan | Kanıt | **S_etkin** | w |
|---:|---|---:|---|---:|---:|
| 1 | Networking | 6 | yok | **5** | 1.2 |
| 2 | Linux | 4 | yok | **4** | 1.3 |
| 3 | Windows/AD | 3 | yok | **3** | 1.4 |
| 4 | Security Fundamentals | 7 | yok | **5** | 1.0 |
| 5 | Crypto | 7 | yok | **5** | 0.6 |
| 6 | Network Security | 7 | yok | **5** | 0.9 |
| 7 | SIEM kavram | 3 | yok | **3** | 1.1 |
| 8 | Defensive/SOC | 3 | yok | **3** | 1.5 |
| 9 | Offensive | 2 | yok | **2** | 0.7 |
| 10 | Python | 5 | yok | **5** | 0.8 |
| 11 | Cloud | 2 | yok | **2** | 0.4 |
| 12 | Portfolio | 2 | yok | **2** | 1.4 |

Çürüme çarpanı seed anında 1.0'dır (`Δt = 0`), yani `S_etkin = S_tavanlı`.

```text
T = Σ(wᵢ·S_etkin,ᵢ) / Σwᵢ = 44.7 / 12.3 = 3.63          (beyanla: 50.9 / 12.3 = 4.14)

P: 2 artefakt — 1 write-up + 1 rehberli lab egzersizi, ikisi de bağlantısız
   Σ q_etkin·v = 0.5×0.5 + 0.5×0.5 = 0.50
   P = min( 10×(1 − e^(−0.50/5)) , 5.0 ) = 0.95          (beyanla: 1.81)

L: DE 2 (A1), EN 6 (B1) — ikisi de belgesiz ⇒ EN 5'e tavanlanır
   L = 0.55×2 + 0.45×5 = 3.35                            (beyanla: 3.80)

C: CV 1/2 + staj 1/2, ikisi de belgesiz ⇒ tavan 0.5×max = 1.0 (bağlamıyor)
   C = 2.00                                              (beyanla: 2.00)

R = 100 × (0.40×0.363 + 0.25×0.095 + 0.20×0.335 + 0.15×0.200)
  = 100 × (0.1454 + 0.0238 + 0.0670 + 0.0300)
  = 26.62
```

| | Beyan | Kanıt tavanlı | Etkin (kanonik) |
|---|---:|---:|---:|
| T | 4.14 | 3.63 | **3.63** |
| P | 1.81 | 0.95 | **0.95** |
| L | 3.80 | 3.35 | **3.35** |
| C | 2.00 | 2.00 | **2.00** |
| **R** | 31.68 | 26.62 | **26.62** |

**Kanıt açığı = 31.68 − 26.62 = 5.07 R.** Bu, *yeni hiçbir şey öğrenmeden*, sadece zaten bildiğin
şeyleri belgeleyerek kazanacağın puandır. Sistemdeki en ucuz R budur ve panelin ROI tablosu bunu
tepeye koyar.

**Kapı durumu (hepsi kapalı):**

| Kapı | π | En zayıf halka |
|---|---:|---|
| A — Temel oturma | %66 | Windows/AD 3/5 |
| B — Defensive pratik | %70 | SIEM 3/5 |
| C — Kanıt | %0 | Public + sahipli proje 0/2 |
| D — Başvuru eşiği | %41 | Gate C |
| E — Yoğun mülakat | %21 | Son 14 günde mülakat 0/2 |

**Darboğaz boyut:** `argminₖ(X̂ₖ / 7)` → **P (Üretim)**, oran 0.14. Teknik bilgi kâğıt üstünde
fena değil; ortada gösterilebilir hiçbir şey yok.

**Hız:** `v_tahmin = 1.84 ΔR/hafta` (28 siber + 10 dil sa/hf, kalite 0.85).
`v_ölçülen = ölçülmedi` — log'da 1 snapshot var, 2 gerekir. Bu yüzden ETA şu an bir **plan bandıdır**,
ölçüm değildir.

**Sürüm 1.0'daki 36 nereden geliyordu?** T'yi 4.8 varsayıp (formül 4.01 veriyordu), P'yi 2 varsayıp
(formül 0.95 veriyor), kanıt tavanını hiç uygulamadan. Yani üç ayrı iyimserlik üst üste binmişti.
Gerçek sayı **26.62**.

**Yorum:** Hâlâ **temel kurulum / oturtma sınırındasın** (25–45 bandının alt ucu). Sıralama:
(1) bildiklerini belgele — en ucuz 5 R, (2) Windows/AD ve SIEM'i kaldır — Gate A ve B'nin darboğazı,
(3) ilk public SOC lab'i kur — Gate C sıfırda ve P bütün modelin darboğazı.

---

## 8. “Ne zaman nerede olmalıyım?” — tempo senaryoları

Tarih yok; **R ve Gate** var. Model `v_tahmin`'i bu tabloya fit edilmiştir; sağdaki iki sütun kodun
gerçekten ürettiği değerdir (sürüm 1.0'da kod tablodan ~%40 sapıyordu).

| Tempo | Siber sa/hf | Dil sa/hf | Kalite | Hedeflenen v | **Model v** | Uyum |
|---|---:|---:|---:|---|---:|---|
| Minimum | 20.6 | 7.4 | 0.85 | 1.0–1.5 | **1.25** | ✅ |
| Normal | 28.0 | 10.0 | 0.85 | 1.8–2.5 | **1.84** | ✅ |
| Agresif | 36.1 | 12.9 | 1.00 | 2.5–3.5 | **3.00** | ✅ |
| *Hiç çalışmama* | 0 | 0 | — | *ilerleme yok* | **−0.40** | ✅ |

R = 26.62'den R = 70'e, `v_tahmin` ile kaba plan bandı:

| Tempo | (70 − 26.62) / v | ±%20 plan bandı |
|---|---:|---|
| Minimum | ~35 hafta | 29–43 hafta |
| Normal | ~24 hafta | 20–29 hafta |
| Agresif | ~14 hafta | 12–18 hafta |

> Bu bir **ETA değildir**, plan bandıdır. `v_ölçülen` iki snapshot sonra devreye girer ve `κ` ile
> bu sayılar gerçek ölçüme döner. İlk 4 hafta kalibrasyon dönemidir.

---

## 9. roadmap.sh + 8 Network notu bu modele nasıl oturur?

```text
roadmap kutusu  →  S skoru + ⚪🟡🟢🔵
not dosyası     →  kaynak (müfredat değil)
THM/HTB/pwn/Wireshark → 🟡→🟢 motoru
GitHub/write-up → 🟢→🔵 motoru
iş ilanı        →  ağırlık w_i güncellemesi
```

8 networking notunun tamamı “sırayla bitir” değil;  
her not parçası, ilgili S skoru ve lab ihtiyacına göre **çekilir**.

---

## 10. Senin izleme komutların

Mentora:

- `Durumumu göster` → tablo + R + açık kapı  
- `Hangi kapıdayım?` → A/B/C… ve eksik koşullar  
- `Bugün tek görev` → panelin en üstündeki tek aksiyon + gerekçesi  
- `Bu görev R’yi nasıl etkiler?` → ΔR ve ΔR/saat  
- `Unutma kuyruğu` → vadesi gelmiş tekrar listesi  
- `ETA` → ölçülmüşse aralık, ölçülmemişse “ölçülmedi” + plan bandı  
- `Snapshot al` → haftalık ölçüm noktası; `v_ölçülen` ve `κ` burada güncellenir  

---

## 11. Mentor kuralı (bu modele bağlı)

1. Görev = tarih emri değil; **state’i hareket ettiren iş**.  
2. Her görevin beceri çıktısı + (mümkünse) gerçek dünya karşılığı var.  
3. Diagnostic yeterliyse alana saplanma.  
4. Gate atlama yok (bilinçli istisna hariç).  
5. R ve S sayıları dürüst güncellenir; moral için şişirilmez.  
6. **Kanıtsız skor yükseltilmez.** Kanıt referansı yoksa sayı değişmez.  
7. **Ölçülmemiş sayı ölçülmüş gibi sunulmaz.** `v_ölçülen` yoksa "ölçülmedi" denir.

---

## 12. Tek doğruluk kaynağı — sapma nasıl önlenir

Denetimin en sinsi bulgusu (K18) şuydu: aynı sistemin dört yerinde dört farklı sayı vardı.
Bu belge T≈4.8 / R≈36 diyordu, kendi formülü T=4.01 / R=32.4 veriyordu, panel 32.2 hesaplıyordu,
kullanım kılavuzu 36 yazıyordu; alan listesi bir yerde 10, bir yerde 11, bir yerde 12 alandı.
Böyle bir sistemde hiçbir sayı bir şey ifade etmez.

**Kural: her sayının tam bir üretim yeri vardır.**

| Katman | Dosya | Rolü | Elle sayı yazılır mı? |
|---|---|---|---|
| **Sabitler** | `ilerleme-durum-dashboard.canvas.tsx` → `MODEL` bloğu | Ağırlık, oran, eşik, τ, H, h₀, λ | Yalnızca burada |
| **Ölçüm** | `Ilerleme-Log.jsonl` | Zaman serisi: ne oldu, ne zaman | Append-only; düzeltme = yeni satır |
| **Hesap** | Panelin saf fonksiyonları | T, P, L, C, R, π, v, ROI | Hayır — hepsi türetilir |
| **Şema** | `Log-Semasi.md` | Log alanlarının normatif tanımı | Hayır |
| **Anlatı** | Bu belge | Neden bu formül, neden bu ağırlık | Yalnızca §7'deki snapshot |

Uygulanan dört mekanizma:

1. **Panelde tek `MODEL` sabiti.** Ekrandaki her formül metni ve her eşik bu bloktan **string
   interpolasyonuyla** üretilir. Elle yazılmış ikinci bir formül metni yok, dolayısıyla sabit
   değiştiğinde açıklama metni de otomatik değişir — sessizce yalan söyleyemez.
2. **§7 snapshot'ı = log'un 2. satırı.** İkisi birebir aynı sayıları taşır. Log append-only olduğu
   için bu satır bir daha değişmez; ileride sapma olursa yeni snapshot yazılır, eskisi durur.
3. **Kanonik alan listesi kilitli** (§4.2, 12 alan, Σw = 12.3). Değişiklik log'a yeni bir `meta`
   satırı yazmayı gerektirir; eski snapshot'lar hangi modelle hesaplandıklarını korur.
4. **Panel kendi tutarlılığını gösterir.** §8 tempo tablosu ekranda kodun gerçek çıktısıyla yan yana
   çizilir; kod belgeden saparsa satır kırmızıya döner. Aynı şekilde "yazarak ulaşılabilir tavan"
   canlı hesaplanır — anti-gaming kuralı bozulursa görünür olur.

**Sürüm 1.0 → 2.0 farkları**

| Ne | 1.0 | 2.0 |
|---|---|---|
| Alan sayısı | 10 / 11 / 12 (belgeye göre) | **12, kilitli**, Σw = 12.3 |
| Kanıt | Yok — serbest beyan | **Kanıt merdiveni** 0.5 / 0.8 / 1.0 |
| Çürüme | Yok (yalnızca "unutma riski" etiketi) | **`S·(0.5 + 0.5·e^(−Δt/τ))`**, τ = 10·2ⁿ |
| P | Doğrusal sayım, `min(10, …)` | **Doygun + iki katmanlı kanıt tavanı** |
| v | `clamp(v, 0.3, 4.5)`, izsiz sabitler | **`(h_eff − 3.7)/9.25`**, alt sınır −0.5 |
| v_ölçülen | Yok | **Log'dan `ΔR/Δhafta`**, `κ` ile kalibrasyon |
| ETA | Her zaman bir sayı | **Ölçülmediyse "ölçülmedi" + plan bandı** |
| Gate E | Statik öz-beyan | **Son 14 günün log sayımı** |
| Gate C | Serbest beyanla açılabiliyor | **Public artefakt zorunlu** |
| Geçmiş | Yok | **`Ilerleme-Log.jsonl`**, append-only |
| Sıradaki iş | Yok | **"BUGÜN, TEK GÖREV" + marjinal ROI** |

---

*Model sürümü 2.0 · `Sistem-Denetimi.md` (K01–K19) P0 uygulaması sonrası.
Kanonik anlık görüntü: `Ilerleme-Log.jsonl` satır 2 (2026-08-27, R = 26.62).
Bir sonraki gerçek ölçüm noktası: ilk haftalık `snapshot`.*
