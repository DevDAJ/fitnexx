import { Text, View } from "react-native";
import { colors, radii, spacing } from "../../lib/theme";

type BadgeVariant =
  | "pr"
  | "improving"
  | "plateau"
  | "regression"
  | "new"
  | "neutral";

const STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  pr: { bg: colors.warning, text: colors.onBrand },
  improving: { bg: colors.success, text: colors.onBrand },
  plateau: { bg: colors.warning, text: colors.onBrand },
  regression: { bg: colors.dangerSolid, text: colors.text },
  new: { bg: colors.brand, text: colors.onBrand },
  neutral: { bg: colors.surfacePressed, text: colors.textSecondary },
};

export function Badge({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: BadgeVariant;
}) {
  const s = STYLES[variant];
  return (
    <View
      style={{
        backgroundColor: s.bg,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radii.sm,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: s.text, fontSize: 11, fontWeight: "700" }}>
        {label}
      </Text>
    </View>
  );
}
