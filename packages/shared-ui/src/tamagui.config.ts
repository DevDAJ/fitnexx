import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

const geist = "var(--font-geist-sans), system-ui, -apple-system, sans-serif";

const withGeist = <T extends { family?: string }>(font: T) => ({
  ...font,
  family: geist,
});

const dark = {
  ...config.themes.dark,
  background: "#080b10",
  backgroundHover: "#131a24",
  backgroundPress: "#192231",
  backgroundFocus: "#192231",
  borderColor: "#243043",
  borderColorHover: "#344258",
  color: "#f4f7fb",
  colorHover: "#ffffff",
  colorPress: "#ffffff",
  colorFocus: "#ffffff",
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  primaryMuted: "#172a48",
  card: "#131a24",
  surface: "#0d121a",
  surfaceRaised: "#192231",
  muted: "#b6c0ce",
  subtle: "#8491a3",
  positive: "#34d399",
  negative: "#fb7185",
  warning: "#fbbf24",
  amber: "#fbbf24",
  purple: "#8b5cf6",
};

const light = {
  ...config.themes.light,
  background: "#f7f7f8",
  backgroundHover: "#ececef",
  backgroundPress: "#e4e4e7",
  borderColor: "#e2e2e6",
  borderColorHover: "#d4d4d8",
  color: "#0a0a0a",
  colorHover: "#000000",
  primary: "#3b82f6",
  primaryHover: "#2f6fe0",
  primaryMuted: "#dbeafe",
  card: "#ffffff",
  surface: "#f0f0f2",
  surfaceRaised: "#e4e4e7",
  muted: "#666666",
  subtle: "#999999",
  positive: "#16a34a",
  negative: "#dc2626",
  warning: "#d97706",
  amber: "#d97706",
  purple: "#7c3aed",
};

export const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    body: withGeist(config.fonts.body),
    heading: withGeist(config.fonts.heading),
  },
  themes: {
    ...config.themes,
    light,
    dark,
  },
});

export type AppConfig = typeof tamaguiConfig;

export default tamaguiConfig;
