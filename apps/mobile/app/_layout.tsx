import { TamaguiProvider } from "tamagui";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import config from "../tamagui.config";

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0a0a0a" },
        }}
      />
    </TamaguiProvider>
  );
}
