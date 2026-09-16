import { Text, TouchableOpacity, View } from "react-native";
import { useAppStore } from "../../lib/store";
import { colors, radii } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

const GOAL = 2000;

export function WaterCard() {
  const waterLog = useAppStore((s) => s.waterLog);
  const addWater = useAppStore((s) => s.addWater);
  const today = new Date().toISOString().slice(0, 10);
  const ml = waterLog[today] ?? 0;
  const pct = Math.min((ml / GOAL) * 100, 100);

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <SectionLabel>Water</SectionLabel>
        <Text style={{ color: colors.brand, fontSize: 16, fontWeight: "700" }}>
          {ml} / {GOAL} ml
        </Text>
      </View>

      <View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.surfacePressed,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: pct >= 100 ? colors.success : colors.brand,
            borderRadius: 3,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        {[250, 500].map((increment) => (
          <TouchableOpacity
            key={increment}
            onPress={() => addWater(increment)}
            style={{
              flex: 1,
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.md,
              padding: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.borderStrong,
            }}
          >
            <Text
              style={{ color: colors.text, fontSize: 14, fontWeight: "700" }}
            >
              +{increment} ml
            </Text>
          </TouchableOpacity>
        ))}
        {ml > 0 && (
          <TouchableOpacity
            onPress={() => addWater(-ml)}
            style={{
              flex: 1,
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.md,
              padding: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.borderStrong,
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}
