import { create } from "zustand";
import type { Theme } from "@webdev/types";
import { THEME_STORAGE_KEY, useAppearanceStore } from "./appearance";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export function readStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem("site-appearance");
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { mode?: Theme }; mode?: Theme };
      const mode = parsed.state?.mode ?? parsed.mode;
      if (mode === "light" || mode === "dark") return mode;
    }
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function applyTheme(theme: Theme) {
  useAppearanceStore.getState().setMode(theme);
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => {
    useAppearanceStore.getState().setMode(theme);
    set({ theme });
  },
  toggleTheme: () => {
    useAppearanceStore.getState().toggleMode();
    set({ theme: useAppearanceStore.getState().mode });
  },
}));

useAppearanceStore.subscribe((state) => {
  useThemeStore.setState({ theme: state.mode });
});
