import { ScrollView, View, Switch } from "react-native";
import { useColorScheme } from "nativewind";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Text } from "@/components/ui/text";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="Settings" description="Manage your preferences." />

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
              trackColor={{ false: "hsl(240, 5.9%, 90%)", true: "hsl(189, 65%, 36%)" }}
              thumbColor="white"
            />
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
