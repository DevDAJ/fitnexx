import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radii, spacing } from "../../lib/theme";
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
          backgroundColor: colors.overlay,
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.surfaceRaised,
            borderTopLeftRadius: radii.lg,
            borderTopRightRadius: radii.lg,
            paddingHorizontal: spacing.lg,
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
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: "800",
                    flex: 1,
                  }}
                >
                  {item.name}
                </Text>
                <TouchableOpacity onPress={onClose} hitSlop={8}>
                  <Ionicons
                    name="close"
                    size={22}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>
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
                    borderRadius: radii.md,
                    marginTop: spacing.lg,
                    backgroundColor: colors.surfacePressed,
                    resizeMode: "contain",
                  }}
                />
              )}
              <Text style={infoSectionLabel}>HOW TO DO IT</Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
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
  color: colors.textMuted,
  fontSize: 12,
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
  marginTop: 18,
  marginBottom: 8,
};
