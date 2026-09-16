import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../components/auth/AuthProvider";
import { AppButton, AppTextInput, ScreenTitle } from "../components/shared/ui";
import { colors, radii, spacing } from "../lib/theme";

export default function AuthScreen() {
  const router = useRouter();
  const { configured, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    setMessage("");
    if (!email.trim() || password.length < 8) {
      setMessage("Enter an email and a password with at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signIn") {
        await signIn(email.trim(), password);
        router.back();
      } else if (await signUp(email.trim(), password)) {
        setMessage("Check your email to confirm your account.");
      } else {
        router.back();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Close"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <ScreenTitle style={styles.title}>
          {mode === "signIn" ? "Sign in" : "Create account"}
        </ScreenTitle>
        <Text style={styles.copy}>
          Sign in to use Fitnexx Pro. Your workout and nutrition history stays
          on this device.
        </Text>
        <AppTextInput
          autoCapitalize="none"
          autoComplete="email"
          editable={!busy}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          value={email}
        />
        <AppTextInput
          autoCapitalize="none"
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
          editable={!busy}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {!configured ? (
          <Text style={styles.error}>
            Supabase is not configured in the mobile environment.
          </Text>
        ) : null}
        {message ? <Text style={styles.error}>{message}</Text> : null}
        <AppButton
          disabled={busy || !configured}
          onPress={submit}
          style={styles.primaryButton}
        >
          {busy ? (
            <ActivityIndicator color={colors.onBrand} />
          ) : (
            <Text style={styles.primaryText}>
              {mode === "signIn" ? "Sign in" : "Create account"}
            </Text>
          )}
        </AppButton>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={busy}
          onPress={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
        >
          <Text style={styles.switchText}>
            {mode === "signIn"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: 56,
    alignItems: "flex-end",
  },
  iconButton: { padding: 8 },
  form: { flex: 1, justifyContent: "center", padding: spacing.xl, gap: 14 },
  title: { fontSize: 30 },
  copy: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
  },
  primaryButton: {
    borderRadius: radii.md,
    minHeight: 50,
  },
  primaryText: { color: colors.onBrand, fontSize: 16, fontWeight: "700" },
  error: { color: colors.danger, fontSize: 13, lineHeight: 18 },
  switchText: {
    color: colors.brand,
    fontSize: 14,
    textAlign: "center",
    padding: 8,
  },
});
