/** Theme preference — separate from ledger state storage. */
export const THEME_STORAGE_KEY = "cyber-ledger-theme";

export type Theme = "light" | "dark";

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readStoredTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark") return raw;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function setThemePreference(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore write failures */
  }
  applyTheme(theme);
}
