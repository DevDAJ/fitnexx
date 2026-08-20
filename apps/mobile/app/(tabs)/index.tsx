import { useState, useCallback } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storage } from "../../lib/storage";
import type { Workout, DailySummary, MuscleWeeklyData } from "../../lib/types";
import { getPrCount } from "../../lib/analysis/prDetection";
import { detectPlateaus } from "../../lib/analysis/plateauDetection";
import { computeWeeklySets } from "../../lib/analysis/weeklySets";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { PlateauCard } from "../../components/dashboard/PlateauCard";
import { WeeklySetsChart } from "../../components/dashboard/WeeklySetsChart";
import { ActivityHeatmap } from "../../components/dashboard/ActivityHeatmap";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weeklySetsData, setWeeklySetsData] = useState<MuscleWeeklyData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const w = await storage.getWorkouts();
    setWorkouts(w);
    const ws = await computeWeeklySets(w, 30, "kg");
    setWeeklySetsData(ws);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const prCount30d = getPrCount(workouts, 30);
  const prCountPrev = getPrCount(workouts, 60) - prCount30d;

  const volume30d = getVolume30d(workouts);
  const volumePrev = getVolumePrev30d(workouts);

  const avgWeeklySets =
    weeklySetsData.length > 0
      ? weeklySetsData.reduce((a, m) => a + m.weeklySets, 0) / weeklySetsData.length
      : 0;

  const plateaus = detectPlateaus(workouts);
  const dailySummaries = buildDailySummaries(workouts);

  const prDelta = calcDelta(prCount30d, prCountPrev);
  const volDelta = calcDelta(volume30d, volumePrev);
  const setsDelta = { value: 0, direction: "same" as const };

  const prSpark = getPrSparkline(workouts);
  const volSpark = getVolumeSparkline(workouts);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 100, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>Dashboard</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <KpiCard
          title="PRs"
          value={`${prCount30d}`}
          subtitle="last 30 days"
          delta={prDelta}
          sparkData={prSpark}
          color="#fbbf24"
        />
        <KpiCard
          title="Volume"
          value={formatVolume(volume30d)}
          subtitle="last 30 days"
          delta={volDelta}
          sparkData={volSpark}
          color="#3b82f6"
        />
      </View>

      <KpiCard
        title="Weekly Sets"
        value={avgWeeklySets.toFixed(1)}
        subtitle="avg sets / muscle / week"
        delta={setsDelta}
        color="#8b5cf6"
      />

      <ActivityHeatmap dailySummaries={dailySummaries} />
      <WeeklySetsChart data={weeklySetsData} />
      <PlateauCard plateaus={plateaus} />
    </ScrollView>
  );
}

function getVolume30d(workouts: Workout[]): number {
  const cutoff = Date.now() - 30 * 86400000;
  return workouts
    .filter((w) => new Date(w.date).getTime() >= cutoff)
    .reduce((a, w) => a + w.totalVolume, 0);
}

function getVolumePrev30d(workouts: Workout[]): number {
  const now = Date.now();
  const start = now - 60 * 86400000;
  const end = now - 30 * 86400000;
  return workouts
    .filter((w) => {
      const t = new Date(w.date).getTime();
      return t >= start && t < end;
    })
    .reduce((a, w) => a + w.totalVolume, 0);
}

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
}

function calcDelta(current: number, previous: number) {
  if (previous > 0) {
    const pct = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(pct),
      direction: pct > 0 ? ("up" as const) : pct < 0 ? ("down" as const) : ("same" as const),
    };
  }
  return { value: current > 0 ? 100 : 0, direction: current > 0 ? ("up" as const) : ("same" as const) };
}

function buildDailySummaries(workouts: Workout[]): DailySummary[] {
  const map = new Map<string, DailySummary>();
  for (const w of workouts) {
    const date = w.date.split("T")[0];
    const existing = map.get(date);
    if (existing) {
      existing.totalVolume += w.totalVolume;
      existing.sets += w.exercises.reduce((a, e) => a + e.sets.length, 0);
    } else {
      map.set(date, {
        date,
        totalVolume: w.totalVolume,
        sets: w.exercises.reduce((a, e) => a + e.sets.length, 0),
        workoutTitle: w.title,
      });
    }
  }
  return Array.from(map.values());
}

function getPrSparkline(workouts: Workout[]): number[] {
  const weeks: number[] = [];
  for (let i = 7; i <= 35; i += 7) {
    const start = Date.now() - i * 86400000;
    const end = Date.now() - (i - 7) * 86400000;
    const count = workouts
      .filter((w) => {
        const t = new Date(w.date).getTime();
        return t >= start && t < end;
      })
      .reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.filter((s) => s.isPr).length, 0), 0);
    weeks.push(count);
  }
  return weeks;
}

function getVolumeSparkline(workouts: Workout[]): number[] {
  const weeks: number[] = [];
  for (let i = 7; i <= 35; i += 7) {
    const start = Date.now() - i * 86400000;
    const end = Date.now() - (i - 7) * 86400000;
    const vol = workouts
      .filter((w) => {
        const t = new Date(w.date).getTime();
        return t >= start && t < end;
      })
      .reduce((a, w) => a + w.totalVolume, 0);
    weeks.push(vol);
  }
  return weeks;
}
