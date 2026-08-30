import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function FilterDropdown({
  muscles,
  muscle,
  onMuscle,
  category,
  onCategory,
}: {
  muscles: string[];
  muscle: string | null;
  onMuscle: (m: string | null) => void;
  category: string | null;
  onCategory: (c: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const activeCount = (muscle ? 1 : 0) + (category ? 1 : 0);

  const row = (
    label: string,
    value: string | null,
    current: string | null,
    onSelect: (v: string | null) => void,
    key: string,
  ) => {
    const active = current === value;
    return (
      <TouchableOpacity
        key={key}
        onPress={() => {
          onSelect(value);
          setOpen(false);
        }}
        style={{
          paddingVertical: 13,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#1a1a1a",
        }}
      >
        <Text
          style={{
            color: active ? "#3b82f6" : "#e5e5e5",
            fontSize: 15,
            fontWeight: active ? "700" : "500",
          }}
        >
          {label}
        </Text>
        {active && <Text style={{ color: "#3b82f6", fontSize: 13 }}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          alignSelf: "flex-start",
          backgroundColor: activeCount > 0 ? "#3b82f6" : "#161616",
          borderWidth: 1,
          borderColor: activeCount > 0 ? "#3b82f6" : "#2a2a2a",
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 8,
        }}
      >
        <Ionicons
          name="funnel"
          size={14}
          color={activeCount > 0 ? "#fff" : "#999"}
        />
        <Text
          style={{
            color: activeCount > 0 ? "#fff" : "#bbb",
            fontSize: 13,
            fontWeight: "600",
          }}
        >
          {activeCount > 0 ? `Filters (${activeCount})` : "Filters"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
          }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: "#111",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              paddingHorizontal: 16,
              paddingBottom: 40,
            }}
            onPress={() => {}}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 14,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
                Filter exercises
              </Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={{ color: "#3b82f6", fontSize: 15 }}>Done</Text>
              </TouchableOpacity>
            </View>
            {muscles.length > 0 && (
              <View>
                <Text style={sectionLabel}>MUSCLE</Text>
                {row("All muscles", null, muscle, onMuscle, "__muscle_all__")}
                {muscles.map((m) => row(m, m, muscle, onMuscle, `muscle_${m}`))}
              </View>
            )}
            <Text style={sectionLabel}>TYPE</Text>
            {row("All types", null, category, onCategory, "__type_all__")}
            {["Compound", "Isolation"].map((c) =>
              row(c, c, category, onCategory, `type_${c}`),
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const sectionLabel = {
  color: "#888",
  fontSize: 12,
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
  marginTop: 8,
  marginBottom: 4,
};