import type { AppState, Artifact, ArtifactType, EvidenceTier, Skill } from "../model/types";

const TIER_RANK: Record<EvidenceTier, number> = { yok: 0, kayit: 1, public: 2 };

export function isPublicHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

export function shortUrlLabel(url: string, max = 48): string {
  const u = url.trim();
  if (u.length <= max) return u;
  return `${u.slice(0, max - 1)}…`;
}

export function inferArtifactType(opts: {
  kind?: string;
  alan?: string;
  title?: string;
  tags?: string[];
}): ArtifactType {
  const title = opts.title ?? "";
  const tags = opts.tags ?? [];
  const blob = `${title} ${tags.join(" ")}`.toLowerCase();

  if (opts.kind === "lab" || tags.includes("lab")) {
    if (opts.alan === "win" || /active directory|\bad\b|kerberos|ntlm|gpo/.test(blob)) return "ad-lab";
    return "soc-lab";
  }
  if (tags.includes("writeup") || /write-?up|medium\.com|gist\.github/.test(blob)) return "writeup";
  if (opts.alan === "win") return "ad-lab";
  if (opts.alan === "siem" || opts.alan === "def") return "soc-lab";
  return "lab-egzersizi";
}

function bumpSkillEvidence(skills: Skill[], alan: string | undefined, url: string): Skill[] {
  if (!alan || alan.startsWith("dil-")) return skills;
  return skills.map((s) => {
    if (s.id !== alan) return s;
    const nextEv: EvidenceTier = TIER_RANK.public > TIER_RANK[s.evidence] ? "public" : s.evidence;
    return { ...s, evidence: nextEv, ref: s.ref.trim() || url };
  });
}

/** Raise skill evidence at most to kayit (never public) when local notes / paths exist. */
function bumpSkillEvidenceKayit(skills: Skill[], alan: string | undefined, ref: string): Skill[] {
  if (!alan || alan.startsWith("dil-")) return skills;
  return skills.map((s) => {
    if (s.id !== alan) return s;
    if (TIER_RANK[s.evidence] >= TIER_RANK.kayit) {
      return { ...s, ref: s.ref.trim() || ref };
    }
    return { ...s, evidence: "kayit", ref: s.ref.trim() || ref };
  });
}

export type EvidencePromoteInput = {
  title: string;
  url?: string;
  kind?: string;
  alan?: string;
  tags?: string[];
  /** When true and URL is public http(s), upsert portfolio artifact + skill evidence. */
  promote?: boolean;
};

export type EvidencePromoteResult = {
  state: AppState;
  promoted: boolean;
  artifactId?: string;
};

/** Upsert a public artifact from a session evidence URL so Gate C / R can move. */
export function applySessionEvidence(state: AppState, input: EvidencePromoteInput): EvidencePromoteResult {
  const url = input.url?.trim() ?? "";
  if (!input.promote || !url || !isPublicHttpUrl(url)) {
    return { state, promoted: false };
  }

  const title = (input.title.trim() || "Session evidence").slice(0, 100);
  const tur = inferArtifactType({
    kind: input.kind,
    alan: input.alan,
    title,
    tags: input.tags,
  });

  const byRef = state.artifacts.find((a) => a.ref.trim().toLowerCase() === url.toLowerCase());
  const byName = state.artifacts.find((a) => a.ad.trim().toLowerCase() === title.toLowerCase());
  const existing = byRef ?? byName;

  let artifactId: string;
  let artifacts: Artifact[];

  if (existing) {
    artifactId = existing.id;
    const betterLab =
      (tur === "soc-lab" || tur === "ad-lab") &&
      existing.tur !== "soc-lab" &&
      existing.tur !== "ad-lab";
    artifacts = state.artifacts.map((a) =>
      a.id === existing.id
        ? {
            ...a,
            ad: a.ad.trim() || title,
            ref: url,
            evidence: "public" as const,
            sahiplik: Math.max(a.sahiplik, 1),
            tur: betterLab ? tur : a.tur,
          }
        : a,
    );
  } else {
    artifactId = `art-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    artifacts = [
      ...state.artifacts,
      {
        id: artifactId,
        ad: title,
        tur,
        sahiplik: 1,
        evidence: "public",
        ref: url,
      },
    ];
  }

  return {
    state: {
      ...state,
      artifacts,
      skills: bumpSkillEvidence(state.skills, input.alan, url),
    },
    promoted: true,
    artifactId,
  };
}

export type KayitNoteEvidenceInput = {
  title: string;
  /** Stable local ref, e.g. self-check:TopicName or a file path. */
  ref: string;
  alan?: string;
};

/**
 * Local notes / self-check answers count as kayit (record) evidence — not Gate C public.
 * Does not lower an existing public skill or public artifact.
 */
export function applyKayitNoteEvidence(
  state: AppState,
  input: KayitNoteEvidenceInput,
): EvidencePromoteResult {
  const ref = input.ref.trim();
  if (!ref) return { state, promoted: false };

  const title = (input.title.trim() || "Self-check notes").slice(0, 100);
  const key = ref.toLowerCase();
  const existing = state.artifacts.find((a) => a.ref.trim().toLowerCase() === key);

  let artifactId: string;
  let artifacts: Artifact[];

  if (existing) {
    artifactId = existing.id;
    artifacts = state.artifacts.map((a) => {
      if (a.id !== existing.id) return a;
      if (a.evidence === "public") {
        return { ...a, ad: a.ad.trim() || title };
      }
      return {
        ...a,
        ad: title,
        ref,
        evidence: "kayit",
        sahiplik: Math.max(a.sahiplik, 0.8),
        tur: a.tur === "writeup" ? a.tur : "lab-egzersizi",
      };
    });
  } else {
    artifactId = `art-sc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    artifacts = [
      ...state.artifacts,
      {
        id: artifactId,
        ad: title,
        tur: "lab-egzersizi",
        sahiplik: 0.8,
        evidence: "kayit",
        ref,
      },
    ];
  }

  return {
    state: {
      ...state,
      artifacts,
      skills: bumpSkillEvidenceKayit(state.skills, input.alan, ref),
    },
    promoted: true,
    artifactId,
  };
}

export function artifactAlreadyHasUrl(artifacts: Artifact[], url: string): boolean {
  const key = url.trim().toLowerCase();
  if (!key) return false;
  return artifacts.some((a) => a.ref.trim().toLowerCase() === key && a.evidence === "public");
}
