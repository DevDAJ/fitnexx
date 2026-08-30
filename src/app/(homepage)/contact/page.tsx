import { Heading, Text, View, YStack } from "@fitnexx/ui";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
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
    <View
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <HomepageNavbar />
      <View
        flex={1}
        tag="main"
        paddingVertical={40}
        paddingHorizontal={16}
        $sm={{ paddingVertical: 56 }}
      >
        <YStack
          maxWidth={560}
          width="100%"
          marginLeft="auto"
          marginRight="auto"
          gap={24}
        >
          <YStack gap={8}>
            <Heading
              fontSize={28}
              fontWeight="800"
              color="$color"
              $sm={{ fontSize: 32 }}
            >
              Contact
            </Heading>
            <Text color="$muted" fontSize={15} lineHeight={24}>
              Send general questions or feedback about Fitnexx. For GDPR-related
              requests, include your account email so we can verify your
              identity, subject to validation.
            </Text>
          </YStack>
          <ContactForm />
        </YStack>
      </View>
      <SiteFooter />
    </View>
  );
}
