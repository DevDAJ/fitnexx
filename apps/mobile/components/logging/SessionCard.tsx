import { Image, Text, TouchableOpacity, View } from "react-native";
import type { Workout, WorkoutSet } from "../../lib/types";
import { SET_TYPE_COLORS, SET_TYPE_LABELS } from "../../lib/types";
import { useExerciseEquipment } from "../../lib/useExerciseEquipment";
import { Badge } from "../shared/Badge";

export function SessionCard({
  workout,
  prevWorkout,
  isExpanded,
  onToggle,
  onExercisePress,
}: {
  workout: Workout;
  prevWorkout: Workout | null;
  isExpanded: boolean;
  onToggle: () => void;
  onExercisePress: (name: string) => void;
}) {
  const date = new Date(workout.date);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const durationMin = Math.floor(workout.duration / 60);
  const prCount = workout.exercises.reduce(
    (a, e) => a + e.sets.filter((s) => s.isPr).length,
    0,
  );
  const delta = prevWorkout
    ? { volume: workout.totalVolume - prevWorkout.totalVolume }
    : null;
  const images: Record<string, string> = {};
  const { byName } = useExerciseEquipment();
  for (const ex of workout.exercises) {
    const asset = byName[ex.exerciseName.toLowerCase()];
    const url = asset?.gifUrl ?? asset?.imageUrl;
    if (url) images[ex.exerciseName.toLowerCase()] = url;
  }

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#222",
        marginBottom: 8,
      }}
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.8}
        style={{ padding: 16 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#e5e5e5", fontSize: 16, fontWeight: "700" }}>
              {workout.title}
            </Text>
            <Text style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
              {dayName}, {dateStr}
            </Text>
          </View>
          {prCount > 0 && (
            <Badge
              label={`${prCount} PR${prCount > 1 ? "s" : ""}`}
              variant="pr"
            />
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 14,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#888", fontSize: 12 }}>
            {workout.exercises.length} exercises
          </Text>
          <Text style={{ color: "#888", fontSize: 12 }}>
            {formatVol(workout.totalVolume)} vol
          </Text>
          {durationMin > 0 && (
            <Text style={{ color: "#888", fontSize: 12 }}>{durationMin}m</Text>
          )}
          {delta && delta.volume !== 0 && (
            <View
              style={{
                backgroundColor: delta.volume > 0 ? "#22c55e15" : "#ef444415",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: delta.volume > 0 ? "#22c55e" : "#ef4444",
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                {delta.volume > 0 ? "+" : ""}
                {formatVol(Math.abs(delta.volume))} vs prev
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#222",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          {workout.exercises.map((ex, ei) => (
            <View key={`${ex.exerciseName}-${ei}`}>
              {ei > 0 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#222",
                    marginVertical: 8,
                  }}
                />
              )}
              <TouchableOpacity
                onPress={() => onExercisePress(ex.exerciseName)}
                activeOpacity={0.6}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 2,
                }}
              >
                {images[ex.exerciseName.toLowerCase()] && (
                  <Image
                    source={{ uri: images[ex.exerciseName.toLowerCase()] }}
                    style={{ width: 36, height: 36, borderRadius: 6 }}
                  />
                )}
                <Text
                  style={{ color: "#3b82f6", fontSize: 14, fontWeight: "600" }}
                >
                  {ex.exerciseName}
                </Text>
              </TouchableOpacity>
              {ex.sets.map((set, si) => (
                <SetRow key={`${ex.exerciseName}-${si}`} set={set} index={si} />
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function SetRow({ set, index }: { set: WorkoutSet; index: number }) {
  const typeColor = SET_TYPE_COLORS[set.setType] || "#666";
  const typeLabel = SET_TYPE_LABELS[set.setType] || set.setType;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        paddingVertical: 3,
        paddingLeft: 8,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#666", fontSize: 12, width: 18 }}>
        {index + 1}.
      </Text>
      <Text style={{ color: "#aaa", fontSize: 12 }}>
        {set.weight > 0 ? `${set.weight}kg` : "BW"} x {set.reps}
      </Text>
      {set.rpe != null && (
        <Text style={{ color: "#666", fontSize: 11 }}>RPE {set.rpe}</Text>
      )}
      {typeLabel && set.setType !== "normal" && (
        <View
          style={{
            backgroundColor: `${typeColor}20`,
            paddingHorizontal: 5,
            paddingVertical: 1,
            borderRadius: 3,
          }}
        >
          <Text style={{ color: typeColor, fontSize: 10, fontWeight: "600" }}>
            {typeLabel}
          </Text>
        </View>
      )}
      {set.isPr && (
        <Text style={{ color: "#fbbf24", fontSize: 11, fontWeight: "700" }}>
          PR
        </Text>
      )}
    </View>
  );
}

function formatVol(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
}
