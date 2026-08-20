import { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppStore } from "../../lib/store";
import type { Workout, WorkoutSet } from "../../lib/types";
import { SET_TYPE_COLORS, SET_TYPE_LABELS } from "../../lib/types";
import { Badge } from "../../components/shared/Badge";
import { Sparkline } from "../../components/shared/Sparkline";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const workouts = useAppStore((s) => s.workouts);
  const loadAll = useAppStore((s) => s.loadAll);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
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

      {workouts.map((workout, wi) => {
        const isExpanded = expandedId === workout.id;
        const prevWorkout = wi < workouts.length - 1 ? workouts[wi + 1] : null;

        return (
          <SessionCard
            key={workout.id}
            workout={workout}
            prevWorkout={prevWorkout}
            isExpanded={isExpanded}
            onToggle={() => setExpandedId(isExpanded ? null : workout.id)}
            onExercisePress={(name) => router.push(`/exercise/${encodeURIComponent(name)}`)}
          />
        );
      })}
    </ScrollView>
  );
}

function SessionCard({
  workout,
  prevWorkout,
  isExpanded,
  onToggle,
  onExercisePress,
}: {
  workout: Workout;
  prevWorkout: Workout | null;
  isExpanded: boolean;
  onToggle: () => void;
  onExercisePress: (name: string) => void;
}) {
  const date = new Date(workout.date);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const durationMin = Math.floor(workout.duration / 60);
  const prCount = workout.exercises.reduce((a, e) => a + e.sets.filter((s) => s.isPr).length, 0);

  // Delta vs previous session
  const delta = prevWorkout
    ? {
        volume: workout.totalVolume - prevWorkout.totalVolume,
        exercises: workout.exercises.length - prevWorkout.exercises.length,
      }
    : null;

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#e5e5e5", fontSize: 16, fontWeight: "700" }}>{workout.title}</Text>
          <Text style={{ color: "#666", fontSize: 13, marginTop: 2 }}>{dayName}, {dateStr}</Text>
        </View>
        {prCount > 0 && <Badge label={`${prCount} PR${prCount > 1 ? "s" : ""}`} variant="pr" />}
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: "row", gap: 14, marginTop: 10, alignItems: "center" }}>
        <Text style={{ color: "#888", fontSize: 12 }}>{workout.exercises.length} exercises</Text>
        <Text style={{ color: "#888", fontSize: 12 }}>{formatVolume(workout.totalVolume)} vol</Text>
        {durationMin > 0 && <Text style={{ color: "#888", fontSize: 12 }}>{durationMin}m</Text>}

        {/* Delta badge */}
        {delta && delta.volume !== 0 && (
          <View
            style={{
              backgroundColor: delta.volume > 0 ? "#22c55e15" : "#ef444415",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                color: delta.volume > 0 ? "#22c55e" : "#ef4444",
                fontSize: 11,
                fontWeight: "600",
              }}
            >
              {delta.volume > 0 ? "+" : ""}{formatVolume(Math.abs(delta.volume))} vs prev
            </Text>
          </View>
        )}
      </View>

      {/* Expanded content */}
      {isExpanded && (
        <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: "#222", paddingTop: 12 }}>
          {workout.exercises.map((ex, ei) => (
            <View key={ei}>
              {ei > 0 && <View style={{ height: 1, backgroundColor: "#222", marginVertical: 8 }} />}
              <TouchableOpacity
                onPress={() => onExercisePress(ex.exerciseName)}
                activeOpacity={0.6}
              >
                <Text style={{ color: "#3b82f6", fontSize: 14, fontWeight: "600" }}>
                  {ex.exerciseName}
                </Text>
              </TouchableOpacity>
              {ex.sets.map((set, si) => (
                <SetRow key={si} set={set} index={si} />
              ))}
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

function SetRow({ set, index }: { set: WorkoutSet; index: number }) {
  const isSpecialType = set.setType !== "normal";
  const typeColor = SET_TYPE_COLORS[set.setType] || "#666";
  const typeLabel = SET_TYPE_LABELS[set.setType] || set.setType;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
        paddingLeft: 8,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#666", fontSize: 12, width: 18 }}>{index + 1}.</Text>

      <Text style={{ color: "#aaa", fontSize: 12 }}>
        {set.weight > 0 ? `${set.weight}kg` : "BW"} x {set.reps}
      </Text>

      {set.rpe != null && (
        <Text style={{ color: "#666", fontSize: 11 }}>RPE {set.rpe}</Text>
      )}

      {isSpecialType && (
        <View
          style={{
            backgroundColor: typeColor + "20",
            paddingHorizontal: 5,
            paddingVertical: 1,
            borderRadius: 3,
          }}
        >
          <Text style={{ color: typeColor, fontSize: 10, fontWeight: "600" }}>
            {typeLabel}
          </Text>
        </View>
      )}

      {set.isPr && (
        <Text style={{ color: "#fbbf24", fontSize: 11, fontWeight: "700" }}>PR</Text>
      )}
    </View>
  );
}

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
}
