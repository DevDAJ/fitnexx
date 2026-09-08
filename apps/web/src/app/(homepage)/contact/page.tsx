import { Card, Heading, Text, View, YStack } from "@fitnexx/ui";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/home/motion";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";
import { createMetadata } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Reach the Fitnexx team: questions, feedback, and privacy requests.",
  path: "/contact",
});

export default function ContactPage() {
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
          paddingVertical={56}
          paddingHorizontal={16}
          $sm={{ paddingVertical: 40 }}
        >
          <YStack
            maxWidth={960}
            width="100%"
            marginLeft="auto"
            marginRight="auto"
            gap={48}
            flexDirection="row"
            alignItems="center"
            $sm={{ flexDirection: "column", alignItems: "stretch", gap: 24 }}
          >
            <YStack gap={12} flex={1}>
              <Heading
                fontSize={32}
                fontWeight="800"
                color="$color"
                $sm={{ fontSize: 28 }}
              >
                Contact
              </Heading>
              <Text color="$muted" fontSize={15} lineHeight={24}>
                Send general questions or feedback about Fitnexx. For
                GDPR-related requests, include your account email so we can
                verify your identity, subject to validation.
              </Text>
            </YStack>
            <Card
              className="route-card"
              padding={28}
              flex={1}
              width="100%"
              maxWidth={520}
              $sm={{ padding: 20, maxWidth: "100%" }}
            >
              <ContactForm />
            </Card>
          </YStack>
        </View>
        <SiteFooter />
      </View>
    </PageIntro>
  );
}
