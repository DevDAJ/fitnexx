import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mission & vision | Fitnexx",
  description:
    "Why Fitnexx exists, where we are going, and why privacy is built in, not bolted on.",
};

export default function MissionPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border/60 bg-linear-to-b from-primary/5 via-background to-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-foreground mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Mission &amp; vision
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Training and nutrition data are among the most personal signals you
            can log. Fitnexx exists to make progress legible without turning you
            into a product.
          </p>
        </div>
      </section>

      <section
        id="mission"
        className="scroll-mt-20 border-b border-border/40 px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="font-heading text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
            Mission
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Give people clear tools to train and eat with intention: workouts
            you can repeat, macros you can trust, and body metrics you own,
            while defaulting to data minimization and honest limits on what
            leaves your device or account.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            We build for the lifter and the cook: fast logging in the gym,
            practical nutrition without shame, and features that don&apos;t
            depend on selling your story to advertisers.
          </p>
        </div>
      </section>

      <section
        id="vision"
        className="scroll-mt-20 border-b border-border/40 px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="font-heading text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
            Vision
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            A future where “fitness app” doesn&apos;t mean opaque scoring,
            endless notifications, or shadow profiles built from your plate and
            your PRs. Fitnexx aims to be the calm layer between your real life
            and your numbers, local-first where it makes sense, transparent
            where the cloud helps, and always bound to policies you can read and
            rights you can exercise.
          </p>
        </div>
      </section>

      <section
        id="why-privacy"
        className="scroll-mt-20 border-b border-border/40 px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-heading text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
            Why privacy
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Performance and food data can reveal health, habits, location, and
            schedule. If we treat that casually, we fail you before you fail a
            rep. Privacy at Fitnexx means{" "}
            <strong className="text-foreground">data minimization</strong>: we
            collect what serves your training and nutrition, not a dossier of
            your life. It means{" "}
            <strong className="text-foreground">control</strong>: clear settings
            and documents instead of dark patterns. And for OCR, it means we
            don&apos;t save personal information to “improve the model” in ways
            that turn your photos into someone else&apos;s ad graph.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            When we add AI (gym suggestions, meal overviews) the goal is utility
            on your terms, with tiering and disclosures you see on Pricing, not
            hidden profiling. Laws and platforms change; our baseline is that
            trust has to compound like volume: slowly, deliberately, visibly.
          </p>

          <div className="bg-muted/40 ring-foreground/5 mt-8 space-y-4 rounded-xl p-6 ring-1">
            <h3 className="text-foreground font-heading font-semibold">
              Privacy &amp; policies
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Read how we process data and cookies, or reach out before you roll
              in hard on a subscription.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cookie-policy">Cookie Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/pricing">Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
