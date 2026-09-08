import type { User as SupabaseUser } from "@supabase/supabase-js";

import { getPrisma } from "@/lib/prisma";
import { getSupabase } from "@/lib/supabase";

export async function getAuthenticatedUser(
  request: Request,
): Promise<SupabaseUser | null> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  const { data, error } = await getSupabase().auth.getUser(
    authorization.slice("Bearer ".length),
  );
  if (error || !data.user) return null;

  await getPrisma().user.upsert({
    where: { id: data.user.id },
    create: { id: data.user.id, email: data.user.email },
    update: { email: data.user.email },
  });
  return data.user;
}
