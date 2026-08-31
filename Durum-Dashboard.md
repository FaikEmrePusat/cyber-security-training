# İlerleme Durum Dashboard — kullanım

Takvim değil — **state + formül + kapı** paneli.
Panelin amacı tek bir soruya cevap vermek: **şu an ne yapmalıyım, ve neden?**

## Açılış

Cursor Canvas (sohbet yanında canlı React panel):

→ [ilerleme-durum-dashboard.canvas.tsx](file:///C:/Users/User/.cursor/projects/d-Projects-Cyber-Security-Training/canvases/ilerleme-durum-dashboard.canvas.tsx)

Dosyaya tıkla veya Cursor'da `canvases` klasöründen aç.
İlk açılışta **2026-08-27 diagnostic seed'i** yüklü gelir.

> **Model 2.1 (P1).** Seed snapshot'taki `R = 26.62` lineer formül + eski Σw ile hesaplanmıştır.
> Geometrik R (ρ=0, portfolio T'den çıkarılmış) ile aynı seed **~23** civarındadır.
> Hedef artık elle 70 değil: `T* 5.8 · P* 6.6 · L* 7.5 · C* 9.0` ⇒ **R_hedef ≈ 67.3**.
> Başvuru eşiği **R_giriş ≈ 55** (Gate D).

---

## Panelin okuma sırası

| # | Bölüm | Cevapladığı soru |
|---:|---|---|
| 1 | **BUGÜN — TEK GÖREV** | Şu anda ne yapıyorum? |
| 2 | Durum şeridi + R + GM + TSB | Neredeyim, ne kadar marjım var? |
| 3 | **Chancenkarte + dual rota ETA** | Almanya yolu hukuki/finansal olarak ne zaman? |
| 4 | Trend | Hangi yöne gidiyorum? |
| 5 | Hız (CTL/ATL/TSB · v_tahmin · κ) | Ne kadar hızlı, model doğru mu? |
| 6 | Marjinal getiri (%75 kuralı) | Sıradaki en verimli işler |
| 7 | Kapılar (0, A–F) | Neyin kilidi ne zaman açılır? |
| 8 | Girdiler | Sayıları güncelle |
| 9 | Log | Ölçümü kalıcı yap |
| 10 | Formül kartı | Bütün matematik tek sayfada |

### Chancenkarte ve Anerkennung

- **Puan motoru:** §20b AufenthG — yaş ≤35 = 2 puan; kısmi bescheid = +4; eşik ≥6.
- **Anerkennung aşaması:** panelden seç (anabin → IHK FOSA → bescheid). Detay: `Anerkennung-Rehberi.md`.
- **Seçenek 1:** tam denklik (anabin H+ / Volle Bescheid) — puan sistemi gerekmez.
- **Seçenek 2:** kısmi denklik + puan tablosu.
- **Rota A / Rota B:** header stat'larda ayrı ETA; `ETA = max_k ETA_k`.

### 1. BUGÜN — TEK GÖREV

- **3+ vadesi geçmiş tekrar** → önce FSRS kuyruğu (geri dönüş modunda otomatik).
- Değilse → en yüksek `ROI_etkin` (%75 kuralı: darboğaz boyuta odak).
- WIP limiti: en fazla **2 teknik + 1 dil** aktif konu.

### 2. Durum şeridi

- **R (etkin)** — geometrik birleşim, kapılar bunu kullanır.
- **R_hedef ~67** ve **R_giriş ~55** referans çizgileri R barında.
- **GM (gün)** — en zayıf Gate A becerisinin çürüme marjı (days-to-derail tarzı).
- **TSB** — form yorgunluğu; yüksekse geri dönüş modu tetiklenebilir.

### 3. Chancenkarte + dual rota

- **Gate 0:** §20b puan ≥6 + denklik bilgisi (Anerkennung şimdilik *araştırılıyor*).
- **Gate F:** runway ≥12 ay — birikim/aylık tasarruf bilinmiyorsa alanı doldur.
- **Rota A** (~EN işveren): kısa ETA, EN≥7 odaklı.
- **Rota B** (Chancenkarte): DE B2 gerekir — **7 h/hf** ve **14 h/hf** dil senaryoları yan yana.
- Formül: `ETA = max_k ETA_k` (T, L, P, C bileşenlerinin en yavaşı).

### 4–5. Trend ve hız

- **CTL/ATL/TSB** günlük `session` log'undan; `v_tahmin = (0.7×CTL − 3.7)/9.25`.
- ≥4 snapshot sonrası Monte Carlo P50/P85/P95 (yeterli veri yoksa "ölçülmedi").
- Geri dönüş modunda ETA gizlenir; tekrar önceliklidir.

### 6. Marjinal getiri

Her aday iş için model baştan hesaplanır (kanıt tavanı + P doygunluğu dahil).
Kapı darboğazına `λ=1.5` bonus.

### 7. Kapılar

| Kapı | Özet |
|---|---|
| **0** | Hukuki / Chancenkarte ön koşul |
| **A** | net≥6, linux≥6, win≥5 |
| **B** | A + secfund≥6, siem≥5 |
| **C** | ≥2 public artefakt (≥1 SOC/AD lab) |
| **D** | R≥55 + C + 0 + DE≥5 + EN≥7 |
| **E** | D + son 14 günde ≥2 mülakat kaydı |
| **F** | Runway ≥12 ay (Rota B) |

Kartlarda **if-then** cümleleri görünür (P1.10).

### 8–9. Girdiler ve log

- Dil: **konuşma / genel** alt skorları (DE 0.6/0.4, EN 0.6/0.4).
- B2 ETA hem 7 hem 14 saat/hf tempo ile gösterilir.
- Tekrar tablosu: FSRS `R(t,S)` + stabilite.
- Snapshot yaz → `Ilerleme-Log.jsonl` (append-only).

### Günlük ritüel (~60–90 sn)

1. Dünkü oturumu `session` olarak kaydet (saat × kalite).
2. Vadesi gelen tekrarı yap, sonucu işaretle.
3. Tek görevi bitir; WIP aşma.

---

## Kanonik sayılar (model 2.1)

| | Değer |
|---|---|
| Hedef vektör | T* 5.8 · P* 6.6 · L* 7.5 · C* 9.0 |
| R_hedef | ~67.3 |
| R_giriş (Gate D) | ~54.8–55 |
| CEFR | A1 1.5 · A2 3 · B1 5 · B2 7.5 · C1 9.5 |
| Chancenkarte yaş≤35 | 2 puan |
| Σw (T, port hariç) | 10.9 |

Detaylı matematik: `Ilerleme-Durum-Modeli.md`.
