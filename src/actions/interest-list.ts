"use server";

import { getPrisma } from "@/utils/prisma";

export type InterestListState =
  | { status: "idle" | "success" }
  | { status: "error"; message: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Records interest-list signups in Postgres via Prisma.
 */
export async function submitInterestList(
  _prev: InterestListState,
  formData: FormData,
): Promise<InterestListState> {
  const honey = String(formData.get("company_website") ?? "").trim();
  if (honey.length > 0) {
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (name.length < 1 || name.length > 200) {
    return {
      status: "error",
      message: "Please enter your name (max 200 characters).",
    };
  }
  if (email.length > 0 && !isValidEmail(email)) {
    return {
      status: "error",
      message: "If you add an email, use a valid address.",
    };
  }

  try {
    await getPrisma().interestListEntry.create({
      data: {
        name,
        email: email.length > 0 ? email : null,
      },
    });
  } catch (err) {
    console.error("[interest-list]", err);
    return {
      status: "error",
      message: "Could not save your signup. Please try again later.",
    };
  }

  return { status: "success" };
}
