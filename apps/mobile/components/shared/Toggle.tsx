import { Text, TouchableOpacity, View } from "react-native";

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
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
      }}
    >
      <Text style={{ color: "#e5e5e5", fontSize: 14, flex: 1 }}>{label}</Text>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: value ? "#3b82f6" : "#3a3a3a",
          backgroundColor: value ? "#3b82f6" : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value && (
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>
            ✓
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
