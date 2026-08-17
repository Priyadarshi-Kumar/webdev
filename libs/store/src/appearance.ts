import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { Theme } from "@webdev/types";

export const APPEARANCE_STORAGE_KEY = "site-appearance";
export const THEME_STORAGE_KEY = "color-theme";

export type PaletteId = "sky" | "violet" | "emerald" | "rose" | "amber" | "cyan" | "custom";

export type ColorPalette = {
  id: Exclude<PaletteId, "custom">;
  label: string;
  accent: string;
  accentSoft: string;
  accentDeep: string;
  glow: string;
};

export const PALETTES: ColorPalette[] = [
  { id: "sky", label: "Sky", accent: "#38bdf8", accentSoft: "#67e8f9", accentDeep: "#0284c7", glow: "#a78bfa" },
  { id: "violet", label: "Violet", accent: "#a78bfa", accentSoft: "#c4b5fd", accentDeep: "#7c3aed", glow: "#38bdf8" },
  { id: "emerald", label: "Emerald", accent: "#34d399", accentSoft: "#6ee7b7", accentDeep: "#059669", glow: "#22d3ee" },
  { id: "rose", label: "Rose", accent: "#fb7185", accentSoft: "#fda4af", accentDeep: "#e11d48", glow: "#c084fc" },
  { id: "amber", label: "Amber", accent: "#fbbf24", accentSoft: "#fde68a", accentDeep: "#d97706", glow: "#fb7185" },
  { id: "cyan", label: "Cyan", accent: "#22d3ee", accentSoft: "#67e8f9", accentDeep: "#0891b2", glow: "#818cf8" },
];

export const DEFAULT_APPEARANCE = {
  mode: "dark" as Theme,
  paletteId: "sky" as PaletteId,
  customAccent: PALETTES[0].accent,
};

export type ResolvedPalette = {
  accent: string;
  accentSoft: string;
  accentDeep: string;
  glow: string;
};

type AppearanceSnapshot = {
  mode: Theme;
  paletteId: PaletteId;
  customAccent: string;
};

type AppearanceState = AppearanceSnapshot & {
  setMode: (mode: Theme) => void;
  toggleMode: () => void;
  setPalette: (id: Exclude<PaletteId, "custom">) => void;
  setCustomAccent: (hex: string) => void;
  resetAppearance: () => void;
};

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function normalizeHex(value: string): string | null {
  const raw = value.trim();
  const match = raw.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return null;
  let hex = match[1].toLowerCase();
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return `#${hex}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHex(hex) ?? PALETTES[0].accent;
  return [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => clampByte(n).toString(16).padStart(2, "0")).join("")}`;
}

function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}

export function derivePalette(accent: string): ResolvedPalette {
  const hex = normalizeHex(accent) ?? PALETTES[0].accent;
  return {
    accent: hex,
    accentSoft: mixHex(hex, "#ffffff", 0.35),
    accentDeep: mixHex(hex, "#000000", 0.22),
    glow: mixHex(hex, "#a78bfa", 0.45),
  };
}

export function resolvePalette(state: AppearanceSnapshot): ResolvedPalette {
  if (state.paletteId === "custom") return derivePalette(state.customAccent);
  const found = PALETTES.find((palette) => palette.id === state.paletteId);
  if (!found) return PALETTES[0];
  return {
    accent: found.accent,
    accentSoft: found.accentSoft,
    accentDeep: found.accentDeep,
    glow: found.glow,
  };
}

export function applyAppearance(state: AppearanceSnapshot) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", state.mode === "dark");
  const palette = resolvePalette(state);
  const accentRgb = hexToRgb(palette.accent).join(", ");
  const glowRgb = hexToRgb(palette.glow).join(", ");
  root.style.setProperty("--theme-accent", palette.accent);
  root.style.setProperty("--theme-accent-soft", palette.accentSoft);
  root.style.setProperty("--theme-accent-deep", palette.accentDeep);
  root.style.setProperty("--theme-glow", palette.glow);
  root.style.setProperty("--theme-accent-rgb", accentRgb);
  root.style.setProperty("--theme-glow-rgb", glowRgb);
  root.style.setProperty("--color-accent", palette.accent);
  root.style.setProperty("--color-sky-300", palette.accentSoft);
  root.style.setProperty("--color-sky-400", palette.accent);
  root.style.setProperty("--color-sky-500", palette.accentDeep);
  root.style.setProperty("--color-sky-600", palette.accentDeep);
  root.style.setProperty("--color-sky-700", palette.accentDeep);
  root.style.setProperty("--color-cyan-200", palette.accentSoft);
  root.style.setProperty("--color-cyan-300", palette.accentSoft);
  root.style.setProperty("--color-cyan-400", palette.accent);
  root.style.setProperty("--color-violet-300", palette.glow);
  root.style.setProperty("--color-violet-400", palette.glow);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, state.mode);
  } catch {
    /* ignore */
  }
}

function compactPalettes() {
  return Object.fromEntries(
    PALETTES.map((palette) => [
      palette.id,
      { a: palette.accent, s: palette.accentSoft, d: palette.accentDeep, g: palette.glow },
    ]),
  );
}

export const APPEARANCE_BOOTSTRAP = `(function(){var P=${JSON.stringify(compactPalettes())};function rgb(h){h=String(h).replace("#","");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];if(h.length!==6)return[56,189,248];return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}function hex(r,g,b){return"#"+[r,g,b].map(function(n){return Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,"0")}).join("")}function mix(a,b,t){var A=rgb(a),B=rgb(b);return hex(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t)}function fromAccent(a){return{a:a,s:mix(a,"#ffffff",0.35),d:mix(a,"#000000",0.22),g:mix(a,"#a78bfa",0.45)}}var mode="dark",id="sky",custom="";try{var raw=localStorage.getItem("${APPEARANCE_STORAGE_KEY}");if(raw){var parsed=JSON.parse(raw);var s=parsed.state||parsed;if(s.mode==="light")mode="light";if(s.paletteId)id=s.paletteId;if(s.customAccent)custom=s.customAccent}else if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")mode="light"}catch(e){}var el=document.documentElement;if(mode==="light")el.classList.remove("dark");else el.classList.add("dark");var pal=id==="custom"&&custom?fromAccent(custom):(P[id]||P.sky);var R=rgb(pal.a),G=rgb(pal.g);el.style.setProperty("--theme-accent",pal.a);el.style.setProperty("--theme-accent-soft",pal.s);el.style.setProperty("--theme-accent-deep",pal.d);el.style.setProperty("--theme-glow",pal.g);el.style.setProperty("--theme-accent-rgb",R.join(", "));el.style.setProperty("--theme-glow-rgb",G.join(", "));el.style.setProperty("--color-accent",pal.a);el.style.setProperty("--color-sky-300",pal.s);el.style.setProperty("--color-sky-400",pal.a);el.style.setProperty("--color-sky-500",pal.d);el.style.setProperty("--color-sky-600",pal.d);el.style.setProperty("--color-sky-700",pal.d);el.style.setProperty("--color-cyan-200",pal.s);el.style.setProperty("--color-cyan-300",pal.s);el.style.setProperty("--color-cyan-400",pal.a);el.style.setProperty("--color-violet-300",pal.g);el.style.setProperty("--color-violet-400",pal.g)})();`;

const appearanceStorage: StateStorage = {
  getItem: (name) => {
    try {
      const existing = localStorage.getItem(name);
      if (existing) return existing;
      const legacy = localStorage.getItem(THEME_STORAGE_KEY);
      if (legacy === "light" || legacy === "dark") {
        return JSON.stringify({
          state: { ...DEFAULT_APPEARANCE, mode: legacy },
          version: 0,
        });
      }
    } catch {
      /* ignore */
    }
    return null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_APPEARANCE,
      setMode: (mode) => {
        set({ mode });
        applyAppearance(get());
      },
      toggleMode: () => {
        const mode = get().mode === "dark" ? "light" : "dark";
        set({ mode });
        applyAppearance(get());
      },
      setPalette: (id) => {
        const palette = PALETTES.find((item) => item.id === id) ?? PALETTES[0];
        set({ paletteId: palette.id, customAccent: palette.accent });
        applyAppearance(get());
      },
      setCustomAccent: (hex) => {
        const next = normalizeHex(hex);
        if (!next) return;
        set({ paletteId: "custom", customAccent: next });
        applyAppearance(get());
      },
      resetAppearance: () => {
        set({ ...DEFAULT_APPEARANCE });
        applyAppearance(get());
      },
    }),
    {
      name: APPEARANCE_STORAGE_KEY,
      storage: createJSONStorage(() => appearanceStorage),
      partialize: (state) => ({
        mode: state.mode,
        paletteId: state.paletteId,
        customAccent: state.customAccent,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) applyAppearance(state);
      },
    },
  ),
);

export function isDefaultAppearance(state: AppearanceSnapshot) {
  return (
    state.mode === DEFAULT_APPEARANCE.mode &&
    state.paletteId === DEFAULT_APPEARANCE.paletteId &&
    state.customAccent === DEFAULT_APPEARANCE.customAccent
  );
}
