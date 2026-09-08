import {
  AI_PROVIDERS,
  type AIMessage,
  type AIProviderId,
  type AIRequest,
} from "@fitnexx/ai";

const SERVER_PROVIDERS = [
  "openai",
  "anthropic",
  "google",
  "openrouter",
] as const;
type ServerProvider = (typeof SERVER_PROVIDERS)[number];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isServerProvider(value: unknown): value is ServerProvider {
  return SERVER_PROVIDERS.includes(value as ServerProvider);
}

function parseMessages(value: unknown): AIMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw new Error("Messages must contain between 1 and 20 items.");
  }
  return value.map((message) => {
    if (
      !isObject(message) ||
      !["system", "user", "assistant"].includes(String(message.role)) ||
      typeof message.content !== "string" ||
      message.content.length === 0 ||
      message.content.length > 8_000
    ) {
      throw new Error(
        "Each message needs a valid role and 1 to 8,000 characters.",
      );
    }
    return {
      role: message.role as AIMessage["role"],
      content: message.content,
    };
  });
}

function allowedModels(env: NodeJS.ProcessEnv): Set<string> {
  if (env.FITNEXX_AI_MODELS) {
    return new Set(
      env.FITNEXX_AI_MODELS.split(",")
        .map((model) => model.trim())
        .filter(Boolean),
    );
  }
  return new Set(
    AI_PROVIDERS.filter((provider) => provider.id !== "custom").map(
      (provider) => `${provider.id}:${provider.defaultModel}`,
    ),
  );
}

function providerKey(provider: ServerProvider, env: NodeJS.ProcessEnv): string {
  const keys: Record<ServerProvider, string | undefined> = {
    openai: env.OPENAI_API_KEY,
    anthropic: env.ANTHROPIC_API_KEY,
    google: env.GOOGLE_AI_API_KEY,
    openrouter: env.OPENROUTER_API_KEY,
  };
  const key = keys[provider];
  if (!key) throw new Error(`${provider} is not configured on the server.`);
  return key;
}

export function parseServerAIRequest(
  value: unknown,
  env: NodeJS.ProcessEnv = process.env,
): AIRequest {
  if (!isObject(value) || !isServerProvider(value.provider)) {
    throw new Error("Select a supported AI provider.");
  }
  if (typeof value.model !== "string" || !value.model.trim()) {
    throw new Error("Select a model.");
  }
  const provider = value.provider as AIProviderId & ServerProvider;
  const model = value.model.trim();
  if (!allowedModels(env).has(`${provider}:${model}`)) {
    throw new Error("That model is not enabled for Fitnexx Pro.");
  }
  const maxTokens =
    typeof value.maxTokens === "number"
      ? Math.min(2_000, Math.max(1, Math.floor(value.maxTokens)))
      : 800;
  const temperature =
    typeof value.temperature === "number"
      ? Math.min(1, Math.max(0, value.temperature))
      : 0.4;
  return {
    provider,
    model,
    messages: parseMessages(value.messages),
    apiKey: providerKey(provider, env),
    maxTokens,
    temperature,
  };
}
