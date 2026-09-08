export type AIProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "openrouter"
  | "custom";

export type AISettings = {
  provider: AIProviderId;
  model: string;
  customUrl?: string;
  usePro?: boolean;
};

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIModel = {
  id: string;
  name: string;
};

export type AIUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type AIResponse = {
  content: string;
  usage: AIUsage;
};

export type AIRequest = {
  provider: AIProviderId;
  model: string;
  messages: AIMessage[];
  apiKey?: string;
  customUrl?: string;
  maxTokens?: number;
  temperature?: number;
};

export type UsageRecord = AIUsage & {
  id: string;
  timestamp: string;
  provider: AIProviderId;
  model: string;
  durationMs: number;
};

export const AI_PROVIDERS: ReadonlyArray<{
  id: AIProviderId;
  name: string;
  defaultModel: string;
}> = [
  { id: "openai", name: "OpenAI", defaultModel: "gpt-4.1-mini" },
  {
    id: "anthropic",
    name: "Anthropic",
    defaultModel: "claude-sonnet-4-20250514",
  },
  { id: "google", name: "Google Gemini", defaultModel: "gemini-2.5-flash" },
  {
    id: "openrouter",
    name: "OpenRouter",
    defaultModel: "openai/gpt-4.1-mini",
  },
  { id: "custom", name: "Custom URL", defaultModel: "" },
];

const BASE_URLS: Record<Exclude<AIProviderId, "custom">, string> = {
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  google: "https://generativelanguage.googleapis.com/v1beta",
  openrouter: "https://openrouter.ai/api/v1",
};

type ModelPayload = {
  id?: string;
  name?: string;
  displayName?: string;
  supportedGenerationMethods?: string[];
};

type ProviderPayload = {
  error?: string | { message?: string };
  message?: string;
  data?: ModelPayload[];
  models?: ModelPayload[];
  content?: Array<{ type?: string; text?: string }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  choices?: Array<{ message?: { content?: string } }>;
};

function baseUrl(provider: AIProviderId, customUrl?: string): string {
  const value = provider === "custom" ? customUrl?.trim() : BASE_URLS[provider];
  if (!value) throw new Error("Enter a custom API URL.");
  try {
    new URL(value);
  } catch {
    throw new Error("Enter a valid API URL.");
  }
  return value.replace(/\/+$/, "");
}

function authHeaders(provider: AIProviderId, apiKey?: string): HeadersInit {
  if (!apiKey && provider !== "custom") throw new Error("Enter an API key.");
  if (provider === "anthropic") {
    return { "anthropic-version": "2023-06-01", "x-api-key": apiKey ?? "" };
  }
  if (provider === "google") return { "x-goog-api-key": apiKey ?? "" };
  if (!apiKey) return {};
  return { Authorization: `Bearer ${apiKey}` };
}

async function fetchJson(
  url: string,
  init: RequestInit,
  fetcher: typeof fetch,
): Promise<ProviderPayload> {
  const response = await fetcher(url, init);
  const data = (await response.json().catch(() => ({}))) as ProviderPayload;
  if (!response.ok) {
    const providerError =
      typeof data.error === "string" ? data.error : data.error?.message;
    const message =
      providerError ??
      data.message ??
      `AI request failed (${response.status}).`;
    throw new Error(String(message));
  }
  return data;
}

export async function listModels(
  options: Pick<AIRequest, "provider" | "apiKey" | "customUrl">,
  fetcher: typeof fetch = fetch,
): Promise<AIModel[]> {
  const { provider, apiKey, customUrl } = options;
  const data = await fetchJson(
    `${baseUrl(provider, customUrl)}/models`,
    { headers: authHeaders(provider, apiKey) },
    fetcher,
  );
  const models = data.data ?? data.models ?? [];
  return models
    .filter(
      (model) =>
        provider !== "google" ||
        model.supportedGenerationMethods?.includes("generateContent"),
    )
    .map((model) => {
      const id = String(model.id ?? model.name ?? "").replace(/^models\//, "");
      return {
        id,
        name: String(model.displayName ?? model.name ?? model.id ?? id),
      };
    })
    .filter((model) => model.id)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function usage(
  promptTokens = 0,
  completionTokens = 0,
  totalTokens?: number,
): AIUsage {
  return {
    promptTokens,
    completionTokens,
    totalTokens: totalTokens ?? promptTokens + completionTokens,
  };
}

export async function chat(
  request: AIRequest,
  fetcher: typeof fetch = fetch,
): Promise<AIResponse> {
  const {
    provider,
    model,
    messages,
    apiKey,
    customUrl,
    maxTokens = 800,
    temperature = 0.4,
  } = request;
  if (!model.trim()) throw new Error("Select a model.");
  if (!messages.length) throw new Error("Add at least one message.");

  const headers = {
    "Content-Type": "application/json",
    ...authHeaders(provider, apiKey),
  };
  if (provider === "anthropic") {
    const system = messages
      .filter((message) => message.role === "system")
      .map((message) => message.content)
      .join("\n");
    const data = await fetchJson(
      `${baseUrl(provider)}/messages`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          ...(system ? { system } : {}),
          messages: messages.filter((message) => message.role !== "system"),
        }),
      },
      fetcher,
    );
    return {
      content: (data.content ?? [])
        .filter((part: { type?: string }) => part.type === "text")
        .map((part: { text?: string }) => part.text ?? "")
        .join(""),
      usage: usage(data.usage?.input_tokens, data.usage?.output_tokens),
    };
  }

  if (provider === "google") {
    const systemInstruction = messages.find(
      (message) => message.role === "system",
    );
    const data = await fetchJson(
      `${baseUrl(provider)}/models/${encodeURIComponent(model.replace(/^models\//, ""))}:generateContent`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...(systemInstruction
            ? {
                systemInstruction: {
                  parts: [{ text: systemInstruction.content }],
                },
              }
            : {}),
          contents: messages
            .filter((message) => message.role !== "system")
            .map((message) => ({
              role: message.role === "assistant" ? "model" : "user",
              parts: [{ text: message.content }],
            })),
          generationConfig: { maxOutputTokens: maxTokens, temperature },
        }),
      },
      fetcher,
    );
    const metadata = data.usageMetadata ?? {};
    return {
      content:
        data.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text ?? "")
          .join("") ?? "",
      usage: usage(
        metadata.promptTokenCount,
        metadata.candidatesTokenCount,
        metadata.totalTokenCount,
      ),
    };
  }

  const data = await fetchJson(
    `${baseUrl(provider, customUrl)}/chat/completions`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    },
    fetcher,
  );
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    usage: usage(
      data.usage?.prompt_tokens,
      data.usage?.completion_tokens,
      data.usage?.total_tokens,
    ),
  };
}

export function summarizeUsage(records: UsageRecord[]) {
  return records.reduce(
    (summary, record) => ({
      calls: summary.calls + 1,
      promptTokens: summary.promptTokens + record.promptTokens,
      completionTokens: summary.completionTokens + record.completionTokens,
      totalTokens: summary.totalTokens + record.totalTokens,
    }),
    { calls: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 },
  );
}
