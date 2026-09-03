import { useState } from "react";
import {
  PROGRESS_PATH,
  PROGRESS_REPO,
  buildPublicProgress,
  clearPublishToken,
  getPublishToken,
  publishProgressToGitHub,
  setPublishToken,
} from "../data/publicProgress";
import { useDurum } from "../store";

export function PublishPanel({ compact = false }: { compact?: boolean }) {
  const { state } = useDurum();
  const [token, setToken] = useState(() => getPublishToken() ?? "");
  const [saved, setSaved] = useState(() => Boolean(getPublishToken()));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveToken = () => {
    if (!token.trim()) {
      setError("Paste a GitHub token first.");
      return;
    }
    setPublishToken(token.trim());
    setSaved(true);
    setError(null);
    setMessage("Token saved in this browser only (never uploaded to the repo as a secret file).");
  };

  const removeToken = () => {
    clearPublishToken();
    setToken("");
    setSaved(false);
    setMessage("Token removed from this browser.");
    setError(null);
  };

  const publish = async () => {
    const t = getPublishToken() ?? token.trim();
    if (!t) {
      setError("Save a GitHub token before publishing.");
      return;
    }
    if (!getPublishToken() && token.trim()) setPublishToken(token.trim());
    setBusy(true);
    setError(null);
    setMessage(null);
    const progress = buildPublicProgress(state);
    const result = await publishProgressToGitHub(t, progress);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage(
      `Published ${result.publishedAt.slice(0, 19).replace("T", " ")} UTC. Visitors see this after GitHub serves the file (usually seconds; Pages rebuild optional).`,
    );
  };

  return (
    <section className={`publish-panel${compact ? " publish-panel--compact" : ""}`} aria-label="Publish progress">
      {!compact && (
        <>
          <h3 className="publish-panel__title">Publish progress</h3>
          <p className="publish-panel__lead">
            Push your local tracker snapshot to GitHub so anyone opening the site can follow your Record.
            Requires a fine-grained personal access token with <strong>Contents: Read and write</strong> on{" "}
            <code>{PROGRESS_REPO}</code>. Token stays in this browser only — visitors without it cannot publish.
          </p>
        </>
      )}
      {compact && (
        <p className="publish-panel__lead">
          Update what visitors see on Record. Writes <code>{PROGRESS_PATH}</code> — only works with your saved
          token.
        </p>
      )}
      <label className="publish-panel__label" htmlFor="publish-token">
        GitHub token
      </label>
      <input
        id="publish-token"
        className="publish-panel__token"
        type="password"
        autoComplete="off"
        spellCheck={false}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="github_pat_… or ghp_…"
      />
      <div className="publish-panel__actions">
        <button type="button" className="cta cta--sm" onClick={saveToken}>
          {saved ? "Update token" : "Save token"}
        </button>
        {saved && (
          <button type="button" className="cta cta--ghost cta--sm" onClick={removeToken}>
            Remove token
          </button>
        )}
        <button type="button" className="cta cta--sm" disabled={busy} onClick={publish}>
          {busy ? "Publishing…" : "Publish progress"}
        </button>
      </div>
      {message && <p className="publish-panel__ok">{message}</p>}
      {error && <p className="publish-panel__error">{error}</p>}
    </section>
  );
}
