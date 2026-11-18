import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "jyotish.theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "dark" || stored === "light") setThemeState(stored);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    window.localStorage.setItem(KEY, t);
  }, []);
  return { theme, setTheme };
}
