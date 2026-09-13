/**
 * German B2 path — durable schedule rules for SOC Ledger language channel.
 * Source: 9-month CEFR/Goethe B2 plan + SLA/memory-science summary (translated to English).
 * German tasks remain language-only (not SOC theory).
 */

export type GermanDailyBlock = {
  id: string;
  label: string;
  minutesMin: number;
  minutesMax: number;
};

export type GermanMonthPlan = {
  month: number;
  level: string;
  wordFamily: string;
  grammarFocus: string;
  workFocus: string;
  speaking: string;
  exitCriteria: string;
};

export type GermanWeekdayFocus = {
  day: string;
  focus: string;
};

/** Evidence-based language practice principles (SLA + spacing/retrieval). */
export const GERMAN_LEARNING_SCIENCE = {
  pillars: [
    "Comprehensible input (listening + reading volume) is necessary but not sufficient",
    "Output (speaking/writing) reveals gaps, pushes syntax processing, and builds fluency",
    "Interaction with feedback (tutor/partner) combines input and pushed output",
  ],
  durability: [
    "Spaced practice beats cramming (especially on delayed tests)",
    "Active retrieval (SRS/testing) beats re-reading; pair with feedback",
    "Successive relearning: recall to success in-session, then restudy across spaced sessions",
    "Sleep consolidates; unused language decays — keep maintenance reviews",
  ],
  avoid: [
    "Marathon cramming",
    "Only re-reading / passive watching",
    "Guessing without feedback",
    "Long gaps with no use",
    "Matching instruction to visual/auditory learning styles (unsupported)",
  ],
  fluencyNotes: [
    "Practical fluency target for this path: B2 (exam-ready)",
    "Comfortable spoken coverage approx 6-7k word families; written approx 8-9k for ~98% coverage",
    "Cambridge guided hours to B2 approx 500-600 from zero (intensity and L1 distance move the range)",
  ],
  speedRecipe: [
    "Daily high dose of level-matched listening/reading plus speaking/writing",
    "Vocabulary via SRS spaced recall and in-context encounters",
    "Weekly interactive speaking (tutor/partner)",
    "Extensive reading/listening to automate formulaic language",
  ],
} as const;

export const GERMAN_B2_PLAN = {
  goal: "CEFR / Goethe B2",
  durationMonths: 9,
  daysPerWeek: 6,
  dailyMinutes: { min: 100, max: 120 },
  /** Matches ~Normal tempo language hours (approx 10 h/week) through Aggressive (~13 h/week). */
  weeklyHours: { min: 10, max: 13 },
  totalHoursEstimate: { min: 550, max: 650 },
  wordFamilyTarget: { min: 5500, max: 6000 },
  speakingPerWeek: { months1to4: 2, months5to9: 3 },
  dailyBlocks: [
    { id: "input", label: "Listening / reading", minutesMin: 45, minutesMax: 45 },
    { id: "anki", label: "Anki (SRS retrieval)", minutesMin: 20, minutesMax: 20 },
    { id: "output", label: "Speaking or writing", minutesMin: 25, minutesMax: 30 },
    { id: "grammar", label: "Grammar mini (form in meaning)", minutesMin: 10, minutesMax: 15 },
  ] as GermanDailyBlock[],
  weeklyTemplate: [
    { day: "Mon", focus: "Full routine + grammar" },
    { day: "Tue", focus: "Full routine + speaking" },
    { day: "Wed", focus: "Full routine + writing + correction" },
    { day: "Thu", focus: "Full routine + speaking" },
    { day: "Fri", focus: "Full routine + weak-point drill" },
    { day: "Sat", focus: "Long input + speaking / mock" },
    { day: "Sun", focus: "Light: Anki due + enjoyable input" },
  ] as GermanWeekdayFocus[],
  months: [
    {
      month: 1,
      level: "A0 → A1-",
      wordFamily: "600–800",
      grammarFocus: "Präsens, sein/haben, basic articles, V2 word order",
      workFocus: "Pronunciation (ä ö ü ß ch), Nicos Weg A1 start, 10 spoken sentences daily",
      speaking: "From week 2: 1×20 min introductions",
      exitCriteria: "2-minute self-introduction",
    },
    {
      month: 2,
      level: "A1",
      wordFamily: "1000–1200",
      grammarFocus: "Akkusativ, Dativ intro, können/müssen/wollen, question patterns",
      workFocus: "Finish Nicos Weg A1, slow news, routine dialogues",
      speaking: "2×20–25 min / week",
      exitCriteria: "A1 practice test or Nicos Weg A1 complete",
    },
    {
      month: 3,
      level: "A2-",
      wordFamily: "1600–1800",
      grammarFocus: "Perfekt, past modals, weil/dass intro",
      workFocus: "Nicos Weg A2, Easy German (subtitled), A2 readers",
      speaking: "2×25–30 min; narrate yesterday",
      exitCriteria: "5-minute past-tense narration",
    },
    {
      month: 4,
      level: "A2",
      wordFamily: "2000–2300",
      grammarFocus: "Komparativ, Wechselpräpositionen, plan/intent patterns",
      workFocus: "Messages/emails; role-play (shopping, directions, doctor)",
      speaking: "2×30 min",
      exitCriteria: "A2 mock; 8–10 min conversation",
    },
    {
      month: 5,
      level: "B1-",
      wordFamily: "2800–3200",
      grammarFocus: "Nebensätze (weil, dass, wenn, obwohl); systematic adjective endings",
      workFocus: "Nicos Weg B1, Nachrichtenleicht, news summary",
      speaking: "2–3×30 min; state opinions",
      exitCriteria: "Oral summary of a short news piece",
    },
    {
      month: 6,
      level: "B1",
      wordFamily: "3500–3800",
      grammarFocus: "Relativsätze, Passiv intro, Infinitiv mit zu",
      workFocus: "Long graded reading → simple novel; Easy German without subtitles",
      speaking: "3×30 min; 2–3 min mini-presentation",
      exitCriteria: "15-minute discussion on a familiar topic",
    },
    {
      month: 7,
      level: "B1+",
      wordFamily: "4000–4500",
      grammarFocus: "Connector variety; complaint/argument patterns; work/school vocab",
      workFocus: "B1 writing tasks; listening mocks",
      speaking: "3×30 min",
      exitCriteria: "Clear pass on a B1 practice test",
    },
    {
      month: 8,
      level: "B2-",
      wordFamily: "5000–5500",
      grammarFocus: "Konjunktiv II, Passiv reinforcement, je…desto, indirekte Rede intro",
      workFocus: "Tagesschau in 100 Sek., DW podcast, hobby-specific content",
      speaking: "3×30–40 min; hypothesis and debate",
      exitCriteria: "25-minute fluent conversation",
    },
    {
      month: 9,
      level: "B2",
      wordFamily: "5500–6000+",
      grammarFocus: "Close weak skills + exam format (Lesen/Hören/Schreiben/Sprechen)",
      workFocus: "Goethe/ÖSD/telc B2 Prüfungstraining; 2–3 full mocks",
      speaking: "Exam speaking tasks",
      exitCriteria: "Official B2 practice / mock exam",
    },
  ] as GermanMonthPlan[],
  monthlyChecks: [
    "Keep Anki dues current — no backlog spiral",
    "Archive one 2–5 min voice recording each month; compare progress",
    "Level practice tests in months 2 / 4 / 7 / 9",
    "If tempo drops: add one speaking session; slightly ease input difficulty — do not abandon the method",
  ],
  criticalRules: [
    "Start speaking in month 1",
    "Do not jump early to incomprehensible native content",
    "Correct article + verb position on every production",
    "Make up empty weeks the following week — B2 in 9 months is a dose problem",
  ],
} as const;

export function germanDailyMinutesTotal(prefer: "min" | "max" = "min"): number {
  return GERMAN_B2_PLAN.dailyBlocks.reduce(
    (sum, b) => sum + (prefer === "min" ? b.minutesMin : b.minutesMax),
    0,
  );
}

export function germanMonthByNumber(month: number): GermanMonthPlan | undefined {
  return GERMAN_B2_PLAN.months.find((m) => m.month === month);
}
