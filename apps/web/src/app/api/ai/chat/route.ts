import { chat } from "@fitnexx/ai";
import { parseServerAIRequest } from "@/lib/ai-request";
import { getAuthenticatedUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return Response.json(
      { error: "Sign in to use Fitnexx Pro." },
      { status: 401, headers: NO_STORE },
    );
  }
  const account = await getPrisma().user.findUnique({ where: { id: user.id } });
  if (!account?.isPro) {
    return Response.json(
      { error: "Fitnexx Pro is required." },
      { status: 403, headers: NO_STORE },
    );
  }

  const raw = await request.text();
  if (raw.length > 200_000) {
    return Response.json(
      { error: "Request is too large." },
      { status: 413, headers: NO_STORE },
    );
  }
  try {
    const result = await chat(parseServerAIRequest(JSON.parse(raw)));
    return Response.json(result, { headers: NO_STORE });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI request failed.";
    return Response.json(
      { error: message },
      { status: 400, headers: NO_STORE },
    );
  }
}
