import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

const appConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    dark: {
      ...config.themes.dark,
      background: "#0a0a0a",
      backgroundHover: "#1a1a1a",
      backgroundPress: "#222222",
      color: "#e5e5e5",
      colorHover: "#ffffff",
      borderColor: "#2a2a2a",
      placeholderColor: "#666666",
    },
  },
});

export type AppConfig = typeof appConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
