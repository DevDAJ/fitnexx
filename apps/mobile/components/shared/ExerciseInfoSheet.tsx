import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ExerciseAsset } from "../../lib/types";

export function ExerciseInfoSheet({
  item,
  onClose,
}: {
  item: ExerciseAsset | null;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={!!item}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: "#111",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            paddingHorizontal: 16,
            paddingBottom: 40,
            maxHeight: "80%",
          }}
          onPress={() => {}}
        >
          {item && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 14,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "800",
                    flex: 1,
                  }}
                >
                  {item.name}
                </Text>
                <TouchableOpacity onPress={onClose} hitSlop={8}>
                  <Ionicons name="close" size={22} color="#999" />
                </TouchableOpacity>
              </View>
              <Text style={{ color: "#888", fontSize: 13 }}>
                {item.primaryMuscle}
                {item.secondaryMuscles.length > 0
                  ? ` + ${item.secondaryMuscles.join(", ")}`
                  : ""}
                {item.equipment ? ` · ${item.equipment}` : ""}
              </Text>
              {item.gifUrl && (
                <Image
                  source={{ uri: item.gifUrl }}
                  style={{
                    width: "100%",
                    height: 220,
                    borderRadius: 12,
                    marginTop: 14,
                    backgroundColor: "#1a1a1a",
                    resizeMode: "contain",
                  }}
                />
              )}
              <Text style={infoSectionLabel}>HOW TO DO IT</Text>
              <Text style={{ color: "#ccc", fontSize: 14, lineHeight: 21 }}>
                {item.instructions ||
                  "No instructions available for this exercise yet."}
              </Text>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const infoSectionLabel = {
  color: "#888",
  fontSize: 12,
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
  marginTop: 18,
  marginBottom: 8,
};