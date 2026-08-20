import { View, Text, Dimensions } from "react-native";
import type { MuscleWeeklyData } from "../../lib/types";
import { MUSCLE_COLORS } from "../../constants/muscles";
import { BarChart } from "../shared/Sparkline";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function WeeklySetsChart({ data }: { data: MuscleWeeklyData[] }) {
  if (data.length === 0) {
    return (
      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase" }}>
          Weekly Sets
        </Text>
        <Text style={{ color: "#666", fontSize: 14, marginTop: 10 }}>
          Log some workouts to see your muscle distribution.
        </Text>
      </View>
    );
  }

  const top8 = [...data].sort((a, b) => b.weeklySets - a.weeklySets).slice(0, 8);
  const barData = top8.map((d) => d.weeklySets);
  const barColors = top8.map((d) => MUSCLE_COLORS[d.muscle] || "#666");

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
        Weekly Sets per Muscle
      </Text>
      <BarChart
        data={barData}
        colors={barColors}
        width={SCREEN_WIDTH - 64}
        height={160}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {top8.map((d) => (
          <View key={d.muscle} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: MUSCLE_COLORS[d.muscle] || "#666" }} />
            <Text style={{ color: "#aaa", fontSize: 11 }}>
              {d.muscle} ({d.weeklySets})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
