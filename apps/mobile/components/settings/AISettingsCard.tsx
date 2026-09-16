import { AI_PROVIDERS, type AIProviderId, type AISettings } from "@fitnexx/ai";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getAIKey, getAIModels, saveAIConfiguration } from "../../lib/ai";
import { storage } from "../../lib/storage";
import { useAppStore } from "../../lib/store";
import { colors } from "../../lib/theme";
import { useAuth } from "../auth/AuthProvider";
import { AppButton, AppTextInput, Card, SectionLabel } from "../shared/ui";
import { Autocomplete } from "./Autocomplete";

const PROVIDERS = AI_PROVIDERS.filter(
  (provider) => provider.id !== "custom",
).map((provider) => ({ label: provider.name, value: provider.id }));

export function AISettingsCard() {
  const router = useRouter();
  const { configured, user, signOut } = useAuth();
  const isPro = useAppStore((state) => state.isPro);
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
  const usingPro = isPro && Boolean(settings.usePro);
  const keyRequest = useRef(0);
  const modelRequest = useRef(0);

  useEffect(() => {
    storage.getAISettings().then(async (saved) => {
      setSettings(saved);
      setApiKey(await getAIKey(saved.provider));
    });
  }, []);

  const chooseProvider = (provider: string) => {
    const request = ++keyRequest.current;
    modelRequest.current += 1;
    const selected = AI_PROVIDERS.find((item) => item.id === provider);
    setModels([]);
    setSettings({
      provider: provider as AIProviderId,
      model: selected?.defaultModel ?? "",
      customUrl: provider === "custom" ? settings.customUrl : undefined,
      usePro: settings.usePro,
    });
    void getAIKey(provider as AIProviderId).then((key) => {
      if (request === keyRequest.current) setApiKey(key);
    });
  };

  const loadModels = async () => {
    const request = ++modelRequest.current;
    setBusy(true);
    try {
      const available = await getAIModels(
        { ...settings, usePro: usingPro },
        apiKey.trim(),
      );
      if (request !== modelRequest.current) return;
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
      if (request !== modelRequest.current) return;
      Alert.alert(
        "Connection failed",
        error instanceof Error ? error.message : "Try again.",
      );
    } finally {
      if (request === modelRequest.current) setBusy(false);
    }
  };

  const save = async () => {
    try {
      await saveAIConfiguration(
        { ...settings, usePro: usingPro },
        apiKey.trim(),
      );
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
      <Card style={{}}>
        <SectionLabel>Account</SectionLabel>
        <Text
          style={{
            color: colors.textSecondary,
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
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.border,
            borderRadius: 10,
            borderWidth: 1,
            opacity: configured ? 1 : 0.45,
            padding: 13,
          }}
        >
          <Text
            style={{ color: colors.brand, fontSize: 14, fontWeight: "700" }}
          >
            {user
              ? "Sign out"
              : configured
                ? "Sign in or create account"
                : "Auth not configured"}
          </Text>
        </TouchableOpacity>
      </Card>

      <Card
        style={{
          gap: 12,
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
            <SectionLabel>AI Provider</SectionLabel>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {usingPro
                ? "Use Fitnexx-managed models."
                : "Use your own key without an account."}
            </Text>
          </View>
          {!usingPro ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() =>
                chooseProvider(
                  settings.provider === "custom" ? "openai" : "custom",
                )
              }
              style={{
                backgroundColor:
                  settings.provider === "custom"
                    ? colors.brand
                    : colors.surfaceRaised,
                borderColor:
                  settings.provider === "custom" ? colors.brand : colors.border,
                borderRadius: 8,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 7,
              }}
            >
              <Text
                style={{ color: colors.text, fontSize: 11, fontWeight: "700" }}
              >
                {settings.provider === "custom" ? "Providers" : "Custom URL"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {isPro ? (
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { label: "Fitnexx Pro", value: true },
              { label: "My API key", value: false },
            ].map((mode) => (
              <TouchableOpacity
                accessibilityRole="button"
                key={mode.label}
                onPress={() => {
                  const defaultProvider = AI_PROVIDERS[0];
                  setSettings({
                    ...settings,
                    ...(mode.value && settings.provider === "custom"
                      ? {
                          provider: defaultProvider.id,
                          model: defaultProvider.defaultModel,
                          customUrl: undefined,
                        }
                      : {}),
                    usePro: mode.value,
                  });
                }}
                style={{
                  alignItems: "center",
                  backgroundColor:
                    usingPro === mode.value
                      ? colors.brand
                      : colors.surfaceRaised,
                  borderRadius: 9,
                  flex: 1,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color:
                      usingPro === mode.value ? colors.onBrand : colors.text,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {settings.provider === "custom" && !usingPro ? (
          <View style={{ gap: 6 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              OpenAI-compatible base URL
            </Text>
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={(customUrl) =>
                setSettings({ ...settings, customUrl })
              }
              placeholder="http://localhost:11434/v1"
              style={{
                borderRadius: 10,
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

        {!usingPro ? (
          <View style={{ gap: 6 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              API key
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setApiKey}
                placeholder={
                  settings.provider === "custom" ? "Optional" : "Required"
                }
                secureTextEntry={!showKey}
                style={{
                  borderRadius: 10,
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
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: 10,
                  justifyContent: "center",
                  paddingHorizontal: 12,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {showKey ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

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
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderRadius: 10,
              borderWidth: 1,
              flex: 1,
              justifyContent: "center",
              padding: 13,
            }}
          >
            {busy ? (
              <ActivityIndicator color={colors.brand} />
            ) : (
              <Text
                style={{ color: colors.brand, fontSize: 14, fontWeight: "700" }}
              >
                Load models
              </Text>
            )}
          </TouchableOpacity>
          <AppButton
            onPress={save}
            style={{
              flex: 1,
            }}
          >
            Save
          </AppButton>
        </View>
      </Card>
    </View>
  );
}
