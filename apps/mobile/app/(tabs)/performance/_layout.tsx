import { Stack } from "expo-router";

export default function PerformanceLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "hsl(0, 0%, 100%)" },
        headerTintColor: "hsl(189, 65%, 36%)",
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
