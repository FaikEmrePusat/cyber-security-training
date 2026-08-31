import type { BugunGorev } from "../useRollingSchedule";
import type { SessionFormData } from "../model";

export const AKTIVITE_OPTIONS = [
  { value: "konu-tekrar", label: "Konu tekrarı" },
  { value: "yeni-konu", label: "Yeni konu çalışması" },
  { value: "temel-konu", label: "Temel konu" },
  { value: "lab-pratik", label: "Lab / pratik" },
  { value: "almanca", label: "Almanca çalışması" },
  { value: "ingilizce", label: "İngilizce çalışması" },
  { value: "hafif-tekrar", label: "Hafif tekrar / dinlenme" },
  { value: "diger", label: "Diğer (yaz)" },
] as const;

export const KAYNAK_OPTIONS = [
  { value: "oak", label: "Oak Academy" },
  { value: "lab-vm", label: "Lab (VM)" },
  { value: "kendi-not", label: "Kendi notlarım" },
  { value: "wireshark", label: "Wireshark pratik" },
  { value: "splunk-wazuh", label: "Splunk / Wazuh" },
  { value: "kitap", label: "Kitap / doküman" },
  { value: "diger", label: "Diğer" },
] as const;

export const MOD_OPTIONS = [
  { value: "teori", label: "Teori" },
  { value: "lab", label: "Lab" },
  { value: "tekrar", label: "Tekrar" },
  { value: "pratik", label: "Pratik" },
  { value: "dil", label: "Dil" },
] as const;

export const KALITE_PRESETS = [
  { value: 0.3, label: "3 — zorlandım" },
  { value: 0.5, label: "5 — orta" },
  { value: 0.7, label: "7 — iyi" },
  { value: 0.85, label: "8–9 — akıcı" },
  { value: 1, label: "10 — mükemmel" },
] as const;

const AKTIVITE_BY_KIND: Record<string, string> = {
  tekrar: "konu-tekrar",
  konu: "yeni-konu",
  temel: "temel-konu",
  lab: "lab-pratik",
  dil: "almanca",
  dinlenme: "hafif-tekrar",
};

const MOD_BY_KIND: Record<string, string> = {
  tekrar: "tekrar",
  konu: "teori",
  temel: "teori",
  lab: "lab",
  dil: "dil",
  dinlenme: "tekrar",
};

const KAYNAK_BY_KIND: Record<string, string> = {
  tekrar: "kendi-not",
  konu: "oak",
  temel: "oak",
  lab: "lab-vm",
  dil: "kitap",
  dinlenme: "kendi-not",
};

export function aktiviteLabel(value: string, custom?: string): string {
  if (value === "diger" && custom?.trim()) return custom.trim();
  const opt = AKTIVITE_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}

export function kaynakLabel(value: string): string {
  const opt = KAYNAK_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}

export function modLabel(value: string): string {
  const opt = MOD_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}

export function generateSessionNot(form: SessionFormData): string {
  const parts = [
    kaynakLabel(form.kaynak),
    aktiviteLabel(form.aktivite, form.aktiviteCustom),
    `${form.dakika} dk`,
    modLabel(form.mod),
  ];
  return parts.join(" · ");
}

export function defaultFormFromGorev(g: BugunGorev, defaultKalite = 0.85): SessionFormData {
  return {
    aktivite: AKTIVITE_BY_KIND[g.kind] ?? "diger",
    aktiviteCustom: undefined,
    kaynak: KAYNAK_BY_KIND[g.kind] ?? "oak",
    dakika: Math.max(5, Math.round(g.saat * 60)),
    mod: MOD_BY_KIND[g.kind] ?? "teori",
    alan: g.alan ?? (g.kind === "dil" ? "dil-de" : "net"),
    kanit: "",
    kalite: defaultKalite,
    not: g.baslik,
  };
}

export function defaultManualForm(defaultKalite = 0.85): SessionFormData {
  return {
    aktivite: "lab-pratik",
    kaynak: "oak",
    dakika: 60,
    mod: "lab",
    alan: "net",
    kanit: "",
    kalite: defaultKalite,
    not: "",
  };
}
