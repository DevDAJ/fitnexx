import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

const geist = "var(--font-geist-sans), system-ui, -apple-system, sans-serif";

const withGeist = <T extends { family?: string }>(font: T) => ({
  ...font,
  family: geist,
});

const dark = {
  ...config.themes.dark,
  background: "#0a0a0a",
  backgroundHover: "#161616",
  backgroundPress: "#1a1a1a",
  backgroundFocus: "#1a1a1a",
  borderColor: "#222222",
  borderColorHover: "#2a2a2a",
  color: "#e5e5e5",
  colorHover: "#ffffff",
  colorPress: "#ffffff",
  colorFocus: "#ffffff",
  primary: "#3b82f6",
  primaryHover: "#2f6fe0",
  card: "#161616",
  surface: "#111111",
  muted: "#888888",
  subtle: "#666666",
  positive: "#22c55e",
  negative: "#ef4444",
  warning: "#f59e0b",
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
  card: "#ffffff",
  surface: "#f0f0f2",
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