import { Stack } from "expo-router";

export default function MetricsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "hsl(0, 0%, 100%)" },
        headerTintColor: "hsl(189, 65%, 36%)",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Metrics" }} />
    </Stack>
  );
}
