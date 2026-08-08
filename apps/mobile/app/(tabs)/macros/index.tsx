import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { Camera, ImagePlus } from "lucide-react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function MacrosScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Macros" description="Track your food intake." />

      <View className="gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Scan Food</CardTitle>
          </CardHeader>
          <CardContent className="gap-3">
            <Button
              variant="default"
              onPress={() => router.push("/(tabs)/macros/capture")}
            >
              <Camera size={18} color="white" />
              <Text className="ml-2 text-primary-foreground font-medium">
                Take Photo
              </Text>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Captured Foods</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onPress={() => router.push("/(tabs)/macros/capture-rows")}
            >
              <Text className="text-foreground font-medium">View History</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
