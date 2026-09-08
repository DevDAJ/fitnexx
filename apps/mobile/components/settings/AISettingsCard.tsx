import { AI_PROVIDERS, type AIProviderId, type AISettings } from "@fitnexx/ai";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getAIKey, getAIModels, saveAIConfiguration } from "../../lib/ai";
import { storage } from "../../lib/storage";
import { useAuth } from "../auth/AuthProvider";
import { Autocomplete } from "./Autocomplete";

const PROVIDERS = AI_PROVIDERS.filter(
  (provider) => provider.id !== "custom",
).map((provider) => ({ label: provider.name, value: provider.id }));

export function AISettingsCard() {
  const router = useRouter();
  const { configured, user, signOut } = useAuth();
  const [settings, setSettings] = useState<AISettings>({
    provider: "openai",
    model: "gpt-4.1-mini",
  });
  const [apiKey, setApiKey] = useState("");
  const [models, setModels] = useState<Array<{ label: string; value: string }>>(
    [],
  );
  const [busy, setBusy] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    storage.getAISettings().then(async (saved) => {
      setSettings(saved);
      setApiKey(await getAIKey(saved.provider));
    });
  }, []);

  const chooseProvider = (provider: string) => {
    const selected = AI_PROVIDERS.find((item) => item.id === provider);
    setModels([]);
    setSettings({
      provider: provider as AIProviderId,
      model: selected?.defaultModel ?? "",
      customUrl: provider === "custom" ? settings.customUrl : undefined,
    });
    void getAIKey(provider as AIProviderId).then(setApiKey);
  };

  const loadModels = async () => {
    setBusy(true);
    try {
      const available = await getAIModels(settings, apiKey.trim());
      setModels(
        available.map((model) => ({ label: model.name, value: model.id })),
      );
      Alert.alert(
        available.length ? "Models loaded" : "Connected",
        available.length
          ? `Found ${available.length} models.`
          : "The API returned no models.",
      );
    } catch (error) {
      Alert.alert(
        "Connection failed",
        error instanceof Error ? error.message : "Try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    try {
      await saveAIConfiguration(settings, apiKey.trim());
      Alert.alert(
        "Saved",
        "Your API key stays in secure storage on this device.",
      );
    } catch (error) {
      Alert.alert(
        "Could not save",
        error instanceof Error ? error.message : "Try again.",
      );
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          backgroundColor: "#161616",
          borderColor: "#222",
          borderRadius: 14,
          borderWidth: 1,
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
          ACCOUNT
        </Text>
        <Text
          style={{
            color: "#666",
            fontSize: 13,
            marginBottom: 12,
            marginTop: 4,
          }}
        >
          {user?.email ?? "An account is only required for Fitnexx Pro."}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!configured}
          onPress={() => (user ? void signOut() : router.push("/auth"))}
          style={{
            alignItems: "center",
            backgroundColor: "#1a1a1a",
            borderColor: "#2a2a2a",
            borderRadius: 10,
            borderWidth: 1,
            opacity: configured ? 1 : 0.45,
            padding: 13,
          }}
        >
          <Text style={{ color: "#60a5fa", fontSize: 14, fontWeight: "700" }}>
            {user
              ? "Sign out"
              : configured
                ? "Sign in or create account"
                : "Auth not configured"}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "#161616",
          borderColor: "#222",
          borderRadius: 14,
          borderWidth: 1,
          gap: 12,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#888",
                fontSize: 12,
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              AI PROVIDER
            </Text>
            <Text style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
              Use your own key without an account.
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() =>
              chooseProvider(
                settings.provider === "custom" ? "openai" : "custom",
              )
            }
            style={{
              backgroundColor:
                settings.provider === "custom" ? "#3b82f6" : "#1a1a1a",
              borderColor:
                settings.provider === "custom" ? "#3b82f6" : "#2a2a2a",
              borderRadius: 8,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 7,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
              {settings.provider === "custom" ? "Providers" : "Custom URL"}
            </Text>
          </TouchableOpacity>
        </View>

        {settings.provider === "custom" ? (
          <View style={{ gap: 6 }}>
            <Text style={{ color: "#888", fontSize: 12 }}>
              OpenAI-compatible base URL
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={(customUrl) =>
                setSettings({ ...settings, customUrl })
              }
              placeholder="http://localhost:11434/v1"
              placeholderTextColor="#666"
              style={{
                backgroundColor: "#101010",
                borderColor: "#2a2a2a",
                borderRadius: 10,
                borderWidth: 1,
                color: "#fff",
                padding: 12,
              }}
              value={settings.customUrl ?? ""}
            />
          </View>
        ) : (
          <Autocomplete
            label="Provider"
            onChange={chooseProvider}
            options={PROVIDERS}
            placeholder="Search providers"
            value={settings.provider}
          />
        )}

        <View style={{ gap: 6 }}>
          <Text style={{ color: "#888", fontSize: 12 }}>API key</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setApiKey}
              placeholder={
                settings.provider === "custom" ? "Optional" : "Required"
              }
              placeholderTextColor="#666"
              secureTextEntry={!showKey}
              style={{
                backgroundColor: "#101010",
                borderColor: "#2a2a2a",
                borderRadius: 10,
                borderWidth: 1,
                color: "#fff",
                flex: 1,
                padding: 12,
              }}
              value={apiKey}
            />
            <TouchableOpacity
              accessibilityLabel={showKey ? "Hide API key" : "Show API key"}
              accessibilityRole="button"
              onPress={() => setShowKey(!showKey)}
              style={{
                alignItems: "center",
                backgroundColor: "#1a1a1a",
                borderRadius: 10,
                justifyContent: "center",
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ color: "#888", fontSize: 12 }}>
                {showKey ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Autocomplete
          label="Model"
          onChange={(model) => setSettings({ ...settings, model })}
          options={models}
          placeholder={settings.model || "Load models first"}
          value={settings.model}
        />

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={busy}
            onPress={loadModels}
            style={{
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              borderColor: "#2a2a2a",
              borderRadius: 10,
              borderWidth: 1,
              flex: 1,
              justifyContent: "center",
              padding: 13,
            }}
          >
            {busy ? (
              <ActivityIndicator color="#60a5fa" />
            ) : (
              <Text
                style={{ color: "#60a5fa", fontSize: 14, fontWeight: "700" }}
              >
                Load models
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={save}
            style={{
              alignItems: "center",
              backgroundColor: "#3b82f6",
              borderRadius: 10,
              flex: 1,
              justifyContent: "center",
              padding: 13,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
