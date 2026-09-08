import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { callAI } from "../lib/ai";
import { getScoreColor } from "../lib/analysis/hypertrophyScore";
import { suggestExercises } from "../lib/analysis/suggestions";
import { useAppStore } from "../lib/store";
import type { ExerciseSuggestion } from "../lib/types";

export function ExerciseSuggestions() {
  const workouts = useAppStore((s) => s.workouts);
  const currentGym = useAppStore((s) => s.currentGym);
  const weightUnit = useAppStore((s) => s.weightUnit);
  const [suggestions, setSuggestions] = useState<ExerciseSuggestion[]>([]);
  const [aiSuggestion, setAISuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (workouts.length < 3) {
      setSuggestions([]);
      setAISuggestion("");
      return;
    }
    setAISuggestion("");
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

  const askAI = async () => {
    setLoadingAI(true);
    try {
      const recentWorkouts = workouts.slice(0, 8).map((workout) => ({
        date: workout.date,
        title: workout.title,
        exercises: workout.exercises.map((exercise) => ({
          name: exercise.exerciseName,
          sets: exercise.sets.length,
        })),
      }));
      const response = await callAI([
        {
          role: "system",
          content:
            "You are a concise strength-training assistant. Based only on the supplied summary, recommend three exercises with a short reason and sets/reps. Respect available equipment. Do not diagnose or treat injuries.",
        },
        {
          role: "user",
          content: JSON.stringify({
            recentWorkouts,
            localAnalysis: suggestions,
            availableEquipment: currentGym?.equipment ?? null,
            weightUnit,
          }),
        },
      ]);
      setAISuggestion(response.content.trim());
    } catch (error) {
      Alert.alert(
        "AI suggestion unavailable",
        error instanceof Error
          ? error.message
          : "Check your AI settings and try again.",
      );
    } finally {
      setLoadingAI(false);
    }
  };

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
      {aiSuggestion ? (
        <View
          style={{
            backgroundColor: "#101010",
            borderColor: "#2a2a2a",
            borderRadius: 10,
            borderWidth: 1,
            marginTop: 4,
            padding: 12,
          }}
        >
          <Text
            style={{
              color: "#60a5fa",
              fontSize: 12,
              fontWeight: "700",
              marginBottom: 6,
            }}
          >
            AI SUGGESTION
          </Text>
          <Text style={{ color: "#d4d4d4", fontSize: 13, lineHeight: 19 }}>
            {aiSuggestion}
          </Text>
          <Text style={{ color: "#555", fontSize: 10, marginTop: 8 }}>
            General training guidance, not medical advice.
          </Text>
        </View>
      ) : null}
      <TouchableOpacity
        accessibilityRole="button"
        disabled={loadingAI}
        onPress={askAI}
        style={{
          alignItems: "center",
          backgroundColor: "#1a1a1a",
          borderColor: "#3b82f6",
          borderRadius: 10,
          borderWidth: 1,
          marginTop: 6,
          opacity: loadingAI ? 0.6 : 1,
          padding: 11,
        }}
      >
        {loadingAI ? (
          <ActivityIndicator color="#60a5fa" />
        ) : (
          <Text style={{ color: "#60a5fa", fontSize: 13, fontWeight: "700" }}>
            Ask AI for smarter suggestions
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
