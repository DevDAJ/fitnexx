import { Badge, Card, Heading, Text, View, YStack } from "@fitnexx/ui";
import type { Metadata } from "next";
import { PageIntro } from "@/components/home/motion";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { createMetadata } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description:
    "Free workout, meal, and body tracking. One-time Pro unlock for the full analytics dashboard. No subscription required.",
  path: "/pricing",
});

const tiers: {
  name: string;
  description: string;
  highlight: boolean;
  badge?: string;
  bullets: string[];
  price?: string;
  priceNote?: string;
}[] = [
  {
    name: "Free",
    description:
      "Everything you need to train: logging, meal tracking, body measurements, and gym equipment on file.",
    highlight: false,
    price: "Free",
    bullets: [
      "Workout logging: exercises, sets, reps, weight, automatic PRs and volume",
      "Workout templates and full session history, per-exercise history",
      "Meal tracking with photos: calorie and macro targets, daily totals, saved meals",
      "Body measurements: weight, circumference, activity level, entry reminders (kg or lbs)",
      "Gym detection and equipment availability checks while you log",
      "Rule-based exercise suggestions that respect your gym's equipment",
    ],
  },
  {
    name: "Pro",
    description:
      "A one-time unlock of the analytics engine. Everything computes on your device from data you already log.",
    highlight: true,
    badge: "Analytics unlock",
    price: "$4.99",
    priceNote: "One-time payment · no subscription · no account",
    bullets: [
      "Everything in Free",
      "Full analytics dashboard: PR trends, volume density, muscle balance",
      "Muscle trends and per-muscle achievements",
      "Intensity evolution, weekly rhythm, and top exercises",
      "Plateau detection, injury-risk scoring, and training timeline tiers",
      "Activity heatmap of consistency",
    ],
  },
];

export default function PricingPage() {
  return (
    <PageIntro>
      <View
        style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      >
        <HomepageNavbar />

        <View flex={1} tag="main">
          <View
            borderBottomWidth={1}
            borderColor="$borderColor"
            backgroundColor="$surface"
            paddingVertical={48}
            paddingHorizontal={16}
            $sm={{ paddingVertical: 64 }}
          >
            <YStack
              maxWidth={1024}
              width="100%"
              marginLeft="auto"
              marginRight="auto"
              gap={12}
            >
              <Heading
                fontSize={36}
                fontWeight="800"
                color="$color"
                $sm={{ fontSize: 44 }}
              >
                Pricing
              </Heading>
              <Text color="$muted" fontSize={16} lineHeight={24} maxWidth={640}>
                Two ways to use Fitnexx. Free covers logging, meals, body
                measurements, and gym equipment. Pro adds the advanced analytics
                dashboard as a one-time unlock, still on your device.
              </Text>
            </YStack>
          </View>

          <View
            paddingVertical={48}
            paddingHorizontal={16}
            $sm={{ paddingVertical: 64 }}
          >
            <YStack
              maxWidth={1024}
              width="100%"
              marginLeft="auto"
              marginRight="auto"
              gap={24}
            >
              <View
                flexDirection="row"
                flexWrap="wrap"
                gap={24}
                alignItems="flex-start"
              >
                {tiers.map((tier) => (
                  <Card
                    key={tier.name}
                    flexBasis="100%"
                    $sm={{ flexBasis: "calc(50% - 12px)" as any }}
                    gap={16}
                    flexGrow={1}
                    borderColor={
                      tier.highlight ? "rgba(59,130,246,0.5)" : "$borderColor"
                    }
                    borderWidth={tier.highlight ? 2 : 1}
                  >
                    <YStack gap={8}>
                      <XStackRow>
                        <Text color="$color" fontSize={24} fontWeight="700">
                          {tier.name}
                        </Text>
                        {tier.highlight ? (
                          <Badge
                            label={tier.badge ?? "Pro"}
                            variant="primary"
                          />
                        ) : null}
                      </XStackRow>
                      <Text color="$muted" fontSize={15} lineHeight={23}>
                        {tier.description}
                      </Text>
                      {tier.price ? (
                        <YStack gap={4} marginTop={8}>
                          <Text color="$color" fontSize={30} fontWeight="700">
                            {tier.price}
                            <Text color="$muted" fontSize={15} fontWeight="400">
                              {tier.priceNote && tier.name !== "Free"
                                ? " once"
                                : ""}
                            </Text>
                          </Text>
                          {tier.priceNote ? (
                            <Text color="$muted" fontSize={14}>
                              {tier.priceNote}
                            </Text>
                          ) : null}
                        </YStack>
                      ) : (
                        <Text
                          color="$color"
                          fontSize={30}
                          fontWeight="700"
                          marginTop={8}
                        >
                          Free
                        </Text>
                      )}
                    </YStack>

                    <YStack
                      gap={16}
                      borderTopWidth={1}
                      borderColor="$borderColor"
                      paddingTop={16}
                    >
                      <YStack gap={8}>
                        {tier.bullets.map((line) => (
                          <Text
                            key={line}
                            color="$color"
                            fontSize={14}
                            lineHeight={20}
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
                        href="/coming-soon"
                        variant={tier.highlight ? "primary" : "outline"}
                      >
                        {tier.highlight ? "Go Pro in app" : "Get started"}
                      </LinkButton>
                    </YStack>
                  </Card>
                ))}
              </View>

              <Text color="$subtle" fontSize={13} textAlign="center">
                Prices in USD before tax, where applicable. Pro is a one-time
                unlock purchased in the app; no subscription, no account
                required.
              </Text>
            </YStack>
          </View>

          <View
            paddingHorizontal={16}
            paddingBottom={64}
            $sm={{ paddingBottom: 96 }}
          >
            <View
              maxWidth={1024}
              width="100%"
              marginLeft="auto"
              marginRight="auto"
              borderWidth={1}
              borderColor="rgba(59,130,246,0.3)"
              backgroundColor="rgba(59,130,246,0.06)"
              borderRadius={14}
              padding={24}
              flexDirection="row"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="space-between"
              gap={16}
            >
              <YStack gap={4} flex={1} minWidth={240}>
                <Text
                  color="$color"
                  fontSize={20}
                  fontWeight="700"
                  $sm={{ fontSize: 22 }}
                >
                  Questions about plans?
                </Text>
                <Text color="$muted" fontSize={15}>
                  Explore feature details first, then pick a plan inside the
                  app.
                </Text>
              </YStack>
              <View flexDirection="row" flexWrap="wrap" gap={12} flexShrink={0}>
                <LinkButton href="/features" variant="outline">
                  Features
                </LinkButton>
                <LinkButton href="/">Home</LinkButton>
              </View>
            </View>
          </View>
        </View>

        <SiteFooter />
      </View>
    </PageIntro>
  );
}

function XStackRow({ children }: { children: React.ReactNode }) {
  return (
    <View flexDirection="row" flexWrap="wrap" alignItems="center" gap={8}>
      {children}
    </View>
  );
}
