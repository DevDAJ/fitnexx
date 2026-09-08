import { getPrisma } from "@/lib/prisma";
import { revenueCatProState, verifyRevenueCatWebhook } from "@/lib/revenuecat";

type RevenueCatEvent = {
  type?: string;
  app_user_id?: string;
  entitlement_ids?: string[] | null;
  event_timestamp_ms?: number;
};

export async function POST(request: Request) {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET ?? "";
  const body = await request.text();
  if (
    !verifyRevenueCatWebhook(
      body,
      request.headers.get("x-revenuecat-webhook-signature"),
      secret,
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
  const pro = revenueCatProState(event.type ?? "");
  const entitlement = process.env.REVENUECAT_PRO_ENTITLEMENT ?? "pro";
  if (
    pro === null ||
    !event.app_user_id ||
    !event.entitlement_ids?.includes(entitlement) ||
    !event.event_timestamp_ms
  ) {
    return Response.json({ ok: true });
  }

  const occurredAt = new Date(event.event_timestamp_ms);
  const existing = await getPrisma().user.findUnique({
    where: { id: event.app_user_id },
  });
  if (!existing?.proUpdatedAt || existing.proUpdatedAt < occurredAt) {
    await getPrisma().user.upsert({
      where: { id: event.app_user_id },
      create: { id: event.app_user_id, isPro: pro, proUpdatedAt: occurredAt },
      update: { isPro: pro, proUpdatedAt: occurredAt },
    });
  }
  return Response.json({ ok: true });
}
