import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyRevenueCatWebhook(
  body: string,
  signature: string | null,
  secret: string,
  now = Date.now(),
): boolean {
  if (!signature || !secret) return false;
  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const separator = part.indexOf("=");
      return [part.slice(0, separator), part.slice(separator + 1)];
    }),
  );
  const timestamp = Number(parts.t);
  const expected = parts.v1;
  if (
    !Number.isFinite(timestamp) ||
    !expected ||
    Math.abs(now / 1_000 - timestamp) > 300
  ) {
    return false;
  }
  const actual = createHmac("sha256", secret)
    .update(`${parts.t}.${body}`)
    .digest("hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function revenueCatProState(type: string): boolean | null {
  if (
    [
      "INITIAL_PURCHASE",
      "RENEWAL",
      "UNCANCELLATION",
      "SUBSCRIPTION_EXTENDED",
      "TEMPORARY_ENTITLEMENT_GRANT",
    ].includes(type)
  ) {
    return true;
  }
  if (type === "EXPIRATION") return false;
  return null;
}
