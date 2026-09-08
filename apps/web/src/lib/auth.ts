import type { User as SupabaseUser } from "@supabase/supabase-js";

import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

export async function getAuthenticatedUser(
  request: Request,
): Promise<SupabaseUser | null> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  const { data, error } = await getSupabase().auth.getUser(
    authorization.slice("Bearer ".length),
  );
  if (error || !data.user) return null;

  const { error: upsertError } = await getSupabaseAdmin()
    .from("user")
    .upsert({ id: data.user.id, email: data.user.email }, { onConflict: "id" });
  if (upsertError) throw upsertError;
  return data.user;
}
