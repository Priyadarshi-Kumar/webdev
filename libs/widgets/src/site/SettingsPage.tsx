import { RotateCcw } from "lucide-react";
import { Card, Eyebrow } from "@webdev/components";
import {
  PALETTES,
  isDefaultAppearance,
  normalizeHex,
  useAppearanceStore,
} from "@webdev/store";

export function SettingsPage() {
  const mode = useAppearanceStore((state) => state.mode);
  const paletteId = useAppearanceStore((state) => state.paletteId);
  const customAccent = useAppearanceStore((state) => state.customAccent);
  const setMode = useAppearanceStore((state) => state.setMode);
  const setPalette = useAppearanceStore((state) => state.setPalette);
  const setCustomAccent = useAppearanceStore((state) => state.setCustomAccent);
  const resetAppearance = useAppearanceStore((state) => state.resetAppearance);
  const isDefault = useAppearanceStore((state) => isDefaultAppearance(state));

  return (
    <section className="pb-10">
      <Eyebrow>Appearance</Eyebrow>
      <h1 className="page-title">Settings</h1>
      <p className="page-lead">
        Dark and light stay in sync with the header toggle. Pick a palette or a custom accent — both the
        colors and the selected theme are saved in the store and in local storage.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-white">Theme</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Dark is the site default.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(
              [
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ] as const
            ).map((option) => {
              const active = mode === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMode(option.id)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? "border-sky-400 bg-sky-400/15 text-zinc-950 dark:text-white"
                      : "border-zinc-200/80 bg-white/50 text-zinc-600 hover:border-sky-400/50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-white">Accent</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Presets remap the site accent. Custom uses any hex you pick.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {PALETTES.map((palette) => {
              const active = paletteId === palette.id;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => setPalette(palette.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-[11px] font-medium transition ${
                    active
                      ? "border-sky-400 bg-sky-400/10 text-zinc-950 dark:text-white"
                      : "border-zinc-200/80 bg-white/50 text-zinc-500 hover:border-sky-400/50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400"
                  }`}
                  aria-pressed={active}
                >
                  <span
                    className="h-8 w-8 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.25)_inset]"
                    style={{ background: `linear-gradient(135deg, ${palette.accent}, ${palette.glow})` }}
                  />
                  {palette.label}
                </button>
              );
            })}
          </div>
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/50 px-3 py-3 dark:border-white/10 dark:bg-white/5">
            <input
              type="color"
              value={normalizeHex(customAccent) ?? "#38bdf8"}
              onChange={(event) => setCustomAccent(event.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              aria-label="Custom accent color"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-zinc-950 dark:text-white">Custom color</span>
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{customAccent}</span>
            </span>
          </label>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-white">Preview</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Buttons and highlights follow the accent you choose.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gradient font-display text-xl font-semibold">Accent text</span>
            <button type="button" className="btn-primary min-h-10 px-4 py-2 text-sm">
              Primary
            </button>
            <button type="button" className="btn-ghost min-h-10 px-4 py-2 text-sm">
              Ghost
            </button>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <button
          type="button"
          onClick={resetAppearance}
          disabled={isDefault}
          className="btn-ghost inline-flex min-h-10 items-center gap-2 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={15} aria-hidden />
          Reset theme
        </button>
      </div>
    </section>
  );
}
