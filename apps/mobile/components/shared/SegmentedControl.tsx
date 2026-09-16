import { Text, TouchableOpacity, View } from "react-native";
import { colors, radii, spacing } from "../../lib/theme";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderRadius: radii.md,
        padding: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <TouchableOpacity
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: radii.sm,
              alignItems: "center",
              backgroundColor: active ? colors.brand : colors.transparent,
            }}
          >
            <Text
              style={{
                color: active ? colors.onBrand : colors.textSecondary,
                fontSize: 14,
                fontWeight: active ? "700" : "600",
              }}
            >
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
