# Log Şeması — `Ilerleme-Log.jsonl`

Bu dosya, `Ilerleme-Log.jsonl`'ın **normatif şemasıdır**. Log, ölçüm sisteminin tek zaman-serisi kaynağıdır: `v_ölçülen`, `κ`, çürüme, uyum, Gate E ve huni oranlarının **hepsi** buradan türetilir. Log yoksa bunların hiçbiri hesaplanamaz — sadece tahmin edilir.

> Kaynak denetim: `Sistem-Denetimi.md` §6 (K01). Panel: `ilerleme-durum-dashboard.canvas.tsx`.

---

## 1. Temel kurallar

| Kural | Neden |
|---|---|
| **Append-only.** Satır silinmez, düzenlenmez. | Ölçüm geçmişi yeniden yazılabiliyorsa ölçüm değildir. |
| **Düzeltme = yeni satır.** Yanlış bir snapshot'ı silme; doğrusunu yeni satır olarak yaz. Panel her zaman **en yeni** snapshot'ı kullanır. | Denetim izi korunur. |
| **Satır başına tam bir JSON nesnesi.** Pretty-print yok, satır sonunda virgül yok. | `jq`, `grep`, git diff ile çalışabilsin. |
| **Zaman damgası zorunlu:** `t`, ISO-8601, saat dilimi dâhil (`+03:00`). | Δt olmadan hız ve çürüme yok. |
| **`type` zorunlu.** | Ayrıştırma. |
| Tanınmayan alanlar **yok sayılır**, hata vermez. | Şema geriye dönük uyumlu büyür. |
| Seed / diagnostic satırları `"seed": true` taşır. | Ölçülmüş ilerleme ile başlangıç varsayımı karışmasın. |

**Takvim ihlali değildir.** "Takvim yok" kuralı *reçeteye* dairdir ("27 Ağustos'ta DNS yap"), *ölçüme* değil. Bir şeyin ne zaman olduğunu kaydetmek takvim değil, veridir. Panel hiçbir yerde mutlak tarih **emri** göstermez; yalnızca "olaydan bu yana T−n gün" gösterir.

---

## 2. Kayıt tipleri

Zorunluluk: **●** zorunlu · **○** opsiyonel.

### 2.1 `meta` — şema ve model sabitleri (dosya başı)

Dosyanın ilk satırı. Modelin o andaki bütün sabitlerini dondurur; sabitler değişirse **yeni bir `meta` satırı** yazılır, eskisi silinmez. Böylece geçmiş snapshot'ların hangi modelle hesaplandığı belli olur.

| Alan | Tip | | Açıklama |
|---|---|---|---|
| `t` | string | ● | ISO-8601 |
| `type` | `"meta"` | ● | |
| `sema` | string | ● | Şema sürümü (bu belge: `"1.0"`) |
| `model_surum` | string | ● | Panel `MODEL` sabitinin sürümü |
| `model` | object | ● | Ağırlıklar, kanıt oranları, çürüme/hız sabitleri |
| `not` | string | ○ | |

### 2.2 `session` — çalışma oturumu (günlük, ~60 sn)

| Alan | Tip | | Açıklama |
|---|---|---|---|
| `t` | string | ● | Oturumun **bitiş** zamanı |
| `type` | `"session"` | ● | |
| `dur_min` | number | ● | Süre, dakika. Gerçekleşen saat ve uyum bundan çıkar. |
| `alan` | string | ● | Alan `id`'si (§3) veya `"dil-de"` / `"dil-en"` |
| `mod` | string | ● | `okuma` · `video` · `lab` · `writeup` · `tekrar` · `mulakat` · `basvuru` · `dil` |
| `kalite` | number | ● | 0.3 (pasif izleme) … 1.0 (aktif recall + lab) |
| `enerji` | number | ○ | 0–10 |
| `kanit` | string | ○ | Dosya yolu / URL / komut geçmişi referansı |
| `s_once` / `s_sonra` | number | ○ | Oturum öncesi/sonrası öz-skor |
| `not` | string | ○ | Tek cümle |

**Çürüme çıpası budur.** Bir alanın `son_pratik` zamanı = o alan için en yeni `session` veya `retrieval` satırı. `snapshot` çürümeyi sıfırlamaz (yoksa "snapshot al" tuşuna basarak unutma silinirdi).

### 2.3 `retrieval` — tekrar denemesi · **sonuç zorunlu**

Aralıklı tekrarın bütün bilgisi denemenin *sonucundadır*. Sonucu yazmadan satır geçerli değildir.

| Alan | Tip | | Açıklama |
|---|---|---|---|
| `t` | string | ● | |
| `type` | `"retrieval"` | ● | |
| `alan` | string | ● | Alan `id`'si |
| `konu` | string | ● | Tekrar maddesinin adı |
| `sonuc` | enum | ● | `basarili` · `zorlandim` · `basarisiz` |
| `n_once` / `n_sonra` | number | ○ | Başarı sayacı. `basarili` → +1 · `zorlandim` → sabit · `basarisiz` → `max(0, n−2)` |
| `gecikme_gun` | number | ○ | Vade üzerinden geçen gün (negatifse vadesi gelmemiş) |
| `zorluk_hissi` | number | ○ | 1–5 |

### 2.4 `snapshot` — R'nin ölçüm noktası (haftalık)

`v_ölçülen`'in tek kaynağı. **En az 2 snapshot olmadan hız hesaplanamaz**; panel bu durumda sayı uydurmaz, "ölçülmedi" yazar.

| Alan | Tip | | Açıklama |
|---|---|---|---|
| `t` | string | ● | |
| `type` | `"snapshot"` | ● | |
| `kaynak` | string | ● | `haftalik` · `mentor` · `diagnostic-seed` |
| `seed` | bool | ○ | `true` ise ölçülmüş ilerleme değildir |
| `S` | object | ● | Alan `id` → beyan skoru (0–10) |
| `kanit` | object | ● | Alan `id` → `yok` \| `kayit` \| `public` |
| `S_etkin` | object | ○ | Kanıt tavanı uygulanmış skorlar (türetilmiş, denetim için) |
| `P.artefaktlar` | array | ● | `{id, tur, ad, deger, sahiplik, seviye, kanit}` |
| `L` | object | ● | `{de, en, de_kanit, en_kanit}` |
| `C` | object | ● | `{cv, linkedin, staj, funnel, mulakat, vize, kanit{…}}` |
| `saat_plan` | object | ● | `{siber, dil}` — haftalık plan |
| `saat_gercek` | object \| null | ● | `{siber, dil}` — log'dan; veri yoksa `null` |
| `hesap` | object | ● | `{T, P, L, C, R, T_beyan, P_beyan, L_beyan, C_beyan, R_beyan, kanit_acigi}` |
| `kapilar` | object | ○ | Kapı → `{acik, pi, darbogaz}` |
| `darbogaz_boyut` | string | ○ | `argminₖ(X̂ₖ / hedefₖ)` |
| `v_tahmin` | number \| null | ● | Saat×kalite modelinden |
| `v_olculen` | number \| null | ● | ΔR/hafta; hesaplanamıyorsa **`null`** (0 yazma) |
| `kappa` | number \| null | ● | `v_olculen / v_tahmin`; hesaplanamıyorsa `null` |
| `not` | string | ○ | |

### 2.5 `skor` — skor / kanıt değişikliği (denetim izi) · *şema uzantısı*

Denetimin §6 listesinde yok; **asimetrik mandal** (K03) için eklendi. Bir skoru yükseltmek kanıt olayı gerektirir; bu satır o olayın kaydıdır. Düşürme serbesttir ama yine loglanır.

| Alan | Tip | | Açıklama |
|---|---|---|---|
| `t` | string | ● | |
| `type` | `"skor"` | ● | |
| `alan` | string | ● | Alan `id`'si · `dil.de` · `kariyer.cv` … |
| `s_once` / `s_sonra` | number | ● | |
| `yon` | enum | ● | `artis` · `dusus` · `kanit` |
| `kanit_seviyesi` | enum | ○ | `yok` · `kayit` · `public` |
| `kanit` | string | ○ | URL / dosya yolu |

`skor` satırları çürüme çıpasını **sıfırlamaz** — bir sayıyı düzenlemek pratik değildir.

### 2.6 `assessment` — mentor kör testi (kalibrasyon)

| Alan | Tip | | Açıklama |
|---|---|---|---|
| `t` | string | ● | |
| `type` | `"assessment"` | ● | |
| `alan` | string | ● | |
| `format` | string | ○ | `blind-teachback` · `lab-gozlem` |
| `oz_skor` | number | ● | Öz-değerlendirme |
| `mentor_skoru` | number | ● | |
| `sapma` | number | ● | `oz_skor − mentor_skoru` → `b̂ = son 5 testin ortalaması` |

### 2.7 `artifact` — kanıt nesnesi

`P` (üretim) yalnızca bu kayıtlardan hesaplanır. Tavan kuralı için §4.

| Alan | Tip | | Açıklama |
|---|---|---|---|
| `t` | string | ● | |
| `type` | `"artifact"` | ● | |
| `tur` | enum | ● | `soc-lab` · `ad-lab` · `vm-lab` · `arac` · `writeup` · `lab-egzersizi` |
| `ad` | string | ● | |
| `deger` | number | ● | `v`: 3.0 / 2.5 / 2.0 / 1.5 / 0.5 / 0.5 |
| `sahiplik` | number | ● | `q ∈ {0, 0.5, 1}` — "AI yazdı, anlatamıyorum" ⇒ **0** |
| `seviye` | enum | ● | `yok` · `kayit` · `public` |
| `kanit` | string | ● (seviye ≠ yok ise) | URL veya dosya yolu |

### 2.8 `basvuru` + `funnel` — dış gerçeklik kanalı

`R`'yi dışarıdan doğrulayan tek veri. Kendi beyanına dayanmaz.

```jsonc
{"t":"…","type":"basvuru","id":"X-001","sirket":"X","pozisyon":"Junior SOC","kanal":"direkt","dil_sarti":"B1","eslesme":0.82}
{"t":"…","type":"funnel","basvuru_id":"X-001","asama":"hr_gorusme","sonuc":"gecti"}
```

`asama`: `yanit` · `recruiter` · `hr_gorusme` · `teknik_gorusme` · `final` · `teklif` · `red`
`sonuc`: `gecti` · `kaldi` · `bekliyor`

**Gate E bu kayıtlardan hesaplanır:** son 14 günde `mod:"mulakat"` olan `session` sayısı + mülakat aşamalı `funnel` sayısı ≥ 2.

### 2.9 `gate` — kapı geçişi

```jsonc
{"t":"…","type":"gate","kapi":"A","durum":"acildi","pi":1.0,"tetikleyen":"linux 5→6"}
```

`durum`: `acildi` · `kapandi` (çürüme kapıyı geri kapatabilir — bu bir hata değil, ölçümdür).

---

## 3. Kanonik alan listesi (12 alan · Σw = 12.3)

Bu liste **kilitlidir**. Alan eklemek/çıkarmak `Σw`'yi ve dolayısıyla `T`'yi sessizce yeniden ölçekler (denetim K18 / Goodhart #9). Değişiklik gerekiyorsa yeni bir `meta` satırı yazılır ve gerekçe `not` alanına girer.

| `id` | Ad | `w` |
|---|---|---:|
| `net` | Networking | 1.2 |
| `linux` | Linux | 1.3 |
| `win` | Windows/AD | 1.4 |
| `secfund` | Security Fundamentals | 1.0 |
| `crypto` | Crypto | 0.6 |
| `netsec` | Network Security | 0.9 |
| `siem` | SIEM kavram | 1.1 |
| `def` | Defensive/SOC | 1.5 |
| `off` | Offensive | 0.7 |
| `py` | Python | 0.8 |
| `cloud` | Cloud | 0.4 |
| `port` | Portfolio | 1.4 |

---

## 4. Kanıt tavanı — oyunlanamazlık koşulu

Denetim K03: panelde ~90 saniye yazarak R 32.2 → 73.1 yapılabiliyordu. Kapatan kural tek cümle:

> **Hiçbir boyut, onu destekleyen kanıtın izin verdiğinden yüksek olamaz.**

`oran(yok) = 0.5` · `oran(kayıt) = 0.8` · `oran(public) = 1.0`

| Boyut | Tavan | Kanıtsız ulaşılabilir maksimum |
|---|---|---:|
| `T` | Alan başına `S_etkin = min(S, oran·10)` | 5.0 |
| `P` | `P = maxₜ min( 10(1 − e^(−Σ_(kanıt≥t) q·v / κ)), oran(t)·10 )` | 5.0 |
| `L` | `min(seviye, oran·10)` her dil için | 5.0 |
| `C` | Madde başına `min(beyan, oran·max)`, `Σ maxᵢ = 10` | 5.0 |

`P`'nin iki katmanı var çünkü tek katman yetmiyordu: satır başına `q_etkin = min(sahiplik, oran)` niteliği sınırlar ama **niceliği** sınırlamaz — 20 tane kanıtsız "SOC lab" satırı doygunluk eğrisini yine de tepeye iter. Bu yüzden bir kanıt seviyesinin tavanı **yalnızca o seviye ve üstündeki** artefaktların toplamıyla açılır. `public` artefakt yoksa `P ≤ 8`; hiç kanıt yoksa `P ≤ 5`.

**Sonuç:** dört boyut da 5'te tavan yaptığı için yazarak ulaşılabilir maksimum

```
R_yazarak = 100 × (0.40·0.5 + 0.25·0.5 + 0.20·0.5 + 0.15·0.5) = 50.0
```

Bu sayı bütün kapı eşiklerinin altındadır — Gate A `net ≥ 7`, Gate C `public` artefakt, Gate D `R ≥ 65` ister. Yani **hiçbir kapı yazarak açılamaz**; en fazla "kapalı kapının önünde daha iyi görünmek" mümkündür. Panelin `Girdiler` bölümü bu sayıyı canlı hesaplayıp gösterir, böylece kural gelecekte bozulursa görünür olur.

**Doğrulama.** Model bağımsız olarak yeniden uygulanıp en kötü senaryo çalıştırıldı: 12 alanın hepsi 10, altı kariyer maddesinin hepsi tavanda, iki dil 10, artı **20 adet kanıtsız SOC lab satırı** — hiçbirinde kanıt yok.

| | T | P | L | C | R | Açılan kapı |
|---|---:|---:|---:|---:|---:|---|
| Denetimdeki istismar (eski model) | — | — | — | — | **73.1** | — |
| Aynı girdiler, yeni model | 5.0 | 5.0 | 5.0 | 5.0 | **50.0** | **yok** |
| Karşılaştırma: her şey `public` kanıtlı | 10.0 | 9.1 | 10.0 | 10.0 | **97.7** | hepsi |

Son satır önemli: tavan **dürüst kullanımı cezalandırmıyor**. Kanıtın varsa 97.7'ye çıkabiliyorsun; yoksa 50'de duruyorsun. Fark tam olarak kanıtın kendisi.

Buna **asimetrik mandal** eşlik eder: bir skoru veya kanıt seviyesini **yükseltmek** o alanda dolu bir kanıt referansı ister; **düşürmek** her zaman serbesttir ve `skor` satırı olarak loglanır. Ölçüm sisteminin değeri, ölçtüğü şeyi taklit etmenin maliyetiyle orantılıdır.

**Çürüme bunu tamamlar.** Kanıt tavanı yukarıyı, çürüme aşağıyı tutar: `session`/`retrieval` yazılmadıkça `Δt` büyür, `S_etkin` düşer, `R` geriler. Sıfır efor `v = (0 − 3.7)/9.25 = −0.4 < 0` verir — model hiç çalışmayan bir haftada ilerleme **göstermez**, ETA "durgun" olur.

---

## 5. Log'dan türetilen her şey

| Türetilen | Formül | Gerekli kayıt | Yoksa panel ne yapar |
|---|---|---|---|
| `v_ölçülen` | `(R_t − R_ref) / Δhafta`, `ref` = ≥4 hafta öncesi en yeni snapshot | ≥2 `snapshot` | "ölçülmedi (n=1)" yazar, sayı uydurmaz |
| `σ_v`, ETA aralığı | Ardışık snapshot ΔR/Δhafta örneklerinin std sapması | ≥4 `snapshot` | Plan aralığı gösterir, "ölçülmedi" etiketiyle |
| `κ` | `v_ölçülen / v_tahmin` | ≥2 `snapshot` | `—` |
| Çürüme `ret_i` | `exp(−Δt/τ_i)`, `τ_i = 10·2^{n_i}` | `session` / `retrieval` | Seed snapshot zamanından itibaren sayar |
| Gerçek saat, uyum | `Σ dur_min / 60` (son 7 gün) ÷ plan | `session` | "oturum loglanmadı" |
| Streak | Son `session` olan ardışık gün sayısı | `session` | 0 |
| Kalite (ölçülen) | Son 14 gün `kalite` ortalaması | `session` | Plan değerine düşer |
| `b̂` sapma | `ort(oz_skor − mentor_skoru)`, son 5 | `assessment` | Kalibrasyon paneli kapalı |
| Gate E | Son 14 gün mülakat sayısı ≥ 2 | `session(mod=mulakat)` / `funnel` | 0 → kapalı |
| Huni `p₁…p₅` | `funnel` aşama oranları | `basvuru` + `funnel` | Huni paneli kapalı |
| `R_null` | Yalnız çürümeyle simülasyon | seed snapshot | Her zaman hesaplanır |

---

## 6. Çift yazım (dual-write) — ve SDK sınırı

`Ilerleme-Log.jsonl` **normatif kaynaktır**; panelin `history` state'i türevdir.

Canvas SDK'sı workspace dosyası **okuyamaz ve yazamaz**. `useCanvasAction` yalnızca `openFile`, `openAgent`, `newComposerChat` gönderebilir — dosya yazma API'si yoktur. Bu yüzden denetimin "çift yazım" reçetesi, SDK'nın izin verdiği en yakın biçimde uygulandı:

1. Panelde bir olay olduğunda (snapshot, oturum, tekrar, skor/kanıt değişimi) kayıt hem `history` state'ine eklenir hem **JSONL satırı olarak** "aktarılmayı bekleyenler" listesine düşer.
2. **Log paneli** bekleyen satırları seçilebilir bir metin kutusunda gösterir (Ctrl+A → Ctrl+C) ve şu üç düğmeyi verir:
   - **Log dosyasını aç** → `openFile` ile `Ilerleme-Log.jsonl` açılır, sona yapıştırılır.
   - **Ajana yazdır** → `newComposerChat` ile yeni sohbet açar, satırları ekleme talimatıyla birlikte gönderir. Ajanın dosya yazma yetkisi vardır; **en düşük sürtünmeli yol budur**.
   - **Aktarıldı olarak işaretle** → bekleyen listesini temizler.
3. Bekleyen satır varken panelin üstünde kalıcı bir uyarı durur; sessiz veri kaybı olmaz.

**Sapma kaydı:** Denetim §6'nın çift yazımı otomatik varsayıyordu. SDK bunu imkânsız kılıyor; yukarıdaki üç düğmeli akış en yakın uygulanabilir sürümdür. `history` state'i `.canvas.data.json` sidecar'ında kalıcı olduğu için kayıt anında kaybolmaz — JSONL'a aktarım gecikebilir ama veri durur.

---

## 7. Örnek satırlar

```jsonc
// Günlük oturum
{"t":"2026-09-02T21:10:00+03:00","type":"session","dur_min":95,"alan":"net","mod":"lab",
 "kalite":0.9,"enerji":7,"kanit":"labs/wireshark-dns-01.pcapng",
 "s_once":6,"s_sonra":6,"not":"DNS query/response ayirt edildi, TLS baslangici karisti"}

// Tekrar — sonuc zorunlu
{"t":"2026-09-02T21:40:00+03:00","type":"retrieval","alan":"net","konu":"DNS query/response",
 "sonuc":"basarili","n_once":0,"n_sonra":1,"gecikme_gun":1}

// Kanit eklendi -> skor tavani acildi
{"t":"2026-09-03T10:00:00+03:00","type":"skor","alan":"net","s_once":6,"s_sonra":6,
 "yon":"kanit","kanit_seviyesi":"public","kanit":"https://github.com/<kullanici>/net-labs"}

// Artefakt
{"t":"2026-09-14T12:00:00+03:00","type":"artifact","tur":"soc-lab","ad":"Sysmon+Splunk mini SOC",
 "deger":3.0,"sahiplik":1.0,"seviye":"public","kanit":"https://github.com/<kullanici>/soc-lab"}

// Haftalik snapshot (kisaltilmis)
{"t":"2026-09-06T21:00:00+03:00","type":"snapshot","kaynak":"haftalik",
 "S":{"net":7,"linux":5,"win":3,"secfund":7,"crypto":7,"netsec":7,"siem":3,"def":3,"off":2,"py":5,"cloud":2,"port":2},
 "kanit":{"net":"public","linux":"yok","win":"yok","secfund":"kayit","crypto":"yok","netsec":"yok","siem":"yok","def":"yok","off":"yok","py":"yok","cloud":"yok","port":"yok"},
 "P":{"artefaktlar":[]},"L":{"de":2,"en":6,"de_kanit":"yok","en_kanit":"yok"},
 "C":{"cv":1,"linkedin":0,"staj":1,"funnel":0,"mulakat":0,"vize":0,"kanit":{}},
 "saat_plan":{"siber":28,"dil":10},"saat_gercek":{"siber":19,"dil":4},
 "hesap":{"T":3.98,"P":0.95,"L":3.35,"C":2.00,"R":28.02,"R_beyan":33.1,"kanit_acigi":5.08},
 "v_tahmin":1.84,"v_olculen":1.40,"kappa":0.76,"not":"Ilk gercek olcum noktasi."}
```

---

## 8. Minimum ritüel

| Ritim | Süre | Yazılacak satır |
|---|---:|---|
| **Günlük** | 60 sn | 1× `session` (+ tekrar yaptıysan 1× `retrieval`) |
| **Haftalık** | 10 dk | 1× `snapshot` — `v_ölçülen` / `κ` / darboğaz burada güncellenir |
| **Aylık** | 30 dk | 2–3× `assessment` (kör test) + ağırlık gözden geçirme (gerekirse yeni `meta`) |

Haftalık snapshot sistemin **meta-döngüsüdür**: modelin kendi hatasını (`κ`, `b̂`) ölçen tek an. Atlanırsa model zamanla yeniden sapar.

---

*Şema sürümü 1.0 · `Sistem-Denetimi.md` §6 uygulaması · Kanonik model sürümü 2.0*
