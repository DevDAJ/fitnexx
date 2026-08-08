import { Stack } from "expo-router";

export default function MacrosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "hsl(0, 0%, 100%)" },
        headerTintColor: "hsl(189, 65%, 36%)",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Macros" }} />
      <Stack.Screen name="capture" options={{ title: "Scan Food", presentation: "modal" }} />
      <Stack.Screen name="capture-rows" options={{ title: "Captured Foods" }} />
    </Stack>
  );
}
