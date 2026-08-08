import type { ScanQuota, ScanResult } from "@fitnexx/shared";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type ManagedScanResponse = {
  result: ScanResult;
  quota: ScanQuota;
};

type ApiError = Error & { status?: number };

async function authedFetch<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // keep generic message
    }
    const err = new Error(message) as ApiError;
    err.status = res.status;
    throw err;
  }

  return (await res.json()) as T;
}

export function getQuota(token: string): Promise<ScanQuota> {
  return authedFetch<ScanQuota>(token, "/api/scan-quota");
}

export function redeemAd(token: string): Promise<ScanQuota> {
  return authedFetch<ScanQuota>(token, "/api/scan-quota/redeem", {
    method: "POST",
  });
}

export function managedScan(
  token: string,
  args: { imageBase64: string; mimeType: string; context: string },
): Promise<ManagedScanResponse> {
  return authedFetch<ManagedScanResponse>(token, "/api/food-scan", {
    method: "POST",
    body: JSON.stringify(args),
  });
}
