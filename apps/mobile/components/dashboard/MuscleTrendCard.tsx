import { View, Text } from "react-native";
import Svg, { Polygon, Text as SvgText, Line } from "react-native-svg";

export default function MuscleTrendCard({
  data,
  muscleColors,
}: {
  data: { label: string; muscles: Record<string, number> }[];
  muscleColors: Record<string, string>;
}) {
  const W = 300;
  const H = 160;
  const pad = 30;

  if (data.length < 2) {
    return (
      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Muscle Trend</Text>
        <Text style={{ color: "#666", fontSize: 14, marginTop: 10 }}>Not enough data yet.</Text>
      </View>
    );
  }

  const totals: Record<string, number> = {};
  data.forEach((d) => Object.entries(d.muscles).forEach(([m, v]) => { totals[m] = (totals[m] || 0) + v; }));
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const top5 = sorted.slice(0, 5).map(([m]) => m);

  const layers = data.map((d) => {
    const top = top5.reduce((s, m) => s + (d.muscles[m] || 0), 0);
    const other = Object.entries(d.muscles).reduce((s, [m, v]) => s + (top5.includes(m) ? 0 : v), 0);
    return { top, other, total: top + other };
  });

  const maxTotal = Math.max(...layers.map((l) => l.total));
  const cw = W - pad * 2;
  const ch = H - pad * 2;

  const layerKeys = [...top5, "Other"];
  const layerColors = [...top5.map((m) => muscleColors[m] || "#666"), "#666"];
  const layerValues = (i: number) => {
    const vals: number[] = [];
    let cum = 0;
    for (const m of top5) {
      vals.push(cum);
      cum += data[i].muscles[m] || 0;
    }
    vals.push(cum);
    return vals;
  };

  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        Muscle Trend
      </Text>
      <Svg width={W} height={H}>
        <Line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#333" strokeWidth={1} />
        {layerKeys.map((key, li) => {
          const color = layerColors[li];
          const topPts: string[] = [];
          const botPts: string[] = [];
          for (let i = 0; i < data.length; i++) {
            const x = pad + (i / (data.length - 1)) * cw;
            const base = layerValues(i)[li];
            const val = li === layerKeys.length - 1 ? data[i].muscles["Other"] || 0 : data[i].muscles[key] || 0;
            const bot = H - pad - (maxTotal > 0 ? (base / maxTotal) * ch : 0);
            const top = H - pad - (maxTotal > 0 ? ((base + val) / maxTotal) * ch : 0);
            topPts.push(`${x},${top}`);
            botPts.unshift(`${x},${bot}`);
          }
          return <Polygon key={key} points={`${topPts.join(" ")} ${botPts.join(" ")}`} fill={color} opacity={0.7} />;
        })}
        {labelIndices.map((i) => (
          <SvgText key={i} x={pad + (i / (data.length - 1)) * cw} y={H - 8} fill="#666" fontSize={10} textAnchor="middle">{data[i].label}</SvgText>
        ))}
      </Svg>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {layerKeys.map((key, li) => (
          <View key={key} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: layerColors[li] }} />
            <Text style={{ color: "#aaa", fontSize: 11 }}>{key}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
