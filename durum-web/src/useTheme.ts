import { useEffect, useState } from "react";
import {
  applyTheme,
  getSystemTheme,
  readStoredTheme,
  resolveTheme,
  setThemePreference,
  type Theme,
} from "./theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => resolveTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStoredTheme() != null) return;
      const next = getSystemTheme();
      setThemeState(next);
      applyTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = (next: Theme) => {
    setThemePreference(next);
    setThemeState(next);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, setTheme, toggleTheme };
}
