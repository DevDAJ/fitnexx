import { View, Text } from "react-native";

const TIER_ICONS: Record<string, string> = {
  Beginner: "🌱", Novice: "🌿", Intermediate: "💪", Advanced: "🔥", Elite: "⚡", Master: "🏆",
};

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
  const icon = TIER_ICONS[tier] || "🏋️";
  const pct = Math.min(Math.max(progressToNext, 0), 100);

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        Training Journey
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 28 }}>{icon}</Text>
        <View>
          <Text style={{ color: "#e5e5e5", fontSize: 20, fontWeight: "800" }}>{tier}</Text>
          <Text style={{ color: "#888", fontSize: 12 }}>{lifetimeSets.toLocaleString()} lifetime sets</Text>
        </View>
      </View>

      <View style={{ height: 8, borderRadius: 4, backgroundColor: "#222", overflow: "hidden", marginTop: 14 }}>
        <View style={{ height: 8, borderRadius: 4, width: `${pct}%`, backgroundColor: "#3b82f6" }} />
      </View>
      <Text style={{ color: "#666", fontSize: 11, textAlign: "right", marginTop: 4 }}>{pct.toFixed(0)}%</Text>

      {nextTier && (
        <Text style={{ color: "#888", fontSize: 13, marginTop: 6 }}>
          Next: <Text style={{ color: "#e5e5e5", fontWeight: "700" }}>{nextTier}</Text>
          {weeksToNext != null && ` in ~${weeksToNext} weeks`}
        </Text>
      )}
    </View>
  );
}
