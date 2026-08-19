import { Stack } from "expo-router";
import { useThemeColors } from "@/lib/theme";

export default function MetricsLayout() {
  const c = useThemeColors();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.primary,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Metrics" }} />
    </Stack>
  );
}
