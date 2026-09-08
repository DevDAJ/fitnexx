import {
  AI_PROVIDERS,
  type AIMessage,
  type AIModel,
  type AIProviderId,
  type AIResponse,
  type AISettings,
  chat,
  listModels,
} from "@fitnexx/ai";
import * as SecureStore from "expo-secure-store";

import { storage } from "./storage";

const keyName = (provider: AIProviderId) => `fitnexx_ai_api_key_${provider}`;

export async function clearAIKeys(): Promise<void> {
  await Promise.all(
    AI_PROVIDERS.map((provider) =>
      SecureStore.deleteItemAsync(keyName(provider.id)),
    ),
  );
}

export async function getAIKey(provider: AIProviderId): Promise<string> {
  return (await SecureStore.getItemAsync(keyName(provider))) ?? "";
}

export async function saveAIConfiguration(
  settings: AISettings,
  apiKey: string,
): Promise<void> {
  await Promise.all([
    storage.saveAISettings(settings),
    apiKey
      ? SecureStore.setItemAsync(keyName(settings.provider), apiKey)
      : SecureStore.deleteItemAsync(keyName(settings.provider)),
  ]);
}

export async function getAIModels(
  settings: AISettings,
  apiKey: string,
): Promise<AIModel[]> {
  return listModels({ ...settings, apiKey });
}

export async function callAIByok(
  messages: AIMessage[],
  options?: { maxTokens?: number; temperature?: number },
): Promise<AIResponse> {
  const settings = await storage.getAISettings();
  const apiKey = await getAIKey(settings.provider);
  return chat({ ...settings, ...options, messages, apiKey });
}
