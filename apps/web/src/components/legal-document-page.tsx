import { Heading, Text, View, YStack } from "@fitnexx/ui";
import type { ReactNode } from "react";
import { HomepageNavbar } from "@/components/homepage-navbar";
import { SiteFooter } from "@/components/site-footer";

type LegalDocumentPageProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalDocumentPage({
  title,
  lastUpdated,
  children,
}: LegalDocumentPageProps) {
  return (
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
          className="legal"
          tag="article"
          maxWidth={680}
          width="100%"
          marginLeft="auto"
          marginRight="auto"
          gap={16}
        >
          <YStack
            gap={8}
            borderLeftWidth={2}
            borderColor="rgba(59,130,246,0.4)"
            paddingLeft={20}
          >
            <Heading
              tag="h1"
              fontSize={32}
              fontWeight="800"
              color="$color"
              $sm={{ fontSize: 28 }}
            >
              {title}
            </Heading>
            <Text color="$subtle" fontSize={12} fontStyle="normal">
              Last updated: {lastUpdated}
            </Text>
          </YStack>
          {children}
        </YStack>
      </View>
      <SiteFooter />
    </View>
  );
}
