import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionCard } from "../components/logging/SessionCard";
import { useAppStore } from "../lib/store";

export default function AllWorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const workouts = useAppStore((s) => s.workouts);
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 4,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ color: "#3b82f6", fontSize: 16 }}>&larr; Back</Text>
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
          All Workouts
        </Text>
      </View>
      <Text style={{ color: "#666", fontSize: 13, marginBottom: 4 }}>
        {workouts.length} workout{workouts.length !== 1 ? "s" : ""} logged
      </Text>

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
            onExercisePress={(name) =>
              router.push(`/exercise/${encodeURIComponent(name)}`)
            }
          />
        );
      })}
    </ScrollView>
  );
}
