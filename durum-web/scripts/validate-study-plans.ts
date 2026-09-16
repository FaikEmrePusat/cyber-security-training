/**
 * Study plan validation — run: npm run test:plans
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildStudyGuide } from "../src/data/studyPlans";
import { TOPIC_GUIDES } from "../src/data/studyPlanGuides";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../src/data");

type Topic = { id: string; alan: string; konu: string };

function parseCurriculumTxt(raw: string, prefix: string): Topic[] {
  const out: Topic[] = [];
  let i = 0;
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("|").map((p) => p.trim());
    if (parts.length < 3) continue;
    const [alan, , ...rest] = parts;
    const konu = rest.join("|");
    if (!alan || !konu) continue;
    i += 1;
    out.push({ id: `${prefix}-${i}`, alan, konu });
  }
  return out;
}

const ALL_TOPICS = [
  ...parseCurriculumTxt(readFileSync(join(dataDir, "tekrar-ekle.txt"), "utf8"), "oak"),
  ...parseCurriculumTxt(readFileSync(join(dataDir, "tekrar-sonra.txt"), "utf8"), "oak-sonra"),
];

const KINDS = ["tekrar", "konu", "temel", "lab", "dil", "dinlenme"] as const;

let failures = 0;
let warnings = 0;

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  failures++;
}

function warn(msg: string) {
  console.warn(`WARN: ${msg}`);
  warnings++;
}

// --- Regex false-positive guards ---
const avTopic = "Antivirus: signature vs heuristic";

for (const entry of TOPIC_GUIDES) {
  if (entry.test.test(avTopic) && entry.test.source.includes("nat")) {
    const guide = entry.build({ konu: avTopic, alan: "def", kind: "konu" });
    if (guide.resources.some((r) => /networking|NAT/i.test(r.label))) {
      fail(`'nat' regex matched inside Antivirus — TOPIC_GUIDES ${entry.test}`);
    }
  }
}

const avGuide = buildStudyGuide({ kind: "konu", baslik: avTopic, alan: "def" });
if (avGuide.actions.some((a) => /RFC1918|SNAT|DNAT/i.test(a))) {
  fail("Antivirus topic matched NAT guide — expected EDR/antivirus actions");
}
if (!avGuide.actions.some((a) => /signature|behavioral|EDR/i.test(a))) {
  fail("Antivirus topic missing EDR-specific actions");
}

// --- Coverage across curriculum ---
const thin: string[] = [];
const emptyResources: string[] = [];

for (const topic of ALL_TOPICS) {
  for (const kind of KINDS) {
    const guide = buildStudyGuide({
      kind,
      baslik: topic.konu,
      topicId: topic.id,
      alan: topic.alan,
    });
    if (guide.steps.length < 3) thin.push(`${kind}:${topic.konu} (${guide.steps.length} steps)`);
    if (kind !== "dinlenme" && guide.resources.length === 0) {
      emptyResources.push(`${kind}:${topic.konu}`);
    }
  }
}

if (thin.length > 0) warn(`${thin.length} guide(s) with fewer than 3 steps`);
if (emptyResources.length > 0) warn(`${emptyResources.length} guide(s) with no resources`);

// --- Schedule-like task smoke ---
const scheduleTasks = [
  { kind: "temel" as const, baslik: "Linux kernel / distro / shell (bash)", alan: "linux" },
  { kind: "konu" as const, baslik: avTopic, alan: "def" },
  { kind: "dil" as const, baslik: "German study", alan: "lang" },
  { kind: "lab" as const, baslik: "Integrated Lab — Attack Timeline + Detection Write-up", alan: "def" },
  { kind: "konu" as const, baslik: "Intro To Security", alan: "secfund" },
  { kind: "konu" as const, baslik: "Vulnerability Scanning & Management (Nessus)", alan: "off" },
];

console.log("\nSchedule smoke tests:");
for (const task of scheduleTasks) {
  const guide = buildStudyGuide(task);
  const ok = guide.steps.length >= 3 && guide.resources.length >= 1;
  console.log(`  ${ok ? "OK" : "FAIL"} [${task.kind}] ${task.baslik} — ${guide.steps.length} steps, ${guide.resources.length} resources`);
  if (!ok) failures++;
}

{
  const de = buildStudyGuide({ kind: "dil", baslik: "German study", alan: "lang" });
  if (!de.actions.some((a) => /B2|9-month|9.month/i.test(a)) && !de.steps.some((s) => /Anki|listening|speaking/i.test(s.action))) {
    fail("German study guide missing B2 routine / Anki / input-output steps");
  }
  if (de.actions.some((a) => /SOC-relevant German|cyber topic in German/i.test(a))) {
    fail("German study guide should stay language-only (no SOC-theory mix)");
  }
}

{
  const nessus = buildStudyGuide({
    kind: "konu",
    baslik: "Vulnerability Scanning & Management (Nessus)",
    alan: "off",
  });
  if (!nessus.actions.some((a) => /CVSS|remediation|scanning/i.test(a))) {
    fail("Nessus guide missing vulnerability-management actions");
  }
  if (!nessus.steps.some((s) => /lifecycle|Nessus|Vulnversity|Oak/i.test(s.action))) {
    fail("Nessus guide missing Oak/Nessus study steps");
  }
}

{
  const intro = buildStudyGuide({ kind: "konu", baslik: "Intro To Security", alan: "secfund" });
  if (!intro.actions.some((a) => /CIA|Kill Chain|IAM|AAA/i.test(a))) {
    fail("Intro To Security guide missing CIA / Kill Chain / IAM actions");
  }
}

{
  const fieldIntro = buildStudyGuide({
    kind: "temel",
    baslik: "Introduction to cybersecurity (field overview)",
    alan: "secfund",
  });
  if (fieldIntro.resources.some((r) => /Linux Fundamentals|man pages/i.test(r.label))) {
    fail("IT Fund intro cyber must not resolve to Linux Fundamentals / man pages");
  }
  if (!fieldIntro.resources.some((r) => /0\.2 - Introduction to Cybersecurity/i.test(r.label))) {
    fail("IT Fund intro cyber should prefer Oak 0.2 PDF resource");
  }
  if (fieldIntro.actions.some((a) => /live Linux VM|permissions on misconfigured/i.test(a))) {
    fail("IT Fund intro cyber must not use Linux VM command actions");
  }

  const processing = buildStudyGuide({
    kind: "temel",
    baslik: "Processing devices and CPU role",
    alan: "secfund",
  });
  if (processing.resources.some((r) => /Linux Fundamentals|man pages/i.test(r.label))) {
    fail("Processing devices must not fall through to Linux command guide");
  }
  if (!processing.resources.some((r) => /1\.3 - Processing Devices/i.test(r.label))) {
    fail("Processing devices should prefer Oak 1.3 PDF");
  }

  const appProcess = buildStudyGuide({
    kind: "temel",
    baslik: "Application vs service vs process vs interface",
    alan: "secfund",
  });
  if (!appProcess.resources.some((r) => /1\.7 - Application, Service, Process/i.test(r.label))) {
    fail("Application/service/process topic should prefer Oak 1.7 PDF");
  }
  if (appProcess.actions.some((a) => /Complete commands in live Linux VM/i.test(a))) {
    fail("Application/service/process must not use Linux VM drill actions");
  }

  const iot = buildStudyGuide({
    kind: "temel",
    baslik: "IoT and mobile device basics / risks",
    alan: "secfund",
  });
  if (iot.actions.some((a) => /GRC in SOC|compliance drivers/i.test(a))) {
    fail("IoT risks title must not match GRC guide via bare 'risk'");
  }
  if (!iot.resources.some((r) => /1\.4 - IoT and Mobile/i.test(r.label))) {
    fail("IoT topic should prefer Oak 1.4 PDF");
  }

  const cloudRisk = buildStudyGuide({
    kind: "temel",
    baslik: "Cloud storage risks (privacy / ownership)",
    alan: "cloud",
  });
  if (cloudRisk.actions.some((a) => /GRC in SOC|compliance drivers/i.test(a))) {
    fail("Cloud storage risks must not match GRC guide");
  }
  if (!cloudRisk.resources.some((r) => /1\.10 - Cloud Computing|1\.2 - Storage Devices/i.test(r.label))) {
    fail("Cloud storage risks should prefer Oak cloud/storage PDFs");
  }
}

console.log(`\nTopics checked: ${ALL_TOPICS.length} × ${KINDS.length} kinds = ${ALL_TOPICS.length * KINDS.length} guides`);
console.log(`Failures: ${failures} · Warnings: ${warnings}`);

if (failures > 0) process.exit(1);
console.log("All validation checks passed.");
