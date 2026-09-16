import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import {
  AppButton,
  AppTextInput,
  EmptyState,
  ScreenTitle,
} from "../../components/shared/ui";
import { TodaySchedule } from "../../components/TodaySchedule";
import {
  detectPrs,
  detectSessionVolumePr,
} from "../../lib/analysis/prDetection";
import { isExerciseAvailable } from "../../lib/gyms";
import { useAppStore } from "../../lib/store";
import { saveWorkoutAsTemplate } from "../../lib/templates";
import { colors, spacing } from "../../lib/theme";
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
    const sessionPr = detectSessionVolumePr(workouts, workout);
    if (prCount > 0) {
      toast.showToast(
        `${prCount} new PR${prCount > 1 ? "s" : ""} detected!`,
        "pr",
      );
    } else if (sessionPr) {
      toast.showToast("New session volume PR!", "pr");
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
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: spacing.screen,
        paddingBottom: 100,
        gap: 12,
      }}
    >
      <ScreenTitle>Workouts</ScreenTitle>

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
          <EmptyState
            title="No workouts logged yet"
            description="Switch to Log and start training."
          />
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
                backgroundColor: colors.surfaceRaised,
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.success,
              }}
            >
              <Text
                style={{
                  color: colors.success,
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                ✓ At {currentGym.name}
              </Text>
            </View>
          )}

          <TodaySchedule onStartTemplate={handleTemplateSelect} />

          <TouchableOpacity
            onPress={() => setShowScheduleSetup(true)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 10,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: colors.brand, fontSize: 14, fontWeight: "600" }}
            >
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
              <Text
                style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}
              >
                Ready to train?
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                Add an exercise or load a template to get your sets in.
              </Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                <AppButton onPress={() => setShowExercisePicker(true)}>
                  + Add Exercise
                </AppButton>
                <AppButton
                  onPress={() => setShowTemplatePicker(true)}
                  variant="secondary"
                >
                  Load Template
                </AppButton>
              </View>
            </View>
          ) : (
            <>
              <AppTextInput
                placeholder="Workout title (optional)"
                value={title}
                onChangeText={setTitle}
              />

              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setShowTemplatePicker(true)}
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 10,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.brand,
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
                    backgroundColor: colors.surface,
                    borderRadius: 10,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.warning,
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
                          backgroundColor: colors.surfaceRaised,
                          borderRadius: 8,
                          padding: 8,
                          marginBottom: 4,
                          borderWidth: 1,
                          borderColor: colors.warning,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.warning,
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
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.brand,
                  borderStyle: "dashed",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.brand,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  + Add Exercise
                </Text>
              </TouchableOpacity>

              <RestTimer />

              <AppButton
                onPress={saveWorkout}
                style={{
                  backgroundColor: colors.success,
                  borderColor: colors.success,
                  minHeight: 62,
                  marginTop: 4,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: colors.onBrand,
                      fontSize: 17,
                      fontWeight: "800",
                    }}
                  >
                    Save Workout
                  </Text>
                  <Text
                    style={{
                      color: colors.onBrand,
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {exercises.length} exercises |{" "}
                    {formatVolume(calculateTotalVolume())} volume
                  </Text>
                </View>
              </AppButton>

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
