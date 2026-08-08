import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useMetricsStore } from "@fitnexx/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text, MutedText } from "@/components/ui/text";

export default function MetricsScreen() {
  const { entries, targetWeightKg, targetWeeklyPaceKg, activityLevel } = useMetricsStore(
    useShallow((s) => ({
      entries: s.entries,
      targetWeightKg: s.targetWeightKg,
      targetWeeklyPaceKg: s.targetWeeklyPaceKg,
      activityLevel: s.activityLevel,
    })),
  );
  const setMetricsState = useMetricsStore((s) => s.setMetricsState);

  const [weight, setWeight] = useState("");
  const [bf, setBf] = useState("");

  const latest = entries.length > 0
    ? [...entries].sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;

  const addEntry = () => {
    const w = Number.parseFloat(weight);
    const b = Number.parseFloat(bf);
    if (Number.isNaN(w) || Number.isNaN(b)) return;
    setMetricsState((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          weightKg: w,
          bodyFatPercent: b,
        },
      ],
    }));
    setWeight("");
    setBf("");
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Metrics" description="Track your body measurements." />

      {latest && (
        <View className="flex-row gap-3 mb-4">
          <Card className="flex-1">
            <CardHeader><CardTitle>Weight</CardTitle></CardHeader>
            <CardContent>
              <Text className="text-2xl font-bold">{latest.weightKg} kg</Text>
              <MutedText>{latest.date}</MutedText>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader><CardTitle>Body Fat</CardTitle></CardHeader>
            <CardContent>
              <Text className="text-2xl font-bold">{latest.bodyFatPercent}%</Text>
              <MutedText>{latest.date}</MutedText>
            </CardContent>
          </Card>
        </View>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Log Measurement</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Input placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
          <Input placeholder="Body fat %" value={bf} onChangeText={setBf} keyboardType="numeric" />
          <Button onPress={addEntry} disabled={!weight || !bf}>
            <Text className="text-primary-foreground font-medium">Add Entry</Text>
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row justify-between py-2">
            <Text>Target weight</Text>
            <Text className="font-medium">{targetWeightKg ?? "Not set"} kg</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text>Weekly pace</Text>
            <Text className="font-medium">{targetWeeklyPaceKg ?? "Not set"} kg/wk</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text>Activity level</Text>
            <Text className="font-medium capitalize">{activityLevel.replace("_", " ")}</Text>
          </View>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            {[...entries].reverse().map((e) => (
              <View key={e.id} className="flex-row justify-between py-2 border-b border-border last:border-0">
                <Text className="text-muted-foreground">{e.date}</Text>
                <Text>{e.weightKg} kg</Text>
                <Text className="text-muted-foreground">{e.bodyFatPercent}%</Text>
              </View>
            ))}
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
}
