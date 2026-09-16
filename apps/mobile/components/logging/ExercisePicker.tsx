import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  loadExercises,
  searchRemoteExercises,
} from "../../lib/exerciseDatabase";
import { isExerciseAvailable } from "../../lib/gyms";
import { useAppStore } from "../../lib/store";
import { colors, spacing } from "../../lib/theme";
import type { ExerciseAsset, Gym } from "../../lib/types";
import { ExerciseInfoSheet } from "../shared/ExerciseInfoSheet";
import { FilterDropdown } from "../shared/FilterDropdown";
import { Toggle } from "../shared/Toggle";
import { AppButton, AppTextInput, EmptyState, ScreenTitle } from "../shared/ui";

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
      <View
        style={{ flex: 1, backgroundColor: colors.background, paddingTop: 60 }}
      >
        <View
          style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <ScreenTitle style={{ fontSize: 20 }}>Add Exercise</ScreenTitle>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: colors.brand, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <AppTextInput
            placeholder="Search exercises..."
            value={query}
            onChangeText={setQuery}
            style={{
              borderRadius: 10,
              padding: 12,
              fontSize: 15,
            }}
          />
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 6 }}>
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
                backgroundColor: colors.surface,
                borderRadius: 10,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: colors.border,
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
                color: colors.danger,
                fontSize: 15,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Could not download the exercise database.
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                marginTop: 6,
                textAlign: "center",
              }}
            >
              Check your connection and try again.
            </Text>
            <AppButton onPress={loadData} style={{ marginTop: 18 }}>
              Retry
            </AppButton>
          </View>
        ) : loading ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <ActivityIndicator color={colors.brand} />
            <Text
              style={{ color: colors.textMuted, fontSize: 13, marginTop: 10 }}
            >
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
                  borderBottomColor: colors.border,
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
                      backgroundColor: colors.surfaceRaised,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: colors.surfaceRaised,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                      IMG
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {item.primaryMuscle}
                    {item.secondaryMuscles.length > 0
                      ? ` + ${item.secondaryMuscles.join(", ")}`
                      : ""}
                  </Text>
                  {item.equipment && (
                    <Text
                      style={{
                        color: colors.textMuted,
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
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<EmptyState title="No exercises found" />}
          />
        )}
      </View>

      <ExerciseInfoSheet item={infoItem} onClose={() => setInfoItem(null)} />
    </Modal>
  );
}
