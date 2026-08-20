import { useState, useCallback } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../../lib/store";
import { computeFlexData, type FlexData } from "../../lib/analysis/flexData";
import {
  VolumeComparisonCard,
  BestMonthCard,
  SummaryCard,
  YearHeatmapCard,
  MuscleFocusCard,
  TopFlexExercisesCard,
  PersonalRecordsCard,
  StreakCard,
} from "../../components/flex/FlexCards";

export default function FlexScreen() {
  const insets = useSafeAreaInsets();
  const workouts = useAppStore((s) => s.workouts);
  const [flexData, setFlexData] = useState<FlexData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (workouts.length === 0) return;
    const data = await computeFlexData(workouts);
    setFlexData(data);
  }, [workouts]);

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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 16,
        alignItems: "center",
      }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", alignSelf: "flex-start" }}>Flex</Text>

      {workouts.length === 0 ? (
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <Text style={{ color: "#666", fontSize: 15 }}>No workout data yet.</Text>
        </View>
      ) : flexData ? (
        <>
          <SummaryCard data={flexData} />
          <StreakCard data={flexData} />
          <PersonalRecordsCard data={flexData} />
          <YearHeatmapCard data={flexData} />
          <VolumeComparisonCard data={flexData} />
          <BestMonthCard data={flexData} />
          <MuscleFocusCard data={flexData} />
          <TopFlexExercisesCard data={flexData} />
        </>
      ) : null}
    </ScrollView>
  );
}
