import { ScrollView, View, Switch } from "react-native";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const c = useThemeColors();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Settings" description="Manage your preferences." />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Food scanning</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onPress={() => router.push("/(tabs)/settings/ai")}
            title="AI provider & key"
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="mb-2 text-sm text-muted-foreground">
            Sign in for free managed food scans and bonus scans from ads.
          </Text>
          <Button
            variant="outline"
            onPress={() => router.push("/(tabs)/settings/account")}
            title="Account & free scans"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-medium">Dark mode</Text>
              <Text className="text-sm text-muted-foreground">
                Easier on the eyes in low light.
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(v) => setColorScheme(v ? "dark" : "light")}
              trackColor={{ false: c.border, true: c.primary }}
              thumbColor="white"
            />
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
