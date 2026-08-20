import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  loadExercises,
  searchRemoteExercises,
} from "../../lib/exerciseDatabase";
import type { ExerciseAsset } from "../../lib/types";

export function ExercisePicker({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean;
  onSelect: (exercise: ExerciseAsset) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ExerciseAsset[]>([]);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      loadExercises().then((all) => {
        setResults(all);
        setLoading(false);
      });
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (!query) {
      loadExercises().then(setResults);
      return;
    }
    let active = true;
    searchRemoteExercises(query).then((r) => {
      if (active) setResults(r);
    });
    return () => {
      active = false;
    };
  }, [query, visible]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", paddingTop: 60 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
              Add Exercise
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#3b82f6", fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            style={{
              backgroundColor: "#161616",
              borderRadius: 10,
              padding: 12,
              color: "#fff",
              fontSize: 15,
              borderWidth: 1,
              borderColor: "#2a2a2a",
            }}
          />
          <Text style={{ color: "#555", fontSize: 11, marginTop: 6 }}>
            {results.length} exercises
          </Text>
        </View>

        {loading ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <ActivityIndicator color="#3b82f6" />
            <Text style={{ color: "#666", fontSize: 13, marginTop: 10 }}>
              Downloading exercise database...
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  setQuery("");
                  onClose();
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#1a1a1a",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: "#1a1a1a" }}
                  />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: "#1a1a1a", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#444", fontSize: 18 }}>🏋️</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#e5e5e5", fontSize: 15, fontWeight: "600" }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
                    {item.primaryMuscle}
                    {item.secondaryMuscles.length > 0
                      ? ` + ${item.secondaryMuscles.join(", ")}`
                      : ""}
                  </Text>
                  {item.equipment && (
                    <Text style={{ color: "#555", fontSize: 11, marginTop: 1, textTransform: "capitalize" }}>
                      {item.equipment}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ color: "#666", textAlign: "center", marginTop: 40 }}>
                No exercises found
              </Text>
            }
          />
        )}
      </View>
    </Modal>
  );
}
