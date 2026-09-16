import { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { deleteTemplate, getTemplates } from "../../lib/templates";
import { colors, spacing } from "../../lib/theme";
import type { WorkoutTemplate } from "../../lib/types";
import { EmptyState, ScreenTitle } from "../shared/ui";

export function TemplatePicker({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean;
  onSelect: (template: WorkoutTemplate) => void;
  onClose: () => void;
}) {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    if (visible) {
      getTemplates().then(setTemplates);
    }
  }, [visible]);

  const handleDelete = async (id: string) => {
    await deleteTemplate(id);
    setTemplates((t) => t.filter((tpl) => tpl.id !== id));
  };

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
          style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ScreenTitle style={{ fontSize: 20 }}>
              Workout Templates
            </ScreenTitle>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: colors.brand, fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={templates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                onClose();
              }}
              style={{
                marginHorizontal: spacing.lg,
                marginBottom: 8,
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
                    color: colors.textMuted,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {item.exercises.length} exercises
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: colors.danger, fontSize: 13 }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyState
              title="No templates yet"
              description="Save a workout as a template from the logging screen."
            />
          }
        />
      </View>
    </Modal>
  );
}
