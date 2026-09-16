import { Card, Text, View, YStack } from "@fitnexx/ui";
import { features } from "@/lib/features-content";

export function FeatureGrid() {
  return (
    <div className="feature-grid">
      {features.map(({ icon: Icon, title, description, details }, index) => (
        <div
          key={title}
          style={index === 0 ? { gridColumn: "1 / -1" } : undefined}
        >
          <Card
            className="route-card"
            minHeight={index === 0 ? 250 : 290}
            padding={index === 0 ? 32 : 24}
            gap={index === 0 ? 48 : 24}
            flexDirection={index === 0 ? "row" : "column"}
            alignItems="flex-start"
            justifyContent="space-between"
            backgroundColor={index === 0 ? "rgba(59,130,246,0.07)" : "$card"}
            borderColor={index === 0 ? "rgba(59,130,246,0.34)" : "$borderColor"}
            $sm={{
              minHeight: 0,
              padding: 22,
              gap: 20,
              flexDirection: "column",
            }}
          >
            <View
              width={44}
              height={44}
              borderRadius={12}
              backgroundColor="rgba(59,130,246,0.12)"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Icon size={22} color="#60a5fa" />
            </View>
            <YStack gap={12} flex={1} maxWidth={index === 0 ? 760 : undefined}>
              <Text color="$color" fontSize={24} fontWeight="700">
                {title}
              </Text>
              <Text color="$muted" fontSize={15} lineHeight={24}>
                {description}
              </Text>
              <Text
                color="$subtle"
                fontSize={13}
                lineHeight={21}
                borderTopWidth={1}
                borderColor="$borderColor"
                paddingTop={16}
              >
                {details}
              </Text>
            </YStack>
          </Card>
        </div>
      ))}
    </div>
  );
}
