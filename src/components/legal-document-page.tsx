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
      <View flex={1} tag="main" paddingVertical={40} paddingHorizontal={16}>
        <YStack
          className="legal"
          tag="article"
          maxWidth={768}
          width="100%"
          marginLeft="auto"
          marginRight="auto"
          gap={20}
        >
          <YStack gap={8}>
            <Heading tag="h1" fontSize={28} fontWeight="800" color="$color">
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
