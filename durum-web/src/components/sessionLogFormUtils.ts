import type { BugunGorev } from "../useRollingSchedule";
import type { LogRecord, SessionFormData } from "../model";
import { LOG_SOURCES } from "../data/dayLog";
import type { StudyPlanStep } from "../data/studyPlans";
import { mergeEvidenceUrls, mergeSources } from "../data/sessionMultiFields";

export const AKTIVITE_OPTIONS = [
  { value: "konu-tekrar", label: "Topic review" },
  { value: "yeni-konu", label: "New topic study" },
  { value: "temel-konu", label: "Foundation topic" },
  { value: "lab-pratik", label: "Lab / practice" },
  { value: "almanca", label: "German study" },
  { value: "ingilizce", label: "English study" },
  { value: "hafif-tekrar", label: "Light review / rest" },
  { value: "diger", label: "Other (type)" },
] as const;

export const KAYNAK_OPTIONS = [
  { value: "oak", label: "Oak Academy" },
  { value: "mentor", label: "Mentor session" },
  { value: "lab-vm", label: "Lab (VM)" },
  { value: "kendi-not", label: "My notes" },
  { value: "wireshark", label: "Wireshark practice" },
  { value: "splunk-wazuh", label: "Splunk / Wazuh" },
  { value: "kitap", label: "Book / document" },
  { value: "diger", label: "Other" },
] as const;

export const MOD_OPTIONS = [
  { value: "teori", label: "Theory" },
  { value: "lab", label: "Lab" },
  { value: "tekrar", label: "Review" },
  { value: "pratik", label: "Practice" },
  { value: "dil", label: "Language" },
] as const;

export const KALITE_PRESETS = [
  { value: 0.3, label: "3 — struggled" },
  { value: 0.5, label: "5 — okay" },
  { value: 0.7, label: "7 — good" },
  { value: 0.85, label: "8–9 — fluent" },
  { value: 1, label: "10 — perfect" },
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
  if (value === "chatgpt") return "Mentor session";
  const opt = KAYNAK_OPTIONS.find((o) => o.value === value);
  if (opt) return opt.label;
  const log = LOG_SOURCES.find((s) => s.id === value);
  return log?.label ?? value;
}

export function modLabel(value: string): string {
  const opt = MOD_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}

export function generateSessionNot(form: SessionFormData, studyStep?: StudyPlanStep): string {
  const sources = mergeSources(form.kaynak, form.extraSources);
  const parts = [
    sources.map(kaynakLabel).join(" + "),
    aktiviteLabel(form.aktivite, form.aktiviteCustom),
    `${form.dakika} min`,
    modLabel(form.mod),
  ];
  if (studyStep) {
    parts.push(`Step ${studyStep.order}: ${studyStep.logHint ?? studyStep.action}`);
  }
  return parts.join(" · ");
}

export function defaultFormFromGorev(g: BugunGorev, defaultKalite = 0.85): SessionFormData {
  const firstStep = g.studyGuide?.steps[0];
  const stepNote = firstStep
    ? `Step 1 — ${firstStep.action}${firstStep.logHint ? ` (${firstStep.logHint})` : ""}`
    : g.baslik;
  return {
    aktivite: AKTIVITE_BY_KIND[g.kind] ?? "diger",
    aktiviteCustom: undefined,
    kaynak: KAYNAK_BY_KIND[g.kind] ?? "oak",
    dakika: Math.max(5, Math.round(g.saat * 60)),
    mod: MOD_BY_KIND[g.kind] ?? "teori",
    alan: g.alan ?? (g.kind === "dil" ? "dil-de" : "net"),
    kanit: "",
    kalite: defaultKalite,
    not: stepNote,
    studyStep: firstStep?.order ?? 1,
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

/** Prefill SessionLogForm from an existing session log (edit path). */
export function logRecordToForm(rec: LogRecord): SessionFormData {
  const sources = mergeSources(rec.kaynak, rec.sources);
  const evidenceUrls = mergeEvidenceUrls(rec.kanit, rec.evidenceUrls);
  const primary = sources[0] ?? rec.kaynak ?? "oak";
  const extras = sources.slice(1);
  // Activity kind is not persisted on LogRecord; topic title lives in konu.
  const tagsFromSonuc =
    rec.sonuc
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const tags = rec.tags?.length ? rec.tags : tagsFromSonuc.length > 0 ? tagsFromSonuc : undefined;
  return {
    aktivite: "diger",
    aktiviteCustom: rec.konu?.trim() || undefined,
    kaynak: primary,
    extraSources: extras.length > 0 ? extras : undefined,
    dakika: Math.max(1, Math.min(600, Math.round(rec.dur_min ?? 60))),
    mod: rec.mod ?? "teori",
    alan: rec.alan ?? "net",
    kanit: evidenceUrls[0],
    evidenceUrls: evidenceUrls.length > 0 ? evidenceUrls : undefined,
    kalite: typeof rec.kalite === "number" ? Math.max(0.3, Math.min(1, rec.kalite)) : 0.85,
    not: rec.not,
    tags,
    promoteEvidence: true,
  };
}
