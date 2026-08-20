import { View, Text } from "react-native";

const riskColor = (score: number) => (score < 30 ? "#22c55e" : score <= 60 ? "#f59e0b" : "#ef4444");
const levelBadge = (level: string) => ({
  backgroundColor: level === "low" ? "#22c55e22" : level === "moderate" ? "#f59e0b22" : "#ef444422",
  color: level === "low" ? "#22c55e" : level === "moderate" ? "#f59e0b" : "#ef4444",
});

const FACTOR_LABELS: Record<string, string> = { acwr: "ACWR", recovery: "Recovery", imbalance: "Imbalance" };

export default function InjuryRiskCard({
  score,
  factors,
  riskLevel,
}: {
  score: number;
  factors: { acwr: number; recovery: number; imbalance: number };
  riskLevel: "low" | "moderate" | "high";
}) {
  const badge = levelBadge(riskLevel);

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Injury Risk</Text>
        <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: badge.backgroundColor }}>
          <Text style={{ color: badge.color, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>{riskLevel}</Text>
        </View>
      </View>

      <Text style={{ color: riskColor(score), fontSize: 48, fontWeight: "800", textAlign: "center", marginVertical: 4 }}>{score}</Text>

      {(Object.entries(factors) as [string, number][]).map(([key, val]) => (
        <View key={key} style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ color: "#aaa", fontSize: 12 }}>{FACTOR_LABELS[key] || key}</Text>
            <Text style={{ color: "#888", fontSize: 12 }}>{val}</Text>
          </View>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: "#222", overflow: "hidden" }}>
            <View style={{ height: 6, borderRadius: 3, width: `${Math.min(val, 100)}%`, backgroundColor: riskColor(val) }} />
          </View>
        </View>
      ))}
    </View>
  );
}
