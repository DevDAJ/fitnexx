import { useEffect, useState } from "react";
import { ScrollView, View, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@clerk/clerk-expo";
import type { ScanQuota, ScanResult } from "@fitnexx/shared";
import {
  useMacrosCaptureStore,
  useAiSettingsStore,
  scanFoodWithProvider,
  randomId,
} from "@fitnexx/shared";
import { getApiKey } from "@/lib/secureKeys";
import { getQuota, managedScan, redeemAd } from "@/lib/scanApi";
import { watchRewardedAd } from "@/lib/rewardedAd";
import { isClerkConfigured } from "@/lib/clerk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text, MutedText } from "@/components/ui/text";
import { cn } from "@/lib/cn";

type ScanMode = "byok" | "managed";

function ManagedScanButton(props: {
  imageBase64: string;
  mimeType: string;
  context: string;
  onScanned: (result: ScanResult) => void;
  onError: (err: unknown) => void;
}) {
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [quota, setQuota] = useState<ScanQuota | null>(null);

  const refreshQuota = async () => {
    const token = await getToken();
    if (token) setQuota(await getQuota(token));
  };

  useEffect(() => {
    if (isSignedIn) {
      refreshQuota().catch(() => {});
    }
  }, [isSignedIn]);

  const start = async () => {
    if (!isSignedIn) {
      router.push("/(tabs)/settings/account");
      return;
    }
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) return;

      let q = quota;
      if (!q) {
        q = await getQuota(token);
        setQuota(q);
      }
      if (q.remaining <= 0) {
        const earned = await watchRewardedAd();
        if (!earned) return;
        q = await redeemAd(token);
        setQuota(q);
      }

      const { result } = await managedScan(token, {
        imageBase64: props.imageBase64,
        mimeType: props.mimeType,
        context: props.context,
      });
      props.onScanned(result);
    } catch (err) {
      props.onError(err);
    } finally {
      setBusy(false);
    }
  };

  const label = quota && quota.remaining > 0
    ? `Scan (${quota.remaining} left)`
    : "Scan";

  return (
    <Button onPress={start} disabled={busy}>
      <Text className="text-primary-foreground font-medium">
        {busy ? "Scanning..." : label}
      </Text>
    </Button>
  );
}

export default function CaptureScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [context, setContext] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ScanMode>("byok");
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

  const addScanned = (result: ScanResult) => {
    addCaptureRow({
      id: randomId("scan"),
      date: new Date().toISOString().slice(0, 10),
      imageUrl: image ?? "",
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
  };

  const scanByok = async () => {
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
      addScanned(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleManagedError = (err: unknown) => {
    setError(err instanceof Error ? err.message : "Scan failed");
    console.error(err);
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Scan Food" description="Take a photo of your meal." />

      <View className="flex-row gap-2 mb-4">
        <Pressable
          onPress={() => setMode("byok")}
          className={cn(
            "flex-1 rounded-lg border px-3 py-2",
            mode === "byok" ? "bg-primary border-primary" : "border-border",
          )}
        >
          <Text className={cn("text-center text-sm", mode === "byok" ? "text-primary-foreground" : "text-foreground")}>
            Bring your own key
          </Text>
        </Pressable>
        <Pressable
          onPress={() => isClerkConfigured && setMode("managed")}
          className={cn(
            "flex-1 rounded-lg border px-3 py-2",
            mode === "managed" ? "bg-primary border-primary" : "border-border",
            !isClerkConfigured && "opacity-40",
          )}
        >
          <Text className={cn("text-center text-sm", mode === "managed" ? "text-primary-foreground" : "text-foreground")}>
            Free account scans
          </Text>
        </Pressable>
      </View>

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
        {error && <MutedText className="text-red-500">{error}</MutedText>}
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
        {image && imageBase64 && mode === "byok" && (
          <Button onPress={scanByok} disabled={busy}>
            <Text className="text-primary-foreground font-medium">
              {busy ? "Scanning..." : "Scan Food"}
            </Text>
          </Button>
        )}
        {image && imageBase64 && mode === "managed" && isClerkConfigured && (
          <ManagedScanButton
            imageBase64={imageBase64}
            mimeType={mimeType}
            context={context}
            onScanned={addScanned}
            onError={handleManagedError}
          />
        )}
      </View>

      <Button variant="ghost" onPress={() => router.back()}>
        <Text className="text-foreground">Back</Text>
      </Button>
    </ScrollView>
  );
}
