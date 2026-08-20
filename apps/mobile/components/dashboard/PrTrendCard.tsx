import { View, Text } from "react-native";
import Svg, { Polyline, Polygon, Line, Text as SvgText } from "react-native-svg";

export default function PrTrendCard({
  data,
  color = "#3b82f6",
}: {
  data: { label: string; count: number }[];
  color?: string;
}) {
  const W = 300;
  const H = 160;
  const pad = 30;

  if (data.length < 2) {
    return (
      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>PR Trend</Text>
        <Text style={{ color: "#666", fontSize: 14, marginTop: 10 }}>Not enough data yet.</Text>
      </View>
    );
  }

  const counts = data.map((d) => d.count);
  const max = Math.max(...counts);
  const cw = W - pad * 2;
  const ch = H - pad * 2;

  const pts = counts.map((v, i) => ({
    x: pad + (i / (counts.length - 1)) * cw,
    y: H - pad - (max > 0 ? (v / max) * ch : 0),
  }));

  const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${pts[0].x},${H - pad} ${linePoints} ${pts[pts.length - 1].x},${H - pad}`;

  const labelIndices = [0, Math.floor(counts.length / 2), counts.length - 1];

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        PR Trend
      </Text>
      <Svg width={W} height={H}>
        <Polygon points={areaPoints} fill={color} opacity={0.15} />
        <Polyline points={linePoints} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#333" strokeWidth={1} />
        {labelIndices.map((i) => (
          <SvgText key={i} x={pts[i].x} y={H - 8} fill="#666" fontSize={10} textAnchor="middle">{data[i].label}</SvgText>
        ))}
        <SvgText x={4} y={pad + 4} fill="#666" fontSize={10}>{max}</SvgText>
      </Svg>
    </View>
  );
}
