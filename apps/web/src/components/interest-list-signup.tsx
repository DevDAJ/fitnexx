"use client";

import { Button, Card, Text, View, YStack } from "@fitnexx/ui";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { submitInterestList } from "@/actions/interest-list";
import { SubmitButton, TextField } from "@/components/ui/field";

const initialState = { status: "idle" as const };

function InterestListFormBody() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitInterestList,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  if (state.status === "success") {
    return (
      <Text
        color="$color"
        backgroundColor="$card"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius={10}
        padding={16}
        textAlign="center"
        fontSize={14}
      >
        You&apos;re on the list. Thanks for your interest.
      </Text>
    );
  }

  return (
    <form action={formAction}>
      <YStack gap={16}>
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
            id="interest-name"
            name="name"
            required
            maxLength={200}
            autoComplete="name"
          />
        </YStack>

        <YStack gap={8}>
          <Text color="$color" fontSize={14} fontWeight="600">
            Email <Text color="$subtle">{"(optional)"}</Text>
          </Text>
          <TextField
            id="interest-email"
            name="email"
            type="email"
            autoComplete="email"
          />
        </YStack>

        {state.status === "error" ? (
          <Text color="$negative" fontSize={14} role="alert">
            {state.message}
          </Text>
        ) : null}

        <SubmitButton type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Add me to the list"}
        </SubmitButton>
      </YStack>
    </form>
  );
}

export function InterestListSignup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="lg" onPress={() => setOpen(true)}>
        Add my name to the interest list
      </Button>

      {open ? (
        <View
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor="rgba(0,0,0,0.6)"
          alignItems="center"
          justifyContent="center"
          padding={16}
          onPress={() => setOpen(false)}
          style={{ position: "fixed" }}
        >
          <Card
            width="100%"
            maxWidth={420}
            gap={12}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={8}
            >
              <YStack gap={4}>
                <Text color="$color" fontSize={18} fontWeight="700">
                  Interest list
                </Text>
                <Text color="$muted" fontSize={13} lineHeight={20}>
                  We&apos;ll keep your name on file for Fitnexx launch updates.
                  Email is optional but helps us reach you.
                </Text>
              </YStack>
              <Button
                size="sm"
                variant="ghost"
                icon={<X size={16} color="#e5e5e5" />}
                onPress={() => setOpen(false)}
                aria-label="Close"
              />
            </View>

            <InterestListFormBody />
          </Card>
        </View>
      ) : null}
    </>
  );
}
