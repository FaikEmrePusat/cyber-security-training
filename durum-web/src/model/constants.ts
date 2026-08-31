import type { ArtifactType, EvidenceTier } from "./types";

export const MODEL = {
  surum: "2.1",
  rho: 0,
  R: { T: 0.4, P: 0.25, L: 0.2, C: 0.15 },
  kanitOrani: { yok: 0.5, kayit: 0.8, public: 1.0 } as Record<EvidenceTier, number>,
  kanitAd: {
    yok: "Kanıt yok",
    kayit: "Lab kaydı / ekran / dosya",
    public: "Public URL",
  } as Record<EvidenceTier, string>,
  pKappa: 5,
  artefaktDeger: {
    "soc-lab": 3.0,
    "ad-lab": 2.5,
    "vm-lab": 2.0,
    arac: 1.5,
    writeup: 0.5,
    "lab-egzersizi": 0.5,
  } as Record<ArtifactType, number>,
  artefaktSaat: {
    "soc-lab": 60,
    "ad-lab": 40,
    "vm-lab": 25,
    arac: 15,
    writeup: 6,
    "lab-egzersizi": 8,
  } as Record<ArtifactType, number>,
  artefaktAd: {
    "soc-lab": "SOC lab (Sysmon / Wazuh / Splunk)",
    "ad-lab": "AD lab (Windows Event / Kerberos)",
    "vm-lab": "VM lab",
    arac: "Araç / script",
    writeup: "Write-up",
    "lab-egzersizi": "Lab egzersizi (rehberli oda)",
  } as Record<ArtifactType, string>,
  projeTurleri: ["soc-lab", "ad-lab", "vm-lab", "arac"] as ArtifactType[],
  tHaric: ["port"] as string[],
  curume: { tau0: 10, b: 2, taban: 0.5 },
  ctl: { ctlGun: 42, atlGun: 7, loadOlcek: 10 },
  hiz: { aSiber: 0.8, aDil: 0.2, H: 9.25, h0: 3.7, min: -0.5, max: 4.5, bant: 0.2, ctlCarpan: 0.7 },
  tekrar: {
    w20: 0.2,
    factor: 0.6935,
    rHedef: 0.85,
    s0: 3,
    sMax: 90,
    ef0: 2.5,
    efMin: 1.3,
    efMax: 2.8,
    kuyrukTavani: 3,
  },
  carry: {
    maxCarry: 2,
    maxAgeDays: 7,
  },
  L: { DE: 0.55, EN: 0.45, konusma: 0.6, genel: 0.4 },
  glh: { A1: 95, A2: 190, B1: 320, B2: 550, C1: 750 },
  efor: { A: 2.22 },
  kapi: {
    A: { net: 6, linux: 6, win: 5 },
    B: { secfund: 6, siem: 5 },
    C: { publicProje: 2, minSahiplik: 1.0, minDeger: 2.5 },
    D: { R: "R_giris", de: 5, en: 7, gate0: true },
    E: { mulakat14gun: 2 },
    F: { runwayAy: 12 },
  },
  hedef: {
    vektor: { T: 5.8, P: 6.6, L: 7.5, C: 9.0 },
    vektorGiris: { T: 5.0, P: 5.0, L: 6.1, C: 7.0 },
    dil: { de: 7.5, en: 7.5 },
    S: {
      def: 7, win: 6, port: 7, linux: 6, net: 6, siem: 7,
      secfund: 6, netsec: 5, py: 4, off: 3, crypto: 4, cloud: 3,
    },
  },
  sfia: { 2: 1, 4: 2, 6: 3, 8: 4, 9: 5 } as Record<number, number>,
  chancenkarte: {
    puanEsik: 6,
    yasEsik: { tam: 35, kismi: 40 },
    yasPuan: { tam: 2, kismi: 1 },
    gecimAy2026: 1091,
    yasaDogrulama: "2026-02 — bamf.de / gesetze-im-internet.de ile teyit et",
  },
  roi: { lambda: 1.5, saatPuanTeknik: 20, saatKanit: { kayit: 2, public: 4 } },
  wip: { teknik: 2, dil: 1 },
  geriDonus: { boslukGun: 14, tsbEsik: 15, snapshotGizle: 2 },
  akrasia: { gevsetmeGun: 7 },
} as const;

export const TEMPO_TABLOSU: Array<{ ad: string; siber: number; dil: number; kalite: number; alt: number; ust: number }> = [
  { ad: "Minimum", siber: 20.6, dil: 7.4, kalite: 0.85, alt: 1.0, ust: 1.5 },
  { ad: "Normal", siber: 28, dil: 10, kalite: 0.85, alt: 1.8, ust: 2.5 },
  { ad: "Agresif", siber: 36.1, dil: 12.9, kalite: 1.0, alt: 2.5, ust: 3.5 },
];

export const CEFR: Array<{ ad: string; skor: number }> = [
  { ad: "A1", skor: 1.5 },
  { ad: "A2", skor: 3 },
  { ad: "B1", skor: 5 },
  { ad: "B2", skor: 7.5 },
  { ad: "C1", skor: 9.5 },
];

export const KAPI_IF_THEN: Record<string, string> = {
  A: "Eğer Linux S≥6 olursa, o hafta THM SOC L1 log analizi modülüne başlayacağım.",
  B: "Eğer Gate A açılırsa, o hafta Mini SOC lab (Sysmon) kurulumuna başlayacağım.",
  C: "Eğer ilk public SOC lab hazırsa, o hafta CV'ye proje satırı ekleyeceğim.",
  D: "Eğer Gate C + R≥55 olursa, haftada ≥2 Almanya başvurusu göndereceğim.",
  E: "Eğer Gate D açılırsa, haftada ≥2 mülakat pratiği yapacağım.",
  "0": "Denklik sonucu netleşince uygun vize rotasını seçeceğim.",
  F: "Runway ≥12 ay olunca Chancenkarte başvurusunu tamamlayacağım.",
};

export const STORAGE_KEY = "durum-v22";
