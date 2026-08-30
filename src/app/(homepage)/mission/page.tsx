import { Card, Heading, Text, View, YStack } from "@fitnexx/ui";
import type { Metadata } from "next";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { createMetadata } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Mission & vision",
  description:
    "Why Fitnexx exists, where we are going, and why privacy is built in, not bolted on.",
  path: "/mission",
});

export default function MissionPage() {
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
            maxWidth={768}
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
              Mission &amp; vision
            </Heading>
            <Text color="$muted" fontSize={16} lineHeight={24}>
              Training and nutrition data are among the most personal signals
              you can log. Fitnexx exists to make progress legible without
              turning you into a product.
            </Text>
          </YStack>
        </View>

        <MissionSection id="mission" title="Mission">
          <Text color="$muted" fontSize={15} lineHeight={24}>
            Give people clear tools to train and eat with intention: workouts
            you can repeat, macros you can trust, and body metrics you own,
            while defaulting to data minimization and honest limits on what
            leaves your device or account.
          </Text>
          <Text color="$muted" fontSize={15} lineHeight={24}>
            We build for the lifter and the cook: fast logging in the gym,
            practical nutrition without shame, and features that don&apos;t
            depend on selling your story to advertisers.
          </Text>
        </MissionSection>

        <MissionSection id="vision" title="Vision">
          <Text color="$muted" fontSize={15} lineHeight={24}>
            A future where “fitness app” doesn&apos;t mean opaque scoring,
            endless notifications, or shadow profiles built from your plate and
            your PRs. Fitnexx aims to be the calm layer between your real life
            and your numbers, local-first where it makes sense, transparent
            where the cloud helps, and always bound to policies you can read and
            rights you can exercise.
          </Text>
        </MissionSection>

        <MissionSection id="why-privacy" title="Why privacy">
          <Text color="$muted" fontSize={15} lineHeight={24}>
            Performance and food data can reveal health, habits, location, and
            schedule. If we treat that casually, we fail you before you fail a
            rep. Privacy at Fitnexx means{" "}
            <Text color="$color" fontWeight="600">
              data minimization
            </Text>
            : we collect what serves your training and nutrition, not a dossier
            of your life. It means{" "}
            <Text color="$color" fontWeight="600">
              control
            </Text>
            : clear settings and documents instead of dark patterns. And for
            OCR, it means we don&apos;t save personal information to “improve
            the model” in ways that turn your photos into someone else&apos;s ad
            graph.
          </Text>
          <Text color="$muted" fontSize={15} lineHeight={24}>
            When we add AI (gym suggestions, meal overviews) the goal is utility
            on your terms, with tiering and disclosures you see on Pricing, not
            hidden profiling. Laws and platforms change; our baseline is that
            trust has to compound like volume: slowly, deliberately, visibly.
          </Text>

          <Card
            marginTop={16}
            gap={16}
            borderWidth={1}
            borderColor="rgba(59,130,246,0.25)"
            backgroundColor="rgba(59,130,246,0.06)"
          >
            <Text color="$color" fontSize={17} fontWeight="700">
              Privacy &amp; policies
            </Text>
            <Text color="$muted" fontSize={14} lineHeight={22}>
              Read how we process data and cookies, or reach out before you roll
              in hard on a subscription.
            </Text>
            <View flexDirection="row" flexWrap="wrap" gap={12}>
              <LinkButton href="/privacy-policy">Privacy Policy</LinkButton>
              <LinkButton href="/cookie-policy" variant="outline">
                Cookie Policy
              </LinkButton>
              <LinkButton href="/contact" variant="outline">
                Contact
              </LinkButton>
              <LinkButton href="/pricing" variant="secondary">
                Pricing
              </LinkButton>
            </View>
            <LinkButton href="/coming-soon">Get started</LinkButton>
          </Card>
        </MissionSection>
      </View>

      <SiteFooter />
    </View>
  );
}

function MissionSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      id={id}
      borderBottomWidth={1}
      borderColor="$borderColor"
      paddingVertical={48}
      paddingHorizontal={16}
      $sm={{ paddingVertical: 64 }}
      style={{ scrollMarginTop: 80 }}
    >
      <YStack
        maxWidth={768}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={16}
      >
        <Heading
          fontSize={24}
          fontWeight="700"
          color="$color"
          $sm={{ fontSize: 28 }}
        >
          {title}
        </Heading>
        {children}
      </YStack>
    </View>
  );
}
