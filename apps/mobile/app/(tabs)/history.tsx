import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storage } from "../../lib/storage";
import type { Workout } from "../../lib/types";
import { Badge } from "../../components/shared/Badge";
import { Sparkline } from "../../components/shared/Sparkline";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const w = await storage.getWorkouts();
    setWorkouts(w);
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 10,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
      }
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>History</Text>
      <Text style={{ color: "#666", fontSize: 13, marginBottom: 4 }}>
        {workouts.length} workout{workouts.length !== 1 ? "s" : ""} logged
      </Text>

      {workouts.length === 0 && (
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <Text style={{ color: "#666", fontSize: 15 }}>No workouts yet.</Text>
          <Text style={{ color: "#555", fontSize: 13, marginTop: 4 }}>
            Go to the Log tab to start tracking.
          </Text>
        </View>
      )}

      {workouts.map((workout) => {
        const isExpanded = expandedId === workout.id;
        const date = new Date(workout.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const durationMin = Math.floor(workout.duration / 60);
        const prCount = workout.exercises.reduce(
          (a, e) => a + e.sets.filter((s) => s.isPr).length,
          0
        );

        return (
          <TouchableOpacity
            key={workout.id}
            onPress={() => setExpandedId(isExpanded ? null : workout.id)}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#161616",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#222",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#e5e5e5", fontSize: 16, fontWeight: "700" }}>
                  {workout.title}
                </Text>
                <Text style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
                  {dayName}, {dateStr}
                </Text>
              </View>
              {prCount > 0 && <Badge label={`${prCount} PR${prCount > 1 ? "s" : ""}`} variant="pr" />}
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginTop: 10 }}>
              <Text style={{ color: "#888", fontSize: 12 }}>
                {workout.exercises.length} exercises
              </Text>
              <Text style={{ color: "#888", fontSize: 12 }}>
                {formatVolume(workout.totalVolume)} vol
              </Text>
              {durationMin > 0 && (
                <Text style={{ color: "#888", fontSize: 12 }}>
                  {durationMin}m
                </Text>
              )}
            </View>

            {isExpanded && (
              <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: "#222", paddingTop: 12 }}>
                {workout.exercises.map((ex, ei) => (
                  <View key={ei} style={{ marginBottom: 12 }}>
                    <Text style={{ color: "#e5e5e5", fontSize: 14, fontWeight: "600" }}>
                      {ex.exerciseName}
                    </Text>
                    {ex.sets.map((set, si) => (
                      <View
                        key={si}
                        style={{
                          flexDirection: "row",
                          gap: 12,
                          marginTop: 4,
                          paddingLeft: 8,
                        }}
                      >
                        <Text style={{ color: "#666", fontSize: 12, width: 20 }}>
                          {si + 1}.
                        </Text>
                        <Text style={{ color: "#aaa", fontSize: 12 }}>
                          {set.weight > 0 ? `${set.weight}kg` : "BW"} × {set.reps}
                        </Text>
                        {set.rpe && (
                          <Text style={{ color: "#666", fontSize: 12 }}>
                            RPE {set.rpe}
                          </Text>
                        )}
                        {set.isPr && (
                          <Text style={{ color: "#fbbf24", fontSize: 11, fontWeight: "700" }}>
                            PR
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}

                <ExerciseProgressSparklines workout={workout} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function ExerciseProgressSparklines({ workout }: { workout: Workout }) {
  return null;
}

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
}
