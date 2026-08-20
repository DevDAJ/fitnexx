import { View, Text, TouchableOpacity } from "react-native";
import type { ExerciseEntry, WorkoutSet, SetType } from "../../lib/types";
import { SetRow } from "./SetRow";

export function ExerciseBlock({
  entry,
  exerciseIndex,
  onUpdateExercise,
  onRemoveExercise,
}: {
  entry: ExerciseEntry;
  exerciseIndex: number;
  onUpdateExercise: (index: number, entry: ExerciseEntry) => void;
  onRemoveExercise: (index: number) => void;
}) {
  const updateSet = (setIndex: number, updates: Partial<WorkoutSet>) => {
    const newSets = [...entry.sets];
    newSets[setIndex] = { ...newSets[setIndex], ...updates };
    onUpdateExercise(exerciseIndex, { ...entry, sets: newSets });
  };

  const removeSet = (setIndex: number) => {
    const newSets = entry.sets.filter((_, i) => i !== setIndex);
    onUpdateExercise(exerciseIndex, { ...entry, sets: newSets });
  };

  const addSet = () => {
    const lastSet = entry.sets[entry.sets.length - 1];
    const newSet: WorkoutSet = {
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      rpe: undefined,
      setType: "normal",
    };
    onUpdateExercise(exerciseIndex, { ...entry, sets: [...entry.sets, newSet] });
  };

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ color: "#e5e5e5", fontSize: 15, fontWeight: "700", flex: 1 }}>
          {entry.exerciseName}
        </Text>
        <TouchableOpacity onPress={() => onRemoveExercise(exerciseIndex)}>
          <Text style={{ color: "#ef4444", fontSize: 13 }}>Remove</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 6, paddingHorizontal: 32 }}>
        <Text style={{ color: "#555", fontSize: 11, width: 65, textAlign: "center" }}>KG</Text>
        <Text style={{ color: "#555", fontSize: 11, width: 55, textAlign: "center" }}>REPS</Text>
        <Text style={{ color: "#555", fontSize: 11, width: 50, textAlign: "center" }}>RPE</Text>
      </View>

      {entry.sets.map((set, i) => (
        <SetRow
          key={i}
          set={set}
          index={i}
          onUpdate={(u) => updateSet(i, u)}
          onRemove={() => removeSet(i)}
          showRemove={entry.sets.length > 1}
        />
      ))}

      <TouchableOpacity
        onPress={addSet}
        style={{
          marginTop: 8,
          paddingVertical: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#2a2a2a",
          borderStyle: "dashed",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#3b82f6", fontSize: 14, fontWeight: "600" }}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
}
