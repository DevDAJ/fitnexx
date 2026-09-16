import { Badge, Card, Heading, Text, View, XStack, YStack } from "@fitnexx/ui";
import {
  Activity,
  Dumbbell,
  Settings,
  TrendingUp,
  User,
  Utensils,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LinkButton } from "@/components/ui/link";

export default function AppHome() {
  return (
    <View
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      backgroundColor="$background"
    >
      <XStack
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="$borderColor"
        backgroundColor="$surface"
        paddingVertical={12}
        paddingHorizontal={16}
        top={0}
        zIndex={20}
        style={{ position: "sticky" }}
      >
        <BrandLogo />
        <View
          width={32}
          height={32}
          borderRadius={16}
          backgroundColor="rgba(59,130,246,0.15)"
          alignItems="center"
          justifyContent="center"
        >
          <User size={15} color="#60a5fa" />
        </View>
      </XStack>

      <View
        flex={1}
        paddingVertical={56}
        paddingHorizontal={16}
        $sm={{ paddingVertical: 32 }}
      >
        <YStack
          maxWidth={1160}
          width="100%"
          marginLeft="auto"
          marginRight="auto"
          gap={40}
        >
          <View
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end"
            gap={32}
            paddingBottom={28}
            borderBottomWidth={1}
            borderColor="$borderColor"
            $sm={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}
          >
            <Heading
              fontSize={44}
              lineHeight={48}
              fontWeight="800"
              color="$color"
              $sm={{ fontSize: 36, lineHeight: 40 }}
            >
              Dashboard
            </Heading>
            <Text color="$muted" fontSize={15} lineHeight={23} maxWidth={360}>
              Your training and nutrition at a glance.
            </Text>
          </View>

          <View
            flexDirection="row"
            alignItems="stretch"
            gap={24}
            $sm={{ flexDirection: "column" }}
          >
            <YStack flexBasis="68%" gap={16}>
              <Text
                color="$subtle"
                fontSize={12}
                fontWeight="600"
                letterSpacing={0.8}
              >
                30-DAY TRAINING SIGNALS
              </Text>
              <View
                flexDirection="row"
                gap={16}
                $sm={{ flexDirection: "column" }}
              >
                <KpiCard
                  title="Volume"
                  value="48.2k"
                  subtitle="last 30 days"
                  delta="up"
                  featured
                />
                <YStack flex={1} gap={16}>
                  <KpiCard
                    title="PRs"
                    value="12"
                    subtitle="last 30 days"
                    delta="up"
                  />
                  <KpiCard
                    title="Weekly Sets"
                    value="9.4"
                    subtitle="avg / muscle"
                    delta="same"
                  />
                </YStack>
              </View>
            </YStack>

            <YStack flexBasis="32%" gap={16}>
              <Text
                color="$subtle"
                fontSize={12}
                fontWeight="600"
                letterSpacing={0.8}
              >
                QUICK ACTIONS
              </Text>
              <Card className="route-card" padding={8} backgroundColor="$card">
                <QuickAction icon={Dumbbell} label="Workouts" />
                <QuickAction icon={Utensils} label="Meals" />
                <QuickAction icon={Activity} label="Muscles" />
                <QuickAction icon={Settings} label="Settings" last />
              </Card>
            </YStack>
          </View>

          <Card
            className="route-card"
            gap={16}
            flexDirection="row"
            alignItems="center"
            padding={24}
            backgroundColor="rgba(59,130,246,0.06)"
            borderColor="rgba(59,130,246,0.28)"
            $sm={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            <TrendingUp size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
            <YStack gap={2} flex={1} minWidth={0}>
              <Text color="$color" fontSize={15} fontWeight="600">
                Fitnexx is in early access
              </Text>
              <Text color="$muted" fontSize={14} lineHeight={22}>
                The full experience lives in the mobile app. Join the list to
                get started when signups open.
              </Text>
            </YStack>
            <LinkButton href="/early-access" size="sm">
              Get early access
            </LinkButton>
          </Card>
        </YStack>
      </View>
    </View>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  delta,
  featured = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  delta: "up" | "down" | "same";
  featured?: boolean;
}) {
  const deltaColor =
    delta === "up" ? "#22c55e" : delta === "down" ? "#ef4444" : "#666666";
  const deltaText =
    delta === "up" ? "↑ 8.2%" : delta === "down" ? "↓ 3.1%" : "→ 0.0%";

  return (
    <Card
      className="route-card"
      flex={featured ? 1.4 : undefined}
      minHeight={featured ? 244 : 114}
      gap={6}
      padding={featured ? 28 : 20}
      justifyContent="space-between"
      backgroundColor={featured ? "rgba(59,130,246,0.08)" : "$card"}
      borderColor={featured ? "rgba(59,130,246,0.34)" : "$borderColor"}
      $sm={{ minHeight: featured ? 190 : 114 }}
    >
      <Text
        color="$muted"
        fontSize={12}
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {title}
      </Text>
      <Text
        color="$color"
        fontSize={featured ? 48 : 28}
        lineHeight={featured ? 52 : 32}
        fontWeight="800"
      >
        {value}
      </Text>
      <Text color="$subtle" fontSize={12}>
        {subtitle}
      </Text>
      <Text color={deltaColor} fontSize={13} fontWeight="700" marginTop={6}>
        {deltaText}
      </Text>
      <View
        marginTop={6}
        height={2}
        width={featured ? 64 : 32}
        backgroundColor="$primary"
      />
    </Card>
  );
}

function QuickAction({
  icon: Icon,
  label,
  last = false,
}: {
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  last?: boolean;
}) {
  return (
    <View
      flexDirection="row"
      alignItems="center"
      gap={10}
      padding={12}
      borderBottomWidth={last ? 0 : 1}
      borderColor="$borderColor"
    >
      <View
        width={36}
        height={36}
        borderRadius={10}
        backgroundColor="rgba(59,130,246,0.12)"
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={18} color="#3b82f6" />
      </View>
      <Text color="$color" fontSize={15} fontWeight="600">
        {label}
      </Text>
      <Badge label="Soon" variant="neutral" />
    </View>
  );
}
