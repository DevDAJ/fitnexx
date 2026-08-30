import { Badge, Card, Heading, Text, View, XStack, YStack } from "@fitnexx/ui";
import { Lock, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { features } from "@/lib/features-content";
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

      <View flex={1} tag="main">
        <SectionHero />
        <SectionFeatures />
        <SectionPrivacy />
      </View>

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
      paddingVertical={64}
      paddingHorizontal={16}
      $sm={{ paddingVertical: 96 }}
    >
      <YStack
        maxWidth={768}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={20}
        alignItems="flex-start"
      >
        <Badge label="Privacy-first fitness" variant="primary" />
        <Heading
          tag="h1"
          fontSize={40}
          lineHeight={44}
          fontWeight="800"
          color="$color"
          $sm={{ fontSize: 52, lineHeight: 56 }}
        >
          Train smarter. Eat with intention. Own your data.
        </Heading>
        <Text color="$muted" fontSize={17} lineHeight={26}>
          Fitnexx shows equipment for gyms we keep on file, can suggest moves
          from your programming when you train there (Pro), pairs logging with
          OCR macro tracking, and includes free body measurement tracking; photo
          and macro fixes improve recognition without saving personal
          information for that path.
        </Text>
        <XStack flexWrap="wrap" gap={12} marginTop={4}>
          <LinkButton href="/coming-soon" size="lg">
            Start tracking
          </LinkButton>
          <LinkButton href="/mission#why-privacy" size="lg" variant="outline">
            Why privacy
          </LinkButton>
        </XStack>
      </YStack>
    </View>
  );
}

function SectionFeatures() {
  return (
    <View
      tag="section"
      aria-label="Features"
      paddingVertical={64}
      paddingHorizontal={16}
      $sm={{ paddingVertical: 80 }}
    >
      <YStack
        maxWidth={1024}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={40}
      >
        <YStack maxWidth={640} gap={8}>
          <Heading
            tag="h2"
            fontSize={30}
            fontWeight="800"
            color="$color"
            $sm={{ fontSize: 36 }}
          >
            Built for the floor and the kitchen
          </Heading>
          <Text color="$muted" fontSize={15} lineHeight={24}>
            Everything you need to align training and nutrition, without
            surrendering your personal information.
          </Text>
        </YStack>

        <View flexDirection="row" flexWrap="wrap" gap={16}>
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              flexBasis="100%"
              $sm={{ flexBasis: "calc(50% - 8px)" }}
              gap={12}
            >
              <View
                width={40}
                height={40}
                borderRadius={10}
                backgroundColor="rgba(59,130,246,0.12)"
                alignItems="center"
                justifyContent="center"
              >
                <Icon size={20} color="#3b82f6" />
              </View>
              <YStack gap={4}>
                <Text color="$color" fontSize={17} fontWeight="700">
                  {title}
                </Text>
                <Text color="$muted" fontSize={14} lineHeight={22}>
                  {description}
                </Text>
              </YStack>
            </Card>
          ))}
        </View>

        <XStack flexWrap="wrap" gap={12}>
          <LinkButton href="/features">Explore all features</LinkButton>
          <LinkButton href="/pricing" variant="outline">
            Pricing
          </LinkButton>
          <LinkButton href="/coming-soon" variant="outline">
            Get started
          </LinkButton>
        </XStack>
      </YStack>
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
      icon: ScanLine,
      title: "OCR learning, no PI stored",
      body: "Photos and macro adjustments can make OCR smarter; we don't save personal information for that improvement pipeline.",
    },
  ];

  return (
    <View
      tag="section"
      aria-label="Privacy"
      borderTopWidth={1}
      borderColor="$borderColor"
      backgroundColor="$surface"
      paddingVertical={64}
      paddingHorizontal={16}
      $sm={{ paddingVertical: 80 }}
    >
      <YStack
        maxWidth={1024}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={32}
        $sm={{ flexDirection: "row", alignItems: "center" }}
      >
        <YStack flex={1} gap={12}>
          <Heading
            tag="h2"
            fontSize={30}
            fontWeight="800"
            color="$color"
            $sm={{ fontSize: 36 }}
          >
            Privacy isn&apos;t a feature. It&apos;s the default.
          </Heading>
          <Text color="$muted" fontSize={15} lineHeight={24}>
            Your workouts and macros are yours. Fitnexx is designed so tracking
            feels empowering, not like feeding another data broker.
          </Text>
        </YStack>

        <Card flex={1} gap={16}>
          {items.map(({ icon: Icon, title, body }) => (
            <XStack key={title} gap={12} alignItems="flex-start">
              <Icon
                size={20}
                color="#3b82f6"
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <YStack gap={2}>
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
      </YStack>
    </View>
  );
}
