import type { MetadataRoute } from "next";

/**
 * Web app manifest — see https://nextjs.org/docs/app/guides/progressive-web-apps
 * and https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fitnexx",
    short_name: "Fitnexx",
    description:
      "Privacy-first gym performance and macro tracking in your browser.",
    start_url: "/app",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#208b9a",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
