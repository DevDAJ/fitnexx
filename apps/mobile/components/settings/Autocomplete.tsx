import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../lib/theme";

type Option = { label: string; value: string };

export function Autocomplete({
  label,
  options,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const visible = options
    .filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 30);

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="none"
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChangeText={(text) => {
          setQuery(text);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={{
          backgroundColor: colors.surfaceRaised,
          borderColor: open ? colors.brand : colors.border,
          borderRadius: 10,
          borderWidth: 1,
          color: colors.text,
          fontSize: 14,
          padding: 12,
        }}
        value={open ? query : (selected?.label ?? value)}
      />
      {open && visible.length > 0 ? (
        <View
          style={{
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.border,
            borderRadius: 10,
            borderWidth: 1,
            maxHeight: 210,
            overflow: "hidden",
          }}
        >
          {visible.map((option) => (
            <TouchableOpacity
              accessibilityRole="button"
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setQuery("");
                setOpen(false);
              }}
              style={{
                borderBottomColor: colors.border,
                borderBottomWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 11,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 14 }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}
