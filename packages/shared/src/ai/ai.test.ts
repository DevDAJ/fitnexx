import { test, expect } from "bun:test";
import { PROVIDER_ADAPTERS } from "./providers";
import { normalizeScanResult } from "./schema";
import { scanFoodWithProvider } from "./index";
import type { AiProviderConfig } from "./schema";

const baseConfig: AiProviderConfig = {
  provider: "openai-compatible",
  baseUrl: "https://example.com/v1",
  model: "test-model",
  systemPrompt: "return json",
};

function jsonResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as unknown as Response;
}

test("openai-compatible request shape", () => {
  const { url, init } = PROVIDER_ADAPTERS["openai-compatible"].buildRequest(
    baseConfig,
    "BASE64",
    "image/jpeg",
    "lunch",
    "secret",
  );
  expect(url).toBe("https://example.com/v1/chat/completions");
  const headers = init.headers as Record<string, string>;
  expect(headers.Authorization).toBe("Bearer secret");
  const body = JSON.parse(init.body as string);
  expect(body.messages[0].content).toBe("return json");
  expect(body.messages[1].content[1].image_url.url).toBe("data:image/jpeg;base64,BASE64");
  expect(body.response_format.type).toBe("json_object");
});

test("anthropic request shape", () => {
  const { url, init } = PROVIDER_ADAPTERS.anthropic.buildRequest(
    { ...baseConfig, provider: "anthropic" },
    "BASE64",
    "image/png",
    "",
  );
  expect(url).toBe("https://example.com/v1/v1/messages");
  const headers = init.headers as Record<string, string>;
  expect(headers["anthropic-version"]).toBe("2023-06-01");
  const body = JSON.parse(init.body as string);
  expect(body.messages[0].content[0].source.data).toBe("BASE64");
});

test("gemini request shape uses key in url", () => {
  const { url, init } = PROVIDER_ADAPTERS.gemini.buildRequest(
    { ...baseConfig, provider: "gemini" },
    "BASE64",
    "image/jpeg",
    "",
    "k ey",
  );
  expect(url).toContain("generateContent?key=k%20ey");
  const body = JSON.parse(init.body as string);
  expect(body.generationConfig.responseMimeType).toBe("application/json");
});

test("ollama request has images array", () => {
  const { url, init } = PROVIDER_ADAPTERS.ollama.buildRequest(
    { ...baseConfig, provider: "ollama" },
    "BASE64",
    "image/jpeg",
    "",
  );
  expect(url).toBe("https://example.com/v1/api/chat");
  const body = JSON.parse(init.body as string);
  expect(body.messages[1].images).toEqual(["BASE64"]);
});

test("normalizeScanResult parses ingredients and derives totals", () => {
  const raw = JSON.stringify({
    foodName: "Chicken Salad",
    ingredients: [
      { name: "Chicken", weightGrams: 150, protein: 30, fat: 5, calories: 200 },
      { name: "Lettuce", weightGrams: 50, protein: 1, calories: 10 },
    ],
  });
  const result = normalizeScanResult(raw);
  expect(result.foodName).toBe("Chicken Salad");
  expect(result.ingredients).toHaveLength(2);
  expect(result.total.protein).toBe(31);
  expect(result.total.calories).toBe(210);
});

test("normalizeScanResult falls back to flat macros", () => {
  const result = normalizeScanResult({ foodName: "Oatmeal", protein: "10", calories: 150 });
  expect(result.foodName).toBe("Oatmeal");
  expect(result.total.protein).toBe(10);
  expect(result.total.calories).toBe(150);
  expect(result.ingredients).toHaveLength(0);
});

test("scanFoodWithProvider returns normalized result", async () => {
  const fetchFn = async () =>
    jsonResponse({ choices: [{ message: { content: JSON.stringify({ foodName: "Soup", total: { calories: 120 } }) } }] });
  const result = await scanFoodWithProvider(baseConfig, {
    imageBase64: "BASE64",
    mimeType: "image/jpeg",
    fetchFn: fetchFn as typeof fetch,
  });
  expect(result.foodName).toBe("Soup");
  expect(result.total.calories).toBe(120);
});

test("scanFoodWithProvider throws on non-ok response", async () => {
  const fetchFn = async () =>
    ({ ok: false, status: 401, text: async () => "bad key" }) as unknown as Response;
  await expect(
    scanFoodWithProvider(baseConfig, {
      imageBase64: "BASE64",
      mimeType: "image/jpeg",
      fetchFn: fetchFn as typeof fetch,
    }),
  ).rejects.toThrow("Provider request failed (401)");
});
