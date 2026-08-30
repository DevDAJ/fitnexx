import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  loadExercises,
  searchRemoteExercises,
} from "../../lib/exerciseDatabase";
import { isExerciseAvailable } from "../../lib/gyms";
import { useAppStore } from "../../lib/store";
import type { ExerciseAsset, Gym } from "../../lib/types";
import { ExerciseInfoSheet } from "../shared/ExerciseInfoSheet";
import { FilterDropdown } from "../shared/FilterDropdown";
import { Toggle } from "../shared/Toggle";

function applyGymFilter(
  results: ExerciseAsset[],
  currentGym: Gym | null,
  showUnavailable: boolean,
): ExerciseAsset[] {
  if (!currentGym || showUnavailable) return results;
  return results.filter((item) =>
    isExerciseAvailable(item, currentGym.equipment),
  );
}

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
  const [error, setError] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [muscle, setMuscle] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [infoItem, setInfoItem] = useState<ExerciseAsset | null>(null);
  const currentGym = useAppStore((s) => s.currentGym);

  const muscleOptions = useMemo(
    () => Array.from(new Set(results.map((r) => r.primaryMuscle))),
    [results],
  );

  const filteredResults = useMemo(() => {
    let list = results;
    if (muscle) list = list.filter((r) => r.primaryMuscle === muscle);
    if (category)
      list = list.filter(
        (r) => r.category.toLowerCase() === category.toLowerCase(),
      );
    return currentGym
      ? applyGymFilter(list, currentGym, showUnavailable)
      : list;
  }, [results, muscle, category, currentGym, showUnavailable]);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(false);
    loadExercises()
      .then((all) => {
        setResults(all);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!visible) return;
    loadData();
  }, [visible, loadData]);

  useEffect(() => {
    if (!visible || error) return;
    if (!query) {
      loadExercises()
        .then(setResults)
        .catch(() => setError(true));
      return;
    }
    let active = true;
    searchRemoteExercises(query)
      .then((r) => {
        if (active) setResults(r);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [query, visible, error]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", paddingTop: 60 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
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
            {currentGym
              ? `${filteredResults.length} of ${results.length} exercises`
              : `${filteredResults.length} exercises`}
          </Text>
          <View style={{ marginTop: 10 }}>
            <FilterDropdown
              muscles={muscleOptions}
              muscle={muscle}
              onMuscle={setMuscle}
              category={category}
              onCategory={setCategory}
            />
          </View>
          {currentGym && (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#161616",
                borderRadius: 10,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: "#222",
              }}
            >
              <Toggle
                label={`Show exercises without equipment at ${currentGym.name}`}
                value={showUnavailable}
                onValueChange={setShowUnavailable}
              />
            </View>
          )}
        </View>

        {error ? (
          <View
            style={{
              alignItems: "center",
              marginTop: 60,
              paddingHorizontal: 32,
            }}
          >
            <Text
              style={{
                color: "#ef4444",
                fontSize: 15,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Could not download the exercise database.
            </Text>
            <Text
              style={{
                color: "#888",
                fontSize: 13,
                marginTop: 6,
                textAlign: "center",
              }}
            >
              Check your connection and try again.
            </Text>
            <TouchableOpacity
              onPress={loadData}
              style={{
                marginTop: 18,
                backgroundColor: "#3b82f6",
                borderRadius: 10,
                paddingHorizontal: 28,
                paddingVertical: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <ActivityIndicator color="#3b82f6" />
            <Text style={{ color: "#666", fontSize: 13, marginTop: 10 }}>
              Downloading exercise database...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  setQuery("");
                  onClose();
                }}
                onLongPress={() => setInfoItem(item)}
                delayLongPress={300}
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
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: "#1a1a1a",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: "#1a1a1a",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#666", fontSize: 13 }}>IMG</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#e5e5e5",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
                    {item.primaryMuscle}
                    {item.secondaryMuscles.length > 0
                      ? ` + ${item.secondaryMuscles.join(", ")}`
                      : ""}
                  </Text>
                  {item.equipment && (
                    <Text
                      style={{
                        color: "#555",
                        fontSize: 11,
                        marginTop: 1,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.equipment}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setInfoItem(item)}
                  hitSlop={8}
                  style={{ padding: 6 }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text
                style={{ color: "#666", textAlign: "center", marginTop: 40 }}
              >
                No exercises found
              </Text>
            }
          />
        )}
      </View>

      <ExerciseInfoSheet item={infoItem} onClose={() => setInfoItem(null)} />
    </Modal>
  );
}
