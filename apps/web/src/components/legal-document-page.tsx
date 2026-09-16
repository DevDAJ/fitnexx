import { Heading, Text, View, YStack } from "@fitnexx/ui";
import type { ReactNode } from "react";
import { PageIntro } from "@/components/home/motion";
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
    <PageIntro>
      <View
        style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      >
        <HomepageNavbar />
        <View
          className="route-hero"
          flex={1}
          tag="main"
          paddingVertical={72}
          paddingHorizontal={16}
          $sm={{ paddingVertical: 48 }}
        >
          <View
            maxWidth={1120}
            width="100%"
            marginLeft="auto"
            marginRight="auto"
            flexDirection="row"
            alignItems="flex-start"
            gap={88}
            $sm={{ flexDirection: "column", gap: 40 }}
          >
            <YStack width={280} flexShrink={0} gap={20} $sm={{ width: "100%" }}>
              <Heading
                tag="h1"
                fontSize={42}
                lineHeight={46}
                fontWeight="800"
                color="$color"
                $sm={{ fontSize: 34, lineHeight: 38 }}
              >
                {title}
              </Heading>
              <YStack
                gap={6}
                borderTopWidth={1}
                borderColor="$borderColor"
                paddingTop={16}
              >
                <Text color="$subtle" fontSize={12} fontStyle="normal">
                  Last updated
                </Text>
                <Text color="$color" fontSize={14} fontWeight="600">
                  {lastUpdated}
                </Text>
              </YStack>
            </YStack>
            <YStack
              className="legal"
              tag="article"
              maxWidth={720}
              width="100%"
              gap={18}
              padding={32}
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius={18}
              backgroundColor="rgba(14,14,14,0.72)"
              $sm={{ padding: 20 }}
            >
              {children}
            </YStack>
          </View>
        </View>
        <SiteFooter />
      </View>
    </PageIntro>
  );
}
