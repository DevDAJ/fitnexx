import { View, Text } from "react-native";
import { Sparkline } from "../shared/Sparkline";

export function KpiCard({
  title,
  value,
  subtitle,
  delta,
  sparkData,
  color = "#3b82f6",
}: {
  title: string;
  value: string;
  subtitle: string;
  delta?: { value: number; direction: "up" | "down" | "same" };
  sparkData?: number[];
  color?: string;
}) {
  const deltaColor =
    delta?.direction === "up"
      ? "#22c55e"
      : delta?.direction === "down"
      ? "#ef4444"
      : "#666";

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 16,
        flex: 1,
        minWidth: 140,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {title}
      </Text>
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", marginTop: 6 }}>
        {value}
      </Text>
      <Text style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
        {subtitle}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        {delta && (
          <Text style={{ color: deltaColor, fontSize: 13, fontWeight: "700" }}>
            {delta.direction === "up" ? "↑" : delta.direction === "down" ? "↓" : "→"}{" "}
            {Math.abs(delta.value).toFixed(1)}%
          </Text>
        )}
        {sparkData && sparkData.length >= 2 && (
          <Sparkline data={sparkData} color={color} width={80} height={32} />
        )}
      </View>
    </View>
  );
}
