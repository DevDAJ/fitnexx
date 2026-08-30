import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseSuggestions } from "../../components/ExerciseSuggestions";
import { ExerciseBlock } from "../../components/logging/ExerciseBlock";
import { ExercisePicker } from "../../components/logging/ExercisePicker";
import { RestTimer } from "../../components/logging/RestTimer";
import { SessionCard } from "../../components/logging/SessionCard";
import { TemplatePicker } from "../../components/logging/TemplatePicker";
import { ScheduleSetup } from "../../components/ScheduleSetup";
import { ExerciseInfoSheet } from "../../components/shared/ExerciseInfoSheet";
import { SegmentedControl } from "../../components/shared/SegmentedControl";
import { useToast } from "../../components/shared/Toast";
import { TodaySchedule } from "../../components/TodaySchedule";
import { detectPrs } from "../../lib/analysis/prDetection";
import { isExerciseAvailable } from "../../lib/gyms";
import { useAppStore } from "../../lib/store";
import { saveWorkoutAsTemplate } from "../../lib/templates";
import type {
  ExerciseAsset,
  ExerciseEntry,
  Gym,
  Workout,
  WorkoutSet,
  WorkoutTemplate,
} from "../../lib/types";
import { useExerciseEquipment } from "../../lib/useExerciseEquipment";

export default function LoggingScreen() {
  const insets = useSafeAreaInsets();
  const workouts = useAppStore((s) => s.workouts);
  const addWorkout = useAppStore((s) => s.addWorkout);
  const currentGym = useAppStore((s) => s.currentGym);
  const toast = useToast();
  const router = useRouter();
  const { equipment, byName } = useExerciseEquipment();
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showScheduleSetup, setShowScheduleSetup] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<"log" | "history">("log");
  const [infoItem, setInfoItem] = useState<ExerciseAsset | null>(null);
  const [startTime] = useState(Date.now());

  const addExercise = (asset: ExerciseAsset) => {
    const newEntry: ExerciseEntry = {
      exerciseName: asset.name,
      sets: [{ weight: 0, reps: 0, setType: "normal" }],
    };
    setExercises((e) => [...e, newEntry]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addExerciseFromTemplate = (ex: {
    exerciseName: string;
    targetSets: number;
    targetReps: number;
  }) => {
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
      (a, ex) => a + ex.sets.reduce((b, s) => b + s.weight * s.reps, 0),
      0,
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

    const prResults = detectPrs([...workouts, workout]);
    const recentPrs = prResults.filter((pr) => pr.date === workout.date);
    for (const pr of recentPrs) {
      const ex = workout.exercises.find(
        (e) => e.exerciseName === pr.exerciseName,
      );
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

    await addWorkout(workout);

    const prCount = recentPrs.length;
    if (prCount > 0) {
      toast.showToast(
        `${prCount} new PR${prCount > 1 ? "s" : ""} detected!`,
        "pr",
      );
    } else {
      toast.showToast("Workout saved!", "success");
    }

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
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
        Workouts
      </Text>

      <SegmentedControl
        options={[
          { label: "Log", value: "log" },
          { label: "History", value: "history" },
        ]}
        value={view}
        onChange={setView}
      />

      {view === "history" ? (
        workouts.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={{ color: "#666", fontSize: 15, textAlign: "center" }}>
              No workouts logged yet.
            </Text>
            <Text style={{ color: "#555", fontSize: 13, marginTop: 4 }}>
              Switch to Log and start training.
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 4 }}>
            {workouts.map((workout, wi) => {
              const isExpanded = expandedId === workout.id;
              const prevWorkout =
                wi < workouts.length - 1 ? workouts[wi + 1] : null;
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
          </View>
        )
      ) : (
        <>
          {currentGym && (
            <View
              style={{
                backgroundColor: "#102a1a",
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: "#22c55e",
              }}
            >
              <Text
                style={{ color: "#22c55e", fontSize: 13, fontWeight: "700" }}
              >
                ✓ At {currentGym.name}
              </Text>
            </View>
          )}

          <TodaySchedule onStartTemplate={handleTemplateSelect} />

          <TouchableOpacity
            onPress={() => setShowScheduleSetup(true)}
            style={{
              backgroundColor: "#161616",
              borderRadius: 10,
              padding: 14,
              borderWidth: 1,
              borderColor: "#2a2a2a",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#8b5cf6", fontSize: 14, fontWeight: "600" }}>
              Schedule
            </Text>
          </TouchableOpacity>

          {exercises.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 40,
                paddingHorizontal: 24,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
                Ready to train?
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                Add an exercise or load a template to get your sets in.
              </Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => setShowExercisePicker(true)}
                  style={{
                    backgroundColor: "#3b82f6",
                    borderRadius: 12,
                    paddingHorizontal: 22,
                    paddingVertical: 14,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}
                  >
                    + Add Exercise
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowTemplatePicker(true)}
                  style={{
                    backgroundColor: "#161616",
                    borderRadius: 12,
                    paddingHorizontal: 22,
                    paddingVertical: 14,
                    borderWidth: 1,
                    borderColor: "#2a2a2a",
                  }}
                >
                  <Text
                    style={{
                      color: "#8b5cf6",
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    Load Template
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
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
                  <Text
                    style={{
                      color: "#8b5cf6",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    Load Template
                  </Text>
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
                  <Text
                    style={{
                      color: "#f59e0b",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    Save as Template
                  </Text>
                </TouchableOpacity>
              </View>

              {exercises.map((entry, i) => {
                const missing = needsUnavailableEquipment(
                  entry,
                  currentGym,
                  equipment,
                );
                return (
                  <View key={`${entry.exerciseName}-${i}`}>
                    {missing && (
                      <View
                        style={{
                          backgroundColor: "#2a1f10",
                          borderRadius: 8,
                          padding: 8,
                          marginBottom: 4,
                          borderWidth: 1,
                          borderColor: "#f59e0b",
                        }}
                      >
                        <Text
                          style={{
                            color: "#f59e0b",
                            fontSize: 12,
                            fontWeight: "600",
                          }}
                        >
                          Needs {missing} - not at {currentGym?.name}
                        </Text>
                      </View>
                    )}
                    <ExerciseBlock
                      entry={entry}
                      exerciseIndex={i}
                      onUpdateExercise={updateExercise}
                      onRemoveExercise={removeExercise}
                      asset={byName[entry.exerciseName.toLowerCase()]}
                      onShowInfo={setInfoItem}
                    />
                  </View>
                );
              })}

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
                <Text
                  style={{ color: "#3b82f6", fontSize: 15, fontWeight: "700" }}
                >
                  + Add Exercise
                </Text>
              </TouchableOpacity>

              <RestTimer />

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
                <Text
                  style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}
                >
                  Save Workout
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    opacity: 0.8,
                    marginTop: 2,
                  }}
                >
                  {exercises.length} exercises |{" "}
                  {formatVolume(calculateTotalVolume())} volume
                </Text>
              </TouchableOpacity>

              <ExerciseSuggestions />
            </>
          )}
        </>
      )}

      <ExercisePicker
        visible={showExercisePicker}
        onSelect={addExercise}
        onClose={() => setShowExercisePicker(false)}
      />

      <ExerciseInfoSheet item={infoItem} onClose={() => setInfoItem(null)} />

      <TemplatePicker
        visible={showTemplatePicker}
        onSelect={handleTemplateSelect}
        onClose={() => setShowTemplatePicker(false)}
      />

      <ScheduleSetup
        visible={showScheduleSetup}
        onClose={() => setShowScheduleSetup(false)}
      />
    </ScrollView>
  );
}

function formatVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
}

function needsUnavailableEquipment(
  entry: ExerciseEntry,
  currentGym: Gym | null,
  equipment: Record<string, string>,
): string | null {
  if (!currentGym) return null;
  const eq = equipment[entry.exerciseName.toLowerCase()];
  if (!eq) return null;
  const asset = {
    name: entry.exerciseName,
    primaryMuscle: "",
    secondaryMuscles: [],
    category: "compound",
    equipment: eq,
  } as ExerciseAsset;
  return isExerciseAvailable(asset, currentGym.equipment) ? null : eq;
}
