import { Badge, Card, Heading, Text, View, YStack } from "@fitnexx/ui";
import type { Metadata } from "next";
import { PageIntro } from "@/components/home/motion";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { InterestListSignup } from "@/components/interest-list-signup";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { createMetadata, siteConfig } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = createMetadata({
  title: "Early access",
  description:
    "Download the Fitnexx Android APK or join the interest list for release updates.",
  path: "/early-access",
});

export const dynamic = "force-dynamic";

export default async function EarlyAccessPage() {
  let totalInterests: number | null = null;
  try {
    const { count, error } = await getSupabaseAdmin()
      .from("interest_list_entry")
      .select("id", { count: "exact", head: true });
    if (error) throw error;
    totalInterests = count;
  } catch {
    totalInterests = null;
  }

  return (
    <PageIntro>
      <View
        style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      >
        <HomepageNavbar />

        <View
          className="route-hero"
          flex={1}
          tag="main"
          alignItems="center"
          justifyContent="center"
          paddingVertical={80}
          paddingHorizontal={16}
          $sm={{ paddingVertical: 48 }}
        >
          <View
            maxWidth={1120}
            width="100%"
            flexDirection="row"
            alignItems="stretch"
            gap={64}
            $sm={{ flexDirection: "column", gap: 36 }}
          >
            <YStack
              flex={1}
              justifyContent="center"
              alignItems="flex-start"
              gap={24}
            >
              <Badge label="Early access" variant="primary" />
              <Heading
                fontSize={64}
                lineHeight={66}
                fontWeight="800"
                color="$color"
                maxWidth={520}
                $sm={{ fontSize: 44, lineHeight: 48 }}
              >
                Train with Fitnexx today.
              </Heading>
              <Text color="$muted" fontSize={17} lineHeight={27} maxWidth={500}>
                The Android app is available for early access as a direct APK.
                Google Play is coming soon, and an iOS release will depend on
                demand. Join the interest list for release updates.
              </Text>
              {totalInterests !== null ? (
                <Text
                  color="$subtle"
                  fontSize={13}
                  borderTopWidth={1}
                  borderColor="$borderColor"
                  paddingTop={16}
                >
                  {totalInterests === 0
                    ? "Be the first on the interest list."
                    : totalInterests === 1
                      ? "1 person on the interest list so far."
                      : `${totalInterests.toLocaleString("en-US")} people on the interest list so far.`}
                </Text>
              ) : null}
            </YStack>
            <Card
              className="route-card"
              flexBasis="42%"
              width="100%"
              maxWidth={460}
              gap={28}
              justifyContent="space-between"
              padding={36}
              backgroundColor="rgba(59,130,246,0.07)"
              borderColor="rgba(59,130,246,0.32)"
              $sm={{ maxWidth: "100%", flexBasis: "100%", padding: 24 }}
            >
              <YStack gap={8}>
                <Text color="$color" fontSize={24} fontWeight="700">
                  Choose your route in.
                </Text>
                <Text color="$muted" fontSize={14} lineHeight={22}>
                  Install the Android build now, or leave your details for
                  release updates.
                </Text>
              </YStack>
              <YStack gap={12} alignItems="stretch">
                <LinkButton href={siteConfig.apkDownloadUrl}>
                  Download Android APK
                </LinkButton>
                <InterestListSignup />
                <LinkButton href="/" variant="outline">
                  Back to home
                </LinkButton>
              </YStack>
            </Card>
          </View>
        </View>

        <SiteFooter />
      </View>
    </PageIntro>
  );
}
