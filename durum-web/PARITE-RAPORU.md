# Durum web ↔ Canvas parite raporu

Kaynak: `ilerleme-durum-dashboard.canvas.tsx` (model 2.1)  
Hedef: `durum-web/src`  
Tarih: 2026-08-27  
Son güncelleme: 2026-08-27 (parite düzeltmeleri)

---

## 1. Özet hüküm

Web uygulaması **büyük ölçüde tamamlanmış, sadık bir port**: `MODEL` sabitleri ve `computeAll` / kapı / Chancenkarte / FSRS / CTL / ROI / tek-görev mantığı canvas ile birebir örtüşüyor; seed’te canlı geometrik **R ≈ 22.8 (~23)** çıkar. Önceki denetimde UI/gözlem katmanı eksikleri (grafikler, skor→log, radar kapsamı, BUGÜN alternatifleri, artefakt tür seçimi) **kapatıldı**. Kritik bir matematik sapması bulunmadı.

---

## 2. Eşleşme tablosu

### A. Model / matematik

| # | Madde | Durum | Not |
|---|---|---|---|
| 1 | MODEL sabitleri (ağırlıklar, R, kanıt, kapı, CEFR, Chancenkarte, FSRS, CTL/ATL, çürüme, ROI λ, …) | ✓ | `constants.ts` ≈ canvas `MODEL` satır satır |
| 2 | `computeAll` / S_eff / geometrik R (ρ=0) / portfolio T dışı | ✓ | `tHaric: ["port"]`, Σw=10.9 |
| 3 | Seed diagnostic R ↔ canvas canlı geometrik R (~23) | ✓ | Canlı R≈22.80; snapshot satırındaki 26.62 lineer/eski T (her iki tarafta aynı) |
| 4 | Gate 0, A–F formülleri + π | ✓ | `evaluateGates` aynı yapı |
| 5 | Gate E mülakat / 14g pencere | ✓ | `session(mod=mulakat)` + funnel aşamaları |
| 6 | Chancenkarte §20b + Anerkennung | ✓ | EN C1 kodda +1 (belge +2 demesine rağmen; canvas da +1) |
| 7 | Dual rota ETA (A / B @ 7h·14h), `max_k` | ✓ | `componentEtaHafta` + `hoursLangAlt` |
| 8 | CTL/ATL/TSB session’dan | ✓ | `buildPmc` |
| 9 | FSRS/Cepeda retrieval | ✓ | `w20=0.2`, `factor=0.6935` (belgedeki 0.5 / 19/81 değil; canvas ile aynı) |
| 10 | v_tahmin / v_ölçülen / κ | ✓ | CTL + plan + measuredVelocity |
| 11 | Asimetrik mandal (yükseltme→ref) | ✓ | Beceri + kariyer + artefakt; dil skorunda yok (canvas’ta da yok); skor/kanıt/ref değişince `skor` log yazılır (kariyer: skor+kanıt) |
| 12 | Çürüme / idle negatif hız | ✓ | `decayMultiplier` + `h0=3.7` → v&lt;0 |
| 13 | Tek görev (BUGÜN) | ✓ | Geri dönüş → TSB&lt;−20 → overdue≥1 → top ROI |
| 14 | Marjinal ROI sıralaması | ✓ | λ=1.5, model yeniden hesap |
| 15 | Geri dönüş modu / GM | ✓ | `boslukGun=14`, `tsbEsik=15`, `safetyMarginGun` |
| 16 | Monte Carlo P50/P85/P95 | ~ | İkisinde de gerçek MC yok; σ tabanlı ETA aralığı (≥4 snap); canvas’ta “P85” etiketi plan ETA için — **ertelendi** (yetersiz veri / her iki taraf da stub) |

### B. UI / kontrol (özellik paritesi)

| # | Madde | Durum | Not |
|---|---|---|---|
| 1 | Beceri + kanıt + ref düzenleme | ✓ | `/beceriler` + `skor` log |
| 2 | Artefakt / üretim | ✓ | Düzenleme + ekleme; tür seçici (soc-lab, ad-lab, vm-lab, arac, writeup, lab-egzersizi) |
| 3 | Dil DE/EN | ✓ | Konuşma/genel + kanıt |
| 4 | Kariyer alanları | ✓ | + `skor` log (beyan/kanıt) |
| 5 | Tempo saatleri (siber/dil/alt) | ✓ | `/almanya` |
| 6 | Session log + haftalık snapshot | ✓ | `/log` |
| 7 | JSONL export/import | ✓ / + | Export (pano+indir) + import; canvas yalnızca pending kopyala |
| 8 | Retrieval aksiyonları | ✓ | `/tekrar` |
| 9 | Diagnostic’e sıfırla | ✓ | |
| 10 | Formül görünürlüğü | ✓ | `/formuller` MODEL’den interpolasyon |
| 11 | Grafikler (R projeksiyon, CTL, radar, trend) | ✓ | R plan/çürüme + snapshot R + radar(12); CTL serisi (≥2 gün); T/P/L/C trend (≥2 snap); ΔR/hafta (≥3 snap); veri yoksa grafik gösterilmez |
| 12 | Chancenkarte runway/birikim | ✓ | |
| 13 | BUGÜN sıradaki iki ROI | ✓ | TEK GÖREV altında `roiList.slice(1,3)` |

---

## 3. Sayısal doğrulama

`npx tsx` ile `durum-web` seed’i (Δt=0, kanıt tavanı açık):

| | Beyan | Canlı (etkin) | Not |
|---|---:|---:|---|
| **T** | 4.41 | **3.84** | Port hariç; eski belge Σw=12.3 ile 3.63 diyordu |
| **P** | 1.81 | **0.95** | |
| **L** | 2.64 | **2.64** | Seed DE≈1.2 / EN≈4.4 (belge “DE2/EN6→L3.35” güncel değil) |
| **C** | 2.00 | **2.00** | |
| **R (ρ=0)** | 28.31 | **22.80** | Canvas hedefi ~23 ✓ |
| Lineer R (eski) | — | ~26.0 | Seed `hesap.R=26.62` bu aileye yakın |
| R_hedef / R_giriş | — | **67.4 / 54.7** | Belge ~67.3 / ~54.8 (yuvarlama) |
| v_tahmin (28+10, q=0.85) | — | **1.84** | Tempo tablosu uyumlu |

**Sonuç:** Seed canlı R canvas ile uyumlu (~23). Snapshot satırındaki 26.62 kasıtlı diagnostic etiketi (lineer+eski); port hatası değil.

---

## 4. Eksikler (öncelikli) — durum

1. **Skor/kanıt değişiminde `skor` log satırı** — ✓ düzeltildi (`Beceriler.tsx`; beceri beyan/kanıt/ref + kariyer beyan/kanıt).  
2. **Grafik eksikleri:** CTL / T·P·L·C / ΔR — ✓ düzeltildi (`Hiz.tsx`; veri eşiği altında grafik yok).  
3. **Radar:** 12 alan — ✓ düzeltildi (`Durum.tsx`).  
4. **BUGÜN:** sıradaki 2 ROI alternatif — ✓ düzeltildi (`Bugun.tsx`).  
5. **Artefakt ekleme tür seçimi** — ✓ düzeltildi (`Beceriler.tsx`).  
6. *(Bilinen, her iki tarafta)* `MODEL.wip` / `akrasia` sabitleri tanımlı ama mantığa bağlı değil — **ertelendi** (canvas da aynı).  
7. *(Doküman sapması, kod değil)* `Ilerleme-Durum-Modeli.md` hâlâ lineer R=26.62 / L=3.35 anlatıyor — **ertelendi** (belge, panel dışı).  
8. Monte Carlo gerçek simülasyon — **ertelendi** (her iki taraf stub; σ-ETA yeterli).

---

## 5. Sonuç

| Katman | Tahmini parite |
|---|---|
| Matematik / model 2.1 | **~96%** |
| UI / kontrol edilebilirlik | **~98%** |
| **Genel (ağırlıklı)** | **~97%** |

**Kasıtlı farklar (sadakati bozmayan):** çok sayfalı SPA, localStorage, JSONL import/indir, yeniden tasarlanmış UI. Bunlar model doğruluğunu etkilemez.

**Kritik matematik bug’ı:** yok.
