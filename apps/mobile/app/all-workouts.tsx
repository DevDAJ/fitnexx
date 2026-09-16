import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionCard } from "../components/logging/SessionCard";
import { ScreenTitle } from "../components/shared/ui";
import { useAppStore } from "../lib/store";
import { colors, fontSizes, spacing } from "../lib/theme";

export default function AllWorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const workouts = useAppStore((s) => s.workouts);
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: spacing.screen,
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
          <Text style={{ color: colors.brand, fontSize: fontSizes.md }}>
            &larr; Back
          </Text>
        </TouchableOpacity>
        <ScreenTitle>All Workouts</ScreenTitle>
      </View>
      <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 4 }}>
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
