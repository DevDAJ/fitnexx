import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPersistenceStorage } from "./persistence";
import { PROVIDER_ADAPTERS } from "../ai/providers";
import { DEFAULT_SYSTEM_PROMPT } from "../ai/prompt";
import type { AiProviderConfig, ProviderId } from "../ai/schema";

const AI_CONFIG_STORAGE_KEY = "fitnexx-ai-config-v1";

function defaultConfig(): AiProviderConfig {
  return {
    provider: "openai-compatible",
    baseUrl: PROVIDER_ADAPTERS["openai-compatible"].defaultBaseUrl,
    model: PROVIDER_ADAPTERS["openai-compatible"].defaultModel,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  };
}

type AiSettingsStore = {
  config: AiProviderConfig;
  setConfig: (config: AiProviderConfig) => void;
  setProvider: (provider: ProviderId) => void;
};

export const useAiSettingsStore = create<AiSettingsStore>()(
  persist(
    (set) => ({
      config: defaultConfig(),
      setConfig: (config) => set({ config }),
      setProvider: (provider) =>
        set((state) => ({
          config: {
            ...state.config,
            provider,
            baseUrl: PROVIDER_ADAPTERS[provider].defaultBaseUrl,
            model: PROVIDER_ADAPTERS[provider].defaultModel,
          },
        })),
    }),
    {
      name: AI_CONFIG_STORAGE_KEY,
      storage: createJSONStorage(() => getPersistenceStorage()),
      partialize: (state) => ({ config: state.config }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<AiSettingsStore>),
        config: { ...defaultConfig(), ...((persisted as Partial<AiSettingsStore>)?.config ?? {}) },
      }),
    },
  ),
);
