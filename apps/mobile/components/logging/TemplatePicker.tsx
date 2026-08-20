import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { getTemplates, deleteTemplate } from "../../lib/templates";
import type { WorkoutTemplate } from "../../lib/types";

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
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", paddingTop: 60 }}>
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
              Workout Templates
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#3b82f6", fontSize: 16 }}>Done</Text>
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
                marginHorizontal: 16,
                marginBottom: 8,
                backgroundColor: "#161616",
                borderRadius: 12,
                padding: 14,
                borderWidth: 1,
                borderColor: "#222",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#e5e5e5", fontSize: 15, fontWeight: "600" }}>
                  {item.name}
                </Text>
                <Text style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
                  {item.exercises.length} exercises
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: "#ef4444", fontSize: 13 }}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#666", textAlign: "center", marginTop: 60 }}>
              No templates yet. Save a workout as a template from the logging screen.
            </Text>
          }
        />
      </View>
    </Modal>
  );
}
