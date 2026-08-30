"use client";

import { Text, YStack } from "@fitnexx/ui";
import { useActionState } from "react";
import { submitContactForm } from "@/actions/contact";
import { SubmitButton, TextAreaField, TextField } from "@/components/ui/field";

const initialState = { status: "idle" as const };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );

  if (state.status === "success") {
    return (
      <Text
        color="$color"
        backgroundColor="$card"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius={10}
        padding={24}
        textAlign="center"
        fontSize={14}
      >
        Thanks, we received your message. We reply from the inbox associated
        with Fitnexx when your request needs a human response.
      </Text>
    );
  }

  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <form action={formAction}>
      <YStack gap={20}>
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            border: 0,
          }}
        />

        <YStack gap={8}>
          <Text color="$color" fontSize={14} fontWeight="600">
            Name
          </Text>
          <TextField
            id="contact-name"
            name="name"
            required
            maxLength={200}
            autoComplete="name"
          />
        </YStack>

        <YStack gap={8}>
          <Text color="$color" fontSize={14} fontWeight="600">
            Email
          </Text>
          <TextField
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </YStack>

        <YStack gap={8}>
          <Text color="$color" fontSize={14} fontWeight="600">
            Message
          </Text>
          <TextAreaField
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={8000}
          />
          <Text color="$subtle" fontSize={12}>
            10–8,000 characters.
          </Text>
        </YStack>

        {errorMessage ? (
          <Text color="$negative" fontSize={14} role="alert">
            {errorMessage}
          </Text>
        ) : null}

        <SubmitButton type="submit" disabled={isPending}>
          {isPending ? "Sending…" : "Send message"}
        </SubmitButton>
      </YStack>
    </form>
  );
}
