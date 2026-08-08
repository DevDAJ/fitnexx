import { useCallback, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import { usePerformanceStore, randomId } from "@fitnexx/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text, MutedText } from "@/components/ui/text";

export default function PerformanceScreen() {
  const { exercises, sets, muscleGroups } = usePerformanceStore(
    useShallow((s) => ({ exercises: s.exercises, sets: s.sets, muscleGroups: s.muscleGroups })),
  );

  const router = useRouter();
  const [filterMuscle, setFilterMuscle] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const setPerformanceState = usePerformanceStore((s) => s.setPerformanceState);

  const filteredExercises = filterMuscle
    ? exercises.filter((e) => e.muscleGroupId === filterMuscle)
    : exercises;

  const selectedExerciseName = exercises.find((e) => e.id === selectedExercise)?.name;

  const addSet = useCallback(() => {
    if (!selectedExercise || !weight || !reps) return;
    const w = Number.parseFloat(weight);
    const r = Number.parseInt(reps, 10);
    if (Number.isNaN(w) || Number.isNaN(r)) return;

    const newSet = {
      id: randomId("set"),
      exerciseId: selectedExercise,
      date: new Date().toISOString().slice(0, 10),
      weight: w,
      reps: r,
      unit: "kg" as const,
    };

    setPerformanceState((prev) => ({
      ...prev,
      sets: [...prev.sets, newSet],
    }));
    setWeight("");
    setReps("");
  }, [selectedExercise, weight, reps, setPerformanceState]);

  const todaysSets = sets.filter((s) => s.date === new Date().toISOString().slice(0, 10));

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Performance" description="Log your workouts." />

      <View className="flex-row gap-2 mb-4">
        <Button variant="outline" onPress={() => router.push("/(tabs)/performance/gym")}>
          <Text className="text-foreground font-medium">Gym Equipment</Text>
        </Button>
        <Button variant="outline" onPress={() => router.push("/(tabs)/performance/programming")}>
          <Text className="text-foreground font-medium">Programming</Text>
        </Button>
      </View>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Log Set</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <View className="flex-row flex-wrap gap-1 mb-2">
            {muscleGroups.map((mg) => (
              <Pressable
                key={mg.id}
                onPress={() => setFilterMuscle(filterMuscle === mg.id ? "" : mg.id)}
                className={`px-3 py-1 rounded-full border ${
                  filterMuscle === mg.id
                    ? "bg-primary border-primary"
                    : "border-border"
                }`}
              >
                <Text
                  className={`text-xs ${
                    filterMuscle === mg.id ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {mg.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView horizontal className="mb-2">
            <View className="flex-row gap-2">
              {filteredExercises.map((ex) => (
                <Pressable
                  key={ex.id}
                  onPress={() => setSelectedExercise(ex.id)}
                  className={`px-3 py-2 rounded-lg border ${
                    selectedExercise === ex.id
                      ? "bg-primary border-primary"
                      : "border-border"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedExercise === ex.id ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {ex.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {selectedExerciseName && (
            <>
              <Input placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
              <Input placeholder="Reps" value={reps} onChangeText={setReps} keyboardType="numeric" />
              <Button onPress={addSet} disabled={!weight || !reps}>
                <Text className="text-primary-foreground font-medium">Add Set</Text>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {todaysSets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Sets</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysSets.map((s) => {
              const exName = exercises.find((e) => e.id === s.exerciseId)?.name ?? s.exerciseId;
              return (
                <View key={s.id} className="flex-row justify-between py-2 border-b border-border last:border-0">
                  <Text className="flex-1 font-medium">{exName}</Text>
                  <Text className="text-muted-foreground">
                    {s.weight}kg × {s.reps}
                  </Text>
                </View>
              );
            })}
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
}
