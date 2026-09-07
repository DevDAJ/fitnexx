import { Resend } from "resend";

const FROM = process.env.FITNEXX_EMAIL_FROM ?? "Fitnexx <onboarding@resend.dev>";

export async function sendNewSignupEmail(
  name: string,
  email: string | null,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FITNEXX_NOTIFY_EMAIL;
  if (!apiKey || !to) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to,
    subject: "New interest-list signup",
    text: [
      `Name: ${name}`,
      `Email: ${email ?? "not provided"}`,
      `Signed up: ${new Date().toISOString()}`,
    ].join("\n"),
  });
}