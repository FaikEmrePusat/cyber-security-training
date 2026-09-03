import {
  APP_NAME,
  LEARNER_NAME,
  LEARNER_ROLE,
} from "../model/brand";
import {
  computeAll,
  evaluateGates,
  rHedef,
  type AppState,
  type Artifact,
  type CareerItem,
  type ChancenkarteState,
  type LangState,
  type LogRecord,
  type RetrievalItem,
  type Skill,
  type Tempo,
} from "../model";
import { CURRICULUM_STORAGE_KEY, OAK_COVERED, type CurriculumStatus } from "./oakCurriculum";

/** Repo path updated by Publish (Contents API). Also copied into Pages dist. */
export const PROGRESS_REPO = "FaikEmrePusat/cyber-security-training";
export const PROGRESS_PATH = "durum-web/public/progress.json";
export const PROGRESS_BRANCH = "main";
export const PUBLISH_TOKEN_KEY = "durum-github-publish-token";

export type PublicProgressState = {
  skills: Skill[];
  artifacts: Artifact[];
  lang: LangState;
  career: CareerItem[];
  tempo: Tempo;
  retrieval: RetrievalItem[];
  history: LogRecord[];
  chancenkarte: ChancenkarteState;
};

export type PublicProgress = {
  version: 1;
  app: string;
  publishedAt: string;
  learner: { name: string; role: string };
  state: PublicProgressState;
  curriculum: Record<string, CurriculumStatus>;
  summary: {
    R: number;
    rTarget: number;
    oakReinforced: number;
    oakTotal: number;
    nextGateId: string | null;
    publicArtifacts: number;
  };
};

export function getPublishToken(): string | null {
  try {
    const t = localStorage.getItem(PUBLISH_TOKEN_KEY)?.trim();
    return t || null;
  } catch {
    return null;
  }
}

export function setPublishToken(token: string): void {
  localStorage.setItem(PUBLISH_TOKEN_KEY, token.trim());
}

export function clearPublishToken(): void {
  localStorage.removeItem(PUBLISH_TOKEN_KEY);
}

export function loadCurriculumMap(): Record<string, CurriculumStatus> {
  try {
    const raw = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { statuses?: Record<string, CurriculumStatus> };
    return parsed.statuses ?? {};
  } catch {
    return {};
  }
}

export function buildPublicProgress(state: AppState, curriculum?: Record<string, CurriculumStatus>): PublicProgress {
  const curriculumMap = curriculum ?? loadCurriculumMap();
  const history = state.history.filter((r) => r.type === "session" && !r.seed).slice(-40);
  const practice: Record<string, { days: number; n: number }> = {};
  for (const s of state.skills) practice[s.id] = { days: 0, n: 0 };

  const live = computeAll(state.skills, state.artifacts, state.lang, state.career, practice, {
    kanitTavani: true,
    curume: true,
  });
  const gates = evaluateGates(live.sEff, live.R, state.artifacts, live.deEff, live.enEff, 0, false, false);
  const nextGate = gates.find((g) => !g.open) ?? null;
  const oakReinforced = OAK_COVERED.filter((t) => curriculumMap[t.id] === "pekiştirildi").length;
  const publicArtifacts = state.artifacts.filter((a) => a.evidence === "public" && a.ref.trim()).length;

  return {
    version: 1,
    app: APP_NAME,
    publishedAt: new Date().toISOString(),
    learner: { name: LEARNER_NAME, role: LEARNER_ROLE },
    state: {
      skills: state.skills,
      artifacts: state.artifacts,
      lang: state.lang,
      career: state.career,
      tempo: state.tempo,
      retrieval: state.retrieval,
      history,
      chancenkarte: state.chancenkarte,
    },
    curriculum: curriculumMap,
    summary: {
      R: live.R,
      rTarget: rHedef(),
      oakReinforced,
      oakTotal: OAK_COVERED.length,
      nextGateId: nextGate?.id ?? null,
      publicArtifacts,
    },
  };
}

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/** Prefer live Pages copy; fall back to raw GitHub (updates as soon as Publish commits). */
export function progressFetchUrls(): string[] {
  const raw = `https://raw.githubusercontent.com/${PROGRESS_REPO}/${PROGRESS_BRANCH}/${PROGRESS_PATH}`;
  const local = `${import.meta.env.BASE_URL}progress.json`;
  return [raw, local];
}

export async function fetchPublicProgress(): Promise<PublicProgress | null> {
  for (const url of progressFetchUrls()) {
    try {
      const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) continue;
      const data = (await res.json()) as PublicProgress;
      if (data?.version === 1 && data.state?.skills) return data;
    } catch {
      /* try next */
    }
  }
  return null;
}

export type PublishResult =
  | { ok: true; publishedAt: string; htmlUrl?: string }
  | { ok: false; error: string };

export async function publishProgressToGitHub(
  token: string,
  progress: PublicProgress,
): Promise<PublishResult> {
  const [owner, repo] = PROGRESS_REPO.split("/");
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${PROGRESS_PATH}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token.trim()}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  let sha: string | undefined;
  try {
    const getRes = await fetch(`${apiBase}?ref=${PROGRESS_BRANCH}`, { headers });
    if (getRes.ok) {
      const existing = (await getRes.json()) as { sha?: string };
      sha = existing.sha;
    } else if (getRes.status !== 404) {
      const err = await getRes.json().catch(() => ({}));
      return {
        ok: false,
        error: `Could not read ${PROGRESS_PATH} (${getRes.status}): ${(err as { message?: string }).message ?? getRes.statusText}`,
      };
    }
  } catch {
    return { ok: false, error: "Network error while reading GitHub file." };
  }

  const body = {
    message: `Publish ${APP_NAME} progress (${progress.publishedAt.slice(0, 10)})`,
    content: utf8ToBase64(JSON.stringify(progress, null, 2)),
    branch: PROGRESS_BRANCH,
    ...(sha ? { sha } : {}),
  };

  try {
    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      const msg = (err as { message?: string }).message ?? putRes.statusText;
      if (putRes.status === 401 || putRes.status === 403) {
        return {
          ok: false,
          error: `GitHub rejected the token (${putRes.status}). Use a fine-grained token with Contents: Read and write on ${PROGRESS_REPO}.`,
        };
      }
      return { ok: false, error: `Publish failed (${putRes.status}): ${msg}` };
    }
    const data = (await putRes.json()) as { content?: { html_url?: string } };
    return { ok: true, publishedAt: progress.publishedAt, htmlUrl: data.content?.html_url };
  } catch {
    return { ok: false, error: "Network error while writing to GitHub." };
  }
}

/** Minimal empty published file so Pages always has a valid JSON. */
export function emptyPublicProgress(): PublicProgress {
  return {
    version: 1,
    app: APP_NAME,
    publishedAt: "",
    learner: { name: LEARNER_NAME, role: LEARNER_ROLE },
    state: {
      skills: [],
      artifacts: [],
      lang: {
        deKonusma: 0,
        deGenel: 0,
        enKonusma: 0,
        enGenel: 0,
        deEv: "yok",
        enEv: "yok",
        deRef: "",
        enRef: "",
      },
      career: [],
      tempo: { hoursCyber: 28, hoursLang: 10, hoursLangAlt: 0, quality: 0.85 },
      retrieval: [],
      history: [],
      chancenkarte: {
        yas: 0,
        birikim: "",
        aylikTasarruf: "",
        gate0: "bilinmiyor",
        anerkennungDurum: "arastiriliyor",
        engpassberuf: false,
        meslekiEgitimYil: 0,
        lebensunterhalt: false,
      },
    },
    curriculum: {},
    summary: {
      R: 0,
      rTarget: rHedef(),
      oakReinforced: 0,
      oakTotal: OAK_COVERED.length,
      nextGateId: null,
      publicArtifacts: 0,
    },
  };
}
