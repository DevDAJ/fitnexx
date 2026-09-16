import { Text, View } from "react-native";
import { colors } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

export default function TrainingTimelineCard({
  tier,
  tierIndex,
  lifetimeSets,
  progressToNext,
  nextTier,
  weeksToNext,
}: {
  tier: string;
  tierIndex: number;
  lifetimeSets: number;
  progressToNext: number;
  nextTier: string | null;
  weeksToNext: number | null;
}) {
  const pct = Math.min(Math.max(progressToNext, 0), 100);

  return (
    <Card>
      <SectionLabel style={{ marginBottom: 8 }}>Training Journey</SectionLabel>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.brandMuted,
          }}
        >
          <Text
            style={{ color: colors.brand, fontSize: 14, fontWeight: "800" }}
          >
            {String(tierIndex + 1).padStart(2, "0")}
          </Text>
        </View>
        <View>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>
            {tier}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            {lifetimeSets.toLocaleString()} lifetime sets
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.surfacePressed,
          overflow: "hidden",
          marginTop: 14,
        }}
      >
        <View
          style={{
            height: 8,
            borderRadius: 4,
            width: `${pct}%`,
            backgroundColor: colors.brand,
          }}
        />
      </View>
      <Text
        style={{
          color: colors.textMuted,
          fontSize: 11,
          textAlign: "right",
          marginTop: 4,
        }}
      >
        {pct.toFixed(0)}%
      </Text>

      {nextTier && (
        <Text
          style={{ color: colors.textSecondary, fontSize: 13, marginTop: 6 }}
        >
          Next:{" "}
          <Text style={{ color: colors.text, fontWeight: "700" }}>
            {nextTier}
          </Text>
          {weeksToNext != null && ` in ~${weeksToNext} weeks`}
        </Text>
      )}
    </Card>
  );
}
