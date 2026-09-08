import { listModels } from "@fitnexx/ai";
import { allowedModels, isServerProvider, providerKey } from "@/lib/ai-request";
import { getAuthenticatedUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return Response.json(
      { error: "Sign in to use Fitnexx Pro." },
      { status: 401 },
    );
  }
  const account = await getPrisma().user.findUnique({
    where: { id: user.id },
  });
  if (!account?.isPro) {
    return Response.json(
      { error: "Fitnexx Pro is required." },
      { status: 403 },
    );
  }

  const provider = new URL(request.url).searchParams.get("provider");
  if (!isServerProvider(provider)) {
    return Response.json(
      { error: "Select a supported AI provider." },
      { status: 400 },
    );
  }
  try {
    const enabled = allowedModels();
    const models = await listModels({
      provider,
      apiKey: providerKey(provider),
    });
    return Response.json(
      models.filter((model) => enabled.has(`${provider}:${model.id}`)),
      { headers: { "Cache-Control": "private, max-age=300" } },
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load models.",
      },
      { status: 400 },
    );
  }
}
