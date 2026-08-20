import { View, Text } from "react-native";

type BadgeVariant = "pr" | "improving" | "plateau" | "regression" | "new" | "neutral";

const STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  pr: { bg: "#fbbf24", text: "#000" },
  improving: { bg: "#22c55e", text: "#000" },
  plateau: { bg: "#f59e0b", text: "#000" },
  regression: { bg: "#ef4444", text: "#fff" },
  new: { bg: "#3b82f6", text: "#fff" },
  neutral: { bg: "#333", text: "#aaa" },
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
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: s.text, fontSize: 11, fontWeight: "700" }}>
        {label}
      </Text>
    </View>
  );
}
