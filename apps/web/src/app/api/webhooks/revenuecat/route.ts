import { BodyTooLargeError, readLimitedBody } from "@/lib/http";
import {
  getRevenueCatProState,
  verifyRevenueCatWebhook,
} from "@/lib/revenuecat";
import { getSupabaseAdmin } from "@/lib/supabase";

type RevenueCatEvent = {
  app_user_id?: string;
  aliases?: string[];
  original_app_user_id?: string;
  transferred_from?: string[];
  transferred_to?: string[];
};

const USER_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: string;
  try {
    body = await readLimitedBody(request, 100_000);
  } catch (error) {
    const tooLarge = error instanceof BodyTooLargeError;
    return Response.json(
      { error: tooLarge ? "Request is too large." : "Invalid request." },
      { status: tooLarge ? 413 : 400 },
    );
  }

  const signingSecret = process.env.REVENUECAT_WEBHOOK_SECRET ?? "";
  if (
    !verifyRevenueCatWebhook(
      body,
      request.headers.get("x-revenuecat-webhook-signature"),
      signingSecret,
    )
  ) {
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: RevenueCatEvent;
  try {
    event = (JSON.parse(body) as { event?: RevenueCatEvent }).event ?? {};
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const apiKey = process.env.REVENUECAT_SECRET_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "RevenueCat API is not configured." },
      { status: 500 },
    );
  }
  const entitlement = process.env.REVENUECAT_PRO_ENTITLEMENT ?? "pro";
  const userIds = [
    event.app_user_id,
    event.original_app_user_id,
    ...(event.aliases ?? []),
    ...(event.transferred_from ?? []),
    ...(event.transferred_to ?? []),
  ].filter((id): id is string => Boolean(id && USER_ID.test(id)));
  for (const userId of new Set(userIds)) {
    const pro = await getRevenueCatProState(userId, apiKey, entitlement);
    const { error: upsertError } = await getSupabaseAdmin()
      .from("user")
      .upsert(
        { id: userId, isPro: pro, proUpdatedAt: new Date().toISOString() },
        { onConflict: "id" },
      );
    if (upsertError) {
      console.error("[revenuecat] upsert", upsertError);
    }
  }
  return Response.json({ ok: true });
}
