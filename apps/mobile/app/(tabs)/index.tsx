import { useShallow } from "zustand/react/shallow";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePerformanceStore } from "@fitnexx/shared";
import { useMacrosCaptureStore } from "@fitnexx/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Text, MutedText } from "@/components/ui/text";

export default function DashboardScreen() {
  const { sets, exercises } = usePerformanceStore(
    useShallow((s) => ({ sets: s.sets, exercises: s.exercises })),
  );
  const rows = useMacrosCaptureStore((s) => s.rows);

  const totalVolume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
  const totalWorkouts = new Set(sets.map((s) => s.date)).size;
  const recentMacros = rows.slice(-5).reverse();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1 bg-background p-4">
        <Header title="Dashboard" description="Your fitness overview" />

      <View className="flex-row gap-3 mb-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-2xl font-bold">{totalVolume.toLocaleString()} kg</Text>
            <MutedText>Total logged</MutedText>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-2xl font-bold">{totalWorkouts}</Text>
            <MutedText>Days trained</MutedText>
          </CardContent>
        </Card>
      </View>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-2xl font-bold">{exercises.length}</Text>
          <MutedText>In your catalog</MutedText>
        </CardContent>
      </Card>

      {recentMacros.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Foods</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMacros.map((row) => (
              <View key={row.id} className="flex-row justify-between py-2 border-b border-border last:border-0">
                <View className="flex-1">
                  <Text className="font-medium">{row.foodName}</Text>
                  <MutedText>{row.date} - {row.timeEaten}</MutedText>
                </View>
                <Text className="font-medium">{row.calories} kcal</Text>
              </View>
            ))}
          </CardContent>
        </Card>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}
