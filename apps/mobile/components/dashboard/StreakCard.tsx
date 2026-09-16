import { Text, View } from "react-native";
import { useAppStore } from "../../lib/store";
import { computeStreak } from "../../lib/streak";
import { colors, spacing } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

export function StreakCard() {
  const workouts = useAppStore((s) => s.workouts);
  const streak = computeStreak(workouts.map((w) => w.date));

  return (
    <Card>
      <SectionLabel>Training Streak</SectionLabel>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          gap: 8,
          marginTop: 6,
        }}
      >
        <Text
          style={{ color: colors.warning, fontSize: 34, fontWeight: "800" }}
        >
          {streak.days}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
          day{streak.days === 1 ? "" : "s"}
        </Text>
      </View>
      <Text
        style={{ color: colors.textMuted, fontSize: 13, marginTop: spacing.xs }}
      >
        {streak.activeToday
          ? "You trained today. Keep the momentum."
          : streak.days > 0
            ? "Train today to keep your streak alive."
            : "Log your first workout to start a streak."}
      </Text>
    </Card>
  );
}
