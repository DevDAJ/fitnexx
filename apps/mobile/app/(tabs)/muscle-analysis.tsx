import { useState, useCallback, useMemo } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../../lib/store";
import type { Muscle } from "../../constants/muscles";
import { MUSCLES, MUSCLE_COLORS } from "../../constants/muscles";
import { computeMuscleAchievements, type MuscleAchievement } from "../../lib/analysis/muscleAchievement";
import { computeWeeklySets } from "../../lib/analysis/weeklySets";
import { BodyMap } from "../../components/muscle/BodyMap";
import { MuscleDetail } from "../../components/muscle/MuscleDetail";

export default function MuscleAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const workouts = useAppStore((s) => s.workouts);
  const weightUnit = useAppStore((s) => s.weightUnit);
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [achievements, setAchievements] = useState<MuscleAchievement[]>([]);
  const [weeklySetsMap, setWeeklySetsMap] = useState<Map<string, { weeklySets: number; hypertrophyScore: number }>>(new Map());
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (workouts.length === 0) return;
    const [ach, ws] = await Promise.all([
      computeMuscleAchievements(workouts),
      computeWeeklySets(workouts, 30, weightUnit),
    ]);
    setAchievements(ach);
    const map = new Map<string, { weeklySets: number; hypertrophyScore: number }>();
    for (const m of ws) map.set(m.muscle, { weeklySets: m.weeklySets, hypertrophyScore: m.hypertrophyScore });
    setWeeklySetsMap(map);
  }, [workouts, weightUnit]);

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

  const selectedData = useMemo(() => {
    if (!selectedMuscle) return null;
    return achievements.find((a) => a.muscle === selectedMuscle) ?? null;
  }, [selectedMuscle, achievements]);

  const sortedAchievements = useMemo(
    () => [...achievements].sort((a, b) => b.lifetimeSets - a.lifetimeSets),
    [achievements]
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 12,
      }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>Muscles</Text>

      {workouts.length === 0 ? (
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <Text style={{ color: "#666", fontSize: 15 }}>No workout data yet.</Text>
        </View>
      ) : (
        <>
          {/* Body Map */}
          <BodyMap
            muscleData={weeklySetsMap}
            onSelectMuscle={(m) => setSelectedMuscle(m === selectedMuscle ? null : m)}
            selectedMuscle={selectedMuscle}
          />

          {/* Selected Muscle Detail */}
          {selectedData && (
            <MuscleDetail
              muscle={selectedData.muscle}
              lifetimeSets={selectedData.lifetimeSets}
              tierName={selectedData.tierName}
              tierIcon={selectedData.tierIcon}
              progressToNext={selectedData.progressToNext}
              hypertrophyScore={selectedData.hypertrophyScore}
            />
          )}

          {/* All Muscles List */}
          <View style={{ backgroundColor: "#161616", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#222" }}>
            <Text style={{ color: "#888", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>
              All Muscles
            </Text>
            {sortedAchievements.map((ach) => (
              <View
                key={ach.muscle}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#222",
                }}
              >
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: MUSCLE_COLORS[ach.muscle], marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#e5e5e5", fontSize: 13, fontWeight: "600" }}>{ach.muscle}</Text>
                  <Text style={{ color: "#666", fontSize: 11 }}>{ach.lifetimeSets} sets</Text>
                </View>
                <Text style={{ fontSize: 16, marginRight: 8 }}>{ach.tierIcon}</Text>
                <Text style={{ color: "#888", fontSize: 12 }}>{ach.tierName}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}
