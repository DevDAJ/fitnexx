import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Polygon, Polyline, Rect, Text as SvgText, Line } from "react-native-svg";

export default function VolumeDensityCard({
  data,
}: {
  data: { label: string; volume: number; density: number }[];
}) {
  const [mode, setMode] = useState<"volume" | "density">("volume");
  const W = 300;
  const H = 160;
  const pad = 30;

  if (data.length < 2) {
    return (
      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Volume & Density</Text>
        <Text style={{ color: "#666", fontSize: 14, marginTop: 10 }}>Not enough data yet.</Text>
      </View>
    );
  }

  const isVol = mode === "volume";
  const values = data.map((d) => (isVol ? d.volume : d.density));
  const max = Math.max(...values);
  const cw = W - pad * 2;
  const ch = H - pad * 2;

  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Volume & Density</Text>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {(["volume", "density"] as const).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: mode === m ? "#3b82f6" : "#222" }}
            >
              <Text style={{ color: mode === m ? "#fff" : "#888", fontSize: 11, fontWeight: "600", textTransform: "capitalize" }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Svg width={W} height={H}>
        <Line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#333" strokeWidth={1} />
        {isVol ? (
          (() => {
            const pts = values.map((v, i) => ({
              x: pad + (i / (values.length - 1)) * cw,
              y: H - pad - (max > 0 ? (v / max) * ch : 0),
            }));
            const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
            return (
              <>
                <Polygon points={`${pts[0].x},${H - pad} ${linePoints} ${pts[pts.length - 1].x},${H - pad}`} fill="#3b82f6" opacity={0.15} />
                <Polyline points={linePoints} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </>
            );
          })()
        ) : (
          values.map((v, i) => {
            const barW = Math.min(cw / data.length - 4, 30);
            const barH = max > 0 ? (v / max) * ch : 0;
            const x = pad + (i / data.length) * cw + 2;
            return <Rect key={i} x={x} y={H - pad - barH} width={barW} height={barH} fill="#22c55e" rx={3} />;
          })
        )}
        {labelIndices.map((i) => (
          <SvgText key={i} x={pad + (i / (values.length - 1)) * cw} y={H - 8} fill="#666" fontSize={10} textAnchor="middle">{data[i].label}</SvgText>
        ))}
        <SvgText x={4} y={pad + 4} fill="#666" fontSize={10}>{max}</SvgText>
      </Svg>
    </View>
  );
}
