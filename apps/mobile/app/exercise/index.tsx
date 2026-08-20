import { useMemo, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppStore } from "../../lib/store";
import { analyzeExerciseTrend } from "../../lib/analysis/exerciseTrend";
import { Badge } from "../../components/shared/Badge";

const TREND_VARIANT: Record<string, "improving" | "plateau" | "regression" | "new"> = {
  overload: "improving",
  stagnant: "plateau",
  regression: "regression",
  new: "new",
};

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const workouts = useAppStore((s) => s.workouts);
  const [search, setSearch] = useState("");

  const exercises = useMemo(() => {
    const names = new Set<string>();
    for (const w of workouts) {
      for (const e of w.exercises) names.add(e.exerciseName);
    }

    return Array.from(names)
      .map((name) => {
        const trend = analyzeExerciseTrend(name, workouts);
        const sessions = workouts.filter((w) => w.exercises.some((e) => e.exerciseName === name)).length;
        return { name, trend, sessions };
      })
      .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.sessions - a.sessions);
  }, [workouts, search]);

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
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>Exercises</Text>

      <TextInput
        placeholder="Search exercises..."
        placeholderTextColor="#555"
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: "#161616",
          borderRadius: 10,
          padding: 12,
          color: "#fff",
          fontSize: 14,
          borderWidth: 1,
          borderColor: "#2a2a2a",
        }}
      />

      {exercises.length === 0 && (
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <Text style={{ color: "#666", fontSize: 15 }}>No exercises found.</Text>
        </View>
      )}

      {exercises.map((ex) => (
        <TouchableOpacity
          key={ex.name}
          onPress={() => router.push(`/exercise/${encodeURIComponent(ex.name)}`)}
          activeOpacity={0.7}
          style={{
            backgroundColor: "#161616",
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: "#222",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#e5e5e5", fontSize: 14, fontWeight: "600" }}>{ex.name}</Text>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
              {ex.sessions} sessions
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Badge label={ex.trend.status} variant={TREND_VARIANT[ex.trend.status] ?? "neutral"} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
