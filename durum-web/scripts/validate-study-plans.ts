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
];

console.log("\nSchedule smoke tests:");
for (const task of scheduleTasks) {
  const guide = buildStudyGuide(task);
  const ok = guide.steps.length >= 3 && guide.resources.length >= 1;
  console.log(`  ${ok ? "OK" : "FAIL"} [${task.kind}] ${task.baslik} — ${guide.steps.length} steps, ${guide.resources.length} resources`);
  if (!ok) failures++;
}

console.log(`\nTopics checked: ${ALL_TOPICS.length} × ${KINDS.length} kinds = ${ALL_TOPICS.length * KINDS.length} guides`);
console.log(`Failures: ${failures} · Warnings: ${warnings}`);

if (failures > 0) process.exit(1);
console.log("All validation checks passed.");
