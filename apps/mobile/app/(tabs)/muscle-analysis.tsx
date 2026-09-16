import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BodyMap } from "../../components/muscle/BodyMap";
import { MuscleDetail } from "../../components/muscle/MuscleDetail";
import { Card, ScreenTitle, SectionLabel } from "../../components/shared/ui";
import type { Muscle } from "../../constants/muscles";
import { MUSCLE_COLORS } from "../../constants/muscles";
import {
  computeMuscleAchievements,
  type MuscleAchievement,
} from "../../lib/analysis/muscleAchievement";
import { computeWeeklySets } from "../../lib/analysis/weeklySets";
import { useAppStore } from "../../lib/store";
import { colors, fontSizes, spacing } from "../../lib/theme";

export default function MuscleAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const workouts = useAppStore((s) => s.workouts);
  const weightUnit = useAppStore((s) => s.weightUnit);
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [achievements, setAchievements] = useState<MuscleAchievement[]>([]);
  const [weeklySetsMap, setWeeklySetsMap] = useState<
    Map<string, { weeklySets: number; hypertrophyScore: number }>
  >(new Map());
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (workouts.length === 0) return;
    const [ach, ws] = await Promise.all([
      computeMuscleAchievements(workouts),
      computeWeeklySets(workouts, 30, weightUnit),
    ]);
    setAchievements(ach);
    const map = new Map<
      string,
      { weeklySets: number; hypertrophyScore: number }
    >();
    for (const m of ws)
      map.set(m.muscle, {
        weeklySets: m.weeklySets,
        hypertrophyScore: m.hypertrophyScore,
      });
    setWeeklySetsMap(map);
  }, [workouts, weightUnit]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
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
    [achievements],
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: spacing.screen,
        paddingBottom: 100,
        gap: 12,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.brand}
        />
      }
    >
      <ScreenTitle>Muscles</ScreenTitle>

      {workouts.length === 0 ? (
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <Text style={{ color: colors.textMuted, fontSize: fontSizes.sm }}>
            No workout data yet.
          </Text>
        </View>
      ) : (
        <>
          {/* Body Map */}
          <BodyMap
            muscleData={weeklySetsMap}
            onSelectMuscle={(m) =>
              setSelectedMuscle(m === selectedMuscle ? null : m)
            }
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
          <Card>
            <SectionLabel>All Muscles</SectionLabel>
            {sortedAchievements.map((ach) => (
              <View
                key={ach.muscle}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: MUSCLE_COLORS[ach.muscle],
                    marginRight: 10,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {ach.muscle}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                    {ach.lifetimeSets} sets
                  </Text>
                </View>
                <Text style={{ fontSize: 16, marginRight: 8 }}>
                  {ach.tierIcon}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {ach.tierName}
                </Text>
              </View>
            ))}
          </Card>
        </>
      )}
    </ScrollView>
  );
}
