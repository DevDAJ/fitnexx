import { withTamagui } from "@tamagui/next-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/features", destination: "/#features", permanent: true },
      { source: "/pricing", destination: "/#pricing", permanent: true },
      { source: "/mission", destination: "/#mission", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      {
        source: "/coming-soon",
        destination: "/early-access",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/hasaneyldrm/exercises-dataset/main/images/**",
      },
    ],
  },
  transpilePackages: [
    "react-native-web",
    "@fitnexx/ai",
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
  config: "../../packages/shared-ui/src/tamagui.config.ts",
  components: ["@fitnexx/ui"],
  appDir: true,
  // ponytail: static CSS extraction trips over the RN config proxy in the
  // extractor worker ("Missing theme displayName / ProxyWorm"). Runtime
  // style injection renders identically; re-enable if a prod build needs it.
  disableExtraction: true,
  disableDebugAttr: true,
})(nextConfig);
