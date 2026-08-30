import { withTamagui } from "@tamagui/next-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "react-native-web",
    "@fitnexx/ui",
    "tamagui",
    "@tamagui/core",
    "@tamagui/config",
    "@tamagui/next-theme",
  ],
  turbopack: {
    resolveAlias: {},
  },
};

export default withTamagui({
  config: "./packages/shared-ui/src/tamagui.config.ts",
  components: ["@fitnexx/ui"],
  appDir: true,
})(nextConfig);
