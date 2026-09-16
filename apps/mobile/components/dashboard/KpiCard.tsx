import { Text, View } from "react-native";
import { colors, fontSizes, radii, spacing } from "../../lib/theme";
import { Sparkline } from "../shared/Sparkline";
import { Card, SectionLabel } from "../shared/ui";

export function KpiCard({
  title,
  value,
  subtitle,
  delta,
  sparkData,
  color = colors.brand,
}: {
  title: string;
  value: string;
  subtitle: string;
  delta?: { value: number; direction: "up" | "down" | "same" };
  sparkData?: number[];
  color?: string;
}) {
  const deltaColor =
    delta?.direction === "up"
      ? colors.success
      : delta?.direction === "down"
        ? colors.danger
        : colors.textMuted;

  return (
    <Card
      style={{
        flex: 1,
        minWidth: 140,
        backgroundColor: colors.surfaceRaised,
        borderRadius: radii.xl,
        padding: spacing.lg,
      }}
    >
      <SectionLabel>{title}</SectionLabel>
      <Text
        style={{
          color: colors.text,
          fontSize: 30,
          fontWeight: "800",
          marginTop: spacing.sm,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: fontSizes.xs,
          marginTop: 2,
        }}
      >
        {subtitle}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        {delta && (
          <Text style={{ color: deltaColor, fontSize: 13, fontWeight: "700" }}>
            {delta.direction === "up"
              ? "↑"
              : delta.direction === "down"
                ? "↓"
                : "→"}{" "}
            {Math.abs(delta.value).toFixed(1)}%
          </Text>
        )}
        {sparkData && sparkData.length >= 2 && (
          <Sparkline data={sparkData} color={color} width={80} height={32} />
        )}
      </View>
    </Card>
  );
}
