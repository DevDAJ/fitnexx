import { ScrollView, View, Pressable } from "react-native";
import { useMacrosCaptureStore } from "@fitnexx/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Text, MutedText } from "@/components/ui/text";

export default function CaptureRowsScreen() {
  const rows = useMacrosCaptureStore((s) => s.rows);
  const removeCaptureRow = useMacrosCaptureStore((s) => s.removeCaptureRow);

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Captured Foods" description="Your food scan history." />

      {rows.length === 0 ? (
        <Card>
          <CardContent className="items-center py-8">
            <MutedText>No foods captured yet.</MutedText>
          </CardContent>
        </Card>
      ) : (
        rows.map((row) => (
          <Pressable
            key={row.id}
            onLongPress={() => removeCaptureRow(row.id)}
            className="mb-3"
          >
            <Card>
              <CardHeader>
                <View className="flex-row justify-between items-start">
                  <CardTitle className="flex-1">{row.foodName}</CardTitle>
                  <Text className="font-bold">{row.calories} kcal</Text>
                </View>
              </CardHeader>
              <CardContent>
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <MutedText>Protein: {row.protein}g</MutedText>
                    <MutedText>Carbs: {row.carbohydrates}g</MutedText>
                  </View>
                  <View className="flex-1">
                    <MutedText>Fat: {row.fat}g</MutedText>
                    <MutedText>Fibre: {row.fibre}g</MutedText>
                  </View>
                </View>
                <MutedText className="mt-2">
                  {row.date} - {row.timeEaten} ({row.mealClass})
                </MutedText>
              </CardContent>
            </Card>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
