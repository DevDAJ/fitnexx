import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import type { TemplateExercise, WorkoutSuggestion } from "@fitnexx/shared";
import {
  buildWorkoutContext,
  normalizeWorkoutSuggestion,
  useGymStore,
  usePerformanceStore,
  useProgrammingStore,
} from "@fitnexx/shared";
import { generateWorkoutSuggestion } from "@/lib/localLlm";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text, MutedText } from "@/components/ui/text";

type Status = "idle" | "loading" | "generating" | "done" | "error";

export default function SuggestScreen() {
  const router = useRouter();
  const performance = usePerformanceStore(
    useShallow((s) => ({
      exercises: s.exercises,
      sets: s.sets,
      muscleGroups: s.muscleGroups,
    })),
  );
  const gym = useGymStore(
    useShallow((s) => ({
      equipmentCatalog: s.equipmentCatalog,
      myEquipmentIds: s.myEquipmentIds,
      exerciseEquipment: s.exerciseEquipment,
    })),
  );

  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [raw, setRaw] = useState("");
  const [suggestion, setSuggestion] = useState<WorkoutSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setStatus("loading");
    setProgress(0);
    setRaw("");
    setSuggestion(null);
    setError(null);
    try {
      const contextText = buildWorkoutContext({ performance, gym });
      setStatus("generating");
      const text = await generateWorkoutSuggestion(contextText, (token) => {
        setRaw((prev) => prev + token);
      });
      setSuggestion(normalizeWorkoutSuggestion(text));
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suggestion failed");
      setStatus("error");
    }
  };

  const startSession = () => {
    if (!suggestion) return;
    const store = useProgrammingStore.getState();
    const templateId = store.generateTemplateId();
    const sessionId = store.generateSessionId();
    const exercises: TemplateExercise[] = [];
    for (const ex of suggestion.exercises) {
      const match = performance.exercises.find(
        (e) => e.name.toLowerCase() === ex.name.toLowerCase(),
      );
      if (!match) continue;
      exercises.push({
        ...store.makeTemplateExercise(match.id),
        targetSets: ex.sets,
        targetReps: ex.reps,
        notes: ex.notes,
      });
    }

    if (exercises.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const name = `Suggested: ${suggestion.focus}`;
    store.addTemplate({
      id: templateId,
      name,
      exercises,
      createdAt: new Date().toISOString(),
    });
    store.addSession({
      id: sessionId,
      templateId,
      name,
      date: today,
      startedAt: new Date().toISOString(),
      notes: suggestion.summary,
    });
    router.push("/(tabs)/performance/programming");
  };

  const busy = status === "loading" || status === "generating";

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header
        title="Suggest next workout"
        description="Runs locally on this device using your logged workouts."
      />

      <View className="gap-3 mb-4">
        {status === "loading" && (
          <MutedText>
            Loading model{progress > 0 ? ` (${Math.round(progress * 100)}%)` : "..."}
          </MutedText>
        )}
        {status === "generating" && <MutedText>Generating suggestion...</MutedText>}
        {error && <MutedText className="text-red-500">{error}</MutedText>}
        <Button onPress={run} disabled={busy}>
          <Text className="text-primary-foreground font-medium">
            {busy ? "Working..." : "Suggest next workout"}
          </Text>
        </Button>
      </View>

      {suggestion && (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{suggestion.focus || "Suggested workout"}</CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              {suggestion.summary && <MutedText>{suggestion.summary}</MutedText>}
              {suggestion.exercises.map((ex, i) => (
                <View key={`${ex.name}-${i}`} className="flex-row justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                  <View className="flex-1 pr-3">
                    <Text className="font-medium">{ex.name}</Text>
                    {ex.notes && <MutedText className="text-xs">{ex.notes}</MutedText>}
                  </View>
                  <Text className="text-muted-foreground">
                    {ex.sets} × {ex.reps}
                  </Text>
                </View>
              ))}
              <Button onPress={startSession}>
                <Text className="text-primary-foreground font-medium">Start as session</Text>
              </Button>
            </CardContent>
          </Card>
          {raw.length > 0 && (
            <MutedText className="mb-4 text-xs">Raw output: {raw}</MutedText>
          )}
        </>
      )}

      <Button variant="ghost" onPress={() => router.back()}>
        <Text className="text-foreground">Back</Text>
      </Button>
    </ScrollView>
  );
}
