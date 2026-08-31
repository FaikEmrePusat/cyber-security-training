# Durum — İlerleme Durum Web

Model **2.1** ilerleme paneli: state, kapılar, Chancenkarte, FSRS tekrar, log.

Canvas (`ilerleme-durum-dashboard.canvas.tsx`) formüllerinin tarayıcı sürümü. Durum `localStorage` anahtarı `durum-v22` altında tutulur.

Teknik referans: [TEKNIK-DOKUMANTASYON.md](./TEKNIK-DOKUMANTASYON.md)

## Çalıştırma

```bash
cd "D:\Projects\Cyber Security Training\durum-web"
npm install
npm run dev
```

Tarayıcıda Vite’ın yazdığı adresi aç (genelde http://localhost:5173).

Üretim derlemesi:

```bash
npm run build
npm run preview
```

## Ne var?

| Sayfa | İçerik |
|-------|--------|
| **Bugün** | TEK GÖREV + GM / R / TSB |
| **Durum** | T/P/L/C, R gauge, kanıt açığı, radar |
| **Beceriler** | Düzenlenebilir skor + kanıt mandalı, artefakt, dil, kariyer |
| **Kapılar** | Gate 0, A–F · π · darboğaz |
| **Almanya** | Chancenkarte puan, Anerkennung, Rota A/B ETA, runway |
| **Hız** | CTL/ATL/TSB, v, κ, projeksiyon, ROI |
| **Harita** | Oak müfredat ağaç / grafik / liste · FSRS’e seçerek ekle · Yaklaşan (EDR sonrası) kilitli |
| **Tekrar** | FSRS kuyruk + sonuç (yalnızca kuyruk — tam müfredat Harita’da) |
| **Log** | Oturum, snapshot, JSONL export/import |
| **Formüller** | Açılır matematik referansı |

## Geri al / Yinele

Üst menüde **Geri al** ve **Yinele** butonları vardır.

| Kısayol | İşlem |
|---------|--------|
| `Ctrl+Z` (Mac: `Cmd+Z`) | Son değişikliği geri al |
| `Ctrl+Y` veya `Ctrl+Shift+Z` | Yinele |

Beceri, kanıt, log, Almanya alanları, tekrar, Harita→kuyruk ekleme, sıfırlama — hepsi geri alınabilir. Yazarken (birikim, oturum notu vb.) ~0.8 sn içindeki tuşlar tek adım sayılır; yanlışlıkla bir harf silince tüm cümleyi kaybetmezsin.

## Müfredat (Harita)

Oak notlarından çıkarılan konular (`src/data/tekrar-ekle.txt`, kaynak: `Oak-Study-Notes/TEKRAR-EKLE.txt`) **otomatik FSRS kuyruğuna girmez**. `/harita` sayfasında ağaç, alan haritası ve liste ile gezilir; durum `localStorage` anahtarı `durum-curriculum-v1`. EDR sonrası konular `TEKRAR-SONRA.txt` → Yaklaşan / Sonra (kilitli).

## Seed

Açılış: **2026-08-27** diagnostic. Geometrik R (ρ=0, portfolio T’den çıkık) ile R ≈ **23** civarı (eski lineer seed log’unda 26.62 yazıyordu — `Durum-Dashboard.md` ile uyumlu).

Markdown belgeler ve canvas silinmedi; bu uygulama onları tamamlar.
