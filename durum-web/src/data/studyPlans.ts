import { OAK_BY_ID } from "./oakCurriculum";
import {
  ALAN_GUIDES,
  ROI_GUIDES,
  TOPIC_GUIDES,
  templateByKind,
  type GuideBuilder,
} from "./studyPlanGuides";

export type StudyGuideTaskKind = "tekrar" | "konu" | "temel" | "lab" | "dil" | "dinlenme";

export type StudyGuideGateContext = {
  nextGateId?: string | null;
  gateCBlocked?: boolean;
  portfolioBlocked?: boolean;
  siemBlocked?: boolean;
};

export type StudyGuideInput = {
  kind: StudyGuideTaskKind;
  baslik: string;
  topicId?: string;
  alan?: string;
  detay?: string;
  roiId?: string;
  gateContext?: StudyGuideGateContext;
};

export type StudyResource = {
  label: string;
  url: string;
  type: "thm" | "htb" | "doc" | "video" | "lab" | "oak" | "tool";
};

export type StudyPlanStep = {
  order: number;
  action: string;
  durationMin?: number;
  logHint?: string;
};

export type StudyGuide = {
  topic: string;
  resources: StudyResource[];
  actions: string[];
  steps: StudyPlanStep[];
};

function matchGuide(
  entries: Array<{ test: RegExp; build: GuideBuilder }>,
  text: string,
  ctx: Parameters<GuideBuilder>[0],
): StudyGuide | null {
  for (const entry of entries) {
    if (entry.test.test(text)) return entry.build(ctx);
  }
  return null;
}

export function buildStudyGuide(task: StudyGuideInput): StudyGuide {
  const topic = task.topicId ? OAK_BY_ID[task.topicId] : undefined;
  const konu = topic?.konu ?? task.baslik;
  const alan = topic?.alan ?? task.alan ?? "net";
  const ctx = {
    konu,
    alan,
    kind: task.kind,
    detay: task.detay,
    roiId: task.roiId,
  };

  const roiText = `${task.baslik} ${task.detay ?? ""} ${task.roiId ?? ""}`;
  const fromRoi = matchGuide(ROI_GUIDES, roiText, ctx);
  if (fromRoi) return fromRoi;

  const fromTopic = matchGuide(TOPIC_GUIDES, konu, ctx);
  if (fromTopic) return fromTopic;

  const alanGuide = ALAN_GUIDES[alan];
  if (alanGuide) return alanGuide(ctx);

  return templateByKind(task.kind, konu, alan, task.gateContext);
}

export function stepLabel(step: StudyPlanStep): string {
  const dur = step.durationMin ? ` (${step.durationMin} min)` : "";
  return `${step.order}. ${step.action}${dur}`;
}

export { PORTFOLIO_PROJECTS } from "./portfolioProjects";
