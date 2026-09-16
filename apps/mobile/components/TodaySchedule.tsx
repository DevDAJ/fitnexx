import { Text, View } from "react-native";
import { useAppStore } from "../lib/store";
import { colors, fontSizes, spacing } from "../lib/theme";
import type { WorkoutTemplate } from "../lib/types";
import { AppButton, Card } from "./shared/ui";

interface Props {
  onStartTemplate: (template: WorkoutTemplate) => void;
}

export function TodaySchedule({ onStartTemplate }: Props) {
  const schedule = useAppStore((s) => s.schedule);
  const templates = useAppStore((s) => s.templates);

  if (!schedule) return null;

  const today = new Date().getDay();
  const todayEntry = schedule.days.find((d) => d.dayOfWeek === today);

  if (!todayEntry) {
    return (
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.textMuted,
            }}
          />
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: fontSizes.sm,
              fontWeight: "600",
            }}
          >
            Rest Day
          </Text>
        </View>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSizes.xs,
            marginTop: spacing.xs,
          }}
        >
          {schedule.name}
        </Text>
      </Card>
    );
  }

  const template = templates.find((t) => t.id === todayEntry.templateId);

  return (
    <Card style={{ borderColor: colors.brand }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.brand,
          }}
        />
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>
          Today: {todayEntry.label}
        </Text>
      </View>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: fontSizes.xs,
          marginTop: spacing.xs,
        }}
      >
        {schedule.name}{" "}
        {template ? `(${template.exercises.length} exercises)` : ""}
      </Text>
      {template && (
        <AppButton
          onPress={() => onStartTemplate(template)}
          style={{ marginTop: spacing.md }}
        >
          Start Workout
        </AppButton>
      )}
    </Card>
  );
}
