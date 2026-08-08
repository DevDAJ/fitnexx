import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  useMacrosCaptureStore,
  useAiSettingsStore,
  scanFoodWithProvider,
  randomId,
} from "@fitnexx/shared";
import { getApiKey } from "@/lib/secureKeys";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text, MutedText } from "@/components/ui/text";

export default function CaptureScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [context, setContext] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addCaptureRow = useMacrosCaptureStore((s) => s.addCaptureRow);
  const aiConfig = useAiSettingsStore((s) => s.config);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 ?? null);
      setMimeType(result.assets[0].mimeType ?? "image/jpeg");
      setError(null);
    }
  };

  const scanFood = async () => {
    if (!image || !imageBase64) return;
    setBusy(true);
    setError(null);
    try {
      const apiKey = await getApiKey(aiConfig.provider);
      const result = await scanFoodWithProvider(aiConfig, {
        imageBase64,
        mimeType,
        context,
        apiKey: apiKey ?? undefined,
      });

      addCaptureRow({
        id: randomId("scan"),
        date: new Date().toISOString().slice(0, 10),
        imageUrl: image,
        fileName: "scan.jpg",
        foodName: result.foodName || context || "Scanned food",
        timeEaten: new Date().toLocaleTimeString(),
        mealClass: "other",
        protein: String(result.total.protein),
        fibre: String(result.total.fibre),
        carbohydrates: String(result.total.carbohydrates),
        fat: String(result.total.fat),
        calories: String(result.total.calories),
        rawResult: JSON.stringify(result),
      });

      router.push("/(tabs)/macros/capture-rows");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
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
        {error && (
          <MutedText className="text-red-500">{error}</MutedText>
        )}
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
