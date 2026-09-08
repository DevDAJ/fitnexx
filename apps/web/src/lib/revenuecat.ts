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

export async function getRevenueCatProState(
  userId: string,
  secret: string,
  entitlement: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const response = await fetcher(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`,
    { headers: { Authorization: `Bearer ${secret}` } },
  );
  if (!response.ok) {
    throw new Error(`RevenueCat lookup failed (${response.status}).`);
  }
  const data = (await response.json()) as {
    subscriber?: {
      entitlements?: Record<string, { expires_date?: string | null }>;
    };
  };
  const expires = data.subscriber?.entitlements?.[entitlement]?.expires_date;
  return (
    expires === null ||
    (typeof expires === "string" && new Date(expires) > new Date())
  );
}
