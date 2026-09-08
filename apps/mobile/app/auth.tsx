import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../components/auth/AuthProvider";

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
          <Ionicons name="close" size={24} color="#e5e5e5" />
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>
          {mode === "signIn" ? "Sign in" : "Create account"}
        </Text>
        <Text style={styles.copy}>
          Sign in to use Fitnexx Pro. Your workout and nutrition history stays
          on this device.
        </Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          editable={!busy}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#666"
          style={styles.input}
          value={email}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
          editable={!busy}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#666"
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
        <TouchableOpacity
          accessibilityRole="button"
          disabled={busy || !configured}
          onPress={submit}
          style={[
            styles.primaryButton,
            (busy || !configured) && styles.disabled,
          ]}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>
              {mode === "signIn" ? "Sign in" : "Create account"}
            </Text>
          )}
        </TouchableOpacity>
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
  screen: { flex: 1, backgroundColor: "#0a0a0a" },
  header: { paddingHorizontal: 20, paddingTop: 56, alignItems: "flex-end" },
  iconButton: { padding: 8 },
  form: { flex: 1, justifyContent: "center", padding: 24, gap: 14 },
  title: { color: "#fff", fontSize: 30, fontWeight: "700" },
  copy: { color: "#888", fontSize: 15, lineHeight: 22, marginBottom: 8 },
  input: {
    backgroundColor: "#161616",
    borderColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    minHeight: 50,
    justifyContent: "center",
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.45 },
  error: { color: "#f87171", fontSize: 13, lineHeight: 18 },
  switchText: {
    color: "#60a5fa",
    fontSize: 14,
    textAlign: "center",
    padding: 8,
  },
});
