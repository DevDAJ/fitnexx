import { View, Text, Dimensions } from "react-native";
import Svg, { Rect } from "react-native-svg";
import type { FlexData } from "../../lib/analysis/flexData";

const CARD_WIDTH = Dimensions.get("window").width - 64;

export function VolumeComparisonCard({ data }: { data: FlexData }) {
  const top3 = data.volumeComparison.slice(0, 3);
  return (
    <Card title="Volume Comparison">
      {top3.map((c, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 }}>
          <Text style={{ fontSize: 20 }}>{c.emoji}</Text>
          <Text style={{ color: "#e5e5e5", fontSize: 14, fontWeight: "600", flex: 1 }}>
            {c.count.toLocaleString()}x {c.label}
          </Text>
        </View>
      ))}
    </Card>
  );
}

export function BestMonthCard({ data }: { data: FlexData }) {
  const [year, month] = data.bestMonth.month.split("-");
  const monthName = new Date(Number(year), Number(month) - 1).toLocaleString("en", { month: "long" });
  return (
    <Card title="Best Month">
      <Text style={{ color: "#fbbf24", fontSize: 22, fontWeight: "800", marginTop: 4 }}>
        {monthName} {year}
      </Text>
      <Text style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
        {data.bestMonth.workouts} workouts | {formatVol(data.bestMonth.volume)} volume
      </Text>
    </Card>
  );
}

export function SummaryCard({ data }: { data: FlexData }) {
  return (
    <Card title="Your Summary">
      <StatRow label="Workouts" value={`${data.totalWorkouts}`} />
      <StatRow label="Exercises" value={`${data.totalExercises}`} />
      <StatRow label="Sets" value={`${data.totalSets.toLocaleString()}`} />
      <StatRow label="Volume" value={formatVol(data.totalVolume)} />
      <StatRow label="PRs" value={`${data.totalPrs}`} />
      <StatRow label="Avg / week" value={data.avgWorkoutsPerWeek.toFixed(1)} />
    </Card>
  );
}

export function YearHeatmapCard({ data }: { data: FlexData }) {
  const size = 12;
  const gap = 2;
  const weeks = 52;

  return (
    <Card title="Year Heatmap">
      <Svg width={weeks * (size + gap)} height={7 * (size + gap)} style={{ marginTop: 8 }}>
        {data.yearHeatmap.map((day, i) => {
          const week = Math.floor(i / 7);
          const dow = i % 7;
          const intensity = day.intensity;
          const r = Math.round(22 + intensity * 0);
          const g = Math.round(34 + intensity * 163);
          const b = Math.round(34 + intensity * 56);
          return (
            <Rect
              key={i}
              x={week * (size + gap)}
              y={dow * (size + gap)}
              width={size}
              height={size}
              rx={2}
              fill={`rgb(${r},${g},${b})`}
              opacity={intensity > 0 ? 0.4 + intensity * 0.6 : 0.1}
            />
          );
        })}
      </Svg>
    </Card>
  );
}

export function MuscleFocusCard({ data }: { data: FlexData }) {
  return (
    <Card title="Muscle Focus">
      {data.topMuscles.map((m, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: m.color }} />
          <Text style={{ color: "#e5e5e5", fontSize: 13, flex: 1 }}>{m.muscle}</Text>
          <Text style={{ color: "#888", fontSize: 12 }}>{m.sets} sets</Text>
        </View>
      ))}
    </Card>
  );
}

export function TopFlexExercisesCard({ data }: { data: FlexData }) {
  const maxSessions = Math.max(...data.topExercises.map((e) => e.sessions), 1);
  return (
    <Card title="Top Exercises">
      {data.topExercises.map((e, i) => (
        <View key={i} style={{ marginTop: 6 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#e5e5e5", fontSize: 13 }}>{e.name}</Text>
            <Text style={{ color: "#888", fontSize: 12 }}>{e.sessions}x</Text>
          </View>
          <View style={{ height: 4, backgroundColor: "#222", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
            <View style={{ height: "100%", width: `${(e.sessions / maxSessions) * 100}%`, backgroundColor: "#3b82f6", borderRadius: 2 }} />
          </View>
        </View>
      ))}
    </Card>
  );
}

export function PersonalRecordsCard({ data }: { data: FlexData }) {
  return (
    <Card title="Personal Records">
      <Text style={{ color: "#fbbf24", fontSize: 36, fontWeight: "800", textAlign: "center", marginTop: 8 }}>
        {data.totalPrs}
      </Text>
      <Text style={{ color: "#888", fontSize: 13, textAlign: "center", marginTop: 4 }}>
        total PRs achieved
      </Text>
    </Card>
  );
}

export function StreakCard({ data }: { data: FlexData }) {
  return (
    <Card title="Consistency">
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 8 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#22c55e", fontSize: 28, fontWeight: "800" }}>{data.streak.current}</Text>
          <Text style={{ color: "#888", fontSize: 12, marginTop: 2 }}>Current Streak</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#fbbf24", fontSize: 28, fontWeight: "800" }}>{data.streak.longest}</Text>
          <Text style={{ color: "#888", fontSize: 12, marginTop: 2 }}>Best Streak</Text>
        </View>
      </View>
    </Card>
  );
}

// Shared
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        width: CARD_WIDTH,
        backgroundColor: "#161616",
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
      <Text style={{ color: "#888", fontSize: 13 }}>{label}</Text>
      <Text style={{ color: "#e5e5e5", fontSize: 13, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}

function formatVol(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M kg`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k kg`;
  return `${v} kg`;
}
