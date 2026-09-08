import { describe, expect, test } from "bun:test";
import { chat, listModels, summarizeUsage, type UsageRecord } from ".";

function jsonResponse(value: unknown): Promise<Response> {
  return Promise.resolve(Response.json(value));
}

describe("AI providers", () => {
  test("normalizes Google model names", async () => {
    const models = await listModels(
      { provider: "google", apiKey: "test" },
      () =>
        jsonResponse({
          models: [
            {
              name: "models/gemini-test",
              displayName: "Gemini Test",
              supportedGenerationMethods: ["generateContent"],
            },
            {
              name: "models/embedding-test",
              supportedGenerationMethods: ["embedContent"],
            },
          ],
        }),
    );
    expect(models).toEqual([{ id: "gemini-test", name: "Gemini Test" }]);
  });

  test("normalizes Anthropic responses and usage", async () => {
    const result = await chat(
      {
        provider: "anthropic",
        model: "claude-test",
        apiKey: "test",
        messages: [{ role: "user", content: "Hello" }],
      },
      () =>
        jsonResponse({
          content: [{ type: "text", text: "Hi" }],
          usage: { input_tokens: 4, output_tokens: 2 },
        }),
    );
    expect(result).toEqual({
      content: "Hi",
      usage: { promptTokens: 4, completionTokens: 2, totalTokens: 6 },
    });
  });
});

test("summarizes local usage", () => {
  const record: UsageRecord = {
    id: "1",
    timestamp: "2026-09-08T00:00:00.000Z",
    provider: "openai",
    model: "gpt-test",
    promptTokens: 10,
    completionTokens: 5,
    totalTokens: 15,
    durationMs: 100,
  };
  expect(summarizeUsage([record, { ...record, id: "2" }])).toEqual({
    calls: 2,
    promptTokens: 20,
    completionTokens: 10,
    totalTokens: 30,
  });
});
