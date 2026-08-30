import { View, Text, TouchableOpacity } from "react-native";
import { useAppStore } from "../lib/store";
import type { WorkoutTemplate, Schedule } from "../lib/types";

interface Props {
  onStartTemplate: (template: WorkoutTemplate) => void;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TodaySchedule({ onStartTemplate }: Props) {
  const schedule = useAppStore((s) => s.schedule);
  const templates = useAppStore((s) => s.templates);

  if (!schedule) return null;

  const today = new Date().getDay();
  const todayEntry = schedule.days.find((d) => d.dayOfWeek === today);

  if (!todayEntry) {
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#666",
            }}
          />
          <Text style={{ color: "#888", fontSize: 14, fontWeight: "600" }}>
            Rest Day
          </Text>
        </View>
        <Text style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
          {schedule.name}
        </Text>
      </View>
    );
  }

  const template = templates.find((t) => t.id === todayEntry.templateId);

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#3b82f6",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#3b82f6",
          }}
        />
        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
          Today: {todayEntry.label}
        </Text>
      </View>
      <Text style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
        {schedule.name} {template ? `(${template.exercises.length} exercises)` : ""}
      </Text>
      {template && (
        <TouchableOpacity
          onPress={() => onStartTemplate(template)}
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: 10,
            padding: 12,
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
            Start Workout
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
