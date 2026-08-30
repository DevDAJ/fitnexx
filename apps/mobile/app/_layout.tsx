import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState } from "react-native";
import { TamaguiProvider } from "tamagui";
import { ToastProvider } from "../components/shared/Toast";
import { useAppStore } from "../lib/store";
import config from "../tamagui.config";

export default function RootLayout() {
  const loadAll = useAppStore((s) => s.loadAll);
  const refreshCurrentGym = useAppStore((s) => s.refreshCurrentGym);

  useEffect(() => {
    loadAll().then(() => refreshCurrentGym());
  }, [loadAll, refreshCurrentGym]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshCurrentGym();
    });
    return () => sub.remove();
  }, [refreshCurrentGym]);

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
