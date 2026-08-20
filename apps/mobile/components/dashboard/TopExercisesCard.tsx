import { View, Text } from "react-native";

export default function TopExercisesCard({
  data,
}: {
  data: { name: string; sessions: number; totalVolume: number }[];
}) {
  const items = data.slice(0, 5);
  const maxVol = Math.max(...items.map((d) => d.totalVolume), 1);

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
        Top Exercises
      </Text>
      {items.map((d, i) => {
        const pct = d.totalVolume / maxVol;
        return (
          <View key={d.name} style={{ marginBottom: i < items.length - 1 ? 10 : 0 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ color: "#e5e5e5", fontSize: 13, fontWeight: "600" }} numberOfLines={1}>{d.name}</Text>
              <Text style={{ color: "#888", fontSize: 12 }}>{d.totalVolume.toLocaleString()}</Text>
            </View>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: "#222", overflow: "hidden" }}>
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  width: `${pct * 100}%`,
                  backgroundColor: "#3b82f6",
                  opacity: 0.6 + pct * 0.4,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
