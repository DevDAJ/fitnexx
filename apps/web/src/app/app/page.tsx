import { Badge, Card, Heading, Text, View, XStack, YStack } from "@fitnexx/ui";
import {
  Activity,
  Dumbbell,
  Settings,
  TrendingUp,
  Utensils,
} from "lucide-react";
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
        <XStack alignItems="center" gap={9}>
          <View
            width={28}
            height={28}
            borderRadius={9}
            alignItems="center"
            justifyContent="center"
            style={{ background: "linear-gradient(145deg, #60a5fa, #2563eb)" }}
          >
            <Text color="#fff" fontSize={12} fontWeight="800">
              F
            </Text>
          </View>
          <Text
            fontSize={16}
            fontWeight="800"
            color="$color"
            letterSpacing={-0.02}
          >
            Fitnexx
          </Text>
        </XStack>
        <View
          width={32}
          height={32}
          borderRadius={16}
          backgroundColor="rgba(59,130,246,0.15)"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="$primary" fontSize={13} fontWeight="700">
            FX
          </Text>
        </View>
      </XStack>

      <View
        flex={1}
        paddingVertical={40}
        paddingHorizontal={16}
        $sm={{ paddingVertical: 24 }}
      >
        <YStack
          maxWidth={1024}
          width="100%"
          marginLeft="auto"
          marginRight="auto"
          gap={24}
        >
          <YStack gap={4}>
            <Heading fontSize={28} fontWeight="800" color="$color">
              Dashboard
            </Heading>
            <Text color="$muted" fontSize={15}>
              Your training and nutrition at a glance.
            </Text>
          </YStack>

          <div className="app-kpi-grid">
            <KpiCard
              title="PRs"
              value="12"
              subtitle="last 30 days"
              delta="up"
              color="#fbbf24"
            />
            <KpiCard
              title="Volume"
              value="48.2k"
              subtitle="last 30 days"
              delta="up"
              color="#3b82f6"
            />
            <KpiCard
              title="Weekly Sets"
              value="9.4"
              subtitle="avg / muscle"
              delta="same"
              color="#8b5cf6"
            />
          </div>

          <YStack gap={12}>
            <Heading fontSize={18} fontWeight="700" color="$color">
              Quick actions
            </Heading>
            <div className="app-action-grid">
              <QuickAction icon={Dumbbell} label="Workouts" />
              <QuickAction icon={Utensils} label="Meals" />
              <QuickAction icon={Activity} label="Muscles" />
              <QuickAction icon={Settings} label="Settings" />
            </div>
          </YStack>

          <Card
            className="route-card"
            gap={12}
            flexDirection="row"
            alignItems="center"
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
            <LinkButton href="/coming-soon" size="sm">
              Get started
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
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  delta: "up" | "down" | "same";
  color: string;
}) {
  const deltaColor =
    delta === "up" ? "#22c55e" : delta === "down" ? "#ef4444" : "#666666";
  const deltaText =
    delta === "up" ? "↑ 8.2%" : delta === "down" ? "↓ 3.1%" : "→ 0.0%";

  return (
    <Card className="route-card" gap={4} backgroundColor="$card">
      <Text
        color="$muted"
        fontSize={12}
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {title}
      </Text>
      <Text color="$color" fontSize={28} fontWeight="800">
        {value}
      </Text>
      <Text color="$subtle" fontSize={12}>
        {subtitle}
      </Text>
      <Text color={deltaColor} fontSize={13} fontWeight="700" marginTop={6}>
        {deltaText}
      </Text>
      <View marginTop={6}>
        <View height={3} width={40} borderRadius={2} backgroundColor={color} />
      </View>
    </Card>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
}) {
  return (
    <Card
      flexDirection="row"
      alignItems="center"
      gap={10}
      className="route-card"
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
    </Card>
  );
}
