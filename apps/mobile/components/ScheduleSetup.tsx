import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAppStore } from "../lib/store";
import { colors, spacing } from "../lib/theme";
import type { Schedule, ScheduleDay, ScheduleSplit } from "../lib/types";
import { AppButton, Card, SectionLabel } from "./shared/ui";

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
          backgroundColor: colors.overlay,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.surfaceRaised,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: spacing.screen,
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
            <Text
              style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}
            >
              Set Up Schedule
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ gap: 12 }}>
            <SectionLabel>Preset Splits</SectionLabel>
            {PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.split}
                onPress={() => handlePreset(preset)}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor:
                    existingSchedule?.split === preset.split
                      ? colors.brand
                      : colors.border,
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  {preset.name}
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  {preset.days
                    .map((d) => `${DAY_LABELS[d.dayOfWeek]}: ${d.label}`)
                    .join(" | ")}
                </Text>
              </TouchableOpacity>
            ))}

            <SectionLabel style={{ marginTop: 8 }}>Custom Weekly</SectionLabel>
            <Card
              style={{
                padding: spacing.lg,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                Tap a day, then pick a template:
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                  const assigned = existingSchedule?.days.find(
                    (d) => d.dayOfWeek === day,
                  );
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() =>
                        setSelectedDay(selectedDay === day ? null : day)
                      }
                      style={{
                        backgroundColor:
                          selectedDay === day
                            ? colors.brand
                            : colors.surfacePressed,
                        borderRadius: 8,
                        padding: 8,
                        minWidth: 44,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selectedDay === day
                              ? colors.onBrand
                              : colors.textSecondary,
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {DAY_LABELS[day]}
                      </Text>
                      {assigned && (
                        <Text
                          style={{
                            color: colors.brand,
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
                            (d) => d.dayOfWeek !== selectedDay,
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
                        backgroundColor: colors.surfacePressed,
                        borderRadius: 8,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: existingSchedule?.days.find(
                          (d) =>
                            d.dayOfWeek === selectedDay &&
                            d.templateId === t.id,
                        )
                          ? colors.brand
                          : colors.borderStrong,
                      }}
                    >
                      <Text style={{ color: colors.text, fontSize: 14 }}>
                        {t.name}
                      </Text>
                      <Text
                        style={{ color: colors.textSecondary, fontSize: 12 }}
                      >
                        {t.exercises.length} exercises
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card>

            {existingSchedule && (
              <AppButton onPress={handleRemoveSchedule} variant="danger">
                Remove Schedule
              </AppButton>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
