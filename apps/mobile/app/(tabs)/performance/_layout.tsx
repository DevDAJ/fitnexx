import { Stack } from "expo-router";
import { useThemeColors } from "@/lib/theme";

export default function PerformanceLayout() {
  const c = useThemeColors();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.primary,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Performance" }} />
      <Stack.Screen name="gym" options={{ title: "Gym Equipment" }} />
      <Stack.Screen name="programming" options={{ title: "Programming" }} />
      <Stack.Screen name="suggest" options={{ title: "Suggest Next Workout" }} />
    </Stack>
  );
}
