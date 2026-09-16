import { Dimensions, Text, View } from "react-native";
import { MUSCLE_COLORS } from "../../constants/muscles";
import { colors } from "../../lib/theme";
import type { MuscleWeeklyData } from "../../lib/types";
import { BarChart } from "../shared/Sparkline";
import { Card, SectionLabel } from "../shared/ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function WeeklySetsChart({ data }: { data: MuscleWeeklyData[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <SectionLabel>Weekly Sets</SectionLabel>
        <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 10 }}>
          Log some workouts to see your muscle distribution.
        </Text>
      </Card>
    );
  }

  const top8 = [...data]
    .sort((a, b) => b.weeklySets - a.weeklySets)
    .slice(0, 8);
  const barData = top8.map((d) => d.weeklySets);
  const barColors = top8.map(
    (d) => MUSCLE_COLORS[d.muscle] || colors.textMuted,
  );

  return (
    <Card>
      <SectionLabel style={{ marginBottom: 12 }}>
        Weekly Sets per Muscle
      </SectionLabel>
      <BarChart
        data={barData}
        colors={barColors}
        width={SCREEN_WIDTH - 64}
        height={160}
      />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 10,
        }}
      >
        {top8.map((d) => (
          <View
            key={d.muscle}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: MUSCLE_COLORS[d.muscle] || colors.textMuted,
              }}
            />
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
              {d.muscle} ({d.weeklySets})
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
