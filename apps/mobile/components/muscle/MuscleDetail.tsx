import { View, Text } from "react-native";
import { MUSCLE_COLORS, type Muscle } from "../../constants/muscles";
import { getScoreLabel, getScoreColor } from "../../lib/analysis/hypertrophyScore";

interface MuscleDetailProps {
  muscle: Muscle;
  lifetimeSets: number;
  tierName: string;
  tierIcon: string;
  progressToNext: number;
  hypertrophyScore: number;
}

export function MuscleDetail({ muscle, lifetimeSets, tierName, tierIcon, progressToNext, hypertrophyScore }: MuscleDetailProps) {
  const color = MUSCLE_COLORS[muscle] || "#666";
  const scoreLabel = getScoreLabel(hypertrophyScore);
  const scoreColor = getScoreColor(hypertrophyScore);

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: color,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>{muscle}</Text>
        <Text style={{ fontSize: 24 }}>{tierIcon}</Text>
      </View>

      {/* Tier */}
      <Text style={{ color, fontSize: 14, fontWeight: "600", marginTop: 4 }}>
        {tierName}
      </Text>

      {/* Lifetime Sets */}
      <Text style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
        {lifetimeSets} lifetime sets
      </Text>

      {/* Progress Bar */}
      <View style={{ marginTop: 10 }}>
        <View style={{ height: 6, backgroundColor: "#222", borderRadius: 3, overflow: "hidden" }}>
          <View
            style={{
              height: "100%",
              width: `${progressToNext}%`,
              backgroundColor: color,
              borderRadius: 3,
            }}
          />
        </View>
        <Text style={{ color: "#666", fontSize: 11, marginTop: 4 }}>
          {progressToNext}% to next tier
        </Text>
      </View>

      {/* Hypertrophy Score */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#222" }}>
        <View>
          <Text style={{ color: "#666", fontSize: 11 }}>HYPERTROPHY SCORE</Text>
          <Text style={{ color: scoreColor, fontSize: 22, fontWeight: "800", marginTop: 2 }}>
            {hypertrophyScore}
          </Text>
        </View>
        <View style={{ backgroundColor: scoreColor + "20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
          <Text style={{ color: scoreColor, fontSize: 12, fontWeight: "600" }}>
            {scoreLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}
