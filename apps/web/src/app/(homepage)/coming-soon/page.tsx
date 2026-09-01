import { Heading, Text, View, YStack } from "@fitnexx/ui";
import type { Metadata } from "next";
import { PageIntro } from "@/components/home/motion";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { InterestListSignup } from "@/components/interest-list-signup";
import { SiteFooter } from "@/components/site-footer";
import { LinkButton } from "@/components/ui/link";
import { getPrisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/site";

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
    totalInterests = await getPrisma().interestListEntry.count();
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
          flex={1}
          tag="main"
          alignItems="center"
          justifyContent="center"
          paddingVertical={64}
          paddingHorizontal={16}
        >
          <YStack maxWidth={560} width="100%" gap={24} alignItems="center">
            <Heading
              fontSize={36}
              fontWeight="800"
              color="$color"
              $sm={{ fontSize: 44 }}
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
              We&apos;re not quite ready for new signups. Leave your name (and
              optionally your email) and we&apos;ll let you know when you can
              jump in.
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
              <InterestListSignup />
              <LinkButton href="/" variant="outline">
                Back to home
              </LinkButton>
            </XStackWrap>
          </YStack>
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
