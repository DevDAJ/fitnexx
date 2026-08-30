import { Badge, Card, Heading, Text, View, YStack } from "@fitnexx/ui";
import type { Metadata } from "next";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { foodScansPerDay } from "@/lib/food-scan-limits";
import { proSubscriptionUsd } from "@/lib/pro-pricing";
import { createMetadata } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description:
    "Pro from $9.99/mo or $110/yr USD. Free body measurements, OCR limits, gym AI and meal overview on Pro.",
  path: "/pricing",
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
              Two ways to train with Fitnexx. Pro adds more OCR scans, AI
              workout suggestions when you lift at cataloged gyms, and a daily
              meal overview alongside the same privacy baseline.
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
                  $sm={{ flexBasis: "calc(50% - 12px)" }}
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
                        <Badge label={tier.badge ?? "Pro"} variant="primary" />
                      ) : null}
                    </XStackRow>
                    <Text color="$muted" fontSize={15} lineHeight={23}>
                      {tier.description}
                    </Text>
                    {tier.listPriceUsd ? (
                      <YStack gap={4} marginTop={8}>
                        <Text color="$color" fontSize={30} fontWeight="700">
                          {usdFormatter.format(tier.listPriceUsd.monthly)}
                          <Text color="$muted" fontSize={15} fontWeight="400">
                            {" "}
                            / month
                          </Text>
                        </Text>
                        <Text color="$muted" fontSize={14}>
                          {usdFormatter.format(tier.listPriceUsd.yearly)} / year
                          billed annually
                        </Text>
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
              Listed prices USD before tax. Taxes, currency conversion, or
              regional offers may appear at checkout in the app. Premium AI may
              vary by platform; OCR resets daily in your timezone.
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
                Explore feature details first, then pick a plan inside the app.
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
  );
}

function XStackRow({ children }: { children: React.ReactNode }) {
  return (
    <View flexDirection="row" flexWrap="wrap" alignItems="center" gap={8}>
      {children}
    </View>
  );
}
