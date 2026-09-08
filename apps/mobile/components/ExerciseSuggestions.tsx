import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getScoreColor } from "../lib/analysis/hypertrophyScore";
import { suggestExercises } from "../lib/analysis/suggestions";
import { useAppStore } from "../lib/store";
import type { ExerciseSuggestion } from "../lib/types";

export function ExerciseSuggestions() {
  const workouts = useAppStore((s) => s.workouts);
  const currentGym = useAppStore((s) => s.currentGym);
  const weightUnit = useAppStore((s) => s.weightUnit);
  const [suggestions, setSuggestions] = useState<ExerciseSuggestion[]>([]);

  useEffect(() => {
    if (workouts.length < 3) return;
    let active = true;
    suggestExercises(workouts, weightUnit, currentGym?.equipment)
      .then((result) => {
        if (active) setSuggestions(result);
      })
      .catch(() => {
        if (active) setSuggestions([]);
      });
    return () => {
      active = false;
    };
  }, [workouts, weightUnit, currentGym]);

  if (suggestions.length === 0) return null;

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
        {currentGym ? `Suggestions at ${currentGym.name}` : "Suggestions"}
      </Text>
      {suggestions.map((s) => (
        <View key={s.muscle} style={{ marginBottom: 10 }}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
            {s.muscle}{" "}
            <Text style={{ color: "#888", fontWeight: "400" }}>
              -- {s.reason}
            </Text>
          </Text>
          <Text style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
            <Text style={{ color: getScoreColor(s.score), fontWeight: "600" }}>
              {s.scoreLabel} {s.score}/100
            </Text>
            {` | ${s.weeklySets} sets/week`}
          </Text>
          {s.plateau && (
            <Text style={{ color: "#f59e0b", fontSize: 12, marginTop: 2 }}>
              Plateau: {s.plateau.exerciseName} for{" "}
              {s.plateau.sessionsSinceProgress} sessions
            </Text>
          )}
          <Text style={{ color: "#3b82f6", fontSize: 13, marginTop: 2 }}>
            Try:{" "}
            {s.exercises.map((e, i) => (
              <Text key={e.name}>
                {e.name}
                {["body only", "bodyweight", "body weight"].includes(
                  e.equipment?.trim().toLowerCase() ?? "",
                )
                  ? " (bodyweight)"
                  : ""}
                {i < s.exercises.length - 1 ? ", " : ""}
              </Text>
            ))}
          </Text>
        </View>
      ))}
    </View>
  );
}
