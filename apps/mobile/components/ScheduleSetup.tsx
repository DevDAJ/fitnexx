import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useAppStore } from "../lib/store";
import type { Schedule, ScheduleSplit, ScheduleDay } from "../lib/types";
import { MOCK_SCHEDULE } from "../lib/mockData";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PRESETS: {
  split: ScheduleSplit;
  name: string;
  days: ScheduleDay[];
}[] = [
  {
    split: "push_pull_legs",
    name: "Push / Pull / Legs",
    days: [
      { dayOfWeek: 1, templateId: "tpl_push", label: "Push Day" },
      { dayOfWeek: 3, templateId: "tpl_pull", label: "Pull Day" },
      { dayOfWeek: 5, templateId: "tpl_legs", label: "Leg Day" },
    ],
  },
  {
    split: "upper_lower",
    name: "Upper / Lower",
    days: [
      { dayOfWeek: 1, templateId: "tpl_upper", label: "Upper Body" },
      { dayOfWeek: 2, templateId: "tpl_lower", label: "Lower Body" },
      { dayOfWeek: 4, templateId: "tpl_upper", label: "Upper Body" },
      { dayOfWeek: 5, templateId: "tpl_lower", label: "Lower Body" },
    ],
  },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScheduleSetup({ visible, onClose }: Props) {
  const templates = useAppStore((s) => s.templates);
  const setSchedule = useAppStore((s) => s.setSchedule);
  const deleteSchedule = useAppStore((s) => s.deleteSchedule);
  const existingSchedule = useAppStore((s) => s.schedule);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handlePreset = async (preset: (typeof PRESETS)[number]) => {
    const schedule: Schedule = {
      id: `sched_${Date.now()}`,
      name: preset.name,
      split: preset.split,
      days: preset.days,
    };
    await setSchedule(schedule);
    onClose();
  };

  const handleRemoveSchedule = async () => {
    await deleteSchedule();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.8)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "#111",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>
              Set Up Schedule
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#888", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ gap: 12 }}>
            <Text style={{ color: "#888", fontSize: 13, fontWeight: "600" }}>
              PRESET SPLITS
            </Text>
            {PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.split}
                onPress={() => handlePreset(preset)}
                style={{
                  backgroundColor: "#161616",
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: existingSchedule?.split === preset.split ? "#3b82f6" : "#222",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                  {preset.name}
                </Text>
                <Text style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                  {preset.days
                    .map((d) => `${DAY_LABELS[d.dayOfWeek]}: ${d.label}`)
                    .join(" | ")}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={{ color: "#888", fontSize: 13, fontWeight: "600", marginTop: 8 }}>
              CUSTOM WEEKLY
            </Text>
            <View
              style={{
                backgroundColor: "#161616",
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: "#222",
              }}
            >
              <Text style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>
                Tap a day, then pick a template:
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                  const assigned = existingSchedule?.days.find(
                    (d) => d.dayOfWeek === day
                  );
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() =>
                        setSelectedDay(selectedDay === day ? null : day)
                      }
                      style={{
                        backgroundColor:
                          selectedDay === day ? "#3b82f6" : "#222",
                        borderRadius: 8,
                        padding: 8,
                        minWidth: 44,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: selectedDay === day ? "#fff" : "#888",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {DAY_LABELS[day]}
                      </Text>
                      {assigned && (
                        <Text
                          style={{
                            color: "#3b82f6",
                            fontSize: 9,
                            marginTop: 2,
                          }}
                        >
                          {assigned.label.slice(0, 3)}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedDay !== null && (
                <View style={{ marginTop: 12, gap: 6 }}>
                  {templates.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      onPress={async () => {
                        if (selectedDay === null) return;
                        const existing = existingSchedule?.days || [];
                        const newDays = [
                          ...existing.filter(
                            (d) => d.dayOfWeek !== selectedDay
                          ),
                          {
                            dayOfWeek: selectedDay,
                            templateId: t.id,
                            label: t.name,
                          },
                        ].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
                        const schedule: Schedule = {
                          id: existingSchedule?.id || `sched_${Date.now()}`,
                          name: "Custom",
                          split: "custom",
                          days: newDays,
                        };
                        await setSchedule(schedule);
                        setSelectedDay(null);
                      }}
                      style={{
                        backgroundColor: "#222",
                        borderRadius: 8,
                        padding: 12,
                        borderWidth: 1,
                        borderColor:
                          existingSchedule?.days.find(
                            (d) =>
                              d.dayOfWeek === selectedDay &&
                              d.templateId === t.id
                          )
                            ? "#3b82f6"
                            : "#333",
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 14 }}>
                        {t.name}
                      </Text>
                      <Text style={{ color: "#888", fontSize: 12 }}>
                        {t.exercises.length} exercises
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {existingSchedule && (
              <TouchableOpacity
                onPress={handleRemoveSchedule}
                style={{
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ef4444",
                }}
              >
                <Text style={{ color: "#ef4444", fontSize: 14, fontWeight: "600" }}>
                  Remove Schedule
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
