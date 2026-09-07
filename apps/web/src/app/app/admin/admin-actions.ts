"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeEqual } from "@/lib/admin";

export async function login(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const expected = process.env.FITNEXX_ADMIN_PASSWORD;
  const given = String(formData.get("password") ?? "");
  if (!expected || !safeEqual(given, expected)) {
    return { error: "Invalid password." };
  }
  (await cookies()).set("fitnexx_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  redirect("/app/admin");
}