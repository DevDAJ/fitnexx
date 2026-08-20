import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { WorkoutSet } from "../../lib/types";

export function SetRow({
  set,
  index,
  onUpdate,
  onRemove,
  showRemove,
}: {
  set: WorkoutSet;
  index: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 6,
      }}
    >
      <Text style={{ color: "#666", fontSize: 13, width: 24, textAlign: "center" }}>
        {index + 1}
      </Text>

      <TextInput
        placeholder="0"
        placeholderTextColor="#444"
        keyboardType="decimal-pad"
        value={set.weight > 0 ? String(set.weight) : ""}
        onChangeText={(t) => onUpdate({ weight: parseFloat(t) || 0 })}
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: 8,
          padding: 8,
          color: "#fff",
          fontSize: 14,
          width: 65,
          textAlign: "center",
          borderWidth: 1,
          borderColor: "#2a2a2a",
        }}
      />

      <TextInput
        placeholder="0"
        placeholderTextColor="#444"
        keyboardType="number-pad"
        value={set.reps > 0 ? String(set.reps) : ""}
        onChangeText={(t) => onUpdate({ reps: parseInt(t) || 0 })}
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: 8,
          padding: 8,
          color: "#fff",
          fontSize: 14,
          width: 55,
          textAlign: "center",
          borderWidth: 1,
          borderColor: "#2a2a2a",
        }}
      />

      <TextInput
        placeholder="RPE"
        placeholderTextColor="#444"
        keyboardType="decimal-pad"
        value={set.rpe ? String(set.rpe) : ""}
        onChangeText={(t) => onUpdate({ rpe: parseFloat(t) || undefined })}
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: 8,
          padding: 8,
          color: "#fff",
          fontSize: 14,
          width: 50,
          textAlign: "center",
          borderWidth: 1,
          borderColor: "#2a2a2a",
        }}
      />

      <View style={{ flex: 1 }} />

      {set.isPr && (
        <View style={{ backgroundColor: "#fbbf24", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
          <Text style={{ color: "#000", fontSize: 10, fontWeight: "800" }}>PR</Text>
        </View>
      )}

      {showRemove && (
        <TouchableOpacity onPress={onRemove}>
          <Text style={{ color: "#ef4444", fontSize: 18, paddingHorizontal: 4 }}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
