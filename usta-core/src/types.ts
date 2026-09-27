/** Usta domain ids for Next Action routing. */
export type DomainId =
  | 'oak'
  | 'faith'
  | 'ledger'
  | 'german'
  | 'books'
  | 'music'
  | 'project'
  | 'content'
  | 'rest'

export type ActionKind =
  | 'oak'
  | 'transition'
  | 'queue'
  | 'weekend'
  | 'rest'

/** Daily / weekend queue items (Master Plan five-domain + weekend). */
export type FloorItemId =
  | 'ledger_touch'
  | 'german_block'
  | 'faith_quran'
  | 'faith_cevsen'
  | 'faith_other'
  | 'books_pages'
  | 'music_play'
  | 'project_deep'
  | 'content_batch'
  | 'content_publish'

export type NextAction = {
  id: string
  title: string
  durationMin: number
  why: string
  domain: DomainId
  kind: ActionKind
}

/** User-editable cues — never ship bundled scripture. */
export type FaithTemplates = {
  quran?: string
  cevsen?: string
  other?: string
  /** @deprecated legacy keys kept for migrate */
  morning?: string
  daytime?: string
  evening?: string
}

export type LedgerUrlMode = 'local' | 'pages'

export type LedgerBridgeTask = {
  id: string
  title: string
  kind: string
  minutes: number
}

/** Snapshot of Cyber Ledger Today tasks (pulled via bridge). */
export type LedgerBridge = {
  dateKey: string
  updatedAt: string
  tasks: LedgerBridgeTask[]
}

export type UstaConfig = {
  timezone: string
  oakStartHour: number
  oakStartMinute: number
  oakEndHour: number
  oakEndMinute: number
  transitionMinutes: number
  /** Fallback day start when prayer times are unavailable. */
  dayStartHour: number
  dayStartMinute: number
  /** After this time, Usta stops the queue and sends you to rest/sleep. */
  dayEndHour: number
  dayEndMinute: number
  /** Soft cap for each Next Action block (Master Plan: ~45–50). */
  blockCapMinutes: number
  ledgerBaseUrl: string
  ledgerUrlMode: LedgerUrlMode
  latitude?: number
  longitude?: number
  prayerMethod?: string
  faithTemplates: FaithTemplates
}

export type WeekendProjectDays = 'sat' | 'sun' | 'both'

export type ContentPostStatus = 'draft' | 'ready' | 'published'

export type ContentPost = {
  id: string
  title: string
  status: ContentPostStatus
  /** Day (YYYY-MM-DD) weekday Share on Now published this post; Undo of that Done restores Ready. */
  sharedOn?: string
}

export type WeekendLifeTick = 'faith' | 'books' | 'music'

export type WeekendLifeTicks = Partial<Record<WeekendLifeTick, boolean>>

export type SundayClose = {
  dateKey: string
  wentWell: string
  nextProjectTitle: string
  savedAt: string
}

/** Weekend planning hub (replaces old 2+1 weekday spotlights). */
export type WeekPlan = {
  /** Weekend project title for the Sat/Sun 10–14 window */
  weekendProjectLabel?: string
  /** “When the weekend ends, what will be true?” */
  projectOutcome?: string
  /** Planned focus blocks in minutes, e.g. [50, 50] */
  projectBlocks: number[]
  projectDays: WeekendProjectDays
  /** Soft label for weekend content batch */
  contentBatchLabel?: string
  /** Next week’s posts (content factory) */
  contentPosts: ContentPost[]
  /**
   * @deprecated Legacy weekend checklist. migrate folds it into same-day floor Done flags
   * and leaves this empty; the Weekend page writes floor via `setLifeDone`.
   */
  lifeTicks: Record<string, WeekendLifeTicks>
  sundayClose: SundayClose | null
  hibernate: string[]
  /** @deprecated old slots ignored by NowEngine; kept for migrate */
  slots: SpotlightSlot[]
  primaryA?: string
  primaryB?: string
  optional?: string
}

export type SpotlightSlot = {
  id: string
  label: string
  dayOfWeek: number
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  primary: boolean
}

export type FloorDay = Partial<Record<FloorItemId, boolean>>

export type UstaState = {
  rev: number
  updatedAt: string
  deviceId: string
  config: UstaConfig
  week: WeekPlan
  floor: Record<string, FloorDay>
  /** Latest pull from Cyber Ledger Today (optional). */
  ledgerBridge: LedgerBridge | null
  energyLow: boolean
  energyLowDate: string | null
  snoozesToday: number
  snoozesDate: string | null
  snoozeUntil: string | null
  onRampDay: number
  actionHistory: Array<{
    at: string
    actionId: string
    title: string
  }>
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

export type PrayerTimesOfDay = Partial<Record<PrayerName, Date>>

export const STORAGE_KEY = 'usta-v1'
export const MAX_SNOOZES_PER_DAY = 2
export const ACTION_HISTORY_CAP = 50

/** Default soft cap per Master Plan. */
export const DEFAULT_BLOCK_CAP = 50

export const DEFAULT_PROJECT_BLOCKS: readonly number[] = [50, 50]
export const MAX_PROJECT_BLOCKS = 8
export const MAX_CONTENT_POSTS = 30

export const DEFAULT_CONFIG: UstaConfig = {
  timezone: 'Europe/Istanbul',
  oakStartHour: 10,
  oakStartMinute: 0,
  oakEndHour: 14,
  oakEndMinute: 0,
  transitionMinutes: 20,
  dayStartHour: 7,
  dayStartMinute: 0,
  dayEndHour: 23,
  dayEndMinute: 0,
  blockCapMinutes: DEFAULT_BLOCK_CAP,
  ledgerBaseUrl: 'http://localhost:5173/',
  ledgerUrlMode: 'local',
  latitude: 41.0082,
  longitude: 28.9784,
  prayerMethod: 'Turkey',
  faithTemplates: {},
}

export function createEmptyState(deviceId: string, nowIso = new Date().toISOString()): UstaState {
  return {
    rev: 0,
    updatedAt: nowIso,
    deviceId,
    config: { ...DEFAULT_CONFIG, faithTemplates: {} },
    week: {
      weekendProjectLabel: 'Software / cyber project',
      projectBlocks: [...DEFAULT_PROJECT_BLOCKS],
      projectDays: 'both',
      contentBatchLabel: 'Medium / LinkedIn batch for next week',
      contentPosts: [],
      lifeTicks: {},
      sundayClose: null,
      hibernate: [],
      slots: [],
    },
    floor: {},
    ledgerBridge: null,
    energyLow: false,
    energyLowDate: null,
    snoozesToday: 0,
    snoozesDate: null,
    snoozeUntil: null,
    onRampDay: 1,
    actionHistory: [],
  }
}
