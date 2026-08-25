import type { Metadata } from "next";
import Link from "next/link";

import { HomepageNavbar } from "@/components/homepage-navbar";
import { InterestListSignup } from "@/components/interest-list-signup";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Coming soon | Fitnexx",
  description:
    "Fitnexx isn’t open to everyone yet. Join the interest list to hear when you can get started.",
};

export const dynamic = "force-dynamic";

export default async function ComingSoonPage() {
  let totalInterests: number | null = null;
  try {
    totalInterests = await getPrisma().interestListEntry.count();
  } catch {
    totalInterests = null;
  }

  return (
    <div className="flex min-h-full flex-col">
      <HomepageNavbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-lg space-y-6 text-center">
          <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Coming soon
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            We&apos;re not quite ready for new signups. Leave your name (and
            optionally your email) and we&apos;ll let you know when you can jump
            in.
          </p>
          {totalInterests !== null ? (
            <p className="text-muted-foreground text-sm tabular-nums">
              {totalInterests === 0
                ? "Be the first on the interest list."
                : totalInterests === 1
                  ? "1 person on the interest list so far."
                  : `${totalInterests.toLocaleString()} people on the interest list so far.`}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <InterestListSignup />
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
