import type { Metadata } from "next";

import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact | Fitnexx",
  description:
    "Reach the Fitnexx team: questions, feedback, and privacy requests.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            Contact
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Send general questions or feedback about Fitnexx. For GDPR-related
            requests, include your account email so we can verify your identity,
            subject to validation.
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
