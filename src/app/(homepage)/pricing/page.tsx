import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { foodScansPerDay } from "@/constants/food-scan-limits";
import { proSubscriptionUsd } from "@/constants/pro-pricing";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const metadata: Metadata = {
  title: "Pricing | Fitnexx",
  description:
    "Pro from $9.99/mo or $110/yr USD. Free body measurements, OCR limits, gym AI and meal overview on Pro.",
};

const tiers: {
  name: string;
  description: string;
  highlight: boolean;
  badge?: string;
  bullets: string[];
  listPriceUsd?: { monthly: number; yearly: number };
}[] = [
  {
    name: "Free",
    description:
      "Log training, track body measurements, macros with OCR, and see equipment we have on file: strong foundation without Pro-only AI.",
    highlight: false,
    bullets: [
      "Core workout and macro logging",
      "Body measurement tracking (included on Free: weight, circumference, metrics you enable)",
      `${foodScansPerDay.free} OCR food scans per day`,
      "Equipment listings for gyms in our database (catalog view)",
    ],
  },
  {
    name: "Pro",
    description:
      "Higher OCR limits plus AI help at the gym and a daily snapshot of nutrition, still privacy-first.",
    highlight: true,
    badge: "Premium AI",
    bullets: [
      "Everything in Free, including body measurement tracking",
      `Up to ${foodScansPerDay.proMax} OCR food scans per day`,
      "Gym workout suggestions: AI-guided options based on your programming and equipment available where you train (cataloged gyms)",
      "Daily meal AI overview: a synthesized read of your day’s meals and macros (not a replacement for logs)",
    ],
    listPriceUsd: {
      monthly: proSubscriptionUsd.monthly,
      yearly: proSubscriptionUsd.yearly,
    },
  },
];

export default function PricingPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border/60 bg-linear-to-b from-primary/5 via-background to-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-heading text-foreground mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Pricing
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
            Two ways to train with Fitnexx. Pro adds more OCR scans, AI workout
            suggestions when you lift at cataloged gyms, and a daily meal
            overview alongside the same privacy baseline.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:pb-16 sm:pt-12">
        <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-2 md:gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={
                tier.highlight
                  ? "border-primary/40 shadow-sm ring-1 ring-primary/20 md:translate-y-0"
                  : "border-border/80"
              }
            >
              <CardHeader>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  {tier.highlight ? (
                    <span className="bg-primary/15 text-primary rounded-md px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
                      {tier.badge ?? "Pro"}
                    </span>
                  ) : null}
                </div>
                <CardDescription className="text-base">
                  {tier.description}
                </CardDescription>
                {tier.listPriceUsd ? (
                  <div className="mt-4 space-y-1">
                    <p className="text-foreground">
                      <span className="font-heading text-3xl font-semibold tabular-nums">
                        {usdFormatter.format(tier.listPriceUsd.monthly)}
                      </span>
                      <span className="text-muted-foreground text-base font-normal">
                        {" "}
                        / month
                      </span>
                    </p>
                    <p className="text-muted-foreground text-sm">
                      <span className="text-foreground font-medium tabular-nums">
                        {usdFormatter.format(tier.listPriceUsd.yearly)}
                      </span>{" "}
                      / year billed annually
                    </p>
                  </div>
                ) : (
                  <p className="font-heading text-foreground mt-4 text-3xl font-semibold">
                    Free
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4 border-t pt-6">
                <ul className="text-foreground list-disc space-y-2 pl-5 text-sm leading-snug">
                  {tier.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <Button className="w-full sm:w-auto" asChild>
                  <Link href="/app">
                    {tier.highlight ? "Go Pro in app" : "Get started"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground mx-auto mt-8 max-w-5xl text-center text-xs sm:text-sm">
          Listed prices USD before tax. Taxes, currency conversion, or regional
          offers may appear at checkout in the app. Premium AI may vary by
          platform; OCR resets daily in your timezone.
        </p>
      </section>

      <section className="px-4 pb-20 pt-4 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-5xl">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div>
                <CardTitle className="text-xl sm:text-2xl">
                  Questions about plans?
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Explore feature details first, then pick a plan inside the
                  app.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3 sm:shrink-0">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/features">Features</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link href="/">Home</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  );
}
