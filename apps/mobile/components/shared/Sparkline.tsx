import { View } from "react-native";
import Svg, { Polyline, Rect, Line } from "react-native-svg";

export function Sparkline({
  data,
  color = "#3b82f6",
  width = 100,
  height = 40,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) {
    return <View style={{ width, height }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BarChart({
  data,
  colors,
  labels,
  width = 300,
  height = 160,
}: {
  data: number[];
  colors: string[];
  labels?: string[];
  width?: number;
  height?: number;
}) {
  if (data.length === 0) return <View style={{ width, height }} />;

  const max = Math.max(...data);
  const padding = 4;
  const barWidth = Math.min(
    (width - padding * 2) / data.length - 4,
    40
  );
  const chartHeight = height - padding * 2;

  return (
    <Svg width={width} height={height}>
      {data.map((v, i) => {
        const barHeight = max > 0 ? (v / max) * chartHeight : 0;
        const x =
          padding + (i / data.length) * (width - padding * 2) + 2;
        const y = height - padding - barHeight;

        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={colors[i % colors.length]}
            rx={3}
          />
        );
      })}
    </Svg>
  );
}

export function LineChart({
  data,
  color = "#3b82f6",
  width = 300,
  height = 160,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return <View style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 8;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((v - min) / range) * (height - padding * 2);
        return (
          <circle key={i} cx={x} cy={y} r={3} fill={color} />
        );
      })}
    </Svg>
  );
}
