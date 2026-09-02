export type EvidenceTier = "yok" | "kayit" | "public";
export type Difficulty = "kolay" | "orta" | "zor";
export type ArtifactType =
  | "soc-lab"
  | "ad-lab"
  | "vm-lab"
  | "arac"
  | "writeup"
  | "lab-egzersizi";

export type Skill = {
  id: string;
  name: string;
  kisa: string;
  weight: number;
  neden: string;
  claimed: number;
  evidence: EvidenceTier;
  ref: string;
};

export type Artifact = {
  id: string;
  ad: string;
  tur: ArtifactType;
  sahiplik: number;
  evidence: EvidenceTier;
  ref: string;
};

export type LangState = {
  deKonusma: number;
  deGenel: number;
  enKonusma: number;
  enGenel: number;
  deEv: EvidenceTier;
  enEv: EvidenceTier;
  deRef: string;
  enRef: string;
};

export type Gate0State = "bilinmiyor" | "tam_denklik" | "kismi_denklik" | "denk_degil";

export type ChancenkarteState = {
  yas: number;
  birikim: string;
  aylikTasarruf: string;
  gate0: Gate0State;
  anerkennungDurum:
    | "anabin_kontrol"
    | "ihk_fosa_basvuru"
    | "kismi"
    | "tam"
    | "red"
    | "arastiriliyor"
    | "basvuruldu";
  engpassberuf: boolean;
  meslekiEgitimYil: number;
  lebensunterhalt: boolean;
};

export type CareerItem = {
  id: string;
  label: string;
  max: number;
  claimed: number;
  evidence: EvidenceTier;
  ref: string;
  saatPuan: number;
};

export type Tempo = {
  hoursCyber: number;
  hoursLang: number;
  hoursLangAlt: number;
  quality: number;
};

export type RetrievalItem = {
  id: string;
  topic: string;
  alan: string;
  difficulty: Difficulty;
  n: number;
  stability: number;
  ef: number;
  lastIso: string;
};

export type LogType =
  | "meta"
  | "session"
  | "retrieval"
  | "snapshot"
  | "skor"
  | "assessment"
  | "artifact"
  | "basvuru"
  | "funnel"
  | "gate";

export type LogRecord = {
  t: string;
  type: LogType;
  seed?: boolean;
  alan?: string;
  mod?: string;
  dur_min?: number;
  kalite?: number;
  enerji?: number;
  kanit?: string;
  konu?: string;
  sonuc?: string;
  tags?: string[];
  s_once?: number;
  s_sonra?: number;
  n_once?: number;
  n_sonra?: number;
  gecikme_gun?: number;
  yon?: string;
  kanit_seviyesi?: EvidenceTier;
  kaynak?: string;
  tur?: string;
  ad?: string;
  deger?: number;
  sahiplik?: number;
  seviye?: EvidenceTier;
  asama?: string;
  kapi?: string;
  durum?: string;
  pi?: number;
  hesap?: {
    T: number;
    P: number;
    L: number;
    C: number;
    R: number;
    R_beyan?: number;
    kanit_acigi?: number;
  };
  v_tahmin?: number | null;
  v_olculen?: number | null;
  kappa?: number | null;
  not?: string;
};

export type SessionDraft = {
  alan: string;
  dakika: string;
  mod: string;
  kalite: string;
  kanit: string;
  not: string;
  aktivite: string;
  aktiviteCustom: string;
  kaynak: string;
};

/** Structured session log form (Today Done + Log page). */
export type SessionFormData = {
  aktivite: string;
  aktiviteCustom?: string;
  kaynak: string;
  dakika: number;
  mod: string;
  alan: string;
  kanit?: string;
  kalite: number;
  not?: string;
  /** Study plan step (1-based) when logging from Today's task. */
  studyStep?: number;
  tags?: string[];
};

/** Incomplete task from today — carries to the next day. */
export type ScheduleCarryItem = {
  id: string;
  kind: "tekrar" | "konu" | "temel" | "lab" | "dil";
  baslik: string;
  saat: number;
  topicId?: string;
  retrievalId?: string;
  roiId?: string;
  sinceIso: string;
};

/** Task reference from Today page when completed / deferred. */
export type ScheduleTaskRef = {
  id: string;
  kind: "tekrar" | "konu" | "temel" | "lab" | "dil" | "dinlenme";
  topicId?: string;
  retrievalId?: string;
  roiId?: string;
  baslik?: string;
  alan?: string;
};

export type AppState = {
  skills: Skill[];
  artifacts: Artifact[];
  lang: LangState;
  career: CareerItem[];
  tempo: Tempo;
  retrieval: RetrievalItem[];
  history: LogRecord[];
  pending: string[];
  chancenkarte: ChancenkarteState;
  draft: SessionDraft;
  scheduleCarry: ScheduleCarryItem[];
  /** ISO date → task ids completed or deferred today. */
  scheduleCompletedToday: Record<string, string[]>;
};
