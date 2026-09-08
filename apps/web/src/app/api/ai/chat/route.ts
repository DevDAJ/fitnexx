import { chat } from "@fitnexx/ai";
import { consumeAIRateLimit, parseServerAIRequest } from "@/lib/ai-request";
import { getAuthenticatedUser } from "@/lib/auth";
import { BodyTooLargeError, readLimitedBody } from "@/lib/http";
import { getSupabaseAdmin } from "@/lib/supabase";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return Response.json(
      { error: "Sign in to use Fitnexx Pro." },
      { status: 401, headers: NO_STORE },
    );
  }
  const { data: account, error: findError } = await getSupabaseAdmin()
    .from("user")
    .select("isPro")
    .eq("id", user.id)
    .maybeSingle();
  if (findError || !account?.isPro) {
    return Response.json(
      { error: "Fitnexx Pro is required." },
      { status: 403, headers: NO_STORE },
    );
  }
  if (!(await consumeAIRateLimit(user.id))) {
    return Response.json(
      { error: "Too many AI requests. Try again in a minute." },
      { status: 429, headers: NO_STORE },
    );
  }

  try {
    const raw = await readLimitedBody(request, 200_000);
    const result = await chat(parseServerAIRequest(JSON.parse(raw)));
    return Response.json(result, { headers: NO_STORE });
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return Response.json(
        { error: "Request is too large." },
        { status: 413, headers: NO_STORE },
      );
    }
    const message =
      error instanceof Error ? error.message : "AI request failed.";
    return Response.json(
      { error: message },
      { status: 400, headers: NO_STORE },
    );
  }
}
