import { MODEL } from "./constants";
import type {
  Artifact,
  CareerItem,
  ChancenkarteState,
  Difficulty,
  LangState,
  LogRecord,
  RetrievalItem,
  SessionDraft,
  Skill,
  Tempo,
  AppState,
} from "./types";

export const SEED_ISO = "2026-08-27T12:00:00+03:00";

export const SEED_SKILLS: Skill[] = [
  { id: "net", name: "Networking", kisa: "Net", weight: 1.2, neden: "Every SOC analysis depends on reading packets/protocols", claimed: 6, evidence: "yok", ref: "" },
  { id: "linux", name: "Linux", kisa: "Linux", weight: 1.3, neden: "SOC tool chain and log analysis run on Linux", claimed: 4, evidence: "yok", ref: "" },
  { id: "win", name: "Windows/AD", kisa: "Win/AD", weight: 1.4, neden: "Most enterprise environments use AD; incidents originate there", claimed: 3, evidence: "yok", ref: "" },
  { id: "secfund", name: "Security Fundamentals", kisa: "SecFund", weight: 1.0, neden: "Baseline — threat model, CIA, attack surface", claimed: 7, evidence: "yok", ref: "" },
  { id: "crypto", name: "Crypto", kisa: "Crypto", weight: 0.6, neden: "Necessary but early depth is not junior priority", claimed: 7, evidence: "yok", ref: "" },
  { id: "netsec", name: "Network Security", kisa: "NetSec", weight: 0.9, neden: "FW / IDS / proxy — daily SOC concepts", claimed: 7, evidence: "yok", ref: "" },
  { id: "siem", name: "SIEM kavram", kisa: "SIEM", weight: 1.1, neden: "Gate B prerequisite; core tool of target role", claimed: 3, evidence: "yok", ref: "" },
  { id: "def", name: "Defensive/SOC", kisa: "Def/SOC", weight: 1.5, neden: "The target role itself", claimed: 3, evidence: "yok", ref: "" },
  { id: "off", name: "Offensive", kisa: "Off", weight: 0.7, neden: "Feeds defense; secondary at junior level", claimed: 2, evidence: "yok", ref: "" },
  { id: "py", name: "Python", kisa: "Python", weight: 0.8, neden: "Automation / log parsing", claimed: 5, evidence: "yok", ref: "" },
  { id: "cloud", name: "Cloud", kisa: "Cloud", weight: 0.4, neden: "Secondary in junior SOC job posts", claimed: 2, evidence: "yok", ref: "" },
  { id: "port", name: "Portfolio", kisa: "Portfolio", weight: 1.4, neden: "Employability — common job posting requirement", claimed: 2, evidence: "yok", ref: "" },
];

export const SEED_ARTIFACTS: Artifact[] = [
  { id: "a1", ad: "Lab write-up (no public link yet)", tur: "writeup", sahiplik: 1, evidence: "yok", ref: "" },
  { id: "a2", ad: "Completed lab scenario (no public link yet)", tur: "lab-egzersizi", sahiplik: 1, evidence: "yok", ref: "" },
];

export const SEED_LANG: LangState = {
  deKonusma: 1.0,
  deGenel: 1.5,
  enKonusma: 4.0,
  enGenel: 5.0,
  deEv: "yok",
  enEv: "yok",
  deRef: "",
  enRef: "",
};

export const SEED_CHANCE: ChancenkarteState = {
  yas: 30,
  birikim: "",
  aylikTasarruf: "",
  gate0: "bilinmiyor",
  anerkennungDurum: "anabin_kontrol",
  engpassberuf: false,
  meslekiEgitimYil: 2,
  lebensunterhalt: false,
};

export const SEED_CAREER: CareerItem[] = [
  { id: "cv", label: "CV ready", max: 2, claimed: 1, evidence: "yok", ref: "", saatPuan: 5 },
  { id: "ag", label: "Network (LinkedIn + references)", max: 2, claimed: 0, evidence: "yok", ref: "", saatPuan: 4 },
  { id: "staj", label: "Internship documented", max: 2, claimed: 1, evidence: "yok", ref: "", saatPuan: 4 },
  { id: "funnel", label: "Application funnel active", max: 2, claimed: 0, evidence: "yok", ref: "", saatPuan: 6 },
  { id: "mulakat", label: "Interview practice", max: 2, claimed: 0, evidence: "yok", ref: "", saatPuan: 8 },
];

export const SEED_TEMPO: Tempo = { hoursCyber: 28, hoursLang: 7, hoursLangAlt: 14, quality: 0.85 };

const mkRetrieval = (
  id: string,
  topic: string,
  alan: string,
  difficulty: Difficulty,
): RetrievalItem => ({
  id,
  topic,
  alan,
  difficulty,
  n: 0,
  stability: MODEL.tekrar.s0,
  ef: MODEL.tekrar.ef0,
  lastIso: SEED_ISO,
});

export const SEED_RETRIEVAL: RetrievalItem[] = [
  mkRetrieval("r1", "DNS query/response (Wireshark)", "net", "orta"),
  mkRetrieval("r2", "TCP 3-way handshake", "net", "kolay"),
  mkRetrieval("r3", "Linux process / permissions", "linux", "orta"),
  mkRetrieval("r4", "CIA triad + threat model", "secfund", "kolay"),
  mkRetrieval("r5", "Symmetric vs asymmetric crypto", "crypto", "orta"),
  mkRetrieval("r6", "Windows event log basics", "win", "zor"),
  mkRetrieval("r7", "Python socket / log parse", "py", "orta"),
  mkRetrieval("r8", "SOC triage thought chain", "def", "zor"),
];

export const SEED_HISTORY: LogRecord[] = [
  {
    t: SEED_ISO,
    type: "meta",
    seed: true,
    not: "Schema 1.0 · model 2.0. This row is seed data; contains no measured progress.",
  },
  {
    t: SEED_ISO,
    type: "snapshot",
    kaynak: "diagnostic-seed",
    seed: true,
    hesap: { T: 3.63, P: 0.95, L: 3.35, C: 2.0, R: 26.62, R_beyan: 31.68, kanit_acigi: 5.06 },
    v_tahmin: 1.84,
    v_olculen: null,
    kappa: null,
    not: "SEED — single measurement point. v_measured requires at least 2 snapshots.",
  },
];

export const DRAFT: SessionDraft = {
  alan: "net",
  dakika: "60",
  mod: "lab",
  kalite: "0.9",
  kanit: "",
  not: "",
  aktivite: "lab-pratik",
  aktiviteCustom: "",
  kaynak: "oak",
};

export function createSeedState(): AppState {
  return {
    skills: structuredClone(SEED_SKILLS),
    artifacts: structuredClone(SEED_ARTIFACTS),
    lang: structuredClone(SEED_LANG),
    career: structuredClone(SEED_CAREER),
    tempo: structuredClone(SEED_TEMPO),
    retrieval: structuredClone(SEED_RETRIEVAL),
    history: structuredClone(SEED_HISTORY),
    pending: [],
    chancenkarte: structuredClone(SEED_CHANCE),
    draft: structuredClone(DRAFT),
    scheduleCarry: [],
    scheduleCompletedToday: {},
  };
}
