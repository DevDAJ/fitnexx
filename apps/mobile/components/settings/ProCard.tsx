import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { purchasePro, restorePro } from "../../lib/payments";
import { useAppStore } from "../../lib/store";
import { useAuth } from "../auth/AuthProvider";

export function ProCard() {
  const router = useRouter();
  const { user } = useAuth();
  const isPro = useAppStore((state) => state.isPro);
  const setIsPro = useAppStore((state) => state.setIsPro);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<boolean>) => {
    if (!user) {
      router.push("/auth");
      return;
    }
    setBusy(true);
    try {
      const active = await action();
      await setIsPro(active);
      Alert.alert(
        active ? "Pro active" : "No purchase found",
        active
          ? "Fitnexx Pro is ready."
          : "No active Pro subscription was found.",
      );
    } catch (error) {
      const cancelled =
        typeof error === "object" &&
        error !== null &&
        "userCancelled" in error &&
        error.userCancelled;
      if (!cancelled) {
        Alert.alert(
          "Purchase unavailable",
          error instanceof Error ? error.message : "Try again.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderColor: isPro ? "#fbbf24" : "#222",
        borderRadius: 14,
        borderWidth: 1,
        gap: 12,
        padding: 16,
      }}
    >
      <Text
        style={{
          color: "#888",
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 0.5,
        }}
      >
        FITNEXX PRO
      </Text>
      <Text style={{ color: "#e5e5e5", fontSize: 18, fontWeight: "700" }}>
        {isPro ? "Pro is active" : "$3.99 per month"}
      </Text>
      <Text style={{ color: "#666", fontSize: 13, lineHeight: 19 }}>
        {isPro
          ? "Unlimited server-powered AI suggestions are enabled."
          : "Use AI suggestions without managing provider keys. Cancel through your app store."}
      </Text>
      {!isPro ? (
        <TouchableOpacity
          accessibilityRole="button"
          disabled={busy}
          onPress={() => void run(purchasePro)}
          style={{
            alignItems: "center",
            backgroundColor: "#fbbf24",
            borderRadius: 10,
            opacity: busy ? 0.5 : 1,
            padding: 13,
          }}
        >
          <Text style={{ color: "#111", fontSize: 14, fontWeight: "800" }}>
            {user ? "Start Pro" : "Sign in to start Pro"}
          </Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void run(restorePro)}
        style={{ alignItems: "center", padding: 6 }}
      >
        <Text style={{ color: "#60a5fa", fontSize: 13, fontWeight: "600" }}>
          Restore purchases
        </Text>
      </TouchableOpacity>
    </View>
  );
}
