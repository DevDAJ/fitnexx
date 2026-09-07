import { Text, TouchableOpacity, View } from "react-native";
import { useAppStore } from "../../lib/store";

const GOAL = 2000;

export function WaterCard() {
  const waterLog = useAppStore((s) => s.waterLog);
  const addWater = useAppStore((s) => s.addWater);
  const today = new Date().toISOString().slice(0, 10);
  const ml = waterLog[today] ?? 0;
  const pct = Math.min((ml / GOAL) * 100, 100);

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Water
        </Text>
        <Text style={{ color: "#3b82f6", fontSize: 16, fontWeight: "700" }}>
          {ml} / {GOAL} ml
        </Text>
      </View>

      <View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "#222",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: pct >= 100 ? "#22c55e" : "#60a5fa",
            borderRadius: 3,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        {[250, 500].map((increment) => (
          <TouchableOpacity
            key={increment}
            onPress={() => addWater(increment)}
            style={{
              flex: 1,
              backgroundColor: "#1a1a1a",
              borderRadius: 10,
              padding: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#2a2a2a",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
              +{increment} ml
            </Text>
          </TouchableOpacity>
        ))}
        {ml > 0 && (
          <TouchableOpacity
            onPress={() => addWater(-ml)}
            style={{
              flex: 1,
              backgroundColor: "#1a1a1a",
              borderRadius: 10,
              padding: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#2a2a2a",
            }}
          >
            <Text style={{ color: "#888", fontSize: 14, fontWeight: "700" }}>
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
