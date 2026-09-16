import { useMemo } from "react";
import { Text, View } from "react-native";
import { useAppStore } from "../../lib/store";
import { dayKey } from "../../lib/streak";
import { colors } from "../../lib/theme";
import { Card, SectionLabel } from "../shared/ui";

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
    <Card>
      <SectionLabel>Past 7 Days</SectionLabel>
      <View style={{ flexDirection: "row", marginTop: 12, gap: 12 }}>
        <Stat
          label="Avg kcal"
          value={`${recap.avgCals}`}
          color={colors.brand}
        />
        <Stat
          label="Avg protein"
          value={`${recap.avgProtein}g`}
          color={colors.success}
        />
        <Stat
          label="Water"
          value={`${Math.round(recap.waterMl / 1000)}L`}
          color={colors.brand}
        />
        <Stat
          label="Sessions"
          value={`${recap.sessions}`}
          color={colors.warning}
        />
      </View>
    </Card>
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
      <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}
