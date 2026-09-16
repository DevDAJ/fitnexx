import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddGymModal } from "../../components/gyms/AddGymModal";
import { Badge } from "../../components/shared/Badge";
import { ExerciseInfoSheet } from "../../components/shared/ExerciseInfoSheet";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { Toggle } from "../../components/shared/Toggle";
import {
  AppButton,
  AppTextInput,
  Card,
  ScreenTitle,
  SectionLabel,
} from "../../components/shared/ui";
import { analyzeExerciseTrend } from "../../lib/analysis/exerciseTrend";
import { isExerciseAvailable } from "../../lib/gyms";
import { useAppStore } from "../../lib/store";
import { colors, fontSizes, radii, spacing } from "../../lib/theme";
import type { ExerciseAsset, Gym } from "../../lib/types";
import { useExerciseEquipment } from "../../lib/useExerciseEquipment";

const TREND_VARIANT: Record<
  string,
  "improving" | "plateau" | "regression" | "new"
> = {
  overload: "improving",
  stagnant: "plateau",
  regression: "regression",
  new: "new",
};

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const workouts = useAppStore((s) => s.workouts);
  const gyms = useAppStore((s) => s.gyms);
  const currentGym = useAppStore((s) => s.currentGym);
  const addGym = useAppStore((s) => s.addGym);
  const deleteGym = useAppStore((s) => s.deleteGym);
  const refreshCurrentGym = useAppStore((s) => s.refreshCurrentGym);
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [gyModalOpen, setGyModalOpen] = useState(false);
  const [editingGym, setEditingGym] = useState<Gym | null>(null);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [infoItem, setInfoItem] = useState<ExerciseAsset | null>(null);
  const {
    equipment,
    byName,
    loading: equipmentLoading,
  } = useExerciseEquipment();

  const muscleOptions = useMemo(() => {
    const muscles = new Set<string>();
    for (const w of workouts) {
      for (const e of w.exercises) {
        const asset = byName[e.exerciseName.toLowerCase()];
        if (asset) muscles.add(asset.primaryMuscle);
      }
    }
    return Array.from(muscles);
  }, [workouts, byName]);

  const gymEquipment = useMemo(() => {
    if (!currentGym) return null;
    return currentGym.equipment.map((e) => e.toLowerCase());
  }, [currentGym]);

  const exercises = useMemo(() => {
    const names = new Set<string>();
    for (const w of workouts) {
      for (const e of w.exercises) names.add(e.exerciseName);
    }

    return Array.from(names)
      .map((name) => {
        const trend = analyzeExerciseTrend(name, workouts);
        const sessions = workouts.filter((w) =>
          w.exercises.some((e) => e.exerciseName === name),
        ).length;
        const asset =
          byName[name.toLowerCase()] ??
          ({
            name,
            primaryMuscle: "",
            secondaryMuscles: [],
            category: "compound",
            equipment: equipment[name.toLowerCase()],
          } as ExerciseAsset);
        return { name, trend, sessions, asset };
      })
      .filter((e) => {
        if (!e.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (muscle && e.asset.primaryMuscle !== muscle) return false;
        if (
          category &&
          e.asset.category.toLowerCase() !== category.toLowerCase()
        )
          return false;
        if (gymEquipment && !showUnavailable) {
          return isExerciseAvailable(e.asset, gymEquipment);
        }
        return true;
      })
      .sort((a, b) => b.sessions - a.sessions);
  }, [
    workouts,
    search,
    equipment,
    byName,
    gymEquipment,
    showUnavailable,
    muscle,
    category,
  ]);

  const confirmDeleteGym = (id: string, name: string) => {
    Alert.alert("Remove Gym", `Remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => deleteGym(id) },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: spacing.screen,
        paddingBottom: 100,
        gap: 10,
      }}
    >
      <ScreenTitle>Exercises</ScreenTitle>

      {/* My Gyms */}
      <Card>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <SectionLabel>My Gyms</SectionLabel>
          <TouchableOpacity onPress={() => setGyModalOpen(true)}>
            <Text
              style={{
                color: colors.brand,
                fontSize: fontSizes.sm,
                fontWeight: "700",
              }}
            >
              + Add Gym
            </Text>
          </TouchableOpacity>
        </View>

        {currentGym ? (
          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.md,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.success,
            }}
          >
            <Text
              style={{ color: colors.success, fontSize: 13, fontWeight: "700" }}
            >
              ✓ At {currentGym.name}
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: fontSizes.xs,
                marginTop: 2,
              }}
            >
              Showing exercises available at this gym.
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.md,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.borderStrong,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: fontSizes.xs,
                flex: 1,
              }}
            >
              {gyms.length > 0
                ? "No gym detected at your location."
                : "Add a gym to track its equipment."}
            </Text>
            {gyms.length > 0 && (
              <AppButton
                onPress={refreshCurrentGym}
                style={{
                  minHeight: 34,
                  marginLeft: spacing.sm,
                  paddingHorizontal: spacing.md,
                }}
              >
                Recheck
              </AppButton>
            )}
          </View>
        )}

        {gyms.map((g) => (
          <TouchableOpacity
            key={g.id}
            onPress={() => {
              setEditingGym(g);
              setGyModalOpen(true);
            }}
            onLongPress={() => confirmDeleteGym(g.id, g.name)}
            style={{
              marginTop: 8,
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.md,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.borderStrong,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: fontSizes.sm,
                  fontWeight: "600",
                }}
              >
                {g.name}
                {currentGym?.id === g.id ? (
                  <Text style={{ color: colors.success }}> ●</Text>
                ) : null}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 8,
              }}
            >
              {g.equipment.length === 0 && (
                <Text
                  style={{ color: colors.textMuted, fontSize: fontSizes.xs }}
                >
                  No equipment saved.
                </Text>
              )}
              {g.equipment.map((eq) => (
                <View
                  key={eq}
                  style={{
                    backgroundColor: colors.surfacePressed,
                    borderRadius: radii.sm,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                    {eq}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      <AppTextInput
        placeholder="Search exercises..."
        value={search}
        onChangeText={setSearch}
      />

      <FilterDropdown
        muscles={muscleOptions}
        muscle={muscle}
        onMuscle={setMuscle}
        category={category}
        onCategory={setCategory}
      />

      {currentGym && (
        <View
          style={{
            backgroundColor: colors.surfaceRaised,
            borderRadius: radii.md,
            padding: spacing.md,
          }}
        >
          <Toggle
            label={`Show exercises with equipment not at ${currentGym.name}`}
            value={showUnavailable}
            onValueChange={setShowUnavailable}
          />
        </View>
      )}

      {equipmentLoading && currentGym && (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <ActivityIndicator color={colors.brand} />
        </View>
      )}

      {exercises.length === 0 && !equipmentLoading && (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Text style={{ color: colors.textMuted, fontSize: 15 }}>
            No exercises found.
          </Text>
        </View>
      )}

      {exercises.map((ex) => (
        <TouchableOpacity
          key={ex.name}
          onPress={() =>
            router.push(`/exercise/${encodeURIComponent(ex.name)}`)
          }
          activeOpacity={0.7}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.md,
            padding: spacing.sm,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          {ex.asset.imageUrl || ex.asset.gifUrl ? (
            <TouchableOpacity
              onPress={() => setInfoItem(ex.asset)}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: ex.asset.gifUrl ?? ex.asset.imageUrl,
                }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 8,
                  backgroundColor: colors.surfaceRaised,
                }}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 8,
                backgroundColor: colors.surfaceRaised,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>IMG</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: fontSizes.sm,
                fontWeight: "600",
              }}
            >
              {ex.name}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: fontSizes.xs,
                marginTop: 2,
              }}
            >
              {ex.sessions} sessions
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Badge
              label={ex.trend.status}
              variant={TREND_VARIANT[ex.trend.status] ?? "neutral"}
            />
          </View>
        </TouchableOpacity>
      ))}

      <AddGymModal
        visible={gyModalOpen}
        initial={editingGym}
        onSave={(gym) => {
          addGym(gym);
          setGyModalOpen(false);
          setEditingGym(null);
        }}
        onClose={() => {
          setGyModalOpen(false);
          setEditingGym(null);
        }}
      />
      <ExerciseInfoSheet item={infoItem} onClose={() => setInfoItem(null)} />
    </ScrollView>
  );
}
