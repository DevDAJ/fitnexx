import { expect, test } from "bun:test";

import { parseServerAIRequest } from "./ai-request";

const env = {
  FITNEXX_AI_MODELS: "openai:gpt-test",
  OPENAI_API_KEY: "secret",
};

test("accepts allowed models and caps output", () => {
  expect(
    parseServerAIRequest(
      {
        provider: "openai",
        model: "gpt-test",
        maxTokens: 99_999,
        messages: [{ role: "user", content: "Suggest a workout" }],
      },
      env,
    ),
  ).toMatchObject({ model: "gpt-test", maxTokens: 2_000, apiKey: "secret" });
});

test("rejects custom URLs and unapproved models", () => {
  expect(() =>
    parseServerAIRequest(
      {
        provider: "custom",
        model: "anything",
        messages: [{ role: "user", content: "Hi" }],
      },
      env,
    ),
  ).toThrow();
  expect(() =>
    parseServerAIRequest(
      {
        provider: "openai",
        model: "expensive",
        messages: [{ role: "user", content: "Hi" }],
      },
      env,
    ),
  ).toThrow();
});
