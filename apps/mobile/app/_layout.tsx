import { useEffect } from "react";
import { TamaguiProvider } from "tamagui";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import config from "../tamagui.config";
import { useAppStore } from "../lib/store";
import { ToastProvider } from "../components/shared/Toast";

export default function RootLayout() {
  const loadAll = useAppStore((s) => s.loadAll);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <ToastProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0a0a0a" },
          }}
        />
      </ToastProvider>
    </TamaguiProvider>
  );
}
