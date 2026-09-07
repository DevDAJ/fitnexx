import { useMemo } from "react";
import { Text, View } from "react-native";
import { useAppStore } from "../../lib/store";
import { dayKey } from "../../lib/streak";

export function NutritionRecapCard() {
  const meals = useAppStore((s) => s.meals);
  const waterLog = useAppStore((s) => s.waterLog);
  const workouts = useAppStore((s) => s.workouts);

  const recap = useMemo(() => {
    const now = new Date();
    const windowDays = new Set<string>();
    for (let i = 1; i <= 7; i++) {
      windowDays.add(dayKey(new Date(now.getTime() - i * 86400000)));
    }
    const inWindow = (d: string) => windowDays.has(dayKey(new Date(d)));

    const weekMeals = meals.filter((m) => inWindow(m.date));
    const cals = weekMeals.reduce((a, m) => a + m.calories, 0);
    const protein = weekMeals.reduce((a, m) => a + m.protein, 0);
    const water = Object.entries(waterLog)
      .filter(([k]) => windowDays.has(k))
      .reduce((a, [, v]) => a + v, 0);
    const sessions = workouts.filter((w) => inWindow(w.date)).length;

    return {
      avgCals: Math.round(cals / 7),
      avgProtein: Math.round(protein / 7),
      waterMl: water,
      sessions,
    };
  }, [meals, waterLog, workouts]);

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <Text
        style={{
          color: "#888",
          fontSize: 12,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Past 7 Days
      </Text>
      <View style={{ flexDirection: "row", marginTop: 12, gap: 12 }}>
        <Stat label="Avg kcal" value={`${recap.avgCals}`} color="#3b82f6" />
        <Stat
          label="Avg protein"
          value={`${recap.avgProtein}g`}
          color="#22c55e"
        />
        <Stat
          label="Water"
          value={`${Math.round(recap.waterMl / 1000)}L`}
          color="#60a5fa"
        />
        <Stat label="Sessions" value={`${recap.sessions}`} color="#fbbf24" />
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color, fontSize: 18, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{label}</Text>
    </View>
  );
}
