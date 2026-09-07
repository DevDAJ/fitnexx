import { Text, View } from "react-native";
import { useAppStore } from "../../lib/store";
import { computeStreak } from "../../lib/streak";

export function StreakCard() {
  const workouts = useAppStore((s) => s.workouts);
  const streak = computeStreak(workouts.map((w) => w.date));

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <Text
        style={{
          color: "#888",
          fontSize: 12,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Training Streak
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          gap: 8,
          marginTop: 6,
        }}
      >
        <Text style={{ color: "#fbbf24", fontSize: 34, fontWeight: "800" }}>
          {streak.days}
        </Text>
        <Text style={{ color: "#888", fontSize: 14 }}>
          day{streak.days === 1 ? "" : "s"}
        </Text>
      </View>
      <Text style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
        {streak.activeToday
          ? "You trained today. Keep the momentum."
          : streak.days > 0
            ? "Train today to keep your streak alive."
            : "Log your first workout to start a streak."}
      </Text>
    </View>
  );
}
