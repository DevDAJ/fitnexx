import { Stack } from "expo-router";
import { useThemeColors } from "@/lib/theme";

export default function MacrosLayout() {
  const c = useThemeColors();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.primary,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Macros" }} />
      <Stack.Screen name="capture" options={{ title: "Scan Food", presentation: "modal" }} />
      <Stack.Screen name="capture-rows" options={{ title: "Captured Foods" }} />
    </Stack>
  );
}
