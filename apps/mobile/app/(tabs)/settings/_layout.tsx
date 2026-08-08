import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "hsl(0, 0%, 100%)" },
        headerTintColor: "hsl(189, 65%, 36%)",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="ai" options={{ title: "AI Food Scanning" }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
    </Stack>
  );
}
