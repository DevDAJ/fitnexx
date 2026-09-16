import { Text, View } from "react-native";
import { MUSCLE_COLORS, type Muscle } from "../../constants/muscles";
import {
  getScoreColor,
  getScoreLabel,
} from "../../lib/analysis/hypertrophyScore";
import { colors, radii } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

interface MuscleDetailProps {
  muscle: Muscle;
  lifetimeSets: number;
  tierName: string;
  tierIcon: string;
  progressToNext: number;
  hypertrophyScore: number;
}

export function MuscleDetail({
  muscle,
  lifetimeSets,
  tierName,
  tierIcon,
  progressToNext,
  hypertrophyScore,
}: MuscleDetailProps) {
  const color = MUSCLE_COLORS[muscle] || colors.textMuted;
  const scoreLabel = getScoreLabel(hypertrophyScore);
  const scoreColor = getScoreColor(hypertrophyScore);

  return (
    <Card
      style={{
        borderColor: color,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
          {muscle}
        </Text>
        <Text style={{ fontSize: 24 }}>{tierIcon}</Text>
      </View>

      {/* Tier */}
      <Text style={{ color, fontSize: 14, fontWeight: "600", marginTop: 4 }}>
        {tierName}
      </Text>

      {/* Lifetime Sets */}
      <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 8 }}>
        {lifetimeSets} lifetime sets
      </Text>

      {/* Progress Bar */}
      <View style={{ marginTop: 10 }}>
        <View
          style={{
            height: 6,
            backgroundColor: colors.surfacePressed,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progressToNext}%`,
              backgroundColor: color,
              borderRadius: 3,
            }}
          />
        </View>
        <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>
          {progressToNext}% to next tier
        </Text>
      </View>

      {/* Hypertrophy Score */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <View>
          <SectionLabel style={{ fontSize: 11 }}>
            Hypertrophy score
          </SectionLabel>
          <Text
            style={{
              color: scoreColor,
              fontSize: 22,
              fontWeight: "800",
              marginTop: 2,
            }}
          >
            {hypertrophyScore}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.surfaceRaised,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: radii.sm,
          }}
        >
          <Text style={{ color: scoreColor, fontSize: 12, fontWeight: "600" }}>
            {scoreLabel}
          </Text>
        </View>
      </View>
    </Card>
  );
}
