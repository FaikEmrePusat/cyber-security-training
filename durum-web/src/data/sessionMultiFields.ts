/**
 * Helpers for multi-source / multi-evidence session logs.
 * Primary `kaynak` / `kanit` stay for backward compatibility; arrays mirror the full set.
 */

export function uniqueTrimmedStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const v of values) {
    const s = String(v ?? "").trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

/** Primary + extras → ordered unique list (primary first). */
export function mergeSources(primary: string | undefined, extra?: string[]): string[] {
  const p = (primary ?? "").trim();
  const rest = uniqueTrimmedStrings(extra).filter((s) => s.toLowerCase() !== p.toLowerCase());
  return p ? [p, ...rest] : rest;
}

/** Prefer explicit list; else fall back to single primary string. */
export function mergeEvidenceUrls(primary: string | undefined, urls?: string[]): string[] {
  const fromList = uniqueTrimmedStrings(urls);
  if (fromList.length > 0) return fromList;
  const p = (primary ?? "").trim();
  return p ? [p] : [];
}

export function primaryFromList(list: string[] | undefined, fallback?: string): string | undefined {
  if (list && list.length > 0) return list[0];
  const f = (fallback ?? "").trim();
  return f || undefined;
}
