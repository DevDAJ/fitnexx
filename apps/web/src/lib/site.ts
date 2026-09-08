export const siteConfig = {
  name: "Fitnexx",
  // ponytail: set NEXT_PUBLIC_SITE_URL in production; default is a placeholder.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitnexx.app",
  description:
    "Fitnexx is a local-first fitness app for workout, meal, and body tracking, with optional AI exercise suggestions when you ask for them.",
  tagline: "Train smarter. Eat with intention. Own your data.",
  twitter: "@fitnexx",
  apkDownloadUrl:
    "https://github.com/DevDAJ/fitnexx/releases/latest/download/fitnexx.apk",
} as const;

type PageMetadata = {
  title?: string;
  description?: string;
  path?: string;
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
}: PageMetadata = {}) {
  const url = new URL(path, siteConfig.url).toString();
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | Privacy-first gym performance and macro tracking`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: siteConfig.twitter,
    },
  };
}
