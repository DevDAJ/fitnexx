import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMacrosCaptureStore, parseMacroScanResult, randomId } from "@fitnexx/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text, MutedText } from "@/components/ui/text";

export default function CaptureScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [busy, setBusy] = useState(false);
  const addCaptureRow = useMacrosCaptureStore((s) => s.addCaptureRow);
  const rows = useMacrosCaptureStore((s) => s.rows);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const scanFood = async () => {
    if (!image) return;
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "scan.jpg",
      } as unknown as Blob);
      if (context) formData.append("context", context);

      const apiKey = process.env.EXPO_PUBLIC_FOOD_SCAN_API_KEY;
      const res = await fetch(
        process.env.EXPO_PUBLIC_API_URL
          ? `${process.env.EXPO_PUBLIC_API_URL}/api/food-scan`
          : "/api/food-scan",
        {
          method: "POST",
          body: formData,
          headers: apiKey ? { "X-API-Key": apiKey } : undefined,
        },
      );

      if (!res.ok) throw new Error("Scan failed");
      const data = await res.json();
      const parsed = parseMacroScanResult(data);

      addCaptureRow({
        id: randomId("scan"),
        date: new Date().toISOString().slice(0, 10),
        imageUrl: image,
        fileName: "scan.jpg",
        foodName: parsed.foodName || context || "Scanned food",
        timeEaten: new Date().toLocaleTimeString(),
        mealClass: "other",
        protein: parsed.protein,
        fibre: parsed.fibre,
        carbohydrates: parsed.carbohydrates,
        fat: parsed.fat,
        calories: parsed.calories,
        rawResult: parsed.rawResult,
      });

      router.push("/(tabs)/macros/capture-rows");
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Scan Food" description="Take a photo of your meal." />

      {image ? (
        <Image source={{ uri: image }} className="h-64 w-full rounded-xl mb-4" resizeMode="cover" />
      ) : (
        <Card className="mb-4">
          <CardContent className="items-center py-8">
            <MutedText>No image selected</MutedText>
          </CardContent>
        </Card>
      )}

      <View className="gap-3 mb-4">
        <Button onPress={pickImage} disabled={busy}>
          <Text className="text-primary-foreground font-medium">
            {image ? "Retake Photo" : "Take Photo"}
          </Text>
        </Button>
        <Input
          placeholder="Context (e.g., 'lunch at home')"
          value={context}
          onChangeText={setContext}
        />
        {image && (
          <Button onPress={scanFood} disabled={busy}>
            <Text className="text-primary-foreground font-medium">
              {busy ? "Scanning..." : "Scan Food"}
            </Text>
          </Button>
        )}
      </View>

      <Button variant="ghost" onPress={() => router.back()}>
        <Text className="text-foreground">Back</Text>
      </Button>
    </ScrollView>
  );
}
