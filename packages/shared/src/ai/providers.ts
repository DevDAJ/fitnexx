import type { AiProviderConfig, ProviderId } from "./schema";

export type ProviderRequest = {
  url: string;
  init: RequestInit;
};

export type ProviderAdapter = {
  defaultBaseUrl: string;
  defaultModel: string;
  buildRequest: (
    config: AiProviderConfig,
    imageBase64: string,
    mimeType: string,
    context: string,
    apiKey?: string,
  ) => ProviderRequest;
  extractText: (response: unknown) => string | null;
};

function joinText(parts: unknown[] | undefined): string | null {
  if (!parts) return null;
  const texts = parts
    .filter((p): p is { type?: string; text?: string } => typeof p === "object" && p !== null)
    .map((p) => p.text ?? "")
    .filter(Boolean);
  return texts.length ? texts.join("") : null;
}

const openAiCompatible: ProviderAdapter = {
  defaultBaseUrl: "https://openrouter.ai/api/v1",
  defaultModel: "meta-llama/llama-3.2-11b-vision-instruct",
  buildRequest: (config, imageBase64, mimeType, context, apiKey) => ({
    url: `${config.baseUrl.replace(/\/$/, "")}/chat/completions`,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 2048,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: config.systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: context || "Analyze this food." },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${imageBase64}` },
              },
            ],
          },
        ],
      }),
    },
  }),
  extractText: (res) => {
    const content = (res as { choices?: Array<{ message?: { content?: unknown } }> })
      ?.choices?.[0]?.message?.content;
    return typeof content === "string" && content.length > 0 ? content : null;
  },
};

const anthropic: ProviderAdapter = {
  defaultBaseUrl: "https://api.anthropic.com",
  defaultModel: "claude-3-5-haiku-latest",
  buildRequest: (config, imageBase64, mimeType, context, apiKey) => ({
    url: `${config.baseUrl.replace(/\/$/, "")}/v1/messages`,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 2048,
        system: config.systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mimeType, data: imageBase64 },
              },
              { type: "text", text: context || "Analyze this food." },
            ],
          },
        ],
      }),
    },
  }),
  extractText: (res) => {
    const content = (res as { content?: Array<{ type?: string; text?: string }> })?.content;
    return joinText(content);
  },
};

const gemini: ProviderAdapter = {
  defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
  defaultModel: "gemini-1.5-flash",
  buildRequest: (config, imageBase64, mimeType, context, apiKey) => ({
    url: `${config.baseUrl.replace(/\/$/, "")}/models/${config.model}:generateContent?key=${encodeURIComponent(apiKey ?? "")}`,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: context || "Analyze this food." },
            ],
          },
        ],
        systemInstruction: { parts: [{ text: config.systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  }),
  extractText: (res) => {
    const parts = (res as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
      ?.candidates?.[0]?.content?.parts;
    return joinText(parts);
  },
};

const ollama: ProviderAdapter = {
  defaultBaseUrl: "http://localhost:11434",
  defaultModel: "llava",
  buildRequest: (config, imageBase64, _mimeType, context) => ({
    url: `${config.baseUrl.replace(/\/$/, "")}/api/chat`,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: config.systemPrompt },
          {
            role: "user",
            content: context || "Analyze this food.",
            images: [imageBase64],
          },
        ],
      }),
    },
  }),
  extractText: (res) => {
    const content = (res as { message?: { content?: unknown } })?.message?.content;
    return typeof content === "string" && content.length > 0 ? content : null;
  },
};

export const PROVIDER_ADAPTERS: Record<ProviderId, ProviderAdapter> = {
  "openai-compatible": openAiCompatible,
  anthropic,
  gemini,
  ollama,
};

export const PROVIDER_IDS = Object.keys(PROVIDER_ADAPTERS) as ProviderId[];
