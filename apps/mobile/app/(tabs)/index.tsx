import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityHeatmap } from "../../components/dashboard/ActivityHeatmap";
import InjuryRiskCard from "../../components/dashboard/InjuryRiskCard";
import IntensityEvolutionCard from "../../components/dashboard/IntensityEvolutionCard";
import { KpiCard } from "../../components/dashboard/KpiCard";
import MuscleTrendCard from "../../components/dashboard/MuscleTrendCard";
import { NutritionRecapCard } from "../../components/dashboard/NutritionRecapCard";
import { PlateauCard } from "../../components/dashboard/PlateauCard";
import PrTrendCard from "../../components/dashboard/PrTrendCard";
import { StreakCard } from "../../components/dashboard/StreakCard";
import StrengthBalanceCard from "../../components/dashboard/StrengthBalanceCard";
import TopExercisesCard from "../../components/dashboard/TopExercisesCard";
import TrainingTimelineCard from "../../components/dashboard/TrainingTimelineCard";
import VolumeDensityCard from "../../components/dashboard/VolumeDensityCard";
import { WaterCard } from "../../components/dashboard/WaterCard";
import WeeklyRhythmCard from "../../components/dashboard/WeeklyRhythmCard";
import { WeeklySetsChart } from "../../components/dashboard/WeeklySetsChart";
import { MUSCLE_COLORS } from "../../constants/muscles";
import { computeInjuryRisk } from "../../lib/analysis/injuryRisk";
import { computeIntensityEvolution } from "../../lib/analysis/intensityEvolution";
import {
  computeMuscleTrend,
  type MuscleTrendPoint,
} from "../../lib/analysis/muscleTrend";
import { detectPlateaus } from "../../lib/analysis/plateauDetection";
import { getPrCount } from "../../lib/analysis/prDetection";
import { computePrTrend } from "../../lib/analysis/prTrend";
import { computeStrengthBalance } from "../../lib/analysis/strengthBalance";
import { computeTopExercises } from "../../lib/analysis/topExercises";
import { computeTrainingTimeline } from "../../lib/analysis/trainingTimeline";
import { computeVolumeDensity } from "../../lib/analysis/volumeDensity";
import { computeWeeklyRhythm } from "../../lib/analysis/weeklyRhythm";
import { computeWeeklySets } from "../../lib/analysis/weeklySets";
import { useAppStore } from "../../lib/store";
import type { DailySummary, MuscleWeeklyData } from "../../lib/types";

const WINDOW_DAYS = 90;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const workouts = useAppStore((s) => s.workouts);
  const weightUnit = useAppStore((s) => s.weightUnit);
  const weeklySetsData = useAppStore((s) => s.weeklySetsData);
  const setWeeklySetsData = useAppStore((s) => s.setWeeklySetsData);
  const [refreshing, setRefreshing] = useState(false);

  // Computed data
  const [muscleTrendData, setMuscleTrendData] = useState<MuscleTrendPoint[]>(
    [],
  );

  const loadAll = useCallback(async () => {
    if (workouts.length === 0) return;
    const ws = await computeWeeklySets(workouts, 30, weightUnit);
    setWeeklySetsData(ws);
    const mt = await computeMuscleTrend(workouts, WINDOW_DAYS, weightUnit);
    setMuscleTrendData(mt);
  }, [workouts, weightUnit, setWeeklySetsData]);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  // KPI data
  const prCount30d = getPrCount(workouts, 30);
  const prCountPrev = getPrCount(workouts, 60) - prCount30d;
  const volume30d = getVolume30d(workouts);
  const volumePrev = getVolumePrev30d(workouts);
  const avgWeeklySets =
    weeklySetsData.length > 0
      ? weeklySetsData.reduce((a, m) => a + m.weeklySets, 0) /
        weeklySetsData.length
      : 0;

  // New analytics
  const prTrendData = computePrTrend(workouts, WINDOW_DAYS);
  const volumeDensityData = computeVolumeDensity(workouts, WINDOW_DAYS);
  const intensityData = computeIntensityEvolution(workouts, WINDOW_DAYS);
  const rhythmData = computeWeeklyRhythm(workouts);
  const topExercises = computeTopExercises(workouts, WINDOW_DAYS);
  const injuryRisk = computeInjuryRisk(workouts);
  const timeline = computeTrainingTimeline(workouts);
  const balanceFindings = computeStrengthBalance(workouts);
  const plateaus = detectPlateaus(workouts);
  const dailySummaries = buildDailySummaries(workouts);

  const prSpark = getPrSparkline(workouts);
  const volSpark = getVolumeSparkline(workouts);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 12,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3b82f6"
        />
      }
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
        Dashboard
      </Text>

      {/* KPI Row */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <KpiCard
          title="PRs"
          value={`${prCount30d}`}
          subtitle="last 30 days"
          delta={calcDelta(prCount30d, prCountPrev)}
          sparkData={prSpark}
          color="#fbbf24"
        />
        <KpiCard
          title="Volume"
          value={formatVolume(volume30d)}
          subtitle="last 30 days"
          delta={calcDelta(volume30d, volumePrev)}
          sparkData={volSpark}
          color="#3b82f6"
        />
      </View>
      <KpiCard
        title="Weekly Sets"
        value={avgWeeklySets.toFixed(1)}
        subtitle="avg sets / muscle / week"
        delta={{ value: 0, direction: "same" }}
        color="#8b5cf6"
      />

      <WaterCard />

      <StreakCard />
      <NutritionRecapCard />

      {/* Charts */}
      <PrTrendCard data={prTrendData} />
      <VolumeDensityCard data={volumeDensityData} />
      <MuscleTrendCard data={muscleTrendData} muscleColors={MUSCLE_COLORS} />
      <StrengthBalanceCard findings={balanceFindings} />
      <WeeklySetsChart data={weeklySetsData} />
      <IntensityEvolutionCard data={intensityData} />
      <WeeklyRhythmCard data={rhythmData} />
      <TopExercisesCard data={topExercises} />
      <PlateauCard plateaus={plateaus} />
      <InjuryRiskCard
        score={injuryRisk.score}
        factors={injuryRisk.factors}
        riskLevel={injuryRisk.riskLevel}
      />
      <TrainingTimelineCard
        tier={timeline.tier.name}
        tierIndex={timeline.tierIndex}
        lifetimeSets={timeline.lifetimeSets}
        progressToNext={timeline.progressToNext}
        nextTier={timeline.nextTier?.name ?? null}
        weeksToNext={timeline.weeksToNext}
      />
      <ActivityHeatmap dailySummaries={dailySummaries} />
    </ScrollView>
  );
}

// --- helpers ---

function getVolume30d(
  workouts: { totalVolume: number; date: string }[],
): number {
  const cutoff = Date.now() - 30 * 86400000;
  return workouts
    .filter((w) => new Date(w.date).getTime() >= cutoff)
    .reduce((a, w) => a + w.totalVolume, 0);
}

function getVolumePrev30d(
  workouts: { totalVolume: number; date: string }[],
): number {
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
      direction:
        pct > 0
          ? ("up" as const)
          : pct < 0
            ? ("down" as const)
            : ("same" as const),
    };
  }
  return {
    value: current > 0 ? 100 : 0,
    direction: current > 0 ? ("up" as const) : ("same" as const),
  };
}

function buildDailySummaries(
  workouts: {
    date: string;
    totalVolume: number;
    exercises: { sets: unknown[] }[];
  }[],
): DailySummary[] {
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
        workoutTitle: "",
      });
    }
  }
  return Array.from(map.values());
}

function getPrSparkline(
  workouts: { date: string; exercises: { sets: { isPr?: boolean }[] }[] }[],
): number[] {
  const weeks: number[] = [];
  for (let i = 7; i <= 35; i += 7) {
    const start = Date.now() - i * 86400000;
    const end = Date.now() - (i - 7) * 86400000;
    const count = workouts
      .filter((w) => {
        const t = new Date(w.date).getTime();
        return t >= start && t < end;
      })
      .reduce(
        (a, w) =>
          a +
          w.exercises.reduce(
            (b, e) => b + e.sets.filter((s) => s.isPr).length,
            0,
          ),
        0,
      );
    weeks.push(count);
  }
  return weeks;
}

function getVolumeSparkline(
  workouts: { date: string; totalVolume: number }[],
): number[] {
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
