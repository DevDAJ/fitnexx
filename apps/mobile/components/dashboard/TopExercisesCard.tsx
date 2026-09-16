import { Text, View } from "react-native";
import { colors } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

export default function TopExercisesCard({
  data,
}: {
  data: { name: string; sessions: number; totalVolume: number }[];
}) {
  const items = data.slice(0, 5);
  const maxVol = Math.max(...items.map((d) => d.totalVolume), 1);

  return (
    <Card>
      <SectionLabel style={{ marginBottom: 12 }}>Top Exercises</SectionLabel>
      {items.map((d, i) => {
        const pct = d.totalVolume / maxVol;
        return (
          <View
            key={d.name}
            style={{ marginBottom: i < items.length - 1 ? 10 : 0 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text
                style={{ color: colors.text, fontSize: 13, fontWeight: "600" }}
                numberOfLines={1}
              >
                {d.name}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {d.totalVolume.toLocaleString()}
              </Text>
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
                  width: `${pct * 100}%`,
                  backgroundColor: colors.brand,
                  opacity: 0.6 + pct * 0.4,
                }}
              />
            </View>
          </View>
        );
      })}
    </Card>
  );
}
