export const siteConfig = {
  name: "Fitnexx",
  // ponytail: set NEXT_PUBLIC_SITE_URL in production; default is a placeholder.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitnexx.app",
  description:
    "Fitnexx is a privacy-first fitness app for gym performance and macro tracking. Train smarter, eat with intention, and own your data.",
  tagline: "Train smarter. Eat with intention. Own your data.",
  twitter: "@fitnexx",
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
