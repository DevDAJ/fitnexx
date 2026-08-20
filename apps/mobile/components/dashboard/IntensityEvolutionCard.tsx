import { View, Text } from "react-native";
import Svg, { Polygon, Text as SvgText, Line } from "react-native-svg";

const ZONES = [
  { key: "endurance", label: "Endurance (13+)", color: "#22c55e" },
  { key: "hypertrophy", label: "Hypertrophy (6-12)", color: "#3b82f6" },
  { key: "strength", label: "Strength (1-5)", color: "#ef4444" },
] as const;

export default function IntensityEvolutionCard({
  data,
}: {
  data: { label: string; strength: number; hypertrophy: number; endurance: number }[];
}) {
  const W = 300;
  const H = 160;
  const pad = 30;

  if (data.length < 2) {
    return (
      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Intensity Zones</Text>
        <Text style={{ color: "#666", fontSize: 14, marginTop: 10 }}>Not enough data yet.</Text>
      </View>
    );
  }

  const totals = data.map((d) => d.endurance + d.hypertrophy + d.strength);
  const maxTotal = Math.max(...totals);
  const cw = W - pad * 2;
  const ch = H - pad * 2;
  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        Intensity Zones
      </Text>
      <Svg width={W} height={H}>
        <Line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#333" strokeWidth={1} />
        {ZONES.map((zone) => {
          const topPts: string[] = [];
          const botPts: string[] = [];
          for (let i = 0; i < data.length; i++) {
            const x = pad + (i / (data.length - 1)) * cw;
            const d = data[i];
            let base = 0;
            if (zone.key === "endurance") base = 0;
            else if (zone.key === "hypertrophy") base = d.endurance;
            else base = d.endurance + d.hypertrophy;
            const val = d[zone.key];
            const bot = H - pad - (maxTotal > 0 ? (base / maxTotal) * ch : 0);
            const top = H - pad - (maxTotal > 0 ? ((base + val) / maxTotal) * ch : 0);
            topPts.push(`${x},${top}`);
            botPts.unshift(`${x},${bot}`);
          }
          return <Polygon key={zone.key} points={`${topPts.join(" ")} ${botPts.join(" ")}`} fill={zone.color} opacity={0.7} />;
        })}
        {labelIndices.map((i) => (
          <SvgText key={i} x={pad + (i / (data.length - 1)) * cw} y={H - 8} fill="#666" fontSize={10} textAnchor="middle">{data[i].label}</SvgText>
        ))}
      </Svg>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 12, marginTop: 8 }}>
        {ZONES.map((z) => (
          <View key={z.key} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: z.color }} />
            <Text style={{ color: "#aaa", fontSize: 10 }}>{z.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
