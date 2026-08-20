import { View, Text } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";

export default function WeeklyRhythmCard({
  data,
}: {
  data: { day: string; sessions: number; volume: number }[];
}) {
  const W = 300;
  const H = 160;
  const pad = 30;
  const days = data.slice(0, 7);
  const max = Math.max(...days.map((d) => d.sessions), 1);
  const cw = W - pad * 2;
  const ch = H - pad * 2;
  const barW = Math.min(cw / days.length - 4, 30);

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        Weekly Rhythm
      </Text>
      <Svg width={W} height={H}>
        <Line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#333" strokeWidth={1} />
        {days.map((d, i) => {
          const barH = (d.sessions / max) * ch;
          const x = pad + (i / days.length) * cw + 2;
          return (
            <Rect
              key={i}
              x={x}
              y={H - pad - barH}
              width={barW}
              height={barH || 2}
              fill={d.sessions > 0 ? "#3b82f6" : "#222"}
              rx={3}
            />
          );
        })}
        {days.map((d, i) => (
          <SvgText
            key={i}
            x={pad + (i / days.length) * cw + barW / 2 + 2}
            y={H - 8}
            fill="#666"
            fontSize={10}
            textAnchor="middle"
          >
            {d.day}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
