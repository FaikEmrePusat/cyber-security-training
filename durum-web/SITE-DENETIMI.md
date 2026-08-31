# Durum Web — Site Denetimi (Üç Lens)

**Tarih:** 2026-08-27  
**URL:** http://localhost:5173/  
**Kod:** `durum-web/`  
**Erişim:** Ulaşılabilir (Vite dev ayakta; 10/10 rota HTTP 200; Playwright ile tüm sayfalar yüklendi; production `npm run build` başarılı; konsol hatası yok)

---

## 1. Genel hüküm

Durum, Oak@EDR → Almanya junior SOC yolunu **tek görev + kapı + kanıt** diline çeviren, istemci-yanlı tutarlı bir kişisel operasyon paneli; görsel dil (Fraunces/Figtree, denizci yeşili, durum şekilleri) bilinçli ve “AI slop”dan uzak. Buna karşılık **10 maddelik nav**, seed’in her açılışta **geri dönüş modu** göstermesi, Bugün’de ROI alternatiflerinin Oak/SIEM yerine portföy metriklerine kayması ve Harita’da grafın fold altı + etiketsiz düğümler yüzünden okunaksızlaşması ürünü “doğru kariyer motoru”ndan “metrik tiyatrosu riski”ne çekiyor. Çökme yok; öncelik P1 UX/kariyer hizası.

---

## 2. Sayfa sayfa bulgular

| Sayfa | Çalışıyor? | Ne iyi | Kırık / kafa karıştırıcı | Lens notu |
|-------|------------|--------|---------------------------|-----------|
| `/` Bugün | Evet | Tek görev kartı, Kaydet/Kuyruk/Harita CTA, R·GM·TSB, kompakt kapı hattı | Seed → sürekli “Geri dönüş modu”; ROI pill’leri tek görevi böler; nav’da “Durum” hem marka hem sayfa | A: hiyerarşi güçlü ama kalabalık. B: dönüş modu Oak ilerlemesini gölgeler. C: hatasız |
| `/durum` | Evet | Büyük R halkası, radar, T/P/L/C, kanıt açığı/çürüme | Radar etiketleri sıkışık; “Skor” başlığı nav “Durum” ile çelişir | A: glanceable. B: SIEM/Portfolio düşük — doğru sinyal ama eylem yok. C: OK |
| `/beceriler` | Evet | Asimetrik mandal + kanıt ref zorunluluğu | Uzun tablo duvarı; ~68 etiketsiz kontrol; lead teknik jargon | A: okunmaz. B: kanıt kültürü doğru. C: a11y zayıf |
| `/kapilar` | Evet | 0→F pipeline, tıklanınca darboğaz | Gate 0 “Bilinmiyor” dışında az yönlendirme; yüzdeler gri → hiyerarşi zayıf | A: sade. B: Gate 0/Anerkennung bağını Almanya’ya taşır. C: OK |
| `/almanya` | Evet | Chancenkarte puan, Gate 0, Anerkennung aşaması, dual rota, resmi linkler | Form alanı yoğun; ETA geri dönüşte gizli (anlaşılır ama soğuk); ~10 etiketsiz input | A: form-ağır. B: kariyer sinyali en güçlü sayfa. C: OK |
| `/hiz` | Evet | CTL/ATL/TSB, projeksiyon, tempo tablosu, ROI listesi | Seed’de CTL=0 → v negatif; metrik yoğunluğu yüksek | A/B: metrik tiyatrosu riski. C: grafik render OK |
| `/harita` | Evet | 141+8 müfredat, kilitli yaklaşan (Nmap→GRC), Graf/Ağaç/Liste, override | Graf fold altında (~top 957px); n>16 etiketsiz; “Bugün” CTA hep dolu görünür; hub seçince graf yine scroll ister | A: chrome > içerik. B: kilit doğru. C: 141 düğümde ~200ms; performans kabul |
| `/tekrar` | Evet | FSRS, kuyruk ≤3 uyarısı, Harita’ya yönlendirme, öneri seçki | Seed 8 madde (tavana değil desteye); formül lead’i duvar; “sonra” önerileri kolay açılır | A: tablo ağır. B: Harita ayrımı doğru. C: OK |
| `/log` | Evet | Oturum/snapshot, JSONL import-export, seed sıfırla (onaylı) | Lead + çok bölüm; draft alanları `label` wrapsız (a11y) | C: XSS yok (React text escape); `durum-v22` persist |
| `/formuller` | Evet | `<details>` ile bakıldığında model 2.1 | Günlük kullanımda gereksiz nav ağırlığı | A: iyi empty/collapse. B: referans. C: OK |

**Ek ölçümler (Playwright):** 10 sayfa yükleme ~430–535 ms; konsol error/warning 0; pageerror 0; mobil nav overflow `scrollWidth 673 > clientWidth 268`; localStorage: `durum-v22`, `durum-curriculum-v1`.

---

## 3. Lens A — Ürün / UI tasarımcı

### P0
- Yok (görsel çökme / erişilemeyen kritik UI yok).

### P1
1. **Harita grafı ilk bakışta yok:** Hero + quiet-strip + legend + filtreler grafı viewport dışına itiyor; kullanıcı “boş sayfa” sanıyor.
2. **10 linkli sticky nav:** Mobilde zorunlu yatay kaydırma; “Formüller / Hız / Log” günlük yolda birinci sınıf olmamalı.
3. **Bugün’de çift mesaj:** “Tek görev” + ROI pill’leri (0.57 / 0.43) ikincil yarışmacı görev gibi duruyor — glanceability bozuluyor.
4. **Harita “Bugün” butonu her zaman primary (`cta`)** — `todayOnly` kapalıyken de seçili gibi; durum dili yalan söylüyor.
5. **Graf düğümleri (n>16) etiketsiz:** 36 Net noktası yalnızca boyut/renk; seçmeden konu okunmuyor.
6. **Hero’da marka tekrarı:** Her sayfada dev “Durum” + sayfa adı; compact sayfalarda gereksiz dikey tüketim (`min-height` hero).

### P2
- Durum şekil dili (baklava/daire/üçgen) tutarlı ve güzel; legend bazen içerikten uzak.
- `prefers-reduced-motion` var — iyi.
- Beceriler/Tekrar/Hız kart-olmayan ama tablo-duvarı; empty state (vadesi yok) nazik.
- Renk: maritime teal — mor/krem slop yok; marka testi geçiyor.

---

## 4. Lens B — Siber kariyer danışmanı (Almanya junior SOC)

### P0
- Yok (yanlış kilitleme / yanlış müfredat dump’ı yok).

### P1
1. **Seed = sürekli geri dönüş modu:** Oturum yok → Bugün “15 dk hafif pratik / geri dönüş”; Oak@EDR sonraki adımı ve SIEM boşluğu görünmüyor. Yeni gün / ilk açılış “dönüş” değil “kurulum + bir lab” olmalı.
2. **ROI tiyatrosu vs Oak yolu:** Alternatifler “public URL + sahiplik / araç yayınla” — P boyutunu şişirir; junior SOC için bugünkü darboğaz çoğu zaman **Linux/Win + kanıtlı lab + (kilitli) SIEM hazırlığı**, portföy URL değil.
3. **SIEM Gap görünür değil:** `siem` claimed 3, Gate B eşiği 5; SIEM konuları `tekrar-sonra` ile kilitli (doğru) ama Bugün/Kapılar’da “EDR bitince SIEM açılacak” sinyali zayıf → kullanıcı roadmap önerisinden SIEM’i erken FSRS’e basabilir.
4. **Yaklaşan kilit (Nmap→GRC) doğru:** Harita “Kilitli gelecek” + override; kariyer açısından Off/Nmap’e erken kaymayı engelliyor — korunmalı.
5. **Almanya sinyalleri dağınık:** Anerkennung / Gate 0 / DE A1 Almanya sayfasında güçlü; Bugün’de dil veya denklik CTA’sı yok — Almanya junior için haftalık dil dilimi unutulur.
6. **Kanıt tiyatrosu riski:** Çoğu beceri `evidence: yok`; Durum “Açık 5.5” gösteriyor ama Bugün bunu “bugün bir kanıt dosyası ekle” eylemine bağlamıyor.

### P2
- **Harita vs Tekrar ayrımı doğru** (“buraya dump etme”) — sürdür.
- Portfolio / CV / funnel Beceriler+Almanya’da var; LinkedIn ağı 0 — makul.
- Engpassberuf “doğrulanmadı” uyarısı dürüst.
- Metrik bolluğu (R, GM, TSB, CTL, κ, π_G…) junior’ı yorabilir; günlük yüzey Bugün+Tekrar+Log ile sınırlanmalı.

---

## 5. Lens C — Web programcı

### P0
- Yok (build kırık değil; runtime crash yok).

### P1
1. **a11y — Beceriler ~68, Almanya ~10, Log ~7 etiketsiz kontrol:** Tablo içi `<select>` / sarmalanmamış `<label>` + `for` eksikleri; klavye/AT zor.
2. **Ctrl+Z tüm sayfada store undo** (input içinde de) — native metin geri almayı eziyor; bilinçli ama sürpriz.
3. **Harita varsayılan deneyimi:** `alanFilter=net` + uzun hero → graf görünmeden scroll; boş filtre mesajı nadiren tetiklenir, “kayıp UI” hissi bug gibi.
4. **Seed retrieval 8 madde** vs günlük `kuyrukTavani: 3` — mantıken deste ≠ günlük WIP; UI’da karışmasın diye Tekrar’da “destede N / bugün ≤3” ayrımı netleştirilmeli.
5. **İki localStorage anahtarı** (`durum-v22`, `durum-curriculum-v1`) — şema migrate/reset tutarsızlığı riski (curriculum reset seed ile silinmeyebilir).

### P2
- `npm run build` (tsc + vite) temiz; bundle ~344 kB JS gzip ~109 kB.
- Undo/redo (50 adım, 800 ms coalesce) sağlam.
- XSS: JSONL `not` React text olarak basılıyor; canlı `<img onerror>` yok (düşük risk, client-only).
- `dangerouslySetInnerHTML` yok.
- Harita 141 düğüm: alan filtresi zorunlu (all = hub); Net grafı ~37 circle, switch ~230 ms — kabul edilebilir; tüm 141’i tek SVG’de zorlamamak doğru.
- Dead UI yok; filtreler çalışıyor; yaklaşan kilit `useCurriculumStatuses` + `addToQueue` ile tutarlı.

---

## 6. En iyi 5 şey

1. **Bugün → tek görev + Kaydet/Kuyruk/Harita** — günlük kullanım niyeti net.
2. **Durum/alan görsel dili** (`visual.css`: şekil + renk) tutarlı ve ayırt edici.
3. **Harita ↔ Tekrar ayrımı** ve yaklaşan müfredatın (Nmap…GRC) kilitlenmesi kariyer açısından doğru.
4. **Kanıt mandalı + Chancenkarte/Anerkennung** Almanya junior gerçekliğine oturuyor.
5. **İstemci mimarisi:** tek store, undo, JSONL köprüsü, typesafe model 2.1, temiz build — kişisel araç için olgun.

---

## 7. En acil 7 düzeltme (öncelik sırası)

1. **Bugün seed/geri dönüş:** İlk oturum yoksa “kurulum / Oak sonraki konu” göster; “geri dönüş”ü gerçekten ≥14 gün boşluk sonrası kullan.  
2. **Harita: grafı fold üstüne al** — hero kompakt + filtreler dar; ilk ekranda SVG görünsün.  
3. **Bugün ROI pill’lerini kaldır veya “ikincil” yap** — tek görev tek cümle; portföy ROI’sini Log/Hız’a it.  
4. **Nav’ı sadeleştir** — birincil: Bugün · Harita · Tekrar · Log · Almanya; geri kalan “Daha fazla”.  
5. **SIEM/Gate B kariyer bandı** — Bugün veya Kapılar’da “SIEM kilitli · EDR sonrası · hedef ≥5” tek satır.  
6. **Harita “Bugün” CTA state** — `todayOnly` ile dolu/ghost senkron; etiketsiz graf için hover/seçim paneli zorunlu tut (zaten var) ama varsayılan Liste veya ≤16 etiket.  
7. **Beceriler/Log a11y** — her kontrolde `aria-label` veya `htmlFor`; Ctrl+Z’yi input dışıyla sınırla.

*(P0 crash bulunmadığı için denetim sırasında kod düzeltmesi yapılmadı; acil maddeler “Düzeltildi (2026-08-27)” bölümünde giderildi.)*

---

## 8. Önerilen sonraki sprint

### Visual
- Compact hero (özellikle Harita/Kapılar/Durum).  
- Nav: 5 birincil + overflow menü; mobil bottom veya “More”.  
- Harita: graf-first layout; hub varsayılan; düğüm seçilince panel (mevcut) otomatik aç.  
- Bugün: ROI pill → tek satır “diğer seçenekler” collapse.

### Career
- Bugün şablonu: `(1) vadesi geçen tekrar ≤3` → `(2) Oak aktif alan lab + kanıt ref` → `(3) dil 20 dk` → ancak sonra portföy ROI.  
- SIEM kilidi ve Gate B’yi görünür checklist yap.  
- Almanya: haftalık “Anerkennung bir adım” mikro-CTA (anabin / FOSA).  
- Seed retrieval’ı 3 WIP’e indir veya “öğrenme destesi” diye etiketle; crypto seed’ini SOC önceliğinin arkasına koy.

---

*Denetim yöntemi: Vite canlı tarama (Playwright Chromium — desktop+mobil ekran görüntüleri), kaynak incelemesi (`App`, sayfalar, `store`, `visual.css`, `oakCurriculum`, model), `npm run build`.*

---

## Düzeltildi (2026-08-27)

1. **Geri dönüş modu:** Seed’de oturum yokken artık dönüş modu açılmıyor; yalnızca gerçek oturum sonrası ≥14 gün boşluk (veya yüksek TSB) tetikliyor (`useDerived.ts`).
2. **Harita fold:** Hero/quiet-strip kaldırıldı; sticky kompakt filtre + graf ilk viewport’ta; “Bugün” CTA `todayOnly` ile senkron.
3. **Bugün ROI:** Alternatifler `<details>` içinde “Diğer seçenekler” — TEK GÖREV baskın.
4. **Nav:** Birincil Bugün · Harita · Tekrar · Log · Almanya + “Daha fazla” menü; undo/redo korundu.
5. **SIEM / Gate B:** Bugün + Kapılar’da “Sonraki kurs bloğu: SIEM” bandı → `/harita#yaklasan` (FSRS’e unlock yok).
