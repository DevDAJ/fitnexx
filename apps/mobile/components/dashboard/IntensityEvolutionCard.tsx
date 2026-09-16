import { Text, View } from "react-native";
import Svg, { Line, Polygon, Text as SvgText } from "react-native-svg";
import { colors } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

const ZONES = [
  { key: "endurance", label: "Endurance (13+)", color: colors.success },
  { key: "hypertrophy", label: "Hypertrophy (6-12)", color: colors.brand },
  { key: "strength", label: "Strength (1-5)", color: colors.danger },
] as const;

export default function IntensityEvolutionCard({
  data,
}: {
  data: {
    label: string;
    strength: number;
    hypertrophy: number;
    endurance: number;
  }[];
}) {
  const W = 300;
  const H = 160;
  const pad = 30;

  if (data.length < 2) {
    return (
      <Card>
        <SectionLabel>Intensity Zones</SectionLabel>
        <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 10 }}>
          Not enough data yet.
        </Text>
      </Card>
    );
  }

  const totals = data.map((d) => d.endurance + d.hypertrophy + d.strength);
  const maxTotal = Math.max(...totals);
  const cw = W - pad * 2;
  const ch = H - pad * 2;
  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <Card>
      <SectionLabel style={{ marginBottom: 8 }}>Intensity Zones</SectionLabel>
      <Svg width={W} height={H}>
        <Line
          x1={pad}
          y1={H - pad}
          x2={W - pad}
          y2={H - pad}
          stroke={colors.borderStrong}
          strokeWidth={1}
        />
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
            const top =
              H - pad - (maxTotal > 0 ? ((base + val) / maxTotal) * ch : 0);
            topPts.push(`${x},${top}`);
            botPts.unshift(`${x},${bot}`);
          }
          return (
            <Polygon
              key={zone.key}
              points={`${topPts.join(" ")} ${botPts.join(" ")}`}
              fill={zone.color}
              opacity={0.7}
            />
          );
        })}
        {labelIndices.map((i) => (
          <SvgText
            key={i}
            x={pad + (i / (data.length - 1)) * cw}
            y={H - 8}
            fill={colors.textMuted}
            fontSize={10}
            textAnchor="middle"
          >
            {data[i].label}
          </SvgText>
        ))}
      </Svg>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 12,
          marginTop: 8,
        }}
      >
        {ZONES.map((z) => (
          <View
            key={z.key}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: z.color,
              }}
            />
            <Text style={{ color: colors.textSecondary, fontSize: 10 }}>
              {z.label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
