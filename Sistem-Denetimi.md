# Sistem Denetimi — İlerleme Durum Modeli & Dashboard

**Denetlenen sürüm:** `Ilerleme-Durum-Modeli.md` (281 satır) + `ilerleme-durum-dashboard.canvas.tsx` (1101 satır) + `Durum-Dashboard.md`
**Denetim tipi:** İç tutarlılık, matematiksel sağlamlık, ölçüm geçerliliği, kod denetimi. Dış literatür taraması **yapılmadı** (ayrı iş).
**Denetim ilkesi:** Bu belge seni motive etmek için yazılmadı. Modelin kendi iddialarını kendi verisiyle test eder. Her sayısal iddia yeniden hesaplandı.

---

## 0. Tek cümlelik hüküm

> Sistemin **felsefesi doğru**, **iskeleti sağlam**, ama **ölçüm katmanı boş**: hiçbir sayı kanıta bağlı değil, hiçbir geçmiş kaydı tutulmuyor. Bu iki eksik yüzünden `v` ölçülemiyor, `ETA` yanlışlanamıyor ve `R` yaklaşık 90 saniyelik klavye çalışmasıyla 32'den 73'e çıkarılıp bütün kapılar açılabiliyor.

Yani şu anki hâliyle model **bir ölçüm sistemi değil, bir niyet beyanı arayüzü**. Aşağıdaki her şey bunun ayrıntısı.

---

## 1. Güçlü yönler (kısa — hak edildiği kadar)

| # | Güçlü yön | Neden gerçekten iyi |
|---|---|---|
| G1 | Takvim yerine **state + kapı** | Kayan takvimlerin yarattığı "planın gerisindeyim" borcunu yapısal olarak ortadan kaldırıyor. Doğru mimari karar. |
| G2 | `R` ağırlıkları **tam 1.00** toplanıyor (0.40+0.25+0.20+0.15) | Konveks kombinasyon ⇒ `R ∈ [0,100]` garantili, birimler tutarlı. Çoğu ev yapımı skor bunu beceremez. |
| G3 | ⚪🟡🟢🔵 **kanıt merdiveni** | "Anlatabiliyorum ≠ yapabiliyorum ≠ kanıtlayabiliyorum" ayrımı bu alanın en kritik ayrımı. Fikir doğru — sadece hiçbir yerde zorunlu kılınmamış (bkz. K03). |
| G4 | Kapılar **konjonktif** (AND) ve büyük ölçüde kilitlenmesiz | A→B→D zincirinde gerçek deadlock yok (tek sınır durum: Gate B, bkz. K10). |
| G5 | `P`, `L`, `C` **sınırlı** (bounded) | `min(10,·)` ve alt-madde tavanları taşmayı engelliyor. |
| G6 | Relatif zamanlı tekrar `[T+1,T+3,T+7,T+14,T+30]` | Takvimsizlik felsefesiyle uyumlu **ve** aralıklı tekrarla uyumlu. Doğru fikir, eksik uygulama (K14). |
| G7 | Canvas gerçekten canlı yeniden hesaplıyor + sidecar'da kalıcı | Altyapı çalışıyor; sorun altyapıda değil, modelde. |

Bu liste bilerek kısa. Geri kalanı problem.

---

## 2. Sayısal tutarsızlık kanıtı — modelin kendi örneği kendi formülünden çıkmıyor

Bu bölüm iddia değil, aritmetik. `Ilerleme-Durum-Modeli.md` §4.2'deki ağırlık tablosu + §7'deki snapshot skorları:

| Alan | w | S | w×S |
|---|---:|---:|---:|
| Networking | 1.2 | 6 | 7.2 |
| Linux | 1.3 | 4 | 5.2 |
| Windows/AD | 1.4 | 3 | 4.2 |
| Security Fundamentals | 1.0 | 7 | 7.0 |
| Defensive/SOC | 1.5 | 3 | 4.5 |
| Portfolio | 1.4 | 2 | 2.8 |
| Python | 0.8 | 5 | 4.0 |
| Offensive | 0.7 | 2 | 1.4 |
| Cloud | 0.4 | 2 | 0.8 |
| Crypto | 0.6 | 7 | 4.2 |
| **Toplam** | **10.3** | | **41.3** |

`T = 41.3 / 10.3 = 4.01`

Belge ise **"T ≈ 4.5–5.0"** diyor. Bu skorlardan bu ağırlıklarla 4.8 çıkmıyor — hiçbir makul yeniden ağırlıklandırmayla da çıkmıyor (4.8'e ulaşmak Crypto/SecFund/NetSec'i ağırlaştırmayı gerektirir ki bu, belgenin kendi öncelik sıralamasının tersi).

Sonuç `R` üzerinde:

| Hesap kaynağı | T | P | L | C | **R** |
|---|---:|---:|---:|---:|---:|
| `Ilerleme-Durum-Modeli.md` §7 iddiası | 4.8 | 2 | 3.8 | 2.5 | **36** |
| MD'nin **kendi** ağırlık tablosu + kendi skorları | 4.01 | 2 | 3.8 | 2.5 | **32.4** |
| MD + Network Security de eklenirse (w=0.9, S=7) | 4.25 | 2 | 3.8 | 2.5 | **33.4** |
| **Canvas kodunun gerçekten hesapladığı** (12 alan, Σw=12.3) | **4.14** | 2 | 3.8 | **2** | **32.2** |

`Durum-Dashboard.md` kullanıcıya *"İlk açılışta diagnostic snapshot (R≈36, Gate A kapalı) yüklü gelir"* diyor. **Panel açıldığında ekranda 32.2 yazacak.** Üç belge üç farklı sayı söylüyor ve hiçbiri diğerini doğrulamıyor.

### Alan kümesi de üç yerde farklı

| Kaynak | Alan sayısı | Fark |
|---|---:|---|
| MD §4.2 ağırlık tablosu | 10 | Network Security ve SIEM **yok** |
| MD §7 snapshot tablosu | 11 | Network Security **var** (ağırlığı tanımsız), SIEM yok |
| `canvas.tsx` `DIAGNOSTIC_SKILLS` | 12 | `netsec` (w=0.9) ve `siem` (w=1.1) **kodda uydurulmuş**, MD'de karşılığı yok |

`Σw` bir serbest parametre olduğu için alan eklemek/çıkarmak `T`'yi sessizce yeniden ölçekliyor. Bu bir "senkronizasyon hatası" değil, **tek doğruluk kaynağının olmaması** (K18).

---

## 3. Kritik eksikler — şiddet sırasına göre

Şiddet: 🔴 = sistemin temel iddiası çöküyor · 🟠 = sonucu yanlış yöne saptırıyor · 🟡 = ciddi ama telafi edilebilir

---

### 🔴 K01 — Zaman serisi yok. `v` ve `ETA` yapısal olarak yanlışlanamaz.

**Problem.** Canvas'ın sakladığı her şey **anlık durum**: `skills`, `prod`, `lang`, `career`, `tempo`, `retrieval`, `streak`. Hiçbiri geçmişe eklemiyor. Sidecar dosyasının şu anki tüm içeriği:

```json
{ "prod": { "projects": 0, "writeups": 1, "labs": 1, "socLab": 0 } }
```

Tek bir tarihli kayıt yok.

**Matematiği nasıl bozuyor.** MD §4.7 `v`'yi şöyle tanımlıyor: `v = ΔR / hafta (son 4 haftanın ortalaması)`. Bu tanım **iki farklı zamandaki R değerini gerektirir.** Sistemde ikinci bir R hiç var olmuyor. Dolayısıyla:

- `v` hiçbir zaman ölçülemez → MD §8'in *"İlk 4 hafta `v` kalibre edilir"* vaadi **yerine getirilemez bir vaat**.
- `ETA = (R*−R)/v` ölçülmemiş bir paydaya bölünüyor.
- Gate E'nin şartı (`mülakat ≥1 tur/hafta, son 2 hafta`) bir **pencere üzerinden orandır** — geçmiş olmadan hesaplanamaz. Kod bunu sessizce `career.mulakat >= 1` statik sayısına çevirmiş (K10). **Yani geçmiş eksikliği şimdiden bir spec ihlaline yol açmış.**
- Unutma/çürüme hesaplanamaz (son pratik zamanı yok).
- "Gerçekten ilerledim mi?" sorusunun kanıtı yok — ki `Avrupaya-Gitmek-Mümkün.md`'de senin asıl ihtiyacın olarak tarif edilen şey tam olarak bu ("*Lan, gerçekten bayağı ilerlemişim*" diyebilmek).

**Kavramsal kök neden.** "Takvim yok" kuralı **reçeteye** dairdir ("27 Ağustos'ta DNS yap"), **ölçüme** dair değildir. Bir şeyin *ne zaman olduğunu kaydetmek* takvim değil, veridir. Model bu ikisini karıştırdığı için hız denklemini kurmak için gereken zaman damgalarını bilinçli olarak çöpe atıyor. Takvimsizlik felsefesi ihlal edilmeden tam zaman damgası tutulabilir.

**Düzeltme.** Bölüm 6'daki append-only snapshot log şeması. Sonra:

```
v̂ = (R_t − R_{t−4hafta}) / 4          # ölçülen
σ_v = haftalık ΔR örneklerinin std sapması
ETA = (R* − R) / v̂ ,  CI₆₈ ≈ ETA × (1 ± σ_v/v̂)
```

---

### 🔴 K02 — Kodun `v`'si ölçüm değil tahmin. MD ile kod aynı isme iki farklı büyüklük diyor.

**Problem.** MD: `v = ΔR/hafta` (geçmişten **ölçülen çıktı**). Kod (`expectedVelocity`, satır 202–209):

```ts
effective = (hoursCyber × 0.75 + hoursLang × 0.35) × quality
v = clamp(effective / 17, 0.3, 4.5)
```

Bu, **girdiden ileriye doğru tahmin**. `0.75`, `0.35`, `17` türetilmemiş sihirli sabitler.

**Matematiği nasıl bozuyor.** Döngüsellik: `R`'yi büyük ölçüde kendi verdiğin `S` skorları belirliyor; `v`'yi de kendi girdiğin saat/kalite belirliyor. `ETA` = (kendi verdiğin skorlar) / (kendi planladığın saatler). **Dışarıdan hiçbir şey bu denklemi kısıtlamıyor ⇒ yanlış çıkması imkânsız ⇒ bilimsel anlamda boş.**

**Kodun kendi yorumu da yanlış.** Satır 207 diyor ki: *"~38 effective-h/week → ~2.2 ΔR"*. Diagnostic varsayılanlarıyla test edelim (28 siber + 10 dil, kalite 0.85):

```
(28×0.75 + 10×0.35) × 0.85 = (21 + 3.5) × 0.85 = 20.83
v = 20.83 / 17 = 1.22
```

38 **ham** saat, 20.8 **efektif** saattir; yorum ikisini karıştırıyor. Gerçek çıktı 2.2 değil **1.22**.

**MD tempo tablosuyla çelişki:**

| Tempo | MD §8 beklenen `v` | Kodun aynı girdide ürettiği `v` | Sapma |
|---|---:|---:|---:|
| Minimum (~4 sa/gün ≈ 28 sa/hf) | 1.0–1.5 | ~0.89 | −%29 |
| Normal (~5.5–6 sa/gün ≈ 38 sa/hf) | 1.8–2.5 | **1.22** | **−%43** |
| Agresif (~7 sa/gün ≈ 49 sa/hf, kalite 1.0) | 2.5–3.5 | **1.86** | **−%38** |

Kodun MD'nin "normal" bandına (1.8–2.5) ulaşması için haftada **43–53 saat sadece siber** (≈6–7.5 sa/gün, dil hariç) gerekiyor. **İki hız modeli yaklaşık 2 kat farklı.**

**Düzeltme.** İki büyüklüğü ayır ve **ikisini de göster**:

```
v_tahmin  = f(saat, kalite)          # ileriye dönük plan
v_ölçülen = ΔR/hafta (son 4 hafta)   # geriye dönük gerçek
κ = v_ölçülen / v_tahmin             # kalibrasyon katsayısı
```
Her hafta `κ` ile sabitleri güncelle (`17 → 17/κ`). `κ` panelde görünsün — modelin kendi hata payını göstermesi, kullanıcının modele güvenmesinin tek dürüst yolu (bu, `Avrupaya-Gitmek-Mümkün.md`'de açıkça talep ettiğin şey).

---

### 🔴 K03 — Hiçbir girdi kanıta bağlı değil. R, ~90 saniyede 32'den 73'e çıkıyor ve bütün kapılar açılıyor.

**Problem.** Panelde **her** girdi serbestçe yazılabilen bir sayı. Hiçbiri bir kanıt nesnesine bağlı değil.

**Somut istismar (adım adım, hepsi mevcut arayüzle mümkün):**

| Adım | İşlem | R etkisi |
|---|---|---:|
| 1 | `projects` kutusuna `5` yaz | P: 2 → 10 · **+20 R** |
| 2 | C'nin altı kutusunu maks. yap (2,1,2,2,2,1) | C: 2 → 10 · **+12 R** |
| 3 | DE'yi 2 → 5 seç | L: 3.8 → 5.45 · **+3.3 R** |
| 4 | net→7, linux→6, win→5, siem→5, port→8 seç | T: 4.14 → 5.54 · **+5.6 R** |
| | **Toplam süre: ~90 saniye** | **R: 32.2 → 73.1** |

Bu noktada: Gate A ✅ · Gate B ✅ · Gate C ✅ (`projects≥2 && port≥8` dalı) · Gate D ✅ (R≥65, DE≥5, EN≥6) · Gate E ✅ (`mulakat≥1`). **Beş kapının beşi de açık, öğrenilen hiçbir şey yok.**

**Matematiği nasıl bozuyor.** Bir ölçüm sisteminin değeri, ölçtüğü şeyi taklit etmenin **maliyetiyle** orantılıdır. Burada maliyet sıfır. En ucuz istismar `C`: **puan başına 1.5 R**, yani bir `C` maddesi ≈ 3 puan Defensive/SOC becerisi. Öğrenmenin en pahalı olduğu yerde model en cömert davranıyor.

Marjinal getiri tablosu (mevcut Σw=12.3 ile, `dR/dx`):

| Girdi | R kazancı | Gerçek maliyet | Kanıt gerekiyor mu? |
|---|---:|---|---|
| `C` maddesi +1 | **+1.5** | Bir metin kutusu | ❌ |
| Proje +1 | **+5.0** | Bir metin kutusu | ❌ |
| SOC lab 0→1 | **+5.0** | Bir metin kutusu | ❌ |
| DE +1 puan | +1.1 | ~50–100 saat | ❌ |
| Defensive/SOC S +1 | +0.49 | ~15–30 saat | ❌ |
| Cloud S +1 | +0.13 | ~15–30 saat | ❌ |

**Düzeltme — kanıt tavanı (en yüksek etkili tek düzeltme).**

```
S_etkin,i = min(S_beyan,i , tavan(kanıt_seviyesi,i))

tavan:  kanıt yok           → 5      (🟡 tavanı)
        lab kaydı/komut geçmişi/ekran → 8   (🟢 tavanı)
        public URL (GitHub/write-up) → 10   (🔵)
```
Aynısı `P` için artefakt kaydı, `C` için belge/URL zorunluluğu. Ek olarak **asimetrik mandal**: `S` yalnızca kanıt olayı kaydedildiğinde **artabilir**; düşürme her zaman serbest. Böylece enflasyon pahalı, dürüstlük bedava olur.

---

### 🔴 K04 — Hiç çalışmazsan model ilerlediğini söylüyor. Çürüme hiçbir formülde yok.

**Problem.** `clamp(effective/17, 0.3, 4.5)` — alt sınır **0.3**. Sıfır saat çalış: `clamp(0, 0.3, 4.5) = 0.3`.

**Sonuç.** Hiç çalışmadan `v = 0.3/hafta`, `ETA = (70−32.2)/0.3 = 126 hafta` — **sonlu**. Model "2.5 yılda hiçbir şey yapmadan hedefe varırsın" diyor.

**Ayrıca `S` hiçbir zaman düşmüyor.** Mentor belgesi "Forgetting Curve"i temel ilke ilan ediyor; hiçbir formülde geçmiyor. `[T+1,T+3,T+7,T+14,T+30]` bir **kuyruk**, bir **çürüme modeli değil**. Model yokluğa kör: iki hafta kaybolsan `R` aynı, `v` aynı, `ETA` aynı, tekrar kuyruğu aynı.

**Düzeltme — nicel çürüme (takvimsizlikle tamamen uyumlu, çünkü relatif süre kullanıyor):**

```
τ_i = τ₀ × b^(n_i)                       # n_i = başarılı retrieval sayısı, b≈2, τ₀≈10 gün
ret_i(Δt) = exp(−Δt / τ_i)               # Δt = son pratikten bu yana geçen gün
S_etkin,i = S_i × (0.5 + 0.5 × ret_i)    # taban 0.5 — öğrenilen tamamen kaybolmaz
```

`T` artık `S_etkin` üzerinden hesaplanır. Kazançlar:
- İki hafta boşluk ⇒ `R` **mekanik olarak** düşer. Ceza değil, ölçüm.
- "Hiçbir şey yapmazsam ne olur?" sorusunun gerçek cevabı çıkar: `dR/dt|_{h=0} < 0`.
- `v` alt sınırı `0.3` → **`−0.5`** olmalı (kaldır ve negatife izin ver); `ETA` negatif `v`'de `∞` göstermeli.
- Karşı-olgusal temel çizgi (bkz. M10) doğrudan bu formülden çıkar.

---

### 🟠 K05 — `R` tam telafi edici. Darboğaz (Liebig) terimi yok.

**Problem.** `R` saf ağırlıklı aritmetik ortalama ⇒ boyutlar birbirini **sınırsızca ikame edebiliyor**.

**Karşı örnek.** `T=10, P=10, C=10, L=0` (hiç İngilizce, hiç Almanca):
`R = 100×(0.40 + 0.25 + 0 + 0.15) = 80` → **"Güçlü başvuru profili"** bandı.
Sıfır dille Almanya'da junior SOC. Model 80 diyor.

Gate D bunu yakalar (`DE≥5`), ama **kullanıcının her gün baktığı sayı `R`'dir, gate değil.** Manşet metrik ile kapılar birbirine ters söylüyor.

**Düzeltme — tek parametreli CES ailesi (mevcut formül özel hâli olarak kalır):**

```
R = 100 × ( Σ wₖ · X̂ₖ^ρ )^(1/ρ)     w = (0.40, 0.25, 0.20, 0.15)

ρ = 1    → mevcut lineer model (tam telafi)
ρ → 0    → geometrik ortalama (Cobb-Douglas)
ρ → −∞   → min() (Leontief / Liebig)

Öneri: ρ = 0 (geometrik). Tek knob, ayarlanabilir, matematiksel olarak temiz.
```

Karşılaştırma:

| Senaryo | T̂ | P̂ | L̂ | Ĉ | R (lineer) | R (ρ=0) |
|---|---:|---:|---:|---:|---:|---:|
| Diagnostic | 0.41 | 0.20 | 0.38 | 0.20 | 32.2 | 30.4 |
| Dengeli orta | 0.70 | 0.60 | 0.38 | 0.30 | 55.1 | 52.5 |
| **Dilsiz uzman** | 1.00 | 1.00 | 0.05 | 1.00 | **80.0** | **54.9** |

Geometrik ortalama dengeli profilleri neredeyse hiç cezalandırmıyor ama tek ayaklı profili çökertiyor — istenen davranış tam olarak bu.

Ek olarak **darboğaz göstergesi**: `argminₖ (X̂ₖ / hedefₖ)` sürekli ekranda dursun. "Şu an seni tutan tek şey: **X**."

---

### 🟠 K06 — Boyutlar bağımsız değil. Portfolio iki kez sayılıyor.

**Problem.** `Portfolio` hem `T` içinde bir beceri (w=1.4), hem `P`'nin ana bileşeni. Bir portföy projesi **ikisini birden** yükseltiyor.

Portfolio'nun `R` üzerindeki **gerçek** ağırlığı:

```
0.25 (P kanalı) + 0.40 × (1.4/12.3) (T kanalı) = 0.25 + 0.046 = 0.296 ≈ %30
```

Aynı sorun `Defensive/SOC` (w=1.5) ile `socLab` arasında.

**Matematiği nasıl bozuyor.** `R`'nin ağırlıkları "%40 teknik, %25 üretim" diye ilan ediliyor. Gerçekte üretim ≈ %30, teknik ≈ %36. **İlan edilen ağırlık vektörü yanlış.** Ağırlıklı ortalamanın yorumlanabilirliği, bileşenlerin dik (ortogonal) olmasına dayanır.

**Düzeltme.** İki seçenekten biri:
1. `Portfolio` ve `SOC lab`'ı `T`'den **çıkar**; `P`'nin tekeline bırak. Σw = 12.3 − 1.4 = 10.9. Temiz ve basit. **Önerilen.**
2. Ya da `T` içindeki portfolio ağırlığını kadar `P`'nin katsayısını düşür (0.25 → 0.204). Karmaşık, hata yapmaya açık.

Ne olursa olsun `w` vektörü **tek bir yerde** tanımlanmalı ve panelde düzenlenebilir olmalı (MD "*ağırlıklar piyasa değişince güncellenir*" diyor ama arayüzde salt-okunur: satır 782 `String(s.weight)`).

---

### 🟠 K07 — Vize/hukuki yol ve finansal runway modellenmemiş. İkisi de hard blocker.

**Problem.** Bütün projenin varış koşulu Almanya'da **yasal olarak çalışabilmek**. Modeldeki tek izi: `C.vize (0–1)`, yani `R`'nin **%1.5'i**.

`Almanya-Siber-Güvenlik-Başvurusu.md` bu konuda çözülmemiş bir soru bırakıyor: AYBÜ Bilgisayar Programcılığı için **ZAB Statement of Comparability mi, mesleki Anerkennung mu?** Anabin'de program `Fachschule` olarak görünüyor; bu, akademik `Bachelor` denkliği yolunu kapatabilir. Ayrıca "IT profesyoneli istisnası" **≥2 yıl deneyim** istiyor — sende yok. Bu, `R=100` olsa bile planın sonlanmasını engelleyebilecek bir düğüm. Model bunu 1.5 puanlık bir toplama terimi olarak taşıyor.

Aynı belgede geçen **Chancenkarte geçim kanıtı: aylık €1.091 (2026)** — yani ~12 ay için ~€13.000 + uçuş + depozito + sigorta. **Finans modelde hiç yok.** Runway yetmiyorsa Rota B tamamen kapalı.

**Matematiği nasıl bozuyor.** Katastrofik-binary bir kısıt, yumuşak-lineer bir terim olarak modellenmiş. Toplama terimleri **ikame edilebilir**; hard constraint edilemez. Bu bir ağırlık hatası değil, **fonksiyonel biçim hatası**.

**Düzeltme — çarpan/kapı olarak modelle, toplama terimi olarak değil:**

```
Gate 0 — Hukuki yol (Gate D'nin ÖN KOŞULU)
  ZAB/Anerkennung sorusu yanıtlandı  (hangi belge? → net)
  AND en az 1 uygulanabilir oturum rotası tanımlı (Rota A veya B)
  AND rotanın somut şartları listelendi ve karşılanabilir

Gate F — Finansal runway  (Rota B için zorunlu)
  Runway_ay = (birikim + aylık_tasarruf × kalan_hafta/4.33) / aylık_gider_DE
  Koşul: Runway_ay ≥ 12   (Chancenkarte iş arama süresi)
```

`C.vize`'yi `C`'den çıkar (artık bir kapı) ve boşalan 1 puanı `funnel`'a ver.

---

### 🟠 K08 — `S` için gözlemlenebilir rubrik yok. Kapılar tanımsız eşiklere dayanıyor.

**Problem.** MD'nin `S` hakkında söylediği her şey: *"S_alan = 0..10 (mentor ölçümü + lab + retrieval)"*. Bant tanımları (⚪ 0–1, 🟡 2–5, 🟢 6–8, 🔵 9–10) **jenerik ve alan-bağımsız**.

Ama Gate A'nın koşulu `Networking ≥ 7`. **6 ile 7 arasındaki fark hiçbir yerde tanımlı değil** — ve kapının açılıp açılmamasını tam olarak o fark belirliyor. Bant genişlikleri de eşitsiz (2, 4, 3, 2 değer), yani bant-içi ayrımlar (6 vs 7 vs 8) kapı-kritik ağırlık taşıyor ama sıfır tanıma sahip.

Buna Dunning-Kruger'i ekle: `Almanya-...md`'de kendi ifadenle *"90'a yakın oda çözdüm ama çoğunu anlamadan"* — yani **öz-değerlendirmenin gerçekten saptığı bilinen bir vaka mevcut**. Model bu bilinen sapmayı düzeltmek için hiçbir şey yapmıyor.

**Düzeltme — davranış-çıpalı rubrik (BARS).** Her alan × her kapı eşiği için **tek bir gözlemlenebilir görev**:

| Alan | S=6 kanıtı ("kullanabiliyorum") | S=7 kanıtı (Gate A eşiği) | S=9 kanıtı ("kanıtlıyorum") |
|---|---|---|---|
| Networking | Verilen pcap'te TCP handshake'i yardımsız bulur | Ham capture'da DNS + handshake + TLS başlangıcını 10 dk'da ayırt edip **anlatır**; "google.com yazınca ne oluyor" zincirini kesintisiz kurar | Public write-up + pcap; üçüncü kişi tekrar üretebilir |
| Linux | `find/grep/awk` ile log içinden olay çıkarır | Yetki + servis + log yolunu birleştirip şüpheli girişi kanıtlar | Betikleştirilmiş, README'li repo |
| Windows/AD | Event Viewer'da 4625/4624 ayırt eder | Brute-force'u event log'dan zaman çizelgesiyle kurar | Lab + tespit yazısı |
| SIEM | SPL ile basit arama yazar | Kendi kurduğu alert'i tetikleyip triage eder | Detection + IR raporu |

Kural: **rubrik karşılanmadan skor yükselmez.** Rubrik yazmak sadece yazı işi — maliyeti en düşük, geçerliliği en çok artıran düzeltme.

**Ek: kalibrasyon skoru (Dunning-Kruger'e doğrudan matematik).** Mentor ara ara **kör test** yapar; `sapma = S_öz − S_mentor` loglanır:

```
b̂ = son 5 testin ortalama sapması
S_düzeltilmiş = S_öz − b̂
```
`b̂` panelde görünür. Kendi ölçüm hatanı ölçmek — istediğin türden matematik tam olarak bu.

---

### 🟠 K09 — Başvuru hunisi kaynak belgede var, modelde yok.

**Problem.** `Almanya-Siber-Güvenlik-Başvurusu.md` tam bir dönüşüm hunisi ve **teşhis mantığı** içeriyor:

```
100 başvuru → 30 recruiter → 15 HR → 8 teknik → 3 final → 1 teklif
0 response         ⇒ problem: CV / ilan seçimi / uygunluk
20 HR → 0 teknik   ⇒ problem: teknik anlatım
10 teknik → 0 offer ⇒ problem: mülakat
```

Bu, belgelerin **en ölçülebilir, en yanlışlanabilir, en teşhis edici** parçası. Durum modelinde karşılığı: `C.funnel ∈ {0,1,2}`. Bir tamsayı.

**Matematiği nasıl bozuyor.** Huni oran temelli bir modeldir; onu 0–2 aralığında bir seviye göstergesine indirgemek **bilgiyi yok eder**. Bir tamsayı hangi aşamanın tıkandığını söyleyemez. Üstelik huni, `R`'nin yapamadığı şeyi yapar: **dışsal, kendi beyanına dayanmayan geri bildirim.** Sistemin tek doğal Goodhart panzehiri modelden çıkarılmış.

**Düzeltme.** Huniyi birinci sınıf nesne yap (şema: bölüm 6, `basvuru` + `funnel` kayıtları):

```
p₁ = yanıt/başvuru      p₂ = HR/yanıt      p₃ = teknik/HR
p₄ = final/teknik       p₅ = teklif/final
P(teklif | N başvuru) = 1 − (1 − p₁p₂p₃p₄p₅)^N
Darboğaz = argminᵢ (pᵢ / pᵢ_referans)
```

Bu aynı zamanda **`R`'yi dışarıdan doğrular**: `R=70` diyorsun ama `p₁ = 0.02` ise `R` yanlıştır. İç modeli dış gerçeğe bağlayan tek kanal.

---

### 🟠 K10 — Kapı mantığı kodda spec'ten sapmış; Gate C gevşetilmiş, Gate E boşaltılmış.

| Kapı | MD'nin dediği | Kodun yaptığı (satır) | Sorun |
|---|---|---|---|
| **A** | `net≥7 ∧ linux≥6 ∧ win≥5` | Aynı (244) | ✅ |
| **B** | `A ∧ secfund≥6 ∧ SIEM≥5` | Aynı (251) | ⚠️ Sınır durum: Gate B mini-SOC lab'ı **açıyor**, ama SIEM≥5 istiyor. 5, 🟡 bandının tavanı olduğu için kavramsal çalışmayla ulaşılabilir ⇒ deadlock **yok**. Ama eşik 6'ya çıkarılırsa **dairesel bağımlılık** oluşur (lab için gate, gate için lab). Bu kırılganlık belgelenmemiş. |
| **C** | "En az **2× 🔵** proje (9–10)" | 3 ayrı OR dalı (260–263), üçüncüsü: `projects≥2 && port≥8` | 🔴 **8, sistemin kendi skalasında 🟢'dir, 🔵 değil.** Kod spec'ten gevşek ve bu hiçbir yerde yazmıyor. Ayrıca `proofCount` kanıt seviyesini **proje başına değil global `Portfolio` skorundan** okuyor: `port=9` ise **bütün** projeler tek seferde 🔵 sayılıyor. |
| **D** | `R≥65 ∧ C ∧ DE≥B1_yönü(≥5) ∧ EN≥6` | Aynı (272) | 🟠 `DE≥5`, MD'nin kendi CEFR tablosunda **B1 = 6**'dır. Strateji belgesi ise *"Minimum B1, daha iyisi B2"* diyor. Kapı, stratejinin bir tam seviye altında açılıyor. |
| **E** | `D ∧ mülakat ≥1 tur/hafta (son 2 hafta)` | `gateD && career.mulakat >= 1` (280) | 🔴 **Pencere üzerinden oran → statik öz-beyan sayısına** dönüşmüş. Geçmiş olmadığı için başka türlü yazılamazdı (K01). Ayrıca kapı neredeyse tanım gereği açık: `mulakat` zaten C'nin bir parçası ve 0–2 aralığında. |

**Ek hata — `currentGateLabel` (329–336) yanlış anlatı üretiyor.** Gate C, Gate B'yi gerektirmiyor. Dolayısıyla `[A:kapalı, B:kapalı, C:açık, D:kapalı, E:kapalı]` mümkün. Fonksiyon `open[open.length-1]` = C ve `next` = A alır, ekrana **"C açık · sıradaki: A"** yazar. Kapılar kısmi sıralı ama kod tam sıralı varsayıyor.

**Düzeltme.**
1. `C`'nin üçüncü dalını kaldır ya da MD'ye yaz. Kanıt seviyesini **artefakt başına** taşı (`artifact.seviye`).
2. `DE` eşiğini 6'ya çıkar (B1), Gate D'ye `EN≥7` ekle (teknik mülakat İngilizcesi).
3. Gate E'yi log'dan hesapla: `son_14_gün_mülakat_sayısı ≥ 2`.
4. Gate 0 (hukuki) ve Gate F (finans) ekle (K07).
5. `currentGateLabel`'ı bağımlılık grafiği üzerinden yaz.

---

### 🟠 K11 — Kapılar boolean. Oysa MD'nin kendisi yüzde istiyor.

MD §6, oturum kapanış bloğunda **`Gate ilerlemesi: A/B/C ... %`** yazıyor. Kod `AÇIK`/`KAPALI` döndürüyor. Spec yüzde istiyor, uygulama bit veriyor.

**Neden önemli.** `Avrupaya-Gitmek-Mümkün.md`'de tarif ettiğin başarısızlık döngüsü şu: *hayal → araştırma → engel → umutsuzluk → çalışamama*. Haftalarca "KAPALI" gören bir panel bu döngüyü **besler**. Oysa gerçek durum:

```
π_A = ort( min(1, 6/7), min(1, 4/6), min(1, 3/5) )
    = ort( 0.857, 0.667, 0.600 ) = 0.708  →  Gate A %71
```

"%71, en zayıf halka Windows/AD" ile "KAPALI" aynı bilgiyi taşımıyor. İkincisi hem daha az bilgi hem daha çok zarar.

**Düzeltme.** Kapı başına `π_G ∈ [0,1]` + ilerleme çubuğu + darboğaz etiketi. Boolean `π_G = 1` olarak kalır.

---

### 🟠 K12 — `ETA` nokta tahmin; `v` sabit varsayılıyor; belirsizlik yok.

**Problem 1 — Belirsizlik yok.** Panel `~31 hf` yazıyor. `R`'nin girdileri öz-beyan; hata **korele** (sistematik iyimserlik), bağımsız değil. Bütün `S`'lerde +1 kayma ⇒ `ΔT = +1` ⇒ `ΔR = +4`. `P`, `C` sapmalarıyla birlikte gerçekçi sapma **±5–8 R puanı**, ki `v=1.2`'de **±4–7 hafta** demektir. Bunu tek bir sayı olarak sunmak sahte kesinlik.

**Problem 2 — `v` sabit varsayılıyor.** `ETA = (R*−R)/v`, `v`'nin `R`'den bağımsız olduğunu varsayar. Değil: son 20 `R` puanı (B2 Almanca + gerçek portföy + mülakat tekrarı), ilk 20 puandan **kat kat pahalı**. Model bu yüzden sistematik olarak iyimser.

**Düzeltme.**

```
# Doğru form — integral, sabit bölme değil
ETA = ∫[R → R*] dr / v(r)

# Pratik: bileşen bazlı, çünkü darboğazlar birleşmez, en yavaşı belirler
ETA_k = (X̂ₖ* − X̂ₖ) / vₖ            her boyut için
ETA   = maxₖ ETA_k                   (kapılar konjonktif ⇒ max, ortalama değil)

# Aralık — modelden değil, gözlemlenen haftalık ΔR dağılımından
CI₆₈ = ETA × (1 ± σ_v / v̄)
```

Panelde: **"~24–41 hafta (%68 aralık, n=7 haftalık gözlem)"**. `n<4` iken *"ETA henüz kalibre edilmedi"* yaz — sahte sayı gösterme.

---

### 🟡 K13 — Dil skoru CEFR'i eşit aralıklı sayıyor; `L` tek skalaya çökmüş.

**Problem 1 — Doğrusallık.** `A1:2, A2:4, B1:6, B2:8, C1:9.5` eşit adımlı. CEFR seviyeleri eşit maliyetli değil; kabaca kümülatif rehberli saat: A1 ~90, A2 ~190, B1 ~380, B2 ~590, C1 ~900. Yani:

| Geçiş | Skor kazancı | Yaklaşık saat | Saat başına skor |
|---|---:|---:|---:|
| A1→A2 | +2 | ~100 | 0.020 |
| A2→B1 | +2 | ~190 | 0.011 |
| B1→B2 | +2 | ~210 | 0.010 |
| B2→C1 | +1.5 | ~310 | 0.005 |

Saat başına verim **4 kat** düşüyor. `L`, `R`'nin %20'si olduğu için `ETA` tam da Almancanın en çok gerektiği aşamada (B1→B2) sistematik olarak iyimser çıkıyor.

**Problem 2 — Alt beceriler yok.** `Dil-Öğrenme-Planı.md` altı alt skor öneriyor (speaking / grammar / vocabulary / listening / technical / interview, her biri 0–5). Durum modeli hepsini tek sayıya çöküyor. Oysa senin kendi tarif ettiğin darboğaz **üretken tarafta**: *"Bildiğim şeyi hızlı şekilde dile dökemiyorum."* Tek skalada bu görünmez. Dil planı ile durum modeli **birbirine hiç bağlanmamış**.

**Problem 3 — Görüntüleme yukarı yuvarlıyor.** `cefrFromScore` (143–149): `s<7 → "B1"`, yani **skor 5 ekranda "B1" yazıyor** — MD'nin kendi tablosunda B1 = 6. Gate D `DE≥5` istediği için kapı, ekranda "B1" yazan ama aslında A2+ olan bir seviyede açılıyor.

**Düzeltme.**
```
DE = 0.40·konuşma + 0.20·dinleme + 0.15·teknik_kelime + 0.15·mülakat + 0.10·gramer
CEFR eşleşmesi saat-temelli yeniden çıpalanır: A1:1.5 A2:3 B1:5 B2:7.5 C1:9.5
cefrFromScore eşikleri aşağı yuvarlasın (s<6 → A2)
ETA modeli seviye başına saat maliyetini kullansın (sabit v değil)
```

---

### 🟡 K14 — Retrieval paneli saatsiz. "Bugün ne tekrar edilecek?" sorusunu yapısal olarak cevaplayamıyor.

**Problem.** `RetrievalItem.dueOffset` yorumu *"T+n days since last practice"*. Ama **"şimdi" diye bir kavram yok**: hiçbir şey `dueOffset`'i azaltmıyor, hiçbir zaman damgası yok. `advanceRetrieval` sadece sayıyı çarpıyor.

Sonuçlar:
- Hiçbir madde asla **vadesi gelmiş** olamaz. Tablo hep aynı sırada. Panel **dekoratif**.
- `kolay` maddeler sınırsız büyüyor: 3 → 6 → 12 → 24 → 48 → 96 → ... Tavan yok, yeniden giriş yok.
- Yalnızca **"Tekrar yaptım"** butonu var. **Başarısızlık kaydedilemiyor.** Aralıklı tekrarın tüm bilgisi denemenin *sonucundadır*; burada sonuç kaydedilemiyor ⇒ iyimserlik arayüze gömülmüş.
- `difficulty` maddenin **sabit özelliği**, denemenin sonucu değil. `zor` bir madde ustalaşsan bile sonsuza kadar yarılanıyor (14→7→4→2→1→1→1).

**Düzeltme.**
```
Her maddede: son_pratik_zamanı, n (başarı sayısı), son_sonuç
vade_gün = τ₀ × b^n                         (b: 2.0 kolay / 1.6 orta / 1.3 zor)
gecikme = (şimdi − son_pratik) / vade_gün   ⇒ ≥1 ise vadesi gelmiş
Başarısızlıkta: n → max(0, n−2)             (aralık çöker, madde öne gelir)
Butonlar: [Hatırladım] [Zorlandım] [Hatırlayamadım]
```
Kritik: bu **hâlâ takvimsiz** — mutlak tarih değil, olaydan bu yana geçen süre gösteriliyor.

---

### 🟡 K15 — `D5` hiçbir şeyi beslemiyor ve planlanan saatten hesaplanıyor.

```ts
dimD5 = clamp((hoursCyber/35)*4 + (hoursLang/14)*3 + (streak/14)*3, 0, 10)   // 523–530
```

Üç sorun:
1. `35`, `14`, `14` ve `4/3/3` ağırlıkları MD'de **hiç geçmiyor**. Tamamen kodda uydurulmuş.
2. MD `D5`'i *"haftalık aktif saat, streak, **unutma riski**"* diye tanımlıyor. Kod unutma riskini **atmış**.
3. `hoursCyber` bir **plan alanı**, gerçekleşen değil. `D5` "ne kadar çalışmayı planlıyorum"u ölçüyor, "ne kadar çalıştım"ı değil. `streak` de serbest yazılan bir tamsayı.
4. `D5` `R`'ye girmiyor, hiçbir kapıda geçmiyor. **Ölü metrik.**

**Düzeltme.** `D5`'i log'dan hesapla ve **hıza çarpan** yap (`R`'ye toplama terimi değil — süreklilik yetkinlik değil, yetkinlik kazanma **oranıdır**):

```
uyum = gerçekleşen_saat / planlanan_saat            (son 4 hafta)
tutarlılık = 1 − σ(günlük_saat)/μ(günlük_saat)      (düşük varyans iyi)
D5 = 10 × (0.5·uyum + 0.3·tutarlılık + 0.2·(1 − vadesi_geçmiş_oranı))
v_etkin = v × (0.6 + 0.4 × D5/10)
```

---

### 🟡 K16 — Model insan tarafını hiç içermiyor; oysa kaynak belgede asıl başarısızlık modu bu.

`Avrupaya-Gitmek-Mümkün.md` senin gerçek başarısızlık mekanizmanı açıkça tarif ediyor:

> hayal → araştırma → engel bulma → "yapamayacağım" → motivasyon düşüşü → **çalışamama** → "bak gerçekten olmayacak"

Ve: *"biri bana sürekli ne yapacağımı söylemediği sürece dağılıyorum."*

Model bu döngüyü hiç temsil etmiyor. Daha kötüsü, panel onu **besleyecek** biçimde tasarlanmış:

| Tasarım kararı | Etki |
|---|---|
| Manşet metrik: uzak ve büyük bir sayı (`ETA ~31 hf`) | Uzaklığı her açılışta hatırlatıyor |
| `eta < 20 success, < 35 warning, else danger` (1007) | 40 haftalık ETA **kırmızı** yanıyor. Hedefin gerçekçi olduğu bir tempo "tehlike" olarak boyanıyor. |
| Kapılar boolean | Haftalarca "KAPALI" |
| "Bugün ne yapacağım?" yok | **Panelin çözmediği tek şey, senin asıl problemin** |

Sonuncusu ürün düzeyinde en ağır eleştiri: dashboard **ölçüm** problemini çözüyor, **davranış** problemine hiç dokunmuyor. `needFocus` (532–543) buna en yakın şey ve bir callout'un içine gömülü tek satır.

**Düzeltme.**
```
Enerji/uyku (0–10, günlük tek sayı) → quality katsayısını besler (elle yazılan sayı yerine)
Burnout riski B = f(saat trendi ↑, uyum ↓, streak kırılmaları, enerji ↓)
   → v_etkin = v × (1 − B)          # tükenmişlik yetkinliği düşürmez, HIZI düşürür
Panel hiyerarşisi tersine çevrilir:
   1) BUGÜN TEK İŞ (tek cümle, en üstte, en büyük)
   2) Bu hafta ΔR + aktif kapının %'si
   3) ETA (aralıklı, nötr renk)
   4) Geri kalan her şey katlanabilir bölümlerde
```

---

### 🟡 K17 — Modelin ima ettiği öncelik sırası, strateji belgesiyle çelişiyor.

Marjinal getiri hesabı (`dR/dx`, mevcut Σw=12.3):

| Eylem | ΔR | Kaba saat | **ΔR / saat** |
|---|---:|---:|---:|
| SOC lab kur (proje +1, socLab 0→1) | **+10.0** | ~60 | **0.167** |
| CV'yi bitir (`cv` 0→2) | +3.0 | ~10 | 0.300 |
| LinkedIn (0→1) | +1.5 | ~3 | 0.500 |
| Almanca A1→B1 (DE 2→6) | +4.4 | ~300 | **0.015** |
| Defensive/SOC 3→6 | +1.5 | ~60 | 0.024 |

Model diyor ki: **bir SOC lab, A1→B1 Almancadan 2.3 kat fazla `R` getiriyor ve 5 kat az sürüyor.** Ama `Almanya-Siber-Güvenlik-Başvurusu.md`'nin öncelik tablosu Almanca B1'i **🔴 3. sıraya** koyuyor ve *"Almanya'daki junior pozisyonlarda Almanca seni ciddi şekilde avantajlı yapar"* diyor.

**Bu, ağırlıkların tutarsız olduğu anlamına gelmiyor** — `L`'nin ağırlığı düşük olabilir çünkü Gate D onu zaten zorunlu kılıyor. Ama:
1. Bu gerekçe **hiçbir yerde yazmıyor**; ağırlıklar gerekçesiz sayılar.
2. Panelde marjinal getiri **hiç gösterilmiyor**, dolayısıyla bu bilgi (doğru ya da yanlış) kararlara giremiyor.
3. Kullanıcı `R`'yi maksimize etmeye çalışırsa Almancayı sona bırakır ve **Gate D'de duvara toslar** — çünkü Gate D `DE≥5` istiyor ama `R` bunu ödüllendirmiyor.

**Düzeltme.** Marjinal ROI panelini ekle **ve** kapı-kısıtlı ROI göster:
```
ROI_ham   = ΔR / saat
ROI_etkin = ΔR/saat × (1 + λ · [bir sonraki kapının darboğazı mı?])     λ ≈ 1.5
```
Ayrıca her `wᵢ` yanına bir cümle gerekçe (`Neden` sütunu MD'de var, kodda yok).

---

### 🟡 K18 — Tek doğruluk kaynağı yok; formüller 5 yerde; `resetDiagnostic` geri alınamaz.

**Problem.** `R` formülü şurada yaşıyor: (1) `computeR()`, (2) satır 645 `Code` bloğu, (3) satır 649–651 sayısal döküm, (4) satır 1088 formül kartı, (5) `Ilerleme-Durum-Modeli.md` §4.6. **Beş temsil, sıfır senkronizasyon mekanizması.** Sapma teorik değil, bölüm 2'de ölçüldü.

**Ek — veri kaybı riski.** `resetDiagnostic()` (551–559) onaysız, tek tıkla her şeyi siler. Geçmiş **eklendiğinde** bu buton **telafisi olmayan bir veri kaybı** hâline gelir. Ayrıca sidecar şu an sadece `prod` içeriyor — yani kalıcılık **tembel/kısmî**. Yeri doldurulamaz ölçüm geçmişini tek başına oraya emanet etmek riskli.

**Düzeltme.**
1. Ağırlıklar, eşikler, kapı koşulları **tek bir `MODEL` sabitinden** okunsun; ekrandaki formül metinleri o sabitten **üretilsin** (elle yazılmasın).
2. `Ilerleme-Durum-Modeli.md` **türetilmiş belge** olsun; sayıları koddan üret ya da MD'yi normatif kaynak yapıp kodu ondan besle. İki yönlü elle senkron sürdürülemez.
3. `resetDiagnostic` → onay + **geçmişi asla silmeme** garantisi.
4. Geçmiş **çift yazılsın**: canvas state (canlı) + `Ilerleme-Log.jsonl` (workspace, git'lenebilir, mentor yazabilir). Canvas SDK'sı workspace dosyası **okuyamıyor** (`useCanvasAction` yalnızca `openFile` dispatch edebiliyor), bu yüzden çift yazım bir tercih değil zorunluluk.

---

### 🟡 K19 — Kod kusurları (hızlı liste)

| Satır | Bulgu | Etki |
|---|---|---|
| 195–200 | `rPillTone`: ilk iki dal da `"warning"` döndürüyor | Ölü dal |
| 513–514 | `v > 0 ? … : Infinity` — `v` clamp yüzünden asla ≤0 olamaz | **Ulaşılamaz kod** |
| 170 | `computeC` clamp(…,0,10) — maks. zaten tam 10 | Gereksiz |
| 518–521 | `radarIds` 12 alandan 8'ini sabit kodluyor; **Portfolio (w=1.4, ikinci en ağır) radarda yok**; `id` değişirse sessizce düşer | Yanıltıcı görselleştirme |
| 688–690 | Etiket kırpma: "Security Fundamentals" → `"Security…"`, "SIEM kavram" → `"SIEM kav…"` | Belirsiz eksen |
| 704 | `label: "S=6 esik"` — Türkçe diyakritik eksik ("eşik") | Tutarsız i18n |
| 1078–1091 | Formül kartında `{"\n"}` ile satır atlanmaya çalışılmış — HTML'de `\n` boşluktur | **Render hatası:** üç formül tek satırda birleşecek. `Stack` gerekli. |
| 1010 | "Kalan ΔR" `R > rTarget` iken **negatif** gösterirken ETA `Math.max(0,…)` ile 0 gösteriyor | Tutarsız |
| 782 | Ağırlıklar salt-okunur (`String(s.weight)`) | MD "güncellenir" diyor, arayüz izin vermiyor |
| — | Alan ekleme/çıkarma yok, kanıt/URL alanı yok, not düzenlenemiyor | Model büyüyemez |
| — | `Grid columns={4}`, `maxWidth:1100` sabit | Dar ekranda bozulur |
| MD §9 | "8 networking notu"na atıf — workspace'te **böyle bir dosya yok** (toplam 6 dosya) | Doğrulanamaz referans |
| MD §4.8 | `(kolay ? 2.0 : 1.0 : 0.5)` — geçersiz üçlü operatör sözdizimi | Modelin hiç çalıştırılmadığının işareti |

---

## 4. Goodhart haritası — hangi metrik nasıl oyunlanır

| # | Metrik | İstismar | Kazanç | Sertleştirme |
|---|---|---|---:|---|
| 1 | `C` (6 serbest tamsayı) | Hepsini maks. yaz | **+12 R / 30 sn** | Her madde için belge/URL zorunlu; `vize`'yi kapıya taşı |
| 2 | `P.projects` | Kutuya `5` yaz | **+20 R / 5 sn** | Artefakt kaydı + sahiplik katsayısı (K03) |
| 3 | `P` sayım mantığı | 6 write-up + 4 lab = P tavanı | +20 R | Kalite ağırlıklı doygun formül (aşağıda) |
| 4 | `S` skorları | Yukarı sürükle | +0.13…+0.49 / puan | Kanıt tavanı + asimetrik mandal + kör test |
| 5 | `velocityOverride` | `4.5` yaz | ETA %73 kısalır | Kaldır; yalnızca ölçülen `v` |
| 6 | `quality` | `1.0` yaz | v +%18 | Enerji/uyku log'undan türet |
| 7 | `streak` | İstediğini yaz | D5 ↑ | Log'dan hesapla |
| 8 | "Tekrar yaptım" | Doğrulamasız bas | Kuyruk temizlenir | Sonuç kaydı zorunlu (3 buton) |
| 9 | Alan kümesi / `Σw` | Zayıf alanı sil | +0.3…+0.9 R | Alan kümesi kilitli; değişiklik log'lanır |

**Önerilen `P` (kalite ağırlıklı, doygun, sayımla oyunlanamaz):**

```
P = 10 × (1 − exp(−Σⱼ qⱼ·vⱼ / κ))          κ ≈ 5

qⱼ = sahiplik/anlatılabilirlik ∈ {0, 0.5, 1}     ("AI yazdı, anlatamıyorum" ⇒ 0)
vⱼ = artefakt değeri: SOC lab 3.0 · AD lab 2.5 · VM lab 2.0 · araç 1.5 · write-up 0.5

Örnek: SOC lab + AD lab + araç + 3 write-up, hepsi sahipli
     = 3.0 + 2.5 + 1.5 + 1.5 = 8.5  →  P = 10(1 − e^(−1.7)) = 8.2
Örnek: 5 sığ AI projesi (q=0)      →  P = 0
```

MD zaten *"AI yazdı, anlatamıyorum → proje 0 sayılır"* diyor. Bu kural **sadece düzyazıda** var; ne formülde ne arayüzde. Yukarıdaki `qⱼ` onu matematiğe sokar.

---

## 5. Eklenmesi gereken boyutlar / metrikler

Ayrım kriteri: **Bir şey ancak (a) kendi birikim dinamiği varsa ve (b) hedefi tek başına bloke edebiliyorsa boyuttur.** Aksi hâlde türetilmiş gösterge ya da çarpandır. Yeni boyut eklemek `R`'yi seyreltir; bu yüzden liste bilinçli olarak kısa.

### 5.1 Yeni birinci sınıf boyut / kapı (4 tane)

| Kod | Ad | Neden boyut/kapı | Formül |
|---|---|---|---|
| **Gate 0** | Hukuki yol | Binary-katastrofik. `R=100` olsa bile bloke eder. Toplama terimi olamaz. | `ZAB/Anerkennung sorusu net ∧ ≥1 uygulanabilir rota tanımlı ∧ şartları listelendi` |
| **Gate F** | Finansal runway | Rota B'nin ön koşulu, €13k mertebesinde | `Runway_ay = (birikim + tasarruf×hafta/4.33) / gider_DE ≥ 12` |
| **A** | Uyum / süreklilik (ölçülen) | Kendi dinamiği var; **hızın çarpanı**, R'nin terimi değil | `A = 0.5·uyum + 0.3·tutarlılık + 0.2·(1−vadesi_geçmiş)` ; `v_etkin = v(0.6+0.4A)` |
| **N** | Ağ / referans sermayesi | Bağımsız, yavaş, bileşik birikim; Almanya'da huni dönüşümünü doğrudan çarpar | `N = min(10, 1.5·√(zayıf_bağ) + 3·güçlü_bağ + 2·topluluk_katkısı)` ; `p₁_etkin = p₁·(1 + 0.06N)` |

### 5.2 Türetilmiş gösterge / çarpan (boyut **değil**)

| Kod | Ad | Nereye bağlanır | Formül |
|---|---|---|---|
| **B** | Burnout riski | Hızı düşürür, yetkinliği değil | `B = w₁·norm(saat↑) + w₂·(1−uyum) + w₃·streak_kırılma + w₄·(1−enerji/10)` → `v_etkin = v(1−B)` |
| **E** | Enerji / uyku | `quality`'nin yerine geçer | `quality = 0.4 + 0.6·(E/10)` — elle yazılan sayıyı kaldırır |
| **M** | Motivasyon / moral | Panel hiyerarşisini yönetir; ayrıca gözlem verisi | `M_{t+1} = M_t + α·ΔR_görünür − β·(ETA_algılanan/ETA_ref)` — **tasarım kuralı:** kısa vadeli kazanç uzun vadeli mesafeden daha görünür olmalı |
| **Λ** | Fırsat yüzeyi | Teklif olasılığını besler | `Λ = a·ln(1+başvuru) + b·N + c·public_artefakt` |
| **Huni** | Dönüşüm oranları | `R`'yi **dışarıdan** doğrular | `p₁…p₅` + `darboğaz = argminᵢ(pᵢ/pᵢ_ref)` |
| **κ** | Model kalibrasyonu | Meta-döngü | `κ = v_ölçülen / v_tahmin` — haftalık; sabitleri günceller |
| **b̂** | Öz-değerlendirme sapması | Dunning-Kruger düzeltmesi | `b̂ = ort(S_öz − S_mentor)` son 5 kör test → `S_düzeltilmiş = S_öz − b̂` |
| **R_null** | Karşı-olgusal temel çizgi | Sistemin ürettiği değeri gösterir | Yalnız çürümeyle hesaplanan `R` serisi; `Δ = R − R_null` |

### 5.3 Risk defteri (metrik değil, **kayıt**)

Her risk için: olasılık × etki × azaltma durumu × **öncü gösterge**.

| Risk | Ol. | Etki | Öncü gösterge (panelde izlenebilir) | Azaltma |
|---|---|---|---|---|
| Denklik/vize yolu tıkanır | Orta | **Kritik** | Gate 0 durumu | ZAB/Anerkennung sorusunu **şimdi** netleştir |
| Runway yetmez | Orta | Kritik | `Runway_ay` | Aylık tasarruf hedefi |
| 100 başvuru → 0 yanıt | Orta | Yüksek | `p₁` | CV/ilan eşleşmesi revizyonu |
| Almanca B1'de takılır | **Yüksek** | Yüksek | `DE` haftalık Δ | Konuşma ağırlığını artır |
| 2+ hafta kayıp | **Yüksek** | Orta | Uyum `A`, çürüme | Geri dönüş modu (bkz. 7.3) |
| Portföy AI-sahipli kalır | Orta | Yüksek | `q` ortalaması | Sahiplik testi (anlat-geç) |
| Motivasyon çöküşü | **Yüksek** | Yüksek | `M`, streak kırılma | Panel hiyerarşisi + kısa ufuk |

---

## 6. Zaman serisi / snapshot log şeması **(P0 — en kritik tek eksik)**

**Bulgu doğrulandı:** Sistemde hiçbir geçmiş kaydı yok. Sidecar tek satırlık `prod` içeriyor. `v`, `ETA`, çürüme, Gate E, kalibrasyon — hepsi bu yüzden ya imkânsız ya sahte.

**Konum:** `D:\Projects\Cyber Security Training\Ilerleme-Log.jsonl` — append-only, satır başına bir JSON, git'lenebilir, insan okunabilir, mentor doğrudan yazabilir.
**İkinci kopya:** canvas `useCanvasState("history", [])`. Canvas SDK'sı workspace dosyası okuyamadığı için çift yazım zorunlu; JSONL **normatif kaynak**, canvas state türev.

### 6.1 Kayıt tipleri

```jsonc
// ── session: her çalışma oturumundan sonra (~20 sn) ───────────────────────
{"t":"2026-08-27T19:40:00+03:00","type":"session","dur_min":95,"alan":"net",
 "mod":"lab","kalite":0.9,"enerji":7,
 "kanit":"pcap/wireshark-dns-2026-08-27.pcapng",
 "s_once":6,"s_sonra":6,"not":"DNS query/response ayirt edildi, TLS baslangici karisti"}

// ── retrieval: tekrar denemesi (SONUÇ ZORUNLU) ────────────────────────────
{"t":"2026-08-27T20:15:00+03:00","type":"retrieval","alan":"net","konu":"DNS",
 "sonuc":"basarili","zorluk_hissi":3,"gecikme_gun":3,"n_oncesi":1,"n_sonrasi":2}

// ── snapshot: haftalık review — R'nin ÖLÇÜM NOKTASI ───────────────────────
{"t":"2026-08-31T21:00:00+03:00","type":"snapshot","kaynak":"haftalik",
 "S":{"net":7,"linux":5,"win":3,"secfund":7,"crypto":7,"netsec":7,"siem":3,
      "def":3,"off":2,"py":5,"cloud":2,"port":2},
 "kanit":{"net":"lab","linux":"yok","secfund":"yok"},
 "son_pratik_gun":{"net":0,"linux":4,"win":19,"crypto":22},
 "P":{"artefaktlar":[{"tur":"writeup","q":1.0},{"tur":"lab","q":1.0}]},
 "L":{"de":2,"en":6,"de_konusma":2,"de_dinleme":3},
 "C":{"cv":1,"linkedin":0,"staj":1,"funnel":0,"mulakat":0},
 "saat_gercek":{"siber":22,"dil":6},"saat_plan":{"siber":28,"dil":10},
 "enerji_ort":6.2,"uyku_ort":6.5,
 "hesap":{"T":4.44,"P":2.0,"L":3.8,"C":2.0,"R":33.1},
 "v_olculen":0.95,"v_tahmin_onceki":1.22,"kappa":0.78}

// ── assessment: mentor kör testi (kalibrasyon) ────────────────────────────
{"t":"2026-09-05T18:00:00+03:00","type":"assessment","alan":"net",
 "format":"blind-teachback","oz_skor":7,"mentor_skoru":6,"sapma":1}

// ── artifact: kanıt nesnesi ───────────────────────────────────────────────
{"t":"2026-09-10T12:00:00+03:00","type":"artifact","tur":"soc-lab",
 "url":"https://github.com/…/SOC-Lab","sahiplik":1.0,"anlatilabilir":true,
 "seviye":"green","deger":3.0}

// ── basvuru + funnel: dış gerçeklik kanalı ────────────────────────────────
{"t":"2026-09-20T12:00:00+03:00","type":"basvuru","id":"X-001","sirket":"X",
 "pozisyon":"Junior SOC","kanal":"direkt","dil_sarti":"B1","eslesme":0.82}
{"t":"2026-10-02T12:00:00+03:00","type":"funnel","basvuru_id":"X-001",
 "asama":"hr_gorusme","sonuc":"gecti"}

// ── gate: kapı geçişi (denetim izi) ───────────────────────────────────────
{"t":"2026-10-15T12:00:00+03:00","type":"gate","kapi":"A","durum":"acildi",
 "pi":1.0,"tetikleyen":"linux 5→6"}
```

### 6.2 Log'dan türetilen her şey

| Türetilen | Formül | Bunsuz ne oluyor |
|---|---|---|
| `v_ölçülen` | `(R_t − R_{t−4hf}) / 4` | K01: `v` uydurma |
| `σ_v`, ETA aralığı | Haftalık ΔR örnek std sapması | K12: sahte kesinlik |
| `κ` kalibrasyon | `v_ölçülen / v_tahmin` | Model kendini asla düzeltmez |
| Çürüme | `son_pratik_gun` → `ret_i` | K04: unutma yok |
| Uyum `A` | `saat_gercek / saat_plan` | K15: plan ≠ gerçek |
| `b̂` sapma | `ort(oz_skor − mentor_skoru)` | K08: Dunning-Kruger düzeltilmez |
| Gate E | `son 14 gün mülakat sayısı ≥ 2` | K10: spec ihlali |
| Huni `p₁…p₅` | `funnel` kayıtları | K09: dış doğrulama yok |
| `R_null` | Yalnız çürümeyle simülasyon | Karşı-olgusal yok |
| Boyut bazlı `vₖ` | `ΔX̂ₖ / Δt` | Bileşen ETA'sı ve doğru `max` yok |

### 6.3 Minimum uygulanabilir sürüm

Hepsini bir anda kurma. **`snapshot` (haftalık, 1 satır) + `session` (günlük, 1 satır)** ile başla. Bu ikisi tek başına `v_ölçülen`, `κ`, çürüme ve uyumu açar — yani K01, K02, K04, K15'i çözer. Geri kalan kayıt tipleri sonradan eklenebilir, şema geriye dönük uyumlu.

---

## 7. Süreç entegrasyonu

### 7.1 Mentor oturumu modeli nasıl güncellemeli

**Şu anki durum:** MD §6 güzel bir oturum-kapanış bloğu tanımlıyor (Alan / Önce→Sonra / Seviye / Saat / Unutma riski / Sonraki retrieval / R tahmini / Gate %). Ama **hiçbir yere yazılmıyor.** Sohbette kalıyor ve buharlaşıyor. Döngü kapalı değil, açık.

**Sürtünme problemi:** Bir oturumdan sonra paneli güncellemek için 5 bölümde ~25 sayısal alanı elle düzenlemek gerekiyor. Kendi tarifinle *"dağılan"* bir kullanıcı için bu sürtünme, sistemin ölüm nedeni olur.

**Düzeltme:** Mentor oturum sonunda **tek satır JSONL** üretir, kullanıcı log dosyasına yapıştırır (veya mentor doğrudan yazar). Panel türetir. Kullanıcının elle sayı girmesi gereken tek yer haftalık review.

### 7.2 Minimum ritüel

| Ritim | Süre | İş | Çıktı |
|---|---:|---|---|
| **Günlük** | 60 sn | Oturum sonrası `session` satırı: süre, alan, kalite, enerji, kanıt yolu | 1 JSONL satırı |
| **Haftalık** | 10 dk | `snapshot`: skorları güncelle · `v_ölçülen` vs `v_tahmin` (κ) · darboğaz · gelecek haftanın **tek** odağı | 1 JSONL satırı + tek cümlelik odak |
| **Aylık** | 30 dk | Kör test (2–3 alan, `b̂` güncelle) · ağırlıkları gerçek ilanlara karşı gözden geçir · risk defteri · huni oranları | Ağırlık ve rubrik revizyonu |

Haftalık review, sistemin **meta-döngüsü**. Şu an yok; bu yüzden bu denetimdeki düzeltmeler de zamanla yeniden sapacaktır.

### 7.3 Bozulma senaryoları — model şu an nasıl davranıyor / nasıl davranmalı

| Senaryo | Şu anki davranış | Olması gereken |
|---|---|---|
| 2 hafta hiç çalışmadın | **Hiçbir şey değişmez.** R aynı, v aynı (planlanan saatten), ETA aynı, kuyruk aynı. Model körü. | Çürüme ⇒ R düşer; `v_ölçülen ≈ 0` veya negatif; ETA genişler ve "kalibrasyon eskidi" uyarısı |
| Bir alan 6 hafta el değmedi | S sabit kalır | `ret_i` düşer ⇒ `S_etkin` düşer ⇒ o alan darboğaz olarak öne çıkar |
| 2 hafta sonra geri döndün | 20 vadesi geçmiş madde tek seferde önüne yığılır (klasik Anki ölüm sarmalı) — motivasyon döngün için en kötü senaryo | **Geri dönüş modu:** kuyruğu günde 5 maddeyle sınırla, en yüksek `w×çürüme` çarpımına öncelik ver, hedefi 1 hafta düşür, ETA'yı 1 hafta yeniden kalibre edilene kadar gizle |
| Kendini sürekli yüksek puanlıyorsun | Hiçbir düzeltme yok | `b̂` birikir ⇒ skorlar otomatik düşürülür; kanıt tavanı sert sınır koyar |
| 100 başvuru, 0 yanıt | Model bunu **göremez** | `p₁ ≈ 0` ⇒ huni darboğazı "CV/ilan seçimi" ⇒ `R`'nin kendisi sorgulanır |
| Almanca A2'de takıldı | `L` sabit, `R` yavaşlar ama sebep görünmez | Alt skorlar (konuşma vs dinleme) darboğazı gösterir; DE hızı ayrı izlenir |

---

## 8. Dashboard'a eklenecek özellikler — değer / efor sıralı

Değer: bir bulguyu kapatıyor mu, davranışı değiştiriyor mu. Efor: kaba uygulama yükü.

| # | Özellik | Değer | Efor | Kapattığı |
|---|---|---|---|---|
| 1 | **Geçmiş log + `Haftalık snapshot al` butonu** | ⭐⭐⭐⭐⭐ | Orta | K01 — diğer her şeyin ön koşulu |
| 2 | **Trend grafiği** (`LineChart`: R, T, P, L, C + hedef çizgisi) | ⭐⭐⭐⭐⭐ | **Düşük** | K01 — `LineChart` SDK'da **zaten var, hiç import edilmemiş** |
| 3 | **`v` ölçülen vs tahmin + κ** | ⭐⭐⭐⭐⭐ | Düşük | K02 — modeli yanlışlanabilir yapar |
| 4 | **BUGÜN TEK İŞ paneli** (en üstte, en büyük) | ⭐⭐⭐⭐⭐ | Düşük | K16 — asıl davranış problemi |
| 5 | **Marjinal ROI sıralaması** (ΔR/saat, kapı-kısıtlı) | ⭐⭐⭐⭐⭐ | Orta | K17 |
| 6 | **Kanıt alanı + kanıt tavanı** (her S'te URL/dosya) | ⭐⭐⭐⭐⭐ | Orta | K03 — en büyük Goodhart deliği |
| 7 | **Kapı ilerleme %** + darboğaz etiketi | ⭐⭐⭐⭐ | **Düşük** | K11, K05 |
| 8 | **ETA aralığı** + `n<4` iken gizleme | ⭐⭐⭐⭐ | Düşük | K12 |
| 9 | **Çürüme göstergesi** (alan başına "son pratik: T−n", solan renk) | ⭐⭐⭐⭐ | Orta | K04 |
| 10 | **Ne-olur-ise simülatörü** (geçici slider'lar, "uygula/iptal") | ⭐⭐⭐⭐ | Orta | Öz-gözlem talebi |
| 11 | **Senaryo karşılaştırma** (min/normal/agresif, 3 ETA bandı yan yana) | ⭐⭐⭐⭐ | Orta | MD §8'i canlandırır |
| 12 | **Huni panosu** (`p₁…p₅` + darboğaz teşhisi) | ⭐⭐⭐⭐ | Orta-Yüksek | K09 |
| 13 | **Kalibrasyon paneli** (`b̂`, kör test geçmişi) | ⭐⭐⭐⭐ | Orta | K08 |
| 14 | **Runway + Gate 0/F kartı** | ⭐⭐⭐⭐ | Düşük | K07 |
| 15 | **Karşı-olgusal seri** (`R_null` trend grafiğinde kesikli çizgi) | ⭐⭐⭐ | Düşük | "Sistem ne kazandırdı?" |
| 16 | **Retrieval: 3 sonuç butonu + gerçek vade** | ⭐⭐⭐ | Orta | K14 |
| 17 | **Ağırlık editörü** (+ alan ekle/çıkar, değişiklik log'lanır) | ⭐⭐⭐ | Düşük | K18, MD vaadi |
| 18 | **Risk defteri tablosu** | ⭐⭐⭐ | Düşük | Risk körlüğü |
| 19 | **Radar: 12 alanın hepsi** (Portfolio dahil) | ⭐⭐ | **Çok düşük** | K19 |
| 20 | **UI temizliği**: formül kartı `Stack`, "eşik", reset onayı, ölü kod, ETA renk skalası nötrle | ⭐⭐ | **Çok düşük** | K19, K16 |

**Hızlı kazanç şeridi (birkaç saat, yüksek getiri):** #2, #7, #8, #19, #20 — hepsi düşük efor, hiçbiri şema değişikliği gerektirmiyor.

---

## 9. Öncelikli aksiyon listesi

### 🔴 P0 — Bunlar olmadan sistem ölçüm sistemi değil

| # | Aksiyon | Kapattığı | Kabul kriteri |
|---|---|---|---|
| P0.1 | `Ilerleme-Log.jsonl` + `snapshot`/`session` şeması; canvas'a `history` state + snapshot butonu | K01 | 4 haftalık gerçek kayıt sonrası `v_ölçülen` hesaplanabiliyor |
| P0.2 | `v_ölçülen` \| `v_tahmin` \| `κ` üçlüsünü ayır ve **üçünü de göster**; `velocityOverride`'ı kaldır | K02 | Panelde ölçülen ve tahmin edilen hız yan yana; κ görünür |
| P0.3 | Kanıt tavanı: `S_etkin = min(S_beyan, tavan(kanıt))` + her S'te kanıt alanı + asimetrik mandal | K03 | Kanıtsız hiçbir S 5'i geçemiyor; 90 saniyelik istismar kapanmış |
| P0.4 | Çürüme modeli + `v` alt sınırını `0.3 → −0.5` yap | K04 | Sıfır çalışmayla ETA sonlu **değil**; 2 hafta boşlukta R düşüyor |
| P0.5 | Tek `MODEL` sabiti; ekrandaki formüller ondan üretilsin; MD ↔ TSX uzlaştır; `R≈36` düzeltilsin | K05, K18 | MD'deki her sayı koddan yeniden üretilebiliyor; `Durum-Dashboard.md` gerçek açılış değerini yazıyor |
| P0.6 | `resetDiagnostic` onayı + geçmişi asla silmeme garantisi | K18 | Reset sonrası log bozulmamış |

### 🟠 P1 — Modeli doğru yöne çevirenler

| # | Aksiyon | Kapattığı |
|---|---|---|
| P1.1 | CES/geometrik toplama (`ρ=0`) + darboğaz göstergesi | K05 |
| P1.2 | Portfolio çift sayımını kaldır (`T`'den çıkar, Σw=10.9) | K06 |
| P1.3 | **Gate 0 (hukuki) + Gate F (finans)** ekle; `C.vize`'yi `C`'den çıkar | K07 |
| P1.4 | Her alan × kapı eşiği için **BARS rubriği** yaz (saf yazı işi, en ucuz geçerlilik kazancı) | K08 |
| P1.5 | Kalibrasyon: kör test + `b̂` + `S_düzeltilmiş` | K08 |
| P1.6 | Huni nesnesi + `p₁…p₅` + teşhis | K09 |
| P1.7 | Gate C'nin gizli gevşemesini kaldır; `DE≥6`; Gate E'yi log'dan hesapla; `currentGateLabel`'ı düzelt | K10 |
| P1.8 | Kapı ilerleme yüzdeleri `π_G` | K11 |
| P1.9 | ETA aralığı + bileşen bazlı `ETA_k` + `max` (ortalama değil) | K12 |
| P1.10 | `P`'yi kalite ağırlıklı doygun formüle çevir (`qⱼ`, `vⱼ`, `κ=5`) | K03, Goodhart #2/#3 |
| P1.11 | Dil: alt beceriler + saat-temelli CEFR yeniden çıpalama + `cefrFromScore` aşağı yuvarlama | K13 |
| P1.12 | Haftalık review ritüeli + geri dönüş modu | 7.2, 7.3 |
| P1.13 | Trend grafiği, marjinal ROI paneli, BUGÜN TEK İŞ paneli | K16, K17 |

### 🟡 P2 — Olgunlaştırma

| # | Aksiyon | Kapattığı |
|---|---|---|
| P2.1 | Ağ sermayesi `N` + fırsat yüzeyi `Λ` | 5.1, 5.2 |
| P2.2 | Enerji/uyku → `quality`; burnout `B` → `v_etkin` | K16 |
| P2.3 | `D5`'i log'dan hesapla ve hız çarpanı yap | K15 |
| P2.4 | Risk defteri + öncü göstergeler | 5.3 |
| P2.5 | Karşı-olgusal `R_null` serisi | K04 |
| P2.6 | Retrieval motorunu düzelt (3 sonuç butonu, gerçek vade, `n` düşürme) | K14 |
| P2.7 | Ne-olur-ise simülatörü + senaryo karşılaştırma | 8 |
| P2.8 | Ağırlık editörü + alan ekle/çıkar + değişiklik log'u | K18 |
| P2.9 | UI/kod temizliği (ölü dal, ulaşılamaz kod, `\n` render hatası, "eşik", radar kapsamı, dar ekran) | K19 |

---

## 10. Denetimin kendi kabul kriterleri

Bu düzeltmelerin işe yaradığını nasıl anlarız — ölçülebilir, yanlışlanabilir:

| # | Kriter | Ölçüm |
|---|---|---|
| 1 | Model **yanlışlanabilir** | 4 hafta sonra `v_tahmin` ile `v_ölçülen` karşılaştırılabiliyor ve `κ ≠ 1` çıkabiliyor |
| 2 | Model **oyunlanamaz** | Kanıt eklemeden `R`'yi 5 puandan fazla artırmak mümkün değil |
| 3 | Model **yokluğa duyarlı** | 2 hafta hiç kayıt yoksa `R` ölçülebilir biçimde düşüyor |
| 4 | Model **kendini düzeltiyor** | Haftalık review'de en az bir sabit/ağırlık veriye dayanarak güncelleniyor |
| 5 | Model **dışarıdan doğrulanıyor** | Huni oranları `R`'yi bağımsız olarak teyit ya da tekzip ediyor |
| 6 | Model **tek kaynaklı** | MD'deki her sayı koddan yeniden üretilebiliyor; üç belge aynı `R`'yi söylüyor |
| 7 | Model **davranışı değiştiriyor** | Panel açıldığında "şimdi ne yapmalıyım" sorusu ≤5 saniyede cevaplanıyor |

---

## 11. Kapanış — en sert cümle

Sistemin gerçek durumu şu: **ölçüm gibi görünen bir öz-beyan arayüzü.** İskelet doğru, felsefe doğru, formüller birbirini tutmuyor ve hiçbiri gerçekliğe bağlı değil.

Bunu düzeltmenin yolu daha çok formül eklemek değil. **Üç şey**:

1. **Geçmiş tut** — yoksa hız diye bir şey yok, sadece temenni var.
2. **Skorları kanıta bağla** — yoksa `R` senin ruh hâlini ölçer, yetkinliğini değil.
3. **Modelin kendi hatasını ölç** (`κ`, `b̂`) — yoksa bu denetim 3 ay sonra yeniden yazılır.

Geri kalan her şey optimizasyon.

---

*Denetim tarihi: 2026-08-27 · Denetlenen sürüm: diagnostic sonrası ilk snapshot · Yöntem: iç tutarlılık + aritmetik yeniden üretim + kod okuma. Dış literatür/prior-art taraması bu belgenin kapsamı dışında.*
