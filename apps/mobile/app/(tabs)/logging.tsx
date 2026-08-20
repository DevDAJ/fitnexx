import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { storage } from "../../lib/storage";
import type { Workout, ExerciseEntry, WorkoutSet, WorkoutTemplate, ExerciseAsset } from "../../lib/types";
import { detectPrs } from "../../lib/analysis/prDetection";
import { getExerciseByName } from "../../constants/exercises";
import { saveWorkoutAsTemplate } from "../../lib/templates";
import { ExerciseBlock } from "../../components/logging/ExerciseBlock";
import { ExercisePicker } from "../../components/logging/ExercisePicker";
import { RestTimer } from "../../components/logging/RestTimer";
import { TemplatePicker } from "../../components/logging/TemplatePicker";

export default function LoggingScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [startTime] = useState(Date.now());
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);

  useFocusEffect(
    useCallback(() => {
      storage.getWorkouts().then(setAllWorkouts);
    }, [])
  );

  const addExercise = (asset: ExerciseAsset) => {
    const newEntry: ExerciseEntry = {
      exerciseName: asset.name,
      sets: [{ weight: 0, reps: 0, setType: "normal" }],
    };
    setExercises((e) => [...e, newEntry]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addExerciseFromTemplate = (ex: { exerciseName: string; targetSets: number; targetReps: number }) => {
    const sets: WorkoutSet[] = Array.from({ length: ex.targetSets }, () => ({
      weight: 0,
      reps: ex.targetReps,
      setType: "normal" as const,
    }));
    return { exerciseName: ex.exerciseName, sets };
  };

  const updateExercise = (index: number, entry: ExerciseEntry) => {
    setExercises((e) => {
      const copy = [...e];
      copy[index] = entry;
      return copy;
    });
  };

  const removeExercise = (index: number) => {
    setExercises((e) => e.filter((_, i) => i !== index));
  };

  const calculateTotalVolume = (): number => {
    return exercises.reduce(
      (a, ex) =>
        a + ex.sets.reduce((b, s) => b + s.weight * s.reps, 0),
      0
    );
  };

  const saveWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert("Empty Workout", "Add at least one exercise.");
      return;
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const workout: Workout = {
      id: `w_${Date.now()}`,
      date: new Date().toISOString(),
      title: title || `Workout ${new Date().toLocaleDateString()}`,
      exercises,
      duration,
      totalVolume: calculateTotalVolume(),
    };

    // Detect PRs
    const prResults = detectPrs([...allWorkouts, workout]);
    const recentPrs = prResults.filter(
      (pr) => pr.date === workout.date
    );
    for (const pr of recentPrs) {
      const ex = workout.exercises.find((e) => e.exerciseName === pr.exerciseName);
      if (ex) {
        for (const set of ex.sets) {
          if (!set.isPr) {
            set.isPr = true;
            set.prTypes = [pr.prType];
            break;
          }
        }
      }
    }

    await storage.saveWorkout(workout);

    const prCount = recentPrs.length;
    Alert.alert(
      "Workout Saved",
      prCount > 0 ? `${prCount} new PR${prCount > 1 ? "s" : ""} detected!` : "Great workout!",
      [{ text: "OK" }]
    );

    setExercises([]);
    setTitle("");
  };

  const handleTemplateSelect = (template: WorkoutTemplate) => {
    const newExercises = template.exercises.map(addExerciseFromTemplate);
    setExercises(newExercises);
    setTitle(template.name);
  };

  const saveAsTemplate = async () => {
    if (exercises.length === 0) {
      Alert.alert("Empty Workout", "Add exercises first.");
      return;
    }
    const workout: Workout = {
      id: `tmp_${Date.now()}`,
      date: new Date().toISOString(),
      title: title || "Template",
      exercises,
      duration: 0,
      totalVolume: 0,
    };
    await saveWorkoutAsTemplate(workout, title || "Untitled Template");
    Alert.alert("Saved", "Template saved!");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0a" }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 12,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>Log Workout</Text>

      <TextInput
        placeholder="Workout title (optional)"
        placeholderTextColor="#555"
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: "#161616",
          borderRadius: 10,
          padding: 14,
          color: "#fff",
          fontSize: 16,
          borderWidth: 1,
          borderColor: "#2a2a2a",
        }}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          onPress={() => setShowTemplatePicker(true)}
          style={{
            flex: 1,
            backgroundColor: "#161616",
            borderRadius: 10,
            padding: 14,
            borderWidth: 1,
            borderColor: "#2a2a2a",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#8b5cf6", fontSize: 14, fontWeight: "600" }}>Load Template</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveAsTemplate}
          style={{
            flex: 1,
            backgroundColor: "#161616",
            borderRadius: 10,
            padding: 14,
            borderWidth: 1,
            borderColor: "#2a2a2a",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#f59e0b", fontSize: 14, fontWeight: "600" }}>Save as Template</Text>
        </TouchableOpacity>
      </View>

      {exercises.map((entry, i) => (
        <ExerciseBlock
          key={`${entry.exerciseName}-${i}`}
          entry={entry}
          exerciseIndex={i}
          onUpdateExercise={updateExercise}
          onRemoveExercise={removeExercise}
        />
      ))}

      <TouchableOpacity
        onPress={() => setShowExercisePicker(true)}
        style={{
          backgroundColor: "#161616",
          borderRadius: 14,
          padding: 16,
          borderWidth: 1,
          borderColor: "#3b82f6",
          borderStyle: "dashed",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#3b82f6", fontSize: 15, fontWeight: "700" }}>+ Add Exercise</Text>
      </TouchableOpacity>

      <RestTimer />

      {exercises.length > 0 && (
        <TouchableOpacity
          onPress={saveWorkout}
          style={{
            backgroundColor: "#22c55e",
            borderRadius: 14,
            padding: 18,
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>
            Save Workout
          </Text>
          <Text style={{ color: "#fff", fontSize: 13, opacity: 0.8, marginTop: 2 }}>
            {exercises.length} exercises | {formatVolume(calculateTotalVolume())} volume
          </Text>
        </TouchableOpacity>
      )}

      <ExercisePicker
        visible={showExercisePicker}
        onSelect={addExercise}
        onClose={() => setShowExercisePicker(false)}
      />

      <TemplatePicker
        visible={showTemplatePicker}
        onSelect={handleTemplateSelect}
        onClose={() => setShowTemplatePicker(false)}
      />
    </ScrollView>
  );
}

function formatVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
}
