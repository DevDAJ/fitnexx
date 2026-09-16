import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";
import { colors } from "./lib/theme";

const appConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    dark: {
      ...config.themes.dark,
      background: colors.background,
      backgroundHover: colors.surfaceRaised,
      backgroundPress: colors.surfacePressed,
      color: colors.text,
      colorHover: colors.text,
      borderColor: colors.border,
      placeholderColor: colors.textMuted,
    },
  },
});

export type AppConfig = typeof appConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
