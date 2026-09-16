import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, {
  Line,
  Polygon,
  Polyline,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import { colors, radii } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

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
      <Card>
        <SectionLabel>Volume & Density</SectionLabel>
        <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 10 }}>
          Not enough data yet.
        </Text>
      </Card>
    );
  }

  const isVol = mode === "volume";
  const values = data.map((d) => (isVol ? d.volume : d.density));
  const max = Math.max(...values);
  const cw = W - pad * 2;
  const ch = H - pad * 2;

  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <SectionLabel>Volume & Density</SectionLabel>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {(["volume", "density"] as const).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: radii.full,
                backgroundColor:
                  mode === m ? colors.brand : colors.surfaceRaised,
              }}
            >
              <Text
                style={{
                  color: mode === m ? colors.onBrand : colors.textSecondary,
                  fontSize: 11,
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Svg width={W} height={H}>
        <Line
          x1={pad}
          y1={H - pad}
          x2={W - pad}
          y2={H - pad}
          stroke={colors.borderStrong}
          strokeWidth={1}
        />
        {isVol
          ? (() => {
              const pts = values.map((v, i) => ({
                x: pad + (i / (values.length - 1)) * cw,
                y: H - pad - (max > 0 ? (v / max) * ch : 0),
              }));
              const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
              return (
                <>
                  <Polygon
                    points={`${pts[0].x},${H - pad} ${linePoints} ${pts[pts.length - 1].x},${H - pad}`}
                    fill={colors.brand}
                    opacity={0.15}
                  />
                  <Polyline
                    points={linePoints}
                    fill="none"
                    stroke={colors.brand}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              );
            })()
          : values.map((v, i) => {
              const barW = Math.min(cw / data.length - 4, 30);
              const barH = max > 0 ? (v / max) * ch : 0;
              const x = pad + (i / data.length) * cw + 2;
              return (
                <Rect
                  key={data[i].label}
                  x={x}
                  y={H - pad - barH}
                  width={barW}
                  height={barH}
                  fill={colors.success}
                  rx={3}
                />
              );
            })}
        {labelIndices.map((i) => (
          <SvgText
            key={i}
            x={pad + (i / (values.length - 1)) * cw}
            y={H - 8}
            fill={colors.textMuted}
            fontSize={10}
            textAnchor="middle"
          >
            {data[i].label}
          </SvgText>
        ))}
        <SvgText x={4} y={pad + 4} fill={colors.textMuted} fontSize={10}>
          {max}
        </SvgText>
      </Svg>
    </Card>
  );
}
