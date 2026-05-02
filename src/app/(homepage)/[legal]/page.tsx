import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPointsOfInterest } from "@/components/homepage";
import { legalPages } from "@/constants/legal-page";

const getLegalPageData: (
  path?: string,
) => (typeof legalPages)[keyof typeof legalPages] = (path) => {
  if (!path || !Object.keys(legalPages).includes(path)) notFound();
  const page = legalPages?.[path as keyof typeof legalPages];
  return page;
};

interface Props {
  params: Promise<{ legal: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. Await the params to get the dynamic ID
  const { legal } = await params;

  const { title, descriptionMetadata } = getLegalPageData(legal) ?? {};

  return {
    title: `${title} | Fitnexx`,
    description: descriptionMetadata,
  };
}

export default async function LegalPages({
  params,
}: {
  params: Promise<{ legal: string }>;
}) {
  const { legal } = await params;
  const { title, lastUpdated, descriptionContent, pointsOfInterest } =
    getLegalPageData(legal) ?? {};
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <article className="text-muted-foreground mx-auto max-w-3xl space-y-6 text-sm leading-relaxed [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_li]:marker:text-muted-foreground [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
        <div className="space-y-2">
          <h1 className="text-foreground font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="text-xs not-italic">Last updated: {lastUpdated}</p>
        </div>
        {descriptionContent}
        <LegalPointsOfInterest pointsOfInterest={pointsOfInterest} />
      </article>
    </main>
  );
}
