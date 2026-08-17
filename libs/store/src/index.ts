export {
  APPEARANCE_BOOTSTRAP,
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE,
  PALETTES,
  THEME_STORAGE_KEY,
  applyAppearance,
  derivePalette,
  isDefaultAppearance,
  normalizeHex,
  resolvePalette,
  useAppearanceStore,
} from "./appearance";
export type { ColorPalette, PaletteId } from "./appearance";
export { applyTheme, readStoredTheme, useThemeStore } from "./theme";
