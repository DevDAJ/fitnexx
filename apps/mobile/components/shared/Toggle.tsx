import { Text, TouchableOpacity, View } from "react-native";
import { colors, radii, spacing } from "../../lib/theme";

export function Toggle({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 14, flex: 1 }}>{label}</Text>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: radii.sm,
          borderWidth: 2,
          borderColor: value ? colors.brand : colors.borderStrong,
          backgroundColor: value ? colors.brand : colors.transparent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value && (
          <Text
            style={{ color: colors.onBrand, fontSize: 13, fontWeight: "800" }}
          >
            ✓
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
