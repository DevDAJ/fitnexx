import { View, Text, ScrollView, Dimensions } from "react-native";
import type { DailySummary } from "../../lib/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CELL_SIZE = 13;
const CELL_GAP = 3;
const MONTHS_TO_SHOW = 6;

function getColor(intensity: number): string {
  if (intensity === 0) return "#1a1a1a";
  if (intensity < 0.25) return "#0e4429";
  if (intensity < 0.5) return "#006d32";
  if (intensity < 0.75) return "#26a641";
  return "#39d353";
}

export function ActivityHeatmap({ dailySummaries }: { dailySummaries: DailySummary[] }) {
  if (dailySummaries.length === 0) {
    return (
      <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase" }}>
          Activity
        </Text>
        <Text style={{ color: "#666", fontSize: 14, marginTop: 10 }}>
          No activity yet. Start logging!
        </Text>
      </View>
    );
  }

  const summaryMap = new Map(dailySummaries.map((s) => [s.date, s]));
  const maxVolume = Math.max(...dailySummaries.map((s) => s.totalVolume));

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - MONTHS_TO_SHOW * 30);

  const weeks: { date: Date; count: number; intensity: number }[][] = [];
  let currentWeek: { date: Date; count: number; intensity: number }[] = [];

  const d = new Date(startDate);
  while (d <= today) {
    const dateStr = d.toISOString().split("T")[0];
    const summary = summaryMap.get(dateStr);
    const count = summary?.sets || 0;
    const intensity = maxVolume > 0 ? (summary?.totalVolume || 0) / maxVolume : 0;

    currentWeek.push({ date: new Date(d), count, intensity });

    if (d.getDay() === 6 || d.getTime() >= today.getTime()) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    d.setDate(d.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const totalDays = dailySummaries.length;
  const totalWeeks = Math.round(MONTHS_TO_SHOW * 30 / 7);
  const consistency = Math.round((totalDays / Math.max(totalWeeks, 1)) * 100);

  return (
    <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Activity
        </Text>
        <Text style={{ color: "#666", fontSize: 12 }}>
          {consistency}% consistency
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: CELL_GAP }}>
          {weeks.map((week, wi) => (
            <View key={wi} style={{ gap: CELL_GAP }}>
              {week.map((day, di) => (
                <View
                  key={di}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: 3,
                    backgroundColor: getColor(day.intensity),
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10, alignSelf: "flex-end" }}>
        <Text style={{ color: "#666", fontSize: 10 }}>Less</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((i) => (
          <View key={i} style={{ width: 11, height: 11, borderRadius: 2, backgroundColor: getColor(i) }} />
        ))}
        <Text style={{ color: "#666", fontSize: 10 }}>More</Text>
      </View>
    </View>
  );
}
