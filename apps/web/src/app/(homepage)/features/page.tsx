import { Card, Heading, Text, View, YStack } from "@fitnexx/ui";
import type { Metadata } from "next";
import { PageIntro } from "@/components/home/motion";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { features } from "@/lib/features-content";
import { createMetadata } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Features",
  description:
    "Workout logging, meal and body tracking, gym equipment, local analytics, and optional AI exercise suggestions.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <PageIntro>
      <View
        style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      >
        <HomepageNavbar />

        <View flex={1} tag="main">
          <View
            className="route-hero"
            borderBottomWidth={1}
            borderColor="$borderColor"
            backgroundColor="$surface"
            paddingVertical={64}
            paddingHorizontal={16}
            $sm={{ paddingVertical: 48 }}
          >
            <YStack
              maxWidth={1024}
              width="100%"
              marginLeft="auto"
              marginRight="auto"
              gap={12}
            >
              <Heading
                fontSize={44}
                fontWeight="800"
                color="$color"
                $sm={{ fontSize: 36 }}
              >
                Features
              </Heading>
              <Text color="$muted" fontSize={16} lineHeight={24} maxWidth={640}>
                Workout logging, templates, meal tracking, body measurements,
                gym equipment on file, and analytics computed from your own
                data. Tracking stays local. Cloud AI runs only when you tap Ask
                AI.
              </Text>
            </YStack>
          </View>

          <View
            paddingVertical={64}
            paddingHorizontal={16}
            $sm={{ paddingVertical: 48 }}
          >
            <div className="feature-grid">
              {features.map(({ icon: Icon, title, description, details }) => (
                <Card
                  key={title}
                  className="route-card"
                  gap={16}
                  flexDirection="row"
                  alignItems="flex-start"
                  $xs={{ flexDirection: "column" }}
                >
                  <View
                    width={48}
                    height={48}
                    borderRadius={12}
                    backgroundColor="rgba(59,130,246,0.12)"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Icon size={24} color="#3b82f6" />
                  </View>
                  <YStack gap={8} flex={1}>
                    <Text
                      color="$color"
                      fontSize={22}
                      fontWeight="700"
                      $sm={{ fontSize: 20 }}
                    >
                      {title}
                    </Text>
                    <Text color="$muted" fontSize={15} lineHeight={23}>
                      {description}
                    </Text>
                    <Text
                      color="$muted"
                      fontSize={14}
                      lineHeight={22}
                      borderTopWidth={1}
                      borderColor="$borderColor"
                      paddingTop={16}
                      marginTop={4}
                    >
                      {details}
                    </Text>
                  </YStack>
                </Card>
              ))}
            </div>
          </View>

          <View
            paddingHorizontal={16}
            paddingBottom={96}
            $sm={{ paddingBottom: 64 }}
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
                  fontSize={22}
                  fontWeight="700"
                  $sm={{ fontSize: 20 }}
                >
                  Ready to try Fitnexx?
                </Text>
                <Text color="$muted" fontSize={15}>
                  Start from the home page or open the app when you&apos;re set.
                </Text>
              </YStack>
              <XStackWrap>
                <LinkButton href="/" variant="outline">
                  Back to home
                </LinkButton>
                <LinkButton href="/coming-soon">Get started</LinkButton>
              </XStackWrap>
            </View>
          </View>
        </View>

        <SiteFooter />
      </View>
    </PageIntro>
  );
}

function XStackWrap({ children }: { children: React.ReactNode }) {
  return (
    <View flexDirection="row" flexWrap="wrap" gap={12} flexShrink={0}>
      {children}
    </View>
  );
}
