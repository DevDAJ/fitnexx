import { useEffect, useState } from "react";
import { ScrollView, View, Pressable, TextInput } from "react-native";
import {
  useAiSettingsStore,
  PROVIDER_IDS,
  PROVIDER_ADAPTERS,
  DEFAULT_SYSTEM_PROMPT,
} from "@fitnexx/shared";
import type { ProviderId } from "@fitnexx/shared";
import { getApiKey, setApiKey } from "@/lib/secureKeys";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text, MutedText } from "@/components/ui/text";
import { cn } from "@/lib/cn";

const PROVIDER_LABELS: Record<ProviderId, string> = {
  "openai-compatible": "OpenAI-compatible",
  anthropic: "Anthropic",
  gemini: "Gemini",
  ollama: "Ollama",
};

export default function AiSettingsScreen() {
  const { config, setConfig, setProvider } = useAiSettingsStore();
  const [apiKey, setApiKeyState] = useState("");

  useEffect(() => {
    getApiKey(config.provider).then((key) => setApiKeyState(key ?? ""));
  }, [config.provider]);

  const update = <K extends keyof typeof config>(key: K, value: (typeof config)[K]) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Header title="AI Food Scanning" description="Bring your own LLM provider and API key." />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row flex-wrap gap-2">
            {PROVIDER_IDS.map((id) => (
              <Pressable
                key={id}
                onPress={() => setProvider(id)}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  config.provider === id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background",
                )}
              >
                <Text className={cn("text-sm", config.provider === id ? "text-primary" : "text-foreground")}>
                  {PROVIDER_LABELS[id]}
                </Text>
              </Pressable>
            ))}
          </View>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Credentials</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {config.provider !== "ollama" && (
            <View className="gap-1">
              <MutedText>API key</MutedText>
              <Input
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="sk-..."
                value={apiKey}
                onChangeText={(value) => {
                  setApiKeyState(value);
                  setApiKey(config.provider, value);
                }}
              />
            </View>
          )}
          <View className="gap-1">
            <MutedText>Base URL</MutedText>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              value={config.baseUrl}
              onChangeText={(value) => update("baseUrl", value)}
            />
          </View>
          <View className="gap-1">
            <MutedText>Model</MutedText>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              value={config.model}
              onChangeText={(value) => update("model", value)}
            />
          </View>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>System prompt</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <TextInput
            multiline
            className="min-h-40 rounded-lg border border-input bg-background p-3 text-sm text-foreground"
            textAlignVertical="top"
            value={config.systemPrompt}
            onChangeText={(value) => update("systemPrompt", value)}
          />
          <Button
            variant="outline"
            onPress={() => update("systemPrompt", DEFAULT_SYSTEM_PROMPT)}
            title="Reset to default"
          />
        </CardContent>
      </Card>

      <Button
        variant="ghost"
        onPress={() => update("baseUrl", PROVIDER_ADAPTERS[config.provider].defaultBaseUrl)}
        title={`Reset ${PROVIDER_LABELS[config.provider]} defaults`}
      />
    </ScrollView>
  );
}
