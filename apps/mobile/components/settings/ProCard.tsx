import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

import { purchasePro, restorePro } from "../../lib/payments";
import { useAppStore } from "../../lib/store";
import { colors } from "../../lib/theme";
import { useAuth } from "../auth/AuthProvider";
import { AppButton, Card, SectionLabel } from "../shared/ui";

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
    <Card
      style={{
        borderColor: isPro ? colors.warning : colors.border,
        gap: 12,
      }}
    >
      <SectionLabel>Fitnexx Pro</SectionLabel>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
        {isPro ? "Pro is active" : "$3.99 per month"}
      </Text>
      <Text
        style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 19 }}
      >
        {isPro
          ? "Unlimited server-powered AI suggestions are enabled."
          : "Use AI suggestions without managing provider keys. Cancel through your app store."}
      </Text>
      {!isPro ? (
        <AppButton
          disabled={busy}
          onPress={() => void run(purchasePro)}
          style={{
            backgroundColor: colors.warning,
            borderColor: colors.warning,
          }}
        >
          <Text
            style={{ color: colors.onBrand, fontSize: 14, fontWeight: "800" }}
          >
            {user ? "Start Pro" : "Sign in to start Pro"}
          </Text>
        </AppButton>
      ) : null}
      <TouchableOpacity
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void run(restorePro)}
        style={{ alignItems: "center", padding: 6 }}
      >
        <Text style={{ color: colors.brand, fontSize: 13, fontWeight: "600" }}>
          Restore purchases
        </Text>
      </TouchableOpacity>
    </Card>
  );
}
