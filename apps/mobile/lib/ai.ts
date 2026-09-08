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
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import { storage } from "./storage";
import { useAppStore } from "./store";
import { requireSupabase } from "./supabase";

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
  if (settings.usePro) {
    return proRequest<AIModel[]>(
      `/api/ai/models?provider=${encodeURIComponent(settings.provider)}`,
    );
  }
  return listModels({ ...settings, apiKey });
}

async function proRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) throw new Error("The Fitnexx API URL is not configured.");
  const { data } = await requireSupabase().auth.getSession();
  if (!data.session) throw new Error("Sign in to use Fitnexx Pro.");
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const result = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };
  if (!response.ok) {
    throw new Error(
      result.error ?? `Fitnexx request failed (${response.status}).`,
    );
  }
  return result;
}

export async function callAI(
  messages: AIMessage[],
  options?: { maxTokens?: number; temperature?: number },
): Promise<AIResponse> {
  const settings = await storage.getAISettings();
  const startedAt = Date.now();
  const response =
    settings.usePro && useAppStore.getState().isPro
      ? await proRequest<AIResponse>("/api/ai/chat", {
          method: "POST",
          body: JSON.stringify({ ...settings, ...options, messages }),
        })
      : await chat({
          ...settings,
          ...options,
          messages,
          apiKey: await getAIKey(settings.provider),
        });
  const records = await storage.getAIUsage();
  await storage.saveAIUsage(
    [
      {
        id: Crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        provider: settings.provider,
        model: settings.model,
        durationMs: Date.now() - startedAt,
        ...response.usage,
      },
      ...records,
    ].slice(0, 500),
  );
  return response;
}
