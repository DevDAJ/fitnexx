import { Badge, Card, Heading, Text, View, XStack, YStack } from "@fitnexx/ui";
import { HardDrive, Lock, ShieldCheck } from "lucide-react";
import { AppShowcase } from "@/components/home/app-showcase";
import { HeroIntro, RevealSection, SpringCard } from "@/components/home/motion";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { siteConfig } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  slogan: siteConfig.tagline,
  sameAs: [siteConfig.twitter].filter(Boolean),
};

export default function Home() {
  return (
    <View
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, not user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageNavbar />

      <RevealSection>
        <View flex={1} tag="main">
          <SectionHero />
          <AppShowcase />
          <SectionPrivacy />
        </View>
      </RevealSection>

      <SiteFooter />
    </View>
  );
}

function SectionHero() {
  return (
    <View
      tag="section"
      aria-label="Introduction"
      borderBottomWidth={1}
      borderColor="$borderColor"
      paddingVertical={96}
      paddingHorizontal={16}
      style={{ position: "relative", overflow: "hidden" }}
      $sm={{ paddingVertical: 64 }}
    >
      <div
        className="pf-drift"
        aria-hidden
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.22), transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="pf-drift"
        aria-hidden
        style={{
          position: "absolute",
          bottom: -120,
          left: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.16), transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          animationDelay: "-7s",
        }}
      />
      <HeroIntro>
        <YStack
          maxWidth={768}
          width="100%"
          marginLeft="auto"
          marginRight="auto"
          gap={20}
          alignItems="flex-start"
        >
          <div data-hero-badge>
            <Badge label="Privacy-first fitness" variant="primary" />
          </div>
          <div data-hero-heading>
            <Heading
              tag="h1"
              fontSize={52}
              lineHeight={56}
              fontWeight="800"
              color="$color"
              $sm={{ fontSize: 40, lineHeight: 44 }}
              $xxs={{ fontSize: 34, lineHeight: 38 }}
            >
              Train smarter. Eat with intention. Own your data.
            </Heading>
          </div>
          <div data-hero-copy>
            <Text color="$muted" fontSize={17} lineHeight={26}>
              Fitnexx logs workouts, sets, PRs, meals, and body measurements.
              Fitnexx turns your training history into deeper insights: PR
              trends, plateaus, injury risk, and muscle milestones. Your data
              stays local by default, with optional AI suggestions when you ask.
            </Text>
          </div>
          <div data-hero-ctas>
            <XStack flexWrap="wrap" gap={12} marginTop={4}>
              <LinkButton href="/coming-soon" size="lg">
                Start tracking
              </LinkButton>
              <LinkButton
                href="/mission#why-privacy"
                size="lg"
                variant="outline"
              >
                Why privacy
              </LinkButton>
            </XStack>
          </div>
        </YStack>
      </HeroIntro>
    </View>
  );
}

function SectionPrivacy() {
  const items = [
    {
      icon: Lock,
      title: "Data minimization",
      body: "Collect what helps your progress, not a shadow profile of your life.",
    },
    {
      icon: ShieldCheck,
      title: "You stay in control",
      body: "A product mindset that respects boundaries, not engagement hacks at your expense.",
    },
    {
      icon: HardDrive,
      title: "Local by default",
      body: "Workouts, meals, and measurements stay on your device. Cloud AI receives only the context you submit by tapping Ask AI.",
    },
  ];

  return (
    <View
      tag="section"
      aria-label="Privacy"
      borderTopWidth={1}
      borderColor="$borderColor"
      backgroundColor="$surface"
      paddingVertical={80}
      paddingHorizontal={16}
      $sm={{ paddingVertical: 64 }}
    >
      <YStack
        maxWidth={1024}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={32}
        flexDirection="row"
        alignItems="center"
        $sm={{ flexDirection: "column", alignItems: "stretch" }}
      >
        <YStack
          flexBasis={0}
          flexGrow={2}
          flexShrink={1}
          gap={12}
          minWidth={0}
          $sm={{ flexBasis: "auto" }}
        >
          <div data-reveal>
            <Heading
              tag="h2"
              fontSize={36}
              fontWeight="800"
              color="$color"
              $sm={{ fontSize: 30 }}
            >
              Privacy isn&apos;t a feature. It&apos;s the default.
            </Heading>
          </div>
          <div data-reveal data-reveal-delay="0.06">
            <Text color="$muted" fontSize={15} lineHeight={24}>
              Your workouts and macros are yours. Fitnexx is designed so
              tracking feels empowering, not like feeding another data broker.
            </Text>
          </div>
        </YStack>

        <YStack
          data-reveal
          data-reveal-delay="0.12"
          flexBasis={0}
          flexGrow={3}
          flexShrink={1}
          minWidth={0}
          $sm={{ flexBasis: "auto" }}
        >
          <SpringCard>
            <Card flex={1} gap={16}>
              {items.map(({ icon: Icon, title, body }) => (
                <XStack key={title} gap={12} alignItems="flex-start">
                  <Icon
                    size={20}
                    color="#3b82f6"
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <YStack flex={1} minWidth={0} gap={2}>
                    <Text color="$color" fontSize={15} fontWeight="600">
                      {title}
                    </Text>
                    <Text color="$muted" fontSize={14} lineHeight={22}>
                      {body}
                    </Text>
                  </YStack>
                </XStack>
              ))}
            </Card>
          </SpringCard>
        </YStack>
      </YStack>
    </View>
  );
}
