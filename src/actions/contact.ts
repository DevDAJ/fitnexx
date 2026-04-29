"use server";

export type ContactFormState =
  | { status: "idle" | "success" }
  | { status: "error"; message: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates and accepts contact inquiries. Logs on the server for now;
 * wire NOTIFY_EMAIL / Resend/etc. later.
 */
export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honey = String(formData.get("company_website") ?? "").trim();
  if (honey.length > 0) {
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 1 || name.length > 200) {
    return {
      status: "error",
      message: "Please enter your name (max 200 characters).",
    };
  }
  if (!isValidEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (message.length < 10 || message.length > 8000) {
    return {
      status: "error",
      message: "Message should be between 10 and 8,000 characters.",
    };
  }

  const line = `[contact] ${email} | ${name}\n${message}`;
  console.info(line);

  return { status: "success" };
}
