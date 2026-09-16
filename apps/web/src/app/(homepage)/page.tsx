import { Badge, Card, Heading, Text, View, XStack, YStack } from "@fitnexx/ui";
import { Brain, Database, LockKeyhole, ShieldCheck, Zap } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { FeaturesShowcase } from "@/components/home/features-showcase";
import {
  HeroIntro,
  HeroParallax,
  RevealSection,
  SpringCard,
} from "@/components/home/motion";
import { DashboardScreen, PhoneFrame } from "@/components/home/phone-mockup";
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

const signals = [
  { value: "18", label: "analysis modules" },
  { value: "0", label: "ads or data brokers" },
  { value: "Local", label: "by default" },
];

const tiers = [
  {
    name: "Free",
    description:
      "Core tracking, local analytics, rule-based suggestions, and optional AI with your own provider key.",
    price: "Free",
    note: "No account required",
    highlight: false,
    bullets: [
      "Workout, meal, body measurement, and gym equipment tracking",
      "Templates, PR detection, volume trends, and muscle analysis",
      "Rule-based exercise suggestions based on available equipment",
      "Bring your own OpenAI, Anthropic, Gemini, OpenRouter, or compatible key",
    ],
  },
  {
    name: "Pro",
    description:
      "Everything in Free, with unlimited AI suggestions through Fitnexx-managed provider keys.",
    price: "$3.99",
    note: "per month · account required",
    highlight: true,
    bullets: [
      "Unlimited server-powered AI exercise suggestions",
      "No provider account or personal API key required",
      "Prompts and responses are not stored by Fitnexx",
    ],
  },
];

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
          <SignalStrip />
          <FeaturesShowcase />
          <SectionPricing />
          <SectionMission />
          <SectionPrivacy />
          <SectionContact />
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
      minHeight="calc(100dvh - 64px)"
      borderBottomWidth={1}
      borderColor="$borderColor"
      paddingHorizontal={20}
      style={{ position: "relative", overflow: "hidden" }}
      $sm={{ minHeight: "auto", paddingHorizontal: 16 }}
    >
      <div
        className="site-grid"
        aria-hidden
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />
      <div
        className="pf-drift"
        aria-hidden
        style={{
          position: "absolute",
          top: "2%",
          right: "-8%",
          width: "min(56vw, 760px)",
          aspectRatio: "1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,.2), transparent 68%)",
          filter: "blur(46px)",
          pointerEvents: "none",
        }}
      />

      <HeroIntro>
        <XStack
          minHeight="calc(100dvh - 64px)"
          maxWidth={1180}
          width="100%"
          marginLeft="auto"
          marginRight="auto"
          paddingVertical={64}
          alignItems="center"
          gap={72}
          $md={{ gap: 40 }}
          $sm={{
            flexDirection: "column",
            alignItems: "stretch",
            paddingVertical: 56,
            gap: 48,
          }}
        >
          <YStack flex={1.08} minWidth={0} gap={24} alignItems="flex-start">
            <div data-hero-badge>
              <Badge label="Private by architecture" variant="primary" />
            </div>
            <div data-hero-heading style={{ overflow: "hidden" }}>
              <Heading
                className="text-balance"
                tag="h1"
                fontSize={68}
                lineHeight={68}
                fontWeight="800"
                color="$color"
                maxWidth={720}
                $md={{ fontSize: 56, lineHeight: 58 }}
                $sm={{ fontSize: 44, lineHeight: 46 }}
                $xxs={{ fontSize: 38, lineHeight: 41 }}
              >
                Your training data, finally working for you.
              </Heading>
            </div>
            <div data-hero-copy>
              <Text color="$muted" fontSize={18} lineHeight={28} maxWidth={560}>
                Log training and nutrition. See useful patterns. Keep the data
                on your device.
              </Text>
            </div>
            <div data-hero-ctas>
              <XStack flexWrap="wrap" gap={12}>
                <LinkButton href="/early-access" size="lg">
                  Get early access
                </LinkButton>
                <LinkButton href="/#features" size="lg" variant="outline">
                  Explore features
                </LinkButton>
              </XStack>
            </div>
          </YStack>

          <View
            data-hero-visual
            flex={0.92}
            minWidth={0}
            alignItems="center"
            justifyContent="center"
            $sm={{ width: "100%" }}
          >
            <HeroParallax>
              <View
                aria-hidden
                className="hero-phone-static"
                width="min(100%, 292px)"
                style={{
                  position: "relative",
                  pointerEvents: "none",
                  filter: "drop-shadow(0 40px 80px rgba(1,5,12,.55))",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "18% -14%",
                    borderRadius: 999,
                    background: "rgba(59,130,246,.18)",
                    filter: "blur(60px)",
                  }}
                />
                <PhoneFrame tab={0}>
                  <DashboardScreen />
                </PhoneFrame>
              </View>
            </HeroParallax>
          </View>
        </XStack>
      </HeroIntro>
    </View>
  );
}

function SignalStrip() {
  return (
    <View
      borderBottomWidth={1}
      borderColor="$borderColor"
      backgroundColor="$surface"
      paddingHorizontal={20}
    >
      <XStack
        maxWidth={1180}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        alignItems="stretch"
        $sm={{ flexDirection: "column" }}
      >
        <XStack
          flex={1.3}
          paddingVertical={28}
          paddingRight={32}
          alignItems="center"
          gap={12}
          borderRightWidth={1}
          borderColor="$borderColor"
          $sm={{ borderRightWidth: 0, borderBottomWidth: 1, paddingRight: 0 }}
        >
          <Zap size={18} color="#60a5fa" />
          <Text color="$muted" fontSize={14} lineHeight={21}>
            Analysis runs from the history you already own. AI is optional and
            explicit.
          </Text>
        </XStack>
        {signals.map((signal) => (
          <YStack
            key={signal.label}
            data-reveal="card"
            minWidth={152}
            padding={24}
            gap={3}
            borderRightWidth={1}
            borderColor="$borderColor"
            $sm={{ borderRightWidth: 0, borderBottomWidth: 1 }}
          >
            <Text
              color="$color"
              fontSize={23}
              fontWeight="800"
              letterSpacing={-0.6}
            >
              {signal.value}
            </Text>
            <Text className="mono-label" color="$subtle" fontSize={10}>
              {signal.label}
            </Text>
          </YStack>
        ))}
      </XStack>
    </View>
  );
}

function SectionPricing() {
  return (
    <View
      id="pricing"
      tag="section"
      backgroundColor="$background"
      borderBottomWidth={1}
      borderColor="$borderColor"
      paddingVertical={120}
      paddingHorizontal={20}
      $sm={{ paddingVertical: 72, paddingHorizontal: 16 }}
    >
      <YStack
        maxWidth={1180}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={48}
      >
        <YStack data-reveal maxWidth={720} gap={16}>
          <Text
            className="mono-label"
            color="$primary"
            fontSize={11}
            fontWeight="700"
          >
            Pricing
          </Text>
          <Heading
            className="text-balance"
            tag="h2"
            color="$color"
            fontSize={48}
            lineHeight={51}
            fontWeight="800"
            $sm={{ fontSize: 36, lineHeight: 40 }}
          >
            Start free. Pay only for simpler AI access.
          </Heading>
          <Text color="$muted" fontSize={17} lineHeight={27} maxWidth={630}>
            Core tracking and analytics stay free. Pro removes the need to
            manage your own AI provider account.
          </Text>
        </YStack>

        <XStack gap={20} alignItems="stretch" $sm={{ flexDirection: "column" }}>
          {tiers.map((tier, index) => (
            <Card
              key={tier.name}
              data-reveal="card"
              data-reveal-delay={`${index * 0.06}`}
              className="route-card"
              flex={1}
              gap={28}
              padding={32}
              borderColor={
                tier.highlight ? "rgba(59,130,246,0.5)" : "$borderColor"
              }
              backgroundColor={
                tier.highlight ? "rgba(59,130,246,0.07)" : "$card"
              }
            >
              <YStack gap={14}>
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  gap={12}
                >
                  <Text color="$color" fontSize={26} fontWeight="700">
                    {tier.name}
                  </Text>
                  {tier.highlight ? (
                    <Badge label="Managed AI" variant="primary" />
                  ) : null}
                </XStack>
                <Text color="$muted" fontSize={15} lineHeight={24}>
                  {tier.description}
                </Text>
                <YStack gap={3} marginTop={8}>
                  <Text
                    color="$color"
                    fontSize={40}
                    lineHeight={44}
                    fontWeight="700"
                  >
                    {tier.price}
                  </Text>
                  <Text color="$subtle" fontSize={13}>
                    {tier.note}
                  </Text>
                </YStack>
              </YStack>

              <YStack
                gap={18}
                borderTopWidth={1}
                borderColor="$borderColor"
                paddingTop={22}
              >
                <YStack gap={9}>
                  {tier.bullets.map((line) => (
                    <Text
                      key={line}
                      color="$color"
                      fontSize={14}
                      lineHeight={21}
                      style={{
                        display: "list-item",
                        listStyleType: "disc",
                        marginLeft: 18,
                      }}
                    >
                      {line}
                    </Text>
                  ))}
                </YStack>
                <LinkButton
                  href="/early-access"
                  variant={tier.highlight ? "primary" : "outline"}
                >
                  Get early access
                </LinkButton>
              </YStack>
            </Card>
          ))}
        </XStack>

        <YStack
          data-reveal
          tag="aside"
          gap={4}
          borderTopWidth={1}
          borderColor="rgba(251,191,36,0.35)"
          backgroundColor="rgba(251,191,36,0.05)"
          borderRadius={14}
          padding={20}
        >
          <Text color="$color" fontSize={15} fontWeight="700">
            Purchases are completed inside the Fitnexx app.
          </Text>
          <Text color="$muted" fontSize={14} lineHeight={22}>
            Pro is a monthly subscription purchased in the app. Prices are in
            USD before tax where applicable.
          </Text>
        </YStack>
      </YStack>
    </View>
  );
}

function SectionMission() {
  const principles = [
    {
      title: "Mission",
      body: "Give people clear tools to train and eat with intention: workouts they can repeat, macros they can trust, and body metrics they own.",
    },
    {
      title: "Vision",
      body: "A calm layer between real life and the numbers: local-first where it makes sense, transparent where the cloud helps, and free from opaque scoring or shadow profiles.",
    },
    {
      title: "Why privacy",
      body: "Performance and food data can reveal health, habits, location, and schedule. Fitnexx minimizes what leaves your device and sends AI context only when you explicitly ask.",
    },
  ];

  return (
    <View
      id="mission"
      tag="section"
      backgroundColor="$surface"
      borderBottomWidth={1}
      borderColor="$borderColor"
      paddingVertical={120}
      paddingHorizontal={20}
      $sm={{ paddingVertical: 72, paddingHorizontal: 16 }}
    >
      <YStack
        maxWidth={1180}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={48}
      >
        <YStack data-reveal maxWidth={760} gap={16}>
          <Text
            className="mono-label"
            color="$primary"
            fontSize={11}
            fontWeight="700"
          >
            Mission and vision
          </Text>
          <Heading
            className="text-balance"
            tag="h2"
            color="$color"
            fontSize={48}
            lineHeight={51}
            fontWeight="800"
            $sm={{ fontSize: 36, lineHeight: 40 }}
          >
            Progress without surveillance.
          </Heading>
          <Text color="$muted" fontSize={17} lineHeight={27} maxWidth={650}>
            Fitnexx is built for fast logging in the gym, practical nutrition,
            and decisions grounded in a history that remains yours.
          </Text>
        </YStack>

        <XStack gap={16} alignItems="stretch" $sm={{ flexDirection: "column" }}>
          {principles.map((principle, index) => (
            <Card
              key={principle.title}
              data-reveal="card"
              data-reveal-delay={`${index * 0.06}`}
              className="route-card"
              flex={1}
              minHeight={230}
              gap={20}
              justifyContent="space-between"
            >
              <Text
                className="mono-label"
                color="$primary"
                fontSize={11}
                fontWeight="700"
              >
                0{index + 1}
              </Text>
              <YStack gap={10}>
                <Text color="$color" fontSize={22} fontWeight="700">
                  {principle.title}
                </Text>
                <Text color="$muted" fontSize={14} lineHeight={23}>
                  {principle.body}
                </Text>
              </YStack>
            </Card>
          ))}
        </XStack>
      </YStack>
    </View>
  );
}

function SectionPrivacy() {
  const items = [
    {
      icon: Database,
      title: "Local by default",
      body: "Workouts, meals, and measurements stay on your device.",
    },
    {
      icon: Brain,
      title: "AI only on request",
      body: "Cloud AI receives context only after you deliberately tap Ask AI.",
    },
    {
      icon: LockKeyhole,
      title: "No shadow profile",
      body: "Fitnexx collects what improves training, not what improves ad targeting.",
    },
  ];

  return (
    <View
      tag="section"
      aria-label="Privacy"
      backgroundColor="$background"
      paddingVertical={120}
      paddingHorizontal={20}
      $sm={{ paddingVertical: 72, paddingHorizontal: 16 }}
    >
      <YStack
        maxWidth={1180}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={48}
      >
        <YStack data-reveal maxWidth={720} gap={16}>
          <XStack alignItems="center" gap={10}>
            <ShieldCheck size={18} color="#60a5fa" />
            <Text
              className="mono-label"
              color="$primary"
              fontSize={11}
              fontWeight="700"
            >
              Privacy model
            </Text>
          </XStack>
          <Heading
            className="text-balance"
            tag="h2"
            fontSize={48}
            lineHeight={51}
            fontWeight="800"
            color="$color"
            $sm={{ fontSize: 36, lineHeight: 40 }}
          >
            Useful insight without the surveillance business model.
          </Heading>
          <Text color="$muted" fontSize={17} lineHeight={27} maxWidth={630}>
            Progress should come from your effort, not from trading away your
            personal history.
          </Text>
        </YStack>

        <XStack gap={16} alignItems="stretch" $sm={{ flexDirection: "column" }}>
          {items.map(({ icon: Icon, title, body }, index) => (
            <YStack
              key={title}
              data-reveal
              data-reveal-delay={`${index * 0.06}`}
              flex={1}
            >
              <SpringCard>
                <Card
                  minHeight={230}
                  gap={28}
                  justifyContent="space-between"
                  height="100%"
                >
                  <View
                    width={44}
                    height={44}
                    borderRadius={14}
                    backgroundColor="$primaryMuted"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon size={20} color="#60a5fa" />
                  </View>
                  <YStack gap={8}>
                    <Text color="$color" fontSize={20} fontWeight="700">
                      {title}
                    </Text>
                    <Text color="$muted" fontSize={14} lineHeight={22}>
                      {body}
                    </Text>
                  </YStack>
                </Card>
              </SpringCard>
            </YStack>
          ))}
        </XStack>
      </YStack>
    </View>
  );
}

function SectionContact() {
  return (
    <View
      id="contact"
      tag="section"
      className="route-hero"
      paddingVertical={120}
      paddingHorizontal={20}
      $sm={{ paddingVertical: 72, paddingHorizontal: 16 }}
    >
      <View
        maxWidth={1120}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={80}
        flexDirection="row"
        alignItems="flex-start"
        $sm={{ flexDirection: "column", gap: 40 }}
      >
        <YStack
          data-reveal="left"
          gap={24}
          flex={1}
          paddingTop={28}
          $sm={{ paddingTop: 0 }}
        >
          <Text
            className="mono-label"
            color="$primary"
            fontSize={11}
            fontWeight="700"
          >
            Contact
          </Text>
          <Heading
            className="text-balance"
            tag="h2"
            fontSize={48}
            lineHeight={51}
            fontWeight="800"
            color="$color"
            maxWidth={480}
            $sm={{ fontSize: 36, lineHeight: 40 }}
          >
            Talk to the people building Fitnexx.
          </Heading>
          <Text color="$muted" fontSize={16} lineHeight={26} maxWidth={460}>
            Send product feedback, general questions, or privacy requests. For
            GDPR-related requests, include your account email so we can verify
            your identity.
          </Text>
        </YStack>
        <Card
          data-reveal="card"
          className="route-card"
          padding={36}
          flexBasis="52%"
          width="100%"
          maxWidth={560}
          borderColor="rgba(59,130,246,0.28)"
          backgroundColor="rgba(13,18,26,0.92)"
          $sm={{ padding: 22, maxWidth: "100%", flexBasis: "100%" }}
        >
          <ContactForm />
        </Card>
      </View>
    </View>
  );
}
