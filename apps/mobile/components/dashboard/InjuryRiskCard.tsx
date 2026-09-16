import { Text, View } from "react-native";
import { colors, radii } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

const riskColor = (score: number) =>
  score < 30 ? colors.success : score <= 60 ? colors.warning : colors.danger;
const levelBadge = (level: string) => ({
  backgroundColor: colors.surfaceRaised,
  color:
    level === "low"
      ? colors.success
      : level === "moderate"
        ? colors.warning
        : colors.danger,
});

const FACTOR_LABELS: Record<string, string> = {
  acwr: "ACWR",
  recovery: "Recovery",
  imbalance: "Imbalance",
};

export default function InjuryRiskCard({
  score,
  factors,
  riskLevel,
}: {
  score: number;
  factors: { acwr: number; recovery: number; imbalance: number };
  riskLevel: "low" | "moderate" | "high";
}) {
  const badge = levelBadge(riskLevel);

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <SectionLabel>Injury Risk</SectionLabel>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: radii.sm,
            backgroundColor: badge.backgroundColor,
          }}
        >
          <Text
            style={{
              color: badge.color,
              fontSize: 11,
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            {riskLevel}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: riskColor(score),
          fontSize: 48,
          fontWeight: "800",
          textAlign: "center",
          marginVertical: 4,
        }}
      >
        {score}
      </Text>

      {(Object.entries(factors) as [string, number][]).map(([key, val]) => (
        <View key={key} style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {FACTOR_LABELS[key] || key}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{val}</Text>
          </View>
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.surfacePressed,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: 6,
                borderRadius: 3,
                width: `${Math.min(val, 100)}%`,
                backgroundColor: riskColor(val),
              }}
            />
          </View>
        </View>
      ))}
    </Card>
  );
}
