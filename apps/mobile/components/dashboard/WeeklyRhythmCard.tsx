import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

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
    <Card>
      <SectionLabel style={{ marginBottom: 8 }}>Weekly Rhythm</SectionLabel>
      <Svg width={W} height={H}>
        <Line
          x1={pad}
          y1={H - pad}
          x2={W - pad}
          y2={H - pad}
          stroke={colors.borderStrong}
          strokeWidth={1}
        />
        {days.map((d, i) => {
          const barH = (d.sessions / max) * ch;
          const x = pad + (i / days.length) * cw + 2;
          return (
            <Rect
              key={`bar-${d.day}`}
              x={x}
              y={H - pad - barH}
              width={barW}
              height={barH || 2}
              fill={d.sessions > 0 ? colors.brand : colors.surfacePressed}
              rx={3}
            />
          );
        })}
        {days.map((d, i) => (
          <SvgText
            key={`label-${d.day}`}
            x={pad + (i / days.length) * cw + barW / 2 + 2}
            y={H - 8}
            fill={colors.textMuted}
            fontSize={10}
            textAnchor="middle"
          >
            {d.day}
          </SvgText>
        ))}
      </Svg>
    </Card>
  );
}
