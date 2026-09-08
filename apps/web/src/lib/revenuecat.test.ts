import { expect, test } from "bun:test";
import { createHmac } from "node:crypto";

import { revenueCatProState, verifyRevenueCatWebhook } from "./revenuecat";

test("verifies a recent RevenueCat signature", () => {
  const body = '{"event":{"type":"TEST"}}';
  const timestamp = 1_700_000_000;
  const signature = createHmac("sha256", "secret")
    .update(`${timestamp}.${body}`)
    .digest("hex");
  expect(
    verifyRevenueCatWebhook(
      body,
      `t=${timestamp},v1=${signature}`,
      "secret",
      timestamp * 1_000,
    ),
  ).toBe(true);
  expect(
    verifyRevenueCatWebhook(
      body,
      `t=${timestamp},v1=${signature}`,
      "secret",
      (timestamp + 301) * 1_000,
    ),
  ).toBe(false);
});

test("keeps access through cancellation until expiration", () => {
  expect(revenueCatProState("CANCELLATION")).toBeNull();
  expect(revenueCatProState("EXPIRATION")).toBe(false);
  expect(revenueCatProState("RENEWAL")).toBe(true);
});
