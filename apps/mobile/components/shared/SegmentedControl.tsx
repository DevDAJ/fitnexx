import { Text, TouchableOpacity, View } from "react-native";

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
        backgroundColor: "#161616",
        borderRadius: 12,
        padding: 3,
        borderWidth: 1,
        borderColor: "#222",
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
              borderRadius: 9,
              alignItems: "center",
              backgroundColor: active ? "#3b82f6" : "transparent",
            }}
          >
            <Text
              style={{
                color: active ? "#fff" : "#888",
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
