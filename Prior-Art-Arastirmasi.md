# Prior-Art Araştırması — Formül Tabanlı Kişisel Gelişim Modeli

**Araştırma tarihi:** Ağustos 2026
**Kapsam:** Bu doküman *dış literatür ve ürün taraması*dır. Yerel kodu denetlemez.
**Sorulan soru:** "Bunu daha önce kuran oldu mu, ve onlardan ne çalabiliriz?"
**Karşılaştırılan sistem:** Takvim tarihi olmayan, durum (S = 0–10 beceri puanı), hız (velocity), kapı (gate = boolean önkoşul), hazırlık skoru R (0–100), `ETA = (R_hedef − R) / haftalık_hız`, göreli tekrar takvimi T+1/T+3/T+7, 4 boyut (D1 teknik, D2 üretim/portfolyo, D3 dil EN/DE, D4 kariyer).

> **Doğrulama notu:** Her iddianın yanında URL var. Doğrulayamadığım veya kaynakların çeliştiği her şey **§9 Doğrulanamayanlar** bölümünde açıkça işaretlendi. Resmî devlet sayfaları (Chancenkarte), hakemli makaleler ve resmî framework dokümanları önceliklendirildi.

---

## 1. Özet — 5 madde

1. **Prior art VAR, ama parçalı.** Senin modelinin *her bir parçası* akademik veya ticari olarak çözülmüş: beceri durumu tahmini (BKT/IRT/Elo), unutma kuyruğu (SM-2/FSRS-6/HLR), hız+hazırlık skoru (TrainingPeaks CTL/ATL/TSB), taahhüt mekaniği (Beeminder), kapı mantığı (Gollwitzer implementation intentions), olasılıksal ETA (Monte Carlo throughput forecasting), ağırlıklı 0–100 normalizasyonu (RescueTime Productivity Pulse), kesirli olgunluk puanı (SOC-CMM 0–5). **Ama bu parçaları tek bir kariyer hedefinde birleştiren, tarihsiz, kamuya açık bir sistem bulamadım.** Yani kompozisyon özgün; bileşenler değil.

   Bu iddiayı test ettim: taranan "life-OS", "career OS", "skill tracker" Obsidian/Notion şablonları ve GitHub kariyer projeleri (BuildersCodex, DevVault vb.) istisnasız **kontrol listesi + XP** düzeyinde kalıyor. Hiçbirinde hazırlık skoru, hız türevi, ETA tahmini veya göreli tekrar kuyruğu yok. Özellikle **T+1/T+3/T+7 tipi göreli tekrar planının verimlilik araçları tarafında hiçbir karşılığı yok** — bu mekanik yalnızca SRS ekosisteminde (Anki/SuperMemo/FSRS) var ve orada senin uyguladığından çok daha gelişmiş. Yani modelin özgünlüğü gerçek; ama özgün olduğu yerde bile en iyi motor dışarıda hazır duruyor.

2. **Modelin en zayıf üç yeri, literatürün en net konuştuğu yerler.** (a) Kendin verdiğin 0–10 puan, objektif performansla sadece **r ≈ 0.29** korelasyon gösteriyor (Zell & Krizan, 22 meta-analiz sentezi) — yani rubrik çapası olmadan S puanı gürültüdür. (b) **Lineer ETA matematiksel olarak yanlış** ve artık tam sayıyla: üstel öğrenme eğrisi altında **8→9 adımı, 2→3 adımının 5,2 katına mal olur; 9→10 ise sonsuzdur.** ETA ham skor farkı üzerinden değil, **asimptota olan log-mesafe** üzerinden hesaplanmalı ve ölçek 9,5'te kesilmeli (§3.3). (c) **T+1/T+3/T+7 iki kere hatalı**: genişleyen aralık uzun vadeli hatırlama için *eşit aralıklı*dan daha kötü (Karpicke & Roediger 2007), **ve** aralıklar hedef hatırlama ufkuna göre çok sıkı — Cepeda et al. (2008) 1.350+ kişide optimal gap'i 70 günlük ufuk için **~12 gün**, 350 gün için **~27 gün** buldu (§3.13).

3. **Bizden "daha iyi" tek bir sistem yok, ama her boyutta bizden iyi bir uzman var.** FSRS-6 unutma kuyruğunda bizden kesin olarak iyi (500M+ gerçek tekrar üzerinde kalibre). TrainingPeaks'in CTL/ATL/TSB modeli "hız + hazırlık" matematiğinde bizden iyi ve **formülü tarih içermiyor** — yani felsefene bizden daha uygun. Beeminder taahhüt/derailment mekaniğinde bizden iyi. Doğru hamle: **bu motorları taklit etmek yerine ödünç almak.**

   Ek bulgu, kalibrasyon açısından belki en önemlisi: **NICE kendi yeterlik ölçeğini yayımlamıyor — SFIA'nın Levels of Responsibility'sini resmen benimsedi**, ve ortak NICE↔SFIA levelled-roles eşlemesi "Cyber Defense Analyst"ı **SFIA 2–3**'te, Senior'u 4'te, Lead'i 5'te konumlandırıyor. Yani **0–10 ölçeğinde junior hedefi S ≈ 4–6, 9 değil.** `R_target`'ı 9–10 üzerine kurmak, ulaşılamaz bir hedef yaratıp ruminasyon tuzağını kendi elinle kurmak demek (§5.1, §5.3).

4. **Almanya boyutu zaten bir formül ve modele doğrudan gömülebilir.** Chancenkarte (§ 20a/20b AufenthG + Anlage) resmî bir puan sistemidir: eşik + ağırlıklı kriterler, asgari 6, teorik maksimum 16. Bu, D4 (kariyer) boyutu için *uydurma değil, yasal* bir hazırlık skoru verir. Aynı şekilde CEFR "guided learning hours" tabloları D3 (dil) için gerçek, alıntılanabilir bir ETA formülü sağlar.

   **Ama modelin gözden kaçırdığı sert kısıt maaştır.** Chancenkarte yalnızca 12 aylık *arama* iznidir; kalıcı olmak bir maaş eşiğini geçmene bağlı. Junior SOC medyanı **€48.200**, indirimli Blaue Karte eşiğini (**€45.934,20**) geçiyor ama genel eşiği (**€50.700**) geçmiyor; bandın altı (€41.300) hiçbirini geçmiyor. Yani ilk iş gerçekçi olarak darboğaz-meslek/BT hükümlerinden geçer ve **maaş bir çıktı değil, bir kapıdır** (§4.6). İyi haber: § 6 BeschV BT mesleklerinde formel nitelik şartını **tamamen kaldırıyor** ve § 18g Abs. 2 diplomasız BT uzmanına **dil şartı olmadan** Blaue Karte veriyor — kendi kendine öğrenen biri için en açık iki yol bunlar.

5. **En büyük risk teknik değil, davranışsal.** Self-tracking literatürü çok net: insanlar terk ediyor ve terk etme nedenleri öngörülebilir (veri girme maliyeti, ilerleme görmemek, verinin utandırması / "rumination", hayat koşullarının değişmesi). Metrik sabitlenmesi (Goodhart/Campbell/Muller) ve dışsal ödülün içsel motivasyonu ezmesi (SDT, d ≈ −0.24…−0.48) belgelenmiş. Dashboard'a **guardrail** koymadan bu model 3 aylık bir hevesle biter.

   **Ve doğrudan bu artefakt türü hakkında sert bir kanıt var:** 8.745 öğrencilik bir RCT'de **geri bildirim içermeyen dashboard'lar ölçülebilir hiçbir fayda üretmedi**; geri bildirim içerenler doğrulama davranışını artırdı ama **nihai performansı etkilemedi** (§7.6b). Bu, projeyi iptal etmek için değil, tasarımı belirlemek için bir bulgu: **her panel bir eyleme bağlanmak zorunda.** "SIEM: 6.2/10, R=0.71" değil, "SIEM hatırlanabilirliği 0.71 — sıradaki adım lab #14". Öğrenme analitiği alanının kendi öz-eleştirisi de aynı yöne bakıyor: incelenen makalelerin %68'i seçtikleri göstergeler için hiçbir teorik gerekçe vermemiş (Matcha et al. 2019).

---

## 2. Benzer Sistemler Tablosu

| Sistem | Ne yapar | Formülü / mekaniği | Bizim modele katkısı | Link |
|---|---|---|---|---|
| **Beeminder** | Hedefe parasal taahhüt + günlük "yol"dan sapma takibi | "Razor road" (sıfır genişlikli kritik çizgi) + **days-to-derail (DTD) izohatları**: DTD=0 kırmızı, 1 turuncu, 2 mavi, ≥3 yeşil, ≥7 koyu yeşil. Yolu ancak **1 hafta sonrası** için değiştirebilirsin ("akrasia horizon"). Derail olunca yol *sana kadar iner* + 1 hafta düz alan (No Mercy Recommit kapalıysa) | **Kapı/gate yerine "güvenlik tamponu" fikri**: ETA yerine "kaç gün payım var" göstergesi. Ayrıca hedef değiştirmeye 1 hafta gecikme koymak — kendini kandırmayı engeller | [DTD izohatları](https://blog.beeminder.com/isolines/) · [Akrasia horizon](https://blog.beeminder.com/dial/) · [Derail](https://blog.beeminder.com/derail/) |
| **Habitica** | Görevleri RPG mekaniğine bağlar; görev "değeri" zamanla değişir | **Task Value Delta = 0.9747^(mevcut değer)**, değer −47.27 ile +21.27 arasında kırpılır. Yani bir görevi ne kadar çok yaptıysan, tekrar yapmanın getirisi *üstel olarak azalır*. Kaçırılan Daily hasarı = zorluk × 0.9747^değer × (1 − CON/250) | **Azalan getiri mekaniğinin hazır formülü.** S=8'den 9'a çıkmanın S=2'den 3'e çıkmaktan pahalı olmasını modellemek için doğrudan kullanılabilir | [Task Value](https://habitica.fandom.com/wiki/Task_Value) · [Boss damage](https://habitica.fandom.com/wiki/Boss) · [Constitution](https://habitica.fandom.com/wiki/Constitution) |
| **Anki + FSRS-6** | Kart bazlı unutma kuyruğu; kişiye göre öğrenilen parametreler | DSR modeli: **R(t,S) = (1 + factor·t/S)^(−w₂₀)**, `factor = 0.9^(−1/w₂₀) − 1` (R(S,S)=90% olsun diye). 21 parametre. Varsayılan desired retention **%90** | **T+1/T+3/T+7'nin yerine geçecek gerçek motor.** Sabit takvim yerine "R şu an %X'e düştü → sıra sende" | [FSRS-6 algoritması](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm) · [ts-fsrs kaynak](https://github.com/open-spaced-repetition/ts-fsrs/blob/7479e74cf555d7dccb31c5693c431ab7d639ad55/packages/fsrs/src/algorithm.ts) |
| **TrainingPeaks Performance Management Chart** (Banister fitness–fatigue modeli) | Antrenman yükünden "fitness", "fatigue" ve "form/hazırlık" türetir | `CTL = CTL_dün + (TSS_bugün − CTL_dün)/42` · `ATL = ATL_dün + (TSS_bugün − ATL_dün)/7` · **`TSB = CTL − ATL`** | **Modelin çekirdeğinin en olgun karşılığı.** "Hız" tek sayı değil iki zaman ölçeği olmalı; TSB ise senin modelinde hiç olmayan *sürdürülebilirlik* göstergesi. Üstelik formül tarihsiz ve özyinelemeli | [PMC bilimi](https://www.trainingpeaks.com/learn/articles/the-science-of-the-performance-manager/) · [CTL formülü](https://help.trainingpeaks.com/hc/en-us/articles/204071884-Fitness-CTL) · [ATL formülü](https://help.trainingpeaks.com/hc/en-us/articles/204071894-Fatigue-ATL) |
| **Monte Carlo throughput forecasting** (Troy Magennis, Daniel Vacanti) | Nokta tahmin yerine olasılık dağılımı: "%85 olasılıkla X'e kadar" | Geçmiş **throughput** örneklerinden 10.000+ simülasyon; sonuç 50/85/95. persentil. Story point / hız ortalaması *kullanılmaz* | **`ETA = (R_hedef − R)/hız` formülünün doğrudan yerine geçer.** Ortalama hız ile bölmek %50 doğruluk demektir — bir yazı-tura | [Focused Objective](https://www.focusedobjective.com/) · [Flow Forecasting Pocket Guide](https://leanpub.com/ffpg) |
| **stickK** | Taahhüt sözleşmesi + hakem (referee) + para | Kendi iç analizi: hakem+para olmadan başarı **%29**, ikisi varken **%80**. 75.828 hedeflik akademik analiz: başarı finansal+sosyal taahhüdün *konfigürasyonuna* bağlı; kısa vadeli hedefler uzun vadelilerden daha başarılı | Uzun kariyer hedefini **kısa taahhütlere bölmek** ölçülebilir şekilde işe yarıyor | [Sticky Goals (CHI'21)](https://dl.acm.org/doi/fullHtml/10.1145/3411764.3445295) · [HBS](https://www.library.hbs.edu/working-knowledge/the-business-of-behavioral-economics) |
| **Maths Garden / Rekentuin** (Klinkenberg, Straatemeier & van der Maas 2011) | Çocukların aritmetik yeteneğini, ön test olmadan, kullanım sırasında ölçer | Öğrenci **soruya karşı Elo maçı** yapar: `θ_yeni = θ + K(S − E(S))`, `b_yeni = b − K(S − E(S))`. Sorular **ortalama %75 başarı olasılığı** ile örneklenir. 3.648 çocuk, 10 ayda 3.5M+ problem | **S puanını elle vermeyi bırakmanın kanıtlanmış yolu.** Beceri, davranıştan türetilir; "%75 hedef zorluk" ise haftalık görev seçimi için hazır bir kural | [Computers & Education 57(2)](https://www.sciencedirect.com/science/article/abs/pii/S0360131511000418) |
| **Bayesian Knowledge Tracing** (Corbett & Anderson 1995) | Bir becerinin "biliniyor" olasılığını izler | 4 parametreli gizli Markov modeli: `P(L₀), P(T), P(G), P(S)`; Bayes posterior + öğrenme adımı. Operasyonel eşik genelde `P(mastery) > 0.95` | **Gate kararı için doğal mekanizma:** "bu kapı açıldı" = olasılık eşiği aşıldı. Puan yerine olasılık | [JEDM — Properties of the BKT Model](https://files.eric.ed.gov/fulltext/EJ1115329.pdf) |
| **Quantified Self hareketi** | 2007, Gary Wolf + Kevin Kelly (Wired editörleri), "self-knowledge through numbers" | Formül değil, *pratik*: n=1 kişisel deney ("personal science") | **Uyarı hikâyesi.** Hareket zirvede 60k+ üye / 200+ grup iken bugün çoğu meetup kapandı, radikal n=1 deney kültürü kayboldu; Wolf ve küçük bir gönüllü ekip yürütüyor | [quantifiedself.com](https://quantifiedself.com/blog/what-is-the-quantified-self/) · [Wikipedia](https://en.wikipedia.org/wiki/Quantified_self) · [Pioneer communities makalesi](https://doi.org/10.1177/14614448241253766) |
| **Personal Informatics 5 aşama modeli** (Li, Dey, Forlizzi CHI 2010) | Self-tracking sistemlerinin kanonik akademik iskeleti | 5 aşama: **preparation → collection → integration → reflection → action**. Kritik özellik: *barrier'lar sonraki aşamalara kaskad eder* | **Senin dashboard'ın hangi aşamada tıkanacağını önceden söyler.** "Collection" maliyeti yüksekse "reflection" hiç olmaz | [PDF](https://www.ianli.com/publications/2010-ianli-chi-stage-based-model.pdf) |
| **Lived Informatics** (Rooksby et al., CHI 2014) | Yukarıdaki modelin eleştirisi | İnsanlar rasyonel-sıralı davranmaz; takip *hayata gömülüdür*, sosyaldir, ve sık sık "documentary tracking" (belgeleme) amaçlıdır — hedef odaklı değil | Modelin "tek doğru akış" varsayımını gevşet; lapse (ara verme) birinci sınıf durum olmalı | [PDF](https://johnrooksby.org/papers/livedinformatics.pdf) |
| **Theory of Constraints** (Goldratt) / **Liebig'in minimum yasası** | Sistem çıktısı en dar boğaz tarafından belirlenir | 5 odak adımı: Identify → Exploit → Subordinate → Elevate → Repeat. Darboğaz *yok edilemez, sadece taşınır* | **R skorunu ağırlıklı ortalama yerine minimum/darboğaz temelli hesaplama gerekçesi.** Networking=9 ama SIEM=2 ise R yüksek çıkmamalı | [Wikipedia](https://en.wikipedia.org/wiki/Theory_of_constraints) · [Lean Production](https://www.leanproduction.com/theory-of-constraints/) |
| **Little's Law / Kanban akış metrikleri** | WIP, cycle time, throughput arasındaki cebirsel bağ | **L = λW**, akış formu: `ortalama cycle time = ortalama WIP / ortalama throughput`. Yalnızca sistem *kararlı* iken (arrivals ≈ departures) geçerli | Aynı anda kaç konu "açık" olduğunu sınırlamak için matematiksel gerekçe. WIP limiti = ETA'yı kısaltmanın en direkt yolu | [Kanban & WIP](https://whichframework.org/frameworks/kanban.html) · [Little's Law notu](https://jonmoshier.com/notes/littles-law/) |
| **Reference Class Forecasting** (Kahneman/Tversky → Flyvbjerg) | Planlama yanlılığına karşı "outside view" | Benzer geçmiş vakaların *dağılımından* uplift uygula; 80. persentil bütçe gibi | ETA'yı kendi içsel hissine göre değil, "benzer kişiler junior SOC'a kaç ayda girdi" dağılımına göre kur | [Wikipedia](https://en.wikipedia.org/wiki/Reference_class_forecasting) · [Flyvbjerg PDF](https://ktproject.ca/wp-content/uploads/2026/03/From-Nobel-Prize-to-Project-Management-Getting-Risks-Right.pdf) |
| **Implementation intentions** (Gollwitzer) | "Eğer X olursa, o zaman Y yapacağım" planları | Meta-analiz (94 çalışma, 8.000+ katılımcı): **d = 0.65**. Başlamama sorununda d=0.61, *raydan çıkmayı önlemede* d=0.77. 2024 güncel meta (642 test): d = 0.27–0.66, if-then formatı ve prova edilmiş planlar daha güçlü | **Senin "gate" kavramının akademik karşılığı bu.** Gate'i sadece koşul değil, *if-then eylem planı* olarak yaz | [Gollwitzer & Sheeran özeti](https://kops.uni-konstanz.de/server/api/core/bitstreams/c5d2b466-4ee4-4fb1-a22c-867d5f86d86e/content) · [2024 meta](https://doi.org/10.1080/10463283.2024.2334563) |
| **RescueTime Productivity Pulse** | Karışık etkinlik verisini tek bir 0–100 skoruna indirir | `Pulse = (((çok_dikkat_dağıtıcı×0)+(dikkat_dağıtıcı×1)+(nötr×2)+(verimli×3)+(çok_verimli×4)) / (toplam_süre×4)) × 100` | **Bulduğum en temiz ağırlıklı normalizasyon şablonu.** R'yi 0–100'e indirirken formülün *aynı yapısı* kullanılabilir: kategori ağırlığı × süre / maksimum olası. Şeffaf, açıklanabilir, tek satır | [RescueTime — Productivity Pulse](https://www.rescuetime.com/rescuetime-productivity-pulse) |
| **Google OKR puanlama** | Hedefleri 0.0–1.0 arasında puanlar | Tasarım gereği **0.6–0.7 "iyi"dir**; sürekli 1.0 almak *yetersiz hırs* göstergesi sayılır ve hedeflerin yeniden kurulmasını gerektirir | **R'nin ölçeğini yeniden yorumla.** Eğer 100/100 "başarı" ise model her zaman başarısızlık gösterir. **R ≈ 70 "yolunda" olacak şekilde kalibre et** — bu hem OKR pratiğine hem §5.3'teki SFIA 2–3 hedefine uyuyor | [Google re:Work — OKR playbook](https://rework.withgoogle.com/en/guides/set-goals-with-okrs) |
| **Tability — Net Confidence Score** | Hedef portföyünün sağlığını tek sayıda özetler | `NCS = (%yolunda) − (%yolundan_sapmış)`, aralık **−100…+100** | **R'ye dik ikinci bir eksen.** "Ne kadar ilerledim" (R) ile "kaç boyutta sapıyorum" (NCS) farklı sorular; NCS düşerken R yükselebilir ve bu tam olarak görülmesi gereken şey | [Tability — Net Confidence Score](https://www.tability.io/odt/articles/what-is-a-net-confidence-score) |
| **Perdoo Health Score** | Hedef *sisteminin* hijyenini, hedeflerin ilerlemesinden **ayrı** ölçer | Güncellik, sahiplik, hedeflerin iyi yazılmış olması gibi süreç kriterleri ayrı puanlanır | **Meta-metrik fikri: modelin kendi bakımını da ölç.** "3 gündür veri girmedim" bir beceri kaybı değil ama sistem çöküşünün en erken sinyali — §7.1'deki terk etme riskinin doğrudan göstergesi | [Perdoo — Health Score](https://www.perdoo.com/resources/okr-health-score) |
| **Oura Readiness Score** | Uyku/aktivite verisinden günlük 0–100 hazırlık | Katkı maddeleri **14 günlük ağırlıklı ortalamaya karşı 2 aylık kişisel baseline** ile karşılaştırılır — mutlak eşik değil, **kişinin kendi normali** | Hazırlık skorunu mutlak değil **kendi baseline'ına göre** tanımlama gerekçesi. §3.11'deki CTL/ATL ile aynı aileden, ama "normal"i kişiselleştiriyor | [Oura — Readiness](https://ouraring.com/blog/readiness-score/) |
| **Exist.io** | Çoklu veri kaynağı arasında korelasyon arar | Bir istatistik gösterilmeden önce **en az 3 hafta boş olmayan veri** şart; korelasyonlar **p < 0.05** ile filtrelenip 1–5 yıldız güven derecesi verilir | **En değerli guardrail:** yetersiz veriyle skor/korelasyon gösterme. Dashboard "3 haftadan az veri var, henüz trend gösteremem" demeyi öğrenmeli — yoksa gürültüyü sinyal sanarsın | [Exist.io — correlations](https://exist.io/blog/correlations/) |
| **SOC-CMM** (v2.4, Q4 2025) | SOC olgunluğunu 5 domain × 27 aspect üzerinden ölçer | Olgunluk **0–5 sürekli ölçek** (ara değerler *açıkça izinli*): 0 Non-existent · 1 Initial "ad-hoc" · 2 Managed "somewhat structured, but not consistently" · 3 Defined "structured and consistently performed" · 4 Quantitatively managed "measured for effectiveness and efficiency" · 5 Optimizing. Technology & Services ayrıca **0–3 capability** ölçeğiyle | **Kesirli puana resmî meşruiyet.** SOC-CMM 3.5 gibi değerlere açıkça izin veriyor — senin 0–10 ölçeğinin sürekli olması bir zaafiyet değil, kabul görmüş bir tasarım. Ayrıca **seviye 4'ün tanımı "ölçülüyor"** — yani "ölçüyor olmak" bir olgunluk basamağıdır, bu modelin kendisini haklı çıkarır | [soc-cmm.com](https://www.soc-cmm.com/) |
| **Detection Engineering Maturity Matrix** (Kyle Bailey) | Tespit mühendisliğini 4 kategori × 3 seviye ölçer | Kategoriler **People / Process / Technology / Detection**, seviyeler **Defined → Managed → Optimized**. *Defined*: "Detection quality depends greatly on the understanding of the individual performing the work. No backlog or prioritization of known gaps. Little to no detection related metrics." *Optimized*: "KPI's are well defined to include applicable MITRE ATT&CK coverage per environment" | S=8–10 hücreleri için hazır, alıntılanabilir üst-seviye tanımları (§5.4'te kullanıldı) | [detectionengineering.io](http://detectionengineering.io/) · [GitHub](https://github.com/k-bailey/detection-engineering-maturity-matrix) |
| **Amplenote Task Score** | Görev önceliğini otomatik hesaplar | Skor **takvim yaşına göre değil, *maruz kalmaya* göre** büyür: not her açıldığında artar | İlginç alternatif: "en son ne zaman çalıştım" yerine **"kaç kez karşıma çıktı da atladım"**. Erteleme davranışını doğrudan görünür kılar | [Amplenote — Task Score](https://www.amplenote.com/help/task_score_dimensions) |

---

## 3. Akademik Modeller — gerçek denklemlerle

### 3.1 Genişleyen vs. eşit aralıklı tekrar — **T+1/T+3/T+7'ye doğrudan itiraz**

Bu, senin modelinde en kolay düzeltilebilen ve en yüksek etkili bulgu.

**Karpicke & Roediger (2007), JEP:LMC 33(4):704** — kelime çiftleriyle üç deney:
- Massed (0-0-0), **expanding (1-5-9)**, **equally spaced (5-5-5)** takvimleri karşılaştırıldı.
- 10 dakika sonra: expanding daha iyi (Landauer & Bjork 1978'i replike ediyor).
- **2 gün sonra: eşit aralıklı (5-5-5) daha iyi.**
- Deney 3'ün sonucu kritik: uzun vadeli hatırlamayı belirleyen şey **ilk tekrarın geciktirilmesi**, sonraki aralıkların genişleyip genişlememesi değil.

Karpicke & Roediger (2010, *Memory & Cognition* 38(1):116) metin materyalinde tekrarladı: tekrarlı test tek testten iyi, geri bildirimli test geri bildirimsizden iyi, **ama expanding ile equally spaced arasında fark yok**.

**Bizim modele çevirisi:** `T+1 / T+3 / T+7` şemasındaki `T+1` (ertesi gün) muhtemelen *çok erken* — retrieval kolay olduğu için öğrenme kazancı düşük. Literatüre uygun minimal değişiklik: ilk tekrarı geciktir (T+2 veya T+3) ve sonrasını **eşit aralıklı** yap (örn. T+3 / T+6 / T+9), ya da doğrudan FSRS-6'ya devret ve aralığı R (retrievability) hesaplasın.

Kaynaklar: [Karpicke & Roediger 2007 PDF](https://learninglab.psych.purdue.edu/downloads/2007/2007_Karpicke_Roediger_JEPLMC.pdf) · [2010 metin çalışması](https://doi.org/10.3758/mc.38.1.116) · [Storm, Bjork & Storm 2010 karşı-argüman](https://sites.lifesci.ucla.edu/psych-bjorklab/wp-content/uploads/sites/13/2016/07/Storm_Bjork_Storm_2010.pdf)

**Devam:** Bu bulgunun ampirik tamamlayıcısı — optimal aralığın hedef hatırlama ufkuna nasıl bağlı olduğu — §3.13'te (Cepeda et al. 2008) sayısal tabloyla veriliyor. İkisi birlikte T+1/T+3/T+7'yi hem *şekil* hem *ölçek* olarak çürütüyor.

> Not: Storm, Bjork & Storm (2010) tam tersini savunmuyor ama nüans ekliyor: expanding'in avantajı, ilk testin *başarısız olma riskinin* düşük olduğu durumlarda ortaya çıkabilir. Yani "kesin hüküm" değil; ama T+1 ile başlamanın uzun vade için optimal olmadığı konusunda literatür hemfikir.

### 3.2 FSRS-6 (2026 itibarıyla güncel sürüm) — unutma kuyruğunun hazır motoru

**Unutma eğrisi (power form, FSRS-5'ten beri):**

```
R(t, S) = (1 + factor · t/S)^(−w₂₀)
factor  = 0.9^(−1/w₂₀) − 1        // R(S,S) = 0.90 olacak şekilde
```

- `R` = hatırlama olasılığı (retrievability, 0–1)
- `t` = son tekrardan beri geçen gün
- `S` = stability — "R'nin %100'den %90'a düşmesi için gereken gün sayısı"
- `w₂₀` = eğitilebilir decay parametresi

**Aynı gün tekrar sonrası stability güncellemesi (FSRS-6'da değişti):**

```
S'(S, G) = S · e^(w₁₇·(G − 3 + w₁₈)) · S^(−w₁₉)
```

`G` = derecelendirme (1=Again … 4=Easy). Kritik özellikler (resmî wiki'den):
1. `D` (difficulty) büyükse stability artışı küçük.
2. **`S` büyükse stability artışı küçük** — yani zaten sağlam olan hafızayı daha da sağlamlaştırmak zordur.
3. `R` küçükse stability artışı büyük — **spacing etkisi**.
4. Stability artışı her zaman ≥ 1.

**Interval hesabı (istenen retention'dan):**

```
I(r, S) = ((r^(1/decay) − 1) / factor) · S
```

FSRS-6 varsayılan 21 parametre ve varsayılan desired retention **%90**. Anki'ye 23.10 (Kasım 2023) ile opsiyonel olarak geldi; **Anki 25.09 itibarıyla yeni profillerde artık varsayılan algoritma** — yani ekosistem SM-2'yi terk etti. RemNote'ta native, Mochi'de opsiyonel, Logseq'in DB graph'larında native.

Kaynak: [open-spaced-repetition/awesome-fsrs — The Algorithm](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm) · [Anki PR #4096 (decay varsayılanı, Haz 2025)](https://github.com/ankitects/anki/pull/4096) · [ts-fsrs algorithm.ts](https://github.com/open-spaced-repetition/ts-fsrs/blob/7479e74cf555d7dccb31c5693c431ab7d639ad55/packages/fsrs/src/algorithm.ts)

**→ Bizim modele:** Her "konu" için `(S, D, son_tekrar_t)` üçlüsü tut. Tekrar kuyruğunu tarih listesiyle değil `R(t,S) < 0.90` koşuluyla üret. Bu, "tarihsiz sistem" felsefene *daha* uygun: takvim yok, sadece durum var.

### 3.3 Öğrenme eğrisi — lineer ETA'nın neden yanlış olduğu, ve doğru formül

Klasik form (Newell & Rosenbloom 1981):

```
T_n = a · n^(−b) + c
```

- `T_n` = n'inci denemedeki tamamlama süresi/hata
- `b` = öğrenme oranı üsteli (tipik 0.2–0.5)
- `c` = asimptot

**Ama senin durumunda güç yasası DEĞİL, üstel form doğrudur — ve bu bir detay değil.** Heathcote, Brown & Mewhort (2000), *"The power law repealed"*: **40 veri seti, 7.910 öğrenme serisi, 475 kişi, 24 deney.** Bulgu, **ortalama alınmamış tüm veri setlerinde** üstel fonksiyon güç yasasından daha iyi uydu; güç yasası **bireyler üzerinde ortalama almanın artefaktıdır.** Sen tek kişilik bir sistem kuruyorsun — yani ortalama alınmamış durumdasın. Dolayısıyla üstel formu kullan:

```
S(N) = 10 · (1 − e^(−r·N))          N = kümülatif pratik, r = kişisel öğrenme oranı
```

**Tersini alınca ETA'nın doğru hâli çıkıyor.** Bir skora ulaşmak için gereken pratik miktarı:

```
N(S) = −(1/r) · ln(1 − S/10)
```

Buradan iki adım arasındaki maliyet farkı **tam olarak** hesaplanabilir:

```
ΔN(2→3) = (1/r)·ln(8/7)  = 0.134/r
ΔN(8→9) = (1/r)·ln(2)    = 0.693/r
```

> **8→9 adımı, 2→3 adımının tam 5,2 KATI çabaya mal olur. Ve 9→10 sonsuzdur.**
> Bu, "yaklaşık olarak daha pahalı" değil; kapalı formda çıkan bir sayı. Lineer ETA bu yüzden yüksek skorlarda sistematik olarak *iyimser* — ve iyimserlik en çok, en çok yatırım yaptığın yerde.

**Düzeltilmiş ETA formülü — asimptota olan log-mesafe üzerinden:**

```
ETA = [ ln(10 − S_şimdi) − ln(10 − S_hedef) ] / (r · haftalık_çaba)
```

Yani ETA'yı **ham skor farkı** üzerinden değil, **asimptota kalan mesafenin logaritması** üzerinden hesapla. Bu tek satır, mevcut `(R_hedef − R)/hız` formülünün yerine geçer.

**Ve ölçeği 10'da değil ~9,5'te kes.** Bu literatürdeki her eğri altında gerçek bir 10 ulaşılamazdır (yukarıdaki `ln(0)` bunu matematiksel olarak söylüyor). Dashboard'da erişilebilir maksimumu 9,5 yapmak, hem doğru hem de §7.2'deki ruminasyon tuzağına karşı koruma: asla ulaşılamayacak bir 10, kalıcı bir eksiklik hissi üretir.

Alternatif, daha kaba ama uygulaması kolay form (Habitica'nın mekaniği): kazanç `ΔS = base_gain · k^S` ile üstel azalır, `k ≈ 0.97…0.85` kalibre edilir. Aynı davranışı verir, ama yukarıdaki kapalı form ETA'yı doğrudan verdiği için tercih edilmeli.

Kaynak: [Newell & Rosenbloom (1981), CMU arşiv PDF](http://iiif.library.cmu.edu/file/Newell_box00032_fld02190_doc0001/Newell_box00032_fld02190_doc0001.pdf) · [Heathcote, Brown & Mewhort (2000), *Psychonomic Bulletin & Review*](https://link.springer.com/content/pdf/10.3758/BF03212979.pdf)

### 3.4 Kendi kendine puanlamanın güvenilirliği — S skorunun kök problemi

**Zell & Krizan (2014), *Perspectives on Psychological Science* 9(2):111–125** — 22 meta-analizin sentezi:

- Yetenek öz-değerlendirmesi ile objektif performans arasındaki ortalama korelasyon **M = .29** (SD = .11), aralık .09–.63.
- Korelasyon **daha güçlü** olduğu koşullar:
  1. Öz-değerlendirme **geniş değil, alana özgü** olduğunda,
  2. Performans görevi **objektif** olduğunda,
  3. Görev **tanıdık** olduğunda,
  4. Görev **karmaşıklığı düşük** olduğunda.

Ek: düşük performans gösterenlerin metakognitif beceri eksikliği nedeniyle kendini fazla değerlendirmesi (Kruger & Dunning 1999); metakognitif beceri geliştirmek öz-değerlendirme doğruluğunu artırıyor.

**→ Bizim modele:** Bu bulgu, rubrik çapalarının (§5) "iyi olurdu" değil **zorunlu** olduğunu söylüyor. "SIEM bilgim 6/10" cümlesi r≈.29 gürültüdür. "Splunk'ta `stats` + `eval` ile brute-force tespiti yazabiliyorum, tail'i okuyorum" cümlesi ise Zell & Krizan'ın dört moderatörünü de karşılar (alana özgü + objektif + tanıdık + tek görev) ve r'yi .6'ya doğru taşır.

Kaynak: [Metasynthesis (SAGE)](https://journals.sagepub.com/doi/10.1177/1745691613518075) · [APS özet](https://www.psychologicalscience.org/journals/perspectives/1745691613518075/)

### 3.5 Olasılıksal ETA — nokta tahmin yerine persentil

Mevcut formül `ETA = (R_hedef − R) / haftalık_hız` **nokta tahmindir** ve ortalama hız kullanır. Agile forecasting literatürünün merkezi eleştirisi tam bu:

> "Hız ortalaması, olasılığı olmayan tek noktalı tahmin üretir. Hızınız sprint başına 30–60 arasında değişiyorsa, ortalama 45 kullanmak size %50 doğru olma şansı verir — bir yazı-tura." — [Agile Analytics](https://ado-analytics.baytekdev.com/blog/monte-carlo-forecasting-for-agile-teams/)

**Yöntem (Magennis / Vacanti):**
1. Geçmiş **haftalık throughput** kaydını tut (kaç konu bitti / kaç R puanı kazanıldı).
2. Kalan işi bitirmek için: geçmiş haftalardan **rastgele örnekleyerek** 10.000 sanal gelecek simüle et.
3. Sonucu persentil olarak raporla: 50. / 85. / 95.

Bu, tarihsiz sistem felsefene aykırı değil — çıktı "hafta sayısı dağılımı", tarih değil:

```
kalan = R_hedef − R
simülasyon (10.000 kez):
    hafta = 0; birikim = 0
    while birikim < kalan:
        birikim += rastgele_seç(geçmiş_haftalık_kazançlar)
        hafta += 1
    kaydet(hafta)
rapor: P50, P85, P95
```

Kaynaklar: [Focused Objective (Troy Magennis, ücretsiz araçlar)](https://www.focusedobjective.com/) · [Vacanti & Johnson, Flow Forecasting Pocket Guide](https://leanpub.com/ffpg) · [Industrial Logic uygulama notu](https://www.industriallogic.com/blog/reckoning-with-reality-with-probabilistic-forecasting/)

### 3.6 Reference class forecasting — hızın kendisini nereden alacaksın

Kahneman & Tversky'nin planlama yanlılığı bulgusu: insanlar maliyet, süre ve riski *sistematik olarak* düşük tahmin eder, faydayı yüksek tahmin eder. Sebep "inside view" (kendi planının detaylarına odaklanmak). Çare "outside view": benzer tamamlanmış girişimlerin **gerçek sonuç dağılımı**.

Flyvbjerg'in üç yanlılığı: (1) optimism bias, (2) **uniqueness bias** ("benim durumum farklı"), (3) strategic misrepresentation. İlk iki tanesi tek kişilik kariyer planlamasında birebir geçerli.

Pratik: UK Dept for Transport uygulamasında 80. persentil kullanıldı → %57 contingency; 50. persentil → %40 contingency.

**→ Bizim modele:** İlk 4–8 hafta veri toplayana kadar `haftalık_hız`ı kendi tahmininden değil, "sıfırdan junior SOC'a geçen insanlar" referans sınıfından al; sonra kendi verinle güncelle. Ve ETA'yı **P50 değil P85** olarak göster — kendine karşı dürüstlük tamponu.

Kaynak: [Wikipedia — Reference class forecasting](https://en.wikipedia.org/wiki/Reference_class_forecasting) · [Flyvbjerg, Getting Risks Right](https://ktproject.ca/wp-content/uploads/2026/03/From-Nobel-Prize-to-Project-Management-Getting-Risks-Right.pdf) · [2026 review: promises & problems](https://doi.org/10.1080/09537287.2025.2578708)

### 3.7 Darboğaz mantığı — R'yi nasıl toplamalı (ağırlıklı ortalama TUZAK)

**Liebig'in minimum yasası:** büyümeyi kaynakların toplamı değil, **en kıt kaynak** belirler. Fıçı, en kısa tahtası kadar su tutar.

**Goldratt'ın Theory of Constraints'i** bunun yönetim karşılığı — 5 odak adımı:
1. Identify — sistemin kısıtını bul
2. Exploit — mevcut kaynakla kısıtı sonuna kadar kullan
3. Subordinate — diğer her şeyi kısıtın hızına tabi kıl
4. Elevate — kısıta kapasite ekle
5. Repeat — **kısıt yok edilmez, sadece taşınır**; ataleti engelle

**→ Bizim modele:** `R = Σ wᵢ·Sᵢ` (ağırlıklı ortalama) *telafi edici*dir: Networking'de 10 alıp SIEM'de 1 alarak yüksek R üretebilirsin. Ama gerçek işe alım telafi edici değildir — SIEM'i bilmeyen SOC analisti işe alınmaz. İki katmanlı çözüm:

```
R_ham       = Σ wᵢ · Sᵢ                    // genel ilerleme
R_efektif   = R_ham · penalty(min Sᵢ)      // darboğaz cezası
darboğaz    = argmin(Sᵢ / S_hedefᵢ)        // "şu an tek işin bu"
```

Dashboard'da tek bir "ŞU AN DARBOĞAZ: ___" alanı, 40 satırlık tablodan daha çok davranış değiştirir (ToC adım 3: her şeyi kısıta tabi kıl).

Kaynak: [Wikipedia — Theory of Constraints](https://en.wikipedia.org/wiki/Theory_of_constraints) · [Lean Production — 5 Focusing Steps](https://www.leanproduction.com/theory-of-constraints/) · [Liebig / law of the minimum](https://wostal.eu/blog/liebigs-law-bottleneck-systems/)

### 3.8 WIP limiti — Little's Law

```
ortalama cycle time = ortalama WIP / ortalama throughput
```

(Little'ın kanıtladığı orijinal form `L = λW`; akış formu λ'yı *departure rate* ile değiştirir ve **yalnızca sistem kararlıyken** geçerlidir — arrivals ≈ departures.)

**→ Bizim modele:** Aynı anda 9 konuyu "öğreniyorum" durumunda tutmak, her birinin bitiş süresini 9 katına çıkarır; throughput artmaz. Dashboard'a sert bir kural: **aynı anda en fazla 2–3 aktif konu**. Ayrıca `implied WIP = throughput × cycle time` ile gerçek WIP'i karşılaştırmak, "kâğıt üzerinde ilerliyorum ama aslında iş yaşlanıyor" durumunu yakalar (work item age).

Kaynak: [Kanban: How WIP Limits Cut Cycle Time](https://whichframework.org/frameworks/kanban.html) · [Little's Law — kararlılık varsayımı uyarısı](https://jonmoshier.com/notes/littles-law/)

### 3.9 Gate'lerin davranışsal temeli — implementation intentions

Senin "gate" (boolean önkoşul) kavramı, Gollwitzer'in **implementation intention**'ı ile birebir örtüşüyor ama bir şey eksik: gate bir *koşul*, implementation intention ise *koşul + eylem*.

Format: **"Eğer durum Y ile karşılaşırsam, o zaman X hedefine ulaşmak için Z davranışını başlatacağım."**

Kanıt:
- Gollwitzer & Sheeran (2006) meta-analizi, 94 bağımsız çalışma, 8.000+ katılımcı: hedefe ulaşmada **d = 0.65**. Alt kırılım: başlayamama probleminde **d = 0.61**, **hedef takibinin raydan çıkmasını önlemede d = 0.77**.
- Sheeran, Listrom & Gollwitzer (2024), 642 test: d = 0.27 (davranış değişimi) … 0.66 (duygu düzenleme). Etki **if-then formatı** kullanıldığında, kişi **yüksek motive** olduğunda ve plan **prova edildiğinde** daha büyük. Yayın yanlılığı düzeltmesi sonrası etki küçülüyor (bkz. §9).

**→ Bizim modele:** Her gate'i `koşul → eylem` çifti olarak yaz. Örnek: gate "Linux temel ≥ 6" yerine → *"Eğer Linux S≥6 olursa, o zaman aynı hafta içinde THM SOC L1'in log analizi modülüne başlayacağım."* d=0.77 olan alt-etki (derailment önleme) tam olarak senin ihtiyacın.

Kaynak: [Gollwitzer & Sheeran özet PDF](https://kops.uni-konstanz.de/server/api/core/bitstreams/c5d2b466-4ee4-4fb1-a22c-867d5f86d86e/content) · [2024 meta-analiz (642 test)](https://kops.uni-konstanz.de/server/api/core/bitstreams/d703c468-46e9-47fc-8900-d32d7d19c8d9/content)

### 3.10 Taahhüt mekaniği — Beeminder ve stickK'nın ölçülmüş etkisi

**Beeminder'ın üç çalınabilir fikri:**

1. **Razor road + days-to-derail izohatları.** Yol sıfır genişlikli tek bir kritik çizgidir; etrafındaki renkler *kaç gün payın kaldığını* gösterir: DTD=0 kırmızı, 1 turuncu, 2 mavi, ≥3 yeşil, ≥7 koyu yeşil. → Bizim modelde "ETA" yerine/yanında **"kaç gün/hafta payım var"** göstergesi. Bu, geleceğe dair tahmin değil, *şimdiki güvenlik marjı* — tarihsiz felsefeye çok daha uygun.
2. **Akrasia horizon = 1 hafta.** Hedefin eğimini değiştirebilirsin, ama değişiklik **ancak 1 hafta sonra** yürürlüğe girer. Gerekçe: bir haftanın ötesindeki kararlar akrasia tarafından çarpıtılmaz. → Dashboard'a: hedef/ağırlık değişiklikleri 7 gün gecikmeli uygulanır. Bu, "zorlaştı, hedefi düşürelim" kaçışını kapatır.
3. **Merhametli reset.** Derail olduğunda yol *senin bulunduğun yere iner* ve 1 hafta düz alan verilir; Beeminder asla eski yolu yakalamanı beklemez. → Streak kırıldığında sistemin S'leri sıfırlamaması, "borç" biriktirmemesi gerekir; yoksa terk oranı artar (§7).

**stickK'nın ölçülmüş sonucu:** kendi iç analizi (125.000 sözleşme) — hakem yok + para yok → **%29 başarı**; hakem + para → **%80**. Akademik doğrulama (Kim et al., CHI 2021, 75.828 kamuya açık hedef): başarı finansal *ve* sosyal taahhüdün konfigürasyonuna bağlı (stake miktarı, alıcı tipi: arkadaş/hayır kurumu/anti-charity, destekçi varlığı) ve **kısa vadeli hedefler uzun vadelilerden anlamlı biçimde daha başarılı**.

Kaynak: [DTD izohatları](https://blog.beeminder.com/isolines/) · [Road dial & akrasia horizon](https://blog.beeminder.com/dial/) · [Derailment](https://blog.beeminder.com/derail/) · [Sticky Goals CHI'21](https://dl.acm.org/doi/fullHtml/10.1145/3411764.3445295)

### 3.11 CTL / ATL / TSB — "hız + hazırlık skoru"nun en olgun mühendislik çözümü

Bu, senin modelinin çekirdeğine (**hız** + **hazırlık skoru R**) en yakın, ticari olarak 20 yıldır çalışan ve matematiği açıkça yayınlanmış sistem: TrainingPeaks'in **Performance Management Chart**'ı. Kökeni Banister'in *impulse-response (fitness–fatigue)* modelidir.

Üç büyüklük, günlük bir yük skorundan (TSS) türetilir:

```
CTL_bugün = CTL_dün + (TSS_bugün − CTL_dün) · (1 / 42)     // Fitness / "Chronic Training Load"
ATL_bugün = ATL_dün + (TSS_bugün − ATL_dün) · (1 / 7)      // Fatigue / "Acute Training Load"
TSB       = CTL − ATL                                      // Form / "Freshness", hazırlık
```

- **CTL** = günlük yükün **42 günlük** üstel ağırlıklı hareketli ortalaması → *birikmiş kapasite*. "Fitness."
- **ATL** = aynı yükün **7 günlük** üstel ağırlıklı ortalaması → *anlık yorgunluk*. "Fatigue."
- **TSB = CTL − ATL** → *hazır olma durumu*. Negatif TSB = yükleniyorsun (build); pozitif TSB = dinlenmişsin (taper). Yüksek pozitif = az çalışıyorsun.

TrainingPeaks'in kendi bilimsel açıklaması, TSB'yi neden bir *performans yordayıcısı* değil bir *adaptasyon göstergesi* olarak sunduğunu da net söylüyor: Banister modelinin kazanç katsayıları (kₐ, k_f) elimine edildiği için TSB "mutlak tahmin" değil, "son yüküne ne kadar adapte olduğunun göstergesi"dir.

**→ Bizim modele — üç doğrudan çıkarım:**

1. **Hız ("velocity") tek sayı olmamalı; iki zaman ölçeği gerekir.** Şu anki `haftalık_hız` ATL'ye karşılık gelir (gürültülü, kısa vadeli). Buna bir de 6 haftalık üstel ortalama (CTL) ekle. ETA'yı **CTL ile** hesapla — ATL ile hesaplamak, iyi bir haftadan sonra ETA'yı gerçek dışı biçimde iyileştirir, kötü bir haftadan sonra ise gereksiz panik yaratır. Bu, mevcut formülün en ucuz ve en etkili tek düzeltmesi olabilir.

2. **`TSB`ye karşılık gelen bir "sürdürülebilirlik" göstergesi ekle.** `CTL − ATL`, "bu tempoyu sürdürebiliyor muyum yoksa tükeniyor muyum" sorusunu tek sayıyla cevaplar. Self-tracking terk etme literatürünün (§7.1) en büyük nedeni tam bu: sürdürülemez tempo → tükenme → bırakma. Modelinde bunu ölçen hiçbir şey yok.

3. **Üstel ağırlıklı ortalama, "tarihsiz sistem" felsefesiyle mükemmel uyumlu.** Formül bir takvim tarihi içermez; yalnızca *dünkü durum* + *bugünkü girdi* kullanır — yani senin "durum + geçiş" modelinin tam olarak aynı biçimi. Özyinelemeli, tek satır, geçmiş veri saklamayı gerektirmez.

**Orijinal Banister katsayıları — 42/7 nereden geliyor:** Banister'ın impulse-response modeli iki üstel terim kullanır ve orijinal fitlerde katsayılar şöyle: kazanç `k₁ = 1.0` (fitness), `k₂ = 1.8–2.0` (fatigue); zaman sabitleri `τ₁ = 49–50 gün` (fitness), `τ₂ = 11 gün` (fatigue).

Buradaki asimetri, modeli senin bağlamına taşırken kopyalanması gereken asıl şey: **yorgunluk, fitness'tan ~2 kat ağır tartılır ama ~4 kat hızlı söner.** Pratik anlamı — aşırı yüklenmiş bir hafta hazırlığını *kısa vadede* sert biçimde düşürür ama kalıcı hasar bırakmaz; buna karşılık kapasite yavaş birikir ve yavaş kaybolur. Bir "22 saat çalıştım" haftasının ardından skorun düşmesi bir hata değil, doğru davranıştır.

Kaynak: [Banister impulse-response modeli üzerine](https://pmc.ncbi.nlm.nih.gov/articles/PMC6959511/)

Kaynak: [The Science of the TrainingPeaks Performance Manager](https://www.trainingpeaks.com/learn/articles/the-science-of-the-performance-manager/) · [Fitness (CTL) — resmî formül](https://help.trainingpeaks.com/hc/en-us/articles/204071884-Fitness-CTL) · [Fatigue (ATL) — resmî formül](https://help.trainingpeaks.com/hc/en-us/articles/204071894-Fatigue-ATL) · [Metrik sözlüğü (TSB tanımı)](https://www.trainingpeaks.com/learn/articles/glossary-of-trainingpeaks-metrics/)

### 3.12 Eğitim değerlendirme çapası — Kirkpatrick ve eleştirisi

Kirkpatrick'in 4 seviyesi (1959): **L1 Reaction** (memnuniyet) → **L2 Learning** (bilgi/beceri) → **L3 Behavior** (işte davranış) → **L4 Results** (sonuç).

**Neden bizim için önemli:** senin S skorların çoğunlukla L2'dir ("kursu bitirdim, anladım"). İşe alım ise L3/L4'e bakar ("gerçek bir alert'i triage edebiliyor musun"). ATD araştırmasına göre organizasyonlar L3'ü %25, L4'ü %15 oranında ölçüyor — yani herkes kolay olanı ölçüyor. Aynı tuzak bireysel dashboard'larda da var.

**Eleştiri (dürüstlük için):** Holton (1996) "The Flawed Four-Level Evaluation Model" — bu bir *teori* değil, bir **taksonomi**; seviyeler arasında nedensel bağ olduğu varsayımı kanıtlanmamıştır. Alliger & Janak (1989) üç problemli varsayımı listeler. Yani seviyeleri "otomatik yükselen merdiven" gibi kullanma.

**→ Bizim modele:** Her S puanı için **kanıt seviyesini de** kaydet: `S=6 (L2: kurs bitti)` ile `S=6 (L3: kendi lab'ımda tespit yazdım ve çalıştı)` aynı şey değil. İkinci tür kanıt, işverenin gördüğü tek şeydir.

Kaynak: [New World Kirkpatrick tanıtımı (PDF)](http://www.kirkpatrickpartners.com/wp-content/uploads/2021/11/Introduction-to-The-New-World-Kirkpatrick%C2%AE-Model.pdf) · [Holton eleştirisinin 30. yılı](https://doi.org/10.1002/hrdq.70007) · [Alliger & Janak 1989](https://onlinelibrary.wiley.com/doi/10.1111/j.1744-6570.1989.tb00661.x)

---

### 3.13 Optimal aralık, hatırlama ufkuna bağlıdır — Cepeda et al. (2008)

Bu, §3.1'i tamamlayan ve **T+1/T+3/T+7'yi kesin olarak çürüten** ampirik veri. *Psychological Science* 19:1095–1102, 1.350+ katılımcı, gerçek gün ölçeğinde (laboratuvar dakikaları değil).

Deney: insanlar bir olgu setini öğrendi, **gap** (iki çalışma seansı arası) ve **RI** (retention interval — son çalışmadan final teste kadar) sistematik olarak değiştirildi.

**Sonuç — optimal gap, RI'nin sabit bir oranı DEĞİLDİR; RI büyüdükçe oran düşer:**

| Retention Interval (RI) | Optimal gap (recall, spline ile interpolasyon) | Gap / RI oranı |
|---|---|---|
| 7 gün | ~3 gün | %43 |
| 35 gün | ~8 gün | %23 |
| 70 gün | ~12 gün | %17 |
| 350 gün | ~27 gün | %8 |

Yazarların özeti: *"Optimal gap değeri, RI arttıkça yükseldi ve daha kısa vadeli çalışmalara dayanarak bazı önceki araştırmacıların önerdiği sabit RI oranından belirgin biçimde saptı."* Ve etki küçük değil: optimal gap, sıfır-gün gap'e kıyasla recall'da **%10 / %59 / %111 / %77** iyileşme sağladı (sırasıyla 7/35/70/350 günlük RI'lerde).

**→ Bizim modele — doğrudan hesap:**

Sen bilgiyi *mülakatta* kullanmak istiyorsun; yani RI birkaç ay mertebesinde. RI ≈ 70 gün için optimal gap **~12 gün**, RI ≈ 350 gün için **~27 gün**. `T+1 / T+3 / T+7` şeması, RI'si haftalar-aylar olan bir hedef için **kat kat fazla sıkı** — yani gereksiz tekrar yükü üretiyor ve (Karpicke & Roediger'in gösterdiği gibi) retrieval'ı kolaylaştırdığı için birim çaba başına kazanç düşüyor.

Pratik kural (kaynaklara dayalı, tarihsiz formda ifade edilebilir):

```
gap ≈ RI · f(RI)          f: %40 (RI≈1 hafta) → %20 (RI≈1 ay) → %15 (RI≈2 ay) → %8 (RI≈1 yıl)
```

FSRS-6 bunu zaten *öğrenilmiş parametrelerle* yapıyor (§3.2) — bu yüzden en pratik hamle kendi eğrini uydurmak değil, FSRS'i kullanmak.

> Dürüstlük notu: Cepeda et al.'in kendi simülasyonları, ACT-R (Pavlik & Anderson) ve SAM (Raaijmakers) modellerinin bu iki bulguyu (optimal gap'in RI ile artması **ve** gap/RI oranının azalması) *aynı anda* açıklayamadığını buldu. Yani teori tarafı hâlâ tartışmalı; ampirik tablo ise sağlam.

Kaynak: [Cepeda, Vul, Rohrer, Wixted & Pashler (2008), PDF](https://www.yorku.ca/ncepeda/publications/CVRWP2008.pdf) · [UCSD kopyası](https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf) · [ERIC preprint (özet ve %20→%5 ifadesi)](https://files.eric.ed.gov/fulltext/ED505660.pdf)

### 3.14 Bayesian Knowledge Tracing (BKT) — S skorunu "puan" değil "olasılık" yapmak

Corbett & Anderson (1995). Bir beceriyi **iki durumlu gizli Markov modeli** olarak modeller: *biliyor* / *bilmiyor*. Dört parametre:

| Parametre | Anlamı |
|---|---|
| `P(L₀)` | başlangıçta beceriyi bilme olasılığı (prior) |
| `P(T)` | bilmiyorken bir denemede **öğrenme** olasılığı (transit) |
| `P(G)` | bilmiyorken doğru yapma olasılığı (**guess**) |
| `P(S)` | biliyorken yanlış yapma olasılığı (**slip**) |

**Güncelleme — iki adım.** Önce gözleme göre posterior (Bayes):

```
doğru cevap:
P(L | doğru) =            P(L)·(1 − P(S))
               ─────────────────────────────────────────
               P(L)·(1 − P(S)) + (1 − P(L))·P(G)

yanlış cevap:
P(L | yanlış) =              P(L)·P(S)
                ───────────────────────────────────────────
                P(L)·P(S) + (1 − P(L))·(1 − P(G))
```

Sonra bu denemede öğrenme şansını ekle:

```
P(L_yeni) = P(L | gözlem) + (1 − P(L | gözlem)) · P(T)
```

Ve bir sonraki denemeyi doğru yapma tahmini:

```
P(doğru) = P(L)·(1 − P(S)) + (1 − P(L))·P(G)
```

Parametreler EM (Baum–Welch forward–backward) ile kestirilir; tanımlanabilirlik için `P(G) + P(S) < 1` gerekir. Yaygın operasyonel eşik: **P(mastery) > 0.95** olunca sistem o beceriyi drill etmeyi bırakır.

**→ Bizim modele:** Bu, `S = 6/10` gibi bir *keyfi puanın* yerine `P(biliyorum) = 0.83` gibi bir *olasılığın* konabileceğini gösteriyor — ve en güzel yanı, bunun **elle puanlama gerektirmemesi**: sadece "bu tekrarı doğru/yanlış yaptım" kaydından türüyor. §3.4'teki r ≈ .29 problemi bu şekilde tamamen ortadan kalkar, çünkü öz-değerlendirme yerine *davranış* ölçülür.

Pratik uyarı: klasik BKT'de **unutma yok** — mastery monotondur, bir kez öğrenilince geri dönülmez. Bu senin unutma kuyruğu ihtiyacına aykırı. Çözüm: `P(F)` (forget) parametresi eklenmiş varyantlar, ya da unutmayı FSRS'e (§3.2) bırakıp BKT'yi yalnızca "bu beceri gate'i geçti mi" kararı için kullanmak.

BKT'nin bilinen rakipleri: **PFA (Performance Factors Analysis)** — logit tabanlı, doğru/yanlış sayılarını ayrı katsayılarla ağırlıklandırır; **DKT (Deep Knowledge Tracing)** — RNN tabanlı, ama basit baseline'ların DKT'yi yakaladığını gösteren eleştirel literatür var. Tek kişilik bir sistemde bu ikisi aşırı mühendisliktir.

Kaynak: [van de Sande, *Properties of the BKT Model* (JEDM, tüm denklemler)](https://files.eric.ed.gov/fulltext/EJ1115329.pdf) · [BKT güncelleme formülleri, derleme](https://bkt.tyche.institute/en/01-bkt/06-update-formulas/) · [Optimizing BKT (JEDM)](https://files.eric.ed.gov/fulltext/EJ1458433.pdf) · [StanBKT (2026, parametre kestirimi eleştirisi)](https://arxiv.org/html/2605.23048v1)

### 3.15 SM-2 ve Duolingo HLR — iki alternatif tekrar motoru

**SM-2 (SuperMemo, 1987; resmî algoritma metni)** — FSRS'e göre çok basit ve elle uygulanabilir:

```
Başlangıç:  EF = 2.5   (her item için)

Aralıklar:  I(1) = 1
            I(2) = 6
            n>2 : I(n) = I(n−1) · EF        (kesirse yukarı yuvarla)

Her tekrardan sonra, q ∈ {0..5} kalite notuyla:
            EF' = EF + (0.1 − (5−q)·(0.08 + (5−q)·0.02))
            eşdeğer sadeleşmiş hâli:  EF' = EF − 0.8 + 0.28q − 0.02q²
            EF' < 1.3 ise EF' = 1.3

q < 3 ise tekrar dizisini baştan başlat (I(1)=1), ama EF'i koru.
```

`q`'nun etkisi net: q=5 → +0.10, q=4 → ±0.00, q=3 → −0.14, q=2 → −0.32, q=1 → −0.54, q=0 → −0.80. Yani **EF sadece mükemmel hatırlamada artar**; "zorlanarak hatırladım" (q=3) bile cezalıdır. 1.3 tabanı, hiç öğrenilemeyen kartların "her gün sonsuza kadar" moduna çökmesini engeller.

Kaynak: [SuperMemo — SM-2 algoritması (resmî arşiv)](https://www.super-memory.org/archive/english/ol/sm2.htm) · [SuperMemo blog, aynı metin](https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method)

**Duolingo Half-Life Regression (Settles & Meeder, ACL 2016)** — SM-2 ile FSRS arasındaki köprü; sabit kural yerine *öğrenilmiş* bir yarı-ömür:

```
Unutma eğrisi:     p = 2^(−Δ / h)

Yarı-ömür tahmini: ĥ_Θ = 2^(Θ · x)

Kayıp fonksiyonu:  ℓ(⟨p, Δ, x⟩; Θ) = (p − p̂_Θ)²  +  α·(h − ĥ_Θ)²  +  λ‖Θ‖²₂
                   burada h ≈ −Δ / log₂(p)   (gözlemden cebirsel yaklaşım)
```

- `p` = hatırlama olasılığı, `Δ` = son pratikten beri geçen süre (lag), `h` = yarı-ömür
- `x` = öğrenme geçmişini özetleyen öznitelik vektörü (geçmiş doğru sayısı `x⊕`, yanlış sayısı `x⊖`, vb.)
- `Θ` = milyonlarca gerçek tekrar üzerinde gradient descent ile öğrenilen ağırlıklar
- `α` = yarı-ömür teriminin göreli ağırlığı, `λ` = L2 düzenlileştirme

**→ Bizim modele:** HLR'nin çalınacak fikri **`x` öznitelik vektörü**dür. FSRS yalnızca (S, D, R) üçlüsünü kullanır; HLR ise "bu konuyla geçmişte kaç kez doğru/yanlış yaptım, konu tipi ne, hangi dilde" gibi *keyfi öznitelikler* ekleyebilmene izin verir. Senin durumunda bu, "bu beceri Networking mi SIEM mi", "lab'da mı kitapta mı öğrendim" gibi bağlam özniteliklerini yarı-ömür tahminine sokabilmek demektir. Tek kişilik veriyle `Θ` öğrenmek mümkün olmaz — ama makaledeki ağırlıkları sabit kullanmak (bir topluluk uygulaması bunu yapıyor) makul bir başlangıçtır.

Kaynak: [Settles & Meeder (2016), ACL P16-1174 (PDF)](https://aclanthology.org/P16-1174.pdf) · [Duolingo blog — aynı denklemler, sade anlatım](https://blog.duolingo.com/how-we-learn-how-you-learn/)

### 3.16 IRT ve Elo — beceriyi "puan" değil "yetenek parametresi" olarak ölçmek

**Item Response Theory (1PL / Rasch):** bir kişinin bir görevi doğru yapma olasılığı, kişinin yeteneği `θ` ile görevin zorluğu `b` arasındaki farkın lojistik fonksiyonudur:

```
1PL / Rasch:   P(doğru | θ, b) = 1 / (1 + e^(−(θ − b)))

2PL:           P(doğru | θ, a, b) = 1 / (1 + e^(−a(θ − b)))          a = ayırt edicilik
3PL:           P(doğru | θ, a, b, c) = c + (1 − c) / (1 + e^(−a(θ − b)))   c = tahmin tabanı
```

Kritik özellik: `θ = b` olduğunda P(doğru) = 0.5. Yani **yeteneğin, seni %50 zorlayan görevin zorluğudur.** Bu, "0–10 puan"dan çok daha anlamlı bir tanım: puan bir *his* değil, "hangi zorluk seviyesindeki görevleri yarı yarıya çözebiliyorum" sorusunun cevabıdır.

**Elo — IRT'nin online, ön-kalibrasyon gerektirmeyen hâli.** Klinkenberg, Straatemeier & van der Maas (2011), *Computers & Education* 57(2):1813–1824 — Hollanda'daki **Maths Garden / Rekentuin** sistemi: öğrenci ile *soru* birbirine karşı "maç" yapar; her cevaptan sonra hem öğrencinin yeteneği hem sorunun zorluğu güncellenir:

```
Beklenen skor:  E(S) = 1 / (1 + e^(−(θ − b)))

Güncelleme:     θ_yeni = θ + K · (S − E(S))
                b_yeni = b − K · (S − E(S))       // soru ters yönde güncellenir
```

- `S` = gerçekleşen skor, `E(S)` = beklenen skor, `K` = öğrenme oranı (adım büyüklüğü)
- Ön test (pre-calibration) **gerekmez** — zorluklar kullanımdan öğrenilir
- Maths Garden'da skorlama kuralı hem doğruluğu hem **yanıt süresini** içerir (High Speed High Stakes / Signed Residual Time)
- Ölçek: 3.648 çocuk, 10 ayda 3.5 milyondan fazla problem

**En değerli tek parametre:** sistem, soruları **ortalama %75 başarı olasılığı** ile örnekliyor — *"tasks challenging yet not too difficult"*. Bu, "desirable difficulty" kavramının somut, sahada doğrulanmış sayısal karşılığıdır.

**→ Bizim modele — iki somut kullanım:**

1. **`S` puanını Elo'ya çevir.** Her lab/room/CTF görevine bir zorluk `b` ata (THM/HTB kendi zorluk etiketlerini zaten veriyor). Her denemede `θ_yeni = θ + K(S − E(S))`. Sonuç: **elle puanlamayan, davranıştan türeyen bir beceri skoru** — ve §3.4'teki r ≈ .29 problemi ortadan kalkar. `θ`'yı 0–10'a lineer haritalamak kolaydır.
2. **Görev seçimini %75 kuralına bağla.** Dashboard "bu hafta ne yapmalıyım" sorusuna, `E(S) ≈ 0.75` olan görevleri önererek cevap verebilir. Bu tek kural, "çok kolay şeyler yapıp R'yi şişirmek" (Goodhart, §7.3) ve "çok zor şeye girip vazgeçmek" tuzaklarının ikisini de aynı anda kapatır.

**Sabit `K` yerine belirsizlik fonksiyonu — Pelánek'in düzeltmesi.** Elo'nun eğitimdeki en iyi bilinen sorunu, sabit `K`'nın erken tahminleri fazla yavaş, geç tahminleri fazla oynak yapması. Pelánek (*Computers & Education* 98:169–179) `K`'yı güncelleme sayısına bağlı azalan bir fonksiyonla değiştiriyor:

```
U(n) = α / (1 + β·n)            uydurulmuş değerler: α = 1, β = 0.06
θ ← θ + U(n_θ) · (dogru − P(dogru | θ, b))
```

`n` = o parametreye kadar yapılmış güncelleme sayısı. Sonuç dikkat çekici: Elo, **AUC 0.7431** (baseline 0.6797) elde etti ve **veriyi tek geçişte tarayarak, ortak MLE ile kestirilmiş Rasch parametreleriyle r = 0.97 korelasyona** ulaştı. Yani tek satırlık online bir güncelleme, tam Bayesçi kestirimle neredeyse aynı sonucu veriyor — senin ölçeğinde fazlasıyla yeterli.

**Ve modelin "tarihsizlik" felsefesine en iyi uyan parça: Glicko'nun RD'si.** Glicko/Glicko-2 (Glickman) Elo'ya **rating deviation `RD`** ekler — puanın bir standart sapması, %95 güven aralığı `r ± 2·RD`. Kritik davranış: **RD, pratik yaptıkça DARALIR ve hareketsizlikte GENİŞLER.** (Glicko-2 ayrıca oynaklık `σ`, varsayılan 0.06, sistem sabiti `τ ∈ [0.3, 1.2]`; ölçek dönüşümü `μ = (r − 1500)/173.7178`.)

> **Bu, modelin en dürüst tek iyileştirmesi olabilir: her beceriyi nokta değil BANT olarak göster.**
> İki ay dokunulmamış bir konu, sessizce 7/10 kalmaya devam etmemeli — güven aralığı **görünür biçimde genişlemeli**: "SIEM: 6.4 ± 1.8 (son kanıt: 9 hafta önce)". Bu tek değişiklik, tarih tutmayan bir sistemi bile çürümeye karşı dürüst yapar, çünkü belirsizlik zamanla *kendiliğinden* büyür ve bunu göstermek için takvim gerekmez — sadece "kaç güncelleme oldu" saymak yeterlidir.

Kaynak: [Klinkenberg, Straatemeier & van der Maas (2011), Computers & Education](https://www.sciencedirect.com/science/article/abs/pii/S0360131511000418) · [Math Garden tezi (Straatemeier, UvA) — HSHS skorlama kuralı](https://pure.uva.nl/ws/files/2261534/139031_04.pdf) · [Pelánek — Elo in adaptive educational systems](https://doi.org/10.1016/j.compedu.2016.03.017) · [Pelánek — Elo-based learner modeling (UMUAI, PDF)](https://www.fi.muni.cz/~xpelanek/publications/umuai-adaptive-practice.pdf) · [Glickman — Glicko-2 (PDF)](https://glicko.net/glicko/glicko2.pdf) · [FIDE Rating Regulations B.02 §8.3 (K değerleri)](https://handbook.fide.com/chapter/B022024)

### 3.17 PFA / AFM — senin veri rejimine EN uygun model

Bu, önceki turda "birincil kaynaktan doğrulanamadı" diye işaretlediğim modeldi; artık doğrulandı ve sonuç şu: **BKT'den de Elo'dan da daha iyi oturuyor.**

**Performance Factors Analysis** (Pavlik, Cen & Koedinger, AIED 2009) — beceri başına *önceki başarı ve başarısızlık sayıları* üzerinden lojistik regresyon:

```
m(i, KC'ler, s, f) = Σ_{j∈KC}  ( β_j + γ_j · s_{i,j} + ρ_j · f_{i,j} )
p(m) = 1 / (1 + e^(−m))
```

- `β_j` = KC *j*'nin **kolaylığı** (intrinsic easiness)
- `s_{i,j}` / `f_{i,j}` = o KC'de önceki **başarı** / **başarısızlık** sayısı
- `γ_j` / `ρ_j` = başarı ve başarısızlığın ölçek katsayıları

İlgili **Additive Factors Model**: `ln(p/(1−p)) = α_i + Σ_k β_k q_jk + Σ_k γ_k q_jk t_ik`, burada `q_jk` = Q-matrisi (görev *j* beceri *k*'yı kullanıyor mu), `t_ik` = önceki pratik sayısı. PFA, `α_i`'yi (kişi yeteneği) düşürür çünkü önceden bilinemez. `γ = 0` ve tek `β` alınırsa AFM **Rasch'a indirgenir** — yani bu bölümdeki üç model ailesi (BKT / IRT-Elo / PFA-AFM) rakip değil, tek bir süreklilik.

Orijinal makalede PFA, dört veri setinde log-likelihood, BIC, *r* ve A′ metriklerinin hepsinde **BKT'yi geçti.**

**→ Bizim modele — neden en iyi seçenek bu:**

1. **Toplamsal ve yorumlanabilir.** Her SOC konusu bir `β` (doğal kolaylık) alır; her tamamlanan lab `s` veya `f`'yi bir artırır. Dashboard'da "bu skor neden bu" sorusu tek satırda cevaplanır — BKT'nin gizli Markov durumunda bu yok.
2. **`γ > ρ` kalibrasyonu, "başarılı bir soruşturma başarısız olandan daha çok öğretir"i formel hâle getirir.** Ya da tersini: kendi verinle `ρ > γ` çıkarsa, başarısızlıklarından daha çok öğrendiğini *ölçmüş* olursun.
3. **Bir görev birden fazla beceri taşıyabilir.** Bir olay müdahale egzersizi = SIEM sorgusu + log parsing + MITRE eşlemesi. Toplam (`Σ_{j∈KC}`) bunu doğal olarak taşır; **BKT taşıyamaz**, çünkü tek beceri varsayar. Senin kanıtların (§5.4) tam olarak bu bileşik türden.

**Deep Knowledge Tracing (DKT) — kurma. Literatürün kendi verdiği hüküm bu.** Piech et al. (2015) LSTM tabanlı DKT'yi (`h_t = tanh(W_hx x_t + W_hh h_{t−1} + b_h)`, `y_t = σ(W_yh h_t + b_y)`) AUC 0.86 ile duyurdu (önceki en iyi 0.69). Sonrasında:

- **Yeung & Yeung (2018, DKT+):** model kendi girdisini yeniden üretemiyor — **doğru bir cevap tahmin edilen ustalığı DÜŞÜREBİLİYOR** ("wavy predictions").
- **Xiong et al. (2016) ve Wilson et al. (2016):** kazanımlar **yinelenen kayıtlardan** kaynaklanıyordu; düzeltildiğinde IRT DKT'ye eşit veya üstün.
- **Khajah et al. (2016):** **unutma eklenmiş BKT AUC 0.90'a** çıkıyor — DKT'nin 0.86'sının *üstünde*.
- **Gervet et al. (2020):** küçük veride lojistik regresyon daha az overfit ediyor; DKT yalnızca büyük veride öne geçiyor.

Senin sistemin **10²–10³ gözlem** üretecek; DKT 10⁵–10⁶ istiyor. Üstelik yorumlanamaz olması bir dashboard'ın varlık nedenini ortadan kaldırır.

Kaynak: [Pavlik, Cen & Koedinger (2009), CMU PACT PDF](http://pact.cs.cmu.edu/pubs/AIED%202009%20final%20Pavlik%20Cen%20Keodinger%20corrected.pdf) · [AFM — Confident Learning Curves (EDM 2020)](https://educationaldatamining.org/files/conferences/EDM2020/papers/paper_121.pdf) · [Piech et al. (2015), arXiv:1506.05908](https://arxiv.org/abs/1506.05908) · [Yeung & Yeung (2018) DKT+](https://doi.org/10.1145/3231644.3231647) · [Khajah et al. (2016), arXiv:1604.02416](https://arxiv.org/abs/1604.02416) · [Gervet et al. (2020), PDF](https://theophilegervet.github.io/assets/pdf/gervet2020deep.pdf)

### 3.18 Kasıtlı pratik (deliberate practice) — ETA'nın en sert kalibrasyonu

Ericsson, Krampe & Tesch-Römer (1993) kasıtlı pratiği tanımlar: mevcut performansı iyileştirmek için **açıkça tasarlanmış**, anlık geri bildirimli, **zayıflıkları hedefleyen** yapılandırılmış etkinlik — hem oyundan hem sıradan işten farklı.

**Ama etki büyüklüğü, popüler anlatının çok altında.** Macnamara, Hambrick & Oswald (2014), *Psychological Science* 25(8) — meta-analiz. Kasıtlı pratiğin performans varyansını açıklama oranı:

| Alan | Açıklanan varyans | *r* |
|---|---|---|
| Oyunlar | %26 | .51 |
| Müzik | %21 | .46 |
| Spor | %18 | .42 |
| **Eğitim** | **%4** | .21 |
| **Meslekler** | **<%1** | .05 (anlamsız, p = .62) |

İkinci düzenleyici (moderatör) daha da can alıcı: **görev ortamının öngörülebilirliği.** Yüksek öngörülebilirlikte %24, orta %12, **düşük öngörülebilirlikte %4.** 2020 takip çalışması (88 çalışma) genel olarak %14, elit sporcularda **%1** buldu.

**"10.000 saat kuralı" ise Ericsson'ın kendisi tarafından reddedildi:** *"Malcolm Gladwell read our work, and he misinterpreted some of our findings."* 10.000, zaten elit yörüngeye seçilmiş kemancılarda **büyük varyanslı bir ORTALAMAYDI** — ne bir eşik, ne rastgele biri için yeterlilik koşulu.

**→ Bizim modele — ETA'yı nasıl sunmalı:**

Siber güvenlik olay müdahalesi, tam olarak meta-analizin **%4 ve <%1** verdiği iki kategoriye giriyor: *düşük öngörülebilirlikli bir meslek*. Bu, "çalışmak işe yaramaz" demek değil — ölçülen şey *varyansın ne kadarının pratikle açıklandığı*. Ama üç somut sonucu var:

1. **ETA'yı asla güvenli bir tahmin olarak sunma.** *"Belirtilen varsayımlar altında medyan"* olarak, geniş bantla göster (§3.5'teki P50/P85/P95 tam bu yüzden gerekli).
2. **Saatleri Ericsson kriterlerine göre ayır.** Bilinen bir zayıflığı hedefleyen + geri bildirim üreten saat ile pasif tutorial izleme aynı kovaya girmemeli. Meta-analiz *birincisini* ölçüyor; ikincisini pratik saymak ETA'yı doğrudan bozar.
3. **Ortamın öngörülebilirliği düşük olduğu için, kanıt çeşitliliği tekrar sayısından önemli.** Aynı tür lab'ı 20 kez yapmak, düşük öngörülebilirlikli bir alanda 5 farklı tür yapmaktan daha az taşınabilir beceri üretir.

Kaynak: [Macnamara, Hambrick & Oswald (2014), PDF](https://library.scottbarrykaufman.com/uploads/2014/07/Macnamara-et-al.-2014.pdf) · [doi:10.1177/0956797614535810](https://doi.org/10.1177/0956797614535810) · [2020 takip meta-analizi, Frontiers in Psychology 11:1134](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.01134/full) · [Ericsson'ın 10.000 saat reddi — Salon röportajı](https://www.salon.com/2016/04/10/malcolm_gladwell_got_us_wrong_our_research_was_key_to_the_10000_hour_rule_but_heres_what_got_oversimplified/)

### 3.19 Bir uyarı: "Ebbinghaus'un unutma eğrisi" diye bilinen formül Ebbinghaus'un değil

Her yerde alıntılanan `R = e^(−t/S)` **Ebbinghaus'un yayımladığı denklem değildir.** Ebbinghaus'un 1885'te verdiği gerçek form:

```
b = 100k / ( (log₁₀ t)^c + k )          c = 1.25,  k = 1.84
```

`b` = tasarruf (savings) yüzdesi, `t` = öğrenmenin bitiminden bir dakika öncesinden itibaren geçen dakika. Üstel form, **sonraki bir basitleştirmedir** — Murre & Dros (2015, *PLOS ONE*) orijinal eğriyi replike etti ve literatür bu üstel yaklaşımı "önerilen birçok yaklaşımdan belki en basiti" olarak niteliyor.

**Neden önemli:** modelini savunurken "Ebbinghaus'un formülünü kullanıyorum" demek yanlış olur. Doğru ifade: **FSRS'in güç (power) formu** `R(t,S) = (1 + factor·t/S)^(−w₂₀)` kullanıyorum — ki bu, üstel formdan da Ebbinghaus'un logaritmik formundan da farklı ve 500M+ gerçek tekrarla kalibre edilmiş olanıdır (§3.2). Üstel form uzun aralıklarda unutmayı **fazla hızlı** tahmin eder; bu yüzden güç formu tercih edilir.

Kaynak: [Murre & Dros (2015), PLOS ONE 10(7):e0120644](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0120644)

---

## 4. Almanya Boyutu (D4) — Chancenkarte puan tablosu ve maaş eşikleri, yasadan alınmış hesaplanabilir formüller

Bu bölümün kaynağı **birincil hukuk metnidir**: Aufenthaltsgesetz'in **§ 20b** maddesi (kriterler) ve **Anlage zu § 20a Abs. 3 Nr. 2, § 20b** (puan tablosu). Üçüncü taraf göçmenlik siteleri değil.

**Yasal durum:** Metin, *Gesetz zur Weiterentwicklung der Fachkräfteeinwanderung* (16.08.2023, BGBl. 2023 I Nr. 217) Art. 3 ile geldi. **Puan tablosu (Anlage) o tarihten beri HİÇ değiştirilmedi** — Anlage'nin Fundstelle'si hâlâ BGBl. 2023 I Nr. 217. 2026 için değişen tek şey endeksli euro tutarlarıdır. § 20a Abs. 7'deki **kota yetkisi hiç kullanılmadı**: Bundestag Drucksache 21/692'ye göre 1 Haziran 2024 – 15 Haziran 2025 arasında **11.497 Chancenkarte vizesi** verildi, üst sınır yok.

> **Madde numaralarını karıştırma:** **§ 20a** izni tanımlar (süre, çalışma hakkı, dönüştürme), **§ 20b** kriterleri sayar, **Anlage** puan değerlerini atar. Üçünü birlikte kaynak göster.

### 4.1 İki ayrı yol — ve ön koşullar

Chancenkarte'ye **iki farklı yoldan** girilir. Çoğu blog sadece ikincisini anlatıyor.

**Yol 1 — Fachkraft (puana hiç girmez).** Niteliği **tam olarak tanınmış** ya da Alman diploması/mesleki yeterliği olan kişi: puan hesabı yok, **dil sertifikası şartı hiç yok**. Sadece geçim kanıtı (§ 18 Abs. 3 AufenthG).

**Yol 2 — Puan yolu.** Şunların **hepsi** gerekir:

| Kapı | Detay |
|---|---|
| **A — Geçim** (her iki yolda) | § 20a Abs. 4 S. 1. **2026 için: net €1.091/ay** (12 aylık kalış için €13.092), blokeli hesap (Sperrkonto) veya Verpflichtungserklärung ile. Haftada ≤20 saat yan iş kazancı bu tutara sayılabilir |
| **B — Nitelik** | § 20a Abs. 4 S. 3 Nr. 1: devlet tarafından tanınan, **≥2 yıl** süreli yabancı mesleki yeterlik **veya** tanınan yabancı üniversite diploması **veya** AHK belgesi. Kanıt: anabin "H+ / entspricht", ZAB Zeugnisbewertung, ya da "Digitale Auskunft zur Berufsqualifikation" |
| **C — Dil eşiği** | § 20a Abs. 4 S. 3 Nr. 2: **Almanca A1** *veya* **İngilizce B2** (ALTE sertifikalı) |
| **D — Puan** | ≥ 6 |

> **Formüldeki kritik dal — bunu kaçırmak hata olur.** § 20b Abs. 1 **Satz 2**'ye göre, Nr. 1'den (kısmi denklik) 4 puan alıyorsan **Kapı B düşer.** Yani kısmi denklik kararı hem 4 puan verir *hem de* formel nitelik ön koşulunu ortadan kaldırır. **Kapı C (dil) asla düşmez.**

### 4.2 Puan tablosu — § 20b Abs. 1 + Anlage (resmî)

Yasanın eki, puanları madde numarasına göre verir. Aşağıdaki tablo iki kaynağı birleştirir: kriter metni (§ 20b Abs. 1 Nr. 1–12) ve puan değerleri (Anlage tablosu).

| § 20b Nr. | Kriter (yasal metin) | **Puan** |
|---|---|---|
| 1 | **Kısmi denklik kararı** (Anerkennungsbescheid): niteliğin yurt içi niteliğe *kısmen* denk olduğunun tespiti, ya da düzenlenmiş (reglementiert) bir meslekte Berufsausübungserlaubnis | **4** |
| 2 | **İyi Almanca** — *gute deutsche Sprachkenntnisse* (**B2**) | **3** |
| 3 | **Yeterli Almanca** — *ausreichende* (**B1**) — Nr. 2'den puan alınmıyorsa | **2** |
| 4 | **Kâfi Almanca** — *hinreichende* (**A2**) — Nr. 2 veya 3'ten puan alınmıyorsa | **1** |
| 5 | **İngilizce — CEFR C1** | **1** |
| 6 | Nitelik kazanıldıktan sonra, **son 7 yılda en az 5 yıl** ilgili mesleki deneyim | **3** |
| 7 | Nitelik kazanıldıktan sonra, **son 5 yılda en az 2 yıl** ilgili mesleki deneyim — Nr. 6'dan puan alınmıyorsa | **2** |
| 8 | Nitelik, **§ 18g Abs. 1 S. 2 Nr. 1'deki darboğaz meslek grubuna** (Engpassberuf) ait | **1** |
| 9 | Başvuru anında **35 yaşından büyük değil** | **2** |
| 10 | Başvuru anında **35'ten büyük, 40'tan büyük değil** | **1** |
| 11 | Son 5 yılda Almanya'da **en az 6 ay kesintisiz ve yasal ikamet** (turistik ikamet sayılmaz) | **1** |
| 12 | **Eş / tescilli hayat arkadaşı da** koşulları karşılıyor (birlikte başvuru) | **1** |
| | **Asgari puan: `Die Mindestpunktzahl beträgt sechs Punkte.`** | **≥ 6** |
| | *Teorik maksimum* | *16* |

**Nr. 8 (Engpassberuf) senin için ÇALIŞIYOR — bu tur doğrulandı.** § 18g Abs. 1 S. 2 Nr. 1'in atıf yaptığı darboğaz meslek grupları ISCO-08 kodlarıyla şunlar: **132, 133, 134, 21, 221, 222, 225, 226, 23, 25**. **ISCO 25 = "Information and communications technology professionals"** — yani siber güvenlik / BT niteliği bu gruba girer ve **+1 puan getirir.** (Resmî Alman portalı bu listeyi meslek adlarıyla veriyor: "Akademische Fachkräfte im MINT-Bereich" ve "Führungskräfte in der Erbringung von Dienstleistungen im Bereich Informations- und Kommunikationstechnologie" — ISCO 25 ve 133'ün Almanca karşılıkları.) Önceki turda bu kalem "doğrulanamadı" olarak işaretliydi; **artık kapandı.**

Kaynaklar: [Anlage AufenthG — puan tablosu (gesetze-im-internet.de, bağlayıcı metin)](https://www.gesetze-im-internet.de/aufenthg_2004/anlage.html) · [§ 20b AufenthG](https://www.gesetze-im-internet.de/aufenthg_2004/__20b.html) · [§ 20a AufenthG](https://www.gesetze-im-internet.de/aufenthg_2004/__20a.html) · [Make it in Germany — Chancenkarte](https://www.make-it-in-germany.com/de/visum-aufenthalt/chancenkarte/chancenkarte-zur-jobsuche) · [BA ZAV Newsletter 02/2026](https://www.arbeitsagentur.de/vor-ort/zav/working-and-living-in-germany/newsletter-iss/02-2026/chancenkarte)

### 4.2b Süre, çalışma hakkı, dönüştürme (§ 20a Abs. 2 ve 5)

| Kalem | Detay |
|---|---|
| Such-Chancenkarte süresi | **12 aya kadar** |
| Yan iş | Ortalama **haftada ≤20 saat** |
| Deneme çalışması (Probebeschäftigung) | **İşveren başına 2 haftaya kadar** — nitelikli iş olmalı, ya da eğitime/denklik önlemine yönelik. **BA onayı gerekmez** |
| Nitelikli iş sözleşmesi bulununca | **Folge-Chancenkarte, 2 yıla kadar** — ama *yalnızca* Bölüm 4'teki başka bir izin uymuyorsa. Uyuyorsa § 18a/18b'ye veya Blaue Karte'ye geçilir |
| Yeniden alma | Yeni bir Such-Chancenkarte için önce **eşdeğer süre yurt dışında** geçirmek gerekir |

**Deneme çalışması hükmü modelde eksik olan bir fırsat:** işveren başına 2 hafta, BA onayı olmadan. Bu, portföy/kanıt üretmenin (§5.4) en doğrudan yolu ve aynı zamanda 12 aylık pencerede birden fazla işverenle temas kurma hakkı demek.

### 4.3 Yaygın yanlış bilgiler — düzeltmeler

Bu üç madde piyasadaki çoğu blogda **yanlış** yazıyor; yasadan doğrusu:

1. **İngilizce B2 puan VERMEZ.** İngilizce sadece **C1** seviyesinde 1 puan getirir (§ 20b Abs. 1 Nr. 5). İngilizce B2, yalnızca *asgari dil ön koşulunu* karşılar — puan değeri sıfırdır.
2. **Almanca C1 ekstra puan VERMEZ.** Almanca puanları A2=1 / B1=2 / **B2=3** ile doygunlaşır; C1 için ek puan yoktur. Yani **B2 Almanca, puan sisteminde optimal duraktır.**
3. **Yaş dilimleri:** ≤35 → 2 puan; 35 < yaş ≤ 40 → 1 puan; >40 → 0 puan. ("35–39" değil.)

### 4.4 Dashboard'a gömülecek formül

Dil ve deneyim kriterleri **birbirini dışlar** (mutually exclusive) — yasa bunu açıkça `es sei denn` / `wenn er keine Punkte nach Nummer 6 erhält` ile söylüyor. Doğru implementasyon `max`, toplama değil.

Dikkat: aşağıdaki sürüm, önceki taslaktaki **iki hatayı düzeltiyor** — (a) Kapı B, kısmi denklik varsa düşer (§ 20b Abs. 1 S. 2), yani nitelik kontrolü puan hesabından *sonra* yapılmalı; (b) Yol 1 (Fachkraft) hiç modellenmemişti.

```python
ISCO_ENGPASS = {132, 133, 134, 21, 221, 222, 225, 226, 23, 25}   # 25 = BT/ICT
ALMANCA_PUAN = {"yok":0, "A1":0, "A2":1, "B1":2, "B2":3, "C1":3, "C2":3}  # 3'te doygun
GECIM_ESIGI_2026 = 1091          # €/ay net

def chancenkarte(u):
    # --- KAPI A: geçim — her iki yolda da zorunlu ---
    if u.aylik_kaynak_eur < GECIM_ESIGI_2026:
        return FAIL("Lebensunterhalt 2026 (€1.091/ay)")

    # --- YOL 1: tanınmış Fachkraft — puan yok, dil sertifikası yok ---
    if u.nitelik_tam_taniniyor or u.alman_diplomasi:
        return PASS(yol="Fachkraft", puan=None)

    # --- YOL 2: puan hesabı (§ 20b Abs. 1 + Anlage) ---
    p  = 4 if u.kismi_denklik_karari else 0                    # Nr. 1
    p += ALMANCA_PUAN[u.de_seviye]                             # Nr. 2/3/4 — dışlayıcı
    p += 1 if u.en_seviye >= "C1" else 0                       # Nr. 5 — SADECE C1
    p += 3 if u.deneyim_yil_son7 >= 5 else (
         2 if u.deneyim_yil_son5 >= 2 else 0)                  # Nr. 6/7 — dışlayıcı
    p += 1 if u.isco_grubu in ISCO_ENGPASS else 0              # Nr. 8 — siber = 25 ✓
    p += 2 if u.yas <= 35 else (1 if u.yas <= 40 else 0)       # Nr. 9/10 — dışlayıcı
    p += 1 if u.de_ikamet_ay_son5 >= 6 else 0                  # Nr. 11
    p += 1 if u.es_de_uygun_ve_birlikte else 0                 # Nr. 12

    # --- KAPI B: formel nitelik — kısmi denklik varsa DÜŞER (§20b Abs.1 S.2) ---
    if not u.kismi_denklik_karari:
        if not (u.yabanci_mesleki_egitim_yil >= 2 and u.devlet_taniyor
                or u.yabanci_diploma_taniniyor or u.ahk_belgesi):
            return FAIL("Kapı B: formel nitelik")

    # --- KAPI C: dil eşiği — ASLA düşmez ---
    if not (u.de_seviye >= "A1" or u.en_seviye >= "B2"):
        return FAIL("Kapı C: Almanca A1 veya İngilizce B2")

    return PASS(puan=p) if p >= 6 else FAIL(f"{p}/6 puan")
```

**Yaş sınırı için implementasyon notu:** yasa "nicht älter als 35" diyor; resmî portalın yorumu **35. yaş gününün günü dahil**. Yani `yas < 35` değil, `basvuru_tarihi <= 35_yas_gunu` olarak kodla — naif `int` yaş karşılaştırması bir yıl kaybettirir.

### 4.5 Bu neden modelin en değerli parçası

Bu, D4 (kariyer) boyutu için **uydurma bir 0–10 puanı değil, yasal bir hazırlık skorudur.** Ve doğrudan aksiyona çevrilebilir; puanların marjinal getirisi belli:

- Almanca **B1 → B2**: **+1 puan** (2 → 3). §6'daki Goethe tablosuna göre en pahalı atlama (3 Abendkurs ≈ 216 saat), ama puan sisteminde en yüksek tek kalem olan 3 puanı kilitler.
- **Kısmi denklik başvurusu** (Nr. 1): **+4 puan** — tablonun en büyük tek kalemi, ve *öğrenme değil evrak işi*. Yani düşük çabayla en yüksek puan. Bu, dashboard'ın "en yüksek ROI aksiyonu" olarak öne çıkarması gereken şey.
- **Yaş puanı zamanla azalır (2 → 1 → 0).** Bu, sistemine gerçek bir *aciliyet* terimi sokan tek unsurdur — ve senin "tarihsiz" felsefenin tek meşru istisnası: yaş, kontrol edemediğin monoton azalan bir puan bileşenidir. Dashboard'da "36 yaşında −1 puan, 41 yaşında −1 puan daha" şeklinde gösterilmeli.

### 4.6 Chancenkarte sadece arama iznidir — asıl kapı maaş eşikleridir

Bu, modelde tamamen eksik olan boyut. Chancenkarte 12 ay iş *aramanı* sağlar; işe girdikten sonra kalman **başka bir izne** ve o iznin **maaş eşiğini geçmene** bağlı. Ve burada senin hedef pozisyonun eşiğe *tam sınırda* oturuyor.

**2026 maaş eşikleri.** Kaynak: BMI Bekanntmachung 2.12.2025 (BAnz AT 18.12.2025 B3); 2026 BBG allgemeine Rentenversicherung = €101.400. Aşağıdaki üç satırı resmî federal portaldan **doğrudan doğruladım**:

| Yol | Yasal dayanak | **2026 brüt/yıl** | % BBG | BA onayı |
|---|---|---|---|---|
| Blaue Karte EU, genel | § 18g Abs. 1 S. 1 | **€50.700,00** | 50% | Hayır |
| Blaue Karte EU, **darboğaz meslek** (ISCO 25 = BT dahil) | § 18g Abs. 1 S. 2 Nr. 1 | **€45.934,20** | 45,3% | **Evet** |
| Blaue Karte EU, **yeni mezun** (diploma ≤3 yıl, her meslek grubunda) | § 18g Abs. 1 S. 2 Nr. 2 | **€45.934,20** | 45,3% | **Evet** |
| **Blaue Karte EU — DİPLOMASIZ BT uzmanı** | § 18g Abs. 2 | **€45.934,20** | 45,3% | **Evet** |
| Deneyime dayalı nitelikli çalışma | § 19c Abs. 2 + § 6 BeschV | **€45.630,00** | 45% | **Evet** |
| İlk § 18a/18b izninde 45 yaş üstü | § 18 Abs. 2 Nr. 5 | **€55.770,00** | 55% | — |

**Junior SOC maaş bandı (StepStone, 2026):** alt **€41.300** · **medyan €48.200** · üst **€58.100**. Şehir bazında: Stuttgart €54.300, Hamburg €52.500, Berlin €51.100, Bonn €50.900, Düsseldorf €50.600, Dresden €49.700.

> **Modele girmesi gereken kritik çakışma:** medyan junior SOC maaşı (**€48.200**) indirimli Blaue Karte eşiğini (€45.934,20) **geçiyor**, ama genel eşiği (€50.700) **geçmiyor.** Bandın altı (€41.300) **hiçbirini** geçmiyor — ve işveren tarifeye bağlı değilse § 6 BeschV'nin €45.630'unu da kaçırıyor.
>
> Pratik sonucu: **ilk siber güvenlik işin gerçekçi olarak standart Blaue Karte'den değil, darboğaz-meslek / BT hükümlerinden geçer.** Yani maaş, "olsa iyi olur" bir çıktı değil, **sert bir kısıttır** ve dashboard'da öyle modellenmelidir. Aynı zamanda şehir seçimi bir kaldıraç: Stuttgart/Hamburg/Berlin medyanları genel eşiğe çok daha yakın.

**§ 6 BeschV — kendi kendine öğrenen için en düşük eşikli yol.** [§ 6 BeschV](https://www.gesetze-im-internet.de/beschv_2013/__6.html) şunları ister: son **5 yılda ≥2 yıl** ilgili deneyim; maaş **≥€45.630** (*işveren tarifeye bağlıysa ve toplu sözleşme uyguluyorsa bu şart tamamen düşer*); ve devlet tarafından tanınan bir yeterlik. **Ama iki BT istisnası bu yolu dramatik biçimde açıyor:**

1. § 6 Abs. 1 Satz 3 birebir şöyle diyor: *"In Berufen auf dem Gebiet der Informations- und Kommunikationstechnologie findet Satz 1 Nummer 3 keine Anwendung"* — yani **BT mesleklerinde formel nitelik şartı hiç uygulanmaz.**
2. **Almanca B1 şartı 1 Mart 2024 reformuyla kaldırıldı**; güncel metinde hiçbir dil şartı yok. (Aynı reform deneyimi 3→2 yıla, pencereyi 7→5 yıla, maaş tabanını %60→%45 BBG'ye indirdi.)

**§ 18g Abs. 2 — diplomasız BT uzmanı Blaue Karte'si.** Resmî portaldan doğruladığım şartlar: BT alanında **somut iş teklifi**, süre **≥6 ay**; brüt **≥€45.934,20**; **son 7 yılda ≥3 yıl** BT deneyimi, ve bu deneyimin **yükseköğrenim düzeyinde** olması. **Yasada Almanca şartı yok.** Bu, diploması olmayan biri için en güçlü yol.

**Ve doğrudan doğrulayıp bulduğum, hiçbir yerde vurgulanmayan kalem — dil, kalıcı oturuma da bağlı:** Blaue Karte sahibi **27 ayda** Niederlassungserlaubnis (kalıcı oturum) alabilir, ama **Almanca B1 kanıtlarsa 21 ayda** alır. Yani **B1, altı ay daha erken kalıcı oturum demek.** §6'daki dil ETA'sının yanına bu getiriyi yaz: Almanca artık üç ayrı yerde para/zaman kazandırıyor — Chancenkarte puanı (B2'de 3 puan), iş bulma kapısı (§5.6'da B2 taban), ve kalıcı oturum takvimi (B1'de −6 ay).

**Denklik (Anerkennung) durumu — iki ayrı soru, karıştırılıyor.** BT **Almanya'da düzenlenmiş (reglementiert) bir meslek DEĞİLDİR**: Fachinformatiker veya BT güvenlik analisti olarak çalışmak için hiçbir denklik gerekmez. **Ama §§ 18a/18b yolundan oturum izni almak için denklik gerekir.** Yetkili kurumlar: mesleki yeterlikler için **IHK FOSA** (Fachinformatiker dahil), akademik diplomalar için **ZAB** (Zeugnisbewertung / anabin). § 6 BeschV ve § 18g Abs. 2 yolları bu şartı baypas ettiği için, denklik senin durumunda *zorunlu değil, sadece bir seçenek* — ve §4.5'te söylediğim gibi 4 puanlık en yüksek ROI kalemi.

Kaynaklar: [Make it in Germany — Blaue Karte EU](https://www.make-it-in-germany.com/de/visum-aufenthalt/arten/blaue-karte-eu) *(doğrudan doğrulandı, 2026 tutarları)* · [BMI Bekanntmachung, BAnz AT 18.12.2025 B3](https://www.bundesanzeiger.de/pub/publication/REViP4bN6jVdpGxPaiQ/content/REViP4bN6jVdpGxPaiQ/BAnz%20AT%2018.12.2025%20B3.pdf?inline=) · [§ 6 BeschV](https://www.gesetze-im-internet.de/beschv_2013/__6.html) · [StepStone — Junior Cyber Security Analyst maaşı](https://www.stepstone.de/gehalt/Junior-Cyber-Security-Analyst.html) · [anerkennung-in-deutschland.de](https://www.anerkennung-in-deutschland.de/html/de/fachkraefte.php)

### 4.7 Türk vatandaşları için özel durum — ARB 1/80 yanılgısı

Türkiye vizeye tabi üçüncü ülke; **çalışmak üzere ilk girişte olağan üçüncü-ülke kuralları tam olarak geçerlidir** ve Chancenkarte aynı koşullarla açıktır.

**AET–Türkiye Ortaklık Hukuku (ARB 1/80) ilk giriş hakkı VERMEZ.** Bu, Türk vatandaşları arasında en yaygın yanlış beklentidir. ARB 1/80'in korumaları — otomatik/deklaratif oturum hakkı, kademeli işgücü piyasası erişimi — yalnızca Almanya'da **yasal ve düzenli istihdam başladıktan sonra** doğar. Yani planlamada sıfır değeri var, ama **işe girdikten sonra** izin yenilemede ve iş değiştirmede gerçekten değerli. Modelde bunu "başvuru öncesi avantaj" olarak saymamak, "istihdam sonrası güvence" olarak not etmek doğru olur.

Kaynak: [Integrationsbeauftragte — Assoziationsrecht EWG-Türkei](https://www.integrationsbeauftragte.de/ib-de/ich-moechte-mehr-wissen-ueber/visum/assoziationsrecht-ewg-tuerkei-1872756)

---

## 5. Rubric Anchors — 0–10 puanının gözlemlenebilir tanımı

§3.4'te gördük: çapasız öz-değerlendirme objektif performansla r ≈ .29 korelasyon gösteriyor. Bu bölüm o problemi çözer.

### 5.1 Hangi framework'ü çapa alacağız — ve neden SFIA

Kritik bulgu: **NICE Framework kendi yeterlik (proficiency) ölçeğini yayımlamıyor — SFIA'nın Levels of Responsibility'sini resmen benimsedi.** Bu, tüm rubriğin omurgası olduğu için iki aşamada belgeliyorum.

**Aşama 1 — tavsiye (2022).** NIST'in Kongre'ye sunduğu *Measuring Cybersecurity Workforce Capabilities: Defining a Proficiency Scale for the NICE Framework* raporunun birinci tavsiyesi:

> "Establish a workplace-focused NICE Framework proficiency scale that is **modeled after the SFIA Levels of Responsibility** and incorporates criteria of supervision, complexity, professional skills, knowledge, and influence…"

**Aşama 2 — benimseme (2026).** NIST'in NICE Framework Resource Center sayfası (oluşturma 23 Ocak 2026, güncelleme 13 Mart 2026) artık SFIA'yı ölçek olarak doğrudan sahipleniyor:

> "The **SFIA levels of responsibility are a type of proficiency scale** that represents increasing expertise and responsibility in professional roles at seven levels… to be effective in a role, you must be able to perform that role at the required level of impact."

Ve en kritik parça — **ortak NICE↔SFIA "levelled roles" eşlemesi** (SFIA Foundation, Protection & Defense kategorisi) bizim tam olarak ihtiyaç duyduğumuz sayıyı veriyor:

> **Defensive Cybersecurity** — Cyber Defense Analyst **SFIA 2** · Cyber Defense Analyst **SFIA 3** · Senior Cyber Defense Analyst **SFIA 4** · Lead Cyber Defense Analyst **SFIA 5**

Bu tek satır, §5.3'teki kalibrasyonu *benim yorumum* olmaktan çıkarıp **resmî eşlemeye** dayandırıyor: junior/L1 SOC analisti = SFIA 2–3. Senior = 4. Lead = 5.

Aynı 2022 raporu, işyeri odaklı yeterlik ölçeklerinin taşıması gereken üç özelliği listeliyor — bunlar bizim rubrik kolonlarımız olmalı:
- **Demonstrative:** yeterlik nasıl kanıtlanır?
- **Supervision:** bu seviyede ne kadar ve ne tür gözetim gerekir?
- **Professional skills:** hangi soft/employability becerileri?

**Kod değişikliği uyarısı — eski kaynaklar yanıltıyor.** NICE Framework Components'ın güncel sürümü **v2.2.0 (28 Nisan 2025)** ve SOC iş rolü yeniden adlandırılıp yeniden kodlandı: eski `PR-CDA-001` / OPM 511 "Cyber Defense Analyst" artık **`PD-WRL-001` "Defensive Cybersecurity"**. Resmî tanımı: *"Responsible for analyzing data collected from various cybersecurity defense tools to mitigate risks."* Rol 43 Task statement taşıyor; rubrik kanıtı olarak doğrudan kullanılabilecek olanlar:

| Task ID | Statement (resmî metin) | Rubrikte nereye düşer |
|---|---|---|
| T1084 | Identify anomalous network activity | Networking 4–6 |
| T1112 | Validate network alerts | SIEM 4 |
| T1299 | Determine causes of network alerts | SIEM 6 |
| T1347 | Detect cybersecurity attacks and intrusions | Windows/AD 6 |
| **T1348** | **Distinguish between benign and potentially malicious** cybersecurity attacks and intrusions | Windows/AD 6 — *yanlış pozitif ayırt etme, S=6'nın kalbi* |
| T1350 | Perform continuous monitoring of system activity | Linux 4–6 |
| T1351 | Determine impact of malicious activity on systems and information | Linux 6 |
| T1386 | Analyze network traffic anomalies | Networking 6 |
| T1387 | Validate intrusion detection system alerts | Networking 6 |
| **T1406** | **Construct cyber defense network tool signatures** | Networking 6 — *kural yazma* |
| **T0020** | **Develop content for cyber defense tools** | SIEM 6 — *kendi tespitini yazma* |
| T1241 | Document cybersecurity incidents | SIEM 4 |
| T1242 | Escalate incidents that may cause ongoing and immediate impact | SIEM 4 |

Ayrıca NICE'ın **11 Competency Area**'sı (Mart 2024'te eklendi, NISTIR 8355'te tanımlı) boyut kontrol listesi olarak kullanılabilir: Access Controls · AI Security · Asset Management · Cloud Security · Communications Security · Cryptography · Cyber Resiliency · DevSecOps · OS Security · OT Security · Supply Chain Security.

Kaynaklar: [NIST — Identifying Proficiency in the NICE Framework](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/identifying-proficiency-nice-framework) · [SFIA/NICE levelled roles — Protection & Defense (PDF)](https://sfia-online.org/en/news/nice-combine-7-work-role-categories-1.pdf) · [SFIA — NICE visualisations](https://sfia-online.org/en/tools-and-resources/sfia-views/sfia-view-information-cyber-security/nice-visualisations) · [NICCS — Defensive Cybersecurity (PD-WRL-001)](https://niccs.cisa.gov/tools/nice-framework/work-role/defensive-cybersecurity) · [NICE Framework Components v2.2.0](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/current-version) · [NIST — Defining a Proficiency Scale (PDF)](https://www.nist.gov/system/files/documents/2023/10/05/NIST%20Measuring%20Cybersecurity%20Workforce%20Capabilities%207-25-22.pdf)

### 5.2 SFIA 9 — 7 sorumluluk seviyesi (resmî metinden)

SFIA 9, her seviyeyi beş **generic attribute** üzerinden tanımlar: **Autonomy** (bağımsızlık/hesap verebilirlik), **Influence** (kararlarının erişimi), **Complexity** (görevlerin karmaşıklığı), **Knowledge**, **Business skills / behavioural factors**. Kural katı: *"bir beceriyi Seviye 4'te sergilediği söylenecekse, kişi Seviye 4 için tanımlanmış autonomy, influence ve complexity düzeyini de sergilemek zorundadır."*

Seviyelerin resmî "essence of the level" metinleri:

| SFIA | Ad | Özü (sfia-online.org) |
|---|---|---|
| 1 | **Follow** | "Yakın gözetim altında rutin görevleri yapar, talimatları izler, işini tamamlamak için rehberliğe ihtiyaç duyar. Temel beceri ve bilgiyi öğrenir ve uygular." |
| 2 | **Assist** | "Başkalarına yardım sağlar, rutin gözetim altında çalışır, rutin problemleri ele almak için kendi takdirini kullanır. Eğitim ve iş başında deneyimle aktif olarak öğrenir." |
| 3 | **Apply** | "Çeşitli, kimi zaman karmaşık ve rutin olmayan görevleri standart yöntem ve prosedürlerle yapar. Genel yönlendirme altında çalışır, takdir kullanır ve kendi işini teslim tarihleri içinde yönetir." |
| 4 | **Enable** | "Çeşitli karmaşık faaliyetler yürütür, başkalarını destekler ve yönlendirir, uygun olduğunda görev devreder, genel yönlendirme altında özerk çalışır." |
| 5 | **Ensure, advise** | "Alanında otoriter rehberlik sağlar, geniş yönlendirme altında çalışır. Analizden uygulamaya ve değerlendirmeye kadar önemli iş sonuçlarını teslim etmekten sorumludur." |
| 6 | **Initiate, influence** | "Önemli örgütsel etkiye sahiptir, üst düzey kararlar alır, politikaları şekillendirir." |
| 7 | **Set strategy, inspire, mobilise** | Vizyon ve strateji belirler. |

**Sürüm notu:** SFIA 9 Ekim 2024'te yayımlandı ve Ağustos 2026 itibarıyla hâlâ güncel sürüm. SFIA 10 "In Development" statüsünde ve **Q4 2027** için planlanıyor — yani bekleme, SFIA 9'a çapala.

Kaynak: [SFIA 9 — Levels of responsibility](https://sfia-online.org/en/sfia-9/responsibilities) · [How SFIA works](https://sfia-online.org/en/about-sfia/how-sfia-works) · [Generic attributes](https://sfia-online.org/en/sfia-9/responsibilities/generic-attributes-business-skills-behaviours/generic-attributes-a-z)

### 5.2b Bizi ilgilendiren iki seviyenin tam generic attribute metni

Junior SOC hedefi SFIA 2–3 olduğu için, sadece bu iki seviyenin tam metnini veriyorum. **0–10 ölçeğinin 4 ve 6 puanının gerçek tanımı budur** — geri kalan her şey bunun teknik somutlaştırması.

| Attribute | **Seviye 2 (Assist) → S=4** | **Seviye 3 (Apply) → S=6** |
|---|---|---|
| **Autonomy** | "Works under routine direction. Receives instructions and guidance, has work regularly reviewed." | "Works under **general direction** to complete assigned tasks. Receives guidance and has work reviewed **at agreed milestones**." |
| **Influence** | "Is expected to contribute to team discussions with immediate team members." | "Works with and influences team decisions. Has a transactional level of contact with people outside their team." |
| **Complexity** | "Performs a range of work activities in varied environments." | "Performs a range of work, **sometimes complex and non-routine**, in varied environments." |
| **Knowledge** | "Applies knowledge of common workplace tasks and practices to support team activities **under guidance**." | "Applies knowledge of a range of **role-specific practices** to complete tasks within defined boundaries and has an appreciation of how this knowledge applies to the **wider business context**." |
| **Problem-solving** | "Investigates and resolves **routine** issues." | "Applies a **methodical approach** to investigate and evaluate options to resolve routine **and moderately complex** issues." |
| **Decision-making** | "Uses **limited** discretion… Decides **when to seek guidance** in unexpected situations." | "Uses discretion in identifying and responding to complex issues… **Determines when issues should be escalated**." |

> **Dashboard'a çıkarılacak tek cümle:** S=4 ile S=6 arasındaki fark *daha çok araç bilmek değil*, **"rutin olmayan bir vakada metodik yaklaşım kurup ne zaman escalate edeceğine kendi karar verebilmek."** Rubrik kriterlerini yazarken test bu: "bu kriteri sağlayan kişi, kendisine söylenmeden mi karar veriyor?"

### 5.2c SFIA 9 Security operations (SCAD) — seviye seviye resmî metin

Bu, dört çekirdek becerimizin *hepsinin* üstünde duran şemsiye SFIA becerisi ve **1–6 seviyeleri arasında tanımlıdır** (7'de tanımlı değil — SFIA bunu açıkça belirtiyor: o seviye "bu becerinin kapsamının ötesinde stratejik liderlik" gerektirir). Aşağıdaki metinler sfia-online.org'dan **doğrudan doğrulandı**:

| SFIA | S | Resmî metin |
|---|---|---|
| 1 | 2 | "Performs **simple** security administration tasks. Maintains relevant records and documentation, contributing to overall data integrity." |
| **2** | **4** | "Receives and responds to **routine** requests for security support. **Maintains records and effectively communicates actions taken.** Assists in the investigation and resolution of issues relating to security systems using **basic diagnostic tools and techniques**. **Documents incident and event information and generates reports** on exceptions and security events. Contributes to management reporting processes." |
| **3** | **6** | "Investigates **minor security breaches** using established procedures, incorporating analytical tools and techniques. Performs **non-standard** operational security tasks adapting to evolving technologies and threat landscapes. Addresses and resolves a variety of security events **to maintain system integrity and operational continuity**." |
| 4 | 8 | "Maintains and **optimises** operational security processes. Checks that all requests for support are dealt with according to established protocols… Investigates security breaches in accordance with established procedures using **advanced** tools and techniques and **recommends necessary corrective actions**. Enables effective implementation of recommended security measures and **monitors their performance**." |
| 5 | 9–10 | "**Oversees** security operations procedures, ensuring adherence and effectiveness, including cloud security practices and automated threat responses… Contributes to the **creation and maintenance of security policies, standards and procedures** integrating new compliance requirements and technology advances." |

**SFIA'nın kendi "guidance notes"u — SOC işinin resmî kapsam listesi.** Bu, beceri listesini doğrulamak için elimizdeki en otoriter tek liste; senin dört çekirdek becerinin dışında ne kaldığını gösterir:

> güvenlik kontrollerinin uygulanması ve zorlanması (on-prem, bulut, otomatikleştirilmiş ortamlar) · **SIEM, IDS/IPS ve firewall** gibi güvenlik araçlarının kullanımı + operasyonları hızlandırmak için **otomasyon** · **tehdit istihbaratı üzerine aksiyon alma** · rutin **zafiyet değerlendirmesi**, ilgili log/alert/event'lerin izlenmesi ve analizi, ticket veya telefonla gelen olaylara müdahale · güvenlik sorunlarının hızlı analizi ve remediasyonu · mevzuat uyumu, güvenlik politikalarına uyum, standart operasyon prosedürlerinin sürdürülmesi · **doğru güvenlik kaydı ve dokümantasyonu tutmak** · kriptografi ve sertifika yönetimi · kapsamlı gözetim için ileri raporlama teknikleri

Modelinde eksik olması muhtemel iki kalem burada net görünüyor: **otomasyon (SOAR)** ve **dokümantasyon/raporlama**. İkincisi SFIA 2'de *zaten* zorunlu bir sorumluluk ("documents… and generates reports") — yani junior seviyede bile yazma becerisi teknik beceriyle eşit ağırlıkta ve §5.6'daki Alman ilanlarının "Dokumentation und Eskalation" şartıyla birebir örtüşüyor. Modelde puanlanan bir boyut değilse eklenmeli.

Not: SFIA 9, eski SCAD becerisini **Security operations** ve **Identity and access management** olarak ikiye ayırdı; 1–6 seviyelerinin tamamının metni yeniden yazıldı. Eski SFIA 8 kaynaklarına ve o kaynaklara dayanan üçüncü taraf eşlemelerine bakarken buna dikkat.

**Diğer SOC becerileri — junior seviyelerin resmî metni:**

| SFIA becerisi | Seviye 2 (S=4) | Seviye 3 (S=6) |
|---|---|---|
| **Incident management** | "Provides **first line** investigation. Gathers information to enable incident resolution and allocates incidents according to established procedures. Escalates incidents as necessary." | "**Prioritises and diagnoses** incidents applying agreed procedures and tools. Investigates causes of incidents and seeks resolution. Escalates unresolved incidents." |
| **Threat intelligence** | "Contributes to **routine** threat intelligence gathering tasks. Monitors and detects potential security threats and escalates." | "Performs routine threat intelligence gathering tasks. **Transforms collected information into a data format that can be used** for operational security activities." |
| **Vulnerability assessment** | "Undertakes **low-complexity routine** vulnerability assessments using automated and semi-automated tools. Escalates issues where appropriate." | "Follows standard approaches to perform **basic** vulnerability assessments for **small** information systems." |
| **Digital forensics** | "**Assists** with digital forensic investigations under routine supervision. Helps collect and preserve digital information and evidence according to established protocols." | "Applies **standard forensic tools** and techniques to examine digital devices… **Maintains the integrity of digital evidence** and ensures its collection adheres to legal admissibility standards." |

Bu dört satır, modelin beceri listesini genişletmek istersen hazır çapalar. Özellikle **Threat intelligence SFIA 3 = "topladığın bilgiyi operasyonel olarak kullanılabilir veri formatına çevirmek"** — bu, "haber okuyorum" ile "IOC listesi üretip SIEM'e besliyorum" arasındaki farkın resmî ifadesi ve S=6 kriteri olarak birebir kullanılabilir.

Kaynaklar: [SFIA 9 — Security operations](https://sfia-online.org/en/sfia-9/skills/security-operations) · [Incident management](https://sfia-online.org/en/sfia-9/skills/incident-management) · [Threat intelligence](https://sfia-online.org/en/sfia-9/skills/threat-intelligence) · [Vulnerability assessment](https://sfia-online.org/en/sfia-9/skills/vulnerability-assessment) · [Digital forensics](https://sfia-online.org/en/sfia-9/skills/digital-forensics) · [Level 2](https://sfia-online.org/en/sfia-9/responsibilities/level-2) · [Level 3](https://sfia-online.org/en/sfia-9/responsibilities/level-3)

### 5.3 0–10 ↔ SFIA eşlemesi — ve modelin en önemli kalibrasyonu

| S (0–10) | SFIA | Anlamı | Gözetim ihtiyacı |
|---|---|---|---|
| 0–1 | — | Hiç temas yok / sadece terimleri duymuş | — |
| **2** | **1 · Follow** | Adım adım runbook'u takip edebilir; kendi başına karar vermez | Yakın gözetim |
| **4** | **2 · Assist** | Rutin vakaları kendi takdiriyle çözer; alışılmadıkta yükseltir | Rutin gözetim |
| **6** | **3 · Apply** | Rutin olmayan, kimi zaman karmaşık işleri standart prosedürle bağımsız yapar; kendi işini yönetir | Genel yönlendirme |
| **8** | **4 · Enable** | Karmaşık işleri özerk yapar, başkalarını yönlendirir, prosedürü kendi yazar | Genel yönlendirme, özerk |
| **9–10** | **5 · Ensure, advise** | Alanda otoriter referans; analiz→uygulama→değerlendirme zincirinden sorumlu | Geniş yönlendirme |

> **Bu tablonun en önemli sonucu — R_hedef'i düşür.**
> Junior / L1 SOC analisti pozisyonu **SFIA 2–3** seviyesidir, yani senin ölçeğinde **S ≈ 4–6**. Bu benim tahminim değil: §5.1'deki resmî SFIA/NICE levelled-roles eşlemesi "Cyber Defense Analyst"ı SFIA 2 *ve* 3'te, "Senior"u 4'te, "Lead"i 5'te konumlandırıyor. SFIA 4 (S≈8) zaten *senior* analist / detection engineer bölgesidir. Dolayısıyla `R_target` her boyutta 9–10 hedefleyecek şekilde kurulmuşsa, model **sistematik olarak ulaşılamaz bir hedef** gösteriyor ve §7.2'deki ruminasyon tuzağını kendi eliyle kuruyor. Doğru hedef profili: çekirdek becerilerde **6**, destekleyici becerilerde **4**, bir veya iki "vitrin" becerisinde **8**.
>
> **Dört sağlam 6 elde etmeden 8'lerin peşine düşme.** İşe girmeyi geciktiren şey 8'lerin eksikliği değil, 6'ların düzensizliği.

### 5.3b İki bağımsız çapa daha — ve SFIA ile şaşırtıcı örtüşmesi

**Dreyfus modeli (Stuart Dreyfus, 2004).** Beş aşama: Novice → Advanced Beginner → Competent → Proficient → Expert. Denklemi yok, dört kolonlu bir sınıflandırma. Ölçme aracı olarak kullanılamaz — "expertise" ve "intuition" için operasyonel tanım vermediği eleştirisi (Effken; Peña 2010 derlemesi) tam olarak bu yüzden haklı. Ama **bir kolonu, hiçbir puanın veremediği bir teşhis sağlıyor: Commitment (bağlılık).**

| Aşama | Karar verme | **Bağlılık** |
|---|---|---|
| 1 Novice | Analitik | Kopuk (detached) |
| 2 Advanced Beginner | Analitik | Kopuk |
| **3 Competent** | Analitik | Anlama ve karar kopuk, **ama SONUCA DAHİL** |
| 4 Proficient | Analitik karar, **sezgisel anlama** | Anlamaya dahil |
| 5 Expert | **Sezgisel** | Dahil |

> **Örtüşme dikkat çekici.** §5.2b'de SFIA 2 → 3 geçişinin özünü "kendisine söylenmeden karar verebilmek, ne zaman escalate edeceğini kendi belirlemek" olarak bulmuştuk. Dreyfus'ta 2 → 3 geçişi tam olarak **sonucun sorumluluğunu üstlenmek**. İki bağımsız framework, junior SOC eşiğini aynı yere koyuyor: **eşik teknik bilgi miktarı değil, sonucu sahiplenme.**
>
> Bu, dashboard'a bir puan olarak değil, **bir öz-kontrol sorusu** olarak girmeli: *"Bu vakada playbook'u mu takip ettim (kopuk), yoksa triage sonucunu ben mi sahiplendim (dahil)?"* Bir sayının asla yakalayamayacağı ayrım bu.

Anlatısal etiket olarak kullanılabilir eşleme: 0–2 Novice · 3–4 Advanced Beginner · 5–6 Competent · 7–8 Proficient · 9+ Expert.

**Bloom'un gözden geçirilmiş taksonomisi (Anderson & Krathwohl, 2001)** ise "bu sayıyı hangi kanıt haklı çıkarır" sorusunu çözer. Yapısal kural: **bir hedef = fiil (bilişsel süreç) + nesne (bilgi).** Altı seviye ve kendi terimleriyle alt süreçleri:

| Seviye | Bilişsel süreçler (yazarların kendi terimleri) |
|---|---|
| Remember | recognizing, recalling |
| Understand | interpreting, exemplifying, classifying, summarizing, inferring, comparing, explaining |
| Apply | executing, implementing |
| Analyze | **differentiating, organizing, attributing** |
| Evaluate | checking (coordinating, detecting, monitoring, testing), critiquing |
| Create | generating (hypothesizing), planning (designing), producing |

**Siber güvenliğe çevrilmiş fiil merdiveni — §5.4'ün rubrik hücrelerinin arkasındaki mantık budur:**

| S | Fiil | Somut örnek |
|---|---|---|
| 1–2 | **recall** | Sigma kural sözdizimini hatırlar |
| 3–4 | **explain** | Bir tespitin neden tetiklendiğini açıklar |
| 5–6 | **execute** | Bir triage playbook'unu yardımsız uygular |
| 7–8 | **differentiate + attribute** | Doğru/yanlış pozitifi ayırır, aktiviteyi bir tekniğe atfeder |
| 9–10 | **generate + critique** | Yeni tespit kuralı üretir, mevcut birini eleştirir |

Uyarı (Stanny 2016): aynı fiil farklı yayımlanmış listelerde farklı seviyelerde görünüyor — yani **fiil tek başına seviyeyi garanti etmez**, nesne ve bağlam belirleyici. Bu yüzden §5.4'teki hücreler fiil + araç + çıktı üçlüsüyle yazıldı, sadece fiille değil.

Kaynak: [Dreyfus (2004), *Bulletin of Science, Technology & Society* 24(3), PDF](https://huntercorry.com/dreyfus-2004-the-five-stage-model-of-adult-skill-acquisition.pdf) · [Peña (2010), *Medical Education Online* — eleştiriler](https://pmc.ncbi.nlm.nih.gov/articles/PMC2887319/) · [Iowa State CELT — revize Bloom](https://www.celt.iastate.edu/instructional-strategies/effective-teaching-practices/revised-blooms-taxonomy/blooms-revised-taxonomy-model/) · [CSUDH — 19 bilişsel süreç tablosu (PDF)](https://www.csudh.edu/Assets/csudh-sites/academic-affairs/docs/assessment-student-learning/revised-blooms-handout.pdf)

### 5.4 Uygulanabilir rubrik — dört çekirdek beceri

Format her hücrede aynı: **[Yapabildiğim gözlemlenebilir şey] + [kanıt]**. Kanıt alanı boşsa puan girilemez (§7.7 kural 2).

> Not: **Seviye ölçeği** SFIA/NICE kaynaklıdır (§5.1–5.2c). Aşağıdaki teknik somutlaştırmalar, o seviye tanımlarının SOC bağlamına çevrilmesidir ve mümkün olan her yerde bir NICE Task ID'sine, SFIA descriptor'ına veya yayımlanmış müfredat modülüne çapalanmıştır. Kanıt alanı boşsa puan girilemez.
>
> **Kritik tasarım kuralı — kriterler "biliyorum" değil "yaptım" formunda.** Her hücre, *dışarıdan doğrulanabilir bir çıktı* üretmeyi şart koşar. §3.4'teki r ≈ .29 problemi ancak böyle kapanır.

#### Networking

| S | Gözlemlenebilir kriter | Framework çapası |
|---|---|---|
| 2 | OSI katmanlarını sayar; **en yaygın ~15 portu bakmadan** protokole eşler; `ping`/`traceroute`/`nslookup` çıktısını okur; TCP 3-way handshake'i açıklar | SFIA 1 · roadmap.sh *Networking Knowledge* · Security+ SY0-701 D3 |
| **4** | **Tanımadığı** bir pcap'i Wireshark'ta açar, display filter uygular (`http.request.method=="POST" && ip.dst==10.0.0.5`), TCP stream'i takip eder, istenen host/URI'yi ve varsa cleartext credential'ı çıkarır. Bir /24'ü **elle** /26'lara böler | SFIA 2 SCAD "basic diagnostic tools" · THM SOC L1 M4 · HTB *Intro to Network Traffic Analysis* (15 bölüm) |
| **6** | Ham pcap + **hiç ipucu yok**: beacon'ı aralık düzenliliği + jitter'dan tanır, DNS tunneling'i subdomain entropisi / TXT hacminden çıkarır ve **çalışan bir Suricata/Snort kuralı yazıp tetiklendiğini doğrular**. O kural için **bir yanlış pozitif sınıfı** adlandırır | SFIA 3 SCAD "non-standard operational security tasks" · **NICE T1406** (signature construction), T1386, T1387 |
| 8 | Bir sensör kural setini filo genelinde tune eder ve **ölçülmüş öncesi/sonrası FP oranı** gösterir; TAP vs SPAN yerleşimi savunur; JA3/JA4 + Zeek `ssl.log`/`conn.log` ile şifreli trafik analizi | SFIA 4 SCAD "advanced tools" · Splunk SPLK-5001 D3 · SOC-CMM *Network Monitoring* olgunluk 3–4 |
| 9–10 | ATT&CK tekniği başına gereken ağ telemetrisini tanımlar; ağ tespit stratejisinin sahibi, başkalarının kurallarını review eder | SFIA 5 SCAD · SOC-CMM *Detection Engineering & Validation* ≥4 |

#### Linux

| S | Gözlemlenebilir kriter | Framework çapası |
|---|---|---|
| 2 | Dosya sistemi gezinir, `grep`/`less`/`find` kullanır; `/etc/passwd` vs `/etc/shadow` farkını açıklar; `rwx` bitlerini okur | SFIA 1 · roadmap.sh *Operating Systems* |
| **4** | Canlı host'u SSH üzerinden triage eder: `last`, `who`, `ps aux --forest`, `ss -tulpn`, `crontab -l`, `journalctl -u sshd --since`; `/var/log/auth.log`'dan başarısız-login patlamasını `grep`+`awk` ile çıkarır | SFIA 2 Incident mgmt "first line investigation" · THM SOC L1 **M8 Linux Security Monitoring** · DE iş ilanları: "Linux-Systeme, Log-Analyse" |
| **6** | **Sıralı tablo üreten bir pipeline yazar** (örn. 1 saatlik pencerede başarısız SSH auth'a göre top kaynak IP'ler) ve **her aşamasını açıklar**; persistence'ı systemd unit + cron + `~/.bashrc` + SUID binary'ler arasında bulur; auditd'den process tree'yi yeniden kurar | SFIA 3 Incident mgmt "prioritises and diagnoses"; SCAD L3 · **NICE T1350, T1351** · BTL1 Digital Forensics + IR |
| 8 | Yeniden kullanılabilir triage script'i / Velociraptor artifact'ı yazar; **adlandırılmış ATT&CK teknik kapsamı** veren bir auditd baseline'ı belirtir | SFIA 4 · BTL2 *Threat Hunting* · DE Maturity Matrix Technology = Managed |
| 9–10 | Kurum çapında Linux telemetri standardının sahibi; boşlukları saptar ve kapsamı doğrular | SFIA 5 · SOC-CMM *Use Case Management* ≥4 |

#### Windows / Active Directory

| S | Gözlemlenebilir kriter | Framework çapası |
|---|---|---|
| 2 | Domain / DC / OU / GPO'yu açıklar; Event Viewer'da Security log'u bulur; Sysmon'un ne olduğunu bilir | SFIA 1 · BTL1 *Security Fundamentals → Active Directory* |
| **4** | **Bakmadan** eşler ve yorumlar: 4624 (LogonType 3 vs 10), 4625, 4672, 4688 + komut satırı, 4768/4769 Kerberos TGT/TGS, 7045 servis kurulumu, Sysmon 1/3/7/8/11. **4688 komut satırı denetiminin neden açılması gerektiğini** açıklar | SFIA 2 · HTB *Windows Event Logs & Finding Evil* (6) · THM SOC L1 **M7 Windows Security Monitoring** |
| **6** | **En az dört adlandırılmış AD saldırısını uçtan uca** tespit eder ve açıklar — Kerberoasting (4769 + RC4 encryption type + hesap başına ticket hacmi), AS-REP roasting, DCSync (4662 + replication extended-right GUID'leri), Pass-the-Hash (4624 NTLM / LogonType 9) — her biri için **log kaynağı + sorgu + bir yanlış pozitif sınıfı** söyler | SFIA 3 SCAD · **NICE T1348** ("benign vs malicious ayırt etme"), T1347 · HTB *Windows Attacks & Defense* (16) + *Detecting Windows Attacks with Splunk* (23) |
| 8 | Bu saldırıları kapsayan Sigma kural seti yazar, ATT&CK Navigator kapsam katmanı üretir, Atomic Red Team ile emülasyon yapıp **tespitlerin tetiklendiğini kanıtlar** | SFIA 4 · BTL2 *Threat Hunting* · MAD20 Adversary Emulation · DE Matrix Detection = Managed |
| 9–10 | Ortam başına **ölçülmüş ATT&CK kapsamı** olan AD tespit programının sahibi | SFIA 5 · DE Matrix *Optimized* ("KPI's… include applicable MITRE ATT&CK coverage per environment") |

#### SIEM (Splunk / Microsoft Sentinel / Elastic)

| S | Gözlemlenebilir kriter | Framework çapası |
|---|---|---|
| 2 | SIEM'in ne yaptığını açıklar; index/source/sourcetype (Splunk) veya table (KQL) ayrımını yapar; verilen aramayı çalıştırıp zaman aralığını değiştirir | SFIA 1 SCAD "simple security administration tasks" |
| **4** | **Sıfırdan, kopyalamadan yazar:** `index=wineventlog EventCode=4625 \| stats count by src_ip, user \| where count > 10` — ve KQL karşılığı `SecurityEvent \| where EventID == 4625 \| summarize FailCount=count() by Account, IpAddress \| where FailCount > 10`. Bulguyu timestamp + IOC'lerle bir ticket'a **belgeler** | SFIA 2 SCAD "**Documents incident and event information and generates reports**" · **NICE T1241, T1242** · BTL1 SIEM · THM SOC L1 M12 *SIEM Triage* |
| **6** | **`stats` + `eval` + lookup ile çok aşamalı tespit yazar** (örn. password spraying: `\| stats dc(user) as users, count by src_ip \| where users > 20 AND count > 50 \| eval risk=case(users>50,"high",1=1,"medium") \| lookup asset_inventory ip as src_ip`), KQL'de tekrarlar, **bir haftalık gerçek veriyle tune edip ortaya çıkan FP oranını söyler**, ve use case olarak belgeler: veri kaynağı + ATT&CK teknik ID + triage adımları | SFIA 3 SCAD "non-standard" · **NICE T0020** ("develop content for cyber defense tools"), T1112, T1299 · **Splunk SPLK-5001 D5 (SPL %20) + D4 (%20)** · SC-200 *threat hunting* (%20–25) · SOC-CMM *Use Case Management* olgunluk 3 |
| 8 | Detection-as-code: Sigma → backend dönüşümü, Git versiyonlu, CI ile test edilmiş. Alert fidelity ve MTTD raporlar. Splunk ES'te Risk-Based Alerting veya Sentinel analytics + automation rules + playbook kurar | SFIA 4 SCAD "maintains and **optimises** operational security processes" · CySA+ V4 *Security Operations* %34 · DE Matrix Process = Managed |
| 9–10 | Tespit stratejisini belirler, onay akışının sahibi, ortam başına ATT&CK kapsamı dahil KPI tanımlar, araç seçer | SFIA 5 SCAD "oversees… contributes to the creation and maintenance of security policies, standards and procedures" · SOC-CMM *Detection Engineering & Validation* 4–5 |

> **Bu tabloların en somut kazancı:** S=6 hücrelerinin hepsi artık *üretilmiş bir artifact* istiyor — tetiklendiği doğrulanmış bir Suricata kuralı, açıklanabilir bir shell pipeline'ı, log kaynağı + sorgu + FP sınıfı üçlüsü, tune edilmiş bir SIEM use case'i. Bunlar aynı zamanda portföy maddesi. Yani rubrik, kanıt üretimini işe alım materyali üretimiyle aynı eyleme indirger.

### 5.5 Rubriğin dashboard'a bağlanması

Üç zorunlu alan, her beceri satırında:

```
skill:            "SIEM / Splunk"
score:            6
sfia_level:       3          # otomatik türetilir: score → SFIA
evidence_type:    "L3"       # Kirkpatrick: L2 = kurs bitti, L3 = işte/lab'da yaptım
evidence_link:    "repo/detections/bruteforce.spl"   # BOŞ OLAMAZ
last_demonstrated: <FSRS state>   # §3.2 — tarih değil, R(t,S)
```

`evidence_link` boş bırakılamıyorsa, §3.4'teki r ≈ .29 problemi büyük ölçüde kapanır: Zell & Krizan'ın "korelasyonu artıran" dört koşulunun (alana özgü, objektif, tanıdık, düşük karmaşıklık) hepsi bu formatta karşılanır.

### 5.6 Alman işverenler gerçekte ne istiyor — beş ilandan çıkan desen

Rubrik ne kadar iyi olursa olsun, hedef yanlışsa işe yaramaz. Beş güncel Almanya "Junior SOC Analyst / Security Analyst Tier 1" ilanının şartları:

| İşveren | Teknik şart | Dil | Diğer kapı |
|---|---|---|---|
| **BKG** (Bundesamt für Kartographie und Geodäsie), yeni SOC, Şubat 2026 başlangıç | "Grundlegendes Wissen in Netzwerksicherheit, Betriebssystemen und IT-Sicherheitsarchitekturen"; "Erfahrung im Umgang mit **SIEM- oder EDR-Lösungen**"; istenen sertifikalar **CompTIA CySA+, Cisco CCNA Security** | **Almanca min. B2** ("gutes mündliches und schriftliches Ausdrucksvermögen… minds. B2-Niveau") | **SÜG güvenlik soruşturması**; Bachelor **veya** Fachinformatiker Systemintegration + **4 yıl** deneyim |
| **Amprion** (şebeke operatörü), Pulheim | Fachinformatiker veya denk; 2–3 yıl tercih; sertifikalar **Splunk CCDA, CySA+, CCNA Security**; SIEM monitoring, **Triage**, playbook, escalation, darknet monitoring, CTI | "**sehr gute** Deutschkenntnisse und gute Englischkenntnisse" | **Wechselschichtdienst (24/7)** |
| **Reply Deutschland SE** | Staj düzeyinde bile olsa "Security Monitoring, Log-Analyse oder… SIEM-Systemen" deneyimi; **Splunk, Microsoft Sentinel veya IBM QRadar**; **Python** temel; "Netzwerkprotokolle und gängige Angriffsmuster (z.B. **MITRE ATT&CK**)" | Almanca + İngilizce | 24/7 monitoring |
| **agilimo Consulting** | min. 2 yıl; **Elastic, Kibana, Splunk**, Cisco, Barracuda; Windows + Linux | **Almanca C2** | **Ü2 güvenlik soruşturması** |
| **Smartbroker** | "**Wir suchen keine bestimmte formale Qualifikation**… Formale Abschlüsse sind willkommen, aber keine Voraussetzung"; "Fundierte IT-Grundlagen (**Netzwerke, TCP/IP, Windows- und Linux-Systeme, Log-Analyse, grundlegende Angriffstechniken**)"; SIEM/EDR triage | "Gute Deutsch- und Englischkenntnisse" | 1:1 mentorluk verilir |

**Modelin hedef fonksiyonunu değiştiren beş çıkarım:**

1. **Almanca, teknik becerilerin hepsinden daha sert bir kapıdır.** B2 taban, C1/C2 sık. Bu yüzden dil **ağırlıklı bir boyut olarak değil, pass/fail gate olarak** modellenmeli — Almanca < B2 iken teknik skorları yükseltmek `R`'yi artırıyorsa model yanlış sinyal veriyor. §3.7'deki darboğaz mantığı (min, ağırlıklı ortalama değil) tam olarak buraya uyuyor. İngilizce her ilanda **ek olarak** isteniyor, alternatif değil.
2. **Adı geçen SIEM'ler dar bir küme:** Splunk, Microsoft Sentinel, IBM QRadar, Elastic/Kibana. "SIEM öğreniyorum" yerine bu dördünden birinde derinleşmek ölçülebilir bir hedef. Splunk ve Sentinel iki ilanda birlikte geçtiği için en yüksek getirili ikili.
3. **Değer verilen sertifikalar CySA+, Security+, Splunk CCDA, CCNA Security.** Örneklenen beş ilanın **hiçbirinde BTL1 adı geçmiyor** — BTL1 iyi bir *öğrenme* aracı olabilir ama Alman CV filtresinde tanınırlığı kanıtlanmamış. Not: CySA+ resmî önerisi **~4 yıl deneyim**, yani junior sertifikası değil; buna rağmen junior ilanlarda "wünschenswert" olarak isteniyor.
4. **24/7 Wechselschicht normaldir.** Bu bir beceri değil ama bir kabul kararı — modelde ayrı bir tercih/kısıt bayrağı olmalı, yoksa hazır olduğun hâlde başvurabileceğin ilan havuzu sessizce daralır.
5. **Fachinformatiker Systemintegration, diplomaya resmî bir ikamedir** (BKG ilanı bunu açıkça yazıyor) ve **Chancenkarte'nin 2 yıllık mesleki eğitim koşuluyla aynı mantığı taşır** (§4.1). Aksi yönde: **SÜG / Ü2 güvenlik soruşturması** kamu ve savunmaya yakın rollerde zorunludur ve bazı AB-dışı vatandaşları eler — bu da beceri değil, **ayrı bir dashboard bayrağı** olarak tutulmalı, aksi hâlde erişilemez pozisyonları hedef sanırsın.

### 5.7 Bileşik "Almanya'da işe hazır" gate'i

Yukarıdaki tüm kanıtın tek satıra indirgenmiş hâli:

```
job_ready = (Networking >= 6)
        AND (Windows_AD  >= 6)
        AND (SIEM        >= 6)
        AND (Linux       >= 5)
        AND (Almanca     >= B2)     # pass/fail, ağırlıklı değil
        AND (İngilizce   >= B2)
        AND (portfolio_artifact_count >= 1)
```

`portfolio_artifact_count` şunlardan biri: BTL1 / HTB CDSA / THM SAL1 geçişi, **veya** tam bir soruşturmanın kamuya açık write-up'ı, **veya** §5.4'teki S=6 hücrelerinden üretilmiş doğrulanmış bir tespit kuralı repo'su.

Dikkat: bu bir **konjonksiyon**, ağırlıklı ortalama değil. Tek bir `AND` false ise `job_ready` false — ve model sana *hangisinin* false olduğunu göstermeli. Bu, §3.7'deki Theory of Constraints uygulamasının en somut hâli: bir sonraki çalışma bloğu her zaman false olan en ucuz terime gider.

Kaynaklar: [BKG — Security Analyst Tier 1 ilanı](https://www.bkg.bund.de/SharedDocs/Stellenangebote/BKG/DE/251026-TI1_312025-EG11.html) · Amprion / Reply Deutschland SE / agilimo / Smartbroker ilanları (bkz. §9 uyarı 21)

---

## 6. Dil Boyutu (D3) için Gerçek, Alıntılanabilir Formül — CEFR Guided Learning Hours

Bu, modelinde *hemen* kullanılabilecek en sağlam sayısal çapa. Dil, uydurma 0–10 puana ihtiyaç duymayan tek boyut: CEFR resmî rubrik, saat tahminleri ise resmî yayıncılardan geliyor.

**Cambridge English — kümülatif guided learning hours (sıfırdan):**

| CEFR | Cambridge sınavı | Kümülatif saat |
|---|---|---|
| A1 | A1 Starters/Movers | 90–100 |
| A2 | A2 Key | 180–200 |
| B1 | B1 Preliminary | 350–400 |
| B2 | B2 First | 500–600 |
| C1 | C1 Advanced | 700–800 |
| C2 | C2 Proficiency | 1.000–1.200 |

Cambridge'in özet kuralı: **bir CEFR seviyesinden diğerine ~200 guided learning hour.**
Kaynak: [Cambridge English Support — Guided learning hours](https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours)

**Cambridge'in daha ayrıntılı araştırma tablosu** (seviye-seviye artımlı + haftalık ek çalışma ihtiyacı, 35 haftada bitirmek için):

| Seviye | Alt seviyeden itibaren GLH | Kümülatif GLH | 35 haftada haftalık saat |
|---|---|---|---|
| A1 | 90–100 | 90–100 | 23–25 |
| A2 | 100–150 | 190–250 | 25–38 |
| B1 | 160–240 | 350–490 | 40–60 |
| B2 | 180–260 | 530–750 | 45–65 |
| C1 | 200–300 | 730–1050 | 50–75 |
| C2 | 300–400 | 1030–1450 | 75–100 |

Kaynak: [Cambridge — "How long does it take to learn a foreign language" (PDF)](https://www.cambridge.org/elt/blog/wp-content/uploads/2018/10/How-long-does-it-take-to-learn-a-foreign-language.pdf)

**Almanca için Goethe-Institut'un kendi resmî kurs yapısı** (1 Unterrichtsstunde = 45 dakika):

| Niveau | Goethe kurs sayısı | Saat (Abendkurs, 72 h/kurs) |
|---|---|---|
| A1 | 1 Abendkurs | 72 |
| A2 | 2 Abendkurs | 144 |
| B1 | 2 Abendkurs | 144 |
| B2 | **3 Abendkurs** | **216** |
| C1 | 2 Abendkurs | 144 |
| C2 | 2 Abendkurs | 144 |

Dikkat: Goethe'nin kendi tablosunda **B2 tek atlaması en pahalı seviye** (3 kurs). Yani "B1'den B2'ye" adımı Almanca'da özellikle uzundur — Almanya iş piyasası için de en kritik eşik burası.
Kaynak: [Goethe — Deutschkurse für Fortgeschrittene](https://www.goethe.de/ins/de/de/m/kur/dff.html) · [Deutsch Abendkurse](https://www.goethe.de/ins/de/de/kur/ang/dak.html) · [Deutschkurse für Anfänger](https://www.goethe.de/ins/de/de/kur/dfa.html)

**Dashboard formülü (D3 boyutu için):**

```
GLH_gerekli(hedef) = kümülatif_GLH(hedef) − kümülatif_GLH(mevcut_seviye)
ETA_dil_hafta      = GLH_gerekli / haftalık_dil_saati
```

Örnek: Almanca A2 → B2 hedefi, Cambridge tablosunun Almanca eşleniğiyle ≈ 340–500 saat; haftada 6 saat çalışırsan **57–83 hafta**. Bu, "Almanca puanım 4/10, hızım 0.3/hafta" tahmininden kat kat daha savunulabilir bir sayıdır ve dış kaynağa dayanır.

> **Uyarı:** Bu saat tahminleri *ortalama yetişkin öğrenici* içindir; ana dil mesafesi (Türkçe ↔ Almanca uzak) ve immersion durumu sapmaya yol açar. CEFR'in kendisi saat öngörmez — bu sayılar yayıncı/kurum tahminleridir. Yine de "kendi hissim" alternatifinden ölçülemeyecek kadar iyidir. Detay: §9.

---

## 7. Ne Yanlış Gidiyor Genelde — belgelenmiş başarısızlık modları ve guardrail'ler

Bu bölüm literatürün en net olduğu yer ve modelin gerçek riski burada.

### 7.1 Terk etme (abandonment) — altı belgelenmiş neden

Epstein et al., **"Beyond Abandonment to Next Steps"** (CHI 2016; 193 anket + 12 mülakat) — kişisel bilişim araçlarını bırakma nedenleri:

| # | Neden | Bizim modeldeki karşılığı | Guardrail |
|---|---|---|---|
| 1 | **Veri toplama/entegrasyon maliyeti** — "hassle", "tembellik", manuel giriş gerektiren araçlarda alışkanlığı sürdürmek zor ("geride kaldım ve tekrar başlamaya vakit bulamadım") | 4 boyut × onlarca konu = haftalık elle puanlama yükü | Haftalık güncelleme **< 5 dakika** olmalı. Otomatikleştirilebilen her şey (THM/HTB modül tamamlama, Anki istatistikleri, WakaTime) elle girilmemeli |
| 2 | **Veriye sahip olma / paylaşma maliyeti** (mahremiyet) | Kariyer/beceri verisi hassas | Yerel dosya; buluta gitmesin |
| 3 | **Ortaya çıkan bilgiden rahatsızlık** — "ilerleme eksikliğimden cesaretim kırıldı", "her harcamada suçlu hissettim" | Kırmızı hücreler, düşen ETA, gerileyen S | Dashboard'ın *varsayılan görünümü* eksiği değil, **kazanılanı** göstermeli. Kırmızı, tıklamayla açılan bir sekmede olmalı |
| 4 | **Veri kalitesi kaygısı** — "yakılan kalori rastgele görünüyordu" | Kendi verdiğin 0–10 puanın gürültülü olması (r≈.29, §3.4) | Rubrik çapaları (§5) + kanıt zorunluluğu |
| 5 | **"Yeterince öğrendim"** — 6 kişi ihtiyaç duyduğunu öğrenince takibi bıraktı; "planı yaptıktan sonra Fitbit gereksizdi" | Model amacına ulaşınca bırakılacak — **bu iyi bir sonuç** | Sisteme açık bir **çıkış koşulu** yaz: "işe girince bu dashboard arşive kalkar". Planlanmış bitiş, suçluluğu önler ("happy abandonment") |
| 6 | **Hayat koşulları değişir** | İş, taşınma, hastalık | **Lapse birinci sınıf durum olmalı** — ara verme sistemi bozmamalı, borç biriktirmemeli |

Kaynak: [Beyond Abandonment to Next Steps (CHI 2016)](https://doi.org/10.1145/2858036.2858045)

**Nicel doğrulama:** Attias-Delattre / Jakob et al. (Computers in Human Behavior 2019, 159 eski kullanıcı) — terk kararının **kalıcı** olması özellikle "takip motivasyonunun kaybı" ile ilişkili; "veri yanlış/işe yaramaz" algısı kişisel niceliklemeye karşı olumsuz tutumla ilişkili. Ayrıca "**dependency effect**" (obsesif takip) demotivasyon kaynaklı bırakma ile güçlü ilişkili — insanlar takibe *stresle baş etmek için* ara veriyor.
Kaynak: [Abandonment of personal quantification (CHB 2019)](https://dl.acm.org/doi/10.1016/j.chb.2019.08.025) · [User diversity in discontinued use](https://www.researchgate.net/publication/360361258_Why_Do_People_Abandon_Activity_Trackers_The_Role_of_User_Diversity_in_Discontinued_Use)

### 7.2 Rumination — self-tracking'in patolojik hâli

"Beyond self-reflection: introducing the concept of rumination in personal informatics" (*Personal and Ubiquitous Computing*, 2021): self-reflection (ileriye dönük, problem çözen düşünme) ile **rumination** (tekrarlayan, öz-değere odaklı, negatif döngü) farklı şeylerdir. Ruminasyona giren kullanıcılar:
- yeni içgörü ve gelişme elde etmiyor,
- yoğun negatif duygu ve daha kötü ruh sağlığı yaşıyor,
- aracı ya negatif duyguyu azaltmak için ya da hedefi tamamen bıraktığı için **terk ediyor**.

Kritik mekanizma: *"bir tutarsızlık gösterilip onu azaltma yolu verilmezse, insanlar öz-odaklı uyaranlardan kaçınır."*

**→ Guardrail:** Dashboard her negatif sinyalin yanına **tek bir uygulanabilir eylem** koymak zorunda. "SIEM 2/10, hedef 6" tek başına ruminasyon yakıtıdır; "SIEM 2/10 → bu hafta: THM 'Splunk Basics' modülü (2 saat)" değildir.
Kaynak: [Rumination in personal informatics](https://doi.org/10.1007/s00779-021-01573-w)

### 7.3 Metrik sabitlenmesi — Goodhart, Campbell, Muller

- **Goodhart yasası:** "Bir ölçüt hedef hâline geldiğinde, iyi bir ölçüt olmaktan çıkar." (Orijinal ifade: "gözlemlenen herhangi bir istatistiksel düzenlilik, kontrol amacıyla üzerine baskı uygulandığında bozulma eğilimindedir.")
- **Campbell yasası:** "Bir nicel toplumsal gösterge karar verme için ne kadar çok kullanılırsa, o kadar çok bozulma baskısına maruz kalır ve izlemek için tasarlandığı süreci çarpıtma olasılığı artar." (Campbell'ın 1975'te bunu Goodhart'la aynı dönemde ve *daha açık* biçimde yazdığı, RSS *Significance* makalesinde savunuluyor.)
- **Jerry Muller, *The Tyranny of Metrics* (2018):** "metric fixation" = deneyime dayalı profesyonel yargıyı standartlaştırılmış nicel göstergelerle *değiştirmenin* mümkün ve arzu edilir olduğu inancı + ölçülen performansa ödül/ceza bağlamanın en iyi motivasyon yolu olduğu inancı. Muller'in kendi vurgusu önemli: **"Problem ölçme değil; aşırı ve yersiz ölçme — metrik değil, metrik sabitlenmesi."** Sonuç: goal displacement, kısa vadecilik, inovasyonun boğulması ("bilinmeyene girme heyecanı yok, çünkü bilinmeyen ölçülebilirin ötesinde").

**→ Bizim modelde gerçek risk senaryosu:** R skorunu yükseltmek *kolay* olan işleri yapmaya kayarsın (10 kolay THM room bitirmek), *işe alan* şeyi (bir gerçek detection yazıp blog'a yazmak) yapmaya değil. Bu tam olarak Goodhart.

**Guardrail — "anti-KR" fikri:** her ana metriğin yanına onu gamelemeyi anlamsızlaştıran bir kalite metriği koy. Örnek: "tamamlanan modül sayısı" metriğinin yanında "yazdığım ve çalışan detection sayısı". Bu öneri OKR literatüründen: *"KR'nizi gameleyecek senaryoyu hayal edin ve onu boşa çıkaracak kalite metriğini ekleyin."*
Kaynak: [Muller — Aeon özeti](https://aeon.co/ideas/against-metrics-how-measuring-performance-by-numbers-backfires) · [Tyranny of Metrics — giriş bölümü PDF](https://pup-assets.imgix.net/onix/images/9780691174952/9780691174952.pdf?fm=pdf) · [Campbell vs Goodhart (RSS Significance)](https://rss.onlinelibrary.wiley.com/doi/10.1111/j.1740-9713.2018.01205.x) · [10 OKR traps](https://kalsey.com/2025/05/10_okr_traps_and_how_to_avoid_them/)

### 7.4 OKR'nin bilinen başarısızlıkları — senin bağlamına birebir uyanlar

- **Metrikleri ödül/ceza ile eşlemek sistemi bozar.** Google bile, ürün kullanımı OKR'larını tazminata bağladığında insanların sistemi gamelediğini gördü; Laszlo Bock: *"parasal teşvikleri key result'lara bağlama fikri hem ürün hem kültür için zararlı bulundu."*
- **Yes/no key result'lar zayıftır** — ölçülemez, esnetmez.
- **Kontrolün dışındaki hedefler koymak** demoralize eder (işe alım kararı senin kontrolünde değil!).
- **Uzun vadeli objective'ler nadiren işler** — odak kaybolur, öncelikler değişir, ama atalet nedeniyle itmeye devam edilir.
- **Karmaşık, "doğru cevabı belli olmayan" problemlerde hedef koymak** risk almayı, deneyi ve inovasyonu caydırır.

**→ Bizim modele:**
- "İşe girmek" bir key result olamaz (kontrol dışı). Onun *leading indicator*'ları olabilir: gönderilen başvuru sayısı, geçilen teknik mülakat sayısı, yayınlanan portfolyo parçası sayısı.
- Her boyut için **lagging** (R skoru, sertifika) ve **leading** (haftalık lab saati, yazılan detection, gönderilen başvuru) göstergeleri ayır ve *ikisini birlikte* göster.
- Uzun vadeli tek hedef yerine kısa çevrimler — stickK verisiyle de uyumlu ("kısa vadeli hedefler daha başarılı").

Kaynak: [Why OKRs Fail (Radical Product)](https://www.radicalproduct.com/blog/okrs-criticism) · [When NOT to do OKRs](https://kianu.ai/guides/when-not-to-do-okrs) · [Goodhart & OKR](https://www.mckennaagileconsultants.com/blog/goodharts-law-okrs-strategic-execution/)

### 7.5 İçsel motivasyonun ezilmesi (crowding-out) — gamification'a dikkat

Self-Determination Theory (Deci & Ryan) çerçevesinde **undermining / overjustification effect**: zaten ilgi çekici olan bir faaliyete dışsal ödül eklemek içsel motivasyonu düşürebilir. Mekanizma: *perceived locus of causality* kayması — "bunu seviyorum çünkü" → "bunu ödül için yapıyorum".

Güncel meta-analiz sayıları (free-choice içsel motivasyon üzerinde, Cohen's d):
- tüm ödüller: **−0.28**
- somut (tangible) ödüller: **−0.39**
- beklenen ödüller: **−0.41**
- göreve katılıma bağlı: **−0.42**; görev tamamlamaya bağlı: **−0.48**; performansa bağlı: **−0.24**
- beklenmedik ödül: −0.04 (anlamsız); göreve bağlı olmayan: +0.10
- **tek net iyileştirme: pozitif geri bildirim +0.33**

**→ Bizim modele — bu belki de en pratik tek bulgu:** Dashboard'ın puan/streak/seviye mekaniği **"kontrol edici" değil "bilgilendirici"** olmalı. Yani:
- ✅ "Bu hafta Linux'ta 2 yeni komut seti hakim oldun; SIEM darboğazın" (pozitif, bilgilendirici geri bildirim → d = +0.33)
- ❌ "Streak'ini kırdın, −50 puan" (görev tamamlamaya bağlı somut ceza/ödül → d = −0.48 bölgesi)

Ayrıca gamification eleştirisi tam bu noktada: puan/badge'ler SDT'nin üç temel ihtiyacını (özerklik, yeterlik, ilişkililik) karşılamıyorsa geri teper.
Kaynak: [When do extrinsic rewards undermine intrinsic motivation? (meta-analiz)](https://www.utupub.fi/handle/10024/173853?show=full) · [Overjustification effect](https://en.wikipedia.org/wiki/Overjustification_effect) · [Why Gamification Fails in Education (SDT tabanlı 9 heuristic)](https://link.springer.com/chapter/10.1007/978-3-319-51645-5_22)

### 7.6 Quantified Self'in kendi kaderi — makro uyarı

QS hareketi 2007'de Gary Wolf ve Kevin Kelly (ikisi de Wired) tarafından kuruldu; sloganı "self-knowledge through numbers". Zirvede 60.000+ üye, 200+ meetup grubu, yılda iki uluslararası konferans.

2024 tarihli akademik analiz (*New Media & Society*, "Curators of digital futures: The life cycle of pioneer communities") ne olduğunu anlatıyor:
> "n=1 deneylerinin radikal fikirlerinin çoğu kayboldu. Self-tracking ana akım hâline geldi ama çok daha sınırlı bir biçimde... Örgütsel elit önemli ölçüde küçüldü, meetup'ların çoğu sona erdi ve Quantified Self hareketi artık çoğunlukla kurucusu Gary Wolf ve küçük bir gönüllü ekip tarafından sürdürülüyor."

**Ders:** Ölçmenin *kendisi* bir topluluk ya da amaç değildir. QS'in ayakta kalan kısmı "personal science" — yani **belirli bir soruyu cevaplamak için** yapılan kısa, hedefli n=1 deneyler. Sonsuza kadar süren genel amaçlı takip değil.
Kaynak: [What is the Quantified Self? (Gary Wolf)](https://quantifiedself.com/blog/what-is-the-quantified-self/) · [Pioneer communities life cycle](https://doi.org/10.1177/14614448241253766) · [Personal Science and the QS Guru](https://metriclife.net/publications/personal-science-and-the-quantified-self-guru/)

### 7.6b Dashboard'ların kendisi hakkında doğrudan kanıt — ve bu bölümün en sert bulgusu

Buraya kadarki uyarılar self-tracking *pratiği* hakkındaydı. Bu alt bölüm, tam olarak senin yaptığın şey — **öğrenme analitiği dashboard'ı** — hakkında ne biliniyor sorusunun cevabı.

**En güçlü nedensel kanıt, 8.745 öğrencilik randomize kontrollü bir deney** (*Applied Sciences* 15(21):11493, 2025) ve sonucu şu:

> **Geri bildirim İÇERMEYEN dashboard'lar ölçülebilir hiçbir fayda üretmedi.** Geri bildirim içerenler doğrulama (verification) oranlarını anlamlı biçimde artırdı, ama katılım üzerinde karışık etkiler ve **nihai performans üzerinde hiçbir etki** gösterdi.

Bu, modelin varlık gerekçesine doğrudan bir itiraz — ve iyi haber şu ki tasarımla aşılabilir bir itiraz. Aynı çalışmanın türettiği dört ilke:

1. Gerçek zamanlı akranlar yerine **önceki dönemlere / kendi geçmişine** kıyasla (benchmark).
2. Hedefle uyumlu **birden fazla standart** sun (tek bir "doğru" eşik değil).
3. **Düşük çıkarım gerektiren görselleştirmeleri, uygulanabilir geri bildirimle eşleştir.**
4. **Tempoyu (pacing) görünür kıl** — böylece aralıklı tekrar etkisi teşvik edilir.

Alan genelindeki durum da bunu destekliyor: **Bodily & Verbert (2017)**, 945 makale taranarak 93'ü dahil edilmiş bir derlemede, alanın ihtiyaç analizi, görsel tasarım gerekçesi ve bilgi seçimi gerekçesi olmadan bitmiş ürünler yayımladığını, davranış ve başarı üzerindeki deneysel kanıt gövdesinin **küçük** olduğunu söylüyor. **Matcha et al. (2019)**: incelenen makalelerin **%68'i seçtikleri göstergeler için hiçbir teorik gerekçe vermemiş**, ve öz-düzenlemeli öğrenmeyi desteklediğini iddia eden hiçbir makale bu teoriyi açıkça uygulamamış.

**Jivet et al. (2018, LAK'18) tasarım tavsiyeleri** — senin durumuna çevrilmiş hâliyle:

| | Tavsiye | Senin modeline |
|---|---|---|
| **D1** | Dashboard'ı bir **veri gösterimi** değil, farkındalık ve yansıma üreten **pedagojik araç** olarak tasarla | Her panel bir davranış değişikliğini hedeflemeli |
| **D2** | Tasarım kararlarını öğrenme bilimleri kavramlarına dayandır | Bu dokümanın tamamı bunun için |
| **D3** | **Akran karşılaştırmasını dikkatle kullan** | Tek kişilik sistemde geçersiz — ama ilkesi geçerli: **kendi önceki durumunla** kıyasla, hayalî bir ideale karşı değil |
| **D4** | Etkinin herkeste aynı olduğunu varsayma | — |
| **D5** | Mevcut öğrenme ortamına **kesintisiz** entegre ol | Model, çalışma akışının *içinde* yaşamalı; yoksa kullandığın bir şey değil, **baktığın bir şey** olur |
| **E1** | Öncelikle dashboard'ın *kendi belirttiği hedeflerin* karşılanıp karşılanmadığına göre değerlendir | §7.7 kural 8'deki çıkış koşulu bunun uygulaması |

> **Tek cümlelik sonuç: sadece sayı gösteren bir dashboard'ın RCT'de ölçülebilir fayda üretmediği gösterilmiştir.** Yani her panel bir **eyleme** bağlanmak zorunda. "SIEM: 6.2/10, R = 0.71" yeterli değil; "SIEM hatırlanabilirliği 0.71'e düştü — sıradaki adım lab #14" gerekli. Bu, §7.7'deki 3. kuralın neden bir stil tercihi değil, kanıta dayalı bir zorunluluk olduğunu açıklıyor.

Kaynak: [RCT, *Applied Sciences* 15(21):11493 (2025)](https://www.mdpi.com/2076-3417/15/21/11493) · [Bodily & Verbert (2017), IEEE TLT](https://doi.org/10.1109/tlt.2017.2740172) · [Jivet et al. (2018), LAK'18 preprint PDF](https://research.ou.nl/ws/portalfiles/portal/8215481/LAK_2018_Jivet_preprint.pdf) · [Matcha et al. özeti — IJETHE 2023 checklist](https://link.springer.com/article/10.1186/s41239-023-00394-6)

### 7.7 Guardrail özeti — dashboard'a doğrudan gömülecek 11 kural

1. Haftalık güncelleme **≤ 5 dakika**; olmayan her şey otomatik.
2. Her S puanı **kanıt** alanı olmadan girilemez (rubrik çapası zorunlu).
3. Her kırmızı/negatif sinyalin yanında **tek bir somut eylem**.
4. Varsayılan görünüm kazanımı gösterir; eksik ayrı sekmede.
5. **Lapse birinci sınıf durum**: ara verme borç biriktirmez, S'leri sıfırlamaz (Beeminder'ın merhametli reset'i).
6. Hedef/ağırlık değişiklikleri **7 gün gecikmeli** yürürlüğe girer (akrasia horizon).
7. Her ana metriğin bir **anti-metriği** (kalite karşıtı) var.
8. Açık **çıkış koşulu** yazılı: "X olursa bu sistem arşive kalkar" (happy abandonment).
9. **Yetersiz veriyle skor gösterme:** bir boyutta 3 haftadan az boş olmayan veri varsa trend/ETA yerine "henüz yeterli veri yok" yaz (Exist.io kuralı, §2). Erken dönemde tek iyi hafta ETA'yı uçurmamalı.
10. **R ≈ 70 "yolunda" demektir, 100 değil.** Ölçek Google OKR mantığıyla kalibre edilir; sürekli 100 alıyorsan hedefler yeterince hırslı değil, sürekli 40 alıyorsan hedefler yanlış (§8 onur listesi).
11. **Sistem hijyeni ayrı ölçülür:** "kaç gün veri girilmedi", "kaç S puanının kanıtı eksik" — bunlar beceri metriği değil, terk etme erken uyarısıdır (Perdoo Health Score mantığı).

---

## 8. Bizim Modele Somut Öneriler (etkiye göre sıralı, kaynak eşlemeli)

| # | Öneri | Neden (kaynak) | Uygulama zorluğu |
|---|---|---|---|
| 1 | **Her S puanına zorunlu rubrik çapası + kanıt alanı ekle** (§5.4 tablosu hazır). İleri seviye: puanı elle vermeyi tamamen bırak, **Elo ile davranıştan türet** — sabit `K` yerine **`U(n) = 1/(1 + 0.06n)`** (Pelánek) kullan ve görev seçimini `E(S) ≈ 0.75` kuralına bağla. Kanıtların bileşik (bir lab = SIEM + log parsing + ATT&CK) olduğu için, alternatif olarak **PFA** daha iyi oturur: `m = Σ_KC (β_j + γ_j·s_j + ρ_j·f_j)` | Öz-değerlendirme ↔ objektif performans r ≈ **.29**; alana özgü + objektif + tanıdık + tek görev olduğunda .6'ya çıkıyor (Zell & Krizan 2014). Elo problemi tamamen atlar: Maths Garden 3.648 çocuk / 3.5M problemde ön-kalibrasyon olmadan çalıştı; Pelánek'in `U(n)`'i tek geçişte **tam MLE Rasch ile r = 0.97** veriyor. PFA ise dört veri setinde BKT'yi tüm metriklerde geçti ve **görev başına birden fazla beceriyi** doğal taşır (§3.17) | Orta (rubrik) / Yüksek (Elo/PFA) |
| 2 | **Chancenkarte puan fonksiyonunu D4'e gerçek formül olarak göm** — ve *ilk aksiyon olarak kısmi denklik (Anerkennung) başvurusunu* öne çıkar | § 20b AufenthG + Anlage: kısmi denklik kararı **tek başına 4 puan** (asgari 6'nın üçte ikisi) ve öğrenme değil **evrak işi** — tablodaki en yüksek çaba/getiri oranı. Ayrıca yaş puanı zamanla azaldığı için modele meşru bir aciliyet terimi sokar | Kolay |
| 3 | **Hızı iki zaman ölçeğine ayır ve ETA'yı persentille göster.** `CTL = CTL_dün + (yük_bugün − CTL_dün)/42` (uzun vadeli, ETA bunu kullansın), `ATL` 7-günlük (kısa vadeli), `TSB = CTL − ATL` = sürdürülebilirlik göstergesi. Üstüne P50/P85/P95 Monte Carlo | TrainingPeaks PMC 20 yıllık, formülü resmî yayınlı, Banister fitness–fatigue modeline dayanıyor — ve **hiç tarih kullanmıyor**, sadece `dünkü durum + bugünkü girdi`. Ayrıca ortalama hızla bölmek %50 doğruluk = yazı-tura (Magennis, Vacanti) | Kolay |
| 4 | **R'ye darboğaz cezası ekle; "ŞU AN DARBOĞAZ" alanını dashboard'ın en üstüne koy.** Üstüne §5.7'deki **konjonktif `job_ready` gate'ini** ekle (Networking≥6 AND Windows/AD≥6 AND SIEM≥6 AND Linux≥5 AND Almanca≥B2 AND portföy≥1) ve **hangi terimin false olduğunu** göster | Ağırlıklı ortalama telafi edicidir, işe alım değildir. Liebig / Goldratt ToC adım 3: her şeyi kısıta tabi kıl. Beş Alman junior SOC ilanı bunu doğruluyor: **Almanca B2 pass/fail bir kapıdır**, teknik skorla telafi edilemez (§5.6) | Kolay |
| 5 | **T+1/T+3/T+7'yi bırak; FSRS-6'nın R(t,S) motorunu kullan** (veya en azından ilk tekrarı geciktir + eşit aralıklı yap) | Karpicke & Roediger 2007: expanding kısa vadede iyi, **uzun vadede eşit aralıklı daha iyi**; belirleyici faktör ilk tekrarın gecikmesi. FSRS-6, 500M+ gerçek tekrarla kalibre | Orta |
| 6 | **ETA'yı asimptota log-mesafe üzerinden hesapla ve ölçeği 9,5'te kes:** `ETA = [ln(10 − S_şimdi) − ln(10 − S_hedef)] / (r · haftalık_çaba)` | Üstel öğrenme eğrisi (Heathcote: 40 veri seti, ortalama alınmamış tüm setlerde üstel daha iyi uyuyor — **tek kişilik model için doğru form bu**). Kapalı formda: **8→9 = 2→3'ün 5,2 katı, 9→10 = ∞** (§3.3). Lineer ETA bu yüzden en çok yatırım yaptığın yerde en iyimser | Kolay |
| 6b | **Her beceriyi nokta değil BANT göster** (Glicko `RD`): "SIEM 6.4 ± 1.8 · son kanıt 9 hafta önce". Belirsizlik pratikle daralsın, hareketsizlikte genişlesin | Glicko'nun RD'si tam olarak bu davranışa sahip ve **takvim gerektirmez** — sadece güncelleme sayısı sayılır, yani tarihsiz felsefeye birebir uyar. Bu tek değişiklik modeli çürümeye karşı dürüst yapar: iki ay dokunulmamış bir konu sessizce 7/10 kalmaz | Orta |
| 7 | **Her gate'i `koşul → eylem` (if-then) çiftine dönüştür** | Gollwitzer & Sheeran: hedefe ulaşmada d=0.65; **raydan çıkmayı önlemede d=0.77**. Format kritik: contingent if-then + prova | Kolay |
| 8 | **D3 (dil) boyutunu 0–10 yerine CEFR + guided learning hours ile modelle**; hedefi **Almanca B2'de sabitle** ve dilin **üç ayrı getirisini** ayrı ayrı göster | Cambridge: seviye başına ~200 GLH. Goethe: B2 en pahalı atlama (3 kurs / 216 h). Almanca üç yerde ödüyor: **(a)** Chancenkarte puanı B2'de 3'e doygunlaşır — C1'in puan getirisi sıfır; **(b)** Alman junior SOC ilanlarında B2 *pass/fail tabandır* (§5.6); **(c)** Blaue Karte'de kalıcı oturum **B1 ile 21 ayda, A1 ile 27 ayda** — B1 altı ay kazandırır (§4.6). Yani B2 matematiksel optimum, B1 ise en erken somut kazanç | Kolay |
| 8b | **Maaşı sert kısıt olarak modelle, çıktı olarak değil.** Hedef pozisyonun maaş dağılımını (€41.300 / €48.200 / €58.100) 2026 eşiklerine (€45.934,20 indirimli · €50.700 genel · €45.630 § 6 BeschV) karşı göster; şehir seçimini kaldıraç olarak ekle | Medyan junior SOC maaşı iki eşiğin **arasına** düşüyor: indirimliyi geçer, geneli geçmez (§4.6). Bandın altı hiçbirini geçmez. Bu, "işe girdim" ile "kalabildim" arasındaki farkı belirleyen tek sayı ve modelde hiç yok | Kolay |
| 9 | **Aynı anda aktif konu sayısına sert WIP limiti (2–3)** + work item age göstergesi | Little's Law: `cycle time = WIP / throughput`. WIP'i yarıya indirmek her işin bitiş süresini ~yarıya indirir; throughput artmaz | Kolay |
| 10 | **Metriklerin yanına anti-metrik + leading/lagging ayrımı; ödül mekaniğini "kontrol edici"den "bilgilendirici"ye çevir; çıkış koşulu ve lapse politikası yaz** | Goodhart / Campbell / Muller + OKR "anti-KR" pratiği. SDT meta-analizi: tamamlamaya bağlı ödül d=−0.48, pozitif geri bildirim **d=+0.33**. Terk etme nedenleri (CHI 2016) doğrudan bu tasarım kararlarına bağlı | Orta |

**Onur listesi — sıralamaya girmedi ama uygulama maliyeti neredeyse sıfır, dördü de tek satır:**

| Ödünç | Kaynak | Ne değişir |
|---|---|---|
| **R ≈ 70'i "yolunda" kabul et, 100'ü değil** | Google OKR: 0.6–0.7 tasarım hedefi; sürekli 1.0 = yetersiz hırs | Modelin sürekli "başarısız" göstermesini bitirir. §5.3'teki SFIA 2–3 hedefiyle de matematiksel olarak uyumlu — junior hedefte S=6 zaten 10 üzerinden 6'dır |
| **3 haftadan az veri varsa trend/skor gösterme** | Exist.io: min. 3 hafta boş olmayan veri; korelasyonlar p<0.05 ile filtreli, 1–5 yıldız güven | Gürültüyü sinyal sanma tuzağını kapatır. Erken dönemde tek iyi hafta ETA'yı uçurmaz |
| **Sistem hijyenini beceriden ayrı ölç** | Perdoo Health Score; Li/Dey/Forlizzi'de "collection" aşaması barrier'ı | "5 gündür veri girmedim" bir beceri kaybı değil ama terk etmenin en erken sinyali (§7.1). Ayrı bir gösterge olmalı |
| **İlerlemenin yanına "kaç boyutta sapıyorum" eksenini koy** | Tability Net Confidence Score = %yolunda − %sapmış (−100…+100) | R yükselirken NCS düşebilir — tam olarak görülmesi gereken durum: bir boyutu büyütürken üçünü bırakmak |

---

## 9. Doğrulanamayanlar / Uyarılar

*Araştırma Ağustos 2026'da tamamlandı. Aşağıdakiler ya doğrulanamamış, ya çelişkili, ya da zamanla eskiyecek kalemlerdir — dokümandaki bir sayıyı karar için kullanmadan önce bu listeye bak.*

- **CEFR saat tahminleri resmî değil.** CEFR'in kendisi hiçbir saat öngörmez; yukarıdaki tablolar Cambridge Assessment English ve Goethe-Institut'un *kurum tahminleri*dir ve "ortalama yetişkin öğrenici, iyi öğretmen, haftalık ödev" varsayar. Türkçe → Almanca dil mesafesi bu tahminleri yukarı çeker; kaynakların hiçbiri Türkçe ana dili için ayrı sayı vermiyor.
- **Güç yasası vs üstel öğrenme eğrisi tartışması çözülmemiş.** Heathcote, Brown & Mewhort (2000) güç yasasının ortalama-alma artefaktı olabileceğini savunur. Bizim çıkarımımız ("lineer değil") her iki durumda da geçerli, ama `p` veya `k` parametresinin evrensel bir doğru değeri yok — kendi verinle kalibre edilmeli.
- **Implementation intentions etki büyüklüğü aşağı revize edildi.** 2006 meta-analizinin d=0.65 rakamı çok atıf alıyor; 2024'teki 642 testlik meta-analiz sample-weighted d ≈ 0.27–0.66 aralığı veriyor ve robust Bayesian meta-analysis yayın yanlılığı için "extreme evidence" buluyor. Yani d=0.65 muhtemelen üst sınır. Yöntem yine de bedava, riski yok.
- **stickK'nın %29 → %80 rakamı şirketin kendi iç analizidir** (HBS vaka çalışması üzerinden aktarılıyor), bağımsız hakemli bir RCT değil. Hakemli olan CHI 2021 çalışması ise yönü doğruluyor ama bu spesifik yüzdeleri doğrulamıyor.
- **FSRS'in "SM-2'den %20–30 daha az tekrar" iddiası** loglanmış veriler üzerinde büyük ölçekli *simülasyondan* geliyor, canlı öğrencilerle kontrollü bir deneyden değil — kaynağın kendisi bunu dürüstçe belirtiyor.
- **IRT (1PL/2PL/3PL) ve Elo denklemleri standart ders kitabı formlarıdır**; birincil kaynaktan (Rasch 1960, Birnbaum 1968, Elo 1978) doğrudan alıntılanmadı. Eğitimdeki Elo uygulaması ve `%75 hedef başarı olasılığı` parametresi ise Klinkenberg et al. (2011) makalesinden doğrulandı. Elo güncelleme formülünün Maths Garden'daki tam hâli, makalede yanıt süresini de içeren bir skorlama kuralı (HSHS / Signed Residual Time) ile birleştirilmiştir — ben burada sadeleştirilmiş, yalnızca doğruluk temelli formu verdim.
- **PFA / AFM / DKT denklemleri artık doğrulandı (§3.17)** — önceki turun bu uyarısı kapandı. Sonuç da değişti: PFA "aşırı mühendislik" değil, senin veri rejimine **en uygun** model. DKT ise literatürün kendi hükmüyle kurulmamalı.
- **FSRS-6'nın başarılı hatırlama sonrası stabilite denklemi (`S'_r`) miras yoluyla çıkarıldı.** awesome-fsrs wiki'si FSRS-6'nın değişikliklerini "aynı gün tekrar formülü + eğitilebilir decay" olarak veriyor ve FSRS-5'in "diğer formülleri FSRS-4.5 ile aynı" tuttuğunu söylüyor; `S'_r` bu zincirden v4'ten devralınıyor. Yapı `fsrs-rs` kaynağında ayrıca doğrulanıyor ama FSRS-6 referans implementasyonu satır satır okunmadı. **FSRS-7'nin var olup olmadığı da kesin değil** (wiki'nin son revizyonu 28 Temmuz 2026, en yeni kayıt FSRS-6; ts-fsrs "FSRS-6.0" bildiriyor).
- **Cepeda et al. (2008) tablosundaki koşul başına katılımcı sayıları (N) alınamadı.** Optimal gap yüzdeleri ve iyileşme oranları makalenin gövde metninden güvenilir; **hücre başına N güvenilir değil.** Ayrıca yaygın **"optimal gap = RI'nin %10–20'sidir" kuralı folklordur** — makalenin kendi sayıları 1 hafta ufkunda %20–40'tan 1 yıl ufkunda %5–10'a iniyor ve makale bu sabit-oran fikrinden "belirgin biçimde saptığını" açıkça yazıyor.
- **Glicko-2'nin adım adım güncelleme denklemleri (Adım 3–8) transkribe edilmedi** — varyans `v`, delta `Δ` ve Illinois algoritmasıyla oynaklık iterasyonu. Kavramlar (RD, σ, τ, ölçek dönüşümü) doğrulandı; §3.16'daki öneri yalnızca RD'nin *davranışına* (pratikle daralır, hareketsizlikte genişler) dayandığı için pratik kayıp yok.
- **Duolingo HLR eleştirisi hakemli bir replikasyon değil.** Salgado'nun "trend-following model" kritiği bir preprint/portfolyo çalışması; ikinci kaynak bir GitHub replikasyonu. **HLR'nin 2026'da hâlâ Duolingo üretiminde olup olmadığı da doğrulanamadı.** Zaten §3.15'te "atla" dediğim için kararı etkilemiyor.
- **Ericsson, Krampe & Tesch-Römer (1993) tam metnine erişilemedi** (paywall). Atıf, tanım ve Ericsson'ın 10.000 saat reddi ikincil kaynaklardan ve Ericsson'ın kendi sonraki beyanlarından doğrulandı; makalede alıntılanacak kanonik bir denklem yok.
- **Kişisel/profesyonel beceri dashboard'ları üzerine hakemli değerlendirme literatürü YOK.** Bulunabilen tüm öğrenme analitiği literatürü öğrenci-yönelimli ve kurumsal. Siber güvenlik kariyer takibi için hiçbir hakemli değerlendirme bulunamadı. **Bu, §1'deki "prior art parçalı" hükmünü destekleyen bağımsız bir gözlem** — ama bir arama başarısızlığı olduğu tamamen dışlanamaz. Pratik sonucu: §7.6b'deki RCT bulgusu, elimizdeki en yakın kanıt ve *öğrenci* bağlamından ekstrapole ediliyor.
- **ECSF / BSI araştırılmadı — bu bilinen bir boşluk.** ENISA'nın **European Cybersecurity Skills Framework**'ü (özellikle "Cyber Incident Responder" profili) ve BSI'nın kendi rol tanımları, Almanya bağlamında NIST NICE'tan **daha doğrudan ilgili** olabilir. §5'in çapası SFIA/NICE üzerine kurulu; ECSF eklenirse Avrupa tarafında daha güçlü bir ikinci çapa elde edilir. Sonraki tur için en yüksek getirili tek araştırma kalemi bu.
- **Rubrik (§5.4) hakkında dürüst sınır — bu tur büyük ölçüde kapandı.** Seviye ölçeği artık yalnızca "SFIA'ya benzetilmiş" değil: NIST'in resmî benimsemesi ve NICE↔SFIA levelled-roles eşlemesi doğrulandı (§5.1), SFIA 9 **Security operations (SCAD)** ile Incident management / Threat intelligence / Vulnerability assessment / Digital forensics becerilerinin seviye-seviye resmî metni alındı (§5.2c), Seviye 2 ve 3'ün tam generic attribute metni alındı (§5.2b). **Kalan sınır:** her hücredeki *teknik somutlaştırma* (hangi event ID, hangi SPL sorgusu) yine benim önerimdir — SFIA hiçbir seviyede araç adı vermez, veremez. Bu tasarım gereğidir, eksiklik değil.
- **SFIA generic attribute metinleri yalnızca Seviye 2 ve 3 için tam alındı.** Seviye 1, 4, 5, 6, 7 için sadece "essence of the level" cümleleri doğrulandı, beş attribute'un tam metni değil. Junior hedef 2–3 olduğu için pratik kayıp yok, ama S=8 (SFIA 4) kriterlerini sıkılaştırmak istersen level-4 sayfası tek tek okunmalı.
- **Doğrudan teyit edilenler (bu turda ben kendim çektim):** NIST'in "Identifying Proficiency" sayfasındaki SFIA benimseme metni **birebir doğrulandı** (sayfa NICE↔SFIA levelled-roles PDF'ine kendi üzerinden link veriyor). SFIA 9 **Security operations** beceri sayfasının 1–6 seviye metinleri ve guidance notes'u da **birebir doğrulandı** (§5.2c). Bu iki kaynak rubriğin omurgası olduğu için ikinci elden bilgiye bırakılmadı.
- **SFIA beceri kodları.** Doğrulanan tek kod **SCAD**'dir. THIN (Threat intelligence), USUP (Incident management), VUAS (Vulnerability assessment), DGFS (Digital forensics), SCTY (Information security) kodları yaygın kullanılıyor ama getirilen SFIA 9 sayfalarında basılı görülmedi; beceri *metinleri* doğru, *kodlar* teyide muhtaç. **SCTY level descriptor'ları hiç alınamadı.**
- **BTL1 domain ağırlıkları resmî olarak YOK.** Security Blue Team (yeni marka: Centri) BTL1 için sayısal domain yüzdesi yayımlamıyor. Çalışma rehberlerinde dolaşan "Very high / High / Medium / Low" tablosu üçüncü taraf çıkarımıdır, resmî değil. Doğrulanan: 6 domain, 24 saatlik pratik sınav, 20 soru, **geçme %70 (14/20)**, £399, ve sayfada belirtilen resmî NICE eşlemesi (Cyber Defense Analyst — %60 Topics / %60 Knowledge / %67 Ability).
- **CompTIA Security+ "V8 / SY0-801" doğrulanmadı.** CompTIA yalnızca taslak "Security+ V8" hedefleri yayımladı; **SY0-801 sınav kodu, domain yüzdeleri ve çıkış tarihi üçüncü taraf haberidir.** SY0-701 hâlâ tek satın alınabilir sürüm ve açıklanmış bir emeklilik tarihi yok. Buna karşılık **CySA+ V4 (CS0-004) Haziran 2026'da yayımlandı ve güncel sürümdür**; V3 (CS0-003) İngilizce'de **22 Aralık 2026**'da emekliye ayrılıyor — sertifika planlıyorsan bu tarih önemli.
- **Kurs/lab saat tahminlerinin hiçbiri güvenilir değil.** TryHackMe SOC L1 için resmî tahmin ~40 saat, tamamlayan kullanıcı raporları ~65 saat; TryHackMe'nin kendi sayfası Cloudflare arkasında olduğu için resmî sayı doğrulanamadı. HTB SOC Analyst path (15 modül / 167 bölüm / 1220 cube) için HTB "23 gün" diyor, bir inceleme ~1.5 ay. LetsDefend hiç saat yayımlamıyor. **Bu sayıları ETA hesabına girdi olarak kullanma** — §3.6'daki reference class forecasting mantığıyla kendi ölçülmüş hızını kullan.
- **Splunk SPLK-5001 geçme notu (700/1000) ve fiyatı ($130) üçüncü taraf kaynaklardan.** Resmî Splunk blueprint PDF'i yalnızca soru sayısı (66), süre (75 dk) ve domain ağırlıklarını doğruluyor. HTB CDSA flag eşiği için resmî Sysreptor şablonu **17/20 (85 puan)** diyor, bir inceleme "en az 16/20" — resmî rakamı kullandım.
- **SOC-CMM'de iki tutarsızlık var.** (a) soc-cmm.com web sayfası ile eski whitepaper, **seviye 2 (Managed) ve 3 (Defined) açıklamalarını yer değiştirmiş** hâlde veriyor; en yeni best-practice PDF'ini kullandım, ama bu iki seviyenin tam ifadesini belirsiz kabul et. (b) 27 aspect'in tam listesi doğrulanamadı (~18'i teyit edildi); tamamı için assessment workbook indirilmeli. Capability seviye 3'ün tam metni alınamadı.
- **NICE Knowledge/Skill statement tam listesi alınamadı.** NICCS sayfası PD-WRL-001 için Task statement'ları render etti ama Knowledge ve Skill bölümleri boş döndü. Metinde andığım S0688/S0872/S0874/S0875 beceri ID'leri **üçüncü taraf bir NICE aynasından** geliyor, NICCS veya CPRT'den değil — Task ID'leri güvenilir, Skill ID'leri teyide muhtaç.
- **Alman iş ilanları örneklemi küçük ve anlıktır (n=5).** §5.6'daki desen (Almanca B2 taban, 24/7 vardiya, SÜG) beş ilanda tutarlı, ama istatistiksel bir örneklem değil. Özellikle **"BTL1 Alman piyasasında tanınmıyor" çıkarımı zayıf temellidir** — beş ilanda geçmemesi düşündürücü ama kanıt değil. Ayrıca ilanlar zamanla kaybolur; BKG dışındaki dört ilan için kalıcı URL veremiyorum. **Junior SOC maaş bandı hiç araştırılmadı**, bu dokümanda sayı yok.
- **MITRE ATT&CK Defender (MAD) artık MITRE'de değil:** Aralık 2023'te MITRE Engenuity'den **MAD20 Technologies**'e ayrıldı (mad20.com) ve badge tabanlı bir kimlik merdivenidir — **bir yeterlik ölçeği değildir**, rubrik çapası olarak kullanılamaz. roadmap.sh/cyber-security de aynı şekilde bir **kapsam kontrol listesi**dir, derinlik ölçeği değil.
- **Chancenkarte — üç önceki uyarı bu turda KAPANDI.** (a) Puan tablosunun 2023'ten beri hiç değişmediği teyit edildi (Anlage Fundstelle hâlâ BGBl. 2023 I Nr. 217; kota yetkisi kullanılmadı, Drucksache 21/692). (b) 2026 geçim eşiği **€1.091/ay net** olarak doğrulandı. (c) **§ 20b Nr. 8 Engpassberuf: ISCO 25 = BT/ICT profesyonelleri listede — siber güvenlik +1 puan alıyor.**
- **Geçim eşiği yıla göre değişir ve bu yıl DEĞİŞMEDİ.** €1.091 hem 2025 hem 2026 için geçerli görünüyor (BA ve Make it in Germany'nin "Stand Januar 2026" PDF'i aynı tutarı veriyor). Yıllık endekslenen bir kalemin sabit kalması alışılmadık; başvuru öncesi tekrar kontrol et.
- **Yaş sınırının üst ucu (40) resmî yorumla teyit edilmedi.** § 20b Nr. 9/10 "nicht älter als 35" / "nicht älter als 40" diyor. Resmî portal 35 sınırını "35. yaş gününün günü dahil" olarak yorumluyor, ama **40 sınırı için aynı açıklıkta bir BMI Anwendungshinweis metni bulunamadı.** Yasal ifade lafzen belirsiz; idari yorum pratikte bağlayıcı ama 40 kenarındaysan bunu danışmana sor.
- **Junior SOC maaş dağılımı gerçekten çelişkili ve çözülemez.** StepStone medyan €48.200 · fraghugo €52.000 · jobriver €43.788 (n=13). Bu iş unvanı için resmî bir Destatis rakamı yok. **Nokta değer değil, dağılım olarak modelle** — özellikle Blaue Karte eşikleriyle çakışması tam bu belirsizlik bandında olduğu için (§4.6).
- **Üçüncü taraf göçmenlik siteleri 2026 başlıklı sayfalarda 2024 rakamları yayımlıyor.** Somut örnekler: `relocraft.com`'un "Chancenkarte 2026" sayfası Blaue Karte eşiklerini "€45.300 / €41.041,80" veriyor — bunlar **2024 tutarları, ~€5.400 hatalı**. Techniker Krankenkasse'nin sayfası da "41.041,80 EUR"yi güncel gösteriyor. `visatocampus.com` ise **uydurma bir puan tablosu** yayımlıyor ("tanınan diploma = 6 puan", **"iş teklifi veya mülakat daveti = 1–2 puan"**) — § 20b'de veya Anlage'de böyle bir kriter **yok**. `jobbatical.com` kategorilerin "2026 için gözden geçirildiğini" iddia ediyor; **böyle bir değiştirici Rechtsverordnung mevcut değil** (tablo değerleri doğru ama çerçeve yanlış). **Kural: tutar içeren hiçbir rakamı gesetze-im-internet.de, make-it-in-germany.com veya arbeitsagentur.de dışından alma.**
- **Türk vatandaşları için indirimli vize harcı** iddiası arama sonuçlarında geçiyor ama **hiçbir .de devlet alan adında doğrulanamadı.** Doğrulanmamış kabul et.
- **Alman iş ilanları ve maaş verileri hızla eskir.** §4.6'daki maaş bandı ve §5.6'daki ilan şartları Ağustos 2026 anlık görüntüsüdür.

---

## 10. Kaynak Listesi

*(Bölüm içi bağlantılara ek olarak birincil kaynaklar.)*

**Self-tracking / personal informatics**
- Li, Dey & Forlizzi (2010), *A Stage-Based Model of Personal Informatics Systems*, CHI — https://www.ianli.com/publications/2010-ianli-chi-stage-based-model.pdf
- Rooksby et al. (2014), *Personal tracking as lived informatics*, CHI — https://johnrooksby.org/papers/livedinformatics.pdf
- Epstein et al. (2016), *Beyond Abandonment to Next Steps*, CHI — https://doi.org/10.1145/2858036.2858045
- *Abandonment of personal quantification* (2019), Computers in Human Behavior — https://dl.acm.org/doi/10.1016/j.chb.2019.08.025
- *Beyond self-reflection: rumination in personal informatics* (2021) — https://doi.org/10.1007/s00779-021-01573-w
- *Curators of digital futures* (2024), New Media & Society — https://doi.org/10.1177/14614448241253766

**Öğrenme / hafıza / beceri**
- Karpicke & Roediger (2007), JEP:LMC — https://learninglab.psych.purdue.edu/downloads/2007/2007_Karpicke_Roediger_JEPLMC.pdf
- Karpicke & Roediger (2010), Memory & Cognition — https://doi.org/10.3758/mc.38.1.116
- Storm, Bjork & Storm (2010) — https://sites.lifesci.ucla.edu/psych-bjorklab/wp-content/uploads/sites/13/2016/07/Storm_Bjork_Storm_2010.pdf
- Zell & Krizan (2014), Perspectives on Psychological Science — https://journals.sagepub.com/doi/10.1177/1745691613518075
- Cepeda, Vul, Rohrer, Wixted & Pashler (2008), *Psychological Science* 19:1095–1102 — https://www.yorku.ca/ncepeda/publications/CVRWP2008.pdf
- FSRS-6 algoritması — https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm
- SuperMemo SM-2 algoritması (resmî) — https://www.super-memory.org/archive/english/ol/sm2.htm
- Settles & Meeder (2016), *A Trainable Spaced Repetition Model for Language Learning*, ACL — https://aclanthology.org/P16-1174.pdf
- van de Sande, *Properties of the Bayesian Knowledge Tracing Model*, JEDM — https://files.eric.ed.gov/fulltext/EJ1115329.pdf
- Klinkenberg, Straatemeier & van der Maas (2011), *Computers & Education* 57(2) — https://www.sciencedirect.com/science/article/abs/pii/S0360131511000418
- Corbett & Anderson (1995), *UMUAI* 4(4) — BKT orijinali — https://doi.org/10.1007/BF01099821
- Pavlik, Cen & Koedinger (2009), *PFA*, AIED — http://pact.cs.cmu.edu/pubs/AIED%202009%20final%20Pavlik%20Cen%20Keodinger%20corrected.pdf
- AFM — *Confident Learning Curves in Additive Factors Modeling*, EDM 2020 — https://educationaldatamining.org/files/conferences/EDM2020/papers/paper_121.pdf
- Piech et al. (2015), *Deep Knowledge Tracing* — https://arxiv.org/abs/1506.05908
- Yeung & Yeung (2018), *DKT+* — https://doi.org/10.1145/3231644.3231647
- Khajah, Lindsey & Mozer (2016), *How deep is knowledge tracing?* — https://arxiv.org/abs/1604.02416
- Gervet et al. (2020), *When is Deep Learning the Best Approach to Knowledge Tracing?* — https://theophilegervet.github.io/assets/pdf/gervet2020deep.pdf
- Pelánek (2016), *Applications of the Elo rating system in adaptive educational systems* — https://doi.org/10.1016/j.compedu.2016.03.017
- Pelánek, *Elo-based Learner Modeling for the Adaptive Practice of Facts* (UMUAI, PDF) — https://www.fi.muni.cz/~xpelanek/publications/umuai-adaptive-practice.pdf
- Glickman, *Glicko-2 sistemi* (PDF) — https://glicko.net/glicko/glicko2.pdf
- Newell & Rosenbloom (1981), *Mechanisms of Skill Acquisition and the Law of Practice* — http://iiif.library.cmu.edu/file/Newell_box00032_fld02190_doc0001/Newell_box00032_fld02190_doc0001.pdf
- Heathcote, Brown & Mewhort (2000), *The power law repealed* — https://link.springer.com/content/pdf/10.3758/BF03212979.pdf
- Murre & Dros (2015), *Replication and Analysis of Ebbinghaus' Forgetting Curve*, PLOS ONE — https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0120644
- Cepeda et al. (2006), *Psychological Bulletin* 132(3) — aralık etkisi meta-analizi — https://escholarship.org/content/qt3rr6q10c/qt3rr6q10c.pdf
- Macnamara, Hambrick & Oswald (2014), *Psychological Science* 25(8) — kasıtlı pratik meta-analizi — https://library.scottbarrykaufman.com/uploads/2014/07/Macnamara-et-al.-2014.pdf
- Dreyfus (2004), *The Five-Stage Model of Adult Skill Acquisition* — https://huntercorry.com/dreyfus-2004-the-five-stage-model-of-adult-skill-acquisition.pdf
- Anderson & Krathwohl revize Bloom — 19 bilişsel süreç (CSUDH, PDF) — https://www.csudh.edu/Assets/csudh-sites/academic-affairs/docs/assessment-student-learning/revised-blooms-handout.pdf

**Öğrenme analitiği dashboard'ları (bu artefakt türü hakkında doğrudan kanıt)**
- RCT, n=8.745 — *Applied Sciences* 15(21):11493 (2025) — https://www.mdpi.com/2076-3417/15/21/11493
- Bodily & Verbert (2017), *IEEE TLT* — 93 makalelik derleme — https://doi.org/10.1109/tlt.2017.2740172
- Jivet et al. (2018), *License to Evaluate*, LAK'18 (preprint PDF) — https://research.ou.nl/ws/portalfiles/portal/8215481/LAK_2018_Jivet_preprint.pdf
- Matcha et al. özeti — IJETHE (2023) kontrol listesi — https://link.springer.com/article/10.1186/s41239-023-00394-6

**Motivasyon / davranış**
- Gollwitzer & Sheeran (2006) özeti — https://kops.uni-konstanz.de/server/api/core/bitstreams/c5d2b466-4ee4-4fb1-a22c-867d5f86d86e/content
- Sheeran, Listrom & Gollwitzer (2024), 642 test — https://doi.org/10.1080/10463283.2024.2334563
- Extrinsic rewards meta-analizi — https://www.utupub.fi/handle/10024/173853?show=full
- Kim et al. (2021), *Sticky Goals*, CHI — https://dl.acm.org/doi/fullHtml/10.1145/3411764.3445295

**Ölçme etiği / yönetim**
- Muller (2018), *The Tyranny of Metrics* — https://press.princeton.edu/books/hardcover/9780691174952/the-tyranny-of-metrics
- Campbell vs Goodhart, RSS *Significance* — https://rss.onlinelibrary.wiley.com/doi/10.1111/j.1740-9713.2018.01205.x
- Flyvbjerg, *Getting Risks Right* — https://ktproject.ca/wp-content/uploads/2026/03/From-Nobel-Prize-to-Project-Management-Getting-Risks-Right.pdf
- Holton eleştirisinin 30. yılı (2026), HRDQ — https://doi.org/10.1002/hrdq.70007

**Araçlar / mekanikler**
- Beeminder DTD izohatları — https://blog.beeminder.com/isolines/
- Beeminder akrasia horizon — https://blog.beeminder.com/dial/
- Habitica Task Value — https://habitica.fandom.com/wiki/Task_Value
- Focused Objective (Monte Carlo araçları) — https://www.focusedobjective.com/
- TrainingPeaks — The Science of the Performance Manager (CTL/ATL/TSB) — https://www.trainingpeaks.com/learn/articles/the-science-of-the-performance-manager/
- Cambridge Guided Learning Hours — https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours
- Goethe-Institut kurs yapısı — https://www.goethe.de/ins/de/de/m/kur/dff.html

**Yeterlik framework'leri**
- NIST — *Identifying Proficiency in the NICE Framework* (SFIA'nın resmî benimsenmesi) — https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/identifying-proficiency-nice-framework
- SFIA/NICE — Protection & Defense levelled roles (Cyber Defense Analyst = SFIA 2–5) — https://sfia-online.org/en/news/nice-combine-7-work-role-categories-1.pdf
- SFIA — NICE visualisations — https://sfia-online.org/en/tools-and-resources/sfia-views/sfia-view-information-cyber-security/nice-visualisations
- NIST — *Measuring Cybersecurity Workforce Capabilities: Defining a Proficiency Scale for the NICE Framework* — https://www.nist.gov/system/files/documents/2023/10/05/NIST%20Measuring%20Cybersecurity%20Workforce%20Capabilities%207-25-22.pdf
- NICE Framework Components v2.2.0 (28 Nisan 2025) — https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/current-version
- NICCS — Defensive Cybersecurity (PD-WRL-001), 43 Task statement — https://niccs.cisa.gov/tools/nice-framework/work-role/defensive-cybersecurity
- SFIA 9 — Levels of responsibility — https://sfia-online.org/en/sfia-9/responsibilities
- SFIA 9 — Level 2 · Level 3 (tam generic attribute metni) — https://sfia-online.org/en/sfia-9/responsibilities/level-2 · https://sfia-online.org/en/sfia-9/responsibilities/level-3
- SFIA 9 — Security operations (SCAD) — https://sfia-online.org/en/sfia-9/skills/security-operations
- SFIA 9 — Incident management · Threat intelligence · Vulnerability assessment · Digital forensics — https://sfia-online.org/en/sfia-9/skills/incident-management · `/threat-intelligence` · `/vulnerability-assessment` · `/digital-forensics`
- SFIA — How SFIA works (generic attributes) — https://sfia-online.org/en/about-sfia/how-sfia-works
- DoD Cyber Career Pathway — 511 Cyber Defense Analyst (eski kodlama) — https://dl.dod.cyber.mil/wp-content/uploads/ccp/pdf/511-Cyber-Defense-Analyst-Career-Pathway.pdf

**Olgunluk modelleri / sertifika ve müfredat çapaları**
- SOC-CMM (v2.4, Q4 2025) — https://www.soc-cmm.com/
- Detection Engineering Maturity Matrix (Kyle Bailey) — http://detectionengineering.io/ · https://github.com/k-bailey/detection-engineering-maturity-matrix
- Blue Team Level 1 (Security Blue Team / Centri) — https://www.securityblue.team/certifications/blue-team-level-1
- Blue Team Level 2 — https://www.securityblue.team/certifications/blue-team-level-2
- CompTIA CySA+ (V3/V4 geçişi ve SSS) — https://www.comptia.org/en/blog/the-new-comptia-cybersecurity-analyst-cysa-your-questions-answered/
- Microsoft SC-200 study guide (28 Temmuz 2026 itibarıyla ölçülen beceriler) — https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-200
- Splunk SPLK-5001 test blueprint (PDF) — https://www.splunk.com/en_us/pdfs/training/splunk-test-blueprint-cybersecurity-defense-analyst.pdf
- Elastic sertifikaları SSS — https://www.elastic.co/training/certification/faq
- HTB Academy — SOC Analyst job-role path (15 modül / 167 bölüm) — https://academy.hackthebox.com/path/preview/soc-analyst
- TryHackMe — revamped SOC Level 1 (14 modül) — https://tryhackme.com/resources/blog/introducing-the-revamped-soc-level-1-learning-path
- TryHackMe — SOC Level 2 — https://tryhackme.com/resources/blog/soc-l2-learning-path
- roadmap.sh — Cyber Security (PDF, JS render'sız güvenilir sürüm) — https://roadmap.sh/pdfs/roadmaps/cyber-security.pdf
- MAD20 Technologies (eski MITRE ATT&CK Defender) — https://mad20.com

**Skor tasarımı / hedef yönetimi araçları**
- RescueTime — Productivity Pulse formülü — https://www.rescuetime.com/rescuetime-productivity-pulse
- Google re:Work — OKR playbook (0.6–0.7 tasarım hedefi) — https://rework.withgoogle.com/en/guides/set-goals-with-okrs
- Tability — Net Confidence Score — https://www.tability.io/odt/articles/what-is-a-net-confidence-score
- Perdoo — OKR Health Score — https://www.perdoo.com/resources/okr-health-score
- Exist.io — korelasyon metodolojisi (min. 3 hafta veri, p<0.05) — https://exist.io/blog/correlations/
- Oura — Readiness Score (14 gün vs 2 ay baseline) — https://ouraring.com/blog/readiness-score/
- Amplenote — Task Score boyutları — https://www.amplenote.com/help/task_score_dimensions

**Almanya / hukuk (birincil kaynak)**
- § 20a AufenthG — Chancenkarte (izin, süre, çalışma hakkı) — https://www.gesetze-im-internet.de/aufenthg_2004/__20a.html
- § 20b AufenthG — Punktevergabe für die Chancenkarte — https://www.gesetze-im-internet.de/aufenthg_2004/__20b.html
- Anlage AufenthG (zu § 20a Abs. 3 Nr. 2, § 20b) — puan tablosu, bağlayıcı metin — https://www.gesetze-im-internet.de/aufenthg_2004/anlage.html
- § 6 BeschV — deneyime dayalı nitelikli çalışma (BT istisnası dahil) — https://www.gesetze-im-internet.de/beschv_2013/__6.html
- § 18 AufenthG — nitelikli çalışma genel koşulları — https://www.gesetze-im-internet.de/aufenthg_2004/__18.html
- § 2 Abs. 9–11a AufenthG — dil seviyesi tanımları (gute/ausreichende/hinreichende) — https://www.gesetze-im-internet.de/aufenthg_2004/__2.html
- BMI Bekanntmachung 2.12.2025 — 2026 Blaue Karte maaş eşikleri (BAnz AT 18.12.2025 B3) — https://www.bundesanzeiger.de/pub/publication/REViP4bN6jVdpGxPaiQ/content/REViP4bN6jVdpGxPaiQ/BAnz%20AT%2018.12.2025%20B3.pdf?inline=
- Bundestag Drucksache 21/692 — 11.497 Chancenkarte vizesi, kota uygulanmadı — https://dserver.bundestag.de/btd/21/006/2100692.pdf
- Anlage AufenthG, sürüm/değişiklik bilgisiyle — http://www.buzer.de/Anlage_AufenthG.htm

**Almanya / resmî portallar ve piyasa**
- Make it in Germany — Blaue Karte EU (2026 tutarları, § 18g Abs. 2 BT hükmü, kalıcı oturum takvimi) — https://www.make-it-in-germany.com/de/visum-aufenthalt/arten/blaue-karte-eu
- Make it in Germany — Chancenkarte zur Jobsuche — https://www.make-it-in-germany.com/de/visum-aufenthalt/chancenkarte/chancenkarte-zur-jobsuche
- Make it in Germany — Lebensunterhaltssicherung (Stand Januar 2026) — https://www.make-it-in-germany.com/fileadmin/1_Rebrush_2022/a_Fachkraefte/PDF-Dateien/3_Visum_u_Aufenthalt/Visagrafik_DE/Lebensunterhaltssicherung_Uebersicht_DE.pdf
- Bundesagentur für Arbeit, ZAV Newsletter 02/2026 — Chancenkarte — https://www.arbeitsagentur.de/vor-ort/zav/working-and-living-in-germany/newsletter-iss/02-2026/chancenkarte
- Bundesagentur für Arbeit, ZAV Newsletter 03/2026 — Blaue Karte — https://www.arbeitsagentur.de/vor-ort/zav/working-and-living-in-germany/newsletter-iss/03-2026/blaue-karte
- anerkennung-in-deutschland.de — BT düzenlenmiş meslek değildir — https://www.anerkennung-in-deutschland.de/html/de/fachkraefte.php
- IQ Netzwerk — BT mesleklerinde denklik pratiği (PDF) — https://netzwerk-iq.de/fileadmin/Redaktion/Downloads/FSAQ/FSAQ_Arbeitshilfe_IT-Berufe_barr.pdf
- Integrationsbeauftragte — Assoziationsrecht EWG-Türkei (ARB 1/80) — https://www.integrationsbeauftragte.de/ib-de/ich-moechte-mehr-wissen-ueber/visum/assoziationsrecht-ewg-tuerkei-1872756
- StepStone — Junior Cyber Security Analyst maaşı 2026 — https://www.stepstone.de/gehalt/Junior-Cyber-Security-Analyst.html
- BKG — *Security Analyst – Tier 1 (m/w/d)* iş ilanı (Almanca B2 + SÜG şartı) — https://www.bkg.bund.de/SharedDocs/Stellenangebote/BKG/DE/251026-TI1_312025-EG11.html
