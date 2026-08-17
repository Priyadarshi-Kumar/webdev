import { Moon, Sun } from "lucide-react";
import { useAppearanceStore } from "@webdev/store";

export function ThemeToggle() {
  const theme = useAppearanceStore((state) => state.mode);
  const toggleTheme = useAppearanceStore((state) => state.toggleMode);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/70 p-2 text-zinc-600 transition hover:border-sky-400/70 hover:text-sky-600 sm:min-h-9 sm:min-w-9 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-sky-300"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
