import { Badge, Card, Heading, Text, View } from "@fitnexx/ui";
import type { Metadata } from "next";
import { PageIntro } from "@/components/home/motion";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { InterestListSignup } from "@/components/interest-list-signup";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { createMetadata, siteConfig } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = createMetadata({
  title: "Coming soon",
  description:
    "Fitnexx isn’t open to everyone yet. Join the interest list to hear when you can get started.",
  path: "/coming-soon",
});

export const dynamic = "force-dynamic";

export default async function ComingSoonPage() {
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
          paddingVertical={64}
          paddingHorizontal={16}
        >
          <Card
            className="route-card"
            maxWidth={600}
            width="100%"
            gap={24}
            alignItems="center"
            padding={40}
            $sm={{ padding: 24 }}
          >
            <Badge label="Early access" variant="primary" />
            <Heading
              fontSize={44}
              fontWeight="800"
              color="$color"
              $sm={{ fontSize: 36 }}
              textAlign="center"
            >
              Coming soon
            </Heading>
            <Text
              color="$muted"
              fontSize={16}
              lineHeight={26}
              textAlign="center"
            >
              The Android app is available for early access as a direct APK.
              Google Play is coming soon, and an iOS release will depend on
              demand. Join the interest list for release updates.
            </Text>
            {totalInterests !== null ? (
              <Text color="$subtle" fontSize={14} textAlign="center">
                {totalInterests === 0
                  ? "Be the first on the interest list."
                  : totalInterests === 1
                    ? "1 person on the interest list so far."
                    : `${totalInterests.toLocaleString()} people on the interest list so far.`}
              </Text>
            ) : null}
            <XStackWrap>
              <LinkButton href={siteConfig.apkDownloadUrl}>
                Download Android APK
              </LinkButton>
              <InterestListSignup />
              <LinkButton href="/" variant="outline">
                Back to home
              </LinkButton>
            </XStackWrap>
          </Card>
        </View>

        <SiteFooter />
      </View>
    </PageIntro>
  );
}

function XStackWrap({ children }: { children: React.ReactNode }) {
  return (
    <View
      flexDirection="row"
      flexWrap="wrap"
      gap={12}
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </View>
  );
}
