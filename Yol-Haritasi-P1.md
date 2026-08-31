# Yol Haritası P1 — Denetim × Prior Art Sentezi

**Girdi 1:** `Sistem-Denetimi.md` (iç denetim, 19 bulgu K01–K19)
**Girdi 2:** `Prior-Art-Arastirmasi.md` (dış literatür, 10 bölüm, 83 kaynak)
**Bağlam:** P0 katmanı (append-only log, trend, `v_ölçülen` vs `v_tahmin` + κ, kanıt tavanı, çürüme, tek doğruluk kaynağı, BUGÜN TEK GÖREV, pencereli Gate E) **paralel olarak uygulanıyor.** Bu belge P0'ı yeniden yazmaz; üstüne kurulur.
**Bu belge ne değil:** uygulama. Karar belgesi. Her kalem doğrudan uygulanabilir olacak kadar somut yazıldı.

> **Okuma sırası:** §1 → §3 (hedef rekalibrasyonu — en önemli bölüm) → §4 (P1 kalemleri) → §8 (sana sorulacaklar). §2 referans tablosudur.

---

## 1. Yönetici özeti — 8 madde

1. **Hedef *sayısı* zaten doğruydu; hedef *profili* yanlıştı.** SFIA/NICE eşlemesiyle yeniden hesaplayınca `R* = 67.3–68.2` — eski 70 ile arasındaki fark gürültü. Ama boyut hedefleri **tekdüze 7 değil**: `T* 5.8 · P* 6.6 · L* 7.5 · C* 9.0`. Teknik hedef düşüyor, dil ve kariyer hedefi yükseliyor — **iki hata birbirini götürüyordu.** Ayrıca `R_hedef` bundan sonra elle konan bir sabit değil, **vektörden türetilir**; böylece bir daha "hedef sayısı ne olsun" tartışması olmaz.

2. **0–10 skalasında 9–10 hedef değil. Junior SOC = SFIA 2–3 = S 4–6.** SFIA 4 (S≈8) zaten *senior analyst* bölgesi. Model, 🔵 (9–10) bandını "varış" gibi sunarak ulaşılamaz bir hedef üretiyordu. Teknik mesafe **63 haftadan 16 haftaya** düşüyor (aynı tempoda, aynı formülle).

3. **Ama toplam ETA kısalmıyor — uzuyor, çünkü gerçek darboğaz Almanca ve model bunu gizliyordu.** Teknik bacak 16 hafta; Almanca A1→B1 mevcut dil bütçesinde **46 hafta**, A1→B2 **79 hafta**. Kapılar konjonktif olduğu için ETA = `max`, ortalama değil. Panelin gösterdiği ~24 hafta, giriş eşiği için bile **2–3 kat iyimser**.

4. **Siber saatini artırmak toplam ETA'yı değiştirmiyor. Sadece Almanca saati değiştiriyor.** 28 h/hf siberden 18'e düşsen ETA aynı kalıyor (46 hafta); Almancayı 7 h/hf'den 14'e çıkarsan ETA **46 → 23 haftaya** iniyor. Bu, modelin bugüne kadar ürettiği en aksiyona dönük tek sayı.

5. **Sistemin en yüksek ROI'li tek eylemi öğrenme değil, evrak: kısmi denklik (Anerkennung) başvurusu.** § 20b AufenthG'de **tek başına 4 puan** — asgari 6'nın üçte ikisi. Yaş puanıyla (≤35 → 2) birlikte eşik **tam olarak karşılanıyor**. ~15 saatlik evrak işi, ama **3–4 ay bekleme süresi** var, yani kritik yolda ve *şimdi* başlamalı. Ayrıca denetimin çözülmemiş en büyük sorusunu (ZAB mı Anerkennung mu — K07) kapatan tek işlem bu.

6. **Gate D'nin `R ≥ 65` eşiği `R ≥ 55`'e iniyor.** Rekalibre edilmiş profille "başvurmaya değer aday" `R ≈ 55`'te oluşuyor (lineer 55.3, geometrik 54.8). **10 R puanı erken** başvurmaya başlıyorsun — ve huni, `R`'yi dışarıdan doğrulayan tek kanal olduğu için bu aynı zamanda ölçümün kendi kalitesini artırıyor.

7. **Gate C'nin "2× 🔵 (9–10) proje" şartı iptal.** Denetim "kod spec'ten gevşemiş" dedi; prior art "spec'in kendisi yanlış" diyor. **Prior art kazanıyor.** Beceri seviyesi ile kanıt seviyesi iki ayrı eksen; birbirine karıştırmak ulaşılamaz hedefi üreten şeyin ta kendisi. Gate C artefakt kanıtına bağlanıyor (`seviye=public ∧ sahiplik=1.0`), beceri skoruna değil.

8. **P1 bilerek 10 kalemle sınırlandı ve günlük sürtünmeyi net olarak *azaltıyor*.** Prior art'ın §7'si açık: bu sistemi öldürecek şey ölçüm eksikliği değil, ölçüm yükü. Tekrar aralıklarının Cepeda ölçeğine çekilmesi tekrar yükünü ~4.5 kat düşürüyor; P1'in eklediği hiçbir kalem **günlük** girdi istemiyor. Günlük etkileşim bütçesi: **≤ 90 saniye, sert kural.**

---

## 2. Denetim × Prior Art kesişim tablosu

Durum kodları: **P0** = P0 katmanında kapandı, yeniden spec edilmeyecek · **P1** = bu belgede · **P2** = ertelendi · **✕** = bilinçli olarak yapılmayacak

### 2.1 Denetim bulguları (K01–K19)

| # | Denetim ne diyor | Prior art ne diyor | Hüküm | Durum |
|---|---|---|---|---|
| K01 | Zaman serisi yok; `v` ve ETA yanlışlanamaz | Monte Carlo throughput ve CTL/ATL zaten geçmiş gerektiriyor — log her ikisinin ön koşulu | **Tam mutabakat.** Log P1.4 ve P1.6'nın da altyapısı | **P0'da kapandı** |
| K02 | `v_tahmin` ≠ `v_ölçülen`, κ göster | Hız **tek sayı olmamalı**: iki zaman ölçeği (CTL 42 gün / ATL 7 gün) | Çelişmiyor, dik. κ model hatasını, CTL/ATL yük ölçeğini ölçer. `v_tahmin`'in girdisi CTL olur → κ daha az gürültülü | **P0 + P1.4** |
| K03 | Kanıt tavanı `S_etkin = min(S, tavan(kanıt))` | Çapasız öz-değerlendirme ↔ objektif performans **r ≈ .29** (Zell & Krizan, 22 meta-analiz) | **En güçlü mutabakat.** Denetimin formülü + prior art'ın gerekçesi. Sonraki adım: Elo (P1.9) | **P0'da kapandı** |
| K04 | Çürüme yok; sıfır çalışmada ETA sonlu | FSRS-6 `R(t,S) = (1+factor·t/S)^(−w20)` — unutmanın yayınlanmış motoru | Beceri çürümesi için P0'ın üsteli yeterli; **tekrar kuyruğu** için FSRS formu kullanılacak | **P0 + P1.5** |
| K05 | `R` tam telafi edici; CES `ρ=0` (geometrik) öner | Liebig / Goldratt ToC — *gerekçe* var, **formül yok** | **Denetim kazanır.** Prior art yalnız gerekçe sağlıyor. Darboğaz göstergesi P0'da zaten var | **P1.8** |
| K06 | Portfolio `T` ve `P`'de çift sayılıyor (%30 gerçek ağırlık) | — | Denetime özgü, itiraz yok | **P1.8** |
| K07 | Vize/hukuk ve finans modellenmemiş; Gate 0 + Gate F | § 20b AufenthG + Anlage = **yasal, hesaplanabilir puan tablosu** | **Prior art kazanır ve büyütür.** Kapı artık boolean değil, canlı puan fonksiyonu | **P1.1** |
| K08 | `S` için gözlemlenebilir rubrik yok; BARS yaz + kör test `b̂` | SFIA 9 sorumluluk seviyeleri + NICE `PD-WRL-001` task ID'leri + hazır 4 rubrik tablosu | **Prior art kazanır** (tablolar zaten yazılmış, dış çıpalı). `b̂` tamamlayıcı olarak kalır | **P1.9** |
| K09 | Başvuru hunisi `p₁…p₅` birinci sınıf nesne olsun | leading/lagging ayrımı; "işe girmek key result olamaz" (kontrol dışı) | **Denetim kazanır** ama zamanlaması yanlış: huni ancak Gate D sonrası veri üretir | **P2** (log kayıtları P0'da hazır) |
| K10 | Gate C gevşetilmiş, Gate E boşaltılmış, `DE≥5` düşük | Gate C'nin **spec'i** yanlış (9–10 = SFIA 5 = lead). CEFR skalası yanlış çıpalı: saat-temelli çıpada B1 = 5 | **Prior art kazanır (bkz. §3.4).** Gate C kanıta bağlanır; `DE≥5` **kalır** çünkü yeni skalada 5 = B1; `EN≥7` eklenir | Gate E **P0'da**, kalanı **P1.2** |
| K11 | Kapılar boolean; `π_G ∈ [0,1]` göster | Rumination: tutarsızlık gösterip çözüm vermemek kaçınma üretir | Mutabakat. P0 `π` değerlerini zaten yazıyor (A 0.66, B 0.70, C 0.00, D 0.41, E 0.21) | **P0'da kapandı** |
| K12 | Nokta ETA; `CI₆₈ = ETA(1±σ_v/v̄)`, `ETA = max_k ETA_k` | Monte Carlo bootstrap P50/P85/P95 (Magennis/Vacanti); ortalama hızla bölmek = yazı-tura. Güç yasası `Effort(S)=A·S^p` | **Bölünmüş hüküm:** dağılım için prior art (Monte Carlo), birleştirme için **denetim** (`max`, çünkü kapılar konjonktif) | **P1.6** |
| K13 | CEFR eşit aralıklı değil; alt beceriler yok | Cambridge kümülatif GLH + Goethe Abendkurs tabloları = **alıntılanabilir saat verisi** | **Prior art veriyi sağlar, denetimin skalası korunur** (A1 1.5 · A2 3 · B1 5 · B2 7.5 · C1 9.5 — Cambridge GLH oranlarıyla ±0.5 uyuşuyor) | **P1.3** |
| K14 | Retrieval'da saat yok, sonuç kaydedilemiyor | **Ölçek de yanlış:** Cepeda 2008 — RI≈70 gün için optimal gap ~12 gün, ~1 gün değil. Karpicke: ilk tekrarı geciktir | **Mekanizma denetimin (P0'da uygulandı), ölçek prior art'ın.** Sabitler değişecek | Mekanizma **P0**, sabitler **P1.5** |
| K15 | `D5` ölü metrik; log'dan hesapla, hız çarpanı yap | `TSB = CTL − ATL` — "sürdürülebiliyor muyum" sorusunun 20 yıllık ticari cevabı | **Prior art kazanır. `D5` tamamen siliniyor, yerine TSB.** El yapımı `uyum/tutarlılık` formülü çöpe | **P1.4** |
| K16 | İnsan tarafı yok; BUGÜN TEK İŞ, panel hiyerarşisi | Rumination (PUC 2021), SDT crowding-out (d = −0.48 vs +0.33), terk etme (CHI 2016) | Denetim UI'ı, prior art kuralları verir. İkisi de kalır | Panel **P0**, kurallar **§7** |
| K17 | Marjinal ROI paneli; model Almancayı cezalandırıyor | Chancenkarte **dışsal** marjinal getiri verir; Anerkennung +4 puan / evrak işi | **Rekalibrasyon çelişkiyi kendiliğinden çözüyor:** teknik hedef düşünce Almanca zaten darboğaz oluyor. ROI paneli `ΔR/saat` **ve** `Δpuan/saat` gösterir | **P1.1 + P1.3** |
| K18 | Tek doğruluk kaynağı yok; formüller 5 yerde | — | Denetime özgü | **P0'da kapandı** (`meta` satırı + `MODEL` sabiti) |
| K19 | Kod kusurları (ölü dal, `\n` render, radar kapsamı…) | — | Kozmetik | **P2** |

### 2.2 Prior art'ın getirdiği, denetimde hiç olmayanlar

| Konu | Kaynak | Hüküm | Durum |
|---|---|---|---|
| WIP limiti (aynı anda 2–3 aktif konu) | Little's Law | Bir satırlık kural, gerçek etki | **P1.10** |
| `koşul → eylem` (if-then) kapı formatı | Gollwitzer & Sheeran, d = 0.65; raydan çıkmayı önlemede **d = 0.77** | Saf yazı işi, en ucuz davranış kazancı. Prior art §9'un etki-büyüklüğü uyarısı P1.10b'de korunuyor | **P1.10** |
| Days-to-derail / güvenlik marjı | Beeminder izohatları | ETA'nın yerine **günlük manşet sayı**. Tarihsiz uyarlaması P1.7'de türetildi | **P1.7** |
| Akrasia horizon (hedef değişikliği 7 gün gecikmeli) | Beeminder | "Zorlaştı, hedefi düşüreyim" kaçışını kapatır. Sadece *gevşetme* gecikir | **P1.7** |
| Elo `θ+K(S−E(S))` + **%75 hedef başarı** kuralı | Klinkenberg et al. 2011 (3.648 çocuk / 3.5M problem) | %75 kuralı **bedava** (P1), Elo'nun kendisi görev havuzu istiyor (mini sürüm P1, tam sürüm P2) | **P1.9 / P2** |
| Anti-metrik eşlemesi | Goodhart / Campbell / Muller + OKR pratiği | Her ana metriğin yanına gamelemeyi anlamsızlaştıran bir kalite metriği | **P1.10** |
| Çıkış koşulu ("happy abandonment") | Epstein et al. CHI 2016, neden #5 | Yazılı bitiş, suçluluğu önler | **§7 kural 9** |
| Reference class forecasting | Flyvbjerg | **Kullanılamaz:** "sıfırdan junior SOC'a" için savunulabilir bir referans dağılımı yok; uydurmak iç ölçümden kötü | **✕** |
| BKT / PFA / DKT | Corbett & Anderson | Prior art'ın kendisi "tek kişilik sistemde aşırı mühendislik" diyor. Elo aynı ihtiyacı 2 parametreyle karşılıyor | **✕** |
| HLR öznitelik vektörü `Θ` | Settles & Meeder 2016 | Milyonlarca tekrar gerekir | **✕** |
| Habitica `0.9747^value` azalan getiri | Habitica wiki | `Effort(S) = A·S²` ile fazlalık | **✕** |
| stickK / Beeminder **parasal** taahhüt | stickK %29→%80 (şirket içi analiz) | SDT: tamamlamaya bağlı somut ödül/ceza **d = −0.48**. Belgelenmiş başarısızlık modun demotivasyon; ceza eklemek kontrendike | **✕** |

---

## 3. Hedef rekalibrasyonu

Bu bölüm belgenin ağırlık merkezi. Sonuç tek cümleyle: **hedef sayısı doğruydu, hedef profili yanlıştı, ve gerçek darboğaz hiç görünmüyordu.**

### 3.1 Sorun: model 🔵'yi varış sanıyor

Mevcut model üç yerde "9–10" diyor:
- `Ilerleme-Durum-Modeli.md` §3 skala tablosu: 🔵 = 9–10 = "Kanıtlayabiliyorum" — merdivenin tepesi
- `Ilerleme-Durum-Modeli.md` §5 Gate C: "En az **2× 🔵 proje (9–10)**"
- P0 `meta`: `hedef.boyut = 7` — sayısal hedef 7, ama anlatı 9–10. **Anlatı kazanıyor**, çünkü her gün bakılan şey skala tablosu.

Prior art'ın bulgusu (§5.1–5.3): NIST, NICE Framework'ün yeterlik ölçeği için **SFIA'yı resmen model aldı**, ve ortak NICE↔SFIA "levelled roles" eşlemesi şunu diyor:

> **Defensive Cybersecurity** — Cyber Defense Analyst **SFIA 2** · Cyber Defense Analyst **SFIA 3** · Senior Cyber Defense Analyst **SFIA 4** · Lead **SFIA 5**

Yani junior/L1 SOC = **SFIA 2–3**. Senin ölçeğinde **S 4–6**. S=8 zaten senior. S=9–10 lead/uzman.

> *Kaynak:* [NIST — Identifying Proficiency in the NICE Framework](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/identifying-proficiency-nice-framework) · [SFIA/NICE levelled roles, Protection & Defense (PDF)](https://sfia-online.org/en/news/nice-combine-7-work-role-categories-1.pdf) · [SFIA 9 — Levels of responsibility](https://sfia-online.org/en/sfia-9/responsibilities)
> *Uyarı (prior art §9'dan korunuyor):* NICE'ın yeterlik ölçeği hâlâ **zorunlu, yayımlanmış bir ölçek değil**; 2022 raporu tavsiye niteliğinde. Eşleme sağlam ama "resmî standart" diye sunulmamalı.

### 3.2 Yeniden ifade edilmiş 0–10 skalası

**İki ekseni ayır.** Modelin bütün kalibrasyon hatası, "ne kadar iyiyim" ile "bunu kanıtlayabiliyor muyum"u tek bir merdivene sıkıştırmaktan çıktı.

**Eksen 1 — Yetkinlik (0–10, SFIA çıpalı):**

| S | SFIA | Özü | Gözetim | Hedefe göre |
|---:|---|---|---|---|
| 0–1 | — | Terimleri duymuş | — | — |
| 2–3 | **1 · Follow** | Runbook'u adım adım izler, kendi kararını vermez | Yakın | Junior'ın altı |
| **4–5** | **2 · Assist** | Rutin vakayı kendi takdiriyle çözer, alışılmadıkta yükseltir | Rutin | **Junior tabanı** |
| **6–7** | **3 · Apply** | Rutin olmayan, kimi zaman karmaşık işi standart prosedürle bağımsız yapar | Genel yönlendirme | **Junior hedefi — işe alınabilir** |
| 8 | 4 · Enable | Karmaşık işi özerk yapar, prosedürü kendi yazar, başkasını yönlendirir | Özerk | **Senior analyst / detection engineer — hedefin ötesi** |
| 9–10 | 5 · Ensure, advise | Alanda otoriter referans | Geniş | **Lead / uzman — hedefin çok ötesi** |

**Eksen 2 — Kanıt (P0'da zaten uygulandı, sadece adı düzeltiliyor):**

| Kanıt | Ne demek | `S` tavanı | Eski etiket |
|---|---|---:|---|
| `yok` | Beyan | **5** | ⚪ / 🟡 |
| `kayit` | Lab kaydı, komut geçmişi, ekran görüntüsü | **8** | 🟢 |
| `public` | GitHub / write-up URL'si, üçüncü kişi tekrar üretebilir | **10** | 🔵 |

**Kural değişikliği:** ⚪🟡🟢🔵 artık **beceri bandı değil, kanıt bandıdır.** "🔵 proje" = *public kanıtlı, sahipli artefakt*; "S=9 beceri" **değil**. Bu tek ayrım, hem Gate C'yi hem "hiç hazır hissetmeme" durumunu aynı anda çözüyor.

### 3.3 Rekalibre edilmiş hedef vektörü ve `R_hedef`

**Hedef profili** — SFIA 2–3 tabanı, iki "vitrin" becerisi 7'de, destek becerileri 3–5'te. Kanonik 12 alan ve P0'ın kilitli `w` vektörüyle:

| `id` | Alan | `w` | Rol | **S\*** | SFIA | `w×S*` |
|---|---|---:|---|---:|---|---:|
| `def` | Defensive/SOC | 1.5 | çekirdek + vitrin | **7** | 3+ | 10.5 |
| `win` | Windows/AD | 1.4 | çekirdek | **6** | 3 | 8.4 |
| `port` | Portfolio | 1.4 | vitrin | **7** | — | 9.8 |
| `linux` | Linux | 1.3 | çekirdek | **6** | 3 | 7.8 |
| `net` | Networking | 1.2 | çekirdek | **6** | 3 | 7.2 |
| `siem` | SIEM | 1.1 | çekirdek + vitrin | **7** | 3+ | 7.7 |
| `secfund` | Security Fundamentals | 1.0 | çekirdek | **6** | 3 | 6.0 |
| `netsec` | Network Security | 0.9 | destek | **5** | 2–3 | 4.5 |
| `py` | Python | 0.8 | destek | **4** | 2 | 3.2 |
| `off` | Offensive | 0.7 | destek (tespit için saldırganı anlamak) | **3** | 1–2 | 2.1 |
| `crypto` | Crypto | 0.6 | destek | **4** | 2 | 2.4 |
| `cloud` | Cloud | 0.4 | destek | **3** | 1–2 | 1.2 |
| | **Σ** | **12.3** | | | | **70.8** |

`T* = 70.8 / 12.3 = **5.76**`   (mevcut varsayım: 7 · 🔵 anlatısı: 9)

**Diğer boyutlar:**

| Boyut | Hedef | Nasıl türedi |
|---|---:|---|
| `P*` | **6.6** | `P = 10(1−e^(−Σq·v·e/5))`. 1 SOC lab (3.0) + 1 AD lab (2.5), ikisi de `public` + `sahiplik=1.0` ⇒ Σ = 5.5 ⇒ P = 6.67 |
| `L*` | **7.5** | DE B2 (7.5) + EN B2 (7.5), yeni saat-çıpalı skalada; `L = 0.55·7.5 + 0.45·7.5` |
| `C*` | **9.0** | `cv 2 + ağ 2 + staj 2 + funnel 2 + mülakat 1` (yeniden yapılandırılmış `C` — bkz. P1.10d) |

**Sonuç:**

```
Lineer (mevcut):  R* = 100 × (0.40×0.576 + 0.25×0.667 + 0.20×0.750 + 0.15×0.900) = 68.2
Geometrik (ρ=0):  R* = 100 × 0.576^0.40 × 0.667^0.25 × 0.750^0.20 × 0.900^0.15   = 67.3
Portfolio T'den çıkarılmış varyant (Σw = 10.9, T* = 5.60):                        = 67.6
```

Üç farklı toplama biçimi, üç farklı alan kümesi — **67.3 ile 68.2 arasında.** Sayı modelin iç detaylarına karşı dayanıklı.

> ### 🎯 Karar
> **1. `R_hedef` artık elle konan bir sabit değil, hedef vektöründen TÜRETİLİR.**
> `R_hedef := R(hedef.vektor)` — yani hangi toplama biçimi (ρ) aktifse onunla hesaplanır: ρ=1'de **68.2**, ρ=0'da **67.3**. Bu, bir sayıyı elle tutmanın yarattığı bütün tutarsızlığı ortadan kaldırır ve `ρ` ya da vektör değişirse hedef kendiliğinden güncellenir. Pratikte mesaj değişmiyor: **hedef ≈ 68, eski 70 ile arasındaki fark gürültü.** Bir daha bu sayıyla oynanmayacak; oynanacak şey vektör.
>
> **2. Asıl değişiklik hedef *vektörü*:** tekdüze `boyut = 7` → **`T 5.8 · P 6.6 · L 7.5 · C 9.0`**. `meta` satırında `hedef.boyut` skaleri **silinir**.
>
> **3. Yeni kilometre taşı: `R_giriş`** — "başvurmaya başlamanın rasyonel olduğu nokta". Giriş vektörü `T 5.0 · P 5.0 · L 6.1 · C 7.0` ⇒ lineer **55.3**, geometrik **54.8**. **Gate D'nin eşiği 65 → 55.** Bu, panelde bugüne kadar hiç olmayan şeyi verir: *ulaşılabilir bir ilk hedef*.

### 3.4 Kapı revizyonları — rekalibrasyonun doğrudan sonuçları

| Kapı | Eski | **Yeni** | Gerekçe |
|---|---|---|---|
| **A** | `net≥7 ∧ linux≥6 ∧ win≥5` | `net≥6 ∧ linux≥6 ∧ win≥5` | `net≥7` SFIA 3'ün üstünü istiyordu; 6 zaten "pcap'te anomaliyi kendi bulur". `π_A` %66'dan **%70**'e çıkar — beceri değişmedi, eşik dürüstleşti |
| **B** | `A ∧ secfund≥6 ∧ siem≥5` | değişmedi | Denetim K10'un dairesel bağımlılık uyarısı belgelendi: eşik 6'ya **çıkarılmayacak** |
| **C** | "2× 🔵 proje (9–10)" | **`≥2 artefakt: seviye=public ∧ sahiplik=1.0`, bunlardan ≥1'i `deger ≥ 2.5` (SOC veya AD lab)** | Beceri ≠ kanıt. Denetimin "kod gevşemiş" tespiti doğru ama düzeltme yönü ters: **spec düzeltilir, kod değil** |
| **D** | `R≥65 ∧ C ∧ DE≥5 ∧ EN≥6` | **`R≥55 ∧ C ∧ Gate 0 ∧ DE≥5 ∧ EN≥7`** | `R` §3.3. `DE≥5` **kalıyor** — yeni skalada 5 = B1, yani denetimin istediği şey zaten sağlanıyor. `EN≥7` ≈ B2 (teknik mülakat). `Gate 0` ön koşul oluyor |
| **E** | `D ∧ son 14 günde ≥2 mülakat` | değişmedi | **P0'da kapandı** |
| **0** *(yeni)* | — | `Denklik sonucu biliniyor (tam/kısmi/yok) ∧ ≥1 uygulanabilir oturum rotası tanımlı` | K07 + P1.1 |
| **F** *(yeni)* | — | `Runway_ay ≥ 12` — yalnızca Rota B için zorunlu | K07 + P1.1 |

### 3.5 Düzeltilmiş ETA — ve neden siber saati artırmak işe yaramıyor

**Efor modeli (güç yasası, prior art §3.3):** `Effort(S) = A · S²`, `A = 2.22 saat`.
*Kalibrasyon:* denetim K17 "Defensive/SOC 3→6 ≈ 60 saat" diyor ⇒ `A(36−9) = 60` ⇒ `A = 2.22`.
*Sonuç:* 6→9 adımı **100 saat**, 3→6 adımı 60 saat. Lineer ETA'nın neden sistematik iyimser olduğu bu tek satırda.
*Uyarı (prior art §9):* güç yasası vs üstel tartışması çözülmedi (Heathcote 2000). Çıkarım ("lineer değil") her iki durumda geçerli; `p=2` kendi verinle kalibre edilecek.

**Mevcut durum** (P0 seed snapshot, `S_etkin`): net 5, linux 4, win 3, secfund 5, crypto 5, netsec 5, siem 3, def 3, off 2, py 5, cloud 2, port 2 ⇒ `T = 3.63`, `R = 26.62`.

**Teknik bacak — üç hedef tanımı:**

| Hedef tanımı | `Σ Δ(S²)` | Saat | @28 h/hf | @18 h/hf |
|---|---:|---:|---:|---:|
| 🔵 anlatısı (hepsi 9) | 792 | **1.760 h** | 63 hafta | 98 hafta |
| Mevcut sayısal (hepsi 7) | 408 | **906 h** | 32 hafta | 50 hafta |
| **SFIA profili (§3.3)** | 204 | **453 h** | **16 hafta** | **25 hafta** |
| SFIA profili, yalnız `R_giriş`'e | 100 | **222 h** | **8 hafta** | **12 hafta** |

Teknik mesafe **63 → 16 haftaya** düşüyor. Bu, rekalibrasyonun vaat ettiği kazanç ve gerçek.

**Dil bacağı** (Cambridge kümülatif GLH, prior art §6): A1 ≈ 95 · A2 ≈ 190 · B1 ≈ 375 · B2 ≈ 550 · C1 ≈ 750

Planlama sayıları — Cambridge'in **iki** tablosu biraz farklı veriyor, aralığın üst-ortası alındı:

| Adım | Kümülatif tablodan | Artımlı araştırma tablosundan | **Planlama sayısı** |
|---|---:|---:|---:|
| A1 → B1 | 280 GLH | 260–390 | **320 GLH** |
| A1 → B2 | 455 GLH | 440–650 | **550 GLH** |

*Uyarı korunuyor:* bunlar Cambridge/Goethe **kurum tahminleri**, CEFR resmî saat öngörmez ve hiçbir kaynak Türkçe ana dili için ayrı sayı vermiyor; dil mesafesi bu sayıları yukarı çeker. Üst-orta seçimin gerekçesi bu.

| DE h/hf | A1→B1 | A1→B2 |
|---:|---:|---:|
| 5 | 64 hafta | 110 hafta |
| **7** *(mevcut plan: 10 h dil, ~%70 DE)* | **46 hafta** | **79 hafta** |
| 10 | 32 hafta | 55 hafta |
| 14 | 23 hafta | 39 hafta |

**Birleştirme — `ETA = max_k ETA_k` (kapılar konjonktif, denetim K12):**

| Senaryo | siber h/hf | DE h/hf | Teknik→giriş | Teknik→hedef | DE→B1 | DE→B2 | **ETA giriş** | **ETA hedef** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Mevcut plan | 28 | 7 | 8 | 16 | 46 | 79 | **46 hf** | **79 hf** |
| Gerçekçi tempo | 18 | 7 | 12 | 25 | 46 | 79 | **46 hf** | **79 hf** |
| **Dil ağırlıklı (öneri)** | 18 | 14 | 12 | 25 | 23 | 39 | **23 hf** | **39 hf** |
| Rota A (İngilizce işveren; DE kapı değil) | 22 | 7 | 10 | 20 | — | — | **~10 hf** | **~20 hf** |

> ### 🎯 Bu tablonun söylediği üç şey
> 1. **Panelin gösterdiği ~24 hafta** (`(70−26.62)/1.84`) **giriş eşiği için bile 2–3 kat iyimser.** Sebep: `R` telafi edici, dolayısıyla teknik ilerleme dil açığını maskeliyor. Bu tam olarak K05 + K12 + Liebig'in birlikte söylediği şey.
> 2. **Siber saatini 28'den 18'e düşürsen toplam ETA değişmiyor** (46 hafta). **Almancayı 7'den 14'e çıkarsan yarıya iniyor** (46 → 23). Bütün optimizasyon alanı tek bir değişkende.
> 3. **Rota A ile Rota B arasındaki fark 4 kattan fazla** (10 hafta vs 46). Bu karar modelde hiç temsil edilmiyor ve toplam ETA'yı belirleyen en büyük tek şey. Bkz. §8 soru 3.

---

## 4. P1 kalemleri

Sıralama kriteri: (iki raporun da desteklediği mi) × (davranışı değiştiriyor mu) ÷ (efor). **Numaralar öncelik sırasıdır** — yukarıdan aşağı uygulanır.

| # | Kalem | Neden bu sırada | Efor | Yeni günlük girdi |
|---|---|---|---|---|
| **1** | Chancenkarte puan motoru + Gate 0 + Gate F | 3–4 aylık bekleme süresiyle **kritik yolda**; sistemin en yüksek ROI'li eylemini ortaya çıkarıyor | Düşük | Yok |
| **2** | Hedef rekalibrasyonu (SFIA skalası, hedef vektörü, kapılar) | "Ulaşılamaz hedef" sorununun kökü; diğer her şeyin ölçüldüğü çubuk | Çok düşük | Yok |
| **3** | Dil modeli (saat-çıpalı CEFR + konuşma alt-skoru) | Gerçek darboğazı **görünür** yapıyor; ETA'yı belirleyen tek değişken | Düşük | Yok (haftalık) |
| **4** | CTL / ATL / TSB | `D5`'i siler, `v_tahmin`'i sağlamlaştırır, burnout'u ölçer — üç bulgu tek formülle | Düşük | Yok |
| **5** | Tekrar motoru (FSRS eğrisi + Cepeda ölçeği) | **Yükü ~4.5 kat azaltıyor** — guardrail bütçesinin mekanik ön koşulu | Düşük–Orta | Yok |
| **6** | Olasılıksal ETA (bileşen bazlı Monte Carlo) | Tek dürüst ETA; ama ≥4 snapshot bekliyor, o yüzden 4–5'ten sonra | Orta | Yok |
| **7** | Güvenlik marjı + akrasia horizon + geri dönüş modu | Manşet sayıyı ETA'dan alıp aksiyona bağlar; kaçış yollarını kapatır | Düşük–Orta | Yok |
| **8** | `R` toplama düzeltmesi (ρ=0) + Portfolio çift sayımı | Doğru, ama geçmiş yeniden hesaplama gerektiriyor — sonda yapılmalı | Düşük / Orta | Yok |
| **9** | Rubrik çapaları + %75 kuralı + mini-Elo | (a) ve (b) bedava; (c) veri biriktirmeye başlar, kararı P2'ye bırakır | Düşük→Orta | +1 tık |
| **10** | Küçük dörtlü: WIP · if-then kapılar · anti-metrikler · `C` yeniden yapısı | Hepsi tek satırlık kural, hepsi belgelenmiş etkiye sahip | Çok düşük | Yok |

---

### P1.1 — Chancenkarte puan motoru + Gate 0 (hukuki) + Gate F (finans)

**Ne yerine geçiyor:** `C.vize ∈ {0,1}` — `R`'nin %1.5'i olan toplama terimi. Denetim K07 bunu "fonksiyonel biçim hatası" diye adlandırıyor: katastrofik-binary bir kısıt yumuşak-lineer terim olarak modellenmiş.

**Formül** — § 20b AufenthG Abs. 1 + Anlage. Dil ve deneyim kriterleri **birbirini dışlar** (`es sei denn` / `wenn er keine Punkte nach Nummer 6 erhält`), yani `max`, toplama değil:

```python
def chancenkarte(u):
    # --- KAPI: ön koşullar. Puan getirmez; sağlanmazsa puan yoluna hiç girilemez ---
    nitelik = u.mesleki_egitim_yil >= 2 or u.diploma_koken_ulkede_taniniyor
    dil     = u.de >= "A1" or u.en >= "B2"
    gecim   = u.lebensunterhalt_kaniti
    if not (nitelik and dil and gecim): return None
    # Not: nitelik TAM tanınmışsa puan sistemine hiç girilmez, Chancenkarte doğrudan alınır.

    p = 0
    if u.kismi_denklik_karari:      p += 4      # Nr.1  Anerkennungsbescheid (kısmi denklik)
    if   u.de >= "B2":              p += 3      # Nr.2  — C1 EK PUAN GETİRMEZ
    elif u.de >= "B1":              p += 2      # Nr.3
    elif u.de >= "A2":              p += 1      # Nr.4
    if u.en >= "C1":                p += 1      # Nr.5  — İngilizce B2 = 0 puan
    if   u.deneyim_son7 >= 5:       p += 3      # Nr.6
    elif u.deneyim_son5 >= 2:       p += 2      # Nr.7
    if u.engpassberuf:              p += 1      # Nr.8  §18g listesi — DOĞRULANMADI
    if   u.yas <= 35:               p += 2      # Nr.9
    elif u.yas <= 40:               p += 1      # Nr.10
    if u.de_ikamet_ay_son5 >= 6:    p += 1      # Nr.11
    if u.es_de_uygun:               p += 1      # Nr.12
    return p                                    # >= 6 ise uygun
```

**Senin durumun için işlenmiş sayılar** (yaş ≤35 varsayımıyla — bkz. §8 soru 1):

| Durum | Puan | Not |
|---|---:|---|
| Bugün (DE A1, denklik yok, deneyim yok) | **2** | Eşiğin 4 puan altında |
| + Kısmi denklik kararı | **6** | ✅ **Eşik tam karşılandı** |
| + Almanca A2 | 7 | Güvenlik marjı |
| + Almanca B1 | 8 | |
| + Almanca B2 | 9 | Almanca burada **doygunlaşıyor** — C1'in getirisi sıfır |
| + Engpassberuf (doğrulanırsa) | 10 | |

**Marjinal getiri — sistemin tamamındaki en yüksek ROI'li iki eylem:**

| Aksiyon | Δpuan | Kaba maliyet | **puan/saat** |
|---|---:|---|---:|
| Engpassberuf'u §18g listesinden doğrula | +1 (belki) | ~2 saat araştırma | **0.50** |
| **Kısmi denklik (Anerkennung) başvurusu** | **+4** | ~15 saat evrak + €100–600 + **3–4 ay bekleme** | **0.27** |
| DE A1→A2 | +1 | ~100 GLH | 0.010 |
| DE A2→B1 | +1 | ~190 GLH | 0.005 |
| DE B1→B2 | +1 | ~216 GLH (Goethe: 3 Abendkurs) | 0.005 |
| EN B2→C1 | +1 | ~200 GLH | 0.005 |
| Yaş | **−1** (36'da), **−1** (41'de) | kontrol dışı | — |

**Gate 0 — üç dallı, boolean değil.** Denklik başvurusunun üç olası sonucu var ve üçü üç farklı dünyaya açılıyor:

```
Gate 0 durumu ∈ { bilinmiyor , tam_denklik , kismi_denklik , denk_degil }

bilinmiyor    → panelin en üstünde kalıcı uyarı. Diğer bütün ETA'lar koşullu.
tam_denklik   → puan sistemine hiç girilmez; Chancenkarte doğrudan + geçim kanıtı. En iyi dal.
kismi_denklik → +4 puan; §20b puan yolu açık.
denk_degil    → Rota B kapanabilir; Rota A'ya (iş teklifi → çalışma vizesi) tam ağırlık.
```

**Gate F — finansal runway:**

```
Runway_ay = (birikim + aylık_tasarruf × kalan_hafta/4.33) / aylık_gider_DE
Koşul: Runway_ay ≥ 12          (Chancenkarte iş arama süresi)

Planlama yer tutucusu: aylık geçim €1.091 (2026)
⇒ 12 ay ≈ €13.100 + uçuş (~€200) + depozito (~€1.500) ≈ €15.000–17.000
```

**Girdi:** yaş · birikim · aylık tasarruf · denklik başvurusu durumu · Engpassberuf doğrulaması
**UI:** Yeni "Almanya / Hukuki Yol" kartı. En üstte üç dallı Gate 0 rozeti, altında puan dökümü (12 satır, karşılanan/karşılanmayan), yanında "sıradaki +1 puanın maliyeti" tablosu. `C.vize` alanı **kaldırılır**, boşalan puan `C.ağ`'a gider.
**Efor:** Düşük (saf hesap, yeni veri kaynağı yok)
**Kaynak:** [§ 20b AufenthG](https://www.buzer.de/20b_AufenthG.htm) · [Anlage AufenthG — puan tablosu](https://www.sozialgesetzbuch-sgb.de/aufenthg/anlage.html)

> **🚩 DOĞRULANMADI (prior art §9'dan korunan bayrak):** Puan tablosu 21.02.2024 değişikliğiyle (yürürlük 01.06.2024) doğrulandı; **2025–2026'da değişiklik olup olmadığı teyit EDİLEMEDİ.** `make-it-in-germany.com` opportunity-card sayfası 404 döndü. Ayrıca **§18g Engpassberuf listesinde BT/siber güvenliğin olup olmadığı** ve **2026 geçim eşiği tutarı** doğrulanmadı. Gerçek başvurudan önce **bamf.de** ve **gesetze-im-internet.de/aufenthg** üzerinden mutlaka kontrol. Panel bu kartın üstünde kalıcı bir "yasa doğrulaması: [tarih]" etiketi taşımalı.

---

### P1.2 — Hedef rekalibrasyonu: SFIA skalası, hedef vektörü, kapı revizyonları

**Ne yerine geçiyor:** `hedef.boyut = 7` skaleri; ⚪🟡🟢🔵'nın beceri bandı olarak kullanımı; Gate C'nin "9–10" şartı; Gate D'nin `R≥65` eşiği.

**Formül** — sabit değişikliği, yeni `meta` satırı:

```jsonc
{"type":"meta","sema":"1.1","model_surum":"2.1",
 // hedef.R ve hedef.R_giris ARTIK YAZILMIYOR — vektorlerden turetilir (bkz. §3.3 karar 1)
 "hedef":{"vektor":       {"T":5.8,"P":6.6,"L":7.5,"C":9.0},   // => R 68.2 (p=1) / 67.3 (p=0)
          "vektor_giris": {"T":5.0,"P":5.0,"L":6.1,"C":7.0},   // => R 55.3 (p=1) / 54.8 (p=0)
          "S":{"def":7,"win":6,"port":7,"linux":6,"net":6,"siem":7,
               "secfund":6,"netsec":5,"py":4,"off":3,"crypto":4,"cloud":3}},
 "sfia":{"2":1,"4":2,"6":3,"8":4,"9":5},   // S -> SFIA seviyesi esigi
 "kapilar":{"A":{"net":6,"linux":6,"win":5},
            "C":{"tip":"kanit","min_public_artefakt":2,"min_sahiplik":1.0,"min_deger":2.5},
            "D":{"R":"R_giris","DE":5,"EN":7,"gate0":true}},
 "not":"SFIA/NICE rekalibrasyonu. hedef.boyut skaleri kaldirildi; R turetilmis."}
```

**Girdi:** yok — saf sabit değişikliği.
**UI:** (a) Her `S` seçicisinin yanında SFIA rozeti (`S=6 → SFIA 3 · Apply`). (b) Skala açıklamasında 8 ve 9–10 bantları **"hedefin ötesi"** olarak gri gösterilir — bu tek görsel değişiklik "hiç hazır olmama" hissinin yapısal kaynağını kaldırır. (c) Radar grafiğine **hedef vektörü ikinci bir poligon** olarak eklenir; şu an hedef çizgisi yok. (d) `R` çubuğunda iki işaret: `R_giriş = 55` (turuncu) ve `R_hedef = 70` (yeşil).
**Efor:** Çok düşük
**Kaynak:** SFIA 9 Levels of responsibility · NIST NICE proficiency raporu · NICE `PD-WRL-001` (eski `PR-CDA-001` / OPM 511)

---

### P1.3 — Dil modeli: saat-çıpalı CEFR + konuşma alt-skoru + GLH tabanlı dil ETA'sı

**Ne yerine geçiyor:** `A1:2 A2:4 B1:6 B2:8 C1:9.5` eşit aralıklı skalası (K13) ve dilin tek sayıya çökmesi. Ayrıca `cefrFromScore`'un yukarı yuvarlaması (skor 5 ekranda "B1" yazıyor, oysa A2+).

**Formül:**

```
# 1) Saat-çıpalı CEFR skalası
   A1 1.5 · A2 3.0 · B1 5.0 · B2 7.5 · C1 9.5        ← kullanılacak (denetim K13)
   Cambridge GLH oranından türetilen kontrol: kümülatif_GLH / GLH(C1) × 9.5
      A1 95/750×9.5=1.20 · A2 2.41 · B1 4.75 · B2 6.97 · C1 9.50
   Maksimum sapma B2'de 0.53. Denetimin yuvarlak değerleri korundu: (a) süreklilik,
   (b) Goethe'nin Almanca'ya özgü tablosunda B2 tek atlaması EN PAHALI seviye
       (3 Abendkurs / 216 UE) — bu, B2'yi biraz YUKARI koymayı destekler, aşağı değil.

# 2) Konuşma ağırlıklı dil skoru — belgelenmiş darboğazın hedefi
   DE = 0.6 × konuşma + 0.4 × genel        (ikisi de yukarıdaki skalada)
   EN = 0.6 × konuşma + 0.4 × genel
   L  = 0.55·DE + 0.45·EN                   (değişmedi)

# 3) Görüntüleme AŞAĞI yuvarlar
   s < 3 → A1 · s < 5 → A2 · s < 7.5 → B1 · s < 9.5 → B2 · else C1

# 4) Dil ETA'sı — sabit v değil, saat maliyeti
   ETA_dil_hafta = (GLH_küm(hedef) − GLH_küm(mevcut)) / haftalık_dil_saati
```

`0.6` konuşma ağırlığı keyfi değil: kendi ifadenle darboğaz **üretken tarafta** (*"Bildiğim şeyi hızlı şekilde dile dökemiyorum"*), ve Almanca teknik mülakat sözlü.

**Etki (mevcut durumda):** DE konuşma ~1.0 / genel ~1.5 ⇒ DE = 1.2 (eski: 2). EN konuşma ~4.0 / genel ~5.0 ⇒ EN = 4.4 (eski: 6). `L = 2.64` (eski `L_etkin = 3.35`). **`R` −1.4 puan.** Küçük, ama Almanca+konuşma darboğazını görünür yapıyor — ki §3.5'e göre bu, toplam ETA'yı belirleyen tek şey.

**Girdi:** Dil başına bir sayı yerine **iki** (konuşma + genel), yalnızca haftalık snapshot'ta — günlük değil. Sürtünme artışı: ~15 saniye/hafta.
**UI:** D3 kartı iki satıra çıkar (konuşma / genel), altına GLH ilerleme çubuğu ("B1'e 320 saatin 40'ı") ve mevcut dil temposunda hafta tahmini. Darboğaz göstergesi dil olduğunda panelin üstündeki tek cümle: **"Şu an seni tutan tek şey: Almanca konuşma."**
**Efor:** Düşük
**Kaynak:** [Cambridge — Guided learning hours](https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours) · [Cambridge — How long does it take (PDF)](https://www.cambridge.org/elt/blog/wp-content/uploads/2018/10/How-long-does-it-take-to-learn-a-foreign-language.pdf) · [Goethe Abendkurse](https://www.goethe.de/ins/de/de/kur/ang/dak.html) · denetim K13

> **🚩 Uyarı korunuyor:** CEFR'in kendisi saat öngörmez; bu sayılar Cambridge ve Goethe **kurum tahminleridir**, "ortalama yetişkin öğrenici + iyi öğretmen + ödev" varsayar. Türkçe→Almanca dil mesafesi için ayrı sayı veren kaynak yok. Kendi `GLH_gerçek/GLH_tablo` oranını 8 hafta sonra ölç ve tabloyu kendi κ'nla ölçekle.

---

### P1.4 — CTL / ATL / TSB — `D5`'in ve el yapımı uyum formülünün yerine

**Ne yerine geçiyor:** (a) `D5 = clamp((hoursCyber/35)*4 + (hoursLang/14)*3 + (streak/14)*3, 0, 10)` — kodda uydurulmuş, hiçbir şeyi beslemeyen ölü metrik (K15). (b) Denetimin önerdiği el yapımı `A = 0.5·uyum + 0.3·tutarlılık + 0.2·(1−vade)`. (c) `v_tahmin`'in girdisi olarak "geçen haftanın ham saatleri".

**Formül** (TrainingPeaks Performance Management Chart, Banister impulse-response):

```
# Günlük yük — P0'ın mevcut hız sabitleriyle birebir uyumlu
load_g = ( h_siber,g × 0.80  +  h_dil,g × 0.20 ) × kalite_g × 10
         # 0.80 / 0.20 = P0 meta'daki hiz.a_siber / hiz.a_dil
         # ×10 okunabilirlik ölçeği. Oturum kaydı yoksa load_g = 0 — çürüme buradan giriyor.

CTL_g = CTL_{g−1} + (load_g − CTL_{g−1}) / 42      # birikmiş kapasite ("fitness")
ATL_g = ATL_{g−1} + (load_g − ATL_{g−1}) / 7       # anlık yorgunluk ("fatigue")
TSB_g = CTL_g − ATL_g                              # sürdürülebilirlik ("form")

# ETA girdisi ATL değil CTL kullanır — iyi bir haftadan sonra ETA'nın uçmasını engeller
v_tahmin = (0.7 × CTL − 3.7) / 9.25                # 3.7 ve 9.25 = P0 meta'daki h0 ve H
```

**Doğrulama:** Plan tempoda (28 siber + 10 dil, kalite 0.85) haftalık efektif = `(22.4+2)×0.85 = 20.74 h` ⇒ günlük `load = 29.6` ⇒ kararlı durumda `CTL = 29.6` ⇒ `v_tahmin = (20.7−3.7)/9.25 = **1.84**`. P0'ın mevcut `v_tahmin` değeriyle **birebir aynı.** Yani bu değişiklik geriye dönük uyumlu; hiçbir sabit yeniden kalibre edilmiyor.

**TSB bantları** (TrainingPeaks bantlarından uyarlandı — uyarlama olduğu belirtilmeli):

| TSB | Anlam | Panelin yaptığı |
|---|---|---|
| < −20 | Aşırı yüklenme | BUGÜN TEK GÖREV = "dinlen veya 15 dk hafif tekrar" |
| −20 … −6 | **Verimli build** | (istenen bölge, hiçbir uyarı yok) |
| −5 … +5 | Koruma | normal |
| +6 … +15 | Tempo düşüyor | Nötr bilgi, uyarı **değil** |
| > +15 | Fiilen durmuş | Geri dönüş modu tetiklenir (§7 kural 2) |

**Karar:** `v_etkin = v × (1 − B)` gibi bir burnout çarpanı **eklenmiyor.** TSB zaten yükü yansıtıyor; çarpmak çift sayım olur. TSB yalnızca gösterge ve BUGÜN TEK GÖREV'in girdisi.

**Girdi:** `session.dur_min` + `session.kalite` — **P0 şemasında zaten var.** Yeni girdi yok.
**UI:** `v` kartı yerine iki çizgili mini grafik (CTL kalın, ATL ince) + TSB rozeti. `LineChart` SDK'da mevcut ve hâlâ import edilmemiş (denetim §8 madde 2).
**Efor:** Düşük (~30 satır)
**Kaynak:** [The Science of the TrainingPeaks Performance Manager](https://www.trainingpeaks.com/learn/articles/the-science-of-the-performance-manager/) · [Fitness (CTL)](https://help.trainingpeaks.com/hc/en-us/articles/204071884-Fitness-CTL) · [Fatigue (ATL)](https://help.trainingpeaks.com/hc/en-us/articles/204071894-Fatigue-ATL)

> Prior art'ın vurgusu aynen geçerli: **bu formül tarih içermiyor.** Yalnızca *dünkü durum + bugünkü girdi*. Yani "durum + geçiş" felsefenle mevcut haftalık ortalamadan **daha** uyumlu.

---

### P1.5 — Tekrar motoru: FSRS eğrisi + Cepeda ölçeği + SM-2 güncellemesi

**Ne yerine geçiyor:** P0'ın uyguladığı `τ = t0 · b^n` ile `t0 = 1.3 gün`, `b ∈ {2.3, 1.8, 1.4}`. Mekanizma doğru (sonuç zorunlu, gerçek vade, `n` düşürme) — **ölçek yanlış.**

**Kanıt:** Cepeda et al. 2008 (1.350+ katılımcı, gerçek gün ölçeğinde): optimal gap, hedef hatırlama ufkuna (RI) bağlı — RI 7 gün → gap ~3 gün · RI 35 → ~8 · **RI 70 → ~12** · RI 350 → ~27. Senin RI'n mülakat ufku, yani **aylar**. Mevcut 1.3/3/6.9 dizisi kat kat sıkı ⇒ gereksiz yük + (Karpicke & Roediger 2007) retrieval kolaylaştığı için birim çaba başına kazanç düşük.

**Formül:**

```
# --- Görüntüleme ve vade: FSRS-6'nın YAYINLANMIŞ formu, birebir ---
w20    = 0.2
factor = 0.9^(−1/w20) − 1 = 0.6935              # R(S,S) = 0.90 olsun diye

R(t,S) = (1 + factor · t / S)^(−w20)            # "bu konuyu şu an %X hatırlarsın"
I(r,S) = S · (r^(−1/w20) − 1) / factor          # vade
         r = 0.90 → I = 1.00·S
         r = 0.85 → I = 1.81·S    ← ÖNERİLEN (mülakat ufku aylar; Cepeda)
         r = 0.80 → I = 2.96·S
Vadesi geldi: R(t,S) < r

# --- Stabilite güncellemesi: SM-2 EF mekaniği (AÇIK SAPMA, gerekçe aşağıda) ---
EF ∈ [1.3, 2.8], başlangıç 2.5
S₀ = 3 gün       # yeni konu — Karpicke: İLK TEKRARI GECİKTİR, T+1 değil
S_tavan = 90 gün

basarili  : EF ← min(2.8, EF+0.10) ; S ← min(90, S·EF)      ; n ← n+1
zorlandim : EF ← max(1.3, EF−0.14) ; S ← S·max(1.0, EF−0.6) ; n sabit
basarisiz : EF ← max(1.3, EF−0.54) ; S ← max(3, S·0.35)     ; n ← max(0, n−2)
```

**Sonuçlanan vade dizisi (art arda başarı, r = 0.85):**

| # | **Yeni** | P0 mevcut | Cepeda referansı |
|---:|---:|---:|---|
| 1 | 5 gün | 1.3 gün | (ilk tekrar geciktirilmeli) |
| 2 | 14 gün | 3.0 gün | **~12 gün** (RI ≈ 70 gün) |
| 3 | 38 gün | 6.9 gün | **~27 gün** (RI ≈ 350 gün) |
| 4 | 107 gün | 15.8 gün | |
| 5 | 163 gün (`S` tavanı) | 36.4 gün | |

**Kararlı durumda madde başına tekrar sıklığı ~4.5 kat düşüyor** (36 gün → 163 gün aralık). Bu, §7 kural 1'deki "günde saniyeler" bütçesinin mekanik ön koşulu. Yani bu kalem yeni yük eklemiyor — **var olan yükün büyük kısmını siliyor.**

**Açık sapma ve gerekçesi:** FSRS-6'nın kendi stabilite güncellemesi `S'(S,G) = S · e^(w₁₇(G−3+w₁₈)) · S^(−w₁₉)` biçiminde ve **21 eğitilmiş parametre** taşıyor. Bu parametreler 500M+ tekrar üzerinde kalibre edildi; tek kişilik veriyle kestirilemez, varsayılanları da senin materyaline (kavram/lab, kelime kartı değil) uymuyor. Bu yüzden: **unutma eğrisi ve vade tersine çevirmesi FSRS'ten birebir, stabilite güncellemesi SM-2'nin resmî EF mekaniğinden.** Her iki parça da yayınlanmış; hiçbir sabit uydurulmadı. FSRS'in dört niteliksel özelliğinden üçü korunuyor (S büyükse artış küçük — `S_tavan` ve `min(90,·)`; başarısızlıkta çöküş; artış ≥1). Dördüncüsü (R küçükse artış büyük — spacing etkisi) uygulanmıyor; kabul edilen basitleştirme.

**Girdi:** `retrieval.sonuc` — **P0 şemasında zaten zorunlu.** Yeni girdi yok.
**UI:** Retrieval tablosuna iki kolon: `R(t,S)` yüzdesi (renk skalası) ve "T−n gün". Günlük kuyruk **3 maddeyle** sınırlı (P0'ın 5'inden indirildi — ölçek gevşediği için yük zaten düştü). Üç sonuç düğmesi P0'da var.
**Efor:** Düşük–Orta
**Kaynak:** [FSRS-6 algoritması](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm) · [SM-2 resmî metin](https://www.super-memory.org/archive/english/ol/sm2.htm) · [Cepeda et al. 2008 (PDF)](https://www.yorku.ca/ncepeda/publications/CVRWP2008.pdf) · [Karpicke & Roediger 2007 (PDF)](https://learninglab.psych.purdue.edu/downloads/2007/2007_Karpicke_Roediger_JEPLMC.pdf)

> **🚩 Uyarı korunuyor:** Cepeda et al.'in kendi simülasyonları ACT-R ve SAM'ın iki bulguyu aynı anda açıklayamadığını buldu — teori tartışmalı, ampirik tablo sağlam. Ayrıca Storm, Bjork & Storm (2010) nüans ekliyor: expanding'in avantajı ilk testin başarısızlık riski düşükken ortaya çıkabilir.

---

### P1.6 — Olasılıksal ETA: bileşen bazlı Monte Carlo + güç yasası efor birimi

**Ne yerine geçiyor:** `ETA = (R_hedef − R) / v` nokta tahmini ve denetimin `CI₆₈ = ETA(1 ± σ_v/v̄)` yaklaşımı.

**Formül:**

```
# 1) Kalan işi R puanı değil EFOR BİRİMİ olarak ölç (güç yasası düzeltmesi)
kalan_T = Σ_i  A · max(0, S*_i² − S_i²)          A = 2.22 saat  (K17 çıpası: def 3→6 ≈ 60 h)
kalan_L = GLH_küm(hedef) − GLH_küm(mevcut)       Cambridge/Goethe tablosu
kalan_P = Σ eksik artefakt × tipik saat          SOC lab ~60 · AD lab ~50 · write-up ~6
kalan_C = ~40 saat                               CV + LinkedIn/ağ + funnel kurulumu

# 2) Boyut başına bootstrap (yerine koyarak örnekleme, 10.000 tur)
örnekler_k = snapshot'lardan haftalık tamamlanan efor serisi
for 1..10000:
    hafta = 0 ; birikim = 0
    while birikim < kalan_k:
        birikim += rastgele_seç(örnekler_k)
        hafta += 1
    kaydet(hafta)
→ P50_k , P85_k , P95_k

# 3) Birleştirme — kapılar konjonktif ⇒ max, ortalama DEĞİL
ETA_P85  = max_k P85_k
Darboğaz = argmax_k P85_k          # "ETA'nı belirleyen tek boyut: ___"

# 4) Veri yoksa sayı uydurma
n_snapshot < 4  ⇒  "ETA ölçülmedi (n=2). Plan bazlı kaba tahmin: X hafta."
```

**Manşet olarak P85 gösterilir**, P50 küçük puntoyla altında. Gerekçe: Flyvbjerg'in UK DfT uygulamasında 80. persentil %57 contingency, 50. persentil %40. P50 ile yaşamak yazı-turayla yaşamaktır.

**Neden `max` ve neden bu kadar önemli:** §3.5'in tablosu tam olarak bu formülün çıktısı. Tek `R`-ETA'sı 24 hafta diyor; bileşen bazlı `max` 46 hafta diyor. Fark, `R`'nin telafi edici olmasından geliyor — teknik ilerleme dil açığını sayısal olarak maskeliyor. Denetim bunu K05 ve K12'de ayrı ayrı söylüyor; prior art Liebig/ToC ile gerekçelendiriyor. **Bu formül ikisini tek satırda birleştiriyor.**

**Girdi:** ≥4 `snapshot` — yani ilk gerçek çıktı ~1 ay sonra. O zamana kadar plan bazlı aralık, açık "ölçülmedi" etiketiyle.
**UI:** ETA kartı: büyük "**P85: ~46 hafta**", altında ince "P50: ~34 · P95: ~61", altında "Darboğaz: Almanca konuşma". **Renk skalası nötrleşir** — mevcut `eta < 20 success / < 35 warning / else danger` mantığı kaldırılır (denetim K16: 40 haftalık gerçekçi ETA'yı kırmızı yakmak, hedefin gerçekçi olduğu bir tempoyu "tehlike" diye boyamak demek).
**Efor:** Orta
**Kaynak:** [Focused Objective — Troy Magennis](https://www.focusedobjective.com/) · [Vacanti & Johnson, Flow Forecasting Pocket Guide](https://leanpub.com/ffpg) · Newell & Rosenbloom 1981 (güç yasası) · denetim K12

---

### P1.7 — Güvenlik marjı (GM) + akrasia horizon + geri dönüş modu

**Ne yerine geçiyor:** ETA'nın günlük manşet sayı olması. Denetim K16'nın en sert eleştirisi: *"Manşet metrik uzak ve büyük bir sayı — uzaklığı her açılışta hatırlatıyor."* Beeminder'ın cevabı: geleceğe dair tahmin yerine **şimdiki güvenlik marjı**.

**Tarihsiz uyarlama (türetildi).** Beeminder'ın "days-to-derail"i bir takvim yoluna karşı ölçülür; bizde takvim yolu yok. Ama **çürümeye karşı** aynı şey tanımlanabilir. P0'ın çürüme modelinden:

```
S_etkin(Δt) = S · (0.5 + 0.5·e^(−Δt/τ))  ≥  eşik
⇒ e^(−Δt/τ) ≥ 2·eşik/S − 1

GM_i  =  τ_i · ln( S_i / (2·eşik_i − S_i) )        [gün]
        τ_i = 10 · 2^{n_i}   (P0 sabitleri: tau0=10, b=2)
        2·eşik ≤ S ise GM = ∞ (tam çürümede bile eşiğin üstünde)
        S < eşik ise GM < 0 (zaten altında)
```

*Örnek:* `S=6`, kapı eşiği `5`, `n=2` ⇒ `τ=40` ⇒ `GM = 40·ln(6/4) = **16 gün**`.
*Örnek:* `S=7`, eşik `5`, `τ=40` ⇒ `GM = 40·ln(7/3) = **34 gün**`.

**Bantlar** (Beeminder izohat renkleri):

| GM | Renk | Panel |
|---|---|---|
| ≤ 0 | kırmızı | "eşiğin altına düştü" + **tek somut eylem** |
| 1–3 | turuncu | |
| 4–7 | mavi | |
| 8–21 | yeşil | |
| > 21 | koyu yeşil | |

**Günlük manşet sayı ETA değil bu olur:** *"En dar marj: Windows/AD — 4 gün."* Tek satır, aksiyona dönük, uzaklığı hatırlatmıyor.

**Akrasia horizon:**

```
hedef.vektor · hedef.S · w_i · kapı eşikleri değişikliği:
  GEVŞETME  → yeni `meta` satırı `yururluk_gun: 7` ile yazılır, 7 gün sonra etkin.
              Panel: "Bekleyen değişiklik: hedef DE B2 → B1, 5 gün sonra yürürlükte. [İptal]"
              İptal her zaman serbest (Beeminder de bekleyen gevşetmeyi iptal ettirir).
  SIKILAŞTIRMA → anında etkin.

Not: R_hedef türetilmiş olduğu için doğrudan düşürülemez — ancak vektörü gevşeterek
     düşer, o da bu 7 günlük gecikmeye tabidir. Kaçış yolu yapısal olarak kapalı.
```

Bu, "zorlaştı, hedefi düşüreyim" kaçışını kapatan tek mekanizma. Asimetri kasıtlı: kendini zorlamak bedava, kendini kandırmak 7 gün sürüyor.

**Geri dönüş modu** — §7 kural 2'de tam olarak tanımlı.

**Girdi:** yok — mevcut `S`, `kanit`, `son_pratik` ve kapı eşiklerinden türer.
**UI:** Panelin en üst şeridi: BUGÜN TEK GÖREV (P0) + hemen altında tek satır GM. ETA kartı katlanabilir bölüme iner.
**Efor:** Düşük–Orta
**Kaynak:** [Beeminder — DTD izohatları](https://blog.beeminder.com/isolines/) · [Beeminder — akrasia horizon](https://blog.beeminder.com/dial/) · [Beeminder — merhametli derail](https://blog.beeminder.com/derail/)

---

### P1.8 — `R` toplama düzeltmesi: geometrik ortalama (ρ=0) + Portfolio çift sayımı

**Ne yerine geçiyor:** Saf ağırlıklı aritmetik ortalama (K05) ve Portfolio'nun hem `T` hem `P` içinde sayılması (K06).

**Formül:**

```
# CES ailesi — mevcut model ρ=1 özel hâli olarak korunur
R = 100 × ( Σ_k w_k · X̂_k^ρ )^(1/ρ)          w = (0.40, 0.25, 0.20, 0.15)
ρ = 1   → mevcut lineer (tam telafi)
ρ → 0   → geometrik (Cobb-Douglas)     ← ÖNERİ, sabit olarak ρ=0 ship edilir
ρ → −∞  → min() (Leontief / Liebig)

Uygulama (ρ=0):  R = 100 × Π_k X̂_k^{w_k}
Taban koruması:  X̂_k ← max(X̂_k, 0.02)      # tek boyut 0 iken R=0 olmasın; log(0) yok

# Portfolio çift sayımı
port  T'den ÇIKARILIR  ⇒  Σw = 12.3 − 1.4 = 10.9   (11 alan)
port  yalnız P'nin bileşeni kalır
```

**Etki:**

| Senaryo | T̂ | P̂ | L̂ | Ĉ | R lineer | **R geometrik** |
|---|---:|---:|---:|---:|---:|---:|
| Mevcut (P0 seed) | 0.363 | 0.095 | 0.335 | 0.200 | 26.6 | **23.4** |
| Hedef profili | 0.576 | 0.667 | 0.750 | 0.900 | 68.2 | **67.3** |
| **"Dilsiz uzman"** (T=P=C=10, L=0.5) | 1.00 | 1.00 | 0.05 | 1.00 | **81.0** | **54.9** |

Son satır neden önemli: mevcut formül sıfır dille Almanya'da junior SOC profilini **"Güçlü başvuru profili" (80+)** bandına koyuyor. Gate D bunu yakalıyor ama **her gün baktığın sayı `R`, kapı değil.** Geometrik ortalama dengeli profilleri neredeyse hiç cezalandırmıyor (68.2 → 67.3), tek ayaklı profili çökertiyor (81 → 55).

> *Aritmetik notu:* denetim §K05'in aynı satırı 80.0 diyor; `L̂=0.05` ile doğrusu 81.0'dır (denetimin sayısı `L̂=0` durumuna karşılık geliyor). Hüküm değişmiyor.

**Uyumluluk uyarısı:** Bu değişiklik **bütün geçmiş `R` değerlerini değiştirir.** Uygulama kuralı: yeni `meta` satırı yazılır, geçmiş snapshot'lar **kendi model sürümleriyle** yeniden hesaplanır ve trend grafiğinde model sürümü değişimi dikey kesikli çizgiyle işaretlenir. Geçmiş silinmez, yeniden yazılmaz.

**Girdi:** yok
**UI:** `R` kartındaki formül metni `MODEL` sabitinden üretilir (P0). Darboğaz etiketi zaten var (`darbogaz_boyut`).
**Efor:** Düşük (kod) / Orta (geçmiş yeniden hesaplama ve trend işaretleme)
**Kaynak:** Denetim K05, K06 · gerekçe: Liebig'in minimum yasası, Goldratt ToC 5 odak adımı

---

### P1.9 — Rubrik çapaları + %75 görev seçim kuralı + mini-Elo çapraz kontrolü

**Ne yerine geçiyor:** `S_alan = 0..10 (mentor ölçümü + lab + retrieval)` — yani hiçbir tanım (K08). Ve denetimin "her alan × her kapı eşiği için BARS yaz" el işi.

**Üç parça, üç farklı efor seviyesi:**

**(a) Rubrik çapaları — bedava, prior art'ta zaten yazılmış.**
Prior art §5.4, dört çekirdek beceri için (Networking, Linux, Windows/AD, SIEM) S=2/4/6/8/9–10 satırlarını gözlemlenebilir kriter + tipik kanıt olarak vermiş. Seviye ölçeği SFIA 9'dan, teknik içerik NICE `PD-WRL-001`'in 43 task statement'ından çıpalı (T1348 "benign ile potansiyel kötücülü ayırt et" = S=6'nın kalbi; T1406 "kural yazma"; T0020 "kendi tespitini yazma").
**Yapılacak:** bu dört tabloyu `Ilerleme-Durum-Modeli.md`'ye kopyala. Kalan 8 alan için aynı formatta yaz (~2 saat). Kural: **rubrik karşılanmadan skor yükselmez.**

> 🚩 Prior art §9'un dürüst sınırı korunuyor: *seviye ölçeği* SFIA/NICE kaynaklı, **her hücredeki teknik kriter prior art'ın önerisidir**, SFIA'nın "Security operations (SCAD)" beceri metninden birebir alınmamıştır. BTL1 / THM / Security+ domain ağırlıkları da doğrulanmadı.

**(b) %75 kuralı — bedava, tek satır.**
Maths Garden (Klinkenberg et al. 2011, 3.648 çocuk / 3.5M problem) görevleri **ortalama %75 başarı olasılığıyla** örnekliyor. Bu tek kural iki deliği aynı anda kapatıyor: "kolay şeyler yapıp `R` şişirme" (Goodhart) ve "çok zora girip vazgeçme".
**Uygulama:** BUGÜN TEK GÖREV önerisi seçilirken üç bantlı bir tahmin sorulur — *"bunu ilk denemede yapabilir misin? kesin / muhtemelen / zor"* — ve **"muhtemelen"** bandındaki görev seçilir. "Kesin" bandı reddedilir.

**(c) Mini-Elo — çapraz kontrol, ikame değil.**

```
E(S) = 1 / (1 + 10^((d − θ)/400))
θ_yeni = θ + K·(S − E(S))          S ∈ {0, 0.5, 1} = başarısız / zorlandım / başarılı
d_yeni = d − K·(S − E(S))
K = 24  (ilk 30 deneme) → 12 (sonra)

Ölçek eşlemesi:  S_Elo = (θ − 800) / 160      θ 800→S0 · 1600→S5 · 1760→S6 · 2400→S10
Zorluk tohumu (THM/HTB etiketinden, kalibre edilecek):
   Info/Easy 1100 · Medium 1500 · Hard 1900 · Insane 2200

%75 kuralının Elo karşılığı:  d_hedef = θ − 400·log₁₀(3) = θ − 191
```

**Karar — Elo `S`'in yerine GEÇMİYOR, onu denetliyor.** Panel `S_beyan` yanında `S_Elo` gösterir ve farkı `|S_beyan − S_Elo|` bir kalibrasyon göstergesi olarak sunar. Gerekçe: bir alan başına anlamlı θ için ≥30 deneme lazım; o zamana kadar Elo'ya karar verdirmek gürültüyü ölçüm sanmaktır. **≥30 denemeye ulaşan alanlarda θ, `S`'in yerini alır (P2).** Bu, prior art'ın §3.4'teki r ≈ .29 problemini kademeli ve dürüst biçimde çözer.

Denetimin `b̂ = ort(S_öz − S_mentor)` kör testi **iptal edilmiyor** — Elo davranıştan, `b̂` üçüncü kişiden ölçüyor; ikisi bağımsız kanal.

**Girdi:** `session`/`retrieval` kayıtlarına `zorluk` (Elo puanı veya etiket) alanı. Şemada `zorluk_hissi` var, ona ek olarak nesnel `zorluk`. Ek sürtünme: seçim listesinden 1 tık.
**UI:** Skill tablosunda `S` sütununun yanında soluk `θ→S` sütunu ve fark rozeti. BUGÜN TEK GÖREV panelinde önerilen görevin yanında "beklenen başarı: %74".
**Efor:** (a) Düşük · (b) Çok düşük · (c) Orta
**Kaynak:** [Klinkenberg, Straatemeier & van der Maas (2011)](https://www.sciencedirect.com/science/article/abs/pii/S0360131511000418) · [Zell & Krizan (2014)](https://journals.sagepub.com/doi/10.1177/1745691613518075) · [NICCS — Defensive Cybersecurity PD-WRL-001](https://niccs.cisa.gov/tools/nice-framework/work-role/defensive-cybersecurity)

---

### P1.10 — Küçük ama zorunlu dörtlü

| # | Kalem | Formül / kural | Kaynak | Efor |
|---|---|---|---|---|
| a | **WIP limiti** | Aynı anda en fazla **2 aktif teknik konu + 1 dil konusu**. Panel üçüncüyü açmayı reddeder, yerine "önce X'i kapat" der. `cycle time = WIP / throughput` — WIP'i yarıya indirmek her işin bitiş süresini ~yarıya indirir, throughput artmaz | Little's Law | Çok düşük |
| b | **`koşul → eylem` kapı formatı** | Her kapı `if-then` olarak yeniden yazılır: ~~"Gate A: Linux ≥ 6"~~ → *"Eğer Linux S≥6 olursa, o zaman aynı hafta THM SOC L1 log analizi modülüne başlayacağım."* Kapı açıldığında panel bu cümleyi gösterir | Gollwitzer & Sheeran: hedefe ulaşmada d=0.65, **raydan çıkmayı önlemede d=0.77**. 🚩 2024 meta (642 test) d≈0.27–0.66'ya revize etti, yayın yanlılığı için "extreme evidence" buldu — d=0.65 muhtemelen üst sınır. Yöntem yine de bedava | Çok düşük |
| c | **Anti-metrik eşlemesi** | Her ana metriğin yanına gamelemeyi anlamsızlaştıran kalite metriği (tablo: §7 kural 6) | Goodhart / Campbell / Muller + OKR "anti-KR" | Düşük |
| d | **`C`'nin yeniden yapılandırılması** | `vize` **çıkar** (→ Gate 0). `linkedin` (0–1) → **`ağ` (0–2)**: LinkedIn profili + gerçek temas/referans. Yeni tavan: `cv 2 + ağ 2 + staj 2 + funnel 2 + mülakat 2` = **10**; hedef `C* = 9` (mülakat 1/2 — junior için 10 gereksiz) | Denetim K07 + prior art: Almanya'da referans huni dönüşümünü doğrudan çarpıyor. **Yeni boyut açmadan** ağ sermayesini modele sokar | Düşük |

---

## 5. P2 / sonraya

| # | Kalem | Neden şimdi değil |
|---|---|---|
| P2.1 | **Huni panosu `p₁…p₅` + teşhis** | Kapatacağı bulgu (K09) gerçek, ama huni **Gate D'den sonra** veri üretmeye başlıyor. Şimdi kurmak boş bir pano demek. Log kayıt tipleri (`basvuru`, `funnel`) P0'da hazır — veri toplamaya bugün başlanır, panel `n ≥ 20` başvuruda açılır |
| P2.2 | **Tam Elo (θ, `S`'in yerine)** | ≥30 deneme/alan lazım ve bir görev havuzu gerektiriyor (§8 soru 7). P1.9'un mini sürümü veriyi biriktirmeye bugün başlar |
| P2.3 | **Kalibrasyon paneli `b̂`** | ≥5 `assessment` lazım. Şema P0'da hazır; panel veri gelince açılır |
| P2.4 | **Dilin 5–6 alt becerisi** (`Dil-Öğrenme-Planı.md`) | P1.3 iki alt skorla (konuşma/genel) belgelenmiş darboğazın %80'ini yakalıyor. 5 alan × 2 dil = 10 haftalık girdi alanı — sürtünme bütçesini aşar |
| P2.5 | **CES `ρ` slider** | P1.8 `ρ=0` sabit ship ediyor. Ayarlanabilir yapmak, ayarlamak isteme dürtüsü yaratır (akrasia) |
| P2.6 | **`R_null` karşı-olgusal seri** | Değerli ("sistem ne kazandırdı?") ama ≥8 hafta gerçek seri olmadan görsel gürültü |
| P2.7 | **Ne-olur-ise simülatörü + senaryo karşılaştırma** | Kanıt tavanı ve akrasia horizon kurulmadan simülatör bir "hayal kurma aracı" olur, ölçüm değil. P1 tamamlandıktan sonra güvenli |
| P2.8 | **Ağırlık editörü + alan ekle/çıkar** | Denetim Goodhart #9: "zayıf alanı sil ⇒ +0.3…+0.9 R". Alan kümesi şimdilik **kilitli** kalmalı; editör ancak akrasia horizon (P1.7) çalıştıktan sonra güvenli |
| P2.9 | **Risk defterinin canlı tablosu** | P1'de `Ilerleme-Durum-Modeli.md` içinde **statik tablo** olarak yazılır (7 satır, öncü göstergeleri zaten panelde var). Canlı hâli değer katmıyor |
| P2.10 | **UI/kod temizliği (K19)** | Ölü dal, ulaşılamaz kod, `{"\n"}` render hatası, "eşik" diyakritiği, radar kapsamı (Portfolio radarda yok), dar ekran. Hiçbiri ölçümü bozmuyor |

---

## 6. Kapsam dışı — bilinçli olarak yapılmayacaklar

| Ne | Neden |
|---|---|
| **Tam FSRS-6 (21 parametre eğitimi)** | Parametreler 500M+ tekrarla kalibre edildi; n=1 veriyle kestirilemez. Fonksiyonel formu (P1.5) zaten alındı |
| **BKT / PFA / DKT** | Prior art'ın kendi hükmü: "tek kişilik sistemde aşırı mühendislik". Elo aynı ihtiyacı 2 parametreyle karşılıyor. BKT'de üstelik unutma yok — çürüme ihtiyacına aykırı |
| **HLR öznitelik vektörü `Θ` öğrenimi** | Milyonlarca tekrar gerekir |
| **Reference class forecasting** | "Sıfırdan Almanya junior SOC'a" için savunulabilir bir referans dağılımı **yok**. Uydurulmuş bir dağılım, ölçülmüş iç seriden daha kötü — çünkü dışsal görünüp iç olur. Gerçek veri çıkarsa yeniden değerlendir |
| **Habitica `0.9747^value`** | `Effort(S) = A·S²` ile aynı işi yapıyor, fazlalık |
| **Parasal taahhüt (stickK / Beeminder derail cezası)** | SDT meta-analizi: tamamlamaya bağlı somut ödül/ceza **d = −0.48**; tek net iyileştirme pozitif geri bildirim **d = +0.33**. Belgelenmiş başarısızlık mekanizman *motivasyon düşüşü → çalışamama*; buna ceza eklemek doğrudan kontrendike. Beeminder'ın **gösterim** mekaniği alınıyor (DTD, akrasia, merhametli reset), **parası** alınmıyor |
| **Yeni birinci sınıf boyut: `N` ağ, `B` burnout, `Λ` fırsat yüzeyi, `M` moral** | Her yeni `R` terimi `R`'yi seyreltir **ve bütün geçmiş snapshot'ları yeniden ölçekler** — P0'ın az önce kurduğu tek doğruluk kaynağını bozar. Çözümler: `N` → `C.ağ` alt maddesi (P1.10d) · `B` → TSB (P1.4) · `Λ`, `M` → sayı uydurmadan ölçülemez, düşürüldü |
| **Gamification: rozet, XP, seviye, streak cezası** | SDT crowding-out. Streak **gösterilir ama asla kayıp olarak sunulmaz** |
| **`velocityOverride`** | P0'da kaldırıldı. Geri gelmeyecek. Ölçülen hız ile oynanamaz |
| **Offensive/exploit içeriği** | Tasarım gereği kapsam dışı. `off` boyutunun hedefi **S\*=3** — saldırganı *tespit edebilmek için* anlamak; exploit geliştirme değil |
| **Mutlak tarih emri** | Panel hiçbir yerde "15 Eylül'de X yap" demez; yalnızca "olaydan bu yana T−n gün". **Tek meşru istisna:** Chancenkarte yaş puanı (36 ve 41'de monoton azalıyor, kontrol dışı) |

---

## 7. Guardrail kuralları

Prior art §7'nin belgelenmiş başarısızlık modlarından türetilmiş, **uygulanabilir** kurallar. Bunlar tavsiye değil; paneldeki bir davranış her biriyle test edilebilir olmalı.

### Kural 1 — Günlük etkileşim bütçesi: **≤ 90 saniye. Sert sınır.**

| Ritim | Bütçe | İş |
|---|---:|---|
| Günlük | **≤ 90 sn** | 1× `session` satırı (~60 sn) + en fazla **3** tekrar maddesi |
| Haftalık | **≤ 10 dk** | 1× `snapshot`: skorlar, `κ`, darboğaz, gelecek haftanın **tek** odağı |
| Aylık | **≤ 30 dk** | 2–3 kör test + ağırlık gözden geçirme + Chancenkarte durumu + Goodhart sorusu (kural 10) |

**Zorlama mekanizması:** P1'e eklenen hiçbir kalem **günlük** girdi eklemiyor (kontrol edildi: P1.3 haftalık, P1.1 aylık, P1.4/P1.5/P1.6/P1.7 mevcut kayıtlardan türer, P1.9 mevcut kayda 1 tık ekler). Ve P1.5 tekrar yükünü ~4.5 kat **düşürüyor**. **P1 net olarak sürtünme azaltıyor.** Bundan sonraki her yeni günlük alan için bir eskisi kaldırılmalı.
*Gerekçe:* Epstein et al. CHI 2016 terk nedeni #1 — veri girme maliyeti. Li/Dey/Forlizzi: "collection" maliyeti yüksekse "reflection" hiç olmaz.

### Kural 2 — 2–4 hafta kaybolma protokolü (Geri Dönüş Modu) — **sert kural**

En yeni `session` **> 14 gün** olduğunda otomatik tetiklenir. `session` yazıldığı anda otomatik kapanır. Elle açılıp kapanmaz.

```
1. Kuyruk YIĞILMAZ. Günde en fazla 3 madde, öncelik = argmax( w_i × (1 − ret_i) ).
   (Klasik Anki ölüm sarmalı — 20 vadesi geçmiş madde tek seferde — açıkça engellenir.)
2. R düşer ve panel bunu TEK CÜMLEYLE söyler:
   "R düştü çünkü X gündür pratik kaydı yok. Bu ceza değil, ölçüm. Bugün: 3 madde."
3. ETA GİZLENİR. 2 yeni snapshot birikene kadar: "Kalibrasyon eskidi."
4. Çürümeyle kapanan kapılar "çürüme ile kapandı" etiketiyle gösterilir, "başarısız" değil.
5. Hedefler OTOMATİK DÜŞÜRÜLMEZ. (Akrasia horizon geri dönüş moduna uygulanmaz —
   geri dönüş modu bir görüntü modudur, hedef değişikliği değil.)
6. İlk 7 gün: ekranda TEK metrik — o günün tek görevi. Geri kalan her şey katlanmış.
7. S'ler SIFIRLANMAZ, "borç" birikmez. (Beeminder'ın merhametli reset'i.)
```

*Gerekçe:* Rooksby et al. — lapse birinci sınıf durum olmalı. Epstein #6 — hayat koşulları değişir. Denetim 7.3 — bu senaryo senin belgelenmiş en yüksek olasılıklı riskin.

### Kural 3 — Her negatif sinyalin yanında **tek somut eylem.** Yapısal olarak zorlanır.

Panel, `eylem` alanı boş olan bir kırmızı/turuncu rozet **render edemez**. Eylem yoksa sinyal nötr gri gösterilir.
❌ "SIEM 3/10, hedef 7" · ✅ "SIEM 3/10 → bu hafta: THM 'Splunk Basics' (2 saat)"
*Gerekçe:* Rumination (PUC 2021): *"bir tutarsızlık gösterilip azaltma yolu verilmezse insanlar öz-odaklı uyaranlardan kaçınır."*

### Kural 4 — Varsayılan görünüm **kazanımı** gösterir.

Açılış: son 4 haftanın Δ serisi ve kazanılanlar. Eksikler ayrı, tıklanabilir sekmede.
*Gerekçe:* Epstein #3 — "ilerleme eksikliğimden cesaretim kırıldı" belgelenmiş terk nedeni.

### Kural 5 — Ödül mekaniği **bilgilendirici**, kontrol edici değil.

Streak kırılınca puan düşmez, uyarı çıkmaz, kırmızı yanmaz. Streak bir olgudur, kayıp değil.
✅ "Bu hafta Linux'ta 2 yeni komut seti oturdu; darboğazın SIEM."
❌ "Streak'ini kırdın, −50 puan."
*Gerekçe:* SDT meta-analizi — tamamlamaya bağlı ödül d = −0.48; pozitif bilgilendirici geri bildirim **d = +0.33** (tek net iyileştirme).

### Kural 6 — Her ana metriğin bir **anti-metriği** var. Yan yana gösterilir.

| Metrik | Anti-metrik |
|---|---|
| Tamamlanan lab / oda sayısı | Yazılıp **çalışan** detection sayısı |
| `S` beyan ortalaması | `b̂` sapması **ve** `\|S_beyan − S_Elo\|` |
| Artefakt sayısı | Ortalama `sahiplik q` ("AI yazdı, anlatamıyorum" ⇒ 0) |
| Haftalık saat | Ortalama `kalite` **ve** TSB |
| Gönderilen başvuru sayısı | `p₁` yanıt oranı |
| `R` | Bileşen bazlı `max` ETA (telafi ediciliği ifşa eder) |

*Gerekçe:* Goodhart / Campbell / Muller. Muller'in kendi vurgusu: *"Problem ölçme değil; aşırı ve yersiz ölçme — metrik değil, metrik sabitlenmesi."*

### Kural 7 — WIP limiti: **2 teknik + 1 dil konusu.** Panel üçüncüyü açmaz.

### Kural 8 — Akrasia horizon: hedef/ağırlık **gevşetmeleri 7 gün gecikmeli.** Sıkılaştırma anında.

### Kural 9 — Yazılı **çıkış koşulu** — iki tane.

```
ÇIKIŞ 1 (başarı):  Bir junior SOC / Blue Team teklifi imzalandığında bu sistem arşive kalkar.
                   Arşivlemek başarısızlık değil, tanımlı bitiş.
ÇIKIŞ 2 (uyku):    6 ay boyunca hiç snapshot alınmazsa panel kendini "uykuda" ilan eder
                   ve TEK bir soru sorar: "Devam mı, arşiv mi?" Suçluluk üreten hiçbir metin yok.
```
*Gerekçe:* Epstein #5 — "yeterince öğrendim" bırakması iyi bir sonuç; planlanmış bitiş suçluluğu önler ("happy abandonment"). Quantified Self hareketinin kendi kaderi (prior art §7.6): ayakta kalan kısım **belirli bir soruyu cevaplayan kısa n=1 deneyler**, sonsuza kadar süren genel amaçlı takip değil.

### Kural 10 — Aylık **metrik sabitlenmesi freni.**

Aylık review'de tek zorunlu soru, cevabı `snapshot.not`'a yazılır:
> *"Bu ay `R`'yi yükseltmek için yaptığım şeylerden hangisi bir işveren için değersizdi?"*

---

## 8. Açık sorular — yalnızca senin verebileceğin kararlar

Bunlar bilgi eksiği değil; **karar** eksiği. Her biri bir P1 kalemini bloke ediyor veya ETA'yı 2 kattan fazla değiştiriyor.

| # | Soru | Neyi bloke ediyor | Neden sadece sen cevaplayabilirsin |
|---|---|---|---|
| **1** | **Yaşın kaç?** | P1.1 tamamı | Chancenkarte puanı ≤35 → 2 · 36–40 → 1 · >40 → 0. Bu bilinmeden hiçbir puan hesabı yapılamaz. Ayrıca sistemdeki **tek meşru aciliyet terimi** |
| **2** | **Kısmi denklik (Anerkennung) başvurusunu şimdi başlatıyor musun?** ~15 saat evrak + €100–600 + **3–4 ay bekleme** | Gate 0, P1.1 | Sistemin en yüksek ROI'li tek eylemi (+4 puan, sıfır öğrenme) **ve** 3–4 aylık gecikmesi yüzünden kritik yolda. Bugün başlamazsan ETA'ya doğrudan 3–4 ay ekliyor |
| **3** | **Rota A mı Rota B mi birincil?** (A: Türkiye'den iş teklifi → çalışma vizesi · B: Chancenkarte → Almanya'da yerinde arama) | ETA'nın tamamı, Gate F, dil hedefi | §3.5: Rota A + İngilizce konuşan işveren ⇒ giriş ETA'sı **~10 hafta**. Rota B + Almanca B1 ⇒ **~46 hafta**. **4 kattan fazla fark** ve modelde hiç temsil edilmiyor |
| **4** | **Almanca hedefin B1 mi B2 mi, ve haftada kaç saat ayırabilirsin?** | P1.3, ETA | Toplam ETA'nın **tek** belirleyicisi. 7 h/hf → B1 46 hafta · 14 h/hf → 23 hafta. Siber saatini artırmak bunu değiştirmiyor |
| **5** | **Birikimin ve aylık tasarrufun ne kadar?** | Gate F | Rota B'nin ön koşulu `Runway ≥ 12 ay ≈ €15.000–17.000`. Yetmiyorsa Rota B **tamamen kapalı** ve soru 3 kendiliğinden cevaplanmış olur |
| **6** | **Günde 60–90 saniye log satırı yazacak mısın? Dürüst cevap.** | P1.4, P1.6 ve P0'ın yarısı | `v_ölçülen`, `κ`, çürüme, CTL/ATL, Monte Carlo — hepsi `session` kaydına bağlı. Cevap "hayır"sa P1.4 ve P1.6 **kesilir** ve sistem haftalık-only moduna düşer. Bu utanılacak bir şey değil; yanlış varsayımla kurmak utanılacak şey |
| **7** | **Elo için ~40 görevlik bir havuz kurmayı kabul ediyor musun?** (zorluk etiketli THM/HTB odaları, ~1–2 saat) | P1.9c, P2.2 | Kurmazsan `S`'in bütün geçerlilik yükü öz-beyan + rubrik + aylık kör teste kalır (r ≈ .29 problemi kısmen açık kalır) |
| **8** | **Kör testi kim, ne sıklıkta yapacak?** | `b̂`, P2.3 | `b̂` için ≥5 `assessment` lazım. Mentor oturumlarına gömülmezse hiç olmaz ve Dunning-Kruger düzeltilmez |
| **9** | **Mevcut AI-yazımı projeler: baştan mı yazılacak, yoksa doğrudan SOC lab'a mı geçiliyor?** | `P` boyutu, Gate C | `sahiplik q = 0` ⇒ `P = 0`. Network Scanner/USAC'ı yeniden yazmak ile SOC lab kurmak **aynı saatler için yarışıyor**. Gate C bir SOC lab istiyor; eski projeleri kurtarmak istemiyor |
| **10** | **Çıkış koşulunu kabul ediyor musun?** ("Bir junior teklif imzalandığında bu sistem arşive kalkar.") | §7 kural 9 | Yazılı bitiş olmadan sistem süresiz bir yük hâline gelir — QS hareketinin kendi kaderi |

---

## 9. P1'in kabul kriterleri

Bu düzeltmelerin işe yaradığını nasıl anlarız — ölçülebilir, yanlışlanabilir:

| # | Kriter | Ölçüm |
|---|---|---|
| 1 | Hedef **ulaşılabilir** | Hiçbir alan hedefi 7'yi geçmiyor; panel S=8+ bantlarını "hedefin ötesi" olarak gösteriyor |
| 2 | Darboğaz **doğru** gösteriliyor | Bileşen bazlı `max` ETA, tek `R`-ETA'sından farklı çıkıyor ve farkın kaynağı isimlendirilmiş bir boyut |
| 3 | Hukuki yol **hesaplanabilir** | Chancenkarte puanı tek sayı olarak ekranda; Gate 0 dört durumdan birinde |
| 4 | Sürdürülebilirlik **ölçülüyor** | TSB hesaplanıyor; 2 haftalık boşlukta pozitife geçiyor ve geri dönüş modunu tetikliyor |
| 5 | Tekrar yükü **düştü** | Günlük vadesi gelen madde sayısı ortalaması ≤ 3 |
| 6 | ETA **dürüst** | P85 gösteriliyor; `n<4` iken sayı gösterilmiyor |
| 7 | Sistem **ucuz** | Ölçülen günlük etkileşim ≤ 90 saniye |
| 8 | Kendini kandırma **pahalı** | Hedef gevşetmesi 7 gün gecikiyor; `S` yükseltmesi kanıt olayı istiyor |

---

*Sentez tarihi: 2026-08-27 · Girdiler: `Sistem-Denetimi.md` (19 bulgu) + `Prior-Art-Arastirmasi.md` (83 kaynak) · P0 katmanı paralel uygulanıyor, bu belge onu yeniden spec etmez · Ödünç alınan her formül kaynak adını taşır; prior art'ın doğrulayamadığı her şey 🚩 ile işaretlendi ve bayrak korundu.*
