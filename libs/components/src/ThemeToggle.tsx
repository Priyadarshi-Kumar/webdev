import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { readStoredTheme, useThemeStore } from "@webdev/store";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    setTheme(readStoredTheme());
  }, [setTheme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-sky-400/70 hover:bg-zinc-100 hover:text-sky-600 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-sky-300"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
