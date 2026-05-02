"use client";

import { useActionState } from "react";

import { submitContactForm } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";

const initialState = { status: "idle" as const };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );

  if (state.status === "success") {
    return (
      <p className="text-foreground rounded-lg border bg-muted/40 px-4 py-6 text-center text-sm">
        Thanks, we received your message. We reply from the inbox associated
        with Fitnexx when your request needs a human response.
      </p>
    );
  }

  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -m-px size-px overflow-hidden whitespace-nowrap border-0 p-0"
        aria-hidden
      />

      <div className="space-y-2">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="contact-name"
          name="name"
          required
          maxLength={200}
          autoComplete="name"
          aria-invalid={!!errorMessage}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={!!errorMessage}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={8000}
          rows={6}
          aria-invalid={!!errorMessage}
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 aria-invalid:dark:border-destructive/50 dark:focus-visible:border-destructive/50 aria-invalid:focus-visible:ring-destructive/40 flex min-h-32 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm",
          )}
        />
        <p className="text-muted-foreground text-xs">10–8,000 characters.</p>
      </div>

      {errorMessage ? (
        <p className="text-destructive text-sm" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
