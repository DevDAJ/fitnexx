import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { callAI } from "../lib/ai";
import { getScoreColor } from "../lib/analysis/hypertrophyScore";
import { suggestExercises } from "../lib/analysis/suggestions";
import { useAppStore } from "../lib/store";
import { colors, fontSizes, radii, spacing } from "../lib/theme";
import type { ExerciseSuggestion } from "../lib/types";
import { AppButton, Card, SectionLabel } from "./shared/ui";

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
    <Card>
      <SectionLabel style={{ color: colors.warning, marginBottom: spacing.sm }}>
        {currentGym ? `Suggestions at ${currentGym.name}` : "Suggestions"}
      </SectionLabel>
      {suggestions.map((s) => (
        <View key={s.muscle} style={{ marginBottom: 10 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: fontSizes.sm,
              fontWeight: "600",
            }}
          >
            {s.muscle}{" "}
            <Text style={{ color: colors.textSecondary, fontWeight: "400" }}>
              {` · ${s.reason}`}
            </Text>
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: fontSizes.xs,
              marginTop: 2,
            }}
          >
            <Text style={{ color: getScoreColor(s.score), fontWeight: "600" }}>
              {s.scoreLabel} {s.score}/100
            </Text>
            {` | ${s.weeklySets} sets/week`}
          </Text>
          {s.plateau && (
            <Text
              style={{
                color: colors.warning,
                fontSize: fontSizes.xs,
                marginTop: 2,
              }}
            >
              Plateau: {s.plateau.exerciseName} for{" "}
              {s.plateau.sessionsSinceProgress} sessions
            </Text>
          )}
          <Text style={{ color: colors.brand, fontSize: 13, marginTop: 2 }}>
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
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.borderStrong,
            borderRadius: radii.md,
            borderWidth: 1,
            marginTop: 4,
            padding: spacing.md,
          }}
        >
          <Text
            style={{
              color: colors.brand,
              fontSize: 12,
              fontWeight: "700",
              marginBottom: 6,
            }}
          >
            AI SUGGESTION
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {aiSuggestion}
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 10,
              marginTop: spacing.sm,
            }}
          >
            General training guidance, not medical advice.
          </Text>
        </View>
      ) : null}
      <AppButton
        variant="secondary"
        disabled={loadingAI}
        onPress={askAI}
        style={{ borderColor: colors.brand, marginTop: spacing.sm }}
      >
        {loadingAI ? (
          <ActivityIndicator color={colors.brand} />
        ) : (
          <Text
            style={{ color: colors.brand, fontSize: 13, fontWeight: "700" }}
          >
            Ask AI for smarter suggestions
          </Text>
        )}
      </AppButton>
    </Card>
  );
}
