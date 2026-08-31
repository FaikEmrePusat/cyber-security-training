# Haftalık kullanıcı testi — Durum web

**Tarih:** 2026-08-27  
**Persona:** Oak Academy öğrencisi, EDR aşaması, hedef Almanya junior SOC; günlük ~60–90 sn + haftalık snapshot  
**Ortam:** `http://localhost:5173/` · Playwright (Chromium) + kod okuma (`useDerived.ts`)  
**Kanıt:** `haftalik-shots/` · `npm run build` ✓  

---

## 1. Özet hüküm

**Evet — kafası karışık bir kullanıcı bir haftayı “ölmeden” geçirebilir**, çünkü Bugün → Kaydet / Kuyruk / Harita tek ekranda yönlendiriyor; Yaklaşan FSRS’e dökülmüyor; oturum, tekrar, snapshot ve dışa aktarma çalışıyor.

Ama **ilk 10 saniyede güven kırılıyor:** seed’de Tek görev “Write-up → public URL” ve **~4 sa** — 60–90 sn’lik günlük ritüelle çelişiyor. Ayrıca test sırasında **Geri al / Yinele (Strict Mode + çift commit)** P0 seviyesinde bozuktu; bu oturumda düzeltildi (aşağıda).

**Verdict:** Çekirdek operasyonlar ayakta; IA/copy ve “günlük mikro-ritüel” uyumu P1 iyileştirme ister.

---

## 2. Gün gün ne yaptım / ne oldu

### Gün 0 — İlk açılış
- **Bugün:** Tek görev kartı görsel olarak net (eyebrow + başlık + CTA). İçerik ise persona’ya uyumsuz: *Write-up (beyan…) → public URL + sahiplik*, meta **~4 sa**.
- **Nav:** Primary = Bugün, Harita, Tekrar, Log, Almanya · **Daha fazla** = Durum, Beceriler, Kapılar, Hız, Formüller — ayrım anlaşılır.
- **Harita:** Grafik viewport’ta (37 circle, scroll’suz görünür). Alan=Linux filtre çalıştı. Liste’den **3 konu** kuyruğa (8→11); patlama yok.
- **Yaklaşan:** “Ghost — henüz yok” + kilit / Override; Nmap→… listede; FSRS dump yok ✓.

### Gün 1 — Lab
- Bugün hâlâ write-up ROI; lab için **Daha fazla → Beceriler** (bir tık gömülü).
- Skor yükseltme **refsiz engellendi**; ref ile Networking 6→7 ✓.
- **Log:** oturum kaydı toast ile tamam; form `label`’larında `htmlFor` yok (a11y sürtünme).
- **Tekrar:** Başarılı + Zorlandım.
- **Geri al (önce):** 1 tık yalnızca log’u geri alıyordu, FSRS satırı kalıyordu → **P0**. Düzeltme sonrası 1 tıkta restore ✓.

### Gün 2 — Retrieval
- Vade rozetleri net (turuncu “vade”).
- 2 retrieval tamamlandı.
- Overdue zorlanınca Bugün: *“Önce tekrar: vadesi geçmiş 11 madde — bugün en fazla 3”* ✓ (görev kayması doğru).
- **Sürtünme:** Bugün 3 diyor; Tekrar tablosu 11 vade satırını + 3 butonu birden gösteriyor → 60–90 sn’de boğulma hissi.

### Gün 3 — Hata kurtarma
- Almanya Gate 0 yanlışlıkla değiştirildi → **Geri al** state’i restore etti.
- **Yinele (önce):** buton aktif ama değer dönmüyordu (Strict Mode + `setState` içinde ref mutasyonu) → **P0**. Düzeltme sonrası redo ✓.

### Gün 4 — Haftalık ritüel
- Log → Haftalık snapshot ✓.
- **Hız:** ≥2 snapshot ile “Ölçülen R” açılıyor; ΔR yalnızca ≥3’te (sahte grafik yok) ✓.
- JSONL kopyala + indir (`ilerleme-pending-….jsonl`) ✓.

### Gün 5 — Overwhelm
- Ağaç’ta **En fazla N** (varsayılan 3) · `+3` → kuyruk +3 (11→14), patlama yok ✓.
- SIEM callout → `/harita#yaklasan` net ✓.

### Gün 6 — Return path
- **Kod:** `useDerived.ts` · `boslukGun: 14` · oturum boşluğu veya yüksek TSB → geri dönüş görevi; ETA gizlenir.
- **Geçici test:** son oturumu 16g geriye aldık → *“Geri dönüş modu: bugün 3 tekrar…”*; state geri yüklendi (kalıcı bozmadık).
- **Kapılar:** pipeline + SIEM callout okunabilir ✓.

### Gün 7 — Full tour
- Tüm primary + overflow route’lar açıldı; bilinmeyen URL `/`’e düşüyor.
- Boş sayfa / pageerror yok.
- Birçok sayfada semantik `<h1>` yok (Section başlığı); işlevsel ama a11y/IA zayıf.

---

## 3. Çalışan akışlar ✓

| Akış | Sonuç |
|------|--------|
| Bugün tek-görev kartı + CTA’lar | ✓ (içerik tartışmalı) |
| Primary / Daha fazla nav | ✓ |
| Harita grafik + alan filtresi + kuyruğa 2–3 ekle | ✓ |
| Yaklaşan kilit / FSRS dump yok | ✓ |
| Beceriler: kanıtsız yükseltme engeli / ref ile yükseltme | ✓ |
| Log oturum + haftalık snapshot | ✓ |
| Tekrar başarılı/zorlandım | ✓ |
| Overdue → Bugün “önce tekrar” | ✓ |
| Almanya undo (+ redo, fix sonrası) | ✓ |
| Hız empty/progressive charts | ✓ |
| JSONL kopyala/indir | ✓ |
| Toplu +N ≤3 | ✓ |
| SIEM → Yaklaşan | ✓ |
| Geri dönüş modu (kod + geçici test) | ✓ |
| Kapılar pipeline | ✓ |
| Nav smoke / 404→home | ✓ |
| `npm run build` | ✓ |
| Ölü `onClick` / TODO buton grep | belirgin ölü buton yok |

---

## 4. Kırık / zor / kafa karıştırıcı bulgular

| Sev | Bulgu | Durum |
|-----|--------|--------|
| **P0** | **Yinele (redo)** Strict Mode’da yığın bozuluyordu; UI değişmiyordu | **Düzeltildi** (`store.tsx`: undo/redo `setState` dışında, `stateRef`) |
| **P0** | **Tekrar işaretle → Geri al** iki ayrı commit (`setRetrieval` + `appendLog`); 1× undo yetmiyordu | **Düzeltildi** (`commitWithLog` + `Tekrar.tsx` `mark`) |
| **P1** | Seed/ROI Tek görev: write-up **~4 sa** — 60–90 sn EDR günüyle uyumsuz; “ne yapayım?” hissi | **Düzeltildi** (günlük dilim / mikro tercih) |
| **P1** | Overdue 11 iken Bugün “en fazla 3” diyor; Tekrar tablosu tüm vadeleri + 3 sonuç butonu gösteriyor | **Düzeltildi** (Bugün önerilen ≤3 + Daha sonra) |
| **P1** | Lab günü Beceriler **Daha fazla** altında; 60 sn ritüelde keşif maliyeti | **Düzeltildi** (primary nav) |
| **P2** | Log (ve benzeri) formlarda `label` ↔ kontrol `htmlFor`/`id` yok | **Düzeltildi** |
| **P2** | Copy jargonu: R, TSB, FSRS, Ghost, κ, CTL/ATL — ilk hafta öğrencisi için yoğun | **Kısmen** (Bugün/Tekrar/SIEM/Yaklaşan/Hız sade dil) |
| **P2** | Birçok sayfada `<h1>` yok (Tekrar, Log, Almanya, Beceriler, Hız, Formüller) | **Düzeltildi** (`Section as="h1"`) |
| **P2** | “En fazla 3 ekle” yerine “En fazla N” + `+3` — anlaşılır ama metin brief’tekiyle birebir değil | **Düzeltildi** (etiket: En fazla) |

---

## 5. Anlaması güç yerler (UX copy / IA)

1. **Tek görev vs süre:** “Tek” vaadi + “~4 sa” / ROI artefakt dili → günlük mikro görev değil.
2. **Harita “Ghost — henüz yok”:** Yaklaşan için şiirsel; “kilitli gelecek müfredat” daha düz olurdu.
3. **SIEM callout “3/5 · FSRS’e dump yok”:** doğru ama kısaltma yığını; EDR öğrencisi “ben ne yapayım?” bekliyor.
4. **Tekrar lead formülü** (`R(t,S)=…`): power-user; günlük kullanıcıya üstte “bugün 3 madde” özeti daha önde olmalı.
5. **Beceriler lead:** “Asimetrik mandal… S_etkin…” — model belgesi tonu; işlem ekranı tonu değil.
6. **Primary’de Log var, Beceriler yok** — skor/kanıt lab gününün parçasıysa IA ters.

---

## 6. Önerilen düzeltme listesi (öncelikli)

1. ~~**P0** Undo/redo Strict Mode-safe + tek adımlı retrieval mark~~ → **yapıldı** (bu oturum).
2. **P1** Bugün Tek görev: tempo/persona filtresi — günlük bütçe (ör. ≤90 dk veya “bugünkü mikro adım”) yoksa ROI’yi “Diğer seçenekler”e it; EDR aşamasında lab/tekrar önceliklendir.
3. **P1** Tekrar: “Bugün önerilen (3)” üstte; kalan vadeler `details`/“Sonra göster” ile.
4. **P1** Lab kısayolu: Bugün CTA’ya “Beceri güncelle” veya Beceriler’i primary’ye yaklaştır.
5. **P2** Form `label htmlFor` + tutarlı `<h1>` (Section `as="h1"` veya sayfa hero).
6. **P2** İlk hafta “sade dil” toggle veya tooltipler (R / TSB / FSRS tek cümle).
7. **P2** Yaklaşan lead: “Ghost” → “Henüz müfredatta yok — kuyruğa kilitli”.

---

## Notlar (test hijyeni)

- Haftalık simülasyon başında `localStorage` yedeklendi, sonda **geri yüklendi**.
- Return-mode testi geçici tarih kaydırması sonrası **aynı snapshot’a döndü**.
- Ek repro seed’i temizledi → sonraki açılış seed state (sağlıklı).
- Kalıcı corrupt bırakılmadı.
- P0 fix’ler commit edilmedi (istendiği gibi).

---

## Düzeltildi (2026-08-27 UX pass)

| Bulgu | Ne yapıldı |
|-------|------------|
| Tek görev ~4 sa | `useDerived`: günlük tavan 0.75 sa; kısa/kanıt ROI tercih; uzun iş → **“Bugün: 25 dk dilim — …”**; tam süre **Diğer seçenekler / haftalık backlog** |
| Tekrar 11 vade vs Bugün ≤3 | Tekrar: **Bugün önerilen (≤3)** üstte; kalan **Daha sonra (N)** `details` |
| Beceriler gömülü | Primary nav: Bugün · Harita · **Beceriler** · Tekrar · Log · Almanya |
| Log `htmlFor` | Oturum + JSONL alanlarında `label htmlFor` + eşleşen `id` |
| R / TSB / FSRS jargonu | Bugün gauge + hero: Hazırlık / Güven payı / Yorgunluk (`title` ile jargon); Tekrar sade lead; SIEM callout “tekrar kuyruğuna dökülmez”; Yaklaşan “Ghost” → kilitli müfredat metni |
| P2 hızlı | Section `as="h1"` (Log/Tekrar/Beceriler/Almanya/Hız/Formüller); Beceriler lead sade; Harita “En fazla”; Bugün **Beceri** CTA |

`npm run build` ✓ · Undo/redo / SIEM kilit dokunulmadı.
