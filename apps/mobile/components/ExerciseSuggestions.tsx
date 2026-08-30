import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { suggestExercises } from "../lib/analysis/suggestions";
import { isExerciseAvailable } from "../lib/gyms";
import { useAppStore } from "../lib/store";
import type { ExerciseAsset, ExerciseSuggestion } from "../lib/types";
import { useExerciseEquipment } from "../lib/useExerciseEquipment";

export function ExerciseSuggestions() {
  const workouts = useAppStore((s) => s.workouts);
  const currentGym = useAppStore((s) => s.currentGym);
  const { equipment } = useExerciseEquipment();
  const [suggestions, setSuggestions] = useState<ExerciseSuggestion[]>([]);

  useEffect(() => {
    if (workouts.length < 3) return;
    suggestExercises(workouts).then(setSuggestions);
  }, [workouts]);

  if (suggestions.length === 0) return null;

  const missingEquipment = (name: string): string | null => {
    if (!currentGym) return null;
    const eq = equipment[name.toLowerCase()];
    if (!eq) return null;
    const asset = {
      name,
      primaryMuscle: "",
      secondaryMuscles: [],
      category: "compound",
      equipment: eq,
    } as ExerciseAsset;
    return isExerciseAvailable(asset, currentGym.equipment) ? null : eq;
  };

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <Text
        style={{
          color: "#f59e0b",
          fontSize: 14,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        Suggestions
      </Text>
      {suggestions.map((s) => (
        <View key={s.muscle} style={{ marginBottom: 10 }}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
            {s.muscle}{" "}
            <Text style={{ color: "#888", fontWeight: "400" }}>
              -- {s.reason}
            </Text>
          </Text>
          <Text style={{ color: "#3b82f6", fontSize: 13, marginTop: 2 }}>
            Try:{" "}
            {s.exercises.map((e, i) => {
              const missing = missingEquipment(e.name);
              return (
                <Text
                  key={e.name}
                  style={missing ? { color: "#f59e0b" } : undefined}
                >
                  {e.name}
                  {missing ? ` (needs ${missing})` : ""}
                  {i < s.exercises.length - 1 ? ", " : ""}
                </Text>
              );
            })}
          </Text>
        </View>
      ))}
    </View>
  );
}
