import {
  AI_PROVIDERS,
  type AIMessage,
  type AIProviderId,
  type AIRequest,
} from "@fitnexx/ai";
import { getPrisma } from "@/lib/prisma";

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

export function isServerProvider(value: unknown): value is ServerProvider {
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

export function allowedModels(
  env: NodeJS.ProcessEnv = process.env,
): Set<string> {
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

export function providerKey(
  provider: ServerProvider,
  env: NodeJS.ProcessEnv = process.env,
): string {
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

export async function consumeAIRateLimit(userId: string): Promise<boolean> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 60_000);
  const rows = await getPrisma().$queryRaw<Array<{ id: string }>>`
    UPDATE "user"
    SET
      "aiRequestCount" = CASE
        WHEN "aiWindowAt" IS NULL OR "aiWindowAt" < ${cutoff} THEN 1
        ELSE "aiRequestCount" + 1
      END,
      "aiWindowAt" = CASE
        WHEN "aiWindowAt" IS NULL OR "aiWindowAt" < ${cutoff} THEN ${now}
        ELSE "aiWindowAt"
      END
    WHERE "id" = ${userId}
      AND "isPro" = true
      AND (
        "aiWindowAt" IS NULL
        OR "aiWindowAt" < ${cutoff}
        OR "aiRequestCount" < 20
      )
    RETURNING "id"
  `;
  return rows.length === 1;
}
