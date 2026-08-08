import * as SecureStore from "expo-secure-store";
import type { ProviderId } from "@fitnexx/shared";

const keyFor = (provider: ProviderId) => `fitnexx-ai-key-${provider}`;

export async function getApiKey(provider: ProviderId): Promise<string | null> {
  return SecureStore.getItemAsync(keyFor(provider));
}

export async function setApiKey(provider: ProviderId, apiKey: string): Promise<void> {
  await SecureStore.setItemAsync(keyFor(provider), apiKey);
}
