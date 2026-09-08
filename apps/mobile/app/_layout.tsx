import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState } from "react-native";
import { TamaguiProvider } from "tamagui";
import { AuthProvider } from "../components/auth/AuthProvider";
import { ProProvider } from "../components/auth/ProProvider";
import { ToastProvider } from "../components/shared/Toast";
import { useAppStore } from "../lib/store";
import { autoSyncIfPaired, getAppToken } from "../lib/sync";
import config from "../tamagui.config";

export default function RootLayout() {
  const loadAll = useAppStore((s) => s.loadAll);
  const refreshCurrentGym = useAppStore((s) => s.refreshCurrentGym);

  useEffect(() => {
    loadAll().then(() => {
      void refreshCurrentGym();
      void getAppToken().catch(() => undefined);
      void autoSyncIfPaired().catch(() => undefined);
    });
  }, [loadAll, refreshCurrentGym]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void refreshCurrentGym();
        void autoSyncIfPaired().catch(() => undefined);
      }
    });
    return () => sub.remove();
  }, [refreshCurrentGym]);

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <AuthProvider>
        <ProProvider>
          <ToastProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#0a0a0a" },
              }}
            />
          </ToastProvider>
        </ProProvider>
      </AuthProvider>
    </TamaguiProvider>
  );
}
