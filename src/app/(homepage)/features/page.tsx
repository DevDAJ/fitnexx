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
import { features } from "@/constants/features-content";

export const metadata: Metadata = {
  title: "Features | Fitnexx",
  description:
    "Free body measurements, cataloged gyms, logging, OCR, Pro gym AI and meal overview.",
};

export default function FeaturesPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-border/60 bg-linear-to-b from-primary/5 via-background to-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-heading text-foreground mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Features
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
            Gym equipment catalogs for everyone. Pro lifts gym workout AI
            suggestions plus a daily meal AI overview alongside higher OCR caps;
            body measurements stay included on Free. Personal information
            isn&apos;t saved for OCR improvement.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          {features.map(({ icon: Icon, title, description, details }) => (
            <Card key={title} className="overflow-hidden">
              <CardHeader className="sm:flex-row sm:items-start sm:gap-6">
                <div className="bg-primary/10 text-primary inline-flex size-12 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 space-y-2">
                  <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
                  <CardDescription className="text-base text-pretty">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground border-t pt-6 text-sm leading-relaxed sm:text-base">
                {details}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 pt-4 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-5xl">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div>
                <CardTitle className="text-xl sm:text-2xl">
                  Ready to try Fitnexx?
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Start from the home page or open the app when you&apos;re set.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3 sm:shrink-0">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/">Back to home</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link href="/app">Get started</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  );
}
