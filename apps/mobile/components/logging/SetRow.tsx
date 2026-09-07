import { useRef, useState } from "react";
import type { TextStyle } from "react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
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
  const repsRef = useRef<TextInput>(null);
  const rpeRef = useRef<TextInput>(null);
  const [showNotes, setShowNotes] = useState(Boolean(set.notes));

  const inputStyle: TextStyle = {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 8,
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  };

  return (
    <View style={{ paddingVertical: 6 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text
          style={{
            color: "#666",
            fontSize: 13,
            width: 24,
            textAlign: "center",
          }}
        >
          {index + 1}
        </Text>

        <TextInput
          placeholder="0"
          placeholderTextColor="#444"
          keyboardType="decimal-pad"
          returnKeyType="next"
          selectTextOnFocus
          value={set.weight > 0 ? String(set.weight) : ""}
          onChangeText={(t) => onUpdate({ weight: parseFloat(t) || 0 })}
          onSubmitEditing={() => repsRef.current?.focus()}
          style={{ ...inputStyle, width: 65 }}
        />

        <TextInput
          ref={repsRef}
          placeholder="0"
          placeholderTextColor="#444"
          keyboardType="number-pad"
          returnKeyType="next"
          selectTextOnFocus
          value={set.reps > 0 ? String(set.reps) : ""}
          onChangeText={(t) => onUpdate({ reps: parseInt(t, 10) || 0 })}
          onSubmitEditing={() => rpeRef.current?.focus()}
          style={{ ...inputStyle, width: 55 }}
        />

        <TextInput
          ref={rpeRef}
          placeholder="RPE"
          placeholderTextColor="#444"
          keyboardType="decimal-pad"
          returnKeyType="done"
          selectTextOnFocus
          value={set.rpe ? String(set.rpe) : ""}
          onChangeText={(t) => onUpdate({ rpe: parseFloat(t) || undefined })}
          onSubmitEditing={(e) => e.target.blur()}
          style={{ ...inputStyle, width: 50 }}
        />

        <TouchableOpacity
          onPress={() => setShowNotes((v) => !v)}
          hitSlop={8}
          style={{ paddingHorizontal: 2 }}
        >
          <Text
            style={{
              color: set.notes ? "#3b82f6" : "#555",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            ✎
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {set.isPr && (
          <View
            style={{
              backgroundColor: "#fbbf24",
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: "#000", fontSize: 10, fontWeight: "800" }}>
              PR
            </Text>
          </View>
        )}

        {showRemove && (
          <TouchableOpacity onPress={onRemove}>
            <Text
              style={{ color: "#ef4444", fontSize: 18, paddingHorizontal: 4 }}
            >
              ×
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {(showNotes || set.notes) && (
        <TextInput
          placeholder="Notes (e.g. paused 3s at the bottom)"
          placeholderTextColor="#444"
          value={set.notes ?? ""}
          onChangeText={(t) => onUpdate({ notes: t || undefined })}
          multiline
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 8,
            padding: 8,
            marginTop: 6,
            marginLeft: 32,
            color: "#ccc",
            fontSize: 13,
            borderWidth: 1,
            borderColor: "#2a2a2a",
          }}
        />
      )}
    </View>
  );
}
