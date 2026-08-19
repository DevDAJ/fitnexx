import { Stack } from "expo-router";
import { useThemeColors } from "@/lib/theme";

export default function SettingsLayout() {
  const c = useThemeColors();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.primary,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="ai" options={{ title: "AI Food Scanning" }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
    </Stack>
  );
}
