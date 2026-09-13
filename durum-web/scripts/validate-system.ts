/**
 * Full system regression — run: npm run test:system
 */
import {
  SEED_ARTIFACTS,
  SEED_CAREER,
  SEED_LANG,
  SEED_RETRIEVAL,
  SEED_SKILLS,
  MODEL,
  STORAGE_KEY,
  computeAll,
  createSeedState,
  evidenceCap,
  evaluateGates,
  isRetrievalDue,
  nextStability,
  normalizeLoadedState,
  rGiris,
  rHedef,
} from "../src/model";
import { OAK_COVERED, OAK_COURSE_FOCUS, OAK_UPCOMING, topicKey } from "../src/data/oakCurriculum";
import { GERMAN_B2_PLAN, germanDailyMinutesTotal } from "../src/data/germanPlan";
import {
  applySessionEvidence,
  artifactAlreadyHasUrl,
  inferArtifactType,
  isPublicHttpUrl,
} from "../src/data/evidencePromote";
import {
  buildDayLogTemplate,
  dayLogChatPrompt,
  entryToForm,
  matchLogEntry,
  parseDayLogJson,
  suggestedTags,
} from "../src/data/dayLog";
import { buildMentorDayBriefing, buildMentorTaskBriefing } from "../src/data/mentorBriefing";
import { buildLabWriteupMarkdown, slugifyTopic } from "../src/data/labWriteupTemplate";
import { buildStudyGuide } from "../src/data/studyPlans";
import { getDayType } from "../src/useRollingSchedule";
import type { BugunGorev } from "../src/useRollingSchedule";
import { APP_NAME, LEARNER_NAME } from "../src/model/brand";
import { kaynakLabel } from "../src/components/sessionLogFormUtils";

let failures = 0;
let passed = 0;

function ok(name: string) {
  passed += 1;
  console.log(`  PASS  ${name}`);
}

function fail(name: string, detail: string) {
  failures += 1;
  console.error(`  FAIL  ${name}: ${detail}`);
}

function assert(name: string, cond: boolean, detail = "") {
  if (cond) ok(name);
  else fail(name, detail || "assertion false");
}

console.log("\n=== 1. Brand / UI product names ===");
assert("APP_NAME is SOC Ledger", APP_NAME === "SOC Ledger");
assert("Learner name set", LEARNER_NAME.length > 0);
assert("STORAGE_KEY is durum-v22", STORAGE_KEY === "durum-v22");
assert("No ChatGPT in mentor briefing text", !/chatgpt|gemini|claude/i.test(buildMentorDayBriefing([])));
assert("kaynakLabel maps legacy chatgpt", kaynakLabel("chatgpt") === "Mentor session");
assert("kaynakLabel mentor", kaynakLabel("mentor") === "Mentor session");

console.log("\n=== 2. Seed + readiness model ===");
{
  const practice: Record<string, { days: number; n: number }> = {};
  for (const s of SEED_SKILLS) practice[s.id] = { days: 0, n: 0 };
  const live = computeAll(SEED_SKILLS, SEED_ARTIFACTS, SEED_LANG, SEED_CAREER, practice, {
    kanitTavani: true,
    curume: true,
  });
  const beyan = computeAll(SEED_SKILLS, SEED_ARTIFACTS, SEED_LANG, SEED_CAREER, practice, {
    kanitTavani: false,
    curume: false,
  });
  assert("Seed R is finite", Number.isFinite(live.R) && live.R > 0, `R=${live.R}`);
  assert("Claimed R ≥ evidence-capped R", beyan.R + 1e-9 >= live.R, `beyan=${beyan.R} live=${live.R}`);
  assert("R_hedef > R_giris", rHedef() > rGiris());
  assert("Evidence caps", evidenceCap("yok", 10) === 5 && evidenceCap("public", 10) === 10);
  assert("Seed skills non-empty", SEED_SKILLS.length >= 10);
  assert("Seed retrieval non-empty", SEED_RETRIEVAL.length >= 1);
  const seed = createSeedState();
  assert("Seed state has empty carry", seed.scheduleCarry.length === 0);
  assert("Seed scheduleCompletedToday object", typeof seed.scheduleCompletedToday === "object");
}

console.log("\n=== 3. Curriculum ===");
assert("Oak covered = 144", OAK_COVERED.length === 144, `got ${OAK_COVERED.length}`);
assert("Oak upcoming = 8", OAK_UPCOMING.length === 8, `got ${OAK_UPCOMING.length}`);
assert("topicKey trims", topicKey("  DNS  ") === "dns");
{
  const ids = new Set(OAK_COVERED.map((t) => t.id));
  assert("Covered topic IDs unique", ids.size === OAK_COVERED.length);
  assert(
    "Nessus is covered (not upcoming)",
    OAK_COVERED.some((t) => /nessus/i.test(t.konu)) && !OAK_UPCOMING.some((t) => /nessus/i.test(t.konu)),
  );
  assert(
    "Nmap is covered (not upcoming)",
    OAK_COVERED.some((t) => /network scanning \(nmap\)/i.test(t.konu)) &&
      !OAK_UPCOMING.some((t) => /network scanning \(nmap\)/i.test(t.konu)),
  );
  assert(
    "Intro To Security module topic covered",
    OAK_COVERED.some((t) => t.konu === "Intro To Security"),
  );
  assert("Course focus is Nessus", OAK_COURSE_FOCUS.includes("Nessus"));
  assert(
    "Course focus topic exists in covered",
    OAK_COVERED.some((t) => t.konu === OAK_COURSE_FOCUS),
  );
}

console.log("\n=== 3b. German B2 plan ===");
assert("German plan is 9 months", GERMAN_B2_PLAN.durationMonths === 9);
assert("German plan has 9 month rows", GERMAN_B2_PLAN.months.length === 9);
assert("German daily blocks = 4", GERMAN_B2_PLAN.dailyBlocks.length === 4);
assert("German daily minutes ≥ 100", germanDailyMinutesTotal("min") >= 100);
assert(
  "German hour band overlaps MODEL.glh.B2",
  GERMAN_B2_PLAN.totalHoursEstimate.min <= MODEL.glh.B2 &&
    MODEL.glh.B2 <= GERMAN_B2_PLAN.totalHoursEstimate.max,
);
assert("Seed language hours ≥ Normal band", createSeedState().tempo.hoursLang >= GERMAN_B2_PLAN.weeklyHours.min);

console.log("\n=== 4. Day rhythm ===");
assert("Day 0 = Topic (A)", getDayType(0).dayType === "A");
assert("Day 1 = Topic (A)", getDayType(1).dayType === "A");
assert("Day 2 = Lab (B)", getDayType(2).dayType === "B");
assert("Day 5 = Lab (B)", getDayType(5).dayType === "B");

console.log("\n=== 5. Evidence promote (Gate C path) ===");
{
  assert("isPublicHttpUrl https", isPublicHttpUrl("https://github.com/x/y"));
  assert("isPublicHttpUrl rejects path", !isPublicHttpUrl("/tmp/shot.png"));
  assert("infer lab → soc-lab", inferArtifactType({ kind: "lab", alan: "def" }) === "soc-lab");
  assert("infer win lab → ad-lab", inferArtifactType({ kind: "lab", alan: "win" }) === "ad-lab");
  assert(
    "infer writeup tag",
    inferArtifactType({ kind: "konu", tags: ["writeup"], title: "DNS notes" }) === "writeup",
  );

  const seed = createSeedState();
  const before = evaluateGates(
    computeAll(seed.skills, seed.artifacts, seed.lang, seed.career, {}, { kanitTavani: true, curume: false }).sEff,
    0,
    seed.artifacts,
    0,
    0,
    0,
    false,
    false,
  );
  const gateC0 = before.find((g) => g.id === "C");
  assert("Gate C starts closed or incomplete", gateC0 != null && !gateC0.open);

  const url1 = "https://github.com/FaikEmrePusat/mini-soc-lab";
  const url2 = "https://github.com/FaikEmrePusat/ad-detection-lab";
  let s = applySessionEvidence(seed, {
    title: "Mini SOC Sysmon lab",
    url: url1,
    kind: "lab",
    alan: "siem",
    tags: ["lab", "detection"],
    promote: true,
  }).state;
  assert("First promote adds artifact", s.artifacts.some((a) => a.ref === url1 && a.evidence === "public"));
  assert("First promote valuable lab type", s.artifacts.some((a) => a.ref === url1 && (a.tur === "soc-lab" || a.tur === "ad-lab")));
  assert("Skill siem evidence bumped", s.skills.find((x) => x.id === "siem")?.evidence === "public");
  assert("artifactAlreadyHasUrl true", artifactAlreadyHasUrl(s.artifacts, url1));

  s = applySessionEvidence(s, {
    title: "AD Kerberos lab",
    url: url2,
    kind: "lab",
    alan: "win",
    promote: true,
  }).state;

  const practice: Record<string, { days: number; n: number }> = {};
  for (const sk of s.skills) practice[sk.id] = { days: 0, n: 0 };
  const live = computeAll(s.skills, s.artifacts, s.lang, s.career, practice, {
    kanitTavani: true,
    curume: false,
  });
  const gates = evaluateGates(live.sEff, live.R, s.artifacts, live.deEff, live.enEff, 0, false, false);
  const gateC = gates.find((g) => g.id === "C");
  assert("Gate C opens after 2 public labs with URL", gateC?.open === true, `pi=${gateC?.pi} open=${gateC?.open}`);

  const noPromote = applySessionEvidence(createSeedState(), {
    title: "Private notes",
    url: url1,
    kind: "lab",
    promote: false,
  });
  assert("promote:false does not add artifact", !noPromote.promoted && noPromote.state.artifacts.length === createSeedState().artifacts.length);

  const privatePath = applySessionEvidence(createSeedState(), {
    title: "Screenshot",
    url: "C:\\Users\\x\\shot.png",
    kind: "lab",
    promote: true,
  });
  assert("non-http URL not promoted", !privatePath.promoted);

  const dup = applySessionEvidence(s, {
    title: "Mini SOC Sysmon lab (retry)",
    url: url1,
    kind: "lab",
    promote: true,
  });
  assert(
    "duplicate URL does not duplicate artifact",
    dup.state.artifacts.filter((a) => a.ref === url1).length === 1,
  );

  const noRef = {
    ...createSeedState(),
    artifacts: [
      {
        id: "ghost",
        ad: "Ghost public",
        tur: "soc-lab" as const,
        sahiplik: 1,
        evidence: "public" as const,
        ref: "",
      },
    ],
  };
  const liveGhost = computeAll(noRef.skills, noRef.artifacts, noRef.lang, noRef.career, practice, {
    kanitTavani: true,
    curume: false,
  });
  const gatesGhost = evaluateGates(
    liveGhost.sEff,
    liveGhost.R,
    noRef.artifacts,
    liveGhost.deEff,
    liveGhost.enEff,
    0,
    false,
    false,
  );
  assert("Gate C ignores public artifact without URL", gatesGhost.find((g) => g.id === "C")?.open !== true);
}

console.log("\n=== 6. Day log JSON ===");
{
  const fakeTasks: BugunGorev[] = [
    {
      id: "temel-1",
      kind: "temel",
      kindLabel: "Foundation",
      baslik: "Linux kernel / distro / shell (bash)",
      detay: "Linux",
      saat: 0.5,
      sure: "~30 min",
      alan: "linux",
      topicId: "oak-1",
    },
    {
      id: "lab-1",
      kind: "lab",
      kindLabel: "Integrated lab",
      baslik: "Integrated Lab — Attack Timeline + Detection Write-up",
      saat: 1.25,
      sure: "~75 min",
    },
  ];
  const template = buildDayLogTemplate(fakeTasks);
  assert("Day log template has entries", template.entries.length === 2);
  assert("Default source mentor", template.entries.every((e) => e.source === "mentor"));
  assert("suggestedTags linux", suggestedTags(fakeTasks[0]).includes("linux"));

  const prompt = dayLogChatPrompt(template);
  assert("Day log prompt has JSON", prompt.includes('"entries"'));
  assert("Day log prompt has no ChatGPT brand", !/ChatGPT/i.test(prompt));

  const filled = {
    date: "2026-09-04",
    entries: [
      {
        topic: "Linux kernel / distro / shell (bash)",
        kind: "temel",
        area: "linux",
        tags: ["linux", "vm"],
        mode: "lab",
        source: "chatgpt",
        minutes: 40,
        quality: 8,
        summary: "Practiced bash in VM; checked uname and permissions.",
        evidence: "https://gist.github.com/example/linux-day1",
      },
    ],
  };
  const parsed = parseDayLogJson(JSON.stringify(filled));
  assert("parseDayLogJson ok", parsed.ok === true);
  if (parsed.ok) {
    assert("legacy chatgpt → mentor", parsed.log.entries[0].source === "mentor");
    const task = matchLogEntry(parsed.log.entries[0], fakeTasks);
    assert("matchLogEntry finds topic", task?.id === "temel-1");
    const form = entryToForm(parsed.log.entries[0], task);
    assert("entryToForm promoteEvidence", form.promoteEvidence === true);
    assert("entryToForm kanit set", form.kanit?.startsWith("https://") === true);
  }

  const bad = parseDayLogJson("not json");
  assert("parseDayLogJson rejects garbage", bad.ok === false);
}

console.log("\n=== 7. Mentor briefing + write-up scaffold ===");
{
  const task: BugunGorev = {
    id: "t1",
    kind: "temel",
    kindLabel: "Foundation",
    baslik: "TCP 3-way handshake",
    saat: 0.5,
    sure: "~30 min",
    alan: "net",
    studyGuide: buildStudyGuide({ kind: "temel", baslik: "TCP 3-way handshake", alan: "net" }),
  };
  const day = buildMentorDayBriefing([task], {
    dateIso: "2026-09-04",
    dayType: "A",
    dayTypeLabel: "Topic Day",
  });
  const single = buildMentorTaskBriefing(task, { dateIso: "2026-09-04" });
  assert("Day briefing includes topic", day.includes("TCP 3-way handshake"));
  assert("Day briefing mentor rules", /source of truth for TODAY/i.test(day));
  assert("Day briefing has purpose block", /A — PURPOSE/i.test(day));
  assert("Day briefing has working style", /WORKING STYLE|Light level-check/i.test(day));
  assert("Day briefing defaults to Teacher/mentor", /Default role:\s*Teacher\s*\/\s*mentor/i.test(day));
  assert("Day briefing forbids examiner-first", /Do not open as an examiner|not Examiner-first|Never open as Examiner/i.test(day));
  assert("Day briefing steers weak probe to Study steps", /Weak.*Study steps|teach.*Study steps|guide me through this task's Study steps/i.test(day));
  assert("Day briefing embeds Study steps section", /Study steps:/i.test(day));
  assert("Day briefing embeds What you can do", /What you can do:/i.test(day));
  assert("Day briefing reminds Record / Day log", /Record work|Day log/i.test(day));
  assert("Single briefing includes topic", single.includes("TCP 3-way handshake"));
  assert("Single briefing starts as Teacher", /Start now as Teacher/i.test(single));
  assert("No vendor AI names in briefings", !/chatgpt|gemini|claude|openai/i.test(day + single));

  const md = buildLabWriteupMarkdown("Sysmon + Wazuh lab", "2026-09-04");
  assert("Write-up has sections", md.includes("## 1. Hypothesis") && md.includes("## 7. Public evidence URL"));
  assert("slugify works", slugifyTopic("TCP 3-way!") === "tcp-3-way");
}

console.log("\n=== 8. FSRS retrieval ===");
{
  const item = { ...SEED_RETRIEVAL[0] };
  const now = Date.now();
  const due = isRetrievalDue(item, now + 40 * 86400000);
  assert("Old item eventually due", due === true || isRetrievalDue({ ...item, lastIso: "2020-01-01T00:00:00.000Z" }, now));
  const next = nextStability(item, "basarili");
  assert("nextStability returns s/ef/n", next.s > 0 && next.ef > 0 && next.n >= 0);
  assert("Successful review increases stability", next.s >= item.stability);
}

console.log("\n=== 9. Study guide smoke ===");
{
  const g = buildStudyGuide({ kind: "konu", baslik: "Antivirus: signature vs heuristic", alan: "def" });
  assert("Antivirus guide has steps", g.steps.length >= 2);
  assert("Antivirus not NAT", !g.actions.some((a) => /RFC1918|SNAT|DNAT/i.test(a)));
  const lab = buildStudyGuide({
    kind: "lab",
    baslik: "Integrated Lab — Attack Timeline + Detection Write-up",
  });
  assert("Lab guide has steps", lab.steps.length >= 2);
  const winEvt = buildStudyGuide({
    kind: "konu",
    baslik: "Windows event log basics",
    alan: "win",
  });
  assert("Windows Event Log guide has Event IDs", /4624|4625|4688|Event ID/i.test(winEvt.actions.join(" ") + winEvt.steps.map((s) => s.action).join(" ")));
  assert("Windows Event Log has THM room", winEvt.resources.some((r) => /windowseventlogs/i.test(r.url)));
}

console.log("\n=== 10. Model constants sanity ===");
assert("MODEL surum set", typeof MODEL.surum === "string");
assert("Gate C needs 2 public", MODEL.kapi.C.publicProje === 2);
assert("soc-lab value ≥ 2.5", MODEL.artefaktDeger["soc-lab"] >= 2.5);
assert("Carry max 2", MODEL.carry.maxCarry === 2);
assert("Carry max age 7", MODEL.carry.maxAgeDays === 7);

console.log("\n=== 11. localStorage normalize / seed merge ===");
{
  const seed = createSeedState();
  const partial = {
    skills: seed.skills.filter((s) => s.id !== "cloud").map((s) => ({ ...s, claimed: 9 })),
    artifacts: "bad" as unknown as typeof seed.artifacts,
    scheduleCarry: [
      {
        id: "old",
        kind: "konu" as const,
        baslik: "Stale",
        saat: 0.5,
        sinceIso: "2020-01-01T00:00:00.000Z",
      },
      {
        id: "fresh",
        kind: "temel" as const,
        baslik: "Fresh",
        saat: 0.5,
        sinceIso: new Date().toISOString(),
      },
    ],
    scheduleCompletedToday: { "2026-09-04": ["t1"], bad: 1 },
  };
  const n = normalizeLoadedState(partial);
  assert("Normalize restores missing skill id", n.skills.some((s) => s.id === "cloud"));
  assert("Normalize keeps edited claimed", n.skills.find((s) => s.id === "net")?.claimed === 9);
  assert("Normalize coerces bad artifacts to seed", Array.isArray(n.artifacts) && n.artifacts.length >= 1);
  assert("Normalize drops stale carry", !n.scheduleCarry.some((c) => c.id === "old"));
  assert("Normalize keeps fresh carry", n.scheduleCarry.some((c) => c.id === "fresh"));
  assert("Normalize completed-today shape", Array.isArray(n.scheduleCompletedToday["2026-09-04"]));
  assert("Normalize rejects non-array completed ids", n.scheduleCompletedToday.bad === undefined);
  assert("Normalize empty skills → seed", normalizeLoadedState({ skills: [] }).skills.length === seed.skills.length);
}

console.log(`\n=== RESULT: ${passed} passed, ${failures} failed ===\n`);
if (failures > 0) process.exit(1);
