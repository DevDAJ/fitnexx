import { Lock, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { features } from "@/lib/features-content";

type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

/** Add entries here to show the testimonial section on the page. */
const testimonials: Testimonial[] = [];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <HomepageNavbar />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-linear-to-b from-primary/5 via-background to-background px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="text-primary mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="size-3.5" aria-hidden />
              Privacy-first fitness
            </p>
            <h1 className="font-heading text-foreground mb-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Train smarter. Eat with intention. Own your data.
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl text-base leading-relaxed sm:text-lg">
              Fitnexx shows equipment for gyms we keep on file, can
              suggest moves from your programming when you train there (Pro),
              pairs logging with OCR macro tracking, and includes free body
              measurement tracking; photo and macro fixes improve recognition
              without saving personal information for that path.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/coming-soon">Start tracking</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/mission#why-privacy">Why privacy</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-16 px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-2xl">
              <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Built for the floor and the kitchen
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Everything you need to align training and nutrition, without
                surrendering your personal information.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardHeader>
                    <div className="bg-primary/10 text-primary mb-2 inline-flex size-10 items-center justify-center rounded-lg">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-pretty">
                      {description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/features">Explore all features</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/coming-soon">Get started</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="privacy"
          className="scroll-mt-16 border-y border-border/60 bg-muted/30 px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  Privacy isn&apos;t a feature. It&apos;s the default.
                </h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                  Your workouts and macros are yours. Fitnexx is designed so
                  tracking feels empowering, not like feeding another data
                  broker.
                </p>
              </div>
              <Card>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <Lock
                        className="text-primary mt-0.5 size-5 shrink-0"
                        aria-hidden
                      />
                      <div>
                        <p className="font-medium">Data minimization</p>
                        <p className="text-muted-foreground text-sm">
                          Collect what helps your progress, not a shadow profile
                          of your life.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <ShieldCheck
                        className="text-primary mt-0.5 size-5 shrink-0"
                        aria-hidden
                      />
                      <div>
                        <p className="font-medium">You stay in control</p>
                        <p className="text-muted-foreground text-sm">
                          A product mindset that respects boundaries, not
                          engagement hacks at your expense.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <ScanLine
                        className="text-primary mt-0.5 size-5 shrink-0"
                        aria-hidden
                      />
                      <div>
                        <p className="font-medium">
                          OCR learning, no PI stored
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Photos and macro adjustments can make OCR smarter; we
                          don&apos;t save personal information for that
                          improvement pipeline.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="border-border/60 mt-10 flex flex-wrap gap-3 border-t pt-10">
              <Button variant="outline" asChild>
                <Link href="/mission">Mission &amp; vision</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/mission#why-privacy">
                  Why privacy (full story)
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </Button>
            </div>
          </div>
        </section>

        {testimonials.length > 0 ? (
          <section
            id="testimonials"
            className="scroll-mt-16 px-4 py-16 sm:px-6 sm:py-20"
          >
            <div className="mx-auto max-w-5xl">
              <h2 className="font-heading mb-10 text-2xl font-semibold tracking-tight sm:text-3xl">
                What people say
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <Card key={`${t.author}-${t.quote.slice(0, 24)}`}>
                    <CardHeader>
                      <CardDescription className="text-foreground text-base italic">
                        &ldquo;{t.quote}&rdquo;
                      </CardDescription>
                      <div className="pt-2">
                        <CardTitle className="text-sm">{t.author}</CardTitle>
                        {t.role ? (
                          <CardDescription>{t.role}</CardDescription>
                        ) : null}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
